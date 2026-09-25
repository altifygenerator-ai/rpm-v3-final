import { Resend } from "resend";
import { leadDestinationEmail, resendFrom } from "@/data/site";
import { analyzeLead } from "@/lib/lead-intelligence";
import { createMatchesAndNotify } from "@/lib/lead-matching";
import { cleanText, DEFAULT_MAX_UNLOCKS } from "@/lib/marketplace";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSiteUrl } from "@/lib/site-url";
import { createHash } from "node:crypto";
import { verifyTurnstile } from "@/lib/turnstile";

export const runtime = "nodejs";

type RateBucket = { count: number; resetAt: number };
const rateBuckets = new Map<string, RateBucket>();
const RATE_WINDOW_MS = 15 * 60 * 1000;
const RATE_MAX = 5;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getClientIp(request: Request) {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-vercel-forwarded-for") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

function rateLimited(ip: string) {
  const now = Date.now();
  const current = rateBuckets.get(ip);
  if (!current || current.resetAt <= now) {
    rateBuckets.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  current.count += 1;
  return current.count > RATE_MAX;
}

function suspiciousText(values: string[]) {
  const text = values.join(" ").toLowerCase();
  const urlCount = (text.match(/https?:\/\//g) || []).length;
  return (
    urlCount > 2 ||
    /(.)\1{11,}/.test(text) ||
    /(crypto investment|guest post|seo package|backlinks for sale|casino traffic|telegram promotion)/i.test(text)
  );
}

function leadExpiry(timeline: string) {
  const days = /as soon|soon|week/i.test(timeline)
    ? 7
    : /planning|3 month|1.?3/i.test(timeline)
      ? 21
      : 14;
  return new Date(Date.now() + days * 86400000).toISOString();
}

function extractCity(area: string) {
  if (/elsewhere in arkansas/i.test(area)) return null;
  return area.split(",")[0]?.trim().slice(0, 100) || null;
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    if (rateLimited(ip)) {
      return Response.json(
        { success: false, error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const companyWebsite = cleanText(body.companyWebsite, 200);
    if (companyWebsite) {
      return Response.json({ success: true, leadId: "received" });
    }

    const startedAt = Number(body.startedAt || 0);
    const elapsed = Date.now() - startedAt;
    if (!startedAt || elapsed < 1500 || elapsed > 6 * 60 * 60 * 1000) {
      return Response.json(
        { success: false, error: "Please reload the form and try again." },
        { status: 400 }
      );
    }

    const name = cleanText(body.name, 80);
    const phone = cleanText(body.phone, 30);
    const email = cleanText(body.email, 120);
    const area = cleanText(body.area, 120);
    const service = cleanText(body.service, 120);
    const timeline = cleanText(body.timeline, 100);
    const propertySize = cleanText(body.propertySize, 100);
    const message = cleanText(body.message, 1800);
    const source = cleanText(body.source, 40) || "form";
    const landingPage = cleanText(body.landingPage, 500);
    const referrer = cleanText(body.referrer, 500);
    const utmSource = cleanText(body.utmSource, 120);
    const utmMedium = cleanText(body.utmMedium, 120);
    const utmCampaign = cleanText(body.utmCampaign, 160);
    const utmTerm = cleanText(body.utmTerm, 160);
    const utmContent = cleanText(body.utmContent, 160);
    const turnstileToken = cleanText(body.turnstileToken, 3000);

    if (!name || !phone || !area || !service || message.length < 10) {
      return Response.json(
        { success: false, error: "Name, phone, property area, work type, and job details are required." },
        { status: 400 }
      );
    }

    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length < 7 || phoneDigits.length > 15) {
      return Response.json({ success: false, error: "Please enter a valid phone number." }, { status: 400 });
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ success: false, error: "Please enter a valid email address." }, { status: 400 });
    }
    if (suspiciousText([name, email, area, service, timeline, propertySize, message])) {
      return Response.json({ success: false, error: "The request could not be accepted." }, { status: 400 });
    }

    const turnstile = await verifyTurnstile(turnstileToken, ip);
    if (!turnstile.ok) {
      return Response.json(
        {
          success: false,
          error: turnstile.configurationError
            ? "Verification is not configured on this environment yet."
            : "Verification failed. Please try again.",
        },
        { status: turnstile.configurationError ? 503 : 400 }
      );
    }

    const intelligence = await analyzeLead({
      service,
      message,
      area,
      timeline,
      propertySize,
      email,
    });

    const publicCode =
      "ALP-" +
      Date.now().toString(36).toUpperCase() +
      "-" +
      crypto.randomUUID().slice(0, 5).toUpperCase();

    const attribution = {
      landingPage,
      referrer,
      utmSource,
      utmMedium,
      utmCampaign,
      utmTerm,
      utmContent,
      source,
    };

    const admin = createAdminClient();
    const { data: lead, error: insertError } = await admin
      .from("leads")
      .insert({
        public_code: publicCode,
        source,
        customer_name: name,
        customer_phone: phone,
        customer_email: email || null,
        area,
        city: extractCity(area),
        state: "Arkansas",
        service_slug: intelligence.serviceSlug,
        original_service: service,
        description: message,
        ai_summary: intelligence.summary,
        timeline: timeline || null,
        property_size: propertySize || null,
        quality_score: intelligence.qualityScore,
        quality_band: intelligence.qualityBand,
        lead_price_cents: intelligence.leadPriceCents,
        marketplace_status: "available",
        marketplace_enabled: true,
        max_paid_unlocks: DEFAULT_MAX_UNLOCKS,
        unlimited_unlocks: false,
        expires_at: leadExpiry(timeline),
        ai_metadata: intelligence.aiMetadata,
        attribution,
      })
      .select("id,public_code,area,city,county,service_slug,ai_summary,timeline,property_size,quality_band,lead_price_cents,is_test")
      .single();

    if (insertError || !lead) {
      console.error("Lead database insert failed", insertError);
      return Response.json(
        { success: false, error: "We could not save the project details. Please try again." },
        { status: 500 }
      );
    }

    await admin.from("lead_events").insert({
      lead_id: lead.id,
      event_type: "lead_created",
      metadata: {
        source,
        quality_score: intelligence.qualityScore,
        quality_band: intelligence.qualityBand,
        lead_price_cents: intelligence.leadPriceCents,
        service_slug: intelligence.serviceSlug,
      },
    });

    let customerProjectUrl: string | null = null;

    if (email) {
      const projectToken = `${crypto.randomUUID()}${crypto.randomUUID()}`.replace(/-/g, "");
      const projectTokenHash = createHash("sha256").update(projectToken).digest("hex");

      const { error: accessError } = await admin
        .from("customer_project_access")
        .upsert({
          lead_id: lead.id,
          token_hash: projectTokenHash,
          customer_email: email,
          expires_at: new Date(Date.now() + 180 * 86400000).toISOString(),
        });

      if (accessError) {
        console.error("Customer project access token could not be stored", accessError);
      } else {
        customerProjectUrl = `${getSiteUrl()}/project/${projectToken}`;
      }
    }

    const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
    if (resend) {
      const attributionRows = [
        ["Landing page", landingPage],
        ["Referrer", referrer],
        ["UTM source", utmSource],
        ["UTM medium", utmMedium],
        ["UTM campaign", utmCampaign],
      ].filter(([, value]) => value);

      const html = `
        <div style="font-family:Arial,sans-serif;color:#171a1d;max-width:720px;margin:0 auto">
          <div style="background:#171a1d;color:#fff;padding:22px 26px;border-top:7px solid #c64e32">
            <div style="font-size:12px;letter-spacing:.14em;color:#cbd1d5">ARKANSAS LAND PROS</div>
            <h1 style="font-size:24px;margin:7px 0 0">New property lead</h1>
          </div>
          <div style="border:1px solid #d7dce0;border-top:0;padding:26px">
            <p><strong>Lead ID:</strong> ${escapeHtml(publicCode)}</p>
            <p><strong>Name:</strong> ${escapeHtml(name)}</p>
            <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
            ${email ? `<p><strong>Email:</strong> ${escapeHtml(email)}</p>` : ""}
            <p><strong>Area:</strong> ${escapeHtml(area)}</p>
            <p><strong>Classified as:</strong> ${escapeHtml(intelligence.serviceSlug.replace(/-/g, " "))}</p>
            ${timeline ? `<p><strong>Timing:</strong> ${escapeHtml(timeline)}</p>` : ""}
            ${propertySize ? `<p><strong>Rough size:</strong> ${escapeHtml(propertySize)}</p>` : ""}
            <p><strong>AI summary:</strong> ${escapeHtml(intelligence.summary)}</p>
            <p><strong>Quality:</strong> ${intelligence.qualityBand} (${intelligence.qualityScore}/100)</p>
            <p><strong>Marketplace price:</strong> $${(intelligence.leadPriceCents / 100).toFixed(2)}</p>
            <p><strong>Full homeowner notes:</strong></p>
            <div style="background:#f2f4f5;border-left:4px solid #c64e32;padding:14px 16px;white-space:pre-wrap">${escapeHtml(message)}</div>
            ${
              attributionRows.length
                ? `<hr style="border:0;border-top:1px solid #d7dce0;margin:22px 0" />
                   ${attributionRows
                     .map(([label, value]) => `<p style="font-size:13px"><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`)
                     .join("")}`
                : ""
            }
          </div>
        </div>
      `;

      const emailResult = await resend.emails.send({
        from: resendFrom,
        to: [leadDestinationEmail],
        ...(email ? { replyTo: email } : {}),
        subject: `[ALP] ${intelligence.serviceSlug.replace(/-/g, " ")} — ${area} — ${name}`,
        html,
        headers: { "X-Entity-Ref-ID": publicCode },
      });

      if (!emailResult.error) {
        await admin
          .from("leads")
          .update({ red_dirt_copy_sent_at: new Date().toISOString() })
          .eq("id", lead.id);
        await admin.from("lead_events").insert({
          lead_id: lead.id,
          event_type: "red_dirt_email_sent",
        });
      } else {
        console.error("Red Dirt lead email failed", emailResult.error);
      }

      if (email && customerProjectUrl) {
        const customerEmail = await resend.emails.send({
          from:
            process.env.PROJECT_FROM_EMAIL ||
            process.env.RESEND_FROM_EMAIL ||
            "Arkansas Land Pros <leads@arkansaslandpros.com>",
          to: [email],
          subject: `We received your Arkansas Land Pros project — ${publicCode}`,
          html: `
            <div style="font-family:Arial,sans-serif;color:#171a1d;max-width:660px;margin:0 auto">
              <div style="background:#171a1d;color:#fff;padding:22px 26px;border-top:7px solid #c64e32">
                <div style="font-size:12px;letter-spacing:.14em;color:#f0b4a5">ARKANSAS LAND PROS</div>
                <h1 style="font-size:24px;margin:7px 0 0">We got your project details</h1>
              </div>
              <div style="border:1px solid #d7dce0;border-top:0;padding:26px">
                <p><strong>Reference:</strong> ${escapeHtml(publicCode)}</p>
                <p><strong>Project:</strong> ${escapeHtml(intelligence.summary)}</p>
                <p><strong>Area:</strong> ${escapeHtml(area)}</p>
                <p>We may share the project with independent service providers that fit the work and location so they can decide whether to follow up.</p>
                <p style="margin:24px 0">
                  <a href="${customerProjectUrl}" style="background:#c64e32;color:#fff;text-decoration:none;padding:12px 16px;display:inline-block;font-weight:bold">
                    View or update my project
                  </a>
                </p>
                <p style="font-size:13px;color:#68737a">Use that private link later to tell us you are still looking, put the project on hold, confirm who you hired, or close the project.</p>
              </div>
            </div>
          `,
        });

        if (customerEmail.error) {
          console.error("Customer project confirmation email failed", customerEmail.error);
        } else {
          await admin.from("lead_events").insert({
            lead_id: lead.id,
            event_type: "customer_confirmation_sent",
          });
        }
      }
    } else {
      console.error("RESEND_API_KEY missing; lead stored but notification emails were not sent.");
    }

    try {
      await createMatchesAndNotify(lead);
    } catch (matchError) {
      console.error("Lead matching/notification failed", matchError);
    }

    return Response.json({ success: true, leadId: publicCode });
  } catch (error) {
    console.error("Lead intake error", error);
    return Response.json({ success: false, error: "The request could not be sent." }, { status: 500 });
  }
}

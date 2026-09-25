import { Resend } from "resend";
import { leadDestinationEmail, resendFrom } from "@/data/site";

export const runtime = "nodejs";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

type RateBucket = {
  count: number;
  resetAt: number;
};

const rateBuckets = new Map<string, RateBucket>();
const RATE_WINDOW_MS = 15 * 60 * 1000;
const RATE_MAX = 5;

function clean(value: unknown, max = 500) {
  return String(value ?? "")
    .replace(/\u0000/g, "")
    .trim()
    .slice(0, max);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getClientIp(request: Request) {
  const headers = request.headers;
  return (
    headers.get("cf-connecting-ip") ||
    headers.get("x-vercel-forwarded-for") ||
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
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
  rateBuckets.set(ip, current);
  return current.count > RATE_MAX;
}

function suspiciousText(values: string[]) {
  const text = values.join(" ").toLowerCase();
  const urlCount = (text.match(/https?:\/\//g) || []).length;
  const repeated = /(.)\1{11,}/.test(text);
  const commonSpam =
    /(crypto investment|guest post|seo package|backlinks for sale|casino traffic|telegram promotion)/i.test(
      text
    );

  return urlCount > 2 || repeated || commonSpam;
}

async function verifyTurnstile(token: string, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    return {
      ok: false,
      configurationError: true,
      errors: ["TURNSTILE_SECRET_KEY missing"],
    };
  }

  if (!token) {
    return { ok: false, configurationError: false, errors: ["missing-input-response"] };
  }

  const form = new FormData();
  form.set("secret", secret);
  form.set("response", token);
  if (ip !== "unknown") form.set("remoteip", ip);

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: form,
        cache: "no-store",
      }
    );

    const result = (await response.json()) as {
      success?: boolean;
      "error-codes"?: string[];
    };

    return {
      ok: Boolean(result.success),
      configurationError: false,
      errors: result["error-codes"] || [],
    };
  } catch {
    return {
      ok: false,
      configurationError: false,
      errors: ["verification-request-failed"],
    };
  }
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

    const companyWebsite = clean(body.companyWebsite, 200);
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

    const name = clean(body.name, 80);
    const phone = clean(body.phone, 30);
    const email = clean(body.email, 120);
    const area = clean(body.area, 120);
    const service = clean(body.service, 120);
    const timeline = clean(body.timeline, 100);
    const propertySize = clean(body.propertySize, 100);
    const message = clean(body.message, 1800);
    const source = clean(body.source, 40) || "form";
    const landingPage = clean(body.landingPage, 500);
    const referrer = clean(body.referrer, 500);
    const utmSource = clean(body.utmSource, 120);
    const utmMedium = clean(body.utmMedium, 120);
    const utmCampaign = clean(body.utmCampaign, 160);
    const utmTerm = clean(body.utmTerm, 160);
    const utmContent = clean(body.utmContent, 160);
    const turnstileToken = clean(body.turnstileToken, 3000);

    if (!name || !phone || !area || !service || message.length < 10) {
      return Response.json(
        {
          success: false,
          error: "Name, phone, property area, work type, and job details are required.",
        },
        { status: 400 }
      );
    }

    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length < 7 || phoneDigits.length > 15) {
      return Response.json(
        { success: false, error: "Please enter a valid phone number." },
        { status: 400 }
      );
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (
      suspiciousText([
        name,
        email,
        area,
        service,
        timeline,
        propertySize,
        message,
      ])
    ) {
      return Response.json(
        { success: false, error: "The request could not be accepted." },
        { status: 400 }
      );
    }

    const turnstile = await verifyTurnstile(turnstileToken, ip);

    if (!turnstile.ok) {
      if (turnstile.configurationError) {
        console.error("Turnstile configuration error", turnstile.errors);
        return Response.json(
          {
            success: false,
            error: "Verification is not configured on this environment yet.",
          },
          { status: 503 }
        );
      }

      return Response.json(
        {
          success: false,
          error: "Verification failed. Please try again.",
        },
        { status: 400 }
      );
    }

    if (!resend) {
      console.error("RESEND_API_KEY is missing; lead email was not sent.");
      return Response.json(
        {
          success: false,
          error: "Lead delivery is not configured on this environment yet.",
        },
        { status: 503 }
      );
    }

    const leadId =
      "ALP-" +
      Date.now().toString(36).toUpperCase() +
      "-" +
      crypto.randomUUID().slice(0, 4).toUpperCase();

    const attributionRows = [
      ["Landing page", landingPage],
      ["Referrer", referrer],
      ["UTM source", utmSource],
      ["UTM medium", utmMedium],
      ["UTM campaign", utmCampaign],
      ["UTM term", utmTerm],
      ["UTM content", utmContent],
    ].filter(([, value]) => value);

    const html = `
      <div style="font-family:Arial,sans-serif;color:#171a1d;max-width:720px;margin:0 auto">
        <div style="background:#171a1d;color:#fff;padding:22px 26px;border-top:7px solid #c64e32">
          <div style="font-size:12px;letter-spacing:.14em;color:#cbd1d5">ARKANSAS LAND PROS</div>
          <h1 style="font-size:24px;margin:7px 0 0">New land-service lead</h1>
        </div>
        <div style="border:1px solid #d7dce0;border-top:0;padding:26px">
          <p><strong>Lead ID:</strong> ${escapeHtml(leadId)}</p>
          <p><strong>Source:</strong> ${escapeHtml(source)}</p>
          <hr style="border:0;border-top:1px solid #d7dce0;margin:22px 0" />
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
          ${email ? `<p><strong>Email:</strong> ${escapeHtml(email)}</p>` : ""}
          <p><strong>Property area:</strong> ${escapeHtml(area)}</p>
          <p><strong>Work requested:</strong> ${escapeHtml(service)}</p>
          ${timeline ? `<p><strong>Timing:</strong> ${escapeHtml(timeline)}</p>` : ""}
          ${propertySize ? `<p><strong>Rough size:</strong> ${escapeHtml(propertySize)}</p>` : ""}
          <p><strong>Job details:</strong></p>
          <div style="background:#f2f4f5;border-left:4px solid #c64e32;padding:14px 16px;white-space:pre-wrap">${escapeHtml(message)}</div>
          ${
            attributionRows.length
              ? `<hr style="border:0;border-top:1px solid #d7dce0;margin:22px 0" />
                 <p style="font-size:12px;letter-spacing:.1em;color:#66727c"><strong>ATTRIBUTION</strong></p>
                 ${attributionRows
                   .map(
                     ([label, value]) =>
                       `<p style="font-size:13px"><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`
                   )
                   .join("")}`
              : ""
          }
        </div>
      </div>
    `;

    const result = await resend.emails.send({
      from: resendFrom,
      to: [leadDestinationEmail],
      ...(email ? { replyTo: email } : {}),
      subject: `[Arkansas Land Pros] ${service} lead — ${area} — ${name}`,
      html,
      text: [
        `Arkansas Land Pros lead ${leadId}`,
        `Source: ${source}`,
        `Name: ${name}`,
        `Phone: ${phone}`,
        email ? `Email: ${email}` : "",
        `Area: ${area}`,
        `Work: ${service}`,
        timeline ? `Timing: ${timeline}` : "",
        propertySize ? `Rough size: ${propertySize}` : "",
        "",
        message,
        "",
        landingPage ? `Landing page: ${landingPage}` : "",
        referrer ? `Referrer: ${referrer}` : "",
        utmSource ? `UTM source: ${utmSource}` : "",
        utmMedium ? `UTM medium: ${utmMedium}` : "",
        utmCampaign ? `UTM campaign: ${utmCampaign}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
      headers: {
        "X-Entity-Ref-ID": leadId,
      },
    });

    if (result.error) {
      console.error("Resend lead delivery error", result.error);
      return Response.json(
        { success: false, error: "The request could not be delivered." },
        { status: 502 }
      );
    }

    console.info("Arkansas Land Pros lead delivered", {
      leadId,
      source,
      service,
      area,
    });

    return Response.json({ success: true, leadId });
  } catch (error) {
    console.error("Lead intake error", error);
    return Response.json(
      { success: false, error: "The request could not be sent." },
      { status: 500 }
    );
  }
}

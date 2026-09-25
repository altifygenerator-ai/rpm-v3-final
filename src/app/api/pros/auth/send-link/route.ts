import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSiteUrl } from "@/lib/site-url";
import { cleanText } from "@/lib/marketplace";
import { verifyTurnstile } from "@/lib/turnstile";

export const runtime = "nodejs";

const buckets = new Map<string, { count: number; resetAt: number }>();

function clientIp(request: Request) {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-vercel-forwarded-for") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

function limited(ip: string) {
  const now = Date.now();
  const current = buckets.get(ip);
  if (!current || current.resetAt <= now) {
    buckets.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return false;
  }
  current.count += 1;
  return current.count > 6;
}

export async function POST(request: Request) {
  try {
    const ip = clientIp(request);
    if (limited(ip)) {
      return Response.json({ success: false, error: "Too many sign-in requests. Try again later." }, { status: 429 });
    }

    const body = await request.json();
    const email = cleanText(body.email, 160).toLowerCase();
    const businessName = cleanText(body.businessName, 120);
    const contactName = cleanText(body.contactName, 100);
    const mode = body.mode === "join" ? "join" : "signin";
    const turnstileToken = cleanText(body.turnstileToken, 3000);
    const termsAccepted = body.termsAccepted === true;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ success: false, error: "Enter a valid email address." }, { status: 400 });
    }
    if (mode === "join" && !businessName) {
      return Response.json({ success: false, error: "Business name is required." }, { status: 400 });
    }

    if (mode === "join" && !termsAccepted) {
      return Response.json(
        { success: false, error: "Please agree to the marketplace terms before joining." },
        { status: 400 }
      );
    }

    const verification = await verifyTurnstile(turnstileToken, ip);
    if (!verification.ok) {
      return Response.json(
        {
          success: false,
          error: verification.configurationError
            ? "Account verification is not configured yet."
            : "Verification failed. Please try again.",
        },
        { status: verification.configurationError ? 503 : 400 }
      );
    }

    const admin = createAdminClient();

    if (mode === "join") {
      const existing = await admin
        .from("contractor_profiles")
        .select("id,user_id")
        .eq("email", email)
        .maybeSingle();

      if (!existing.data) {
        const { error: createError } = await admin.auth.admin.createUser({
          email,
          email_confirm: true,
          user_metadata: { business_name: businessName, contact_name: contactName },
        });
        if (createError && !/already/i.test(createError.message)) {
          throw createError;
        }
      } else if (!existing.data.user_id) {
        const { error: createError } = await admin.auth.admin.createUser({
          email,
          email_confirm: true,
          user_metadata: { business_name: businessName, contact_name: contactName },
        });
        if (createError && !/already/i.test(createError.message)) {
          throw createError;
        }
      }
    } else {
      const { data: existing } = await admin
        .from("contractor_profiles")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      if (!existing) {
        return Response.json(
          { success: false, error: "No contractor account was found for that email. Join free first." },
          { status: 404 }
        );
      }

      const { data: profile } = await admin
        .from("contractor_profiles")
        .select("user_id")
        .eq("email", email)
        .maybeSingle();

      if (!profile?.user_id) {
        const { error: createError } = await admin.auth.admin.createUser({
          email,
          email_confirm: true,
          user_metadata: { business_name: businessName || "Arkansas Land Pro", contact_name: contactName },
        });
        if (createError && !/already/i.test(createError.message)) {
          throw createError;
        }
      }
    }

    const { data: generated, error: linkError } = await admin.auth.admin.generateLink({
      type: "magiclink",
      email,
    });
    if (linkError || !generated.properties?.hashed_token) {
      throw linkError || new Error("Unable to create sign-in link.");
    }

    const nextPath = mode === "join" ? "/pro/onboarding" : "/pro/dashboard";
    const loginUrl = new URL("/auth/confirm", getSiteUrl());
    loginUrl.searchParams.set("token_hash", generated.properties.hashed_token);
    loginUrl.searchParams.set("type", "magiclink");
    loginUrl.searchParams.set("next", nextPath);

    const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
    if (!resend) {
      return Response.json({ success: false, error: "Account email delivery is not configured yet." }, { status: 503 });
    }

    const emailResult = await resend.emails.send({
      from:
        process.env.ACCOUNTS_FROM_EMAIL ||
        "Arkansas Land Pros <accounts@arkansaslandpros.com>",
      to: [email],
      subject: mode === "join" ? "Finish setting up your Arkansas Land Pros profile" : "Your Arkansas Land Pros sign-in link",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;color:#171a1d">
          <div style="background:#171a1d;color:#fff;padding:22px;border-top:7px solid #c64e32">
            <div style="font-size:12px;letter-spacing:.12em;color:#f0b4a5">ARKANSAS LAND PROS</div>
            <h1 style="font-size:24px;margin:6px 0 0">${mode === "join" ? "Finish your contractor profile" : "Sign in to your contractor account"}</h1>
          </div>
          <div style="border:1px solid #d5dadd;border-top:0;padding:22px">
            <p>This secure link signs you in without a password.</p>
            <p><a href="${loginUrl.toString()}" style="background:#c64e32;color:#fff;text-decoration:none;padding:12px 16px;display:inline-block;font-weight:bold">Continue to Arkansas Land Pros</a></p>
            <p style="font-size:12px;color:#68737a">If you did not request this email, you can ignore it.</p>
          </div>
        </div>
      `,
    });

    if (emailResult.error) {
      console.error("Contractor auth email failed", emailResult.error);
      return Response.json(
        { success: false, error: "We could not deliver the sign-in email. Please try again." },
        { status: 502 }
      );
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Contractor auth link error", error);
    return Response.json({ success: false, error: "We could not send the sign-in link." }, { status: 500 });
  }
}

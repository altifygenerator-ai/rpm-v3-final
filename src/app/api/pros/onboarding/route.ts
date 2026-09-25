import { getContractorContext } from "@/lib/contractor-auth";
import { allowedServiceSlugs, cleanText } from "@/lib/marketplace";
import { createAdminClient } from "@/lib/supabase/admin";
import { refreshMatchesForContractor } from "@/lib/lead-matching";

function normalizeHttpUrl(value: string, httpsOnly = false) {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (httpsOnly ? url.protocol !== "https:" : !["http:", "https:"].includes(url.protocol)) {
      return undefined;
    }
    return url.toString();
  } catch {
    return undefined;
  }
}

function normalizeFacebookUrl(value: string) {
  const normalized = normalizeHttpUrl(value, true);
  if (!normalized) return normalized;
  const hostname = new URL(normalized).hostname.toLowerCase().replace(/^www\./, "");
  return hostname === "facebook.com" || hostname.endsWith(".facebook.com")
    ? normalized
    : undefined;
}

export async function POST(request: Request) {
  const context = await getContractorContext();
  if (!context) {
    return Response.json({ success: false, error: "Sign in required." }, { status: 401 });
  }

  const body = await request.json();
  const businessName = cleanText(body.businessName, 120);
  const contactName = cleanText(body.contactName, 100);
  const phone = cleanText(body.phone, 40);
  const websiteUrlInput = cleanText(body.websiteUrl, 240);
  const facebookUrlInput = cleanText(body.facebookUrl, 240);
  const description = cleanText(body.description, 1200);
  const logoUrlInput = cleanText(body.logoUrl, 500);
  const websiteUrl = normalizeHttpUrl(websiteUrlInput);
  const facebookUrl = normalizeFacebookUrl(facebookUrlInput);
  const logoUrl = normalizeHttpUrl(logoUrlInput, true);
  const city = cleanText(body.city, 100);
  const zip = cleanText(body.zip, 20);
  const maxLeadPriceRaw = cleanText(body.maxLeadPriceDollars, 20);
  const maxLeadPriceDollars = maxLeadPriceRaw ? Number(maxLeadPriceRaw) : null;
  const emailNotifications = body.emailNotifications !== false;
  const services = Array.isArray(body.services)
    ? body.services
        .map((v: unknown) => cleanText(v, 80))
        .filter((slug: string) => allowedServiceSlugs.includes(slug))
        .slice(0, 30)
    : [];
  const territories = Array.isArray(body.territories)
    ? body.territories.map((v: unknown) => cleanText(v, 100)).filter(Boolean).slice(0, 30)
    : [];

  if (
    !businessName ||
    !phone ||
    !description ||
    services.length === 0 ||
    territories.length === 0
  ) {
    return Response.json(
      { success: false, error: "Business name, phone, description, at least one service, and at least one service area are required." },
      { status: 400 }
    );
  }

  const phoneDigits = phone.replace(/\D/g, "");
  if (phoneDigits.length < 7 || phoneDigits.length > 15) {
    return Response.json(
      { success: false, error: "Enter a valid business phone number." },
      { status: 400 }
    );
  }

  if (websiteUrlInput && websiteUrl === undefined) {
    return Response.json(
      { success: false, error: "Website must be a valid http:// or https:// address." },
      { status: 400 }
    );
  }

  if (facebookUrlInput && facebookUrl === undefined) {
    return Response.json(
      { success: false, error: "Facebook page must be a valid https://facebook.com address." },
      { status: 400 }
    );
  }

  if (logoUrlInput && logoUrl === undefined) {
    return Response.json(
      { success: false, error: "Logo image must use a valid https:// address." },
      { status: 400 }
    );
  }

  if (
    maxLeadPriceDollars !== null &&
    (!Number.isFinite(maxLeadPriceDollars) ||
      maxLeadPriceDollars < 5 ||
      maxLeadPriceDollars > 500)
  ) {
    return Response.json(
      { success: false, error: "Maximum lead price must be between $5 and $500, or left blank." },
      { status: 400 }
    );
  }

  const admin = createAdminClient();
  const profileId = context.profile.id;

  const { error: profileError } = await admin
    .from("contractor_profiles")
    .update({
      business_name: businessName,
      contact_name: contactName || null,
      phone,
      website_url: websiteUrl ?? null,
      facebook_url: facebookUrl ?? null,
      description,
      logo_url: logoUrl ?? null,
      city: city || null,
      zip: zip || null,
      status: "active",
      onboarding_completed: true,
    })
    .eq("id", profileId);

  if (profileError) throw profileError;

  const { error: serviceDeleteError } = await admin
    .from("contractor_services")
    .delete()
    .eq("contractor_id", profileId);
  if (serviceDeleteError) throw serviceDeleteError;

  const { error: territoryDeleteError } = await admin
    .from("contractor_territories")
    .delete()
    .eq("contractor_id", profileId);
  if (territoryDeleteError) throw territoryDeleteError;

  const { error: serviceInsertError } = await admin
    .from("contractor_services")
    .insert(
      services.map((serviceSlug: string) => ({
        contractor_id: profileId,
        service_slug: serviceSlug,
        enabled: true,
      }))
    );
  if (serviceInsertError) throw serviceInsertError;

  const { error: territoryInsertError } = await admin
    .from("contractor_territories")
    .insert(
      territories.map((territory: string) => ({
        contractor_id: profileId,
        city: territory,
      }))
    );
  if (territoryInsertError) throw territoryInsertError;

  const { error: preferenceError } = await admin
    .from("contractor_preferences")
    .upsert({
      contractor_id: profileId,
      max_lead_price_cents:
        maxLeadPriceDollars === null
          ? null
          : Math.round(maxLeadPriceDollars * 100),
      email_notifications: emailNotifications,
      auto_buy_enabled: false,
    });
  if (preferenceError) throw preferenceError;

  try {
    await refreshMatchesForContractor(profileId);
  } catch (error) {
    console.error("Contractor match refresh failed", error);
  }

  return Response.json({ success: true });
}

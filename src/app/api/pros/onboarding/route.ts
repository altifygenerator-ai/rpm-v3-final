import { getContractorContext } from "@/lib/contractor-auth";
import { cleanText } from "@/lib/marketplace";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const context = await getContractorContext();
  if (!context) {
    return Response.json({ success: false, error: "Sign in required." }, { status: 401 });
  }

  const body = await request.json();
  const businessName = cleanText(body.businessName, 120);
  const contactName = cleanText(body.contactName, 100);
  const phone = cleanText(body.phone, 40);
  const websiteUrl = cleanText(body.websiteUrl, 240);
  const facebookUrl = cleanText(body.facebookUrl, 240);
  const description = cleanText(body.description, 1200);
  const logoUrl = cleanText(body.logoUrl, 500);
  const city = cleanText(body.city, 100);
  const zip = cleanText(body.zip, 20);
  const services = Array.isArray(body.services)
    ? body.services.map((v: unknown) => cleanText(v, 80)).filter(Boolean).slice(0, 30)
    : [];
  const territories = Array.isArray(body.territories)
    ? body.territories.map((v: unknown) => cleanText(v, 100)).filter(Boolean).slice(0, 30)
    : [];

  if (!businessName || !phone || !description || services.length === 0 || territories.length === 0) {
    return Response.json(
      { success: false, error: "Business name, phone, description, at least one service, and at least one service area are required." },
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
      website_url: websiteUrl || null,
      facebook_url: facebookUrl || null,
      description,
      logo_url: logoUrl || null,
      city: city || null,
      zip: zip || null,
      status: "active",
      onboarding_completed: true,
    })
    .eq("id", profileId);

  if (profileError) throw profileError;

  await admin.from("contractor_services").delete().eq("contractor_id", profileId);
  await admin.from("contractor_territories").delete().eq("contractor_id", profileId);

  await admin.from("contractor_services").insert(
    services.map((serviceSlug: string) => ({
      contractor_id: profileId,
      service_slug: serviceSlug,
      enabled: true,
    }))
  );

  await admin.from("contractor_territories").insert(
    territories.map((territory: string) => ({
      contractor_id: profileId,
      city: territory,
    }))
  );

  await admin.from("contractor_preferences").upsert({
    contractor_id: profileId,
    email_notifications: true,
    auto_buy_enabled: false,
  });

  return Response.json({ success: true });
}

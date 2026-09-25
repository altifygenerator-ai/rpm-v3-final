import { redirect } from "next/navigation";
import ContractorOnboardingForm from "@/components/contractor-onboarding-form";
import { getContractorContext } from "@/lib/contractor-auth";
import { getContractorServicesAndTerritories } from "@/lib/marketplace-queries";

export default async function OnboardingPage() {
  const context = await getContractorContext();
  if (!context) redirect("/pros/sign-in");
  const related = await getContractorServicesAndTerritories(context.profile.id);

  return (
    <main className="pro-standalone">
      <div className="pro-standalone-head">
        <span>ARKANSAS LAND PROS</span>
        <h1>Finish your contractor profile.</h1>
        <p>Your services and areas control the opportunities we match to your account.</p>
      </div>
      <ContractorOnboardingForm
        initial={{
          businessName: context.profile.business_name,
          contactName: context.profile.contact_name || "",
          phone: context.profile.phone || "",
          websiteUrl: context.profile.website_url || "",
          facebookUrl: context.profile.facebook_url || "",
          description: context.profile.description || "",
          logoUrl: context.profile.logo_url || "",
          city: context.profile.city || "",
          zip: context.profile.zip || "",
          services: related.services.filter((s) => s.enabled).map((s) => s.service_slug),
          territories: related.territories.map((t) => t.city || t.county || t.zip || "").filter(Boolean),
          maxLeadPriceDollars:
            related.preferences?.max_lead_price_cents != null
              ? String(related.preferences.max_lead_price_cents / 100)
              : "",
          emailNotifications: related.preferences?.email_notifications !== false,
        }}
      />
    </main>
  );
}

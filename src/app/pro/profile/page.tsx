import { redirect } from "next/navigation";
import ProDashboardShell from "@/components/pro-dashboard-shell";
import ContractorOnboardingForm from "@/components/contractor-onboarding-form";
import { getContractorContext } from "@/lib/contractor-auth";
import { getContractorServicesAndTerritories } from "@/lib/marketplace-queries";

export default async function ProfilePage() {
  const context = await getContractorContext();
  if (!context) redirect("/pros/sign-in");
  const related = await getContractorServicesAndTerritories(context.profile.id);

  return (
    <ProDashboardShell context={context}>
      <header className="pro-page-head">
        <p className="field-label">PUBLIC PROFILE</p>
        <h1>Keep your listing current.</h1>
        <p>These details also control which kinds of leads are matched to your account.</p>
      </header>
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
    </ProDashboardShell>
  );
}

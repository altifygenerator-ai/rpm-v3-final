import Link from "next/link";
import { redirect } from "next/navigation";
import ProDashboardShell from "@/components/pro-dashboard-shell";
import { getContractorContext } from "@/lib/contractor-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { getMarketplaceLeads } from "@/lib/marketplace-queries";

export default async function DashboardPage() {
  const context = await getContractorContext();
  if (!context) redirect("/pros/sign-in");
  if (!context.profile.onboarding_completed) redirect("/pro/onboarding");

  const admin = createAdminClient();
  const leads = await getMarketplaceLeads(context);
  const { count: paidCount } = await admin
    .from("lead_purchases")
    .select("id", { count: "exact", head: true })
    .eq("contractor_id", context.profile.id)
    .eq("status", "paid");

  const { count: openMatches } = await admin
    .from("lead_matches")
    .select("id", { count: "exact", head: true })
    .eq("contractor_id", context.profile.id)
    .is("hidden_at", null);

  return (
    <ProDashboardShell context={context}>
      <header className="pro-page-head">
        <p className="field-label">CONTRACTOR DASHBOARD</p>
        <h1>{context.profile.business_name}</h1>
        <p>Manage your listing, review matching opportunities, and keep track of the leads you unlock.</p>
      </header>

      <section className="pro-stat-row">
        <div><span>Matching opportunities</span><strong>{context.profile.access_role === "house_owner" ? leads.filter((l:any)=>l.marketplace_status==="available").length : openMatches || 0}</strong></div>
        <div><span>Paid unlocks</span><strong>{paidCount || 0}</strong></div>
        <div><span>Public profile</span><strong>{context.profile.public_profile_enabled ? "Live" : "Hidden"}</strong></div>
      </section>

      <section className="pro-dashboard-panel">
        <div>
          <h2>New opportunities</h2>
          <p>See the job type, area, rough details, quality, and unlock price before you decide.</p>
        </div>
        <Link href="/pro/leads" className="work-button">Open lead marketplace</Link>
      </section>

      <section className="pro-dashboard-panel">
        <div>
          <h2>Your public listing</h2>
          <p>Your contractor profile gives the business a permanent place on Arkansas Land Pros even when you are not buying leads.</p>
        </div>
        <Link href={`/pros/${context.profile.slug}`} className="work-button">View public profile</Link>
      </section>
    </ProDashboardShell>
  );
}

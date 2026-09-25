import Link from "next/link";
import { redirect } from "next/navigation";
import ProDashboardShell from "@/components/pro-dashboard-shell";
import { getContractorContext } from "@/lib/contractor-auth";
import { getMarketplaceLeads } from "@/lib/marketplace-queries";
import { formatMoney, isLeadAvailable } from "@/lib/marketplace";

export default async function LeadsPage() {
  const context = await getContractorContext();
  if (!context) redirect("/pros/sign-in");
  if (!context.profile.onboarding_completed) redirect("/pro/onboarding");

  const leads = await getMarketplaceLeads(context);

  return (
    <ProDashboardShell context={context}>
      <header className="pro-page-head">
        <p className="field-label">LEAD MARKETPLACE</p>
        <h1>Work that matches your business.</h1>
        <p>
          Standard contractor accounts see matching opportunities based on service and area.
          The customer’s direct contact details stay locked until a successful purchase.
        </p>
      </header>

      <div className="lead-market-grid">
        {leads.map((lead) => {
          const available = isLeadAvailable(lead);
          const max = lead.max_paid_unlocks || 2;
          const remaining = lead.unlimited_unlocks ? null : Math.max(0, max - lead.paid_unlock_count);
          return (
            <Link href={`/pro/leads/${lead.id}`} key={lead.id} className="lead-market-card">
              <div className="lead-card-top">
                <span className={`lead-quality quality-${lead.quality_band}`}>{lead.quality_band}</span>
                {lead.is_test ? <b>TEST LEAD</b> : null}
              </div>
              <strong>{lead.service_slug.replace(/-/g, " ")}</strong>
              <h2>{lead.city || lead.area}</h2>
              <p>{lead.ai_summary || "Project details available after unlock."}</p>
              <div className="lead-card-meta">
                {lead.property_size ? <span>{lead.property_size}</span> : null}
                {lead.timeline ? <span>{lead.timeline}</span> : null}
                <span>{available ? "Available" : lead.marketplace_status.replace(/_/g, " ")}</span>
              </div>
              <div className="lead-card-price">
                <strong>{context.profile.access_role === "house_owner" && !lead.is_test ? "Direct access" : formatMoney(lead.lead_price_cents)}</strong>
                <span>{lead.unlimited_unlocks ? "Unlimited test purchases" : `${remaining} paid spot${remaining === 1 ? "" : "s"} remaining`}</span>
              </div>
            </Link>
          );
        })}
      </div>

      {!leads.length ? (
        <div className="pro-empty-state">
          <h2>No matching opportunities right now.</h2>
          <p>We’ll match new projects against the services and areas on your profile.</p>
        </div>
      ) : null}
    </ProDashboardShell>
  );
}

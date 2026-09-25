import Link from "next/link";
import { redirect } from "next/navigation";
import ProDashboardShell from "@/components/pro-dashboard-shell";
import HouseLeadControls from "@/components/house-lead-controls";
import { requireHouseOwner } from "@/lib/contractor-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatMoney } from "@/lib/marketplace";

export default async function LeadControlPage() {
  const context = await requireHouseOwner();
  if (!context) redirect("/pro/dashboard");

  const admin = createAdminClient();
  const { data: leads } = await admin
    .from("leads")
    .select("id,public_code,city,area,service_slug,quality_band,lead_price_cents,marketplace_status,marketplace_enabled,is_test,test_enabled,paid_unlock_count,unlimited_unlocks,created_at")
    .order("created_at", { ascending: false })
    .limit(150);

  return (
    <ProDashboardShell context={context}>
      <header className="pro-page-head">
        <p className="field-label">LEAD CONTROL</p>
        <h1>Marketplace inventory control.</h1>
        <p>Pause, restore, or retire any lead without deleting the homeowner record. Red Dirt access is separate and never increments the paid unlock count.</p>
      </header>

      <div className="house-lead-table">
        {(leads || []).map((lead) => (
          <article key={lead.id}>
            <div>
              <span>{lead.public_code} • {lead.quality_band}</span>
              <Link href={`/pro/leads/${lead.id}`}><strong>{lead.service_slug.replace(/-/g, " ")} — {lead.city || lead.area}</strong></Link>
              <small>{formatMoney(lead.lead_price_cents)} • {lead.paid_unlock_count} paid unlocks • {lead.marketplace_status}</small>
            </div>
            <HouseLeadControls
              leadId={lead.id}
              status={lead.marketplace_status}
              enabled={lead.marketplace_enabled}
              isTest={lead.is_test}
              testEnabled={lead.test_enabled}
            />
          </article>
        ))}
      </div>
    </ProDashboardShell>
  );
}

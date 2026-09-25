import { redirect } from "next/navigation";
import ProDashboardShell from "@/components/pro-dashboard-shell";
import HouseDisputeControls from "@/components/house-dispute-controls";
import { requireHouseOwner } from "@/lib/contractor-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatMoney } from "@/lib/marketplace";

export default async function DisputesPage() {
  const context = await requireHouseOwner();
  if (!context) redirect("/pro/dashboard");

  const admin = createAdminClient();
  const { data: disputes } = await admin
    .from("lead_disputes")
    .select("id,lead_id,contractor_id,purchase_id,reason,details,status,created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  const contractorIds = [...new Set((disputes || []).map((item) => item.contractor_id))];
  const purchaseIds = [...new Set((disputes || []).map((item) => item.purchase_id).filter(Boolean))];
  const leadIds = [...new Set((disputes || []).map((item) => item.lead_id))];

  const [{ data: contractors }, { data: purchases }, { data: leads }] = await Promise.all([
    contractorIds.length
      ? admin.from("contractor_profiles").select("id,business_name,email").in("id", contractorIds)
      : Promise.resolve({ data: [] as Array<{ id: string; business_name: string; email: string }> }),
    purchaseIds.length
      ? admin.from("lead_purchases").select("id,amount_cents,status").in("id", purchaseIds)
      : Promise.resolve({ data: [] as Array<{ id: string; amount_cents: number; status: string }> }),
    leadIds.length
      ? admin.from("leads").select("id,public_code,service_slug,city,area,marketplace_status").in("id", leadIds)
      : Promise.resolve({ data: [] as Array<{ id: string; public_code: string; service_slug: string; city: string | null; area: string; marketplace_status: string }> }),
  ]);

  const contractorMap = new Map((contractors || []).map((item) => [item.id, item]));
  const purchaseMap = new Map((purchases || []).map((item) => [item.id, item]));
  const leadMap = new Map((leads || []).map((item) => [item.id, item]));

  return (
    <ProDashboardShell context={context}>
      <header className="pro-page-head">
        <p className="field-label">LEAD REVIEWS</p>
        <h1>Invalid-lead review requests.</h1>
        <p>Review contractor reports, deny them, refund the Stripe payment, or refund and pull a bad lead from the marketplace.</p>
      </header>

      <div className="house-dispute-list">
        {(disputes || []).map((dispute) => {
          const contractor = contractorMap.get(dispute.contractor_id);
          const purchase = dispute.purchase_id ? purchaseMap.get(dispute.purchase_id) : null;
          const lead = leadMap.get(dispute.lead_id);
          return (
            <article key={dispute.id}>
              <div>
                <span>{dispute.status} • {dispute.reason}</span>
                <strong>{lead?.public_code || dispute.lead_id} — {lead?.service_slug.replace(/-/g, " ") || "lead"}</strong>
                <p>{lead?.city || lead?.area || "Arkansas"} • {contractor?.business_name || "Contractor"}</p>
                {dispute.details ? <p>{dispute.details}</p> : null}
                <small>{purchase ? `${formatMoney(purchase.amount_cents)} • ${purchase.status}` : "Purchase unavailable"}</small>
              </div>
              {dispute.status === "open" ? (
                <HouseDisputeControls disputeId={dispute.id} />
              ) : (
                <strong className="dispute-final-status">{dispute.status}</strong>
              )}
            </article>
          );
        })}
      </div>

      {!disputes?.length ? (
        <div className="pro-empty-state">
          <h2>No lead reviews waiting.</h2>
          <p>Contractor reports about invalid paid leads will appear here.</p>
        </div>
      ) : null}
    </ProDashboardShell>
  );
}

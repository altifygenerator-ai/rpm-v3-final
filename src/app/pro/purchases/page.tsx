import Link from "next/link";
import { redirect } from "next/navigation";
import ProDashboardShell from "@/components/pro-dashboard-shell";
import { getContractorContext } from "@/lib/contractor-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatMoney } from "@/lib/marketplace";

export default async function PurchasesPage() {
  const context = await getContractorContext();
  if (!context) redirect("/pros/sign-in");

  const admin = createAdminClient();
  const { data: purchases } = await admin
    .from("lead_purchases")
    .select("id,lead_id,amount_cents,status,is_test,paid_at,created_at")
    .eq("contractor_id", context.profile.id)
    .order("created_at", { ascending: false })
    .limit(100);

  const leadIds = [...new Set((purchases || []).map((item) => item.lead_id))];
  const { data: leads } = leadIds.length
    ? await admin.from("leads").select("id,public_code,service_slug,city,area").in("id", leadIds)
    : { data: [] as Array<{ id: string; public_code: string; service_slug: string; city: string | null; area: string }> };

  const leadMap = new Map((leads || []).map((lead) => [lead.id, lead]));

  return (
    <ProDashboardShell context={context}>
      <header className="pro-page-head">
        <p className="field-label">PURCHASE HISTORY</p>
        <h1>Your lead unlocks.</h1>
        <p>Paid, processing, cancelled, and refunded marketplace purchases are kept here.</p>
      </header>

      <div className="purchase-list">
        {(purchases || []).map((purchase) => {
          const lead = leadMap.get(purchase.lead_id);
          return (
            <Link href={`/pro/leads/${purchase.lead_id}`} key={purchase.id}>
              <div>
                <span>{lead?.public_code || purchase.lead_id}</span>
                <strong>{lead?.service_slug.replace(/-/g, " ") || "Lead unlock"} — {lead?.city || lead?.area || "Arkansas"}</strong>
              </div>
              <div>
                <strong>{formatMoney(purchase.amount_cents)}</strong>
                <span>{purchase.status}</span>
              </div>
            </Link>
          );
        })}
      </div>

      {!purchases?.length ? (
        <div className="pro-empty-state">
          <h2>No purchases yet.</h2>
          <p>Matching leads you choose to unlock will show up here.</p>
        </div>
      ) : null}
    </ProDashboardShell>
  );
}

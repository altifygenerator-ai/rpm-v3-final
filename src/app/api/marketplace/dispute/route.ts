import { getContractorContext } from "@/lib/contractor-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { cleanText } from "@/lib/marketplace";

export async function POST(request: Request) {
  const context = await getContractorContext();
  if (!context || context.profile.access_role !== "normal") {
    return Response.json({ success: false, error: "Contractor account required." }, { status: 401 });
  }

  const body = await request.json();
  const leadId = cleanText(body.leadId, 80);
  const purchaseId = cleanText(body.purchaseId, 80);
  const reason = cleanText(body.reason, 100);
  const details = cleanText(body.details, 1200);

  const admin = createAdminClient();
  const { data: purchase } = await admin
    .from("lead_purchases")
    .select("id")
    .eq("id", purchaseId)
    .eq("lead_id", leadId)
    .eq("contractor_id", context.profile.id)
    .eq("status", "paid")
    .maybeSingle();

  if (!purchase) {
    return Response.json({ success: false, error: "Paid purchase not found." }, { status: 404 });
  }

  const { error } = await admin.from("lead_disputes").insert({
    lead_id: leadId,
    contractor_id: context.profile.id,
    purchase_id: purchaseId,
    reason,
    details: details || null,
  });

  if (error) throw error;
  return Response.json({ success: true });
}

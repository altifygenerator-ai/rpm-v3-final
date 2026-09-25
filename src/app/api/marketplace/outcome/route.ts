import { getContractorContext } from "@/lib/contractor-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { cleanText } from "@/lib/marketplace";

export async function POST(request: Request) {
  const context = await getContractorContext();
  if (!context) return Response.json({ success: false, error: "Sign in required." }, { status: 401 });

  const body = await request.json();
  const leadId = cleanText(body.leadId, 80);
  const status = cleanText(body.status, 40);
  const notes = cleanText(body.notes, 800);
  const allowed = ["contacted", "estimate_scheduled", "hired", "not_hired", "completed"];

  if (!leadId || !allowed.includes(status)) {
    return Response.json({ success: false, error: "Invalid update." }, { status: 400 });
  }

  const admin = createAdminClient();

  if (context.profile.access_role === "normal") {
    const { data: unlock } = await admin
      .from("lead_unlocks")
      .select("id")
      .eq("lead_id", leadId)
      .eq("contractor_id", context.profile.id)
      .limit(1)
      .maybeSingle();
    if (!unlock) return Response.json({ success: false, error: "Lead is not unlocked for your account." }, { status: 403 });
  }

  const { error: outcomeError } = await admin
    .from("contractor_lead_outcomes")
    .upsert(
      {
        lead_id: leadId,
        contractor_id: context.profile.id,
        status,
        notes: notes || null,
      },
      { onConflict: "lead_id,contractor_id" }
    );

  if (outcomeError) {
    console.error("Contractor lead outcome update failed", outcomeError);
    return Response.json(
      { success: false, error: "Lead status could not be updated." },
      { status: 500 }
    );
  }

  await admin.from("lead_events").insert({
    lead_id: leadId,
    contractor_id: context.profile.id,
    event_type: `contractor_${status}`,
    metadata: notes ? { notes } : {},
  });

  if (context.profile.access_role === "house_owner") {
    await admin.from("house_lead_actions").insert({
      lead_id: leadId,
      contractor_id: context.profile.id,
      action: status === "hired" ? "won" : status === "not_hired" ? "lost" : status === "estimate_scheduled" ? "estimate" : "contacted",
      notes: notes || null,
    });
  }

  return Response.json({ success: true });
}

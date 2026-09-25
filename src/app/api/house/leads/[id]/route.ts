import { requireHouseOwner } from "@/lib/contractor-auth";
import { createAdminClient } from "@/lib/supabase/admin";

type Props = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, { params }: Props) {
  const context = await requireHouseOwner();
  if (!context) {
    return Response.json({ success: false, error: "Not authorized." }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();
  const action = String(body.action || "");
  const admin = createAdminClient();

  if (action === "pause") {
    await admin.from("leads").update({ marketplace_enabled: false, marketplace_status: "paused" }).eq("id", id);
  } else if (action === "resume") {
    await admin.from("leads").update({ marketplace_enabled: true, marketplace_status: "available" }).eq("id", id);
  } else if (action === "cancel") {
    await admin.from("leads").update({ marketplace_enabled: false, marketplace_status: "cancelled" }).eq("id", id);
  } else if (action === "invalidate") {
    await admin.from("leads").update({
      marketplace_enabled: false,
      marketplace_status: "invalid",
    }).eq("id", id);
  } else if (action === "update_settings") {
    const dollars = Number(body.priceDollars);
    const maxUnlocks = Number(body.maxUnlocks);
    const unlimited = Boolean(body.unlimited);

    if (!Number.isFinite(dollars) || dollars < 1 || dollars > 500) {
      return Response.json({ success: false, error: "Lead price must be between $1 and $500." }, { status: 400 });
    }
    if (!unlimited && (!Number.isInteger(maxUnlocks) || maxUnlocks < 1 || maxUnlocks > 20)) {
      return Response.json({ success: false, error: "Unlock limit must be between 1 and 20." }, { status: 400 });
    }

    await admin.from("leads").update({
      lead_price_cents: Math.round(dollars * 100),
      max_paid_unlocks: unlimited ? null : maxUnlocks,
      unlimited_unlocks: unlimited,
    }).eq("id", id);
  } else if (action === "toggle_test") {
    const { data: lead } = await admin.from("leads").select("is_test,test_enabled").eq("id", id).single();
    if (!lead?.is_test) {
      return Response.json({ success: false, error: "Only test leads can use this toggle." }, { status: 400 });
    }
    await admin.from("leads").update({ test_enabled: !lead.test_enabled, marketplace_enabled: !lead.test_enabled, marketplace_status: !lead.test_enabled ? "available" : "paused" }).eq("id", id);
  } else {
    return Response.json({ success: false, error: "Unknown action." }, { status: 400 });
  }

  await admin.from("lead_events").insert({
    lead_id: id,
    contractor_id: context.profile.id,
    event_type: `house_${action}`,
  });

  return Response.json({ success: true });
}

import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  const secret = process.env.CRON_SECRET;

  if (!secret || auth !== `Bearer ${secret}`) {
    return Response.json({ success: false }, { status: 401 });
  }

  const admin = createAdminClient();
  const now = new Date().toISOString();

  const { data, error } = await admin
    .from("leads")
    .update({
      marketplace_status: "expired",
      marketplace_enabled: false,
    })
    .eq("marketplace_status", "available")
    .eq("marketplace_enabled", true)
    .lt("expires_at", now)
    .select("id");

  if (error) throw error;

  if (data?.length) {
    await admin.from("lead_events").insert(
      data.map((lead) => ({
        lead_id: lead.id,
        event_type: "lead_expired",
      }))
    );
  }

  return Response.json({ success: true, expired: data?.length || 0 });
}

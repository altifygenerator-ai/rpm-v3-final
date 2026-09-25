import { requireHouseOwner } from "@/lib/contractor-auth";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";

type Props = {
  params: Promise<{ id: string }>;
};

async function expireOpenCheckouts(
  leadId: string,
  admin: ReturnType<typeof createAdminClient>
) {
  const { data: pending } = await admin
    .from("lead_purchases")
    .select("id,stripe_checkout_session_id,status")
    .eq("lead_id", leadId)
    .in("status", ["created", "checkout_open"]);

  if (!pending?.length) return;

  const stripe = process.env.STRIPE_SECRET_KEY
    ? new Stripe(process.env.STRIPE_SECRET_KEY)
    : null;

  for (const purchase of pending) {
    if (stripe && purchase.stripe_checkout_session_id) {
      try {
        await stripe.checkout.sessions.expire(
          purchase.stripe_checkout_session_id
        );
      } catch (error) {
        console.warn(
          "Could not expire Stripe Checkout session",
          purchase.stripe_checkout_session_id,
          error
        );
      }
    }

    await admin
      .from("lead_purchases")
      .update({ status: "cancelled" })
      .eq("id", purchase.id)
      .neq("status", "paid");
  }
}

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
    await expireOpenCheckouts(id, admin);
    await admin.from("leads").update({ marketplace_enabled: false, marketplace_status: "paused" }).eq("id", id);
  } else if (action === "resume") {
    const { data: lead } = await admin
      .from("leads")
      .select("paid_unlock_count,max_paid_unlocks,unlimited_unlocks,is_test,test_enabled,expires_at")
      .eq("id", id)
      .maybeSingle();

    if (!lead) {
      return Response.json({ success: false, error: "Lead not found." }, { status: 404 });
    }

    if (lead.is_test && !lead.test_enabled) {
      return Response.json(
        { success: false, error: "Turn the test lead on before returning it to the marketplace." },
        { status: 409 }
      );
    }

    const max = lead.max_paid_unlocks ?? 2;
    if (!lead.unlimited_unlocks && lead.paid_unlock_count >= max) {
      return Response.json(
        {
          success: false,
          error: "This lead has reached its paid unlock limit. Increase the limit or enable unlimited unlocks first.",
        },
        { status: 409 }
      );
    }

    const expiresAt =
      !lead.expires_at || new Date(lead.expires_at).getTime() <= Date.now()
        ? new Date(Date.now() + 7 * 86400000).toISOString()
        : lead.expires_at;

    await admin
      .from("leads")
      .update({
        marketplace_enabled: true,
        marketplace_status: "available",
        expires_at: expiresAt,
      })
      .eq("id", id);
  } else if (action === "cancel") {
    await expireOpenCheckouts(id, admin);
    await admin.from("leads").update({ marketplace_enabled: false, marketplace_status: "cancelled" }).eq("id", id);
  } else if (action === "invalidate") {
    await expireOpenCheckouts(id, admin);
    await admin.from("leads").update({
      marketplace_enabled: false,
      marketplace_status: "invalid",
    }).eq("id", id);
  } else if (action === "update_settings") {
    await expireOpenCheckouts(id, admin);
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
    if (lead.test_enabled) {
      await expireOpenCheckouts(id, admin);
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

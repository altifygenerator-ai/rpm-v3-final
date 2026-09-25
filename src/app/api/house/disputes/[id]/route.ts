import Stripe from "stripe";
import { requireHouseOwner } from "@/lib/contractor-auth";
import { createAdminClient } from "@/lib/supabase/admin";

type Props = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Props) {
  const context = await requireHouseOwner();
  if (!context) {
    return Response.json({ success: false, error: "Not authorized." }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();
  const action = String(body.action || "");
  const admin = createAdminClient();

  const { data: dispute } = await admin
    .from("lead_disputes")
    .select("id,lead_id,contractor_id,purchase_id,status")
    .eq("id", id)
    .maybeSingle();

  if (!dispute) {
    return Response.json({ success: false, error: "Review request not found." }, { status: 404 });
  }

  if (action === "deny") {
    await admin.from("lead_disputes").update({ status: "denied" }).eq("id", id);
    await admin.from("lead_events").insert({
      lead_id: dispute.lead_id,
      contractor_id: context.profile.id,
      event_type: "dispute_denied",
      metadata: { dispute_id: id, affected_contractor_id: dispute.contractor_id },
    });
    return Response.json({ success: true });
  }

  if (action !== "refund" && action !== "refund_and_pull") {
    return Response.json({ success: false, error: "Unknown review action." }, { status: 400 });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return Response.json({ success: false, error: "Stripe is not configured." }, { status: 503 });
  }

  const { data: purchase } = await admin
    .from("lead_purchases")
    .select("id,status,stripe_payment_intent_id,amount_cents")
    .eq("id", dispute.purchase_id)
    .maybeSingle();

  if (!purchase?.stripe_payment_intent_id || purchase.status !== "paid") {
    return Response.json({ success: false, error: "A refundable paid purchase was not found." }, { status: 409 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const refund = await stripe.refunds.create(
    {
      payment_intent: purchase.stripe_payment_intent_id,
      metadata: {
        alp_dispute_id: id,
        alp_lead_id: dispute.lead_id,
        alp_contractor_id: dispute.contractor_id,
      },
    },
    {
      idempotencyKey: `alp-dispute-refund-${id}`,
    }
  );

  await admin
    .from("lead_purchases")
    .update({
      status: "refunded",
      refunded_at: new Date().toISOString(),
    })
    .eq("id", purchase.id);

  await admin
    .from("lead_disputes")
    .update({ status: "refunded" })
    .eq("id", id);

  if (action === "refund_and_pull") {
    await admin
      .from("leads")
      .update({
        marketplace_enabled: false,
        marketplace_status: "invalid",
      })
      .eq("id", dispute.lead_id);
  }

  await admin.from("lead_events").insert({
    lead_id: dispute.lead_id,
    contractor_id: context.profile.id,
    event_type: "dispute_refunded",
    metadata: {
      dispute_id: id,
      affected_contractor_id: dispute.contractor_id,
      refund_id: refund.id,
      amount_cents: purchase.amount_cents,
      pulled_from_marketplace: action === "refund_and_pull",
    },
  });

  return Response.json({ success: true, refundId: refund.id });
}

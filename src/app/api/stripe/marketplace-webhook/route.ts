import Stripe from "stripe";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secretKey || !webhookSecret) {
    return new Response("Stripe webhook configuration missing", { status: 503 });
  }

  const stripe = new Stripe(secretKey);
  const signature = request.headers.get("stripe-signature");
  if (!signature) return new Response("Missing signature", { status: 400 });

  let event: Stripe.Event;
  try {
    const body = await request.text();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error("Marketplace webhook signature error", error);
    return new Response("Invalid signature", { status: 400 });
  }

  const admin = createAdminClient();

  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    const session = event.data.object as Stripe.Checkout.Session;
    const purchaseId = session.metadata?.purchase_id;
    const leadId = session.metadata?.lead_id;
    const contractorId = session.metadata?.contractor_id;

    if (purchaseId && leadId && contractorId && session.payment_status === "paid") {
      const { data: purchase } = await admin
        .from("lead_purchases")
        .select("id,status,is_test")
        .eq("id", purchaseId)
        .maybeSingle();

      if (purchase && purchase.status !== "paid") {
        await admin
          .from("lead_purchases")
          .update({
            status: "paid",
            stripe_checkout_session_id: session.id,
            stripe_payment_intent_id:
              typeof session.payment_intent === "string" ? session.payment_intent : null,
            paid_at: new Date().toISOString(),
          })
          .eq("id", purchaseId);

        const { error: unlockError } = await admin.from("lead_unlocks").insert({
          lead_id: leadId,
          contractor_id: contractorId,
          purchase_id: purchaseId,
          unlock_type: "paid",
          counts_toward_limit: true,
        });

        if (!unlockError) {
          const { data: lead } = await admin
            .from("leads")
            .select("paid_unlock_count,unlimited_unlocks,max_paid_unlocks,is_test")
            .eq("id", leadId)
            .single();

          const nextCount = (lead?.paid_unlock_count || 0) + 1;
          const max = lead?.max_paid_unlocks || 2;

          await admin
            .from("leads")
            .update({
              paid_unlock_count: nextCount,
              ...(lead?.unlimited_unlocks
                ? {}
                : nextCount >= max
                  ? { marketplace_status: "sold_out", marketplace_enabled: false }
                  : {}),
            })
            .eq("id", leadId);

          await admin.from("lead_events").insert({
            lead_id: leadId,
            contractor_id: contractorId,
            event_type: "paid_unlock",
            metadata: {
              purchase_id: purchaseId,
              checkout_session_id: session.id,
              is_test: Boolean(lead?.is_test),
            },
          });

          const { data: contractor } = await admin
            .from("contractor_profiles")
            .select("email,business_name")
            .eq("id", contractorId)
            .single();

          if (contractor && process.env.RESEND_API_KEY) {
            const resend = new Resend(process.env.RESEND_API_KEY);
            const baseUrl =
              process.env.NEXT_PUBLIC_SITE_URL || "https://www.arkansaslandpros.com";
            await resend.emails.send({
              from:
                process.env.MARKETPLACE_FROM_EMAIL ||
                "Arkansas Land Pros <leads@arkansaslandpros.com>",
              to: [contractor.email],
              subject: purchase.is_test ? "Test lead unlocked successfully" : "Your Arkansas Land Pros lead is unlocked",
              html: `<p>Payment succeeded and the full lead is now available in your contractor dashboard.</p><p><a href="${baseUrl}/pro/leads/${leadId}">Open the lead</a></p>`,
            });
          }
        }
      }
    }
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    const purchaseId = session.metadata?.purchase_id;
    if (purchaseId) {
      await admin
        .from("lead_purchases")
        .update({ status: "cancelled" })
        .eq("id", purchaseId)
        .neq("status", "paid");
    }
  }

  return Response.json({ received: true });
}

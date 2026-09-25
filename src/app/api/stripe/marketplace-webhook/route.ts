import Stripe from "stripe";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type FulfillmentRow = {
  lead_id: string;
  contractor_id: string;
  is_test: boolean;
  counts_toward_limit: boolean;
  newly_fulfilled: boolean;
};

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

  if (
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded"
  ) {
    const session = event.data.object as Stripe.Checkout.Session;
    const purchaseId = session.metadata?.purchase_id;

    if (purchaseId && session.payment_status === "paid") {
      const paymentIntentId =
        typeof session.payment_intent === "string" ? session.payment_intent : "";

      const { data, error } = await admin.rpc("fulfill_lead_purchase", {
        p_purchase_id: purchaseId,
        p_checkout_session_id: session.id,
        p_payment_intent_id: paymentIntentId,
      });

      if (error) {
        const message = error.message || "";
        const latePayment =
          /purchase_not_fulfillable|lead_not_available/i.test(message);

        if (latePayment && paymentIntentId) {
          const { data: purchase } = await admin
            .from("lead_purchases")
            .select("id,lead_id,contractor_id,status")
            .eq("id", purchaseId)
            .maybeSingle();

          try {
            const refund = await stripe.refunds.create(
              {
                payment_intent: paymentIntentId,
                metadata: {
                  alp_reason: "late_payment_after_lead_retired",
                  alp_purchase_id: purchaseId,
                  ...(purchase?.lead_id
                    ? { alp_lead_id: purchase.lead_id }
                    : {}),
                },
              },
              {
                idempotencyKey: `alp-late-payment-refund-${purchaseId}`,
              }
            );

            await admin
              .from("lead_purchases")
              .update({
                status: "refunded",
                stripe_checkout_session_id: session.id,
                stripe_payment_intent_id: paymentIntentId,
                refunded_at: new Date().toISOString(),
              })
              .eq("id", purchaseId);

            if (purchase?.lead_id) {
              await admin.from("lead_events").insert({
                lead_id: purchase.lead_id,
                contractor_id: purchase.contractor_id,
                event_type: "late_payment_refunded",
                metadata: {
                  purchase_id: purchaseId,
                  checkout_session_id: session.id,
                  refund_id: refund.id,
                  reason: message,
                },
              });
            }

            console.warn("Late marketplace payment refunded", {
              purchaseId,
              refundId: refund.id,
              reason: message,
            });

            return Response.json({
              received: true,
              refunded: true,
            });
          } catch (refundError) {
            console.error("Late marketplace payment refund failed", {
              purchaseId,
              error: refundError,
            });
            return new Response("Late payment refund failed", { status: 500 });
          }
        }

        console.error("Marketplace purchase fulfillment failed", error);
        return new Response("Fulfillment failed", { status: 500 });
      }

      const fulfillment = (Array.isArray(data) ? data[0] : data) as
        | FulfillmentRow
        | undefined;

      if (fulfillment?.newly_fulfilled) {
        const [{ data: contractor }, { data: purchase }] = await Promise.all([
          admin
            .from("contractor_profiles")
            .select("email,business_name")
            .eq("id", fulfillment.contractor_id)
            .single(),
          admin
            .from("lead_purchases")
            .select("is_test")
            .eq("id", purchaseId)
            .single(),
        ]);

        if (contractor && process.env.RESEND_API_KEY) {
          const resend = new Resend(process.env.RESEND_API_KEY);
          const baseUrl =
            process.env.NEXT_PUBLIC_SITE_URL ||
            "https://www.arkansaslandpros.com";

          await resend.emails.send({
            from:
              process.env.MARKETPLACE_FROM_EMAIL ||
              "Arkansas Land Pros <leads@arkansaslandpros.com>",
            to: [contractor.email],
            subject: purchase?.is_test
              ? "Test lead unlocked successfully"
              : "Your Arkansas Land Pros lead is unlocked",
            html: `
              <div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;color:#171a1d">
                <div style="background:#171a1d;color:#fff;padding:22px;border-top:7px solid #c64e32">
                  <div style="font-size:12px;letter-spacing:.12em;color:#f0b4a5">ARKANSAS LAND PROS</div>
                  <h1 style="font-size:24px;margin:6px 0 0">Lead unlocked</h1>
                </div>
                <div style="border:1px solid #d5dadd;border-top:0;padding:22px">
                  <p>Payment succeeded and the full homeowner/project details are now available in your contractor dashboard.</p>
                  <p><a href="${baseUrl}/pro/leads/${fulfillment.lead_id}" style="background:#c64e32;color:#fff;text-decoration:none;padding:12px 16px;display:inline-block;font-weight:bold">Open unlocked lead</a></p>
                </div>
              </div>
            `,
          });
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

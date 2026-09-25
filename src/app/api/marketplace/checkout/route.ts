import Stripe from "stripe";
import { getContractorContext } from "@/lib/contractor-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { isLeadAvailable } from "@/lib/marketplace";
import { getSiteUrl } from "@/lib/site-url";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const context = await getContractorContext();
    if (!context) {
      return Response.json({ success: false, error: "Sign in required." }, { status: 401 });
    }
    if (context.profile.status !== "active") {
      return Response.json({ success: false, error: "Finish your contractor profile before unlocking leads." }, { status: 403 });
    }

    if (
      context.profile.access_role === "normal" &&
      !context.profile.terms_accepted_at
    ) {
      return Response.json(
        {
          success: false,
          error: "Marketplace terms must be accepted before purchasing leads.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const leadId = String(body.leadId || "");
    if (!leadId) {
      return Response.json({ success: false, error: "Lead is required." }, { status: 400 });
    }

    const admin = createAdminClient();
    const { data: lead, error } = await admin
      .from("leads")
      .select("id,public_code,area,city,service_slug,ai_summary,lead_price_cents,marketplace_status,marketplace_enabled,unlimited_unlocks,paid_unlock_count,max_paid_unlocks,expires_at,is_test,test_enabled")
      .eq("id", leadId)
      .maybeSingle();

    if (error || !lead || !isLeadAvailable(lead)) {
      return Response.json({ success: false, error: "This opportunity is no longer available." }, { status: 409 });
    }

    if (lead.is_test && context.profile.access_role !== "house_owner") {
      return Response.json({ success: false, error: "Lead not found." }, { status: 404 });
    }

    if (!lead.is_test && context.profile.access_role === "normal") {
      const { data: match } = await admin
        .from("lead_matches")
        .select("id")
        .eq("lead_id", lead.id)
        .eq("contractor_id", context.profile.id)
        .is("hidden_at", null)
        .maybeSingle();

      if (!match) {
        return Response.json({ success: false, error: "This lead is not matched to your account." }, { status: 403 });
      }

      const { data: priorUnlock } = await admin
        .from("lead_unlocks")
        .select("id")
        .eq("lead_id", lead.id)
        .eq("contractor_id", context.profile.id)
        .eq("counts_toward_limit", true)
        .limit(1)
        .maybeSingle();

      if (priorUnlock) {
        return Response.json({ success: false, error: "You already unlocked this lead." }, { status: 409 });
      }
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return Response.json({ success: false, error: "Payments are not configured yet." }, { status: 503 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    let stripeCustomerId = context.profile.stripe_customer_id;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: context.profile.email,
        name: context.profile.business_name,
        metadata: { contractor_id: context.profile.id },
      });
      stripeCustomerId = customer.id;
      await admin
        .from("contractor_profiles")
        .update({ stripe_customer_id: customer.id })
        .eq("id", context.profile.id);
    }

    const { data: purchaseId, error: reserveError } = await admin.rpc(
      "reserve_lead_purchase",
      {
        p_lead_id: lead.id,
        p_contractor_id: context.profile.id,
        p_amount_cents: lead.lead_price_cents,
      }
    );

    if (reserveError || !purchaseId) {
      const reason = reserveError?.message || "This opportunity could not be reserved.";
      const soldOut = /sold_out|not_available|already_unlocked|already_reserved/i.test(reason);
      return Response.json(
        {
          success: false,
          error: soldOut
            ? /already_reserved/i.test(reason)
              ? "You already have a checkout open for this lead. Cancel it or wait for it to expire before trying again."
              : "This opportunity is no longer available for purchase."
            : "The lead could not be reserved. Please try again.",
        },
        { status: soldOut ? 409 : 500 }
      );
    }

    const baseUrl = getSiteUrl();
    let session: Stripe.Checkout.Session;
    try {
      session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer: stripeCustomerId,
      success_url: `${baseUrl}/pro/leads/${lead.id}?purchase=success`,
      cancel_url: `${baseUrl}/pro/leads/${lead.id}?purchase=cancelled&purchaseId=${purchaseId}`,
      client_reference_id: purchaseId,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: lead.lead_price_cents,
            product_data: {
              name: lead.is_test
                ? "Arkansas Land Pros test lead unlock"
                : `${lead.service_slug.replace(/-/g, " ")} lead — ${lead.city || lead.area}`,
              description: lead.is_test
                ? "Test-only marketplace unlock. Do not contact the test customer."
                : "Unlock full contact and project details for this matching opportunity.",
            },
          },
        },
      ],
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
      metadata: {
        purchase_id: String(purchaseId),
        lead_id: lead.id,
        contractor_id: context.profile.id,
        is_test: lead.is_test ? "true" : "false",
      },
      payment_intent_data: {
        metadata: {
          purchase_id: String(purchaseId),
          lead_id: lead.id,
          contractor_id: context.profile.id,
        },
      },
    });
    } catch (stripeError) {
      await admin
        .from("lead_purchases")
        .update({ status: "failed" })
        .eq("id", purchaseId);
      throw stripeError;
    }

    await admin
      .from("lead_purchases")
      .update({
        stripe_checkout_session_id: session.id,
        status: "checkout_open",
      })
      .eq("id", purchaseId);

    return Response.json({ success: true, url: session.url });
  } catch (error) {
    console.error("Marketplace checkout error", error);
    return Response.json({ success: false, error: "Checkout could not be started." }, { status: 500 });
  }
}

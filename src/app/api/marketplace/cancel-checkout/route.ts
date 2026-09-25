import Stripe from "stripe";
import { getContractorContext } from "@/lib/contractor-auth";
import { cleanText } from "@/lib/marketplace";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const context = await getContractorContext();
  if (!context) {
    return Response.json({ success: false, error: "Sign in required." }, { status: 401 });
  }

  const body = await request.json();
  const purchaseId = cleanText(body.purchaseId, 80);
  if (!purchaseId) {
    return Response.json({ success: false, error: "Purchase is required." }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: purchase } = await admin
    .from("lead_purchases")
    .select("id,contractor_id,status,stripe_checkout_session_id")
    .eq("id", purchaseId)
    .eq("contractor_id", context.profile.id)
    .maybeSingle();

  if (!purchase) {
    return Response.json({ success: false, error: "Checkout reservation not found." }, { status: 404 });
  }

  if (purchase.status === "paid" || purchase.status === "refunded") {
    return Response.json({ success: true, released: false });
  }

  if (
    process.env.STRIPE_SECRET_KEY &&
    purchase.stripe_checkout_session_id
  ) {
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      await stripe.checkout.sessions.expire(purchase.stripe_checkout_session_id);
    } catch (error) {
      console.warn(
        "Could not expire cancelled contractor Checkout session",
        purchase.stripe_checkout_session_id,
        error
      );
    }
  }

  await admin
    .from("lead_purchases")
    .update({ status: "cancelled" })
    .eq("id", purchase.id)
    .in("status", ["created", "checkout_open", "failed"]);

  return Response.json({ success: true, released: true });
}

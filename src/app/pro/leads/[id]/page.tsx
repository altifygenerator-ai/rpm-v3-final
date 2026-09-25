import { redirect, notFound } from "next/navigation";
import ProDashboardShell from "@/components/pro-dashboard-shell";
import LeadPurchaseButton from "@/components/lead-purchase-button";
import LeadOutcomeActions from "@/components/lead-outcome-actions";
import LeadDisputeForm from "@/components/lead-dispute-form";
import HouseLeadControls from "@/components/house-lead-controls";
import HouseLeadSettings from "@/components/house-lead-settings";
import { getContractorContext } from "@/lib/contractor-auth";
import { canBuyLead, getLeadForContractor } from "@/lib/marketplace-queries";
import { formatMoney } from "@/lib/marketplace";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ purchase?: string }> };

export default async function LeadDetailPage({ params, searchParams }: Props) {
  const context = await getContractorContext();
  if (!context) redirect("/pros/sign-in");
  const { id } = await params;
  const query = await searchParams;
  const result = await getLeadForContractor(context, id);
  if (!result) notFound();

  const { lead, unlocked, purchases } = result;
  const house = context.profile.access_role === "house_owner";
  const showFull = unlocked || house;
  const canBuy = canBuyLead(lead, unlocked);
  const latestPaid = purchases.find((purchase) => purchase.status === "paid");

  return (
    <ProDashboardShell context={context}>
      <header className="pro-page-head">
        <p className="field-label">{lead.is_test ? "TEST MARKETPLACE LEAD" : "MATCHING OPPORTUNITY"}</p>
        <h1>{lead.service_slug.replace(/-/g, " ")} — {lead.city || lead.area}</h1>
        <p>{lead.ai_summary || (showFull ? lead.description : "Project details available after unlock.")}</p>
      </header>

      {query.purchase === "success" && !unlocked ? (
        <div className="pro-notice">Payment returned successfully. Stripe may take a moment to confirm the webhook; refresh shortly if the full lead is still locked.</div>
      ) : null}

      <section className="lead-detail-grid">
        <article className="lead-detail-main">
          <div className="lead-detail-facts">
            <div><span>Area</span><strong>{lead.area}</strong></div>
            <div><span>Work</span><strong>{lead.original_service || lead.service_slug.replace(/-/g, " ")}</strong></div>
            <div><span>Quality</span><strong>{lead.quality_band} ({lead.quality_score}/100)</strong></div>
            <div><span>Timing</span><strong>{lead.timeline || "Not specified"}</strong></div>
            <div><span>Rough size</span><strong>{lead.property_size || "Not specified"}</strong></div>
            <div><span>Lead ID</span><strong>{lead.public_code}</strong></div>
          </div>

          <h2>Project summary</h2>
          <p>{lead.ai_summary || "Project summary not available."}</p>

          {showFull ? (
            <div className="unlocked-lead">
              <div className="unlocked-banner">{house && !unlocked ? "Private Red Dirt access — this does not count as a marketplace unlock." : "Unlocked lead details"}</div>
              <h2>Homeowner contact</h2>
              <div className="lead-contact-lines">
                <p><strong>{lead.customer_name}</strong></p>
                <p><a href={`tel:${lead.customer_phone}`}>{lead.customer_phone}</a></p>
                {lead.customer_email ? <p><a href={`mailto:${lead.customer_email}`}>{lead.customer_email}</a></p> : null}
                {lead.property_address ? <p>{lead.property_address}</p> : null}
              </div>
              <h2>Full project notes</h2>
              <p>{lead.description}</p>
              {!lead.is_test ? (
                <>
                  <LeadOutcomeActions leadId={lead.id} />
                  {context.profile.access_role === "normal" && latestPaid ? (
                    <LeadDisputeForm leadId={lead.id} purchaseId={latestPaid.id} />
                  ) : null}
                </>
              ) : <div className="test-warning"><strong>TEST ONLY</strong><p>Do not contact the test customer. This lead exists only to test Stripe checkout and webhook fulfillment.</p></div>}
            </div>
          ) : (
            <div className="locked-lead">
              <strong>Full contact details are locked.</strong>
              <p>Name, phone, email, exact property details, and the homeowner’s full notes unlock after successful Stripe payment.</p>
              {canBuy ? (
                <LeadPurchaseButton
                  leadId={lead.id}
                  label={lead.is_test ? `Run $1 webhook test` : `Unlock lead — ${formatMoney(lead.lead_price_cents)}`}
                />
              ) : (
                <p>This opportunity is no longer available for purchase.</p>
              )}
            </div>
          )}

          {lead.is_test && house ? (
            <div className="test-purchase-box">
              <h2>Stripe test path</h2>
              <p>House access shows the details for free, but this button intentionally runs the same $1 paid Checkout + webhook path as a normal contractor.</p>
              <LeadPurchaseButton leadId={lead.id} label="Run $1 Stripe unlock test" />
            </div>
          ) : null}
        </article>

        <aside className="lead-detail-side">
          <div className="lead-price-panel">
            <span>{lead.is_test ? "TEST PRICE" : "UNLOCK PRICE"}</span>
            <strong>{formatMoney(lead.lead_price_cents)}</strong>
            <p>{lead.unlimited_unlocks ? "Unlimited purchases while test mode is enabled." : `${Math.max(0, (lead.max_paid_unlocks || 2) - lead.paid_unlock_count)} paid unlocks remaining.`}</p>
          </div>
          {house ? (
            <>
            <HouseLeadControls
              leadId={lead.id}
              status={lead.marketplace_status}
              enabled={lead.marketplace_enabled}
              isTest={lead.is_test}
              testEnabled={lead.test_enabled}
            />
            <HouseLeadSettings
              leadId={lead.id}
              priceCents={lead.lead_price_cents}
              maxUnlocks={lead.max_paid_unlocks}
              unlimited={lead.unlimited_unlocks}
            />
            </>
          ) : null}
          {latestPaid ? <small>Latest paid unlock: {latestPaid.paid_at ? new Date(latestPaid.paid_at).toLocaleString() : "processing"}</small> : null}
        </aside>
      </section>
    </ProDashboardShell>
  );
}

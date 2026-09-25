import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import CustomerProjectStatus from "@/components/customer-project-status";
import { hashProjectToken } from "@/lib/customer-project";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "Your Project Status",
  robots: { index: false, follow: false },
};

type Props = {
  params: Promise<{ token: string }>;
};

export default async function CustomerProjectPage({ params }: Props) {
  const { token } = await params;
  if (!token || token.length < 30) notFound();

  const admin = createAdminClient();
  const tokenHash = hashProjectToken(token);

  const { data: access } = await admin
    .from("lead_customer_access")
    .select("lead_id,expires_at")
    .eq("token_hash", tokenHash)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();

  if (!access) notFound();

  await admin
    .from("lead_customer_access")
    .update({ last_used_at: new Date().toISOString() })
    .eq("lead_id", access.lead_id);

  const [{ data: lead }, { data: outcome }, { data: unlocks }, { data: houseProfiles }] =
    await Promise.all([
      admin
        .from("leads")
        .select("id,public_code,area,city,service_slug,original_service,ai_summary,description,timeline,property_size,marketplace_status,marketplace_enabled,created_at")
        .eq("id", access.lead_id)
        .maybeSingle(),
      admin
        .from("lead_outcomes")
        .select("status,hired_contractor_id,customer_confirmed")
        .eq("lead_id", access.lead_id)
        .maybeSingle(),
      admin
        .from("lead_unlocks")
        .select("contractor_id")
        .eq("lead_id", access.lead_id),
      admin
        .from("contractor_profiles")
        .select("id,business_name,slug")
        .eq("access_role", "house_owner")
        .eq("status", "active")
        .eq("public_profile_enabled", true),
    ]);

  if (!lead) notFound();

  const unlockedIds = [...new Set((unlocks || []).map((row) => row.contractor_id))];
  const { data: unlockedProfiles } = unlockedIds.length
    ? await admin
        .from("contractor_profiles")
        .select("id,business_name,slug")
        .in("id", unlockedIds)
        .eq("status", "active")
        .eq("public_profile_enabled", true)
    : { data: [] as Array<{ id: string; business_name: string; slug: string }> };

  const contractors = new Map<
    string,
    { id: string; business_name: string; slug: string }
  >();

  [...(houseProfiles || []), ...(unlockedProfiles || [])].forEach((contractor) =>
    contractors.set(contractor.id, contractor)
  );

  const currentStatus =
    outcome?.status ||
    (lead.marketplace_status === "cancelled"
      ? "project_cancelled"
      : lead.marketplace_status === "paused"
        ? "on_hold"
        : "still_looking");

  return (
    <>
      <SiteHeader />
      <main className="customer-project-page">
        <section className="customer-project-head">
          <p className="field-label field-label-light">YOUR ARKANSAS LAND PROS PROJECT</p>
          <h1>{lead.original_service || lead.service_slug.replace(/-/g, " ")}</h1>
          <p>{lead.city || lead.area}</p>
          <span>{lead.public_code}</span>
        </section>

        <section className="customer-project-grid">
          <article>
            <h2>Project details</h2>
            <p>{lead.ai_summary || lead.description}</p>
            <dl>
              <div>
                <dt>Property area</dt>
                <dd>{lead.area}</dd>
              </div>
              {lead.property_size ? (
                <div>
                  <dt>Rough size</dt>
                  <dd>{lead.property_size}</dd>
                </div>
              ) : null}
              {lead.timeline ? (
                <div>
                  <dt>Timing</dt>
                  <dd>{lead.timeline}</dd>
                </div>
              ) : null}
            </dl>

            {contractors.size ? (
              <>
                <h2>Businesses connected with this project</h2>
                <div className="customer-pro-list">
                  {[...contractors.values()].map((contractor) => (
                    <Link href={`/pros/${contractor.slug}`} key={contractor.id}>
                      <strong>{contractor.business_name}</strong>
                      <span>View profile →</span>
                    </Link>
                  ))}
                </div>
              </>
            ) : null}
          </article>

          <aside>
            <CustomerProjectStatus
              token={token}
              currentStatus={currentStatus}
              contractors={[...contractors.values()]}
            />
          </aside>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

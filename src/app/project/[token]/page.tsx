import { createHash } from "node:crypto";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import ProjectStatusForm from "@/components/project-status-form";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "Your Project Status",
  robots: { index: false, follow: false },
};

type Props = {
  params: Promise<{ token: string }>;
};

export const dynamic = "force-dynamic";

export default async function ProjectStatusPage({ params }: Props) {
  const { token } = await params;
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const admin = createAdminClient();

  const { data: access } = await admin
    .from("customer_project_access")
    .select("lead_id")
    .eq("token_hash", tokenHash)
    .maybeSingle();

  if (!access) notFound();

  const [{ data: lead }, { data: outcome }, { data: unlocks }] =
    await Promise.all([
      admin
        .from("leads")
        .select(
          "id,public_code,area,service_slug,ai_summary,description,timeline,property_size,marketplace_status"
        )
        .eq("id", access.lead_id)
        .single(),
      admin
        .from("lead_outcomes")
        .select("status,hired_contractor_id,customer_confirmed")
        .eq("lead_id", access.lead_id)
        .maybeSingle(),
      admin
        .from("lead_unlocks")
        .select("contractor_id")
        .eq("lead_id", access.lead_id),
    ]);

  if (!lead) notFound();

  const contractorIds = [
    ...new Set((unlocks || []).map((unlock) => unlock.contractor_id)),
  ];
  const { data: contractorRows } = contractorIds.length
    ? await admin
        .from("contractor_profiles")
        .select("id,business_name")
        .in("id", contractorIds)
        .eq("status", "active")
    : { data: [] as Array<{ id: string; business_name: string }> };

  const currentStatus =
    outcome?.status && outcome.status !== "unknown"
      ? outcome.status
      : lead.marketplace_status === "paused"
        ? "paused"
        : lead.marketplace_status === "cancelled"
          ? "project_cancelled"
          : "still_looking";

  return (
    <>
      <SiteHeader />
      <main className="customer-project-page">
        <section className="customer-project-head">
          <p className="field-label">YOUR ARKANSAS LAND PROS PROJECT</p>
          <h1>{lead.service_slug.replace(/-/g, " ")} — {lead.area}</h1>
          <p>
            Reference <strong>{lead.public_code}</strong>
          </p>
        </section>

        <section className="customer-project-grid">
          <article>
            <h2>Project details</h2>
            <p>{lead.ai_summary || lead.description}</p>
            <dl>
              <div>
                <dt>Area</dt>
                <dd>{lead.area}</dd>
              </div>
              <div>
                <dt>Timing</dt>
                <dd>{lead.timeline || "Not specified"}</dd>
              </div>
              <div>
                <dt>Rough size</dt>
                <dd>{lead.property_size || "Not specified"}</dd>
              </div>
            </dl>
            <p className="customer-project-note">
              Updating this page helps prevent contractors from paying for a
              project after you have already hired someone or decided not to
              move forward.
            </p>
          </article>

          <aside>
            <ProjectStatusForm
              token={token}
              contractors={contractorRows || []}
              currentStatus={currentStatus}
            />
          </aside>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

import type { Metadata } from "next";
import { createHash } from "node:crypto";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import ProjectStatusForm from "@/components/project-status-form";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "Your Project Status",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

type Props = { params: Promise<{ token: string }> };

export default async function ProjectStatusPage({ params }: Props) {
  const { token } = await params;
  if (!token || token.length < 30) notFound();

  const admin = createAdminClient();
  const tokenHash = createHash("sha256").update(token).digest("hex");

  const { data: access } = await admin
    .from("customer_project_access")
    .select("lead_id,expires_at")
    .eq("token_hash", tokenHash)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();

  if (!access) notFound();

  const [{ data: lead }, { data: outcome }, { data: unlockRows }, { data: houseActions }] =
    await Promise.all([
      admin
        .from("leads")
        .select("id,public_code,area,city,service_slug,original_service,ai_summary,description,timeline,property_size,marketplace_status")
        .eq("id", access.lead_id)
        .maybeSingle(),
      admin
        .from("lead_outcomes")
        .select("status,hired_contractor_id,customer_confirmed")
        .eq("lead_id", access.lead_id)
        .maybeSingle(),
      admin.from("lead_unlocks").select("contractor_id").eq("lead_id", access.lead_id),
      admin
        .from("house_lead_actions")
        .select("contractor_id,action")
        .eq("lead_id", access.lead_id)
        .in("action", ["contacted", "estimate", "won"]),
    ]);

  if (!lead) notFound();

  const unlockIds = [...new Set((unlockRows || []).map((row) => row.contractor_id))];
  const houseIds = [...new Set((houseActions || []).map((row) => row.contractor_id))];

  const [{ data: unlockedPros }, { data: connectedHousePros }] = await Promise.all([
    unlockIds.length
      ? admin
          .from("contractor_profiles")
          .select("id,business_name")
          .in("id", unlockIds)
          .eq("access_role", "normal")
          .eq("status", "active")
      : Promise.resolve({ data: [] as Array<{ id: string; business_name: string }> }),
    houseIds.length
      ? admin
          .from("contractor_profiles")
          .select("id,business_name")
          .in("id", houseIds)
          .eq("access_role", "house_owner")
          .eq("status", "active")
          .eq("public_profile_enabled", true)
      : Promise.resolve({ data: [] as Array<{ id: string; business_name: string }> }),
  ]);

  const contractorMap = new Map<string, { id: string; business_name: string }>();
  [...(connectedHousePros || []), ...(unlockedPros || [])].forEach((pro) =>
    contractorMap.set(pro.id, pro)
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
          <small>{lead.public_code}</small>
        </section>

        <section className="customer-project-grid">
          <article>
            <h2>Project details</h2>
            <p>{lead.ai_summary || lead.description}</p>
            <dl>
              <div><dt>Property area</dt><dd>{lead.area}</dd></div>
              {lead.property_size ? <div><dt>Rough size</dt><dd>{lead.property_size}</dd></div> : null}
              {lead.timeline ? <div><dt>Timing</dt><dd>{lead.timeline}</dd></div> : null}
            </dl>
            <p className="customer-project-note">
              This private page is the easiest way to stop the project from being
              offered once you hire someone or decide not to move forward.
            </p>
          </article>

          <aside>
            <ProjectStatusForm
              token={token}
              contractors={[...contractorMap.values()]}
              currentStatus={currentStatus}
            />
          </aside>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatMoney } from "@/lib/marketplace";

type Lead = {
  id: string;
  public_code: string;
  area: string;
  city: string | null;
  county: string | null;
  service_slug: string;
  ai_summary: string | null;
  timeline: string | null;
  property_size: string | null;
  quality_band: string;
  lead_price_cents: number;
  is_test: boolean;
};

export async function createMatchesAndNotify(lead: Lead) {
  if (lead.is_test) return [];

  const admin = createAdminClient();
  const { data: serviceRows } = await admin
    .from("contractor_services")
    .select("contractor_id")
    .eq("service_slug", lead.service_slug)
    .eq("enabled", true);

  const contractorIds = [...new Set((serviceRows || []).map((row) => row.contractor_id))];
  if (!contractorIds.length) return [];

  const { data: profiles } = await admin
    .from("contractor_profiles")
    .select("id,email,business_name,access_role,status")
    .in("id", contractorIds)
    .eq("status", "active");

  const normalProfiles = (profiles || []).filter((p) => p.access_role === "normal");
  if (!normalProfiles.length) return [];

  const ids = normalProfiles.map((p) => p.id);
  const { data: territories } = await admin
    .from("contractor_territories")
    .select("contractor_id,city,county,zip")
    .in("contractor_id", ids);

  const matches: Array<{ contractorId: string; score: number; reason: string }> = [];
  const leadArea = [lead.area, lead.city, lead.county].filter(Boolean).join(" ").toLowerCase();

  for (const profile of normalProfiles) {
    const ownTerritories = (territories || []).filter((t) => t.contractor_id === profile.id);
    let score = 60;
    const reasons = ["service match"];

    if (ownTerritories.length === 0) {
      score = 65;
      reasons.push("no territory restriction");
    } else {
      const locationHit = ownTerritories.some((territory) => {
        const values = [territory.city, territory.county, territory.zip]
          .filter(Boolean)
          .map((value) => String(value).toLowerCase());
        return values.some((value) => leadArea.includes(value));
      });
      if (!locationHit) continue;
      score += 35;
      reasons.push("service area match");
    }

    matches.push({ contractorId: profile.id, score: Math.min(100, score), reason: reasons.join(", ") });
  }

  if (!matches.length) return [];

  await admin.from("lead_matches").upsert(
    matches.map((match) => ({
      lead_id: lead.id,
      contractor_id: match.contractorId,
      match_score: match.score,
      match_reason: match.reason,
    })),
    { onConflict: "lead_id,contractor_id" }
  );

  const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
  if (!resend) return matches;

  const from =
    process.env.MARKETPLACE_FROM_EMAIL ||
    "Arkansas Land Pros <leads@arkansaslandpros.com>";
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.arkansaslandpros.com";

  await Promise.allSettled(
    matches.map(async (match) => {
      const profile = normalProfiles.find((p) => p.id === match.contractorId);
      if (!profile) return;

      await resend.emails.send({
        from,
        to: [profile.email],
        subject: `New ${lead.service_slug.replace(/-/g, " ")} opportunity near ${lead.city || lead.area}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;color:#171a1d">
            <div style="background:#171a1d;color:#fff;padding:22px;border-top:7px solid #c64e32">
              <div style="font-size:12px;letter-spacing:.12em;color:#f0b4a5">ARKANSAS LAND PROS</div>
              <h1 style="margin:6px 0 0;font-size:24px">New matching opportunity</h1>
            </div>
            <div style="border:1px solid #d5dadd;border-top:0;padding:22px">
              <p><strong>Area:</strong> ${lead.city || lead.area}</p>
              <p><strong>Work:</strong> ${lead.service_slug.replace(/-/g, " ")}</p>
              ${lead.property_size ? `<p><strong>Rough size:</strong> ${lead.property_size}</p>` : ""}
              ${lead.timeline ? `<p><strong>Timing:</strong> ${lead.timeline}</p>` : ""}
              <p><strong>Lead quality:</strong> ${lead.quality_band}</p>
              <p><strong>Unlock:</strong> ${formatMoney(lead.lead_price_cents)}</p>
              <p style="background:#f2f4f5;padding:14px">${lead.ai_summary || "Project details available in your dashboard."}</p>
              <p><a href="${baseUrl}/pro/leads/${lead.id}" style="background:#c64e32;color:#fff;text-decoration:none;padding:12px 16px;display:inline-block;font-weight:bold">View opportunity</a></p>
            </div>
          </div>
        `,
      });

      await admin
        .from("lead_matches")
        .update({ notified_at: new Date().toISOString() })
        .eq("lead_id", lead.id)
        .eq("contractor_id", match.contractorId);
    })
  );

  return matches;
}

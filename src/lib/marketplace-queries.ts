import { createAdminClient } from "@/lib/supabase/admin";
import type { ContractorContext } from "@/lib/contractor-auth";
import { isLeadAvailable } from "@/lib/marketplace";

export async function getContractorServicesAndTerritories(contractorId: string) {
  const admin = createAdminClient();
  const [{ data: services }, { data: territories }, { data: preferences }] =
    await Promise.all([
      admin.from("contractor_services").select("service_slug,enabled").eq("contractor_id", contractorId),
      admin.from("contractor_territories").select("id,city,county,zip,radius_miles").eq("contractor_id", contractorId),
      admin.from("contractor_preferences").select("*").eq("contractor_id", contractorId).maybeSingle(),
    ]);

  return {
    services: services || [],
    territories: territories || [],
    preferences,
  };
}

export async function getMarketplaceLeads(context: ContractorContext) {
  const admin = createAdminClient();

  if (context.profile.access_role === "house_owner") {
    const { data } = await admin
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(120);
    return data || [];
  }

  const [{ data: matches }, { data: unlocks }, { data: testLeads }] = await Promise.all([
    admin
      .from("lead_matches")
      .select("lead_id")
      .eq("contractor_id", context.profile.id)
      .is("hidden_at", null),
    admin
      .from("lead_unlocks")
      .select("lead_id")
      .eq("contractor_id", context.profile.id),
    admin
      .from("leads")
      .select("*")
      .eq("is_test", true)
      .eq("test_enabled", true)
      .eq("marketplace_enabled", true),
  ]);

  const ids = [...new Set([...(matches || []).map((r) => r.lead_id), ...(unlocks || []).map((r) => r.lead_id)])];
  const { data: matchedLeads } = ids.length
    ? await admin.from("leads").select("*").in("id", ids).order("created_at", { ascending: false })
    : { data: [] as Record<string, unknown>[] };

  const byId = new Map<string, any>();
  [...(matchedLeads || []), ...(testLeads || [])].forEach((lead: any) => byId.set(lead.id, lead));
  return [...byId.values()].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function getLeadForContractor(context: ContractorContext, leadId: string) {
  const admin = createAdminClient();
  const { data: lead } = await admin.from("leads").select("*").eq("id", leadId).maybeSingle();
  if (!lead) return null;

  if (context.profile.access_role === "house_owner") {
    return { lead, unlocked: true, matched: true, purchases: [] };
  }

  const [{ data: unlocks }, { data: match }, { data: purchases }] = await Promise.all([
    admin
      .from("lead_unlocks")
      .select("id,purchase_id,created_at")
      .eq("lead_id", leadId)
      .eq("contractor_id", context.profile.id),
    admin
      .from("lead_matches")
      .select("id")
      .eq("lead_id", leadId)
      .eq("contractor_id", context.profile.id)
      .is("hidden_at", null)
      .maybeSingle(),
    admin
      .from("lead_purchases")
      .select("id,status,amount_cents,is_test,paid_at,created_at")
      .eq("lead_id", leadId)
      .eq("contractor_id", context.profile.id)
      .order("created_at", { ascending: false }),
  ]);

  const unlocked = Boolean(unlocks?.length);
  const matched = Boolean(match) || (lead.is_test && lead.test_enabled);
  if (!unlocked && !matched) return null;

  return { lead, unlocked, matched, purchases: purchases || [] };
}

export function canBuyLead(lead: any, unlocked: boolean) {
  if (lead.is_test) return isLeadAvailable(lead);
  if (unlocked) return false;
  return isLeadAvailable(lead);
}

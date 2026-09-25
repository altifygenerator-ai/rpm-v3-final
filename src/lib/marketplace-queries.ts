import { createAdminClient } from "@/lib/supabase/admin";
import type { ContractorContext } from "@/lib/contractor-auth";
import { isLeadAvailable } from "@/lib/marketplace";

export type LeadRecord = {
  id: string;
  public_code: string;
  source: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  property_address: string | null;
  area: string;
  city: string | null;
  county: string | null;
  state: string;
  zip: string | null;
  service_slug: string;
  original_service: string | null;
  description: string;
  ai_summary: string | null;
  timeline: string | null;
  property_size: string | null;
  quality_score: number;
  quality_band: string;
  lead_price_cents: number;
  marketplace_status: string;
  marketplace_enabled: boolean;
  max_paid_unlocks: number | null;
  unlimited_unlocks: boolean;
  paid_unlock_count: number;
  expires_at: string | null;
  is_test: boolean;
  test_enabled: boolean;
  created_at: string;
};

export type PurchaseRecord = {
  id: string;
  status: string;
  amount_cents: number;
  is_test: boolean;
  paid_at: string | null;
  created_at: string;
};

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

  const byId = new Map<string, LeadRecord>();
  [...((matchedLeads || []) as LeadRecord[]), ...((testLeads || []) as LeadRecord[])].forEach((lead) => byId.set(lead.id, lead));
  return [...byId.values()].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function getLeadForContractor(context: ContractorContext, leadId: string) {
  const admin = createAdminClient();
  const { data: lead } = await admin.from("leads").select("*").eq("id", leadId).maybeSingle();
  if (!lead) return null;

  if (context.profile.access_role === "house_owner") {
    const { data: contractorOutcome } = await admin
      .from("contractor_lead_outcomes")
      .select("status")
      .eq("lead_id", leadId)
      .eq("contractor_id", context.profile.id)
      .maybeSingle();

    return {
      lead: lead as LeadRecord,
      unlocked: true,
      matched: true,
      purchases: [] as PurchaseRecord[],
      contractorOutcome: contractorOutcome?.status || null,
    };
  }

  const [
    { data: unlocks },
    { data: match },
    { data: purchases },
    { data: contractorOutcome },
  ] = await Promise.all([
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
    admin
      .from("contractor_lead_outcomes")
      .select("status")
      .eq("lead_id", leadId)
      .eq("contractor_id", context.profile.id)
      .maybeSingle(),
  ]);

  const unlocked = Boolean(unlocks?.length);
  const matched = Boolean(match) || (lead.is_test && lead.test_enabled);
  if (!unlocked && !matched) return null;

  return {
    lead: lead as LeadRecord,
    unlocked,
    matched,
    purchases: (purchases || []) as PurchaseRecord[],
    contractorOutcome: contractorOutcome?.status || null,
  };
}

export function canBuyLead(lead: LeadRecord, unlocked: boolean) {
  if (lead.is_test) return isLeadAvailable(lead);
  if (unlocked) return false;
  return isLeadAvailable(lead);
}

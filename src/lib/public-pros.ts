import { createAdminClient } from "@/lib/supabase/admin";

export type PublicPro = {
  id: string;
  business_name: string;
  slug: string;
  description: string | null;
  city: string | null;
  state: string;
  featured: boolean;
  insurance_verified: boolean;
  license_verified: boolean;
};

function normalize(value: string | null | undefined) {
  return String(value || "").trim().toLowerCase();
}

export async function getPublicPros({
  serviceSlug,
  areaName,
  limit = 6,
}: {
  serviceSlug?: string;
  areaName?: string;
  limit?: number;
}) {
  try {
    const admin = createAdminClient();
    let candidateIds: Set<string> | null = null;

    if (serviceSlug) {
      const { data: services } = await admin
        .from("contractor_services")
        .select("contractor_id")
        .eq("service_slug", serviceSlug)
        .eq("enabled", true);

      candidateIds = new Set((services || []).map((row) => row.contractor_id));
    }

    if (areaName) {
      const { data: territories } = await admin
        .from("contractor_territories")
        .select("contractor_id,city,county,zip")
        .limit(1000);

      const target = normalize(areaName);
      const areaIds = new Set(
        (territories || [])
          .filter((territory) => {
            const values = [territory.city, territory.county, territory.zip]
              .map(normalize)
              .filter(Boolean);
            return values.some(
              (value) => value.includes(target) || target.includes(value)
            );
          })
          .map((territory) => territory.contractor_id)
      );

      candidateIds =
        candidateIds === null
          ? areaIds
          : new Set([...candidateIds].filter((id) => areaIds.has(id)));
    }

    let query = admin
      .from("contractor_profiles")
      .select(
        "id,business_name,slug,description,city,state,featured,insurance_verified,license_verified"
      )
      .eq("status", "active")
      .eq("public_profile_enabled", true)
      .order("featured", { ascending: false })
      .order("business_name")
      .limit(limit);

    if (candidateIds !== null) {
      const ids = [...candidateIds];
      if (!ids.length) return [];
      query = query.in("id", ids);
    }

    const { data, error } = await query;
    if (error) {
      console.error("Public pro lookup failed", error);
      return [];
    }

    return (data || []) as PublicPro[];
  } catch (error) {
    console.error("Public pro lookup unavailable", error);
    return [];
  }
}

import { createAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type ContractorContext = {
  user: {
    id: string;
    email: string;
  };
  profile: {
    id: string;
    user_id: string | null;
    email: string;
    business_name: string;
    slug: string;
    contact_name: string | null;
    phone: string | null;
    website_url: string | null;
    facebook_url: string | null;
    description: string | null;
    logo_url: string | null;
    city: string | null;
    state: string;
    zip: string | null;
    status: "pending" | "active" | "suspended";
    access_role: "normal" | "house_owner";
    public_profile_enabled: boolean;
    featured: boolean;
    onboarding_completed: boolean;
    stripe_customer_id: string | null;
  };
};

export async function getContractorContext(): Promise<ContractorContext | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) return null;

  const admin = createAdminClient();
  const { data: profile, error } = await admin
    .from("contractor_profiles")
    .select(
      "id,user_id,email,business_name,slug,contact_name,phone,website_url,facebook_url,description,logo_url,city,state,zip,status,access_role,public_profile_enabled,featured,onboarding_completed,stripe_customer_id"
    )
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !profile) return null;

  return {
    user: { id: user.id, email: user.email },
    profile,
  } as ContractorContext;
}

export async function requireHouseOwner() {
  const context = await getContractorContext();
  if (!context || context.profile.access_role !== "house_owner") {
    return null;
  }
  return context;
}

import Link from "next/link";
import { redirect } from "next/navigation";
import ProDashboardShell from "@/components/pro-dashboard-shell";
import HouseContractorControls from "@/components/house-contractor-controls";
import { requireHouseOwner } from "@/lib/contractor-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function ContractorControlPage() {
  const context = await requireHouseOwner();
  if (!context) redirect("/pro/dashboard");

  const admin = createAdminClient();
  const { data: contractors } = await admin
    .from("contractor_profiles")
    .select("id,email,business_name,slug,city,state,status,access_role,public_profile_enabled,featured,insurance_verified,license_verified,onboarding_completed,created_at")
    .eq("access_role", "normal")
    .order("created_at", { ascending: false });

  return (
    <ProDashboardShell context={context}>
      <header className="pro-page-head">
        <p className="field-label">CONTRACTOR CONTROL</p>
        <h1>Marketplace contractor accounts.</h1>
        <p>Manage normal contractor access and directory visibility. These internal controls do not appear on public contractor profiles.</p>
      </header>

      <div className="house-contractor-list">
        {(contractors || []).map((contractor) => (
          <article key={contractor.id}>
            <div>
              <span>{contractor.status} • {contractor.onboarding_completed ? "profile complete" : "onboarding incomplete"}</span>
              <strong>{contractor.business_name}</strong>
              <p>{contractor.email}</p>
              <small>{contractor.city ? `${contractor.city}, ${contractor.state}` : contractor.state}</small>
              <Link href={`/pros/${contractor.slug}`}>View public listing →</Link>
            </div>
            <HouseContractorControls
              contractorId={contractor.id}
              status={contractor.status}
              visible={contractor.public_profile_enabled}
              featured={contractor.featured}
              insuranceVerified={contractor.insurance_verified}
              licenseVerified={contractor.license_verified}
            />
          </article>
        ))}
      </div>

      {!contractors?.length ? (
        <div className="pro-empty-state">
          <h2>No normal contractor accounts yet.</h2>
          <p>New contractor signups will appear here.</p>
        </div>
      ) : null}
    </ProDashboardShell>
  );
}

import { requireHouseOwner } from "@/lib/contractor-auth";
import { createAdminClient } from "@/lib/supabase/admin";

type Props = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Props) {
  const context = await requireHouseOwner();
  if (!context) {
    return Response.json({ success: false, error: "Not authorized." }, { status: 403 });
  }

  const { id } = await params;
  if (id === context.profile.id) {
    return Response.json(
      { success: false, error: "House account permissions cannot be changed from this screen." },
      { status: 400 }
    );
  }

  const body = await request.json();
  const action = String(body.action || "");
  const admin = createAdminClient();

  const { data: target } = await admin
    .from("contractor_profiles")
    .select("id,access_role")
    .eq("id", id)
    .maybeSingle();

  if (!target || target.access_role !== "normal") {
    return Response.json({ success: false, error: "Normal contractor account not found." }, { status: 404 });
  }

  const updates: Record<string, boolean | string> = {};

  if (action === "activate") updates.status = "active";
  else if (action === "suspend") updates.status = "suspended";
  else if (action === "show_profile") updates.public_profile_enabled = true;
  else if (action === "hide_profile") updates.public_profile_enabled = false;
  else if (action === "feature") updates.featured = true;
  else if (action === "unfeature") updates.featured = false;
  else if (action === "verify_insurance") updates.insurance_verified = true;
  else if (action === "clear_insurance") updates.insurance_verified = false;
  else if (action === "verify_license") updates.license_verified = true;
  else if (action === "clear_license") updates.license_verified = false;
  else {
    return Response.json({ success: false, error: "Unknown contractor action." }, { status: 400 });
  }

  const { error } = await admin.from("contractor_profiles").update(updates).eq("id", id);
  if (error) throw error;

  return Response.json({ success: true });
}

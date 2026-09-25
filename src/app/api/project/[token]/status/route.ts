import { Resend } from "resend";
import { hashProjectToken } from "@/lib/customer-project";
import { cleanText } from "@/lib/marketplace";
import { createAdminClient } from "@/lib/supabase/admin";

type Props = {
  params: Promise<{ token: string }>;
};

export async function POST(request: Request, { params }: Props) {
  try {
    const { token } = await params;
    if (!token || token.length < 30) {
      return Response.json({ success: false, error: "Invalid project link." }, { status: 400 });
    }

    const body = await request.json();
    const action = cleanText(body.action, 40);
    const contractorId = cleanText(body.contractorId, 80) || null;
    const allowed = ["still_looking", "on_hold", "hired", "cancelled"];

    if (!allowed.includes(action)) {
      return Response.json({ success: false, error: "Invalid project status." }, { status: 400 });
    }

    const admin = createAdminClient();
    const tokenHash = hashProjectToken(token);
    const { data: access } = await admin
      .from("lead_customer_access")
      .select("lead_id,expires_at")
      .eq("token_hash", tokenHash)
      .gt("expires_at", new Date().toISOString())
      .maybeSingle();

    if (!access) {
      return Response.json({ success: false, error: "This project link is no longer valid." }, { status: 404 });
    }

    const { data: lead } = await admin
      .from("leads")
      .select("id,paid_unlock_count,max_paid_unlocks,unlimited_unlocks,marketplace_status,marketplace_enabled")
      .eq("id", access.lead_id)
      .maybeSingle();

    if (!lead) {
      return Response.json({ success: false, error: "Project not found." }, { status: 404 });
    }

    let validHiredContractor: string | null = null;

    if (action === "hired" && contractorId) {
      const [{ data: unlocked }, { data: house }] = await Promise.all([
        admin
          .from("lead_unlocks")
          .select("id")
          .eq("lead_id", lead.id)
          .eq("contractor_id", contractorId)
          .limit(1)
          .maybeSingle(),
        admin
          .from("contractor_profiles")
          .select("id")
          .eq("id", contractorId)
          .eq("access_role", "house_owner")
          .eq("status", "active")
          .maybeSingle(),
      ]);

      if (!unlocked && !house) {
        return Response.json({ success: false, error: "That contractor is not connected with this project." }, { status: 400 });
      }

      validHiredContractor = contractorId;
    }

    const now = new Date();
    const eventType = `customer_${action}`;

    if (action === "hired") {
      await admin
        .from("leads")
        .update({
          marketplace_enabled: false,
          marketplace_status: "sold_out",
        })
        .eq("id", lead.id);

      await admin.from("lead_outcomes").upsert({
        lead_id: lead.id,
        status: "hired",
        hired_contractor_id: validHiredContractor,
        customer_confirmed: true,
        updated_at: now.toISOString(),
      });
    } else if (action === "cancelled") {
      await admin
        .from("leads")
        .update({
          marketplace_enabled: false,
          marketplace_status: "cancelled",
        })
        .eq("id", lead.id);

      await admin.from("lead_outcomes").upsert({
        lead_id: lead.id,
        status: "project_cancelled",
        hired_contractor_id: null,
        customer_confirmed: true,
        updated_at: now.toISOString(),
      });
    } else if (action === "on_hold") {
      await admin
        .from("leads")
        .update({
          marketplace_enabled: false,
          marketplace_status: "paused",
        })
        .eq("id", lead.id);

      await admin.from("lead_outcomes").upsert({
        lead_id: lead.id,
        status: "on_hold",
        hired_contractor_id: null,
        customer_confirmed: true,
        updated_at: now.toISOString(),
      });
    } else {
      const max = lead.max_paid_unlocks || 2;
      const canReopen = lead.unlimited_unlocks || lead.paid_unlock_count < max;

      if (canReopen) {
        await admin
          .from("leads")
          .update({
            marketplace_enabled: true,
            marketplace_status: "available",
            expires_at: new Date(now.getTime() + 7 * 86400000).toISOString(),
          })
          .eq("id", lead.id);
      }

      await admin.from("lead_outcomes").upsert({
        lead_id: lead.id,
        status: "still_looking",
        hired_contractor_id: null,
        customer_confirmed: true,
        updated_at: now.toISOString(),
      });
    }

    await admin.from("lead_events").insert({
      lead_id: lead.id,
      contractor_id: validHiredContractor,
      event_type: eventType,
      metadata: {
        customer_confirmed: true,
        hired_contractor_id: validHiredContractor,
      },
    });

    if (action === "hired" && validHiredContractor && process.env.RESEND_API_KEY) {
      const { data: contractor } = await admin
        .from("contractor_profiles")
        .select("email,business_name")
        .eq("id", validHiredContractor)
        .maybeSingle();

      if (contractor) {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from:
            process.env.MARKETPLACE_FROM_EMAIL ||
            "Arkansas Land Pros <leads@arkansaslandpros.com>",
          to: [contractor.email],
          subject: "Homeowner confirmed they hired your business",
          html: `<p>The homeowner confirmed through Arkansas Land Pros that they hired <strong>${contractor.business_name}</strong> for this project.</p><p>The lead has been retired from the marketplace.</p>`,
        });
      }
    }

    await admin
      .from("lead_customer_access")
      .update({ last_used_at: now.toISOString() })
      .eq("lead_id", lead.id);

    return Response.json({
      success: true,
      message:
        action === "hired"
          ? "Thanks — the project has been marked hired and removed from the marketplace."
          : action === "cancelled"
            ? "The project has been closed and removed from the marketplace."
            : action === "on_hold"
              ? "The project is on hold and has been removed from the marketplace for now."
              : "Got it — we’ve marked the project as still looking.",
    });
  } catch (error) {
    console.error("Customer project status error", error);
    return Response.json({ success: false, error: "Could not update the project." }, { status: 500 });
  }
}

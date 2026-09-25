import { createHash } from "node:crypto";
import { cleanText } from "@/lib/marketplace";
import { createAdminClient } from "@/lib/supabase/admin";

const buckets = new Map<string, { count: number; resetAt: number }>();

function limited(key: string) {
  const now = Date.now();
  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return false;
  }
  current.count += 1;
  return current.count > 12;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = cleanText(body.token, 200);
    const status = cleanText(body.status, 40);
    const hiredContractorId = cleanText(body.hiredContractorId, 80);

    if (!token || !["still_looking", "on_hold", "hired", "project_cancelled"].includes(status)) {
      return Response.json(
        { success: false, error: "Invalid project update." },
        { status: 400 }
      );
    }

    const tokenHash = createHash("sha256").update(token).digest("hex");
    if (limited(tokenHash)) {
      return Response.json(
        { success: false, error: "Too many updates. Please try again later." },
        { status: 429 }
      );
    }

    const admin = createAdminClient();
    const { data, error } = await admin.rpc("customer_update_project_status", {
      p_token_hash: tokenHash,
      p_status: status,
      p_hired_contractor_id:
        status === "hired" && hiredContractorId
          ? hiredContractorId
          : null,
    });

    if (error || !data?.length) {
      console.error("Customer project status update failed", error);
      return Response.json(
        { success: false, error: "The project could not be updated." },
        { status: 400 }
      );
    }

    return Response.json({
      success: true,
      outcomeStatus: data[0].outcome_status,
      marketplaceStatus: data[0].marketplace_status,
    });
  } catch (error) {
    console.error("Customer project status error", error);
    return Response.json(
      { success: false, error: "The project could not be updated." },
      { status: 500 }
    );
  }
}

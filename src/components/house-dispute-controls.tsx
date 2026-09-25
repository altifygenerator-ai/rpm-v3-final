"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HouseDisputeControls({
  disputeId,
}: {
  disputeId: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  async function run(action: string) {
    setBusy(action);
    setError("");
    try {
      const response = await fetch(`/api/house/disputes/${disputeId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || "Could not update review.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update review.");
    } finally {
      setBusy("");
    }
  }

  return (
    <div className="house-dispute-controls">
      <button type="button" onClick={() => run("deny")} disabled={Boolean(busy)}>
        Deny review
      </button>
      <button type="button" onClick={() => run("refund")} disabled={Boolean(busy)}>
        {busy === "refund" ? "Refunding…" : "Refund purchase"}
      </button>
      <button type="button" onClick={() => run("refund_and_pull")} disabled={Boolean(busy)}>
        {busy === "refund_and_pull" ? "Refunding…" : "Refund + mark lead invalid"}
      </button>
      {error ? <small>{error}</small> : null}
    </div>
  );
}

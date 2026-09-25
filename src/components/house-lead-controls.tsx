"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HouseLeadControls({
  leadId,
  status,
  enabled,
  isTest,
  testEnabled,
}: {
  leadId: string;
  status: string;
  enabled: boolean;
  isTest: boolean;
  testEnabled: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState("");

  async function action(value: string) {
    setBusy(value);
    try {
      await fetch(`/api/house/leads/${leadId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: value }),
      });
      router.refresh();
    } finally {
      setBusy("");
    }
  }

  return (
    <div className="house-controls">
      {enabled && status === "available" ? (
        <button type="button" onClick={() => action("pause")} disabled={Boolean(busy)}>
          {busy === "pause" ? "Pausing…" : "Pull from marketplace"}
        </button>
      ) : (
        <button type="button" onClick={() => action("resume")} disabled={Boolean(busy)}>
          {busy === "resume" ? "Restoring…" : "Return to marketplace"}
        </button>
      )}
      <button type="button" onClick={() => action("cancel")} disabled={Boolean(busy)}>
        Retire lead
      </button>
      <button type="button" onClick={() => action("invalidate")} disabled={Boolean(busy)}>
        Mark invalid
      </button>
      {isTest ? (
        <button type="button" onClick={() => action("toggle_test")} disabled={Boolean(busy)}>
          {testEnabled ? "Turn $1 test lead off" : "Turn $1 test lead on"}
        </button>
      ) : null}
    </div>
  );
}

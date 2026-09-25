"use client";

import { useState } from "react";

const options = [
  ["contacted", "Contacted"],
  ["estimate_scheduled", "Estimate scheduled"],
  ["hired", "Got the job"],
  ["not_hired", "Didn’t get the job"],
  ["completed", "Job completed"],
] as const;

export default function LeadOutcomeActions({ leadId }: { leadId: string }) {
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");

  async function update(value: string) {
    setStatus(value);
    setMessage("");
    const response = await fetch("/api/marketplace/outcome", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadId, status: value }),
    });
    const result = await response.json();
    setMessage(result.success ? "Lead status updated." : result.error || "Could not update.");
    setStatus("");
  }

  return (
    <div className="outcome-actions">
      <strong>How did this lead go?</strong>
      <div>
        {options.map(([value, label]) => (
          <button key={value} type="button" onClick={() => update(value)} disabled={Boolean(status)}>
            {status === value ? "Saving…" : label}
          </button>
        ))}
      </div>
      {message ? <small>{message}</small> : null}
    </div>
  );
}

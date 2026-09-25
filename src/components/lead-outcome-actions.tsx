"use client";

import { useState } from "react";

const options = [
  ["contacted", "Contacted"],
  ["estimate_scheduled", "Estimate scheduled"],
  ["hired", "Got the job"],
  ["not_hired", "Didn’t get the job"],
  ["completed", "Job completed"],
] as const;

export default function LeadOutcomeActions({
  leadId,
  initialStatus,
}: {
  leadId: string;
  initialStatus?: string;
}) {
  const [status, setStatus] = useState("");
  const [savedStatus, setSavedStatus] = useState(initialStatus || "");
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
    if (result.success) {
      setSavedStatus(value);
      setMessage(
        value === "hired"
          ? "Marked as got the job. The project is only closed when the homeowner confirms it."
          : "Lead status updated."
      );
    } else {
      setMessage(result.error || "Could not update.");
    }
    setStatus("");
  }

  return (
    <div className="outcome-actions">
      <strong>How did this lead go?</strong>
      {savedStatus ? (
        <small>Current status: {savedStatus.replace(/_/g, " ")}</small>
      ) : null}
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

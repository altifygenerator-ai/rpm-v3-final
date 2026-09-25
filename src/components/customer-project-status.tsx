"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type ContractorOption = {
  id: string;
  business_name: string;
  slug: string;
};

export default function CustomerProjectStatus({
  token,
  currentStatus,
  contractors,
}: {
  token: string;
  currentStatus: string;
  contractors: ContractorOption[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");
  const [showHire, setShowHire] = useState(false);
  const [contractorId, setContractorId] = useState("");

  async function update(action: string, selectedContractorId?: string) {
    setBusy(action);
    setMessage("");

    try {
      const response = await fetch(`/api/project/${encodeURIComponent(token)}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          contractorId: selectedContractorId || null,
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Could not update the project.");
      }
      setMessage(result.message || "Project status updated.");
      setShowHire(false);
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not update the project.");
    } finally {
      setBusy("");
    }
  }

  return (
    <section className="customer-status-card">
      <span>CURRENT STATUS</span>
      <strong>{currentStatus.replace(/_/g, " ")}</strong>
      <p>
        Keeping this current helps stop unnecessary contractor contact and keeps
        the project from staying available after you have made a decision.
      </p>

      <div className="customer-status-actions">
        <button
          type="button"
          onClick={() => update("still_looking")}
          disabled={Boolean(busy)}
        >
          {busy === "still_looking" ? "Saving…" : "I’m still looking"}
        </button>
        <button
          type="button"
          onClick={() => update("on_hold")}
          disabled={Boolean(busy)}
        >
          {busy === "on_hold" ? "Saving…" : "Put the project on hold"}
        </button>
        <button
          type="button"
          className="primary"
          onClick={() => setShowHire((value) => !value)}
          disabled={Boolean(busy)}
        >
          I hired someone
        </button>
        <button
          type="button"
          onClick={() => update("cancelled")}
          disabled={Boolean(busy)}
        >
          {busy === "cancelled" ? "Saving…" : "I’m not doing the project"}
        </button>
      </div>

      {showHire ? (
        <div className="customer-hire-box">
          <label>
            <span>Who did you hire?</span>
            <select
              value={contractorId}
              onChange={(event) => setContractorId(event.target.value)}
            >
              <option value="">Someone else / not listed here</option>
              {contractors.map((contractor) => (
                <option value={contractor.id} key={contractor.id}>
                  {contractor.business_name}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            className="work-button"
            onClick={() => update("hired", contractorId)}
            disabled={Boolean(busy)}
          >
            {busy === "hired" ? "Confirming…" : "Confirm hire"}
          </button>
        </div>
      ) : null}

      {message ? <p className="customer-status-message">{message}</p> : null}
    </section>
  );
}

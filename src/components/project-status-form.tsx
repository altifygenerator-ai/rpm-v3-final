"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Contractor = {
  id: string;
  business_name: string;
};

export default function ProjectStatusForm({
  token,
  contractors,
  currentStatus,
}: {
  token: string;
  contractors: Contractor[];
  currentStatus: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");
  const [hiredContractor, setHiredContractor] = useState("");

  async function update(status: string) {
    setBusy(status);
    setMessage("");
    try {
      const response = await fetch("/api/project-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          status,
          hiredContractorId:
            status === "hired" && hiredContractor
              ? hiredContractor
              : null,
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Could not update the project.");
      }
      setMessage("Project status updated.");
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not update the project."
      );
    } finally {
      setBusy("");
    }
  }

  return (
    <div className="project-status-actions">
      <div className="project-status-current">
        <span>Current project status</span>
        <strong>{currentStatus.replace(/_/g, " ")}</strong>
      </div>

      <button
        type="button"
        onClick={() => update("still_looking")}
        disabled={Boolean(busy)}
      >
        {busy === "still_looking" ? "Updating…" : "I’m still looking"}
      </button>

      <button
        type="button"
        onClick={() => update("paused")}
        disabled={Boolean(busy)}
      >
        {busy === "paused" ? "Updating…" : "Put the project on hold"}
      </button>

      <div className="project-hired-box">
        <strong>I hired someone</strong>
        <p>
          If the contractor came through Arkansas Land Pros, choosing them helps
          us stop showing the project to other pros.
        </p>
        <select
          value={hiredContractor}
          onChange={(event) => setHiredContractor(event.target.value)}
        >
          <option value="">Someone else / not listed</option>
          {contractors.map((contractor) => (
            <option key={contractor.id} value={contractor.id}>
              {contractor.business_name}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => update("hired")}
          disabled={Boolean(busy)}
        >
          {busy === "hired" ? "Updating…" : "Mark as hired"}
        </button>
      </div>

      <button
        className="project-cancel-button"
        type="button"
        onClick={() => update("project_cancelled")}
        disabled={Boolean(busy)}
      >
        {busy === "project_cancelled"
          ? "Updating…"
          : "I’m not moving forward with the project"}
      </button>

      {message ? <p className="project-status-message">{message}</p> : null}
    </div>
  );
}

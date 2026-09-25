"use client";

import { useState } from "react";

export default function LeadPurchaseButton({
  leadId,
  label,
}: {
  leadId: string;
  label: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function buy() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/marketplace/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId }),
      });
      const result = await response.json();
      if (!response.ok || !result.success || !result.url) {
        throw new Error(result.error || "Checkout could not be started.");
      }
      window.location.href = result.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout could not be started.");
      setLoading(false);
    }
  }

  return (
    <div>
      <button className="work-button" type="button" onClick={buy} disabled={loading}>
        {loading ? "Opening secure checkout…" : label}
      </button>
      {error ? <p className="form-message form-error">{error}</p> : null}
    </div>
  );
}

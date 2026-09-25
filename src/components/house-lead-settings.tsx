"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function HouseLeadSettings({
  leadId,
  priceCents,
  maxUnlocks,
  unlimited,
}: {
  leadId: string;
  priceCents: number;
  maxUnlocks: number | null;
  unlimited: boolean;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setSaving(true);
    setMessage("");

    const response = await fetch(`/api/house/leads/${leadId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "update_settings",
        priceDollars: data.get("priceDollars"),
        maxUnlocks: data.get("maxUnlocks"),
        unlimited: data.get("unlimited") === "on",
      }),
    });
    const result = await response.json();
    setSaving(false);
    setMessage(result.success ? "Marketplace settings updated." : result.error || "Could not update.");
    if (result.success) router.refresh();
  }

  return (
    <form className="house-lead-settings" onSubmit={submit}>
      <strong>Marketplace settings</strong>
      <label>
        <span>Lead price</span>
        <input name="priceDollars" type="number" min="1" step="1" defaultValue={(priceCents / 100).toFixed(0)} />
      </label>
      <label>
        <span>Paid unlock limit</span>
        <input name="maxUnlocks" type="number" min="1" max="20" defaultValue={maxUnlocks || 2} />
      </label>
      <label className="house-check">
        <input name="unlimited" type="checkbox" defaultChecked={unlimited} />
        <span>Unlimited purchases</span>
      </label>
      <button type="submit" disabled={saving}>{saving ? "Saving…" : "Save settings"}</button>
      {message ? <small>{message}</small> : null}
    </form>
  );
}

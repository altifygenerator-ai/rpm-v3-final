"use client";

import { FormEvent, useState } from "react";

export default function LeadDisputeForm({
  leadId,
  purchaseId,
}: {
  leadId: string;
  purchaseId: string;
}) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setStatus("sending");
    setMessage("");

    const response = await fetch("/api/marketplace/dispute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        leadId,
        purchaseId,
        reason: data.get("reason"),
        details: data.get("details"),
      }),
    });
    const result = await response.json();

    if (response.ok && result.success) {
      setStatus("sent");
      setMessage("Review request submitted.");
    } else {
      setStatus("idle");
      setMessage(result.error || "Could not submit review request.");
    }
  }

  if (status === "sent") {
    return <p className="pro-notice">{message}</p>;
  }

  return (
    <div className="lead-dispute">
      <button type="button" onClick={() => setOpen((value) => !value)}>
        {open ? "Close lead issue form" : "Report a bad or invalid lead"}
      </button>
      {open ? (
        <form onSubmit={submit}>
          <label>
            <span>Reason</span>
            <select name="reason" required defaultValue="">
              <option value="" disabled>Select a reason</option>
              <option value="invalid_contact">Invalid phone/email</option>
              <option value="duplicate">Duplicate lead I already purchased</option>
              <option value="wrong_service">Materially wrong service</option>
              <option value="wrong_location">Materially wrong location</option>
              <option value="fake_spam">Fake or spam submission</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label>
            <span>Details</span>
            <textarea name="details" rows={3} maxLength={1200} />
          </label>
          <button className="work-button" type="submit" disabled={status === "sending"}>
            {status === "sending" ? "Submitting…" : "Submit for review"}
          </button>
        </form>
      ) : null}
      {message ? <small>{message}</small> : null}
    </div>
  );
}

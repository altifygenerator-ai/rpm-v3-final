"use client";

import { FormEvent, useRef, useState } from "react";
import Link from "next/link";
import TurnstileWidget from "@/components/turnstile-widget";

export default function ProsAuthForm({ mode }: { mode: "join" | "signin" }) {
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setError("");

    if (!token && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
      setError("Please complete the verification before continuing.");
      return;
    }

    setStatus("sending");

    try {
      const response = await fetch("/api/pros/auth/send-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          email: data.get("email"),
          businessName: data.get("businessName"),
          contactName: data.get("contactName"),
          turnstileToken: token,
          termsAccepted: data.get("termsAccepted") === "on",
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || "Could not send sign-in link.");
      setStatus("sent");
      formRef.current?.reset();
    } catch (err) {
      setStatus("idle");
      setError(err instanceof Error ? err.message : "Could not send sign-in link.");
    }
  }

  if (status === "sent") {
    return (
      <div className="pro-auth-success">
        <strong>Check your email.</strong>
        <p>We sent a secure Arkansas Land Pros sign-in link. Open it on this device to continue.</p>
      </div>
    );
  }

  return (
    <form ref={formRef} className="pro-auth-form" onSubmit={submit}>
      {mode === "join" ? (
        <>
          <label>
            <span>Business name</span>
            <input name="businessName" required maxLength={120} />
          </label>
          <label>
            <span>Your name</span>
            <input name="contactName" autoComplete="name" maxLength={100} />
          </label>
        </>
      ) : null}
      <label>
        <span>Business email</span>
        <input name="email" type="email" autoComplete="email" required maxLength={160} />
      </label>
      {mode === "join" ? (
        <label className="pro-auth-consent">
          <input name="termsAccepted" type="checkbox" required />
          <span>
            I agree to the Arkansas Land Pros <Link href="/terms">Terms</Link> and{" "}
            <Link href="/privacy">Privacy Policy</Link>, including the contractor
            profile and paid lead marketplace terms.
          </span>
        </label>
      ) : null}
      <TurnstileWidget onToken={setToken} />
      {error ? <p className="form-message form-error">{error}</p> : null}
      <button className="work-button" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending secure link…" : mode === "join" ? "Create my free profile" : "Email me a sign-in link"}
      </button>
      <p className="pro-form-fineprint">No password required. Your secure link is emailed directly to you.</p>
    </form>
  );
}

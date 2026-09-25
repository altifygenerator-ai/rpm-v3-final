"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { areas } from "@/data/areas";
import { services } from "@/data/services";
import { getAttribution, trackEvent } from "@/lib/tracking";
import TurnstileWidget from "@/components/turnstile-widget";

type Props = {
  source?: string;
  compact?: boolean;
  heading?: string;
  serviceDefault?: string;
  areaDefault?: string;
};

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "success"; leadId: string }
  | { kind: "error"; message: string };

export default function JobRequestForm({
  source = "form",
  compact = false,
  heading = "Tell us what needs done.",
  serviceDefault = "",
  areaDefault = "",
}: Props) {
  const startedAt = useRef(Date.now());
  const [turnstileToken, setTurnstileToken] = useState("");
  const [resetKey, setResetKey] = useState(0);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const coreServices = useMemo(
    () =>
      services.filter(
        (service) =>
          !["airbnb", "water-features", "outdoor-builds", "welding"].includes(
            service.slug
          )
      ),
    []
  );

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    if (!turnstileToken && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
      setStatus({
        kind: "error",
        message: "Please complete the verification before sending.",
      });
      return;
    }

    setStatus({ kind: "sending" });

    const payload = {
      source,
      name: String(data.get("name") || ""),
      phone: String(data.get("phone") || ""),
      email: String(data.get("email") || ""),
      area: String(data.get("area") || ""),
      service: String(data.get("service") || ""),
      timeline: String(data.get("timeline") || ""),
      propertySize: String(data.get("propertySize") || ""),
      message: String(data.get("message") || ""),
      companyWebsite: String(data.get("companyWebsite") || ""),
      startedAt: startedAt.current,
      turnstileToken,
      ...getAttribution(),
    };

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "The request could not be sent.");
      }

      trackEvent("Lead Submitted", {
        source,
        service: payload.service || "not-set",
      });

      form.reset();
      startedAt.current = Date.now();
      setResetKey((value) => value + 1);
      setStatus({ kind: "success", leadId: result.leadId || "received" });
    } catch (error) {
      setStatus({
        kind: "error",
        message:
          error instanceof Error
            ? error.message
            : "The request could not be sent. Please try again.",
      });
    }
  }

  return (
    <form className={compact ? "job-form job-form-compact" : "job-form"} onSubmit={submit}>
      <div className="job-form-heading">
        <span>JOB REQUEST</span>
        <h2>{heading}</h2>
        <p>
          A short description is enough to start. We route the request after it
          comes in.
        </p>
      </div>

      <div className="form-grid">
        <label>
          <span>Name</span>
          <input name="name" autoComplete="name" required maxLength={80} />
        </label>

        <label>
          <span>Phone</span>
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            maxLength={30}
            inputMode="tel"
          />
        </label>

        <label>
          <span>Email <small>optional</small></span>
          <input name="email" type="email" autoComplete="email" maxLength={120} />
        </label>

        <label>
          <span>Town / property area</span>
          <select name="area" defaultValue={areaDefault} required>
            <option value="">Choose an area</option>
            {areas.map((area) => (
              <option key={area.slug} value={area.name}>
                {area.name}
              </option>
            ))}
            <option value="Elsewhere in Arkansas">Elsewhere in Arkansas</option>
          </select>
        </label>

        <label className="form-span">
          <span>What kind of work?</span>
          <select name="service" defaultValue={serviceDefault} required>
            <option value="">Choose the closest fit</option>
            {coreServices.map((service) => (
              <option key={service.slug} value={service.shortTitle}>
                {service.shortTitle}
              </option>
            ))}
            <option value="Not sure">Not sure / mixed property work</option>
          </select>
        </label>

        {!compact && (
          <>
            <label>
              <span>Timing <small>optional</small></span>
              <select name="timeline" defaultValue="">
                <option value="">No set timing</option>
                <option value="As soon as practical">As soon as practical</option>
                <option value="Within a month">Within a month</option>
                <option value="1-3 months">1–3 months</option>
                <option value="Planning ahead">Planning ahead</option>
              </select>
            </label>

            <label>
              <span>Rough size <small>optional</small></span>
              <input
                name="propertySize"
                maxLength={80}
                placeholder="Example: 2 acres, 300 ft drive"
              />
            </label>
          </>
        )}

        <label className="form-span">
          <span>What needs done?</span>
          <textarea
            name="message"
            required
            minLength={10}
            maxLength={1800}
            rows={compact ? 3 : 5}
            placeholder="Tell us what the property looks like now and what you want changed."
          />
        </label>

        <label className="hp-field" aria-hidden="true">
          <span>Company website</span>
          <input
            name="companyWebsite"
            tabIndex={-1}
            autoComplete="off"
            defaultValue=""
          />
        </label>
      </div>

      <TurnstileWidget onToken={setTurnstileToken} resetKey={resetKey} />

      {status.kind === "error" && (
        <p className="form-message form-error" role="alert">
          {status.message}
        </p>
      )}

      {status.kind === "success" && (
        <div className="form-message form-success" role="status">
          <strong>Request received.</strong>
          <span>Reference: {status.leadId}</span>
        </div>
      )}

      <button
        className="work-button"
        type="submit"
        disabled={status.kind === "sending"}
        onClick={() => trackEvent("Lead Submit Click", { source })}
      >
        {status.kind === "sending" ? "Sending request…" : "Send job request"}
      </button>

      <p className="form-consent">
        By sending this request, you agree to our{" "}
        <Link href="/terms">Terms</Link> and <Link href="/privacy">Privacy Policy</Link>{" "}
        and allow the request to be shared with a service provider that may be
        able to help.
      </p>
    </form>
  );
}

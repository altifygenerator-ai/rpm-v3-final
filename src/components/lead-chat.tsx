"use client";

import { FormEvent, useRef, useState } from "react";
import TurnstileWidget from "@/components/turnstile-widget";
import { getAttribution, trackEvent } from "@/lib/tracking";

const quickServices = [
  "Land clearing",
  "Dirt work",
  "Driveway work",
  "Drainage",
  "Brush clearing",
  "Property cleanup",
];

const timingOptions = [
  "As soon as practical",
  "Within a month",
  "1–3 months",
  "Planning ahead",
];

type ChatData = {
  service: string;
  area: string;
  timeline: string;
  message: string;
  name: string;
  phone: string;
  email: string;
};

const emptyData: ChatData = {
  service: "",
  area: "",
  timeline: "",
  message: "",
  name: "",
  phone: "",
  email: "",
};

export default function LeadChat() {
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState<"service" | "area" | "timing" | "details" | "contact" | "sent">("service");
  const [data, setData] = useState<ChatData>(emptyData);
  const [token, setToken] = useState("");
  const [resetKey, setResetKey] = useState(0);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [leadId, setLeadId] = useState("");
  const startedAt = useRef(0);

  function openChat() {
    setOpen(true);
    trackEvent("Lead Chat Open", { source: "floating-chat" });
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!data.name.trim() || !data.phone.trim()) {
      setError("Name and phone are required.");
      return;
    }
    if (!token && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
      setError("Please complete the verification.");
      return;
    }

    setSending(true);
    setError("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          source: "chat",
          companyWebsite: "",
          startedAt: startedAt.current,
          turnstileToken: token,
          ...getAttribution(),
        }),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "The request could not be sent.");
      }

      trackEvent("Lead Submitted", {
        source: "chat",
        service: data.service || "not-set",
      });

      setLeadId(result.leadId || "received");
      setStage("sent");
      setResetKey((value) => value + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "The request could not be sent.");
    } finally {
      setSending(false);
    }
  }

  function reset() {
    setData(emptyData);
    setStage("service");
    setError("");
    setLeadId("");
    setToken("");
    startedAt.current = 0;
    setResetKey((value) => value + 1);
  }

  return (
    <div className="lead-chat-shell">
      {!open && (
        <button className="chat-launcher" type="button" onClick={openChat}>
          <span className="chat-dot" />
          Tell us about the property
        </button>
      )}

      {open && (
        <section className="lead-chat" aria-label="Job request chat">
          <div className="chat-head">
            <div>
              <span>ARKANSAS LAND PROS</span>
              <strong>Job intake</strong>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close chat">
              Close
            </button>
          </div>

          <div className="chat-body">
            {stage === "service" && (
              <>
                <p className="chat-prompt">What kind of property work are you looking at?</p>
                <div className="chat-options">
                  {quickServices.map((service) => (
                    <button
                      key={service}
                      type="button"
                      onClick={() => {
                        setData((current) => ({ ...current, service }));
                        setStage("area");
                      }}
                    >
                      {service}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setData((current) => ({ ...current, service: "Not sure" }));
                      setStage("area");
                    }}
                  >
                    Not sure yet
                  </button>
                </div>
              </>
            )}

            {stage === "area" && (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  if (data.area.trim()) setStage("timing");
                }}
              >
                <p className="chat-prompt">Where is the property?</p>
                <input
                  value={data.area}
                  onChange={(event) =>
                    setData((current) => ({ ...current, area: event.target.value }))
                  }
                  placeholder="Town or property area"
                  maxLength={100}
                  required
                />
                <button className="chat-next" type="submit">Keep going</button>
              </form>
            )}

            {stage === "timing" && (
              <>
                <p className="chat-prompt">When are you hoping to get it handled?</p>
                <div className="chat-options">
                  {timingOptions.map((timeline) => (
                    <button
                      key={timeline}
                      type="button"
                      onClick={() => {
                        setData((current) => ({ ...current, timeline }));
                        setStage("details");
                      }}
                    >
                      {timeline}
                    </button>
                  ))}
                </div>
              </>
            )}

            {stage === "details" && (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  if (data.message.trim().length >= 10) setStage("contact");
                }}
              >
                <p className="chat-prompt">Give us the short version of what needs done.</p>
                <textarea
                  value={data.message}
                  onChange={(event) =>
                    setData((current) => ({ ...current, message: event.target.value }))
                  }
                  rows={5}
                  minLength={10}
                  maxLength={1800}
                  placeholder="What does the property look like now, and what do you want changed?"
                  required
                />
                <button className="chat-next" type="submit">Add contact info</button>
              </form>
            )}

            {stage === "contact" && (
              <form onSubmit={submit}>
                <p className="chat-prompt">Where should we send the request back to?</p>
                <div className="chat-contact-fields">
                  <input
                    value={data.name}
                    onChange={(event) =>
                      setData((current) => ({ ...current, name: event.target.value }))
                    }
                    placeholder="Name"
                    autoComplete="name"
                    required
                  />
                  <input
                    value={data.phone}
                    onChange={(event) =>
                      setData((current) => ({ ...current, phone: event.target.value }))
                    }
                    placeholder="Phone"
                    type="tel"
                    autoComplete="tel"
                    required
                  />
                  <input
                    value={data.email}
                    onChange={(event) =>
                      setData((current) => ({ ...current, email: event.target.value }))
                    }
                    placeholder="Email (optional)"
                    type="email"
                    autoComplete="email"
                  />
                </div>

                <TurnstileWidget onToken={setToken} resetKey={resetKey} />

                {error && <p className="chat-error">{error}</p>}

                <button className="chat-next" type="submit" disabled={sending}>
                  {sending ? "Sending…" : "Send the request"}
                </button>
              </form>
            )}

            {stage === "sent" && (
              <div className="chat-sent">
                <strong>That’s in.</strong>
                <p>
                  Your request was sent for review. Reference: {leadId}
                </p>
                <button type="button" onClick={reset}>Start another request</button>
              </div>
            )}
          </div>

          {stage !== "service" && stage !== "sent" && (
            <div className="chat-foot">
              <button
                type="button"
                onClick={() => {
                  const back = {
                    area: "service",
                    timing: "area",
                    details: "timing",
                    contact: "details",
                  } as const;
                  setStage(back[stage as keyof typeof back]);
                }}
              >
                Back
              </button>
              <span>No sales script. Just the job details.</span>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import TurnstileWidget from "@/components/turnstile-widget";
import { getAttribution, trackEvent } from "@/lib/tracking";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type LeadDraft = {
  name: string;
  phone: string;
  email: string;
  area: string;
  service: string;
  timeline: string;
  propertySize: string;
  message: string;
};

const emptyLead: LeadDraft = {
  name: "",
  phone: "",
  email: "",
  area: "",
  service: "",
  timeline: "",
  propertySize: "",
  message: "",
};

const welcome =
  "Hey — tell me a little about the property and what you're trying to get done. If you're not sure what to call the job, that's fine.";

export default function LeadChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: welcome },
  ]);
  const [draft, setDraft] = useState<LeadDraft>(emptyLead);
  const [input, setInput] = useState("");
  const [quickReplies, setQuickReplies] = useState<string[]>([
    "I need land cleared",
    "My driveway is washing out",
    "I need dirt or grading work",
  ]);
  const [ready, setReady] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [leadId, setLeadId] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [resetKey, setResetKey] = useState(0);
  const startedAt = useRef(0);
  const transcriptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const element = transcriptRef.current;
    if (element) element.scrollTop = element.scrollHeight;
  }, [messages, open, ready, thinking]);

  function openChat() {
    if (!startedAt.current) startedAt.current = Date.now();
    setOpen(true);
    trackEvent("Lead Chat Open", { source: "ai-project-assistant" });
  }

  async function sendMessage(text: string) {
    const cleanText = text.trim();
    if (!cleanText || thinking || leadId) return;

    const nextMessages: Message[] = [
      ...messages,
      { role: "user", content: cleanText.slice(0, 1800) },
    ];

    setMessages(nextMessages);
    setInput("");
    setThinking(true);
    setError("");
    setQuickReplies([]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages, lead: draft }),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "The assistant could not respond.");
      }

      setDraft(result.lead);
      setReady(Boolean(result.readyToSubmit));
      setQuickReplies(Array.isArray(result.quickReplies) ? result.quickReplies : []);
      setMessages((current) => [
        ...current,
        { role: "assistant", content: result.reply },
      ]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "The assistant could not respond. Please try again."
      );
    } finally {
      setThinking(false);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    await sendMessage(input);
  }

  async function submitLead() {
    if (sending || !ready || leadId) return;
    if (!turnstileToken && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
      setError("Please complete the verification before sending the request.");
      return;
    }

    setSending(true);
    setError("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...draft,
          source: "ai-chat",
          companyWebsite: "",
          startedAt: startedAt.current || Date.now() - 2000,
          turnstileToken,
          ...getAttribution(),
        }),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "The request could not be sent.");
      }

      setLeadId(result.leadId || "received");
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            "Got it — the request has been sent for review. If it's a fit, someone can follow up using the contact information you provided.",
        },
      ]);
      trackEvent("Lead Submitted", {
        source: "ai-chat",
        service: draft.service || "not-set",
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "The request could not be sent."
      );
    } finally {
      setSending(false);
    }
  }

  function resetChat() {
    setMessages([{ role: "assistant", content: welcome }]);
    setDraft(emptyLead);
    setInput("");
    setQuickReplies([
      "I need land cleared",
      "My driveway is washing out",
      "I need dirt or grading work",
    ]);
    setReady(false);
    setThinking(false);
    setSending(false);
    setError("");
    setLeadId("");
    setTurnstileToken("");
    startedAt.current = Date.now();
    setResetKey((value) => value + 1);
  }

  const summaryRows = [
    ["Name", draft.name],
    ["Phone", draft.phone],
    ["Email", draft.email],
    ["Property area", draft.area],
    ["Work", draft.service],
    ["Timing", draft.timeline],
    ["Rough size", draft.propertySize],
  ].filter(([, value]) => value);

  return (
    <div className="lead-chat-shell">
      {!open && (
        <button className="chat-launcher" type="button" onClick={openChat}>
          <span className="chat-dot" />
          Tell us about the property
        </button>
      )}

      {open && (
        <section className="lead-chat" aria-label="Arkansas Land Pros project assistant">
          <div className="chat-head">
            <div>
              <span>ARKANSAS LAND PROS</span>
              <strong>Project assistant</strong>
              <small>Automated job intake</small>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close chat">
              Close
            </button>
          </div>

          <div className="chat-transcript" ref={transcriptRef}>
            {messages.map((message, index) => (
              <div
                className={`chat-message ${message.role}`}
                key={`${message.role}-${index}-${message.content.slice(0, 20)}`}
              >
                <span>{message.role === "assistant" ? "ALP" : "You"}</span>
                <p>{message.content}</p>
              </div>
            ))}

            {thinking && (
              <div className="chat-message assistant">
                <span>ALP</span>
                <p className="chat-typing">Putting that together…</p>
              </div>
            )}

            {ready && !leadId && (
              <div className="chat-summary">
                <strong>Request so far</strong>
                <div>
                  {summaryRows.map(([label, value]) => (
                    <p key={label}>
                      <span>{label}</span>
                      {value}
                    </p>
                  ))}
                </div>
                {draft.message && (
                  <p className="chat-summary-notes">
                    <span>Project</span>
                    {draft.message}
                  </p>
                )}

                <TurnstileWidget onToken={setTurnstileToken} resetKey={resetKey} />

                <button
                  className="chat-send-request"
                  type="button"
                  onClick={submitLead}
                  disabled={sending}
                >
                  {sending ? "Sending…" : "Send this request"}
                </button>
                <small>
                  Want to change something? Just type the correction below before
                  you send it.
                </small>
              </div>
            )}

            {leadId && (
              <div className="chat-confirmation">
                <strong>Request received</strong>
                <span>Reference {leadId}</span>
                <button type="button" onClick={resetChat}>
                  Start another request
                </button>
              </div>
            )}
          </div>

          {!leadId && (
            <>
              {quickReplies.length > 0 && (
                <div className="chat-quick-replies">
                  {quickReplies.map((reply) => (
                    <button
                      key={reply}
                      type="button"
                      onClick={() => sendMessage(reply)}
                      disabled={thinking}
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              )}

              <form className="chat-compose" onSubmit={handleSubmit}>
                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      if (input.trim()) void sendMessage(input);
                    }
                  }}
                  rows={2}
                  maxLength={1800}
                  placeholder="Type what you need done…"
                  disabled={thinking}
                />
                <button type="submit" disabled={thinking || !input.trim()}>
                  Send
                </button>
              </form>
            </>
          )}

          {error && <p className="chat-error">{error}</p>}

          <div className="chat-foot">
            <span>
              This assistant helps collect project details. Final estimates and
              scheduling come from the service provider.
            </span>
          </div>
        </section>
      )}
    </div>
  );
}

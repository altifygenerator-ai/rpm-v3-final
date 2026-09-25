"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { services } from "@/data/services";

type Props = {
  initial?: {
    businessName?: string;
    contactName?: string;
    phone?: string;
    websiteUrl?: string;
    facebookUrl?: string;
    description?: string;
    logoUrl?: string;
    city?: string;
    zip?: string;
    services?: string[];
    territories?: string[];
  };
};

export default function ContractorOnboardingForm({ initial = {} }: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>(initial.services || []);
  const [status, setStatus] = useState<"idle" | "saving">("idle");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const territories = String(data.get("territories") || "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);

    setStatus("saving");
    setError("");

    try {
      const response = await fetch("/api/pros/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: data.get("businessName"),
          contactName: data.get("contactName"),
          phone: data.get("phone"),
          websiteUrl: data.get("websiteUrl"),
          facebookUrl: data.get("facebookUrl"),
          logoUrl: data.get("logoUrl"),
          description: data.get("description"),
          city: data.get("city"),
          zip: data.get("zip"),
          services: selected,
          territories,
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || "Could not save profile.");
      router.push("/pro/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save profile.");
      setStatus("idle");
    }
  }

  return (
    <form className="pro-onboarding-form" onSubmit={submit}>
      <div className="pro-form-grid">
        <label>
          <span>Business name</span>
          <input name="businessName" required defaultValue={initial.businessName} />
        </label>
        <label>
          <span>Your name</span>
          <input name="contactName" defaultValue={initial.contactName} />
        </label>
        <label>
          <span>Business phone</span>
          <input name="phone" type="tel" required defaultValue={initial.phone} />
        </label>
        <label>
          <span>Home city</span>
          <input name="city" defaultValue={initial.city} />
        </label>
        <label>
          <span>ZIP</span>
          <input name="zip" inputMode="numeric" defaultValue={initial.zip} />
        </label>
        <label>
          <span>Website</span>
          <input name="websiteUrl" type="url" defaultValue={initial.websiteUrl} placeholder="https://" />
        </label>
        <label>
          <span>Logo image URL <small>optional</small></span>
          <input name="logoUrl" type="url" defaultValue={initial.logoUrl} placeholder="https://..." />
        </label>
        <label>
          <span>Facebook page <small>optional</small></span>
          <input name="facebookUrl" type="url" defaultValue={initial.facebookUrl} placeholder="https://facebook.com/..." />
        </label>
        <label className="pro-span">
          <span>Public profile description</span>
          <textarea name="description" required rows={5} maxLength={1200} defaultValue={initial.description} placeholder="What kind of work do you handle? What should a property owner know about your business?" />
        </label>
      </div>

      <fieldset className="pro-service-picks">
        <legend>What work do you want leads for?</legend>
        <div>
          {services.map((service) => (
            <label key={service.slug}>
              <input
                type="checkbox"
                checked={selected.includes(service.slug)}
                onChange={(event) =>
                  setSelected((current) =>
                    event.target.checked
                      ? [...current, service.slug]
                      : current.filter((slug) => slug !== service.slug)
                  )
                }
              />
              <span>{service.shortTitle}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="pro-territories">
        <span>Service areas</span>
        <textarea
          name="territories"
          required
          rows={3}
          defaultValue={(initial.territories || []).join(", ")}
          placeholder="Hot Springs, Glenwood, Mount Ida, Arkadelphia"
        />
        <small>Separate towns or areas with commas. These control which opportunities are matched to you.</small>
      </label>

      {error ? <p className="form-message form-error">{error}</p> : null}
      <button className="work-button" type="submit" disabled={status === "saving" || selected.length === 0}>
        {status === "saving" ? "Saving profile…" : "Save contractor profile"}
      </button>
    </form>
  );
}

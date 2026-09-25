"use client";

import { track } from "@vercel/analytics";

type EventValue = string | number | boolean;

export function trackEvent(
  name: string,
  properties?: Record<string, EventValue>
) {
  try {
    track(name, properties);
  } catch {
    // Analytics must never block a lead or navigation action.
  }
}

export function getAttribution() {
  if (typeof window === "undefined") {
    return {
      landingPage: "",
      referrer: "",
      utmSource: "",
      utmMedium: "",
      utmCampaign: "",
      utmTerm: "",
      utmContent: "",
    };
  }

  const params = new URLSearchParams(window.location.search);

  return {
    landingPage: window.location.pathname + window.location.search,
    referrer: document.referrer || "",
    utmSource: params.get("utm_source") || "",
    utmMedium: params.get("utm_medium") || "",
    utmCampaign: params.get("utm_campaign") || "",
    utmTerm: params.get("utm_term") || "",
    utmContent: params.get("utm_content") || "",
  };
}

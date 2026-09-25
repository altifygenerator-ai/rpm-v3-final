"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/tracking";

function cleanLabel(value: string) {
  return value.replace(/\s+/g, " ").trim().slice(0, 90);
}

export default function GlobalClickTracker() {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest("a");
      if (!anchor) return;

      const rawHref = anchor.getAttribute("href") || "";
      if (!rawHref || rawHref.startsWith("#")) return;

      const label =
        cleanLabel(anchor.getAttribute("aria-label") || anchor.textContent || "") ||
        "unlabeled";

      let destination = rawHref;
      let external = false;

      try {
        const url = new URL(anchor.href, window.location.href);
        destination = url.pathname + url.search;
        external = url.origin !== window.location.origin;
        if (external) destination = url.hostname + url.pathname;
      } catch {
        // Keep the raw href if the browser cannot normalize it.
      }

      trackEvent("Link Click", {
        destination: destination.slice(0, 120),
        label,
        external,
      });
    }

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return null;
}

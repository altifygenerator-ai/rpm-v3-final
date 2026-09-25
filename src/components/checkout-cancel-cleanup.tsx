"use client";

import { useEffect, useState } from "react";

export default function CheckoutCancelCleanup({
  purchaseId,
}: {
  purchaseId: string;
}) {
  const [message, setMessage] = useState("Releasing the checkout reservation…");

  useEffect(() => {
    let active = true;

    async function release() {
      try {
        const response = await fetch("/api/marketplace/cancel-checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ purchaseId }),
        });
        const result = await response.json();
        if (!active) return;
        setMessage(
          response.ok && result.success
            ? "Checkout cancelled. The lead reservation has been released."
            : result.error || "Checkout was cancelled, but the reservation may take a few minutes to clear."
        );
      } catch {
        if (active) {
          setMessage(
            "Checkout was cancelled, but the reservation may take a few minutes to clear."
          );
        }
      }
    }

    void release();
    return () => {
      active = false;
    };
  }, [purchaseId]);

  return <div className="pro-notice">{message}</div>;
}

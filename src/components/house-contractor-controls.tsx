"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  contractorId: string;
  status: string;
  visible: boolean;
  featured: boolean;
  insuranceVerified: boolean;
  licenseVerified: boolean;
};

export default function HouseContractorControls(props: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState("");

  async function run(action: string) {
    setBusy(action);
    try {
      await fetch(`/api/house/contractors/${props.contractorId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      router.refresh();
    } finally {
      setBusy("");
    }
  }

  return (
    <div className="house-contractor-controls">
      <button type="button" onClick={() => run(props.status === "active" ? "suspend" : "activate")} disabled={Boolean(busy)}>
        {props.status === "active" ? "Suspend account" : "Activate account"}
      </button>
      <button type="button" onClick={() => run(props.visible ? "hide_profile" : "show_profile")} disabled={Boolean(busy)}>
        {props.visible ? "Hide public profile" : "Show public profile"}
      </button>
      <button type="button" onClick={() => run(props.featured ? "unfeature" : "feature")} disabled={Boolean(busy)}>
        {props.featured ? "Remove featured priority" : "Feature in directory"}
      </button>
      <button type="button" onClick={() => run(props.insuranceVerified ? "clear_insurance" : "verify_insurance")} disabled={Boolean(busy)}>
        {props.insuranceVerified ? "Clear insurance verification" : "Mark insurance verified"}
      </button>
      <button type="button" onClick={() => run(props.licenseVerified ? "clear_license" : "verify_license")} disabled={Boolean(busy)}>
        {props.licenseVerified ? "Clear license verification" : "Mark license verified"}
      </button>
    </div>
  );
}

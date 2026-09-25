"use client";

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { trackEvent } from "@/lib/tracking";

type Props = ComponentProps<typeof Link> & {
  children: ReactNode;
  eventName?: string;
  eventDetail?: string;
};

export default function TrackedLink({
  children,
  eventName = "CTA Click",
  eventDetail,
  onClick,
  ...props
}: Props) {
  return (
    <Link
      {...props}
      onClick={(event) => {
        trackEvent(eventName, eventDetail ? { detail: eventDetail } : undefined);
        onClick?.(event);
      }}
    >
      {children}
    </Link>
  );
}

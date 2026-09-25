"use client";

import { usePathname } from "next/navigation";
import { Analytics } from "@vercel/analytics/react";

export default function SiteAnalytics() {
  const pathname = usePathname();
  if (pathname.startsWith("/project/")) return null;
  return <Analytics />;
}

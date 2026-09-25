import { services } from "@/data/services";

export const DEFAULT_MAX_UNLOCKS = 2;

const basePrices: Record<string, number> = {
  "land-clearing": 3500,
  "forestry-mulching": 3500,
  "brush-clearing": 1800,
  "lot-clearing": 3000,
  "dirt-work": 2500,
  "grading-leveling": 2500,
  "driveway-repair": 2000,
  "gravel-driveways": 2000,
  "culvert-installation": 2500,
  "drainage-erosion": 3000,
  "tree-work": 2500,
  "storm-cleanup": 1800,
  cleanup: 1200,
  hauling: 1000,
  "rural-property-prep": 2500,
  "retaining-walls": 3000,
  "site-prep": 3500,
  "light-demolition": 2000,
  airbnb: 1200,
  "water-features": 2500,
  "outdoor-builds": 2000,
  general: 1500,
  welding: 1200,
};

export const allowedServiceSlugs = services.map((service) => service.slug);

export function cleanText(value: unknown, max = 1800) {
  return String(value ?? "").replace(/\u0000/g, "").trim().slice(0, max);
}

export function qualityBand(score: number) {
  if (score >= 85) return "excellent";
  if (score >= 70) return "good";
  if (score >= 50) return "standard";
  return "low";
}

export function deterministicQuality(input: {
  message: string;
  email?: string;
  timeline?: string;
  propertySize?: string;
  area?: string;
}) {
  let score = 42;
  if (input.message.length >= 80) score += 12;
  if (input.message.length >= 180) score += 10;
  if (input.email) score += 7;
  if (input.timeline) score += 7;
  if (input.propertySize) score += 10;
  if (input.area) score += 7;
  return Math.min(100, score);
}

export function calculateLeadPrice(
  serviceSlug: string,
  qualityScore: number,
  sizeBand: "small" | "medium" | "large" | "unknown"
) {
  let price = basePrices[serviceSlug] ?? 1500;
  if (sizeBand === "medium") price += 500;
  if (sizeBand === "large") price += 1000;
  if (qualityScore >= 85) price += 500;
  else if (qualityScore >= 70) price += 200;
  else if (qualityScore < 45) price -= 500;
  return Math.max(500, price);
}

export function formatMoney(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}

export function isLeadAvailable(lead: {
  marketplace_status: string;
  marketplace_enabled: boolean;
  unlimited_unlocks: boolean;
  paid_unlock_count: number;
  max_paid_unlocks: number | null;
  expires_at?: string | null;
  is_test?: boolean;
  test_enabled?: boolean;
}) {
  if (!lead.marketplace_enabled || lead.marketplace_status !== "available") return false;
  if (lead.is_test && !lead.test_enabled) return false;
  if (lead.expires_at && new Date(lead.expires_at).getTime() <= Date.now()) return false;
  if (lead.unlimited_unlocks) return true;
  const max = lead.max_paid_unlocks ?? DEFAULT_MAX_UNLOCKS;
  return lead.paid_unlock_count < max;
}

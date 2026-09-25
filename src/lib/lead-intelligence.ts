import OpenAI from "openai";
import {
  allowedServiceSlugs,
  calculateLeadPrice,
  deterministicQuality,
  qualityBand,
} from "@/lib/marketplace";

type Input = {
  service: string;
  message: string;
  area: string;
  timeline?: string;
  propertySize?: string;
  email?: string;
};

export type LeadIntelligence = {
  serviceSlug: string;
  summary: string;
  qualityScore: number;
  qualityBand: "low" | "standard" | "good" | "excellent";
  leadPriceCents: number;
  sizeBand: "small" | "medium" | "large" | "unknown";
  aiMetadata: Record<string, unknown>;
};

const schema = {
  type: "object",
  properties: {
    serviceSlug: { type: "string", enum: allowedServiceSlugs },
    summary: { type: "string" },
    intentScore: { type: "integer", minimum: 0, maximum: 100 },
    sizeBand: {
      type: "string",
      enum: ["small", "medium", "large", "unknown"],
    },
    reasoningTags: {
      type: "array",
      items: { type: "string" },
      maxItems: 8,
    },
  },
  required: ["serviceSlug", "summary", "intentScore", "sizeBand", "reasoningTags"],
  additionalProperties: false,
} as const;

export async function analyzeLead(input: Input): Promise<LeadIntelligence> {
  const deterministic = deterministicQuality(input);
  let serviceSlug =
    allowedServiceSlugs.find((slug) =>
      input.service.toLowerCase().includes(slug.replace(/-/g, " "))
    ) || "general";
  let summary = input.message.slice(0, 420);
  let intentScore = deterministic;
  let sizeBand: "small" | "medium" | "large" | "unknown" = "unknown";
  let reasoningTags: string[] = ["deterministic-fallback"];

  if (process.env.OPENAI_API_KEY) {
    try {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const response = await openai.responses.create({
        model: process.env.OPENAI_CHAT_MODEL || "gpt-6-luna",
        store: false,
        reasoning: { effort: "none" },
        max_output_tokens: 450,
        instructions: `Classify Arkansas property-service leads for an internal marketplace.
Choose exactly one serviceSlug from the allowed schema. Summarize only facts the homeowner supplied.
intentScore means lead completeness and apparent readiness, not creditworthiness and not whether the customer will definitely hire.
sizeBand should reflect likely project scope from supplied facts only. Never invent measurements, prices, or customer intent.`,
        input: JSON.stringify(input),
        text: {
          format: {
            type: "json_schema",
            name: "lead_intelligence",
            strict: true,
            schema,
          },
        },
      });
      const parsed = JSON.parse(response.output_text);
      serviceSlug = parsed.serviceSlug;
      summary = parsed.summary;
      intentScore = Number(parsed.intentScore);
      sizeBand = parsed.sizeBand;
      reasoningTags = parsed.reasoningTags;
    } catch (error) {
      console.error("Lead intelligence fallback", error);
    }
  }

  const qualityScore = Math.max(
    0,
    Math.min(100, Math.round(deterministic * 0.6 + intentScore * 0.4))
  );
  const band = qualityBand(qualityScore);

  return {
    serviceSlug,
    summary,
    qualityScore,
    qualityBand: band,
    leadPriceCents: calculateLeadPrice(serviceSlug, qualityScore, sizeBand),
    sizeBand,
    aiMetadata: {
      deterministicScore: deterministic,
      aiIntentScore: intentScore,
      sizeBand,
      reasoningTags,
    },
  };
}

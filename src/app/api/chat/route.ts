import OpenAI from "openai";

export const runtime = "nodejs";

type ChatMessage = {
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

type RateBucket = { count: number; resetAt: number };

const buckets = new Map<string, RateBucket>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 30;

function clientIp(request: Request) {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-vercel-forwarded-for") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

function rateLimited(ip: string) {
  const now = Date.now();
  const current = buckets.get(ip);

  if (!current || current.resetAt <= now) {
    buckets.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  current.count += 1;
  buckets.set(ip, current);
  return current.count > MAX_REQUESTS;
}

function clean(value: unknown, max = 1800) {
  return String(value ?? "").replace(/\u0000/g, "").trim().slice(0, max);
}

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

const outputSchema = {
  type: "object",
  properties: {
    reply: { type: "string" },
    lead: {
      type: "object",
      properties: {
        name: { type: "string" },
        phone: { type: "string" },
        email: { type: "string" },
        area: { type: "string" },
        service: { type: "string" },
        timeline: { type: "string" },
        propertySize: { type: "string" },
        message: { type: "string" },
      },
      required: [
        "name",
        "phone",
        "email",
        "area",
        "service",
        "timeline",
        "propertySize",
        "message",
      ],
      additionalProperties: false,
    },
    missing: {
      type: "array",
      items: { type: "string" },
    },
    readyToSubmit: { type: "boolean" },
    quickReplies: {
      type: "array",
      items: { type: "string" },
    },
  },
  required: ["reply", "lead", "missing", "readyToSubmit", "quickReplies"],
  additionalProperties: false,
} as const;

const instructions = `
You are the Arkansas Land Pros automated project assistant.

Your job is to have a natural, useful conversation with an Arkansas property owner and turn it into a clear land-service request. Sound like a capable local office person: plainspoken, friendly, concise, and practical. Do not sound like a chatbot script, a sales agency, or a contractor trying to close a sale.

Important behavior:
- You are automated. Never claim to be a human, a named employee, or the contractor who will perform the work.
- Ask one focused question at a time in most turns. Two closely related questions are okay when natural.
- If the user does not know the service name, help classify the project from their description.
- Relevant service types include land clearing, forestry mulching, brush clearing, lot clearing, dirt work, grading, gravel driveways, driveway repair, culverts, drainage and erosion, tree/brush work, storm cleanup, property cleanup, hauling, rural property prep, retaining walls, site prep, light demolition, outdoor property work, and property welding.
- If the user asks a simple question about what information is needed or which category fits, answer briefly and then continue intake.
- Never quote or invent pricing, availability, crew size, equipment, licensing, insurance, permits, or scheduling promises.
- Never invent details the user did not provide.
- Keep previously supplied lead fields unless the user corrects them.
- Phone and name are required before the request can be submitted. Email is optional.
- Property area and a useful description of the work are required.
- A specific service should be selected when reasonably clear; use "General Property Work" when the project genuinely spans categories or remains unclear.
- timeline and propertySize are useful but optional.
- The lead.message field should become a concise, useful summary of the project based only on what the user actually said. Do not include contact details in that summary.
- Set readyToSubmit=true only when name, phone, area, service, and a useful project summary are present.
- When readyToSubmit=true, tell the user you have enough to put the request together and ask them to review it and press the Send request button. Do not say the request has already been sent.
- quickReplies should contain 0 to 4 short replies that would genuinely help the next turn. Do not repeat them inside reply.
- Keep reply generally under 70 words.
`;

export async function POST(request: Request) {
  try {
    const ip = clientIp(request);
    if (rateLimited(ip)) {
      return Response.json(
        { success: false, error: "Too many chat messages. Please try again shortly." },
        { status: 429 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        { success: false, error: "The project assistant is not configured yet." },
        { status: 503 }
      );
    }

    const body = await request.json();
    const rawMessages = Array.isArray(body.messages) ? body.messages : [];
    const messages: ChatMessage[] = rawMessages
      .slice(-12)
      .map((item: { role?: unknown; content?: unknown }) => ({
        role: item.role === "assistant" ? "assistant" : "user",
        content: clean(item.content, 1800),
      }))
      .filter((item: ChatMessage) => item.content.length > 0);

    const totalChars = messages.reduce((sum, item) => sum + item.content.length, 0);
    if (!messages.length || totalChars > 12000) {
      return Response.json(
        { success: false, error: "That conversation is too long. Please start a new request." },
        { status: 400 }
      );
    }

    const incomingLead = body.lead && typeof body.lead === "object" ? body.lead : {};
    const lead: LeadDraft = {
      name: clean(incomingLead.name, 80),
      phone: clean(incomingLead.phone, 40),
      email: clean(incomingLead.email, 120),
      area: clean(incomingLead.area, 120),
      service: clean(incomingLead.service, 120),
      timeline: clean(incomingLead.timeline, 120),
      propertySize: clean(incomingLead.propertySize, 120),
      message: clean(incomingLead.message, 1800),
    };

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await openai.responses.create({
      model: process.env.OPENAI_CHAT_MODEL || "gpt-6-luna",
      store: false,
      reasoning: { effort: "none" },
      max_output_tokens: 650,
      instructions:
        instructions +
        "\nExisting lead draft from prior turns (preserve values unless the conversation corrects them):\n" +
        JSON.stringify({ ...emptyLead, ...lead }),
      input: messages.map((message) => ({
        role: message.role,
        content: message.content,
      })),
      text: {
        format: {
          type: "json_schema",
          name: "arkansas_land_pros_intake",
          strict: true,
          schema: outputSchema,
        },
      },
    });

    const parsed = JSON.parse(response.output_text);

    return Response.json({
      success: true,
      reply: clean(parsed.reply, 1200),
      lead: {
        name: clean(parsed.lead?.name, 80),
        phone: clean(parsed.lead?.phone, 40),
        email: clean(parsed.lead?.email, 120),
        area: clean(parsed.lead?.area, 120),
        service: clean(parsed.lead?.service, 120),
        timeline: clean(parsed.lead?.timeline, 120),
        propertySize: clean(parsed.lead?.propertySize, 120),
        message: clean(parsed.lead?.message, 1800),
      },
      missing: Array.isArray(parsed.missing)
        ? parsed.missing.map((value: unknown) => clean(value, 80)).slice(0, 8)
        : [],
      readyToSubmit: Boolean(parsed.readyToSubmit),
      quickReplies: Array.isArray(parsed.quickReplies)
        ? parsed.quickReplies.map((value: unknown) => clean(value, 100)).filter(Boolean).slice(0, 4)
        : [],
    });
  } catch (error) {
    console.error("OpenAI intake chat error", error);
    return Response.json(
      { success: false, error: "The project assistant hit a problem. Please try again." },
      { status: 500 }
    );
  }
}

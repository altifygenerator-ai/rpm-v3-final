import { createHash } from "node:crypto";

export function hashProjectToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function makeProjectToken() {
  return `${crypto.randomUUID()}${crypto.randomUUID()}`.replace(/-/g, "");
}

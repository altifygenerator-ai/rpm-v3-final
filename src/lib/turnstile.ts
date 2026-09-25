export async function verifyTurnstile(token: string, ip?: string | null) {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    return { ok: false, configurationError: true, errors: ["TURNSTILE_SECRET_KEY missing"] };
  }

  if (!token) {
    return { ok: false, configurationError: false, errors: ["missing-input-response"] };
  }

  const form = new FormData();
  form.set("secret", secret);
  form.set("response", token);
  if (ip) form.set("remoteip", ip);

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body: form, cache: "no-store" }
    );
    const result = (await response.json()) as {
      success?: boolean;
      "error-codes"?: string[];
    };

    return {
      ok: Boolean(result.success),
      configurationError: false,
      errors: result["error-codes"] || [],
    };
  } catch {
    return { ok: false, configurationError: false, errors: ["verification-request-failed"] };
  }
}

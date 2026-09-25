import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/site-url";

export async function GET(request: NextRequest) {
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const type = request.nextUrl.searchParams.get("type") as "magiclink" | "signup" | null;
  const next = request.nextUrl.searchParams.get("next") || "/pro/dashboard";
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/pro/dashboard";

  if (!tokenHash || !type) {
    return NextResponse.redirect(new URL("/pros/sign-in?error=invalid_link", getSiteUrl()));
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type,
  });

  if (error) {
    return NextResponse.redirect(new URL("/pros/sign-in?error=expired_link", getSiteUrl()));
  }

  return NextResponse.redirect(new URL(safeNext, getSiteUrl()));
}

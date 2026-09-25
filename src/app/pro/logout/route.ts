import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/site-url";

export async function GET() {
  return NextResponse.redirect(new URL("/pro/dashboard", getSiteUrl()), 302);
}

export async function POST() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL("/pros/sign-in", getSiteUrl()), 303);
}

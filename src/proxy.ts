import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

const PRODUCTION_ORIGIN = "https://www.arkansaslandpros.com";
const LEGACY_HOSTS = new Set([
  "richardslandmanagementllc.com",
  "www.richardslandmanagementllc.com",
]);

export async function proxy(request: NextRequest) {
  const hostname = request.nextUrl.hostname.toLowerCase();

  if (LEGACY_HOSTS.has(hostname) || hostname === "arkansaslandpros.com") {
    const destination = new URL(
      request.nextUrl.pathname + request.nextUrl.search,
      PRODUCTION_ORIGIN
    );
    return NextResponse.redirect(destination, 308);
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return NextResponse.next();

  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  await supabase.auth.getUser();
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg).*)"],
};

import { NextRequest, NextResponse } from "next/server";

const PRODUCTION_ORIGIN = "https://www.arkansaslandpros.com";
const LEGACY_HOSTS = new Set([
  "richardslandmanagementllc.com",
  "www.richardslandmanagementllc.com",
]);

export function proxy(request: NextRequest) {
  const hostname = request.nextUrl.hostname.toLowerCase();

  if (
    LEGACY_HOSTS.has(hostname) ||
    hostname === "arkansaslandpros.com"
  ) {
    const destination = new URL(
      request.nextUrl.pathname + request.nextUrl.search,
      PRODUCTION_ORIGIN
    );

    return NextResponse.redirect(destination, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|robots.txt|sitemap.xml).*)",
  ],
};

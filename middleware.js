// middleware.js
import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl.clone();
  const host = req.headers.get("host") || "";

  // Ignore localhost dev (use path-based during local dev)
  const isLocalhost = host.includes("localhost");
  const baseDomain = "minimart.ng"; // your main domain
  const subdomain = host.replace(`.${baseDomain}`, "");

  // Skip middleware for API routes, static files, etc.
  if (
    url.pathname.startsWith("/_next") ||
    url.pathname.startsWith("/api") ||
    url.pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Handle subdomain mapping (only on production domain)
  if (!isLocalhost && subdomain && subdomain !== baseDomain) {
    url.pathname = `/${subdomain}${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

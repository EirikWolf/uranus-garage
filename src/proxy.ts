import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  // Auth is handled by individual API route handlers via auth()
  // CSP headers for all responses
  const response = NextResponse.next();

  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://cdn.sanity.io https://lh3.googleusercontent.com https://avatars.githubusercontent.com",
      "font-src 'self'",
      "connect-src 'self' https://cdn.sanity.io https://*.sanity.io https://generativelanguage.googleapis.com",
      "frame-src 'self'",
      "frame-ancestors 'none'",
    ].join("; "),
  );
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
}

export const config = {
  matcher: [
    "/api/:path*",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.svg$).*)",
  ],
};

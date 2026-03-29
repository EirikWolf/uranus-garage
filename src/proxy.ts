import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedApiPrefixes = [
  "/api/forks",
  "/api/listings",
  "/api/brew-swap",
  "/api/rapt/sync",
];

const publicGetPaths = new Set([
  "/api/forks",
  "/api/listings",
  "/api/newsletter",
]);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow auth routes through
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Allow newsletter POST (public signup)
  if (pathname === "/api/newsletter") {
    return NextResponse.next();
  }

  // Allow public GET requests to listing/fork endpoints
  if (request.method === "GET" && publicGetPaths.has(pathname)) {
    return NextResponse.next();
  }

  // For protected API write operations, check for session cookie
  const isProtectedApi = protectedApiPrefixes.some((prefix) =>
    pathname.startsWith(prefix),
  );

  if (isProtectedApi && request.method !== "GET") {
    const sessionToken =
      request.cookies.get("authjs.session-token")?.value ||
      request.cookies.get("__Secure-authjs.session-token")?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: "Ikke innlogget" },
        { status: 401 },
      );
    }
  }

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

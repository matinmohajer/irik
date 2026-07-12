import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "@/lib/auth/jwt";
import { SESSION_COOKIE } from "@/lib/auth/session";

/**
 * Optimistic route protection only (cookie + signature/expiry check, no
 * network calls) — Next.js's own guidance is that Proxy shouldn't be the
 * full authorization solution. Pages that need live data (e.g. orders)
 * still verify server-side against WordPress when they fetch it.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginRoute = pathname === "/account/login";
  const isAccountRoute = pathname.startsWith("/account");

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? verifyJwt(token) : null;

  if (isAccountRoute && !isLoginRoute && !session) {
    const url = new URL("/account/login", request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (isLoginRoute && session) {
    return NextResponse.redirect(new URL("/account", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*"],
};

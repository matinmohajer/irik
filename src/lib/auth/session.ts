import { cookies } from "next/headers";
import { verifyJwt, type SessionPayload } from "@/lib/auth/jwt";

export const SESSION_COOKIE = "irik_session";
export const SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60; // 30 days — matches the token's own exp in the mu-plugin

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_MAX_AGE_SECONDS,
};

/** Server Components / Route Handlers only — reads and verifies the session cookie. */
export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyJwt(token);
}

/** The raw token, for forwarding as `Authorization: Bearer <token>` to WordPress. */
export async function getSessionToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value ?? null;
}

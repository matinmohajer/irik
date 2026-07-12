import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import { getSessionToken } from "@/lib/auth/session";
import type { StoreApiCredentials } from "@/lib/store-api/client";

const CART_TOKEN_COOKIE = "irik_cart_token";
const CART_NONCE_COOKIE = "irik_cart_nonce";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 14, // Store API's own cart-token JWT expires in ~2 days server-side; this is just the outer cookie lifetime
};

/** Reads cart-token/nonce cookies plus the auth session (if logged in) to authenticate a Store API call. */
export async function getStoreApiCredentials(): Promise<StoreApiCredentials> {
  const store = await cookies();
  return {
    cartToken: store.get(CART_TOKEN_COOKIE)?.value,
    nonce: store.get(CART_NONCE_COOKIE)?.value,
    bearerToken: (await getSessionToken()) ?? undefined,
  };
}

/** Persists whatever cart-token/nonce the Store API returned so the next request reuses the same cart. */
export function persistStoreApiCredentials(response: NextResponse, cartToken?: string, nonce?: string) {
  if (cartToken) response.cookies.set(CART_TOKEN_COOKIE, cartToken, cookieOptions);
  if (nonce) response.cookies.set(CART_NONCE_COOKIE, nonce, cookieOptions);
}

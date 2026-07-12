import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Verifies HS256 JWTs minted by wp-content/mu-plugins/irik-headless-auth.php
 * on the WordPress side. Mirrors that PHP implementation exactly (same
 * base64url encoding, same HMAC-SHA256) so a token signed there verifies
 * here with no format mismatch.
 */

export interface SessionPayload {
  sub: number;
  phone: string;
  iat: number;
  exp: number;
}

function base64UrlDecode(input: string): Buffer {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/").padEnd(input.length + ((4 - (input.length % 4)) % 4), "=");
  return Buffer.from(padded, "base64");
}

function base64UrlEncode(input: Buffer): string {
  return input.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Returns the decoded payload, or null if the token is malformed, mis-signed, or expired. */
export function verifyJwt(token: string): SessionPayload | null {
  const secret = process.env.IRIK_JWT_SECRET;
  if (!secret) return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [headerB64, payloadB64, signatureB64] = parts;

  const expectedSignature = base64UrlEncode(createHmac("sha256", secret).update(`${headerB64}.${payloadB64}`).digest());

  const provided = base64UrlDecode(signatureB64);
  const expected = base64UrlDecode(expectedSignature);
  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) {
    return null;
  }

  let payload: SessionPayload;
  try {
    payload = JSON.parse(base64UrlDecode(payloadB64).toString("utf8"));
  } catch {
    return null;
  }

  if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
  if (!payload.sub || !payload.phone) return null;

  return payload;
}

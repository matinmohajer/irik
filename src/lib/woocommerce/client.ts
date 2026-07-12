import { createHmac, randomBytes } from "node:crypto";

/**
 * Minimal typed client for the WooCommerce REST API (v3).
 *
 * Auth: WooCommerce only accepts the consumer key/secret as HTTP Basic auth
 * when the store is served over HTTPS — over plain HTTP it requires OAuth
 * 1.0a "one-legged" query-string signing instead (this is WooCommerce's own
 * `is_ssl()` branch in WC_REST_Authentication, not a Next.js-side choice).
 * We mirror that exactly here, keyed off the configured URL's protocol, so
 * this works against both a local HTTP dev site and a real HTTPS store.
 *
 * Docs: https://woocommerce.github.io/woocommerce-rest-api-docs/#authentication
 */

const WOOCOMMERCE_URL = process.env.WOOCOMMERCE_URL?.replace(/\/$/, "");
const CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET;

export function isWooCommerceConfigured(): boolean {
  return Boolean(WOOCOMMERCE_URL && CONSUMER_KEY && CONSUMER_SECRET);
}

/** Revalidate product/category data every 5 minutes (ISR-style). */
const DEFAULT_REVALIDATE_SECONDS = 300;

/** RFC 3986 percent-encoding: encodeURIComponent leaves `! * ' ( )` unescaped, RFC 3986 does not. */
function rfc3986Encode(value: string): string {
  return encodeURIComponent(value).replace(/[!*'()]/g, (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase());
}

/**
 * Signs a request per WooCommerce's OAuth 1.0a "one-legged" flow for non-SSL
 * stores. The signature base string doubly percent-encodes each parameter
 * pair (encode key & value, join with "=", then re-encode that whole pair) —
 * this looks like a bug but is correct per RFC 5849 §3.4.1.1 and matches
 * WooCommerce's own class-wc-rest-authentication.php byte for byte.
 */
function signWithOAuth(method: string, url: URL): URL {
  const oauthParams: Record<string, string> = {
    oauth_consumer_key: CONSUMER_KEY!,
    oauth_nonce: randomBytes(16).toString("hex"),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: String(Math.floor(Date.now() / 1000)),
  };

  const allParams: Record<string, string> = { ...oauthParams };
  url.searchParams.forEach((value, key) => {
    allParams[key] = value;
  });

  const sortedKeys = Object.keys(allParams).sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  const paramString = sortedKeys
    .map((key) => rfc3986Encode(`${rfc3986Encode(key)}=${rfc3986Encode(allParams[key])}`))
    .join("%26");

  const baseRequestUri = rfc3986Encode(`${url.origin}${url.pathname}`);
  const stringToSign = `${method.toUpperCase()}&${baseRequestUri}&${paramString}`;
  const signature = createHmac("sha1", `${CONSUMER_SECRET}&`).update(stringToSign).digest("base64");

  const signedUrl = new URL(url.toString());
  for (const [key, value] of Object.entries(oauthParams)) signedUrl.searchParams.set(key, value);
  signedUrl.searchParams.set("oauth_signature", signature);
  return signedUrl;
}

async function wooRequest(
  path: string,
  searchParams: Record<string, string | number | undefined>,
  revalidateSeconds: number
): Promise<Response> {
  if (!isWooCommerceConfigured()) {
    throw new Error("WooCommerce is not configured — set WOOCOMMERCE_URL and consumer credentials in .env.local");
  }

  let url = new URL(`${WOOCOMMERCE_URL}/wp-json/wc/v3${path}`);
  for (const [key, value] of Object.entries(searchParams)) {
    if (value !== undefined) url.searchParams.set(key, String(value));
  }

  const headers: HeadersInit = {};
  if (url.protocol === "https:") {
    headers.Authorization = `Basic ${Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString("base64")}`;
  } else {
    url = signWithOAuth("GET", url);
  }

  const res = await fetch(url.toString(), { headers, next: { revalidate: revalidateSeconds } });

  if (!res.ok) {
    throw new Error(`WooCommerce API error ${res.status} on ${path}: ${await res.text()}`);
  }

  return res;
}

export async function wooFetch<T>(
  path: string,
  searchParams: Record<string, string | number | undefined> = {},
  revalidateSeconds: number = DEFAULT_REVALIDATE_SECONDS
): Promise<T> {
  const res = await wooRequest(path, searchParams, revalidateSeconds);
  return res.json() as Promise<T>;
}

/** Returns both the parsed body and the `X-WP-Total(Pages)` headers WooCommerce sends for list endpoints. */
export async function wooFetchList<T>(
  path: string,
  searchParams: Record<string, string | number | undefined> = {},
  revalidateSeconds: number = DEFAULT_REVALIDATE_SECONDS
): Promise<{ items: T[]; total: number; totalPages: number }> {
  const res = await wooRequest(path, searchParams, revalidateSeconds);
  const items = (await res.json()) as T[];
  return {
    items,
    total: Number(res.headers.get("X-WP-Total") ?? items.length),
    totalPages: Number(res.headers.get("X-WP-TotalPages") ?? 1),
  };
}

/**
 * Server-only client for the WooCommerce Store API (`/wp-json/wc/store/v1`) —
 * the same API WooCommerce's own Cart/Checkout blocks use, so ZarinPal's
 * block-compatible gateway works against it without extra glue.
 *
 * Store API is stateless: it identifies the guest cart via a `Cart-Token`
 * JWT and requires a `Nonce` header (CSRF protection) on every mutating
 * request, both handed back on every response. Route Handlers are
 * responsible for persisting the ones returned here into cookies — this
 * module just does the HTTP call and hands back whatever the API returned.
 */

const WP_URL = process.env.WOOCOMMERCE_URL?.replace(/\/$/, "");

export interface StoreApiCredentials {
  cartToken?: string;
  nonce?: string;
  bearerToken?: string;
}

export interface StoreApiResult<T> {
  data: T;
  cartToken?: string;
  nonce?: string;
}

export class StoreApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
  }
}

export async function storeApiFetch<T>(
  path: string,
  init: RequestInit & { storeCredentials?: StoreApiCredentials } = {}
): Promise<StoreApiResult<T>> {
  if (!WP_URL) throw new Error("WOOCOMMERCE_URL is not configured");

  const { storeCredentials, ...requestInit } = init;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(requestInit.headers as Record<string, string> | undefined),
  };
  if (storeCredentials?.cartToken) headers["Cart-Token"] = storeCredentials.cartToken;
  if (storeCredentials?.nonce) headers["Nonce"] = storeCredentials.nonce;
  if (storeCredentials?.bearerToken) headers["Authorization"] = `Bearer ${storeCredentials.bearerToken}`;

  const res = await fetch(`${WP_URL}/wp-json/wc/store/v1${path}`, {
    ...requestInit,
    headers,
    cache: "no-store",
  });

  const data = (await res.json()) as T;

  if (!res.ok) {
    throw new StoreApiError((data as { message?: string })?.message ?? "خطای سبد خرید", res.status, data);
  }

  return {
    data,
    cartToken: res.headers.get("Cart-Token") ?? undefined,
    nonce: res.headers.get("Nonce") ?? undefined,
  };
}

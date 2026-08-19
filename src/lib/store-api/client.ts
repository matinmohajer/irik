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

// WooCommerce's Store API runs error messages through esc_html(), which HTML-entity-encodes
// quotes/ampersands — fine for wp-admin markup, but these strings get shown as plain text here.
const HTML_ENTITIES: Record<string, string> = {
  "&quot;": '"',
  "&#039;": "'",
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
};

function decodeHtmlEntities(text: string): string {
  return text.replace(/&quot;|&#039;|&amp;|&lt;|&gt;/g, (entity) => HTML_ENTITIES[entity]);
}

export class StoreApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(decodeHtmlEntities(message));
  }
}

interface StoreApiErrorBody {
  message?: string;
  data?: {
    details?: Record<string, { message?: string }>;
  };
}

// The top-level `message` on a validation failure is a generic wrapper
// ("Invalid parameter(s): billing_address"); the field-specific reason a
// user can actually act on lives in `data.details[field].message`.
function extractErrorMessage(data: unknown): string {
  const body = data as StoreApiErrorBody;
  const detailMessages = [
    ...new Set(
      Object.values(body?.data?.details ?? {})
        .map((d) => d.message)
        .filter((m): m is string => Boolean(m))
    ),
  ];
  if (detailMessages.length > 0) return detailMessages.join(" ");
  return body?.message ?? "خطای سبد خرید";
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
    throw new StoreApiError(extractErrorMessage(data), res.status, data);
  }

  return {
    data,
    cartToken: res.headers.get("Cart-Token") ?? undefined,
    nonce: res.headers.get("Nonce") ?? undefined,
  };
}

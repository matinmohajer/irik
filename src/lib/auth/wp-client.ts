/**
 * Server-only client for the custom OTP auth endpoints in
 * wp-content/mu-plugins/irik-headless-auth.php (namespace `irik/v1`).
 * Reuses WOOCOMMERCE_URL since it's the same WordPress site.
 */

const WP_URL = process.env.WOOCOMMERCE_URL?.replace(/\/$/, "");

export interface OtpUser {
  id: number;
  phone: string;
  displayName: string;
}

export interface OrderItem {
  name: string;
  quantity: number;
  total: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  status: string;
  statusLabel: string;
  total: number;
  dateCreated: string | null;
  items: OrderItem[];
}

class WpAuthError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
  }
}

async function wpAuthFetch<T>(path: string, init?: RequestInit): Promise<T> {
  if (!WP_URL) throw new Error("WOOCOMMERCE_URL is not configured");

  const res = await fetch(`${WP_URL}/wp-json/irik/v1${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
    cache: "no-store",
  });

  const body = await res.json();
  if (!res.ok) {
    throw new WpAuthError(body?.message ?? "خطای ناشناخته", res.status);
  }
  return body as T;
}

export { WpAuthError };

export function requestOtp(phone: string) {
  return wpAuthFetch<{ success: true; expiresInSeconds: number; dev_code?: string; dev_note?: string }>(
    "/auth/request-otp",
    { method: "POST", body: JSON.stringify({ phone }) }
  );
}

export function verifyOtp(phone: string, code: string) {
  return wpAuthFetch<{ token: string; user: OtpUser }>("/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify({ phone, code }),
  });
}

export function getMyOrders(token: string) {
  return wpAuthFetch<Order[]>("/orders/mine", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

/** Public (no auth) lookup used by the post-checkout confirmation page — proof of ownership is the order key, same convention WooCommerce's own guest order-tracking uses. */
export function getOrderByKey(orderId: string, key: string) {
  return wpAuthFetch<Order>(`/orders/${orderId}?key=${encodeURIComponent(key)}`);
}

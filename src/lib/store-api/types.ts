/** Shapes returned by the WooCommerce Store API (subset of fields we use). Money fields are
 * strings scaled by `currency_minor_unit` (e.g. "8950000000" @ minor_unit=2 -> 89,500,000). */

export interface StoreMoney {
  currency_code: string;
  currency_minor_unit: number;
}

export interface StoreCartItem {
  key: string;
  id: number;
  quantity: number;
  quantity_limits: { minimum: number; maximum: number };
  name: string;
  sku: string;
  permalink: string;
  images: { src: string; alt: string }[];
  prices: StoreMoney & { price: string; regular_price: string; sale_price: string };
  totals: StoreMoney & { line_subtotal: string; line_total: string };
}

export interface StoreCartTotals extends StoreMoney {
  total_items: string;
  total_shipping: string | null;
  total_price: string;
  total_tax: string;
}

export interface StoreCart {
  items: StoreCartItem[];
  items_count: number;
  totals: StoreCartTotals;
  needs_shipping: boolean;
  shipping_rates: StoreShippingPackage[];
  errors?: { code: string; message: string }[];
}

export interface StoreShippingRate {
  rate_id: string;
  name: string;
  price: string;
  currency_minor_unit: number;
  selected: boolean;
}

export interface StoreShippingPackage {
  package_id: number;
  shipping_rates: StoreShippingRate[];
}

export interface StoreAddress {
  first_name: string;
  last_name: string;
  address_1: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  phone: string;
  email?: string;
}

export interface CheckoutResult {
  order_id: number;
  status: string;
  order_key: string;
  payment_result: {
    payment_status: string;
    redirect_url: string;
  };
}

/** Scales a Store API money string down to a plain number, e.g. "8950000000" @ 2 -> 89500000. */
export function parseStoreMoney(value: string, minorUnit: number): number {
  return Number(value) / Math.pow(10, minorUnit);
}

import { parseStoreMoney, type StoreCart, type StoreCartItem } from "@/lib/store-api/types";

export interface ShippingRate {
  rateId: string;
  name: string;
  price: number;
  selected: boolean;
}

export interface CartItem {
  key: string;
  productId: number;
  slug: string;
  name: string;
  image?: string;
  quantity: number;
  minQuantity: number;
  maxQuantity: number;
  price: number;
  lineTotal: number;
}

export interface Cart {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  shippingTotal: number;
  total: number;
  needsShipping: boolean;
  shippingRates: ShippingRate[];
}

function slugFromPermalink(permalink: string): string {
  const segments = permalink.replace(/\/$/, "").split("/");
  return segments[segments.length - 1] ?? "";
}

function mapItem(item: StoreCartItem): CartItem {
  const minorUnit = item.prices.currency_minor_unit;
  return {
    key: item.key,
    productId: item.id,
    slug: slugFromPermalink(item.permalink),
    name: item.name,
    image: item.images[0]?.src,
    quantity: item.quantity,
    minQuantity: item.quantity_limits.minimum,
    maxQuantity: item.quantity_limits.maximum,
    price: parseStoreMoney(item.prices.price, minorUnit),
    lineTotal: parseStoreMoney(item.totals.line_total, minorUnit),
  };
}

export function mapCart(cart: StoreCart): Cart {
  const minorUnit = cart.totals.currency_minor_unit;
  const shippingRates = (cart.shipping_rates?.[0]?.shipping_rates ?? []).map((rate) => ({
    rateId: rate.rate_id,
    name: rate.name,
    price: parseStoreMoney(rate.price, rate.currency_minor_unit),
    selected: rate.selected,
  }));

  return {
    items: cart.items.map(mapItem),
    itemCount: cart.items_count,
    subtotal: parseStoreMoney(cart.totals.total_items, minorUnit),
    shippingTotal: cart.totals.total_shipping ? parseStoreMoney(cart.totals.total_shipping, minorUnit) : 0,
    total: parseStoreMoney(cart.totals.total_price, minorUnit),
    needsShipping: cart.needs_shipping,
    shippingRates,
  };
}

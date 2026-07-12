"use client";

import { useCart } from "@/components/cart/CartProvider";
import { toPersianDigits } from "@/lib/format";

export function CartBadge() {
  const { itemCount } = useCart();
  if (itemCount <= 0) return null;
  return <span className="cart-count">{toPersianDigits(itemCount > 99 ? "99+" : itemCount)}</span>;
}

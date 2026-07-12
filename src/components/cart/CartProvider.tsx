"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { Cart } from "@/lib/store-api/map";

interface ActionResult {
  ok: boolean;
  message?: string;
}

interface CartContextValue {
  cart: Cart | null;
  itemCount: number;
  loading: boolean;
  refresh: () => Promise<void>;
  addItem: (productId: number, quantity?: number) => Promise<ActionResult>;
  updateItem: (key: string, quantity: number) => Promise<ActionResult>;
  removeItem: (key: string) => Promise<ActionResult>;
}

const CartContext = createContext<CartContextValue | null>(null);

const EMPTY_CART: Cart = {
  items: [],
  itemCount: 0,
  subtotal: 0,
  shippingTotal: 0,
  total: 0,
  needsShipping: false,
  shippingRates: [],
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/cart");
      if (res.ok) setCart(await res.json());
    } catch {
      // cart badge/page just show the last known state — not worth surfacing a global error for this
    }
  }, []);

  // Initial load on mount. Inlined (rather than calling `refresh`) with an
  // `ignore` guard, per React's documented pattern for fetching in an
  // effect — avoids setting state from a stale response if this unmounts
  // before the request resolves.
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const res = await fetch("/api/cart");
        if (!ignore && res.ok) setCart(await res.json());
      } catch {
        // cart badge/page just show the last known state — not worth surfacing a global error for this
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  const addItem = useCallback(async (productId: number, quantity = 1): Promise<ActionResult> => {
    setLoading(true);
    try {
      const res = await fetch("/api/cart/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });
      const data = await res.json();
      if (!res.ok) return { ok: false, message: data.message };
      setCart(data);
      return { ok: true };
    } catch {
      return { ok: false, message: "خطا در ارتباط با سرور." };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateItem = useCallback(async (key: string, quantity: number): Promise<ActionResult> => {
    setLoading(true);
    try {
      const res = await fetch(`/api/cart/items/${key}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
      const data = await res.json();
      if (!res.ok) return { ok: false, message: data.message };
      setCart(data);
      return { ok: true };
    } catch {
      return { ok: false, message: "خطا در ارتباط با سرور." };
    } finally {
      setLoading(false);
    }
  }, []);

  const removeItem = useCallback(async (key: string): Promise<ActionResult> => {
    setLoading(true);
    try {
      const res = await fetch(`/api/cart/items/${key}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) return { ok: false, message: data.message };
      setCart(data);
      return { ok: true };
    } catch {
      return { ok: false, message: "خطا در ارتباط با سرور." };
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <CartContext.Provider
      value={{ cart, itemCount: cart?.itemCount ?? EMPTY_CART.itemCount, loading, refresh, addItem, updateItem, removeItem }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

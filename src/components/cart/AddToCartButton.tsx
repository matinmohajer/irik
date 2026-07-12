"use client";

import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { Icon } from "@/components/icons/Icon";

type Variant = "compact" | "full";

export function AddToCartButton({
  productId,
  quantity = 1,
  disabled,
  variant = "compact",
}: {
  productId: number;
  quantity?: number;
  disabled?: boolean;
  variant?: Variant;
}) {
  const { addItem, loading } = useCart();
  const [state, setState] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleClick() {
    if (!Number.isFinite(productId)) {
      setState("error");
      setMessage("این محصول نمایشی است و قابل افزودن به سبد نیست.");
      return;
    }
    const result = await addItem(productId, quantity);
    if (result.ok) {
      setState("success");
      setMessage(null);
      setTimeout(() => setState("idle"), 1500);
    } else {
      setState("error");
      setMessage(result.message ?? "خطا در افزودن به سبد خرید.");
    }
  }

  if (variant === "compact") {
    return (
      <button
        type="button"
        className="add-btn"
        onClick={handleClick}
        disabled={disabled || loading}
        aria-label="افزودن به سبد خرید"
        title={state === "error" ? message ?? undefined : undefined}
      >
        <Icon name={state === "success" ? "check" : "plus"} className="icon" />
      </button>
    );
  }

  return (
    <div style={{ flex: 1 }}>
      <button type="button" className="btn btn-primary btn-block" onClick={handleClick} disabled={disabled || loading}>
        <Icon name={state === "success" ? "check" : "cart"} className="icon" />
        {disabled ? "اتمام موجودی" : state === "success" ? "به سبد اضافه شد" : "افزودن به سبد خرید"}
      </button>
      {message && <p className="form-error">{message}</p>}
    </div>
  );
}

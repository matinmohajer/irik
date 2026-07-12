"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { Icon } from "@/components/icons/Icon";
import { formatToman } from "@/lib/format";
import { IRAN_PROVINCES } from "@/lib/iran-provinces";
import type { ShippingRate } from "@/lib/store-api/map";

interface AddressForm {
  firstName: string;
  lastName: string;
  address1: string;
  city: string;
  state: string;
  postcode: string;
  phone: string;
  email: string;
}

const EMPTY_ADDRESS: AddressForm = {
  firstName: "",
  lastName: "",
  address1: "",
  city: "اصفهان",
  state: "ESF",
  postcode: "",
  phone: "",
  email: "",
};

export function CheckoutForm() {
  const { cart, refresh } = useCart();
  const [form, setForm] = useState<AddressForm>(EMPTY_ADDRESS);
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [selectedRate, setSelectedRate] = useState<string | null>(null);
  const [step, setStep] = useState<"address" | "shipping">("address");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateField<K extends keyof AddressForm>(key: K, value: AddressForm[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submitAddress(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/checkout/address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "خطا در ثبت آدرس.");
        return;
      }
      setShippingRates(data.shippingRates);
      setSelectedRate(data.shippingRates.find((r: ShippingRate) => r.selected)?.rateId ?? data.shippingRates[0]?.rateId ?? null);
      setStep("shipping");
    } catch {
      setError("ارتباط با سرور برقرار نشد.");
    } finally {
      setLoading(false);
    }
  }

  async function chooseRate(rateId: string) {
    setSelectedRate(rateId);
    setLoading(true);
    try {
      await fetch("/api/checkout/shipping-rate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rateId }),
      });
      await refresh();
    } finally {
      setLoading(false);
    }
  }

  async function placeOrder() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/checkout/place-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "ثبت سفارش ناموفق بود.");
        return;
      }
      window.location.href = data.redirectUrl;
    } catch {
      setError("ارتباط با سرور برقرار نشد.");
      setLoading(false);
    }
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="empty-state">
        <Icon name="cart" className="icon icon-lg" style={{ margin: "0 auto 16px", color: "var(--ink-faint)" }} />
        <h2>سبد خرید شما خالی است</h2>
        <p>برای ادامه فرآیند خرید، ابتدا محصولی به سبد خرید اضافه کنید.</p>
        <Link href="/products/laptop" className="btn btn-primary" style={{ marginTop: 20 }}>
          مشاهده محصولات
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-layout">
      <div>
        <div className="checkout-section">
          <h2 className="checkout-step-title">
            <span className="checkout-step-num">۱</span>
            اطلاعات ارسال
          </h2>
          <form onSubmit={submitAddress}>
            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="firstName">نام</label>
                <input id="firstName" value={form.firstName} onChange={(e) => updateField("firstName", e.target.value)} required />
              </div>
              <div className="form-field">
                <label htmlFor="lastName">نام خانوادگی</label>
                <input id="lastName" value={form.lastName} onChange={(e) => updateField("lastName", e.target.value)} required />
              </div>
              <div className="form-field full">
                <label htmlFor="address1">آدرس کامل</label>
                <input id="address1" value={form.address1} onChange={(e) => updateField("address1", e.target.value)} required />
              </div>
              <div className="form-field">
                <label htmlFor="state">استان</label>
                <select id="state" value={form.state} onChange={(e) => updateField("state", e.target.value)} required>
                  {IRAN_PROVINCES.map((p) => (
                    <option key={p.code} value={p.code}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label htmlFor="city">شهر</label>
                <input id="city" value={form.city} onChange={(e) => updateField("city", e.target.value)} required />
              </div>
              <div className="form-field">
                <label htmlFor="postcode">کد پستی</label>
                <input id="postcode" value={form.postcode} onChange={(e) => updateField("postcode", e.target.value)} required dir="ltr" />
              </div>
              <div className="form-field">
                <label htmlFor="phone">شماره موبایل</label>
                <input id="phone" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} required dir="ltr" />
              </div>
              <div className="form-field full">
                <label htmlFor="email">ایمیل (اختیاری)</label>
                <input id="email" type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} dir="ltr" />
              </div>
            </div>
            {error && step === "address" && (
              <p className="form-error">
                <Icon name="x" className="icon icon-sm" />
                {error}
              </p>
            )}
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: 18 }}>
              {loading ? "در حال ثبت…" : "ثبت آدرس و ادامه"}
            </button>
          </form>
        </div>

        {step === "shipping" && (
          <div className="checkout-section">
            <h2 className="checkout-step-title">
              <span className="checkout-step-num">۲</span>
              روش ارسال
            </h2>
            {shippingRates.map((rate) => (
              <label key={rate.rateId} className={`shipping-option${selectedRate === rate.rateId ? " is-active" : ""}`}>
                <span className="shipping-option-label">
                  <input
                    type="radio"
                    name="shipping-rate"
                    checked={selectedRate === rate.rateId}
                    onChange={() => chooseRate(rate.rateId)}
                  />
                  {rate.name}
                </span>
                <span className="mono">{rate.price === 0 ? "رایگان" : formatToman(rate.price)}</span>
              </label>
            ))}

            {error && step === "shipping" && (
              <p className="form-error">
                <Icon name="x" className="icon icon-sm" />
                {error}
              </p>
            )}
            <button type="button" className="btn btn-primary btn-block" onClick={placeOrder} disabled={loading} style={{ marginTop: 12 }}>
              {loading ? "در حال انتقال به درگاه پرداخت…" : "پرداخت و تکمیل سفارش"}
            </button>
          </div>
        )}
      </div>

      <aside className="cart-summary">
        <h2>خلاصه سفارش</h2>
        {cart.items.map((item) => (
          <div className="cart-summary-row" key={item.key}>
            <span>
              {item.name} × {item.quantity}
            </span>
            <span className="mono">{formatToman(item.lineTotal)}</span>
          </div>
        ))}
        <div className="cart-summary-row">
          <span>هزینه ارسال</span>
          <span className="mono">{step === "shipping" ? formatToman(cart.shippingTotal) : "—"}</span>
        </div>
        <div className="cart-summary-total">
          <span className="bold">مبلغ قابل پرداخت</span>
          <span className="price price-now">{formatToman(cart.total)}</span>
        </div>
      </aside>
    </div>
  );
}

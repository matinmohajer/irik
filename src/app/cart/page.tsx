"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { Icon } from "@/components/icons/Icon";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { formatToman, toPersianDigits } from "@/lib/format";
import { isSvgPath } from "@/lib/image";

export default function CartPage() {
  const { cart, loading, updateItem, removeItem } = useCart();

  if (!cart) {
    return (
      <>
        <Breadcrumb items={[{ label: "آیریک", href: "/" }, { label: "سبد خرید" }]} />
        <div className="container section-tight">
          <p style={{ color: "var(--ink-faint)", textAlign: "center", padding: "60px 0" }}>در حال بارگذاری سبد خرید…</p>
        </div>
      </>
    );
  }

  if (cart.items.length === 0) {
    return (
      <>
        <Breadcrumb items={[{ label: "آیریک", href: "/" }, { label: "سبد خرید" }]} />
        <div className="container">
          <div className="empty-state">
            <Icon name="cart" className="icon icon-lg" style={{ margin: "0 auto 16px", color: "var(--ink-faint)" }} />
            <h2>سبد خرید شما خالی است</h2>
            <p>محصولی برای نمایش وجود ندارد.</p>
            <Link href="/products/laptop" className="btn btn-primary" style={{ marginTop: 20 }}>
              مشاهده محصولات
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Breadcrumb items={[{ label: "آیریک", href: "/" }, { label: "سبد خرید" }]} />
      <div className="container">
        <div className="cart-layout">
          <div className="cart-lines">
            {cart.items.map((item) => (
              <div className="cart-line" key={item.key}>
                <div className="cart-line-media">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt=""
                      width={80}
                      height={80}
                      style={{ objectFit: "cover" }}
                      unoptimized={isSvgPath(item.image)}
                    />
                  ) : (
                    <Icon name="laptop" className="icon" />
                  )}
                </div>
                <div className="cart-line-body">
                  <h3>
                    <Link href={`/product/${item.slug}`}>{item.name}</Link>
                  </h3>
                  <span className="cart-line-price">{formatToman(item.price)}</span>
                </div>
                <div className="cart-line-actions">
                  <div className="stepper">
                    <button
                      type="button"
                      aria-label="کاهش تعداد"
                      disabled={loading}
                      onClick={() => updateItem(item.key, Math.max(item.minQuantity, item.quantity - 1))}
                    >
                      <Icon name="minus" className="icon icon-sm" />
                    </button>
                    <span>{toPersianDigits(item.quantity)}</span>
                    <button
                      type="button"
                      aria-label="افزایش تعداد"
                      disabled={loading || item.quantity >= item.maxQuantity}
                      onClick={() => updateItem(item.key, item.quantity + 1)}
                    >
                      <Icon name="plus" className="icon icon-sm" />
                    </button>
                  </div>
                  <button type="button" className="cart-line-remove" disabled={loading} onClick={() => removeItem(item.key)}>
                    <Icon name="x" className="icon icon-sm" />
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>

          <aside className="cart-summary">
            <h2>خلاصه سفارش</h2>
            <div className="cart-summary-row">
              <span>جمع محصولات</span>
              <span className="mono">{formatToman(cart.subtotal)}</span>
            </div>
            <div className="cart-summary-row">
              <span>هزینه ارسال</span>
              <span>در مرحله بعد</span>
            </div>
            <div className="cart-summary-total">
              <span className="bold">مبلغ قابل پرداخت</span>
              <span className="price price-now">{formatToman(cart.total)}</span>
            </div>
            <Link href="/checkout" className="btn btn-primary btn-block">
              ادامه فرآیند خرید
            </Link>
          </aside>
        </div>
      </div>
    </>
  );
}

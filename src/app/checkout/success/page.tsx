import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Icon } from "@/components/icons/Icon";
import { getOrderByKey } from "@/lib/auth/wp-client";
import { formatToman, toPersianDigits } from "@/lib/format";

export const metadata: Metadata = {
  title: "تایید سفارش",
};

interface PageProps {
  searchParams: Promise<{ order?: string; key?: string }>;
}

export default async function CheckoutSuccessPage({ searchParams }: PageProps) {
  const { order: orderId, key } = await searchParams;

  const order = orderId && key ? await getOrderByKey(orderId, key).catch(() => null) : null;

  return (
    <>
      <Breadcrumb items={[{ label: "آیریک", href: "/" }, { label: "تایید سفارش" }]} />
      <div className="container section-tight">
        {!order ? (
          <div className="empty-state">
            <Icon name="x" className="icon icon-lg" style={{ margin: "0 auto 16px", color: "var(--danger)" }} />
            <h2>سفارش یافت نشد</h2>
            <p>لینک نامعتبر است یا سفارش شما پیدا نشد. در صورت کسر وجه، برای پیگیری با پشتیبانی تماس بگیرید.</p>
          </div>
        ) : (
          <div className="auth-card bracket" style={{ maxWidth: 560 }}>
            <Icon name="check" className="icon icon-lg" style={{ color: "var(--success)", marginBottom: 12 }} />
            <h1 className="disp">سفارش شما ثبت شد</h1>
            <p>
              شماره سفارش #{toPersianDigits(order.orderNumber)} — وضعیت: {order.statusLabel}
            </p>

            <div className="order-items" style={{ margin: "20px 0" }}>
              {order.items.map((item, i) => (
                <div className="order-item-row" key={i}>
                  <span>
                    {item.name} × {toPersianDigits(item.quantity)}
                  </span>
                  <span className="mono">{formatToman(item.total)}</span>
                </div>
              ))}
            </div>
            <div className="order-card-foot" style={{ marginBottom: 20 }}>
              <span style={{ color: "var(--ink-soft)", fontSize: ".85rem" }}>جمع کل</span>
              <span className="price price-now">{formatToman(order.total)}</span>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <Link href="/account/orders" className="btn btn-primary">
                مشاهده سفارش‌های من
              </Link>
              <Link href="/products/laptop" className="btn btn-ghost">
                ادامه خرید
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

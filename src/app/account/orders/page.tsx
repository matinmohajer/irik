import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Icon } from "@/components/icons/Icon";
import { getSession, getSessionToken } from "@/lib/auth/session";
import { getMyOrders, type Order } from "@/lib/auth/wp-client";
import { formatJalaliDate, formatToman, toPersianDigits } from "@/lib/format";

export const metadata: Metadata = {
  title: "سفارش‌های من",
};

const STATUS_TONE: Record<string, "is-positive" | "is-neutral" | "is-negative"> = {
  completed: "is-positive",
  processing: "is-positive",
  "on-hold": "is-neutral",
  pending: "is-neutral",
  cancelled: "is-negative",
  failed: "is-negative",
  refunded: "is-negative",
};

export default async function OrdersPage() {
  const session = await getSession();
  if (!session) redirect("/account/login?next=/account/orders");

  const token = await getSessionToken();
  let orders: Order[] = [];
  let loadError = false;
  try {
    orders = await getMyOrders(token!);
  } catch {
    loadError = true;
  }

  return (
    <>
      <Breadcrumb items={[{ label: "آیریک", href: "/" }, { label: "حساب کاربری", href: "/account" }, { label: "سفارش‌های من" }]} />
      <div className="container section-tight">
        {loadError && (
          <div className="empty-state">
            <Icon name="truck" className="icon icon-lg" style={{ margin: "0 auto 16px", color: "var(--danger)" }} />
            <h2>دریافت سفارش‌ها با خطا مواجه شد</h2>
            <p>لطفاً صفحه را رفرش کنید یا کمی بعد دوباره تلاش کنید.</p>
          </div>
        )}

        {!loadError && orders.length === 0 && (
          <div className="empty-state">
            <Icon name="truck" className="icon icon-lg" style={{ margin: "0 auto 16px", color: "var(--ink-faint)" }} />
            <h2>سفارشی ثبت نشده است</h2>
            <p>محصولات مورد نظرتان را از فروشگاه انتخاب کنید تا اولین سفارش شما اینجا نمایش داده شود.</p>
          </div>
        )}

        {!loadError && orders.length > 0 && (
          <div className="order-list">
            {orders.map((order) => (
              <div className="order-card" key={order.id}>
                <div className="order-card-head">
                  <div>
                    <span className="num">سفارش #{toPersianDigits(order.orderNumber)}</span>
                    {order.dateCreated && <span className="date">{formatJalaliDate(order.dateCreated)}</span>}
                  </div>
                  <span className={`order-status ${STATUS_TONE[order.status] ?? "is-neutral"}`}>{order.statusLabel}</span>
                </div>
                <div className="order-items">
                  {order.items.map((item, i) => (
                    <div className="order-item-row" key={i}>
                      <span>
                        {item.name} × {toPersianDigits(item.quantity)}
                      </span>
                      <span className="mono">{formatToman(item.total)}</span>
                    </div>
                  ))}
                </div>
                <div className="order-card-foot">
                  <span style={{ color: "var(--ink-soft)", fontSize: ".85rem" }}>جمع کل</span>
                  <span className="price price-now">{formatToman(order.total)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Icon } from "@/components/icons/Icon";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { getSession } from "@/lib/auth/session";
import { formatIranianPhone } from "@/lib/format";

export const metadata: Metadata = {
  title: "حساب کاربری",
};

export default async function AccountPage() {
  const session = await getSession();
  if (!session) redirect("/account/login?next=/account");

  return (
    <>
      <Breadcrumb items={[{ label: "آیریک", href: "/" }, { label: "حساب کاربری" }]} />
      <div className="container section-tight">
        <div className="auth-card bracket" style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Icon name="user" className="icon icon-lg" style={{ color: "var(--accent)" }} />
              <div>
                <strong className="bold" style={{ display: "block", fontSize: "1rem" }}>
                  {formatIranianPhone(session.phone)}
                </strong>
                <span style={{ color: "var(--ink-faint)", fontSize: ".78rem" }}>حساب کاربری آیریک</span>
              </div>
            </div>
            <LogoutButton />
          </div>
        </div>

        <div className="cat-grid" style={{ gridTemplateColumns: "repeat(2, 1fr)", maxWidth: 420 }}>
          <Link href="/account/orders" className="cat-tile">
            <Icon name="truck" className="icon icon-lg" />
            <span>سفارش‌های من</span>
          </Link>
          <Link href="/account/wishlist" className="cat-tile">
            <Icon name="heart" className="icon icon-lg" />
            <span>علاقه‌مندی‌ها</span>
          </Link>
        </div>
      </div>
    </>
  );
}

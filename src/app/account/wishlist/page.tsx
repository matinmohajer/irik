import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/icons/Icon";
import { Breadcrumb } from "@/components/layout/Breadcrumb";

export const metadata: Metadata = {
  title: "علاقه‌مندی‌ها",
};

export default function WishlistPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "آیریک", href: "/" }, { label: "علاقه‌مندی‌ها" }]} />
      <div className="container">
        <div className="empty-state">
          <Icon name="heart" className="icon icon-lg" style={{ margin: "0 auto 16px", color: "var(--ink-faint)" }} />
          <h2>هنوز محصولی را نشان نکرده‌اید</h2>
          <p>روی نماد قلب هر محصول بزنید تا اینجا برای شما ذخیره شود.</p>
          <Link href="/products/laptop" className="btn btn-primary" style={{ marginTop: 20 }}>
            مشاهده محصولات
          </Link>
        </div>
      </div>
    </>
  );
}

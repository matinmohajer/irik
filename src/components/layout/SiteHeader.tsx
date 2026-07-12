import Link from "next/link";
import { CartBadge } from "@/components/cart/CartBadge";
import { Icon } from "@/components/icons/Icon";
import { Logo } from "@/components/layout/Logo";
import { MegaMenu } from "@/components/layout/MegaMenu";
import { MobileNav } from "@/components/layout/MobileNav";
import type { CategoryNode } from "@/lib/types";

export function SiteHeader({ categoryTree }: { categoryTree: CategoryNode[] }) {
  return (
    <header className="site-header">
      <div className="header-row">
        <MobileNav tree={categoryTree} />
        <Logo />

        <MegaMenu tree={categoryTree} />

        <form action="/search" method="GET" className="header-search" role="search">
          <Icon name="search" />
          <input type="text" name="q" placeholder="جستجوی محصول، برند یا دسته‌بندی…" />
        </form>

        <div className="header-actions">
          <Link href="/account/wishlist" className="btn-icon" aria-label="علاقه‌مندی‌ها">
            <Icon name="heart" />
          </Link>
          <Link href="/account" className="btn-icon" aria-label="حساب کاربری">
            <Icon name="user" />
          </Link>
          <Link href="/cart" className="btn-icon cart-btn" aria-label="سبد خرید">
            <Icon name="cart" />
            <CartBadge />
          </Link>
        </div>
      </div>
    </header>
  );
}

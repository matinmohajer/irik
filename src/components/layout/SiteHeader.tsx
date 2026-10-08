import { Icon } from "@/components/icons/Icon";
import { Logo } from "@/components/layout/Logo";
import { MegaMenu } from "@/components/layout/MegaMenu";
import { MobileNav } from "@/components/layout/MobileNav";
import { whatsappHref } from "@/lib/site-config";
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
          <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp header-wa" aria-label="سفارش در واتس‌اپ">
            <Icon name="whatsapp" />
            <span className="header-wa-label">سفارش در واتس‌اپ</span>
          </a>
        </div>
      </div>
    </header>
  );
}

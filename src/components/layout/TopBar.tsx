import Link from "next/link";
import { Icon } from "@/components/icons/Icon";
import { siteConfig } from "@/lib/site-config";

export function TopBar() {
  return (
    <div className="topbar">
      <div className="topbar-inner">
        <div className="topbar-right">
          <Link href="/about">
            <Icon name="pin" className="icon icon-sm" />
            {siteConfig.address}
          </Link>
          <a href={siteConfig.phoneHref}>
            <Icon name="phone" className="icon icon-sm" />
            {siteConfig.phoneDisplay}
          </a>
        </div>
        <div className="topbar-left">
          <Link href="/magazine?category=buying-guide">راهنمای خرید</Link>
          <Link href="/account/orders">پیگیری سفارش</Link>
        </div>
      </div>
    </div>
  );
}

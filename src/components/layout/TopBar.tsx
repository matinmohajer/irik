import Link from "next/link";
import { Icon } from "@/components/icons/Icon";
import { siteConfig, whatsappHref } from "@/lib/site-config";

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
            <span dir="ltr">{siteConfig.phoneDisplay}</span>
          </a>
        </div>
        <div className="topbar-left">
          <Link href="/magazine?category=buying-guide">راهنمای خرید</Link>
          <a href={whatsappHref()} target="_blank" rel="noopener noreferrer">
            <Icon name="whatsapp" className="icon icon-sm" />
            سفارش در واتس‌اپ
          </a>
        </div>
      </div>
    </div>
  );
}

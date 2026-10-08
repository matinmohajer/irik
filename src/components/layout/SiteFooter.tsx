import Link from "next/link";
import { Icon } from "@/components/icons/Icon";
import { Logo } from "@/components/layout/Logo";
import { siteConfig, whatsappHref } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-cta">
        <div className="footer-cta-inner">
          <div>
            <h4 className="bold">مشاوره تخصصی پیش از خرید نیاز دارید؟</h4>
            <p>کارشناسان آیریک در واتس‌اپ و بازار بزرگ کامپیوتر اصفهان پاسخگوی شما هستند.</p>
          </div>
          <div className="footer-cta-actions">
            <a href={siteConfig.phoneHref} className="footer-phone bold">
              <Icon name="phone" />
              <span dir="ltr">{siteConfig.phoneDisplay}</span>
            </a>
            <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
              <Icon name="whatsapp" className="icon" />
              گفتگو در واتس‌اپ
            </a>
          </div>
        </div>
      </div>

      <div className="footer-main">
        <div className="footer-about">
          <Logo />
          <p>{siteConfig.description}</p>
          <div className="footer-social">
            <a href="#" aria-label="اینستاگرام">
              <Icon name="chip-brand" className="icon icon-sm" />
            </a>
            <a href="#" aria-label="تلگرام">
              <Icon name="mail" className="icon icon-sm" />
            </a>
            <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" aria-label="واتس‌اپ">
              <Icon name="whatsapp" className="icon icon-sm" />
            </a>
            <a href={siteConfig.phoneHref} aria-label="تماس">
              <Icon name="phone" className="icon icon-sm" />
            </a>
          </div>
        </div>

        <div className="footer-col">
          <h5>دسته‌بندی‌ها</h5>
          <ul>
            <li>
              <Link href="/products/laptop">لپ‌تاپ</Link>
            </li>
            <li>
              <Link href="/products/desktop">کامپیوتر و قطعات</Link>
            </li>
            <li>
              <Link href="/products/console">کنسول بازی</Link>
            </li>
            <li>
              <Link href="/products/monitor">مانیتور</Link>
            </li>
            <li>
              <Link href="/products/accessories">لوازم جانبی</Link>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h5>خدمات مشتریان</h5>
          <ul>
            <li>
              <a href={whatsappHref()} target="_blank" rel="noopener noreferrer">
                سفارش در واتس‌اپ
              </a>
            </li>
            <li>
              <Link href="/magazine?category=buying-guide">راهنمای خرید</Link>
            </li>
            <li>
              <Link href="/about#warranty">شرایط گارانتی</Link>
            </li>
            <li>
              <Link href="/about#returns">مرجوعی کالا</Link>
            </li>
            <li>
              <Link href="/about#contact">تماس با ما</Link>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h5>آدرس فروشگاه</h5>
          <ul className="footer-addr">
            <li>
              <Icon name="pin" />
              {siteConfig.address}
            </li>
            <li>
              <Icon name="clock" />
              {siteConfig.hours}
            </li>
            <li>
              <Icon name="mail" />
              {siteConfig.email}
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-badges">
        <div className="footer-badges-inner">
          <span className="trust-badge">
            <Icon name="shield" />
            ضمانت اصالت کالا
          </span>
          <span className="trust-badge">
            <Icon name="whatsapp" />
            سفارش سریع از واتس‌اپ
          </span>
          <span className="trust-badge">
            <Icon name="truck" />
            ارسال به سراسر کشور
          </span>
          <span className="trust-badge">
            <Icon name="headset" />
            پشتیبانی ۷ روز هفته
          </span>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <span>© ۱۴۰۵ آیریک — تمامی حقوق محفوظ است.</span>
          <span>بازار بزرگ کامپیوتر، خیابان طالقانی، اصفهان</span>
        </div>
      </div>
    </footer>
  );
}

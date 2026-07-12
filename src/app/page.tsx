import Link from "next/link";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { Icon } from "@/components/icons/Icon";
import { ProductCard } from "@/components/product/ProductCard";
import { getCategories, getFeaturedProducts, getLatestPosts } from "@/lib/data";
import { siteConfig } from "@/lib/site-config";

const BRANDS = ["Lenovo", "ASUS", "Acer", "Apple", "Sony", "Samsung", "Corsair", "Logitech"];

export default async function HomePage() {
  const [categories, featuredProducts, latestPosts] = await Promise.all([
    getCategories(),
    getFeaturedProducts(4),
    getLatestPosts(3),
  ]);

  return (
    <>
      <section className="hero">
        <div className="hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">فروشگاه تخصصی سخت‌افزار در بازار بزرگ کامپیوتر اصفهان</span>
            <h1 className="disp">
              سخت‌افزاری که
              <br />
              واقعاً به آن نیاز دارید.
            </h1>
            <p>
              لپ‌تاپ، کامپیوتر، کنسول بازی و لوازم جانبی، با مشاوره تخصصی و ضمانت اصالت کالا — از فروشگاهی که سال‌هاست در بازار
              بزرگ کامپیوتر اصفهان کنار متخصصان واقعی ایستاده.
            </p>
            <div className="hero-ctas">
              <Link href="/products/laptop" className="btn btn-primary">
                مشاهده لپ‌تاپ‌های گیمینگ
              </Link>
              <Link href="/products/console" className="btn btn-ghost">
                دنیای کنسول بازی
              </Link>
            </div>
            <ul className="hero-trust">
              <li>
                <Icon name="shield" />
                ضمانت اصالت کالا
              </li>
              <li>
                <Icon name="truck" />
                ارسال کمتر از ۲۴ ساعت
              </li>
              <li>
                <Icon name="headset" />
                مشاوره تخصصی حضوری
              </li>
            </ul>
          </div>

          <div className="hero-visual bracket">
            <div className="bg-grid" />
            <svg viewBox="0 0 400 340" style={{ position: "relative", width: "100%", height: "100%" }} aria-hidden="true">
              <rect x="70" y="46" width="260" height="164" rx="8" fill="none" stroke="var(--ink)" strokeWidth="2" />
              <rect x="86" y="60" width="228" height="136" rx="2" fill="var(--paper-raised)" stroke="var(--line)" strokeWidth="1.5" />
              <path d="M40 226 H360 L338 258 H62 Z" fill="none" stroke="var(--ink)" strokeWidth="2" strokeLinejoin="round" />
              <line x1="176" y1="242" x2="224" y2="242" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" />
              <g stroke="var(--accent)" strokeWidth="1.5" fill="none" strokeLinecap="round">
                <path d="M314 90 H352 V60" />
                <circle cx="352" cy="60" r="3" fill="var(--accent)" stroke="none" />
                <path d="M86 150 H46 V190" />
                <circle cx="46" cy="190" r="3" fill="var(--accent)" stroke="none" />
              </g>
            </svg>
            <div className="hero-callout" style={{ top: "8%", insetInlineEnd: "2%" }}>
              <span className="dot" />
              <span className="tag-mono">RTX 4060</span>
            </div>
            <div className="hero-callout" style={{ bottom: "14%", insetInlineStart: "1%" }}>
              <span className="dot" />
              <b>موجود در انبار اصفهان</b>
            </div>
          </div>
        </div>
      </section>

      <div className="container section-tight">
        <div className="cat-grid">
          {categories
            .filter((category) => !category.parentSlug)
            .map((category) => (
              <Link key={category.id} href={`/products/${category.slug}`} className="cat-tile">
                <Icon name={category.icon} className="icon icon-lg" />
                <span>{category.name}</span>
              </Link>
            ))}
        </div>
      </div>

      <div className="container section-tight">
        <div className="trust-strip">
          <div className="trust-item">
            <Icon name="truck" />
            <div>
              <strong>ارسال سریع</strong>
              <p>تحویل کمتر از ۲۴ ساعت در اصفهان</p>
            </div>
          </div>
          <div className="trust-item">
            <Icon name="shield" />
            <div>
              <strong>ضمانت اصالت</strong>
              <p>گارانتی رسمی روی تمام کالاها</p>
            </div>
          </div>
          <div className="trust-item">
            <Icon name="card" />
            <div>
              <strong>پرداخت امن</strong>
              <p>پرداخت آنلاین یا در محل فروشگاه</p>
            </div>
          </div>
          <div className="trust-item">
            <Icon name="headset" />
            <div>
              <strong>مشاوره تخصصی</strong>
              <p>راهنمایی حضوری و تلفنی رایگان</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container section">
        <div className="section-head">
          <div>
            <h2 className="section-title">پرفروش‌ترین‌های آیریک</h2>
            <p className="section-sub">محصولاتی که این هفته بیشترین فروش را در فروشگاه داشته‌اند</p>
          </div>
          <Link href="/products/laptop" className="btn btn-ghost btn-sm">
            مشاهده همه محصولات
          </Link>
        </div>
        <div className="product-grid">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      <div className="container section-tight">
        <div className="banner-dark">
          <div>
            <span className="eyebrow" style={{ color: "#5b9bff" }}>
              <Icon name="gamepad" className="icon" style={{ color: "#5b9bff" }} />
              دنیای کنسول بازی
            </span>
            <h3>PS5، Xbox Series X و جدیدترین بازی‌های روز</h3>
            <p>کنسول موردعلاقه‌ات را با گارانتی رسمی و قیمت رقابتی از آیریک بخر — دسته اضافه و بازی هدیه برای خریدهای این هفته.</p>
            <Link href="/products/console" className="btn btn-primary">
              مشاهده کنسول‌ها
            </Link>
          </div>
          <svg viewBox="0 0 160 160" width="150" height="150" style={{ position: "relative", color: "#5b9bff" }} aria-hidden="true">
            <use href="#i-gamepad" stroke="#5b9bff" fill="none" strokeWidth="1.1" width="160" height="160" />
          </svg>
        </div>
      </div>

      <div className="container section">
        <div className="section-head">
          <div>
            <h2 className="section-title">از مجله آیریک</h2>
            <p className="section-sub">راهنمای خرید و مقایسه تخصصی محصولات، به‌قلم کارشناسان فروشگاه</p>
          </div>
          <Link href="/magazine" className="btn btn-ghost btn-sm">
            همه مطالب
          </Link>
        </div>
        <div className="article-grid">
          {latestPosts.map((post) => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </div>
      </div>

      <div className="container section-tight">
        <hr className="hr" style={{ marginBottom: 32 }} />
        <div className="brand-strip">
          {BRANDS.map((brand) => (
            <span key={brand}>{brand}</span>
          ))}
        </div>
        <hr className="hr" style={{ marginTop: 32 }} />
      </div>

      <div className="container section-tight">
        <div className="visit-band">
          <div className="addr">
            <Icon name="pin" className="icon icon-lg" />
            <div>
              <strong className="bold" style={{ fontSize: "1rem" }}>
                فروشگاه ما را از نزدیک ببینید
              </strong>
              <p>
                {siteConfig.address} — {siteConfig.hours}
              </p>
            </div>
          </div>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(siteConfig.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-dark"
          >
            مسیر رسیدن به فروشگاه
          </a>
        </div>
      </div>
    </>
  );
}

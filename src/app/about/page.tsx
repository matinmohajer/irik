import type { Metadata } from "next";
import { Icon } from "@/components/icons/Icon";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "درباره ما",
  description: "درباره فروشگاه آیریک، آدرس، ساعات کاری، شرایط گارانتی و راه‌های تماس.",
};

export default function AboutPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "آیریک", href: "/" }, { label: "درباره ما" }]} />

      <div className="container mag-hero">
        <span className="eyebrow">درباره آیریک</span>
        <h1>فروشگاهی که کنار متخصصان واقعی ایستاده</h1>
        <p className="tab-prose" style={{ marginTop: 14 }}>
          آیریک از دل بازار بزرگ کامپیوتر اصفهان شروع شد؛ با بیش از ۵ سال سابقه فعالیت در این حوزه، هر روز با نیاز واقعی
          مشتری‌ها روبه‌رو می‌شویم. تمرکز ما روی لپ‌تاپ، کامپیوتر، کنسول بازی و لوازم جانبی است — با انتخاب دقیق کالا، قیمت
          شفاف و مشاوره‌ای که واقعاً به کارتان می‌آید.
        </p>
      </div>

      <div className="container section-tight">
        <div className="visit-band">
          <div className="addr">
            <Icon name="pin" className="icon icon-lg" />
            <div>
              <strong className="bold" style={{ fontSize: "1rem" }}>
                آدرس فروشگاه
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

      <div className="container section" id="contact">
        <div className="section-head">
          <h2 className="section-title">تماس با ما</h2>
        </div>
        <div className="trust-strip">
          <div className="trust-item">
            <Icon name="phone" />
            <div>
              <strong>تلفن فروشگاه</strong>
              <p>
                <a href={siteConfig.phoneHref}>{siteConfig.phoneDisplay}</a>
              </p>
            </div>
          </div>
          <div className="trust-item">
            <Icon name="mail" />
            <div>
              <strong>ایمیل</strong>
              <p>
                <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
              </p>
            </div>
          </div>
          <div className="trust-item">
            <Icon name="clock" />
            <div>
              <strong>ساعات کاری</strong>
              <p>{siteConfig.hours}</p>
            </div>
          </div>
          <div className="trust-item">
            <Icon name="headset" />
            <div>
              <strong>پشتیبانی آنلاین</strong>
              <p>پاسخگویی در تمام روزهای هفته</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container section-tight" id="warranty">
        <div className="section-head">
          <h2 className="section-title">شرایط گارانتی</h2>
        </div>
        <div className="tab-prose">
          <p>
            تمامی کالاهای آیریک با ضمانت اصالت و گارانتی رسمی شرکتی عرضه می‌شوند. مدت و شرایط گارانتی بسته به برند و نوع کالا
            متفاوت است و در صفحه هر محصول درج شده است.
          </p>
        </div>
      </div>

      <div className="container section-tight" id="returns" style={{ paddingBottom: 64 }}>
        <div className="section-head">
          <h2 className="section-title">مرجوعی کالا</h2>
        </div>
        <div className="tab-prose">
          <p>
            در صورت وجود ایراد فنی یا عدم مطابقت کالا با سفارش، تا ۷ روز پس از تحویل امکان مرجوعی یا تعویض کالا وجود دارد.
            کالا باید بدون آسیب و همراه با جعبه و متعلقات اصلی بازگردانده شود.
          </p>
        </div>
      </div>
    </>
  );
}

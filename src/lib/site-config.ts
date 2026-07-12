export const siteConfig = {
  name: "آیریک",
  description:
    "فروشگاه تخصصی لپ‌تاپ، کامپیوتر، کنسول بازی و لوازم جانبی در بازار بزرگ کامپیوتر اصفهان — با ضمانت اصالت کالا و مشاوره فنی.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://irik.ir",
  phoneDisplay: "۰۳۱ - ۳۲۲۰۰۰۰۰",
  phoneHref: "tel:03132200000",
  email: "info@irik.ir",
  address: "اصفهان، خیابان طالقانی، بازار بزرگ کامپیوتر",
  hours: "شنبه تا پنجشنبه، ۹ الی ۲۰",
} as const;

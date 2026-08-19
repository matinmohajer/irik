export const siteConfig = {
  name: "آیریک",
  description:
    "فروشگاه تخصصی لپ‌تاپ، کامپیوتر، کنسول بازی و لوازم جانبی در بازار بزرگ کامپیوتر اصفهان — با بیش از ۵ سال سابقه، ضمانت اصالت کالا و مشاوره فنی.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://irick.ir",
  phoneDisplay: "۰۹۱۳ ۵۰۰ ۲۱۶۵",
  phoneHref: "tel:09135002165",
  email: "info@irick.ir",
  address: "اصفهان، خ طالقانی، بازار بزرگ طالقانی، پلاک ۲۰۱",
  hours: "شنبه تا پنجشنبه، ۹ الی ۲۰",
} as const;

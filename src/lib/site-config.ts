export const siteConfig = {
  name: "آیریک",
  description:
    "کاتالوگ لپ‌تاپ، کامپیوتر، کنسول بازی و لوازم جانبی آیریک در بازار بزرگ کامپیوتر اصفهان — با بیش از ۵ سال سابقه، ضمانت اصالت کالا و مشاوره فنی. سفارش و استعلام قیمت از طریق واتس‌اپ.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://irick.ir",
  phoneDisplay: "۰۹۱۳ ۵۰۰ ۲۱۶۵",
  phoneHref: "tel:09135002165",
  /** international format, digits only — what wa.me expects */
  whatsappNumber: "989135002165",
  email: "info@irick.ir",
  address: "اصفهان، خ طالقانی، بازار بزرگ طالقانی، پلاک ۲۰۱",
  hours: "شنبه تا پنجشنبه، ۹ الی ۲۰",
} as const;

/** Click-to-chat link for the store's WhatsApp, optionally with a prefilled message. */
export function whatsappHref(message?: string): string {
  const base = `https://wa.me/${siteConfig.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

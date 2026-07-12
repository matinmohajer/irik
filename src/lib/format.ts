import { toJalaali } from "jalaali-js";

const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

const JALALI_MONTHS = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

/** "1234" -> "۱۲۳۴" */
export function toPersianDigits(value: string | number): string {
  return String(value).replace(/[0-9]/g, (d) => PERSIAN_DIGITS[Number(d)]);
}

/** "۱۲۳۴" -> "1234" */
export function toLatinDigits(value: string): string {
  return value.replace(/[۰-۹]/g, (d) => String(PERSIAN_DIGITS.indexOf(d)));
}

/** 89500000 -> "۸۹,۵۰۰,۰۰۰ تومان" */
export function formatToman(amount: number): string {
  const withCommas = Math.round(amount).toLocaleString("en-US");
  return `${toPersianDigits(withCommas)} تومان`;
}

/** 12 -> "٪۱۲" (used for discount badges) */
export function formatPercent(value: number): string {
  return `٪${toPersianDigits(Math.round(value))}`;
}

/** ISO date string -> "۱۵ تیر ۱۴۰۵" (Jalali / Solar Hijri calendar) */
export function formatJalaliDate(iso: string): string {
  const date = new Date(iso);
  const { jy, jm, jd } = toJalaali(date);
  return `${toPersianDigits(jd)} ${JALALI_MONTHS[jm - 1]} ${toPersianDigits(jy)}`;
}

/** "+989121234567" -> "۰۹۱۲ ۱۲۳ ۴۵۶۷" — the format Iranians actually write phone numbers in */
export function formatIranianPhone(e164: string): string {
  const digits = e164.replace(/^\+98/, "0");
  const grouped = digits.length === 11 ? `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}` : digits;
  return toPersianDigits(grouped);
}

/** rounds a discount to a whole percent given regular vs sale price */
export function discountPercent(regular: number, sale: number): number {
  if (regular <= sale) return 0;
  return Math.round(((regular - sale) / regular) * 100);
}

import Link from "next/link";

/** Brand mark: the Irick Pardazesh roofline + pixel-grid glyph, paired with the irick.ir wordmark. */
export function Logo() {
  return (
    <Link href="/" className="logo" aria-label="آیریک — صفحه اصلی">
      <svg viewBox="0 0 46 40" className="logo-mark" aria-hidden="true">
        <polygon points="4,34 18,6 22,6 8,34" fill="var(--accent)" />
        <polygon points="14,34 28,8 34,8 20,34" fill="var(--ink-soft)" />
        <rect x="27" y="19" width="7" height="7" fill="var(--accent)" />
        <rect x="35" y="19" width="4.5" height="4.5" fill="var(--ink-soft)" />
        <rect x="27" y="29" width="4.5" height="4.5" fill="var(--ink-soft)" />
        <rect x="33.5" y="27" width="6" height="6" fill="var(--accent)" />
        <rect x="40" y="30" width="3" height="3" fill="var(--ink-soft)" />
      </svg>
      <span className="logo-text" dir="ltr">
        irick<b>.ir</b>
      </span>
    </Link>
  );
}

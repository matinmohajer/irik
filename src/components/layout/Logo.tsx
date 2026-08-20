import Link from "next/link";

/** Brand mark: Irick Pardazesh Novin's two-tone bracket-arrow glyph with its pixel cluster, paired with the IPN wordmark. */
export function Logo() {
  return (
    <Link href="/" className="logo" aria-label="آیریک — صفحه اصلی">
      <svg viewBox="0 0 40 40" className="logo-mark" aria-hidden="true">
        <path d="M27,7 L12,20 L27,33" fill="none" stroke="var(--ink)" strokeWidth="6" strokeLinecap="square" />
        <path d="M31,12 L20,20 L31,28" fill="none" stroke="var(--accent)" strokeWidth="5" strokeLinecap="square" />
        <rect x="21" y="2" width="4.5" height="4.5" fill="var(--ink)" transform="rotate(45 23.25 4.25)" />
        <rect x="27" y="2" width="4.5" height="4.5" fill="var(--ink)" transform="rotate(45 29.25 4.25)" />
        <rect x="24" y="7.5" width="4.5" height="4.5" fill="var(--accent)" transform="rotate(45 26.25 9.75)" />
      </svg>
      <span className="logo-text" dir="ltr" style={{ color: "var(--accent-deep)" }}>
        IPN
      </span>
    </Link>
  );
}

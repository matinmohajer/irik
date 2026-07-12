import Link from "next/link";

/** Brand mark: an abstract IC-chip glyph — pins on all four sides — paired with the آیریک wordmark. */
export function Logo() {
  return (
    <Link href="/" className="logo" aria-label="آیریک — صفحه اصلی">
      <svg viewBox="0 0 40 40" className="logo-mark" aria-hidden="true">
        <rect x="3" y="3" width="34" height="34" rx="8" fill="none" stroke="var(--accent)" strokeWidth="2" />
        <rect x="14.5" y="14.5" width="11" height="11" rx="2" fill="none" stroke="var(--ink)" strokeWidth="2" />
        <g stroke="var(--accent)" strokeWidth="2" strokeLinecap="round">
          <line x1="14.5" y1="18" x2="9" y2="18" />
          <line x1="25.5" y1="18" x2="31" y2="18" />
          <line x1="14.5" y1="23" x2="9" y2="23" />
          <line x1="25.5" y1="23" x2="31" y2="23" />
          <line x1="18" y1="14.5" x2="18" y2="9" />
          <line x1="23" y1="14.5" x2="23" y2="9" />
          <line x1="18" y1="25.5" x2="18" y2="31" />
          <line x1="23" y1="25.5" x2="23" y2="31" />
        </g>
      </svg>
      <span className="logo-text">
        آیریک<b>.</b>
      </span>
    </Link>
  );
}

import Link from "next/link";
import { Icon } from "@/components/icons/Icon";
import { toPersianDigits } from "@/lib/format";

function pageNumbers(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = new Set([1, 2, total - 1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

  const result: (number | "…")[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - (sorted[i - 1] as number) > 1) result.push("…");
    result.push(p);
  });
  return result;
}

export function Pagination({
  page,
  totalPages,
  buildHref,
}: {
  page: number;
  totalPages: number;
  buildHref: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  return (
    <nav className="pagination" aria-label="صفحه‌بندی">
      {page > 1 ? (
        <Link href={buildHref(page - 1)} aria-label="صفحه قبل">
          <Icon name="chev-end" className="icon" />
        </Link>
      ) : (
        <span aria-disabled="true">
          <Icon name="chev-end" className="icon" />
        </span>
      )}

      {pageNumbers(page, totalPages).map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`}>…</span>
        ) : (
          <Link key={p} href={buildHref(p)} className={p === page ? "is-active" : undefined} aria-current={p === page ? "page" : undefined}>
            {toPersianDigits(p)}
          </Link>
        )
      )}

      {page < totalPages ? (
        <Link href={buildHref(page + 1)} aria-label="صفحه بعد">
          <Icon name="chev-start" className="icon" />
        </Link>
      ) : (
        <span aria-disabled="true">
          <Icon name="chev-start" className="icon" />
        </span>
      )}
    </nav>
  );
}

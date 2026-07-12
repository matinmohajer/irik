"use client";

import { useRouter } from "next/navigation";
import { Icon } from "@/components/icons/Icon";

export function SortSelect({
  current,
  options,
}: {
  current: string;
  /** hrefs are precomputed server-side — functions can't cross the server/client boundary */
  options: { value: string; label: string; href: string }[];
}) {
  const router = useRouter();

  return (
    <div className="select">
      <select
        value={current}
        onChange={(e) => {
          const next = options.find((o) => o.value === e.target.value);
          if (next) router.push(next.href);
        }}
        aria-label="مرتب‌سازی محصولات"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <Icon name="chev-down" />
    </div>
  );
}

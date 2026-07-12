import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ProductCard } from "@/components/product/ProductCard";
import { Pagination } from "@/components/ui/Pagination";
import { getProducts } from "@/lib/data";
import { toPersianDigits } from "@/lib/format";

export const metadata: Metadata = {
  title: "جستجوی محصولات",
};

interface PageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q = "", page: pageParam } = await searchParams;
  const page = pageParam ? Math.max(1, Number(pageParam)) : 1;

  const result = q ? await getProducts({ search: q, page }) : { products: [], total: 0, totalPages: 1, page: 1 };

  return (
    <>
      <Breadcrumb items={[{ label: "آیریک", href: "/" }, { label: "جستجو" }]} />

      <div className="container">
        <div className="listing-head">
          <h1>{q ? `نتایج جستجو برای «${q}»` : "جستجوی محصولات"}</h1>
          {q && (
            <p>
              <b className="mono">{toPersianDigits(result.total)}</b> محصول یافت شد
            </p>
          )}
        </div>

        {q && result.products.length === 0 ? (
          <div className="empty-state">
            <h2>محصولی یافت نشد</h2>
            <p>عبارت دیگری را جستجو کنید یا از دسته‌بندی‌های فروشگاه دیدن کنید.</p>
          </div>
        ) : (
          <div className="product-grid" style={{ paddingBottom: 56 }}>
            {result.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <Pagination page={result.page} totalPages={result.totalPages} buildHref={(p) => `/search?q=${encodeURIComponent(q)}&page=${p}`} />
      </div>
    </>
  );
}

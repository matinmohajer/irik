import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Icon } from "@/components/icons/Icon";
import { ProductCard } from "@/components/product/ProductCard";
import { SortSelect } from "@/components/product/SortSelect";
import { Pagination } from "@/components/ui/Pagination";
import { getParentCategory } from "@/lib/category-tree";
import { getCategories, getProducts } from "@/lib/data";
import { formatToman, toPersianDigits } from "@/lib/format";
import type { ProductFilters } from "@/lib/types";

const SORT_OPTIONS: { value: NonNullable<ProductFilters["sort"]>; label: string }[] = [
  { value: "best-selling", label: "مرتب‌سازی: پرفروش‌ترین" },
  { value: "price-asc", label: "مرتب‌سازی: ارزان‌ترین" },
  { value: "price-desc", label: "مرتب‌سازی: گران‌ترین" },
  { value: "newest", label: "مرتب‌سازی: جدیدترین" },
];

const PRICE_BUCKETS: { label: string; min?: number; max?: number }[] = [
  { label: "زیر ۴۰ میلیون", max: 40_000_000 },
  { label: "۴۰ تا ۷۰ میلیون", min: 40_000_000, max: 70_000_000 },
  { label: "بالای ۷۰ میلیون", min: 70_000_000 },
];

interface PageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{
    brand?: string | string[];
    min?: string;
    max?: string;
    sort?: string;
    page?: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === categorySlug);
  if (!category) return {};
  return {
    title: category.name,
    description: `خرید ${category.name} با ضمانت اصالت کالا و مشاوره تخصصی از فروشگاه آیریک در اصفهان.`,
  };
}

export default async function ProductListingPage({ params, searchParams }: PageProps) {
  const { category: categorySlug } = await params;
  const sp = await searchParams;

  const categories = await getCategories();
  const category = categories.find((c) => c.slug === categorySlug);
  if (!category) notFound();

  const activeBrands = sp.brand ? (Array.isArray(sp.brand) ? sp.brand : [sp.brand]) : [];
  const min = sp.min ? Number(sp.min) : undefined;
  const max = sp.max ? Number(sp.max) : undefined;
  const sort = (SORT_OPTIONS.find((o) => o.value === sp.sort)?.value ?? "best-selling") as ProductFilters["sort"];
  const page = sp.page ? Math.max(1, Number(sp.page)) : 1;

  const [allInCategory, result] = await Promise.all([
    getProducts({ category: categorySlug }),
    getProducts({ category: categorySlug, brands: activeBrands, minPrice: min, maxPrice: max, sort, page }),
  ]);

  const availableBrands = [...new Set(allInCategory.products.map((p) => p.brand).filter(Boolean))].sort();

  function buildHref(overrides: {
    brands?: string[];
    min?: number;
    clearMin?: boolean;
    max?: number;
    clearMax?: boolean;
    sort?: string;
    page?: number;
  }): string {
    const q = new URLSearchParams();
    const brands = overrides.brands ?? activeBrands;
    brands.forEach((b) => q.append("brand", b));

    const nextMin = overrides.clearMin ? undefined : (overrides.min ?? min);
    const nextMax = overrides.clearMax ? undefined : (overrides.max ?? max);
    if (nextMin !== undefined) q.set("min", String(nextMin));
    if (nextMax !== undefined) q.set("max", String(nextMax));

    const nextSort = overrides.sort ?? sort;
    if (nextSort && nextSort !== "best-selling") q.set("sort", nextSort);

    const nextPage = overrides.page ?? 1;
    if (nextPage > 1) q.set("page", String(nextPage));

    const qs = q.toString();
    return `/products/${categorySlug}${qs ? `?${qs}` : ""}`;
  }

  const isBucketActive = (bucket: (typeof PRICE_BUCKETS)[number]) => bucket.min === min && bucket.max === max;
  const parentCategory = getParentCategory(categories, category);
  const subcategories = categories.filter((c) => c.parentSlug === category.slug);

  return (
    <>
      <Breadcrumb
        items={[
          { label: "آیریک", href: "/" },
          { label: "محصولات" },
          ...(parentCategory ? [{ label: parentCategory.name, href: `/products/${parentCategory.slug}` }] : []),
          { label: category.name },
        ]}
      />

      <div className="container">
        <div className="listing-head">
          <h1>{category.name}</h1>
          <p>محصولات {category.name} با ضمانت اصالت کالا، مستقیم از بازار بزرگ کامپیوتر اصفهان.</p>
          {subcategories.length > 0 && (
            <nav className="pill-tabs" aria-label={`زیردسته‌های ${category.name}`} style={{ marginTop: 18 }}>
              {subcategories.map((sub) => (
                <Link key={sub.slug} href={`/products/${sub.slug}`}>
                  {sub.name}
                </Link>
              ))}
            </nav>
          )}
        </div>

        <div className="listing-layout">
          <aside className="filters">
            {availableBrands.length > 0 && (
              <div className="filter-group">
                <h6>برند</h6>
                {availableBrands.map((brand) => {
                  const checked = activeBrands.includes(brand);
                  const nextBrands = checked ? activeBrands.filter((b) => b !== brand) : [...activeBrands, brand];
                  const count = allInCategory.products.filter((p) => p.brand === brand).length;
                  return (
                    <a key={brand} href={buildHref({ brands: nextBrands, page: 1 })} className="check-row">
                      <span style={{ display: "flex", alignItems: "center", gap: 9 }}>
                        <span className={`checkbox${checked ? " checked" : ""}`}>{checked && <Icon name="check" />}</span>
                        {brand}
                      </span>
                      <span className="n">{toPersianDigits(count)}</span>
                    </a>
                  );
                })}
              </div>
            )}

            <div className="filter-group">
              <h6>محدوده قیمت</h6>
              <div className="price-chips">
                {PRICE_BUCKETS.map((bucket) => {
                  const active = isBucketActive(bucket);
                  const href = active
                    ? buildHref({ clearMin: true, clearMax: true, page: 1 })
                    : buildHref({ min: bucket.min, clearMin: bucket.min === undefined, max: bucket.max, clearMax: bucket.max === undefined, page: 1 });
                  return (
                    <a key={bucket.label} href={href} className={active ? "is-active" : undefined}>
                      {bucket.label}
                    </a>
                  );
                })}
              </div>
            </div>
          </aside>

          <div>
            <div className="toolbar">
              <div className="toolbar-left">
                <span className="result-count">
                  <b>{toPersianDigits(result.total)}</b> محصول یافت شد
                </span>
                {activeBrands.map((brand) => (
                  <span key={brand} className="active-chip">
                    {brand}
                    <a href={buildHref({ brands: activeBrands.filter((b) => b !== brand), page: 1 })} aria-label={`حذف فیلتر ${brand}`}>
                      <Icon name="x" />
                    </a>
                  </span>
                ))}
                {(min !== undefined || max !== undefined) && (
                  <span className="active-chip">
                    {min !== undefined && max !== undefined
                      ? `${formatToman(min)} تا ${formatToman(max)}`
                      : min !== undefined
                        ? `بیشتر از ${formatToman(min)}`
                        : `کمتر از ${formatToman(max!)}`}
                    <a href={buildHref({ clearMin: true, clearMax: true, page: 1 })} aria-label="حذف فیلتر قیمت">
                      <Icon name="x" />
                    </a>
                  </span>
                )}
              </div>
              <div className="toolbar-right">
                <SortSelect
                  current={sort ?? "best-selling"}
                  options={SORT_OPTIONS.map((o) => ({ ...o, href: buildHref({ sort: o.value, page: 1 }) }))}
                />
              </div>
            </div>

            {result.products.length > 0 ? (
              <div className="product-grid cols-3">
                {result.products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <h2>محصولی یافت نشد</h2>
                <p>فیلترهای انتخابی را تغییر دهید یا آن‌ها را پاک کنید.</p>
              </div>
            )}

            <Pagination page={result.page} totalPages={result.totalPages} buildHref={(p) => buildHref({ page: p })} />
          </div>
        </div>
      </div>
    </>
  );
}

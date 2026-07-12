import { wooFetch, wooFetchList } from "@/lib/woocommerce/client";
import { mapWooCategory, mapWooProduct } from "@/lib/woocommerce/map";
import type { Product, ProductCategory, ProductFilters, ProductListResult } from "@/lib/types";
import type { WooCategory, WooProduct } from "@/lib/woocommerce/types";

const PER_PAGE = 12;

const ORDERBY: Record<NonNullable<ProductFilters["sort"]>, { orderby: string; order: "asc" | "desc" }> = {
  "best-selling": { orderby: "popularity", order: "desc" },
  "price-asc": { orderby: "price", order: "asc" },
  "price-desc": { orderby: "price", order: "desc" },
  newest: { orderby: "date", order: "desc" },
};

/**
 * All store categories, raw (not mapped) — used to resolve slugs to IDs and to
 * walk parent/child relationships. `hide_empty: false` matters here: a parent
 * category with no *directly* assigned products would otherwise disappear,
 * breaking both the mega menu and descendant-lookup below.
 */
async function getRawCategories(): Promise<WooCategory[]> {
  return wooFetch<WooCategory[]>("/products/categories", { per_page: 100, hide_empty: "false" });
}

/**
 * WooCommerce's `/products?category=` filter takes numeric category IDs, not
 * slugs, and matches a category exactly — it does not automatically include
 * subcategories. We resolve the requested slug plus every descendant slug's
 * ID and pass them all (comma-separated = logical OR), so browsing a parent
 * category rolls up its subcategories' products too.
 */
async function resolveCategoryIds(slug: string): Promise<string | undefined> {
  const raw = await getRawCategories();
  const target = raw.find((c) => c.slug === slug);
  if (!target) return undefined;

  const ids = [target.id];
  const collectDescendants = (parentId: number) => {
    for (const c of raw) {
      if (c.parent === parentId) {
        ids.push(c.id);
        collectDescendants(c.id);
      }
    }
  };
  collectDescendants(target.id);

  return ids.join(",");
}

export async function getProducts(filters: ProductFilters = {}): Promise<ProductListResult> {
  const { orderby, order } = ORDERBY[filters.sort ?? "best-selling"];
  const categoryId = filters.category ? await resolveCategoryIds(filters.category) : undefined;

  const { items, total, totalPages } = await wooFetchList<WooProduct>("/products", {
    category: categoryId,
    search: filters.search,
    min_price: filters.minPrice,
    max_price: filters.maxPrice,
    orderby,
    order,
    page: filters.page ?? 1,
    per_page: PER_PAGE,
  });

  let products = items.map(mapWooProduct);
  if (filters.brands?.length) {
    const wanted = new Set(filters.brands.map((b) => b.toUpperCase()));
    products = products.filter((p) => wanted.has(p.brand));
  }

  return { products, total, totalPages, page: filters.page ?? 1 };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { items } = await wooFetchList<WooProduct>("/products", { slug });
  const raw = items[0];
  return raw ? mapWooProduct(raw) : null;
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const { products } = await getProducts({ category: product.categorySlug, page: 1 });
  return products.filter((p) => p.id !== product.id).slice(0, limit);
}

export async function getCategories(): Promise<ProductCategory[]> {
  const raw = await getRawCategories();
  const idToSlug = new Map(raw.map((c) => [c.id, c.slug]));
  return raw.map((c) => mapWooCategory(c, c.parent ? idToSlug.get(c.parent) : undefined));
}

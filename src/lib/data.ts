import { buildCategoryTree, getDescendantSlugs } from "@/lib/category-tree";
import { CATEGORIES, POSTS, PRODUCTS } from "@/lib/mock-data";
import { isWooCommerceConfigured } from "@/lib/woocommerce/client";
import { isWordPressConfigured } from "@/lib/wordpress/client";
import type {
  CategoryNode,
  Post,
  PostListResult,
  PostSummary,
  Product,
  ProductCategory,
  ProductFilters,
  ProductListResult,
} from "@/lib/types";

const PRODUCTS_PER_PAGE = 12;
const POSTS_PER_PAGE = 6;

/**
 * Single data-access facade the pages import from. Each function checks
 * whether its backend is configured (env vars set) and, if not, serves the
 * bundled mock content — so the storefront runs today and swaps to live
 * WordPress/WooCommerce data the moment the backend is wired up, with no
 * page-level changes required.
 */

export async function getCategories(): Promise<ProductCategory[]> {
  if (isWooCommerceConfigured()) {
    const { getCategories: getWooCategories } = await import("@/lib/woocommerce/products");
    return getWooCategories();
  }
  return CATEGORIES;
}

/** Full category list nested into a tree — used by the mega menu and mobile nav. */
export async function getCategoryTree(): Promise<CategoryNode[]> {
  const categories = await getCategories();
  return buildCategoryTree(categories);
}

function sortMockProducts(products: Product[], sort: ProductFilters["sort"]): Product[] {
  const sorted = [...products];
  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "newest":
      return sorted.sort((a, b) => Number(b.isNew) - Number(a.isNew));
    case "best-selling":
    default:
      return sorted.sort((a, b) => Number(b.isBestSeller) - Number(a.isBestSeller));
  }
}

function getMockProducts(filters: ProductFilters): ProductListResult {
  let products = PRODUCTS;
  if (filters.category) {
    // browsing a parent category rolls up every descendant subcategory's products too
    const matchSlugs = new Set(getDescendantSlugs(CATEGORIES, filters.category));
    products = products.filter((p) => matchSlugs.has(p.categorySlug));
  }
  if (filters.search) {
    const q = filters.search.trim().toLowerCase();
    products = products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
    );
  }
  if (filters.brands?.length) {
    const wanted = new Set(filters.brands.map((b) => b.toUpperCase()));
    products = products.filter((p) => wanted.has(p.brand));
  }
  if (filters.minPrice !== undefined) products = products.filter((p) => p.price >= filters.minPrice!);
  if (filters.maxPrice !== undefined) products = products.filter((p) => p.price <= filters.maxPrice!);

  products = sortMockProducts(products, filters.sort);

  const page = filters.page ?? 1;
  const start = (page - 1) * PRODUCTS_PER_PAGE;
  const pageItems = products.slice(start, start + PRODUCTS_PER_PAGE);

  return {
    products: pageItems,
    total: products.length,
    totalPages: Math.max(1, Math.ceil(products.length / PRODUCTS_PER_PAGE)),
    page,
  };
}

export async function getProducts(filters: ProductFilters = {}): Promise<ProductListResult> {
  if (isWooCommerceConfigured()) {
    const { getProducts: getWooProducts } = await import("@/lib/woocommerce/products");
    return getWooProducts(filters);
  }
  return getMockProducts(filters);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (isWooCommerceConfigured()) {
    const { getProductBySlug: getWooProductBySlug } = await import("@/lib/woocommerce/products");
    return getWooProductBySlug(slug);
  }
  return PRODUCTS.find((p) => p.slug === slug) ?? null;
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  if (isWooCommerceConfigured()) {
    const { getRelatedProducts: getWooRelated } = await import("@/lib/woocommerce/products");
    return getWooRelated(product, limit);
  }
  return PRODUCTS.filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id).slice(0, limit);
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  const { products } = await getProducts({ sort: "best-selling", page: 1 });
  return products.slice(0, limit);
}

export async function getPosts(page = 1, categorySlug?: string): Promise<PostListResult> {
  if (isWordPressConfigured()) {
    const { getPosts: getWpPosts } = await import("@/lib/wordpress/posts");
    return getWpPosts(page, categorySlug);
  }
  const all = categorySlug ? POSTS.filter((p) => p.categorySlug === categorySlug) : POSTS;
  const start = (page - 1) * POSTS_PER_PAGE;
  const pageItems = all.slice(start, start + POSTS_PER_PAGE);
  return {
    posts: pageItems,
    total: all.length,
    totalPages: Math.max(1, Math.ceil(all.length / POSTS_PER_PAGE)),
    page,
  };
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (isWordPressConfigured()) {
    const { getPostBySlug: getWpPostBySlug } = await import("@/lib/wordpress/posts");
    return getWpPostBySlug(slug);
  }
  return POSTS.find((p) => p.slug === slug) ?? null;
}

export async function getLatestPosts(limit = 3): Promise<PostSummary[]> {
  const { posts } = await getPosts(1);
  return posts.slice(0, limit);
}

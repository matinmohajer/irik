import type { IconName } from "@/components/icons/Icon";

export interface ProductCategory {
  id: string;
  slug: string;
  name: string;
  description?: string;
  icon: IconName;
  /** slug of the parent category, if this is a subcategory (mirrors WooCommerce's category hierarchy) */
  parentSlug?: string;
}

export interface CategoryNode extends ProductCategory {
  children: ProductCategory[];
}

export interface ProductVariantGroup {
  label: string;
  options: string[];
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  /** Latin brand token, e.g. "LENOVO" — shown as a mono tag under the title */
  brand: string;
  categorySlug: string;
  price: number;
  regularPrice?: number;
  inStock: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  rating?: number;
  reviewCount?: number;
  /** short Latin spec chips shown on cards, e.g. ["i7-13650HX", "RTX 4060", "16GB"] */
  specChips: string[];
  images: string[];
  icon: IconName;
  shortDescription?: string;
  descriptionHtml?: string;
  specs?: ProductSpec[];
  variants?: ProductVariantGroup[];
  sku?: string;
}

export interface ProductListResult {
  products: Product[];
  total: number;
  totalPages: number;
  page: number;
}

export interface PostSummary {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  categoryLabel: string;
  categorySlug: string;
  dateIso: string;
  readMinutes: number;
  image?: string;
  icon: IconName;
}

export interface Post extends PostSummary {
  contentHtml: string;
}

export interface PostListResult {
  posts: PostSummary[];
  total: number;
  totalPages: number;
  page: number;
}

export interface ProductFilters {
  category?: string;
  search?: string;
  brands?: string[];
  minPrice?: number;
  maxPrice?: number;
  sort?: "best-selling" | "price-asc" | "price-desc" | "newest";
  page?: number;
}

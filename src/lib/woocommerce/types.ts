/** Shapes returned by the WooCommerce REST API (subset of fields we use). */

export interface WooImage {
  id: number;
  src: string;
  alt: string;
}

export interface WooCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  count?: number;
  /** parent category ID, or 0 for a top-level category */
  parent?: number;
}

export interface WooAttribute {
  id: number;
  name: string;
  options: string[];
}

export interface WooProduct {
  id: number;
  name: string;
  slug: string;
  sku: string;
  permalink: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  stock_status: "instock" | "outofstock" | "onbackorder";
  average_rating: string;
  rating_count: number;
  description: string;
  short_description: string;
  date_created: string;
  images: WooImage[];
  categories: WooCategory[];
  /** native WooCommerce "Product Brands" taxonomy (WooCommerce 8.9+); same shape as categories */
  brands?: { id: number; name: string; slug: string }[];
  attributes: WooAttribute[];
}

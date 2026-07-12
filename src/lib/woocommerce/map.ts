import type { IconName } from "@/components/icons/Icon";
import type { Product, ProductCategory, ProductSpec } from "@/lib/types";
import type { WooCategory, WooProduct } from "@/lib/woocommerce/types";

/**
 * WooCommerce has no built-in concept of a display icon or a "brand" field.
 * Category icons are matched by slug against this table (extend it as you
 * add categories in wp-admin); anything unmatched falls back to a generic
 * chip icon so the UI never breaks on an unrecognised category.
 */
const CATEGORY_ICONS: Record<string, IconName> = {
  laptop: "laptop",
  desktop: "desktop",
  computer: "desktop",
  console: "gamepad",
  monitor: "monitor",
  parts: "cpu",
  storage: "drive",
  accessories: "headset",
  network: "wifi",
};

/** Falls back to a keyword match (e.g. "laptop-gaming" -> laptop) when a slug has no exact entry above. */
function iconForCategorySlug(slug: string): IconName {
  if (CATEGORY_ICONS[slug]) return CATEGORY_ICONS[slug];
  const match = Object.keys(CATEGORY_ICONS).find((key) => slug.startsWith(key));
  return match ? CATEGORY_ICONS[match] : "cpu";
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

/**
 * Reads the brand name from WooCommerce's native "Product Brands" taxonomy
 * (`product.brands`, WooCommerce 8.9+) if the store uses it, falling back to
 * a `pa_brand` (or `برند`) product attribute for older stores that model
 * brand the pre-8.9 community-convention way.
 */
function extractBrand(product: WooProduct): string {
  if (product.brands?.[0]?.name) return product.brands[0].name.toUpperCase();

  const brandAttr = product.attributes?.find(
    (a) => a.name.toLowerCase() === "brand" || a.name.toLowerCase() === "pa_brand" || a.name === "برند"
  );
  return brandAttr?.options?.[0]?.toUpperCase() ?? "";
}

/** Non-brand attributes become the short spec chips shown on product cards. */
function extractSpecChips(product: WooProduct): string[] {
  return product.attributes
    .filter((a) => a.name.toLowerCase() !== "brand" && a.name.toLowerCase() !== "pa_brand" && a.name !== "برند")
    .flatMap((a) => a.options.slice(0, 1))
    .slice(0, 3);
}

function extractSpecs(product: WooProduct): ProductSpec[] {
  return product.attributes.map((a) => ({ label: a.name, value: a.options.join(", ") }));
}

export function mapWooProduct(product: WooProduct): Product {
  return {
    id: String(product.id),
    slug: product.slug,
    name: product.name,
    brand: extractBrand(product),
    categorySlug: product.categories[0]?.slug ?? "",
    price: Number(product.price || product.regular_price || 0),
    regularPrice: product.on_sale ? Number(product.regular_price) : undefined,
    inStock: product.stock_status === "instock",
    rating: Number(product.average_rating) || undefined,
    reviewCount: product.rating_count || undefined,
    specChips: extractSpecChips(product),
    images: product.images.map((img) => img.src),
    icon: iconForCategorySlug(product.categories[0]?.slug ?? ""),
    shortDescription: stripHtml(product.short_description),
    descriptionHtml: product.description,
    specs: extractSpecs(product),
    sku: product.sku || undefined,
  };
}

export function mapWooCategory(category: WooCategory, parentSlug?: string): ProductCategory {
  return {
    id: String(category.id),
    slug: category.slug,
    name: category.name,
    description: category.description ? stripHtml(category.description) : undefined,
    icon: iconForCategorySlug(category.slug),
    parentSlug,
  };
}

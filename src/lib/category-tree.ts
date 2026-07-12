import type { CategoryNode, ProductCategory } from "@/lib/types";

/** Nests a flat parent/child category list (as WooCommerce returns it) into a tree, top-level only at the root. */
export function buildCategoryTree(categories: ProductCategory[]): CategoryNode[] {
  return categories
    .filter((c) => !c.parentSlug)
    .map((parent) => ({
      ...parent,
      children: categories.filter((c) => c.parentSlug === parent.slug),
    }));
}

/** Given a category slug, returns itself plus every descendant slug (depth-first, any depth). */
export function getDescendantSlugs(categories: ProductCategory[], slug: string): string[] {
  const children = categories.filter((c) => c.parentSlug === slug).map((c) => c.slug);
  return [slug, ...children.flatMap((childSlug) => getDescendantSlugs(categories, childSlug))];
}

/** Finds a category's parent, if any. */
export function getParentCategory(categories: ProductCategory[], category: ProductCategory): ProductCategory | undefined {
  if (!category.parentSlug) return undefined;
  return categories.find((c) => c.slug === category.parentSlug);
}

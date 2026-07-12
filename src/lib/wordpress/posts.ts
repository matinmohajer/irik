import type { IconName } from "@/components/icons/Icon";
import type { Post, PostListResult, PostSummary } from "@/lib/types";
import { getWpCategoryId, getWpRestPostCount, wpGraphQL } from "@/lib/wordpress/client";

const PER_PAGE = 6;

interface WpPostNode {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  featuredImage?: { node?: { sourceUrl: string } };
  categories?: { nodes: { name: string; slug: string }[] };
}

interface PostsQueryResult {
  posts: { nodes: WpPostNode[] };
}

interface PostQueryResult {
  postBy: WpPostNode | null;
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&hellip;/g, "…")
    .trim();
}

function readMinutes(html: string): number {
  const words = stripHtml(html).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/**
 * WP categories have no concept of a UI icon; matched by slug against this
 * table with a sensible fallback so unknown categories still render.
 */
const CATEGORY_ICONS: Record<string, IconName> = {
  "buying-guide": "laptop",
  comparison: "gamepad",
  tutorial: "drive",
  news: "chip-brand",
};

function toSummary(node: WpPostNode): PostSummary {
  const category = node.categories?.nodes[0];
  return {
    id: node.id,
    slug: node.slug,
    title: stripHtml(node.title),
    excerpt: stripHtml(node.excerpt),
    categoryLabel: category?.name ?? "مقاله",
    categorySlug: category?.slug ?? "",
    dateIso: node.date,
    readMinutes: readMinutes(node.content),
    image: node.featuredImage?.node?.sourceUrl,
    icon: CATEGORY_ICONS[category?.slug ?? ""] ?? "laptop",
  };
}

const POST_FIELDS = `
  id
  slug
  title
  excerpt
  content
  date
  featuredImage { node { sourceUrl } }
  categories { nodes { name slug } }
`;

/**
 * WPGraphQL's post connection is cursor-only — there's no "jump to page N"
 * without walking cursors sequentially. Since a company blog is at most a
 * few dozen pages deep, we instead fetch everything up through the target
 * page in one request (`first: page * PER_PAGE`) and slice off the last
 * page's worth — simpler than cursor-walking and avoids a pagination plugin
 * dependency. The total count (for page-number UI) comes from the WP core
 * REST API's `X-WP-Total` header, requested in parallel.
 */
export async function getPosts(page = 1, categorySlug?: string): Promise<PostListResult> {
  const [data, categoryId] = await Promise.all([
    wpGraphQL<PostsQueryResult>(
      `query Posts($first: Int!, $category: String) {
        posts(first: $first, where: { status: PUBLISH, categoryName: $category }) {
          nodes { ${POST_FIELDS} }
        }
      }`,
      { first: page * PER_PAGE, category: categorySlug }
    ),
    categorySlug ? getWpCategoryId(categorySlug) : Promise.resolve(undefined),
  ]);

  const total = await getWpRestPostCount(categoryId);
  const pageItems = data.posts.nodes.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return {
    posts: pageItems.map(toSummary),
    total,
    totalPages: Math.max(1, Math.ceil(total / PER_PAGE)),
    page,
  };
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const data = await wpGraphQL<PostQueryResult>(
    `query PostBySlug($slug: String!) {
      postBy(slug: $slug) { ${POST_FIELDS} }
    }`,
    { slug }
  );

  if (!data.postBy) return null;
  return { ...toSummary(data.postBy), contentHtml: data.postBy.content };
}

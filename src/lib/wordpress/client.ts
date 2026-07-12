/**
 * Minimal typed client for WPGraphQL (https://www.wpgraphql.com/).
 * Requires the WPGraphQL plugin active on the WordPress backend.
 */

const WORDPRESS_GRAPHQL_URL = process.env.WORDPRESS_GRAPHQL_URL;

export function isWordPressConfigured(): boolean {
  return Boolean(WORDPRESS_GRAPHQL_URL);
}

/** Site root, derived from the GraphQL endpoint (`<site>/graphql` by WPGraphQL convention). */
function getWordPressBaseUrl(): string {
  return WORDPRESS_GRAPHQL_URL!.replace(/\/graphql\/?$/, "");
}

const DEFAULT_REVALIDATE_SECONDS = 300;

interface GraphQLResponse<T> {
  data?: T;
  errors?: { message: string }[];
}

export async function wpGraphQL<T>(
  query: string,
  variables: Record<string, unknown> = {},
  revalidateSeconds: number = DEFAULT_REVALIDATE_SECONDS
): Promise<T> {
  if (!isWordPressConfigured()) {
    throw new Error("WordPress is not configured — set WORDPRESS_GRAPHQL_URL in .env.local");
  }

  const res = await fetch(WORDPRESS_GRAPHQL_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: revalidateSeconds },
  });

  if (!res.ok) {
    throw new Error(`WPGraphQL error ${res.status}: ${await res.text()}`);
  }

  const json = (await res.json()) as GraphQLResponse<T>;
  if (json.errors?.length) {
    throw new Error(`WPGraphQL error: ${json.errors.map((e) => e.message).join("; ")}`);
  }
  if (!json.data) {
    throw new Error("WPGraphQL returned no data");
  }
  return json.data;
}

/**
 * WPGraphQL's post connection is cursor-paginated only (no total count) unless
 * a site-specific offset-pagination plugin is installed, which we don't want
 * to depend on. WordPress's built-in core REST API always ships `X-WP-Total`
 * on list endpoints, so we use that just for counting — content still comes
 * from WPGraphQL. `categoryId` is a numeric term ID (WP REST, unlike
 * WPGraphQL, filters categories by ID rather than slug).
 */
export async function getWpRestPostCount(
  categoryId?: number,
  revalidateSeconds: number = DEFAULT_REVALIDATE_SECONDS
): Promise<number> {
  const url = new URL(`${getWordPressBaseUrl()}/wp-json/wp/v2/posts`);
  url.searchParams.set("per_page", "1");
  if (categoryId !== undefined) url.searchParams.set("categories", String(categoryId));

  const res = await fetch(url.toString(), { next: { revalidate: revalidateSeconds } });
  if (!res.ok) throw new Error(`WP REST API error ${res.status} counting posts`);
  return Number(res.headers.get("X-WP-Total") ?? 0);
}

/** Resolves a post category slug to its numeric term ID via the core REST API. */
export async function getWpCategoryId(
  slug: string,
  revalidateSeconds: number = DEFAULT_REVALIDATE_SECONDS
): Promise<number | undefined> {
  const url = new URL(`${getWordPressBaseUrl()}/wp-json/wp/v2/categories`);
  url.searchParams.set("slug", slug);

  const res = await fetch(url.toString(), { next: { revalidate: revalidateSeconds } });
  if (!res.ok) throw new Error(`WP REST API error ${res.status} resolving category "${slug}"`);
  const categories = (await res.json()) as { id: number }[];
  return categories[0]?.id;
}

import type { MetadataRoute } from "next";
import { getCategories, getPosts, getProducts } from "@/lib/data";
import { siteConfig } from "@/lib/site-config";

export const revalidate = 3600;

const MAX_PAGES = 50;

async function productUrls(): Promise<MetadataRoute.Sitemap> {
  const urls: MetadataRoute.Sitemap = [];
  let page = 1;
  let totalPages = 1;
  do {
    const result = await getProducts({ page });
    for (const product of result.products) {
      urls.push({ url: `${siteConfig.url}/product/${product.slug}` });
    }
    totalPages = result.totalPages;
    page += 1;
  } while (page <= totalPages && page <= MAX_PAGES);
  return urls;
}

async function postUrls(): Promise<MetadataRoute.Sitemap> {
  const urls: MetadataRoute.Sitemap = [];
  let page = 1;
  let totalPages = 1;
  do {
    const result = await getPosts(page);
    for (const post of result.posts) {
      urls.push({ url: `${siteConfig.url}/magazine/${post.slug}` });
    }
    totalPages = result.totalPages;
    page += 1;
  } while (page <= totalPages && page <= MAX_PAGES);
  return urls;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticUrls: MetadataRoute.Sitemap = [
    { url: siteConfig.url, priority: 1 },
    { url: `${siteConfig.url}/about`, priority: 0.5 },
    { url: `${siteConfig.url}/magazine`, priority: 0.5 },
    { url: `${siteConfig.url}/search`, priority: 0.3 },
  ];

  try {
    const categories = await getCategories();
    const categoryUrls: MetadataRoute.Sitemap = categories.map((c) => ({
      url: `${siteConfig.url}/products/${c.slug}`,
      priority: 0.7,
    }));
    const [products, posts] = await Promise.all([productUrls(), postUrls()]);
    return [...staticUrls, ...categoryUrls, ...products, ...posts];
  } catch {
    // Backend unreachable — serve the static routes rather than fail the whole sitemap.
    return staticUrls;
  }
}

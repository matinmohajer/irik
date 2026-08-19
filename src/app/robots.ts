import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/account/", "/cart", "/checkout", "/checkout/", "/api/"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}

import path from "node:path";
import type { NextConfig } from "next";

/**
 * Product/post images are served from the WordPress media library once the
 * backend is connected — derived from WOOCOMMERCE_URL (set in .env.local)
 * rather than a separate hostname var, so there's one source of truth and
 * this works for both a local http:// dev site and a real https:// store.
 */
function wordpressMediaRemotePattern() {
  if (!process.env.WOOCOMMERCE_URL) return [];
  const url = new URL(process.env.WOOCOMMERCE_URL);
  return [
    {
      protocol: url.protocol.replace(":", "") as "http" | "https",
      hostname: url.hostname,
      port: url.port || undefined,
    },
  ];
}

const nextConfig: NextConfig = {
  // Pins the workspace root to this project — avoids Turbopack misdetecting
  // it from an unrelated lockfile higher up the filesystem tree.
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    remotePatterns: wordpressMediaRemotePattern(),
  },
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
    ];
  },
};

export default nextConfig;

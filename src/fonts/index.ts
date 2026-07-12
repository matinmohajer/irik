import localFont from "next/font/local";

/**
 * Vazirmatn — self-hosted, no CDN request, matches the approved design concept.
 * Weights: 400 (body), 500 (UI/labels), 700 (emphasis), 900 (display, used sparingly).
 */
export const vazirmatn = localFont({
  src: [
    { path: "./Vazirmatn-Regular.woff2", weight: "400", style: "normal" },
    { path: "./Vazirmatn-Medium.woff2", weight: "500", style: "normal" },
    { path: "./Vazirmatn-Bold.woff2", weight: "700", style: "normal" },
    { path: "./Vazirmatn-Black.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-vazirmatn",
  display: "swap",
  fallback: ["Tahoma", "Segoe UI", "Arial", "sans-serif"],
});

#!/usr/bin/env node
/**
 * Generates branded placeholder "photography" for every mock product/post,
 * so the storefront looks finished before real product photos exist.
 *
 * Self-contained on purpose (no image libraries) — just writes SVG. Re-run
 * with `node scripts/generate-placeholder-images.mjs` any time the mock
 * catalog changes. Once real WooCommerce/WordPress photos are wired up
 * these files (and the `/images/...` paths in mock-data.ts) can be deleted.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, "..", "public", "images");

const ACCENT = "#2454D9";
const PAPER_SUNKEN = "#EFEFF2";
const PAPER_DEEP = "#E4E5EA";

/** Same path data as src/components/icons/IconSprite.tsx, 24x24 viewBox. Elements needing a
 * constant-width stroke after scaling carry vector-effect="non-scaling-stroke". */
const ICONS = {
  laptop: `
    <rect x="4.5" y="4.5" width="15" height="10" rx="1" vector-effect="non-scaling-stroke"/>
    <path d="M2 19.5h20l-1.8-3.3H3.8z" vector-effect="non-scaling-stroke"/>
    <line x1="10" y1="17.4" x2="14" y2="17.4" vector-effect="non-scaling-stroke"/>`,
  gamepad: `
    <path d="M6.5 8h11a4 4 0 0 1 4 4.6l-.6 3.3a2.3 2.3 0 0 1-3.9 1.2L15.3 15H8.7l-1.7 2.1a2.3 2.3 0 0 1-3.9-1.2l-.6-3.3A4 4 0 0 1 6.5 8z" vector-effect="non-scaling-stroke"/>
    <line x1="7.2" y1="11.3" x2="7.2" y2="13.7" vector-effect="non-scaling-stroke"/>
    <line x1="6" y1="12.5" x2="8.4" y2="12.5" vector-effect="non-scaling-stroke"/>
    <circle cx="17" cy="11.3" r=".6" fill="currentColor" stroke="none"/>
    <circle cx="15.2" cy="13" r=".6" fill="currentColor" stroke="none"/>`,
  headset: `
    <path d="M4 13v-1a8 8 0 0 1 16 0v1" vector-effect="non-scaling-stroke"/>
    <rect x="2.5" y="13" width="4.5" height="6" rx="1.5" vector-effect="non-scaling-stroke"/>
    <rect x="17" y="13" width="4.5" height="6" rx="1.5" vector-effect="non-scaling-stroke"/>
    <path d="M19.3 19.2v.8a3 3 0 0 1-3 3H13" vector-effect="non-scaling-stroke"/>`,
  mouse: `
    <rect x="7" y="3" width="10" height="18" rx="5" vector-effect="non-scaling-stroke"/>
    <line x1="12" y1="3" x2="12" y2="10" vector-effect="non-scaling-stroke"/>`,
  drive: `
    <rect x="3" y="6" width="18" height="12" rx="2" vector-effect="non-scaling-stroke"/>
    <circle cx="8" cy="12" r="1" fill="currentColor" stroke="none"/>
    <line x1="12" y1="12" x2="17.5" y2="12" vector-effect="non-scaling-stroke"/>`,
  cpu: `
    <rect x="7" y="7" width="10" height="10" rx="1" vector-effect="non-scaling-stroke"/>
    <rect x="10" y="10" width="4" height="4" vector-effect="non-scaling-stroke"/>
    <line x1="12" y1="2" x2="12" y2="5.2" vector-effect="non-scaling-stroke"/>
    <line x1="12" y1="18.8" x2="12" y2="22" vector-effect="non-scaling-stroke"/>
    <line x1="2" y1="12" x2="5.2" y2="12" vector-effect="non-scaling-stroke"/>
    <line x1="18.8" y1="12" x2="22" y2="12" vector-effect="non-scaling-stroke"/>
    <line x1="5" y1="5" x2="7.2" y2="7.2" vector-effect="non-scaling-stroke"/>
    <line x1="16.8" y1="16.8" x2="19" y2="19" vector-effect="non-scaling-stroke"/>`,
  "chip-brand": `
    <rect x="5" y="5" width="14" height="14" rx="3" vector-effect="non-scaling-stroke"/>
    <path d="M9 12h6M12 9v6" vector-effect="non-scaling-stroke"/>`,
  monitor: `
    <rect x="3" y="4.5" width="18" height="12" rx="1.3" vector-effect="non-scaling-stroke"/>
    <line x1="9" y1="20" x2="15" y2="20" vector-effect="non-scaling-stroke"/>
    <line x1="12" y1="16.5" x2="12" y2="20" vector-effect="non-scaling-stroke"/>`,
};

/** Small deterministic hash so each slug gets a stable, distinct-looking placeholder. */
function seedFrom(slug) {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return h;
}

function placeholderSvg({ icon, slug, width, height }) {
  const seed = seedFrom(slug);
  const angle = seed % 140; // gradient angle, degrees
  const dotRotate = seed % 40;
  const iconPaths = ICONS[icon] ?? ICONS.laptop;
  const cx = width / 2;
  const cy = height / 2;
  const iconScale = Math.min(width, height) * 0.017; // 24-unit icon -> ~41% of the short side
  const bracketSize = Math.min(width, height) * 0.07;
  const bracketInset = Math.min(width, height) * 0.045;
  const uid = `${icon}-${slug}`.replace(/[^a-z0-9-]/gi, "");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-hidden="true">
  <defs>
    <linearGradient id="bg-${uid}" gradientTransform="rotate(${angle})">
      <stop offset="0%" stop-color="${PAPER_SUNKEN}"/>
      <stop offset="100%" stop-color="${PAPER_DEEP}"/>
    </linearGradient>
    <pattern id="dots-${uid}" width="30" height="30" patternUnits="userSpaceOnUse" patternTransform="rotate(${dotRotate})">
      <circle cx="1.5" cy="1.5" r="1.6" fill="${ACCENT}" opacity="0.16"/>
    </pattern>
  </defs>

  <rect width="${width}" height="${height}" fill="url(#bg-${uid})"/>
  <rect width="${width}" height="${height}" fill="url(#dots-${uid})"/>

  <g fill="none" stroke="${ACCENT}" stroke-width="3" stroke-linecap="round">
    <path d="M ${bracketInset} ${bracketInset + bracketSize} V ${bracketInset} H ${bracketInset + bracketSize}" opacity="0.9"/>
    <path d="M ${width - bracketInset} ${height - bracketInset - bracketSize} V ${height - bracketInset} H ${width - bracketInset - bracketSize}" opacity="0.9"/>
  </g>

  <g transform="translate(${cx} ${cy}) scale(${iconScale}) translate(-12 -12)" fill="none" stroke="${ACCENT}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">
    ${iconPaths}
  </g>
</svg>`;
}

const PRODUCTS = [
  { slug: "lenovo-loq-15irx9", icon: "laptop" },
  { slug: "playstation-5-slim", icon: "gamepad" },
  { slug: "asus-vivobook-15", icon: "laptop" },
  { slug: "hyperx-cloud-ii", icon: "headset" },
  { slug: "asus-tuf-f15", icon: "laptop" },
  { slug: "lenovo-ideapad-slim-3", icon: "laptop" },
  { slug: "acer-nitro-v15", icon: "laptop" },
  { slug: "macbook-air-m2", icon: "laptop" },
  { slug: "hp-victus-15", icon: "laptop" },
  { slug: "logitech-g502", icon: "mouse" },
];

const POSTS = [
  { slug: "gaming-laptop-buying-guide-2026", icon: "laptop" },
  { slug: "ps5-vs-xbox-series-x", icon: "gamepad" },
  { slug: "internal-vs-external-ssd", icon: "drive" },
  { slug: "cpu-cooler-air-vs-liquid", icon: "cpu" },
  { slug: "intel-core-ultra-arrives-in-iran", icon: "chip-brand" },
  { slug: "gaming-monitor-buying-guide", icon: "monitor" },
];

const productsDir = path.join(PUBLIC_DIR, "products");
const postsDir = path.join(PUBLIC_DIR, "posts");
mkdirSync(productsDir, { recursive: true });
mkdirSync(postsDir, { recursive: true });

for (const { slug, icon } of PRODUCTS) {
  const svg = placeholderSvg({ icon, slug, width: 800, height: 800 });
  writeFileSync(path.join(productsDir, `${slug}.svg`), svg, "utf8");
}

for (const { slug, icon } of POSTS) {
  const svg = placeholderSvg({ icon, slug, width: 1000, height: 625 });
  writeFileSync(path.join(postsDir, `${slug}.svg`), svg, "utf8");
}

console.log(`Generated ${PRODUCTS.length} product + ${POSTS.length} post placeholder images in public/images/`);

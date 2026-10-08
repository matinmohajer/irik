# آیریک — کاتالوگ آنلاین (Next.js 16 + WordPress/WooCommerce)

Headless product catalogue for **آیریک**: laptops, desktops, gaming consoles
and accessories, sold from the Isfahan Computer Bazaar. Next.js renders every
page (home, catalog, product, magazine, about); WordPress + WooCommerce own
the content and inventory.

There is **no cart, checkout, payment gateway, login or customer account** —
by design. Visitors browse freely and order or ask about a product over
**WhatsApp** (+98 913 500 2165). See [Ordering via WhatsApp](#ordering-via-whatsapp).

## Stack

- **Next.js 16** (App Router, Turbopack, React 19)
- Hand-written CSS design system (`src/app/globals.css`) — no Tailwind, ported
  1:1 from the approved design concept
- **Vazirmatn** self-hosted via `next/font/local` (`src/fonts`)
- **WooCommerce REST API** for products/categories (`src/lib/woocommerce`)
- **WPGraphQL** for blog posts (`src/lib/wordpress`)
- `jalaali-js` for Gregorian → Jalali (Persian) date conversion

## Running it today

The catalog/magazine fall back to bundled mock content
(`src/lib/mock-data.ts`) if no backend is configured, so the site is
browsable with zero setup.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## How the data layer works

Every page imports from **`src/lib/data.ts`**, never from WooCommerce/WordPress
clients directly. Each function there checks whether its backend is configured
(env vars present) and transparently falls back to mock data otherwise:

```
pages  →  src/lib/data.ts  →  configured? → src/lib/woocommerce/* or src/lib/wordpress/*
                            → not configured? → src/lib/mock-data.ts
```

## Plugins installed (local WordPress)

The minimal set needed to run this storefront, nothing extra:

| Plugin | Purpose |
| --- | --- |
| [WooCommerce](https://wordpress.org/plugins/woocommerce/) | products, categories, brands, stock |
| [WPGraphQL](https://wordpress.org/plugins/wp-graphql/) | blog/magazine queries |

## Ordering via WhatsApp

Every "buy" action is a `https://wa.me/989135002165` click-to-chat link,
built by `whatsappHref()` in `src/lib/site-config.ts` (change
`whatsappNumber` there to point the whole site at a different number):

- **Product page** — "سفارش در واتس‌اپ" opens WhatsApp with a prefilled
  message: product name, the selected options, quantity and the product URL.
  Out-of-stock products say "استعلام موجودی در واتس‌اپ" instead.
- **Product cards** — a WhatsApp icon button prefilled with the product name
  and URL.
- **Header, top bar, mobile drawer, footer, About page** and a floating
  button on every page — open a plain chat with the store.

## Connecting WordPress + WooCommerce (catalog/blog)

Everything below is verified against the real local install (see
[Local development WordPress](#local-development-wordpress)), not assumed.

1. **Install WordPress** on your host of choice (Farsi locale, RTL admin is
   fine — the frontend doesn't use wp-admin's theme).
2. **Install plugins** — see the [table above](#plugins-installed-local-wordpress).
3. **Create product categories** under WooCommerce → Products → Categories,
   matching the two-level taxonomy the mega menu and listing pages expect —
   8 top-level with subcategories nested under each via WooCommerce's normal
   parent-category field (not a separate plugin): `laptop`, `desktop`,
   `console`, `monitor`, `parts`, `storage`, `accessories`, `network`, each
   with a handful of children (e.g. `laptop` → `laptop-gaming`,
   `laptop-office`, `laptop-apple`...). See `CATEGORIES` in
   `src/lib/mock-data.ts` for the exact slugs/names, or
   `scripts/seed-wp.php` to create all 38 (plus sample products/posts/brands)
   in one command. Browsing a parent category automatically includes all its
   subcategories' products.
4. **Create products** under WooCommerce → Products, assigned to the
   categories above and (optionally) a term under Products → Brands (native
   WooCommerce 8.9+ taxonomy — `src/lib/woocommerce/map.ts` reads it
   directly, falling back to a `برند`/`Brand` product *attribute* only for
   older WooCommerce versions that predate it).
5. **Generate a WooCommerce REST API key**: wp-admin → WooCommerce → Settings
   → Advanced → REST API → Add key, permission **Read**. WooCommerce only
   accepts these as HTTP Basic auth over **HTTPS**; over plain HTTP (e.g. a
   local dev site) it requires OAuth 1.0a query-string signing instead —
   `src/lib/woocommerce/client.ts` detects the protocol and does this
   automatically, no configuration needed either way.
6. **Write posts** under Posts → Add New for the magazine, assigned to one of:
   `buying-guide` (راهنمای خرید), `comparison` (مقایسه), `tutorial` (آموزش),
   `news` (اخبار) — or edit `CATEGORY_CHIPS` in
   `src/app/magazine/page.tsx` and `CATEGORY_ICONS` in
   `src/lib/wordpress/posts.ts` to match your own category slugs.
7. **Copy `.env.example` to `.env.local`** and fill in `WOOCOMMERCE_URL`,
   `WOOCOMMERCE_CONSUMER_KEY`, `WOOCOMMERCE_CONSUMER_SECRET`,
   and `WORDPRESS_GRAPHQL_URL`.
   The `next/image` remote pattern for the media library is derived
   automatically from `WOOCOMMERCE_URL` — no separate hostname variable to
   keep in sync.
8. Restart `npm run dev` — the site now reads live data. No code changes.

## Local development WordPress

A real local WordPress + WooCommerce + WPGraphQL instance lives alongside
this project at `../irik-wp` (sibling directory, not inside this repo — it's
PHP, not part of the Next.js app). It was set up with WP-CLI against a local
MariaDB (Homebrew), no Docker needed:

```bash
cd ../irik-wp
wp server --host=localhost --port=8888   # start it
```

- **wp-admin**: http://localhost:8888/wp-admin — user `admin`, password `IrikAdmin2026!`
- Seeded with the same 38 categories, 8 brands, 10 products and 6 posts as
  `src/lib/mock-data.ts` (re-run `wp eval-file ../irik/scripts/seed-wp.php`
  any time you reset the database — it's idempotent).
- `.env.local` in this repo already points at it, so `npm run dev` here
  talks to real WordPress data right now, not the mock fallback.
- No product photos are uploaded (SVG placeholders aren't a real store's
  media format, and there's no product photography yet) — cards fall back to
  the same icon placeholder as an empty `images: []` in mock mode. Upload
  real photos through the product editor whenever you have them; they'll
  appear automatically, no code change.

**Moving to real hosting later**: once you buy WordPress hosting with a
one-click installer (Softaculous, Hostinger, etc.), the standard path is to
install fresh there (same plugin list above) and either re-run
`scripts/seed-wp.php` for a clean start, or migrate this local site's content
across with a plugin like *All-in-One WP Migration*. Then:

- Update `.env.local` (or the host's production env vars) to the new
  `https://` URL and a freshly generated REST key — the OAuth-vs-Basic-auth
  switch happens automatically once the URL is `https://`.
- Set `WP_DEBUG` to `false` in `wp-config.php`.

## Project structure

```
src/
  app/                     routes (App Router)
    page.tsx               home
    products/[category]/   category listing + filters
    product/[slug]/         product detail
    magazine/, magazine/[slug]/  blog listing + post
    about/                  درباره ما / contact / warranty / returns
    search/                 functional search
  components/
    layout/                header (mega menu, mobile drawer), footer, breadcrumb
    product/, blog/, ui/    ProductCard, ArticleCard, Pagination, StarRating…
    icons/                  hand-drawn SVG sprite (schematic/line-art style)
  lib/
    data.ts                 the facade product/post pages import from
    woocommerce/, wordpress/  typed REST/GraphQL clients + mappers
    site-config.ts           store name/phone/address + WhatsApp link helper
    mock-data.ts             bundled fallback content (catalog/blog only)
    format.ts                Persian digits, toman formatting, Jalali dates
  fonts/                    self-hosted Vazirmatn (next/font/local)
```

## Known scope limits (by design, not oversight)

- **No cart, checkout, payment, login or accounts.** Orders happen in
  WhatsApp — see [Ordering via WhatsApp](#ordering-via-whatsapp).
- **Listing filters cover brand + price** (both are structural WooCommerce
  fields). CPU/RAM/"use case" filters from the design mock are left out
  because WooCommerce has no standard taxonomy for them — they're
  store-specific product attributes you'd define in wp-admin first, then wire
  into `src/lib/woocommerce/products.ts`.

## Design notes

Light mode only, by explicit choice — no dark theme code exists. Farsi text
never has `letter-spacing` applied (it's a joining script — tracking breaks
connected letterforms); it's reserved for Latin/numeric technical tokens
(SKUs, spec codes) set in the mono face. See `src/app/globals.css` for the
full token system (`--accent`, `--ink`, `--paper`, etc.).

# آیریک — فروشگاه اینترنتی (Next.js 16 + WordPress/WooCommerce)

Headless storefront for **آیریک**: laptops, desktops, gaming consoles and
accessories, sold from the Isfahan Computer Bazaar. Next.js renders every
page (home, catalog, magazine, cart, checkout, account); WordPress +
WooCommerce own the content, inventory, orders, phone/OTP auth and payment.

## Stack

- **Next.js 16** (App Router, Turbopack, React 19)
- Hand-written CSS design system (`src/app/globals.css`) — no Tailwind, ported
  1:1 from the approved design concept
- **Vazirmatn** self-hosted via `next/font/local` (`src/fonts`)
- **WooCommerce REST API** for products/categories (`src/lib/woocommerce`)
- **WooCommerce Store API** for cart/checkout (`src/lib/store-api`) — the same
  API WooCommerce's own Cart/Checkout blocks use
- **WPGraphQL** for blog posts (`src/lib/wordpress`)
- **Phone + OTP auth** via sms.ir, custom JWT session (`src/lib/auth`) — see
  [Phone + OTP authentication](#phone--otp-authentication)
- **ZarinPal** payment gateway (Iran's standard WooCommerce gateway)
- `jalaali-js` for Gregorian → Jalali (Persian) date conversion

## Running it today

The catalog/magazine fall back to bundled mock content
(`src/lib/mock-data.ts`) if no backend is configured, so the site is
browsable with zero setup. Auth, cart and checkout, however, **talk to
WordPress directly** and need a real backend (local or hosted) to function —
see [Local development WordPress](#local-development-wordpress).

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

Auth/cart/checkout don't have a mock fallback — there's no meaningful way to
"place a mock order" — so those routes 502 with a clear error if
`WOOCOMMERCE_URL` isn't set, rather than pretending to succeed.

## Plugins installed (local WordPress)

The minimal set needed to run this storefront, nothing extra:

| Plugin | Purpose |
| --- | --- |
| [WooCommerce](https://wordpress.org/plugins/woocommerce/) | products, categories, cart/checkout (Store API), orders |
| [WPGraphQL](https://wordpress.org/plugins/wp-graphql/) | blog/magazine queries |
| [Zarinpal Gateway](https://wordpress.org/plugins/zarinpal-woocommerce-payment-gateway/) | Iran's standard payment gateway — sanctions rule out Stripe/PayPal |
| [WSMS (WP SMS)](https://wordpress.org/plugins/wp-sms/) | sms.ir integration + the OTP generate/verify primitives our custom auth endpoint wraps |

Plus one custom, store-specific plugin that isn't something you'd find on
wordpress.org: **`wp-content/mu-plugins/irik-headless-auth.php`** — phone/OTP
REST endpoints, JWT issuance, and the bridge that makes WooCommerce (Store
API included) recognise the logged-in customer from that JWT. It's a
mu-plugin (always active, no admin toggle) because it's glue code specific to
this frontend, not a general-purpose plugin. See
[Phone + OTP authentication](#phone--otp-authentication) below for how it works.

## Phone + OTP authentication

No email/password — login is phone number + a 6-digit SMS code, using
**sms.ir** (via the WSMS plugin's `SmsOtp`/`Verifier` classes, which already
handle rate-limiting, hashing and expiry — the mu-plugin wraps rather than
reimplements them) and a custom **JWT** session, since WordPress's own cookie
auth doesn't cross origins cleanly between a Next.js frontend and a separate
WP domain.

```
Next.js /account/login
  → POST /api/auth/request-otp   → WP: generates + SMS's a 6-digit code (sms.ir)
  → POST /api/auth/verify-otp    → WP: verifies, finds-or-creates a WP user by phone,
                                     mints a JWT (HS256, IRIK_JWT_SECRET)
  → Next.js sets an httpOnly session cookie with that JWT
  → src/proxy.ts verifies the cookie locally (optimistic check, no network
    call) to gate /account/*
  → Server Components/Route Handlers forward the JWT as
    `Authorization: Bearer <token>` to WordPress, which recognises it via a
    `determine_current_user` filter — this is what lets WooCommerce's Store
    API associate the cart/order with the right customer, not just this
    plugin's own endpoints
```

**To go live**, you need your own sms.ir account (free to create, but sending
real SMS costs credit): wp-admin → WSMS → Settings → Gateway, select **sms.ir**,
paste your API key and sender line number. Until then, `WP_DEBUG` mode returns
the OTP code directly in the API response (`dev_code`) so the whole flow is
testable without spending SMS credit — this never happens with `WP_DEBUG` off,
which production must be.

`IRIK_JWT_SECRET` **must be identical** in `irik-wp/wp-config.php` and this
repo's `.env.local` — one signs the token, the other verifies it locally in
`src/proxy.ts`. Generate one with `openssl rand -hex 32`.

## Cart & checkout

Cart state lives entirely in WooCommerce (via the Store API), not in Next.js
— `src/app/api/cart/*` and `src/app/api/checkout/*` are a thin proxy that
keeps the Store API's `Cart-Token`/`Nonce` (its own CSRF mechanism) in
httpOnly cookies instead of exposing them to client JS, and forwards the auth
JWT when present so a logged-in customer's cart is tied to their account.

Checkout flow: address form → `POST /api/checkout/address` (sets the
WooCommerce customer address, which is what makes shipping rates
calculable) → pick a shipping rate → `POST /api/checkout/place-order` →
redirect the browser to whatever URL WooCommerce/ZarinPal returns. That's
normally ZarinPal's hosted payment page directly; in this sandbox setup it
currently lands on WooCommerce's own "pay for order" page first (a legitimate
WooCommerce fallback, not a bug — the customer still reaches ZarinPal from
there) — worth revisiting once real ZarinPal keys make the direct-redirect
path testable.

After payment, ZarinPal returns the customer to
`woocommerce_get_checkout_order_received_url` — filtered in the mu-plugin to
point at **`/checkout/success`** on the Next.js frontend (not a WordPress
page), carrying the order ID and WooCommerce's own order key as a
proof-of-ownership token. That page calls a public (key-verified, no login
needed) order-lookup endpoint to show the confirmation.

**To go live**: wp-admin → WooCommerce → Settings → Payments → ZarinPal →
turn off Sandbox mode and paste your real Merchant ID from
[zarinpal.com](https://www.zarinpal.com) (requires an Iranian business/bank
account to register — something only you can do). Also set
`IRIK_FRONTEND_URL` in `wp-config.php` to your real frontend domain once
deployed (it's `http://localhost:3000` locally).

Shipping is a single "سراسر ایران" zone with two methods — تحویل حضوری
(free, in-store pickup at the Isfahan bazaar) and پست پیشتاز (flat rate);
adjust cost/methods under WooCommerce → Settings → Shipping.

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
   `WORDPRESS_GRAPHQL_URL`, and `IRIK_JWT_SECRET` (must match
   `wp-config.php` — see [Phone + OTP authentication](#phone--otp-authentication)).
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
- ZarinPal is configured in **sandbox mode** with a placeholder Merchant ID —
  checkout works end to end locally without a real ZarinPal account.
- WSMS's sms.ir gateway is selected but has no API key yet — OTP codes are
  returned directly in the API response instead of texted (`WP_DEBUG` mode;
  see [Phone + OTP authentication](#phone--otp-authentication)).
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
- Get a real **sms.ir** API key and a real **ZarinPal** Merchant ID (both
  require accounts only you can create — see the sections above).
- Set `WP_DEBUG` to `false` and `IRIK_FRONTEND_URL` to your real domain in
  `wp-config.php`.
- Generate a fresh `IRIK_JWT_SECRET` for production and set it in both
  `wp-config.php` and the frontend's production env vars.

## Project structure

```
src/
  app/                     routes (App Router)
    page.tsx               home
    products/[category]/   category listing + filters
    product/[slug]/         product detail
    magazine/, magazine/[slug]/  blog listing + post
    about/                  درباره ما / contact / warranty / returns
    cart/, checkout/, checkout/success/   real cart + checkout (Store API)
    account/, account/login/, account/orders/   phone+OTP auth, order history
    api/auth/, api/cart/, api/checkout/, api/orders/   BFF proxy to WordPress
    search/                 functional search
  components/
    layout/                header (mega menu, mobile drawer), footer, breadcrumb
    product/, blog/, ui/    ProductCard, ArticleCard, Pagination, StarRating…
    cart/                   CartProvider (context), AddToCartButton, CartBadge
    auth/                   LoginForm, LogoutButton
    icons/                  hand-drawn SVG sprite (schematic/line-art style)
  lib/
    data.ts                 the facade product/post pages import from
    woocommerce/, wordpress/  typed REST/GraphQL clients + mappers
    store-api/               WooCommerce Store API client (cart/checkout)
    auth/                    JWT verify, session cookies, OTP client
    mock-data.ts             bundled fallback content (catalog/blog only)
    format.ts                Persian digits, toman formatting, Jalali dates
  fonts/                    self-hosted Vazirmatn (next/font/local)
  proxy.ts                  optimistic /account/* route protection
```

## Known scope limits (by design, not oversight)

- **Wishlist is still a placeholder.** The heart icon and `/account/wishlist`
  aren't wired to anything — worth a follow-up pass (WooCommerce has no
  built-in wishlist; would need a small custom meta-based implementation
  similar to the OTP auth mu-plugin).
- **Checkout payment redirect** currently lands on WooCommerce's own
  "pay for order" page before ZarinPal, rather than a direct redirect — see
  [Cart & checkout](#cart--checkout).
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

# Project Brief — E-Commerce Storefront

> Reverse-engineered from the current source code on branch `dev` (2026-09-15). This is a discovery document, not a spec — it describes what the code actually does today, including inconsistencies and dead code. Nothing in the application was modified to produce this document.

---

# Project Identity

This repository is the **customer-facing storefront** for a multi-tenant e-commerce platform. It was originally scaffolded from Antonio Erdeljac's "Full Stack E-Commerce + Dashboard & CMS" tutorial (Next.js 13 App Router + Prisma/MySQL Admin CMS), as confirmed by the README and `LICENSE` (MIT, Copyright Antonio Erdeljac).

The repo has since **diverged significantly from the tutorial** (per git log: `USD to PKR`, `added COD to UI`, `added floating whatsapp button`, `added : customer details for COD`, `added : brand logo`, `added : store id to env`). It is now customized for a **Pakistan-based single-store deployment**:

- Currency formatting hard-coded to `PKR` / `en-PK` locale.
- A full **Cash-on-Delivery (COD)** ordering flow has been added alongside the original Stripe checkout flow.
- A floating WhatsApp contact button has been added.
- The store's logo/name is fetched dynamically from the Admin API instead of being hard-coded.

The README still describes the original tutorial's full feature set (Clerk auth, multi-vendor admin, Stripe webhooks) — that describes the **Admin/CMS repo**, not this repo. This repo contains **no authentication, no admin functionality, and no database access** — it is a pure API-consuming frontend.

# Technology Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 13.4.4 |
| UI library | React / React DOM | 18.2.0 |
| Language | TypeScript | 5.1.3 |
| Styling | Tailwind CSS | 3.3.2 |
| State management | Zustand (+ `persist` middleware) | 4.3.8 |
| HTTP clients | native `fetch` (server-side data) + `axios` (client-side checkout/COD posts) | axios 1.4.0 |
| Headless UI primitives | `@headlessui/react` (Tab, Dialog, Transition) | 1.7.15 |
| Icons | `lucide-react` | 0.241.0 |
| URL/query building | `query-string` | 8.1.0 |
| Toasts | `react-hot-toast` | 2.4.1 |
| Class merging | `clsx` + `tailwind-merge` | — |
| Font | `next/font/google` — Urbanist | — |
| Lint | `eslint-config-next` | 13.4.4 |

Installed but **unused** (dead dependencies): `date-fns`, `react-spinners`, `@tailwindcss/aspect-ratio` (not registered in `tailwind.config.js` plugins array).

No Stripe SDK, no ORM, no database client, no auth library are present in this repo — all of that lives in the Admin/CMS application.

# Repository Structure

```
app/
  layout.tsx                    Root layout — fonts, Navbar, Footer, providers, WhatsApp button
  globals.css                   Tailwind directives only
  (routes)/                     Route group (no URL segment added)
    page.tsx                    Home page
    loading.tsx                 Home page skeleton
    cart/
      page.tsx                  Cart page (client component)
      components/
        summary.tsx             Order summary, checkout + COD submission
        cart-item.tsx           Single cart line item
        cart-item-info.tsx      DEAD CODE — unused
        cod-details-form.tsx    Cash-on-delivery customer/shipping form
        order-success-card.tsx  Post-order confirmation card (COD)
    category/[categoryId]/
      page.tsx                  Category listing + filters
      loading.tsx
      components/
        filter.tsx               Desktop size/color filter (query-string driven)
        mobile-filters.tsx        Mobile filter drawer (Headless UI Dialog)
    product/[productId]/
      page.tsx                  Product detail page
      loading.tsx

actions/                        Server-side data-fetching functions (Admin API client)
  get-store.tsx  get-billboard.tsx  get-categories.tsx  get-category.tsx
  get-colors.tsx  get-sizes.tsx  get-product.tsx  get-products.tsx

components/
  navbar.tsx / navbar-actions.tsx / main-nav.tsx / footer.tsx
  preview-modal.tsx              Quick-view product modal
  product-list.tsx
  gallery/                       Product image gallery (Headless UI Tab)
  info.tsx                       Product detail info panel (name/price/size/color/add-to-cart)
  ui/                             Reusable primitives: button, container, currency, icon-button,
                                  modal, no-results, skeleton, billboard, product-card, whatspp-float

hooks/
  use-cart.tsx                   Zustand cart store (persisted)
  use-preview-modal.ts           Zustand modal store (not persisted)

lib/
  money.ts                       formatMoney() — Intl.NumberFormat PKR helper
  utils.ts                       cn() — clsx + tailwind-merge

providers/
  modal-provider.tsx             Mounts PreviewModal client-side only
  toast-provider.tsx             react-hot-toast <Toaster/>

types.ts                        Shared TS types (Product, Category, Billboard, Order*, Store)
constants.ts                    DEAD CODE — unused Tailwind-UI placeholder demo data
public/                         Static assets — mostly unused tutorial leftovers (see Technical Debt)
```

No `app/api/*` route handlers exist anywhere in this repo — **all data and mutations are proxied to the external Admin API**, never handled locally.

# Application Architecture

This is a **server-rendered, mostly server-component** Next.js 13 App Router app:

- Route-level pages (`page.tsx` in home/category/product) are **async React Server Components** that call the `actions/*` fetchers directly (no client-side data fetching, no SWR/React Query).
- `revalidate = 0` is exported on every data page (home, category, product, cart) — i.e. **fully dynamic, no ISR caching** at the route level.
- Interactivity (cart, filters, modals, forms, checkout) is isolated into `"use client"` leaf components (`navbar-actions`, `product-card`, `filter`, `summary`, `cod-details-form`, `preview-modal`, etc.), following the standard "server shell, client islands" App Router pattern.
- Global client state (cart contents, preview modal) lives in two independent Zustand stores, not React context.
- A hydration-safety pattern (`isMounted` state set in `useEffect`) is used everywhere a client component reads from `localStorage`-backed Zustand state (cart page, navbar actions, modal provider) to avoid SSR/CSR mismatch flicker.

# Route Map

| Route | File | Type | Data loaded |
|---|---|---|---|
| `/` | `app/(routes)/page.tsx` | Server | Featured products, billboard (by `NEXT_PUBLIC_STORE_ID`) |
| `/category/[categoryId]` | `app/(routes)/category/[categoryId]/page.tsx` | Server | Products (filtered), category (+ its billboard), sizes, colors |
| `/product/[productId]` | `app/(routes)/product/[productId]/page.tsx` | Server | Single product, related products (same category) |
| `/cart` | `app/(routes)/cart/page.tsx` | Client | Reads from local cart store only; posts to Admin API on checkout/COD |

There is no `/checkout`, `/success`, or `/cancel` **page** in this app — the Stripe redirect target is `/cart` itself, disambiguated via `?success=1` / `?canceled=1` query params (see Checkout & Payments).

# Store Resolution

The storefront is **single-tenant per deployment** and determines its Store via a **build-time/runtime environment variable**, not any dynamic lookup (no subdomain routing, no cookie, no header):

- `NEXT_PUBLIC_STORE_ID` — the Admin CMS's Store ID for this deployment.
  - Used directly in `app/(routes)/page.tsx` to fetch the home billboard: `getBillboard(process.env.NEXT_PUBLIC_STORE_ID)`.
  - Used in `components/navbar.tsx` to fetch store branding (name/logo) via `getStore(storeId)`.
- For every other resource (categories, products, sizes, colors, billboards-by-category), the store scoping is **baked into `NEXT_PUBLIC_API_URL` itself** — this env var is expected to already be the store-scoped Admin API base (the tutorial's Admin generates per-store routes like `/api/{storeId}/...`), so `actions/get-products.tsx` etc. never pass a `storeId` explicitly. The store identity for those calls is implicit in whichever URL was configured at deploy time.

**Inconsistency found:** `actions/get-store.tsx` reads a *different* env var, `NEXT_PUBLIC_API_BASE_URL` (commented in code as the *unscoped* API root, e.g. `http://localhost:3000/api`), and calls `${API_BASE_URL}/stores/${storeId}`. Every other action reads `NEXT_PUBLIC_API_URL` (the *store-scoped* base). Both variables must be set correctly and kept in sync for the navbar's store branding to load — see Technical Debt.

# Admin / Backend Integration

Communication with the Admin/CMS is **pure REST-over-HTTP, unauthenticated from the storefront's side** (no API key, no bearer token, no signature is attached to any outgoing request). This mirrors the CWA tutorial's Admin API design, where the Admin app exposes public, CORS-enabled REST endpoints per store for read operations, and semi-public POST endpoints for cart/order actions.

- **Server-side reads** (`actions/*.tsx`) use native `fetch`. Only `get-store.tsx` passes `{ cache: "no-store" }` explicitly; the rest rely on the page-level `export const revalidate = 0` to force dynamic, uncached fetches.
- **Client-side writes** (`summary.tsx`) use `axios.post` for `/checkout` and `/cod`.
- No shared API client module exists — each `actions/*.tsx` file independently constructs its own URL from environment variables and calls `fetch`/`res.json()`. There is no centralized error handling, retry logic, or response validation (e.g. no zod/schema check) — API responses are trusted and cast directly to TS interfaces.
- `next.config.js` whitelists two remote image domains: `tailwindui.com` (tutorial placeholder demo images, now dead) and `res.cloudinary.com` (the real image host — the Admin app very likely stores product/billboard images on Cloudinary and returns Cloudinary URLs).

# API Consumption

| Method | Endpoint (relative to store-scoped base unless noted) | Purpose | Called From |
|---|---|---|---|
| GET | `{NEXT_PUBLIC_API_BASE_URL}/stores/{storeId}` | Fetch store name/logo | `actions/get-store.tsx` → `components/navbar.tsx` |
| GET | `{NEXT_PUBLIC_API_URL}/billboards/{billboardId}` | Fetch a single billboard | `actions/get-billboard.tsx` → home page |
| GET | `{NEXT_PUBLIC_API_URL}/categories` | List all categories | `actions/get-categories.tsx` → navbar |
| GET | `{NEXT_PUBLIC_API_URL}/categories/{id}` | Fetch one category (incl. its billboard) | `actions/get-category.tsx` → category page |
| GET | `{NEXT_PUBLIC_API_URL}/colors` | List color filter options | `actions/get-colors.tsx` → category page |
| GET | `{NEXT_PUBLIC_API_URL}/sizes` | List size filter options | `actions/get-sizes.tsx` → category page |
| GET | `{NEXT_PUBLIC_API_URL}/products` (+ `categoryId`/`colorId`/`sizeId`/`isFeatured` query) | List/filter products | `actions/get-products.tsx` → home, category, product (related) pages |
| GET | `{NEXT_PUBLIC_API_URL}/products/{id}` | Fetch single product | `actions/get-product.tsx` → product page |
| POST | `{NEXT_PUBLIC_API_URL}/checkout` `{ productIds }` | Create a Stripe Checkout Session | `app/(routes)/cart/components/summary.tsx` (`onCheckout`) |
| POST | `{NEXT_PUBLIC_API_URL}/cod` `CreateOrderPayload` | Create a Cash-on-Delivery order | `app/(routes)/cart/components/summary.tsx` (`submitCOD`) |

Note: `getBillboard` is called with `NEXT_PUBLIC_STORE_ID` as its `id` param on the home page, but the same function's URL pattern is `/billboards/{id}` — implying the Admin API's "get billboard by id" endpoint doubles as "get store's default/standalone billboard" when passed the store ID rather than a billboard ID (or the two IDs coincide by convention in this deployment). Not verifiable from this repo alone; would need to be confirmed against the Admin repo.

# Product & Catalog Architecture

The catalog model (from `types.ts`) treats each **`Product` row as a single fixed variant** — a product has exactly one `size: Size` and one `color: Color` (not arrays of available options), consistent with the original tutorial's data model where a "product" is really a SKU (e.g. "Red Hoodie / L" and "Red Hoodie / M" are two separate `Product` records sharing a `name`/`category`).

- **Home page**: featured products (`isFeatured: true`) + a billboard.
- **Category page**: products filtered server-side by `categoryId` + optional `colorId`/`sizeId` query params; also renders that category's billboard, and both desktop (`Filter`) and mobile (`MobileFilters`) size/color pickers.
- **Filtering** (`filter.tsx`) is implemented via URL query-string mutation (`query-string` lib) and full page navigation (`router.push`) — not client-side filtering. Selecting an already-active filter value toggles it off. This means **filtering is server-driven and shareable via URL**, but each filter change triggers a fresh server request/render (no optimistic UI, no debouncing needed since it's a discrete click).
- **Product detail page**: single product + "Related Items" (`getProducts({ categoryId })` for the same category, unfiltered by size/color — so it includes the current product itself in the related list, a minor UX quirk, not a bug worth fixing here).
- **Quick view**: `ProductCard` → `usePreviewModal().onOpen(data)` opens `PreviewModal`, which reuses `Gallery` + `Info` without a page navigation.

# Cart Architecture

Implemented entirely client-side via Zustand (`hooks/use-cart.tsx`), no server-side cart/session concept exists.

- **State storage**: `items: Product[]` — the cart stores full denormalized `Product` objects (not `{productId, qty}` references). No dedicated cart-item shape.
- **Persistence**: `zustand/middleware`'s `persist` + `createJSONStorage(() => localStorage)`, key `"cart-storage"`. Survives reloads and tabs on the same browser; not synced across devices, not tied to any account (there is no account system).
- **Item identity**: a product's own `id` is the cart line identity. Since each `Product` already represents one fixed size+color combination, "variant handling" is implicit — adding "Red Hoodie / L" and "Red Hoodie / M" produces two distinct cart entries because they are two distinct `Product.id`s. There is no in-cart variant switcher.
- **Quantities**: **not supported.** `addItem` explicitly checks for an existing item with the same `id` and, if found, shows a toast ("Item already in cart.") and returns early instead of incrementing a quantity. Every cart line is implicitly quantity 1; total price is `sum(item.price)` across unique items, computed inline in `summary.tsx` via `useMemo`, not stored in the cart itself.
- **Removal**: `removeItem(id)` filters the array and toasts success. Triggered by the `X` icon button on each `CartItem`.
- **Clearing**: `removeAll()` empties `items`; called automatically after a successful Stripe redirect (`?success=1`) and after a successful COD submission.
- **Dead code**: `cart-item-info.tsx` is an unused alternate cart-line renderer (never imported anywhere).

# Checkout & Payments

Two independent, parallel checkout paths exist in `app/(routes)/cart/components/summary.tsx`, both gated on `items.length > 0`:

**1. Stripe (`onCheckout`)**
1. Client posts `{ productIds }` (array of cart item IDs) to `${NEXT_PUBLIC_API_URL}/checkout` via `axios`.
2. The Admin backend (not in this repo) is expected to create a Stripe Checkout Session server-side and return `{ url: <stripe checkout url> }`.
3. The browser is redirected via `window.location.href = response.data.url` — a full navigation away to Stripe-hosted checkout.
4. Stripe's `success_url`/`cancel_url` (configured Admin-side, not visible here) must point back at this storefront's `/cart` route with `?success=1` or `?canceled=1`.
5. Back on `/cart`, a `useEffect` watching `useSearchParams()` shows a toast ("Payment completed." / "Something went wrong.") and, on success, calls `removeAll()` to clear the local cart.
6. **No order confirmation UI exists for the Stripe path** — unlike COD, there is no fetch of the created order/receipt after redirect; the customer only sees a toast. Actual order persistence, payment capture, and any webhook handling happen entirely in the Admin repo (Stripe webhooks are explicitly called out in that tutorial's feature list).

**2. Cash on Delivery (`submitCOD`)**
1. Clicking "Cash on Delivery" opens a `Modal` containing `CODDetailsForm` (client-side form, manual `useState` + hand-rolled required-field validation — no form library like react-hook-form/zod despite `CreateOrderPayload` being a well-typed shape).
2. On submit, builds a `CreateOrderPayload` (`productIds`, `paymentMethod: "COD"`, `customer{name,phone,email}`, `shipping{line1,line2,city,postalCode,country:"PK",notes}`) and posts it to `${NEXT_PUBLIC_API_URL}/cod`.
3. The Admin backend creates the order directly (no payment gateway involved) and returns an `OrderResponse` (order id, tracking id, status, total, store, line items with resolved size/color).
4. On success: cart is cleared (`removeAll()`), the modal closes, a toast fires, and the returned order is rendered inline via `OrderSuccessCard` (tracking ID with copy-to-clipboard, status, total, itemized list) — replacing the order-summary panel in place (no route change).
5. On failure: the raw Admin error string (if `error.response.data` is a string) or a generic message is toasted; the modal stays open so the user can retry.

Country is **hard-coded to `"PK"`** in the COD payload — confirming this is a single-country (Pakistan) deployment, not a generic template anymore.

# Major Customer Flows

1. **Load home page** → `app/(routes)/page.tsx` (server) → `getProducts({isFeatured:true})` + `getBillboard(STORE_ID)` → renders `Billboard` + `ProductList`. `Navbar` (also server, rendered from layout) independently calls `getCategories()` + `getStore(STORE_ID)`.
2. **Load billboard** → either the store's default billboard (home) or a category's attached billboard (category page, embedded in `getCategory()`'s response) → rendered by the same `ui/billboard.tsx` component using `data.imageUrl` as a CSS background-image.
3. **Load categories** → `getCategories()` in `Navbar`, rendered as top-nav links (`MainNav`), highlighting the active category via `usePathname()`.
4. **Browse a category** → `/category/[categoryId]` (server) → `getProducts` (scoped + filtered) + `getCategory` + `getSizes`/`getColors` for filter chips.
5. **Load products** → `getProducts(query)` builds a query-string GET against `.../products`.
6. **Filter products** → clicking a `Filter` chip mutates the URL's `sizeId`/`colorId` query param and does a full `router.push`, re-running the server page with new `searchParams`.
7. **Open a product** → `ProductCard` click → `router.push('/product/{id}')` → server page fetches `getProduct(id)` + related `getProducts({categoryId})`.
8. **Select variants** → not a runtime action; the "variant" is fixed per `Product` record. The customer instead navigates between sibling `Product` records (different size/color) as if they were different products.
9. **Add/remove cart items** → `useCart().addItem(product)` (blocks duplicates) / `.removeItem(id)`, callable from `ProductCard`, `Info` (product page), `PreviewModal`'s `Info`, and the `X` button on `CartItem`.
10. **Cart persistence** → automatic via Zustand `persist` → `localStorage["cart-storage"]`; rehydrated on every load, gated behind an `isMounted` check to avoid hydration mismatches.
11. **Start checkout** → `/cart` → `Summary` → choose Stripe ("Proceed to Payment") or COD ("Cash on Delivery").
12. **Stripe checkout** → POST `/checkout` → redirect to Stripe-hosted page (external, Admin-issued URL).
13. **Successful checkout (Stripe)** → Stripe redirects back to `/cart?success=1` → toast + `removeAll()`. No local order record is fetched or displayed.
13b. **Successful checkout (COD)** → in-page: `OrderSuccessCard` renders the Admin's returned order immediately, no redirect.
14. **Order creation** → happens **entirely server-side in the Admin app** — for Stripe, at Checkout Session completion/webhook; for COD, synchronously inside the `/cod` endpoint handler. This repo never writes order data itself.
15. **Post-payment behaviour** → cart clears; for COD the tracking ID/status are surfaced; for Stripe, nothing further is fetched (a gap — see Technical Debt).

# State Management

- **Zustand**, two independent stores, no shared root store, no middleware beyond `persist`:
  - `useCart` (`hooks/use-cart.tsx`) — persisted cart.
  - `usePreviewModal` (`hooks/use-preview-modal.ts`) — ephemeral quick-view modal state, not persisted.
- No React Context is used for app state (Context only implicitly via Headless UI internals).
- No server-state/caching library (no SWR, no React Query, no RTK Query) — all server data arrives via RSC props at render time; client mutations use plain `axios` calls with local `useState` for loading/result, no cache invalidation needed since there's nothing cached client-side.
- Local component `useState`/`useMemo`/`useCallback` handle all form and derived-value state (`CODDetailsForm`, `Summary`'s `totalPrice`/`productIds`).

# UI Architecture

- **Design system**: none formal (no shadcn/ui, no component library) — hand-rolled Tailwind components in `components/ui/*` (`Button`, `Container`, `Currency`, `IconButton`, `Modal`, `NoResults`, `Skeleton`, `Billboard`, `ProductCard`).
- **Headless UI** (`@headlessui/react`) supplies unstyled interactive primitives: `Tab`/`Tab.Group` (product gallery thumbnails), `Dialog`+`Transition` (the generic `Modal` and `MobileFilters` drawer).
- **Icons**: `lucide-react` throughout (`ShoppingBag`, `ShoppingCart`, `Expand`, `X`, `Plus`, `AlertTriangle` (imported but unused in `use-cart.tsx`)).
- **Styling utility**: `cn()` (`lib/utils.ts`) wraps `clsx` + `tailwind-merge` for conditional/mergeable class strings, used across nearly every component with variant classes.
- Custom font: Google `Urbanist` via `next/font/google`, applied globally in the root layout.

# Server vs Client Components

**Server Components** (default, `async`, no directive): `app/layout.tsx`'s data-fetching siblings via `Navbar`, `app/(routes)/page.tsx`, `category/[categoryId]/page.tsx`, `product/[productId]/page.tsx`, `components/navbar.tsx`, `components/footer.tsx`, `components/ui/container.tsx`, `components/ui/no-results.tsx`, `components/ui/skeleton.tsx`, `components/ui/billboard.tsx`, `components/product-list.tsx`, `components/main-nav.tsx` is actually client (see below) — only pure presentational leaves without hooks stay server components.

**Client Components** (`"use client"` directive — anything using hooks, browser APIs, or event handlers): `main-nav.tsx` (uses `usePathname`), `navbar-actions.tsx`, `product-card.tsx`, `info.tsx`, `gallery/index.tsx`, `preview-modal.tsx`, `providers/*`, `app/(routes)/cart/page.tsx` and all its subcomponents (`summary.tsx`, `cart-item.tsx`, `cod-details-form.tsx`, `order-success-card.tsx`), `category/.../filter.tsx`, `mobile-filters.tsx`, `ui/modal.tsx`, `ui/currency.tsx`, `ui/whatspp-float.tsx`.

The split follows the intended App Router pattern well: pages fetch data server-side and pass it as props into client islands that need interactivity/localStorage/hooks.

# Environment Variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Store-scoped Admin API base URL, used by nearly every `actions/*` fetcher and by the client-side checkout/COD POST calls. |
| `NEXT_PUBLIC_API_BASE_URL` | Unscoped Admin API root, used only by `get-store.tsx` to hit `/stores/{id}`. Distinct from `NEXT_PUBLIC_API_URL` — see Technical Debt. |
| `NEXT_PUBLIC_STORE_ID` | This deployment's Admin Store ID; used to fetch store branding and the home billboard. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | International-format phone number (no `+`, no spaces) for the floating WhatsApp contact button; button renders `null` if unset. |

No `.env` or `.env.example` file exists in the repo (correctly gitignored), so there is no committed template for required variables — README documents them, but the README's example block has a duplicate `NEXT_PUBLIC_WHATSAPP_NUMBER` line and omits `NEXT_PUBLIC_API_BASE_URL` entirely.

No secret/server-only environment variables exist in this repo — every variable is `NEXT_PUBLIC_*` (client-exposed), consistent with this being a pure frontend with no server secrets to protect.

# Image Handling

- `next/image` is used everywhere product/billboard/gallery/logo images render (`fill` + relatively positioned wrapper is the consistent pattern), for automatic optimization/lazy-loading.
- Remote image hosts allowed via `next.config.js`: `tailwindui.com` (dead — tutorial placeholder only) and `res.cloudinary.com` (live — Admin-hosted product/billboard/logo images).
- Billboard images are the one exception: rendered as a plain CSS `background-image` in `ui/billboard.tsx`, not via `next/image` (no lazy-loading/optimization for that image, and no `next.config.js` domain restriction applies to it since it's not routed through `next/image`).
- Local static images in `public/` (`bag.png`, `coat.png`, `scarf.png`, `image.png`, `user.png`, `billboard-bg*.png`, `bg.svg`, `next.svg`, `vercel.svg`) are **entirely unused leftovers** from the original tutorial/CRA scaffold — see Technical Debt.

# Caching / Revalidation

- Every data-fetching page exports `export const revalidate = 0`, forcing fully dynamic rendering (no static generation, no ISR) for home, category, product, and cart pages.
- `get-store.tsx` additionally passes `fetch(url, { cache: "no-store" })` explicitly (redundant given `revalidate = 0`, but belt-and-suspenders).
- No other action opts out of Next's default fetch caching explicitly — but since the parent page already forces `revalidate = 0`, all fetches in that render are effectively dynamic regardless.
- No `revalidatePath`/`revalidateTag`, no on-demand revalidation webhook receiver exists in this repo (the Admin app would need to trigger any such thing itself, and there's no endpoint here for it to call).
- Net effect: **every page view hits the Admin API fresh**, trading performance for always-current data — reasonable for a small catalog, a potential latency/cost concern at scale.

# Error & Loading Handling

- **Loading UI**: `loading.tsx` files exist for the root route group, category page, and product page, each rendering `Skeleton` placeholders matching that page's approximate layout (Next.js App Router's automatic Suspense boundary per route segment).
- **No `error.tsx` boundary files exist anywhere** — an unhandled server-side fetch failure (e.g. Admin API down, non-JSON error response) will surface as Next.js's default unstyled error page, not a branded error UI.
- Server actions (`actions/*.tsx`) mostly call `res.json()` unconditionally without checking `res.ok` — only `get-store.tsx` checks `res.ok` and throws a descriptive error; every other action will silently attempt to parse an error page/body as JSON and either throw a JSON-parse error or return malformed data to the page.
- Client-side error handling is a bit better on the COD path (`try/catch` around `axios.post`, toasts a message from `error.response.data` if it's a string) but the Stripe `onCheckout` call has **no error handling at all** — a failed `/checkout` POST will throw an unhandled promise rejection with no user feedback.
- `get-store.tsx` contains leftover debug `console.log` statements logging the constructed URL — should be considered noise/cleanup candidate, not a functional issue.

# SEO / Metadata

- Only a single, static `metadata` export exists, in the root `app/layout.tsx`:
  ```ts
  export const metadata = { title: "Store", description: "Store - The place for all your purchases." };
  ```
- **No per-page metadata** — category and product pages do not export `generateMetadata`, so every route shares the same generic `<title>`/description regardless of which product or category is being viewed. No Open Graph tags, no canonical URLs, no structured data (Product schema, etc.), no `sitemap.xml`/`robots.txt` generation.
- No favicon customization beyond the default `app/favicon.ico`.

# Development Workflow

**Installation**
```
npm i
```

**Required environment variables** (create `.env.local`, not committed):
```
NEXT_PUBLIC_API_URL=            # store-scoped Admin API base, e.g. https://admin-host/api/{storeId}
NEXT_PUBLIC_API_BASE_URL=       # unscoped Admin API base, e.g. https://admin-host/api
NEXT_PUBLIC_STORE_ID=           # this store's ID in the Admin CMS
NEXT_PUBLIC_WHATSAPP_NUMBER=    # international format, digits only, no leading +
```

**Dev server**
```
npm run dev        # next dev
```

**Build / start**
```
npm run build       # next build
npm run start        # next start
```

**Lint**
```
npm run lint         # next lint (eslint-config-next / core-web-vitals)
```
There is no `typecheck` script; `tsc --noEmit` would need to be run manually (`tsconfig.json` has `"noEmit": true`, `"strict": true`). There are no automated tests (no test runner/dependency present).

**Required external services to run this app locally/in full:**
- The companion **Admin/CMS application** must be running and reachable at the configured `NEXT_PUBLIC_API_URL` / `NEXT_PUBLIC_API_BASE_URL`, seeded with at least one Store, Category, Billboard, and Product, for any page beyond a bare shell to render meaningfully.
- **Stripe** (configured Admin-side) for the "Proceed to Payment" path to function — this repo holds no Stripe keys itself.
- **Cloudinary** (or whichever host serves `imageUrl`/`url` fields returned by the Admin API) must be reachable for product/billboard/logo images to load, and its domain must stay listed in `next.config.js`'s `images.domains`.

# Important Files

| File | Responsibility | Why It Matters |
|---|---|---|
| `hooks/use-cart.tsx` | Cart state, persistence, add/remove logic | The entire cart model (no quantities, dedupe-by-id) lives here — misunderstanding this file leads to wrong assumptions about "quantity" support |
| `app/(routes)/cart/components/summary.tsx` | Both checkout paths (Stripe + COD), success/cancel handling | The one file where payment, order creation, and cart-clearing all meet |
| `actions/get-store.tsx` | Store branding fetch; the odd-one-out env var usage | Key to the store-resolution inconsistency documented above |
| `types.ts` | `Product`, `Order*`, `Store` shapes | Defines the entire data contract with the Admin API; no runtime validation exists elsewhere, so this file *is* the contract |
| `next.config.js` | Allowed remote image domains | Silently breaks image rendering if the Admin/image host changes and isn't added here |
| `app/(routes)/category/[categoryId]/components/filter.tsx` | URL-query-string-driven filtering | Explains why filtering triggers full navigations, not client state |
| `app/(routes)/cart/components/cod-details-form.tsx` | COD payload construction, hard-coded `country: "PK"` | Confirms single-country deployment assumption baked into checkout |
| `app/layout.tsx` | Global providers, WhatsApp button, static metadata | Root composition point for every page |
| `actions/get-products.tsx` | Query-string-based product filtering against Admin API | The shared read path for home/category/related-products |
| `.env` (not committed; see README + this doc's Environment Variables section) | Store identity + Admin API location | Nothing renders correctly without these being set correctly |

# Technical Debt / Risks

**Confirmed issues (observed directly in code):**
- **Two different Admin-API base env vars** (`NEXT_PUBLIC_API_URL` or store-scoped calls vs. `NEXT_PUBLIC_API_BASE_URL` for `get-store.tsx`) — easy to misconfigure; if only one is set, either every catalog fetch breaks or the navbar's store branding silently falls back to defaults.
- **No `res.ok` checks** in `get-billboard`, `get-categories`, `get-category`, `get-colors`, `get-sizes`, `get-product`, `get-products` — Admin API errors surface as confusing JSON-parse exceptions or malformed data instead of clear errors.
- **No `error.tsx` boundaries anywhere** — any of the above failures produce Next's default error page, not a branded fallback.
- **No error handling on the Stripe checkout POST** (`onCheckout` in `summary.tsx`) — a failed request throws unhandled, with no user feedback (contrast with the COD path, which does have try/catch + toast).
- **No order confirmation for the Stripe path** — after redirect back with `?success=1`, only a toast fires; no order/receipt is fetched or shown, unlike the COD flow's `OrderSuccessCard`.
- **Dead code**: `constants.ts` (entirely unused Tailwind-UI demo placeholder data), `app/(routes)/cart/components/cart-item-info.tsx` (unused alternate cart-line component), unused dependencies `date-fns`, `react-spinners`, `@tailwindcss/aspect-ratio`, and unused static assets in `public/` (`bag.png`, `coat.png`, `scarf.png`, `image.png`, `user.png`, `billboard-bg*.png`, `bg.svg`, `next.svg`, `vercel.svg`).
- **Debug `console.log` statements** left in `actions/get-store.tsx`.
- **Stale README**: still describes the Admin tutorial's full feature set (Clerk, multi-vendor, Stripe webhooks) as if it were this repo's own README; its `.env` example has a duplicated `NEXT_PUBLIC_WHATSAPP_NUMBER` line and is missing `NEXT_PUBLIC_API_BASE_URL`.
- **No `.env.example`** committed — onboarding relies entirely on the (partially incorrect) README.
- **No metadata per route** — every page shares one generic `<title>`; no SEO benefit from product/category content, no Open Graph/structured data, which matters for a customer-facing storefront's discoverability.
- **Dependency versions are all pinned to 2023-era releases** (Next 13.4.4, React 18.2.0) — the user has explicitly asked not to upgrade anything as part of this audit, but it's worth knowing the stack is roughly two major Next.js versions behind current.

**Potential concerns (inferred, not directly confirmed without the Admin repo):**
- All Admin API calls appear to be **unauthenticated** from this side — if the Admin API's public read endpoints aren't properly scoped/rate-limited, this is an Admin-repo-side concern, not fixable here, but worth flagging since this storefront has no way to attach credentials even if the Admin API required them.
- Because the cart stores full `Product` objects (including `price`) rather than just IDs, and price is only re-validated server-side at `/checkout`/`/cod` time (assumed, not verifiable here) — if the Admin backend trusts the client-submitted price rather than re-pricing from `productIds` server-side, this would be a price-tampering risk. This repo only sends `productIds` (not prices) to both `/checkout` and `/cod`, which is the correct mitigation *if* the Admin backend re-fetches authoritative prices by ID — this should be verified in the Admin repo.
- The `getBillboard(NEXT_PUBLIC_STORE_ID)` call on the home page assumes the Admin API's billboard-by-id endpoint accepts a Store ID interchangeably with a Billboard ID; this should be confirmed against the Admin repo's route implementation rather than assumed from this side.

# What I Should Re-Learn First

Recommended reading order to rebuild full context fastest:

1. **`types.ts`** — the entire data contract in one file; everything else makes sense once this is internalized.
2. **`hooks/use-cart.tsx`** — the cart model (no quantities, dedupe-by-product-id, localStorage persistence).
3. **`actions/*.tsx`** (all eight files, they're short) — how every page gets its data, and the store-resolution env var split.
4. **`app/(routes)/page.tsx` → `components/navbar.tsx`** — trace one full server-rendered page to see the RSC → action → component data flow end to end.
5. **`app/(routes)/category/[categoryId]/page.tsx` + `filter.tsx`** — the URL-query-string filtering pattern.
6. **`app/(routes)/cart/components/summary.tsx`** — both payment paths; this is the most business-critical file in the repo.
7. **`app/(routes)/cart/components/cod-details-form.tsx` + `order-success-card.tsx`** — the custom COD flow that was added on top of the original tutorial.
8. **`next.config.js` + `README.md`** — deployment assumptions (image domains, expected env vars), keeping in mind the README is partially stale.
9. Skim **`components/ui/*`** and **`components/gallery/*`** last — pure presentation, low-risk to re-learn on demand.

# Mental Model

```
Browser (customer)
   │  clicks, forms, localStorage cart
   ▼
Storefront (this repo — Next.js 13 App Router)
   │  Server Components: fetch() reads (categories, products, billboards, store)
   │  Client Components: axios POST (checkout, COD) + Zustand cart/modal state
   ▼
Admin API (separate repo — Next.js API routes, store-scoped)
   │  owns: auth (Clerk), CRUD for stores/categories/products/sizes/colors/billboards/orders
   │  creates Stripe Checkout Sessions; handles Stripe webhooks; creates COD orders directly
   ▼
Database (Prisma + MySQL/PlanetScale, per the original tutorial — not visible from this repo)
   │  persists stores, catalog data, orders

Stripe (external, only reachable from the Admin API and via browser redirect)
   │  hosts the actual payment page; redirects the browser back to this storefront's /cart
```

- **This repo's exact responsibility**: render the catalog, hold cart state client-side, and hand off both payment methods (redirect-to-Stripe or direct-POST-for-COD) to the Admin API — it performs **no persistence, no payment processing, and no authentication** of its own.
- **The Admin repo's responsibility** (inferred, not present here): everything stateful — the actual database, all mutation logic, Stripe session/webhook handling, and multi-store administration.
- **Stripe's responsibility**: hosting the payment page itself and reporting back to the Admin app via webhook (order confirmation happens Admin-side, independent of whether the customer's browser ever successfully returns to `/cart`).

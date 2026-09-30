# AGENTS.md — Storefront Repository

## Role of This Repository

This repository is the customer-facing Storefront. It renders catalog data, holds cart state in the browser, and sends checkout/order requests to the separate Admin/CMS/API application.

It does not own the database, Admin authentication, Stripe SDK, or order persistence.

Before making changes, read:

1. `docs/PROJECT_BRIEF.md`
2. this `AGENTS.md`
3. relevant source files for the requested task

If documentation conflicts with source code, source code wins. The README contains stale tutorial material.

## Current Stack

- Next.js 13.4.4 App Router
- React 18.2
- TypeScript 5.1.3
- Tailwind CSS 3.3.2
- Zustand 4.3.8 + `persist`
- native `fetch` for server reads
- axios for client checkout/COD posts
- Headless UI
- react-hot-toast

## Architecture

- Home/category/product routes are primarily async Server Components.
- Interactivity lives in Client Components.
- Server reads are small `actions/get-*.tsx` fetch wrappers around the Admin API.
- Cart and preview-modal state use Zustand.
- Cart persists to localStorage under `cart-storage`.
- There are no local API route handlers and no local database.

## Store Resolution

One Storefront deployment maps to one Admin Store using:

- `NEXT_PUBLIC_STORE_ID`
- `NEXT_PUBLIC_API_URL` — store-scoped base such as `.../api/{storeId}`
- `NEXT_PUBLIC_API_BASE_URL` — unscoped Admin API root used by Store branding lookup

Do not change or consolidate these environment variables as unrelated cleanup.

## Cart Rules

Current cart shape is `items: { product: Product; quantity: number }[]` (see `hooks/use-cart.tsx`).

- Product ID is cart-line identity; adding an existing product increments its line instead of duplicating it.
- quantity is a first-class concept and is clamped to `product.quantity` (available stock) on add/increment.
- products with `quantity <= 0` cannot be added (out-of-stock is blocked client-side).
- different fixed size/color Product rows are separate cart lines (see Product Model).
- total is derived from `price * quantity` per line.
- checkout sends `{ productId, quantity }` pairs, never a price.

Quantity/stock enforcement here is UX-level only. Admin remains the authoritative source for stock correctness — do not invent client-side stock reservation semantics.

Do not reintroduce a bare `Product[]` cart shape or remove quantity support.

## Product Model

A Product already represents one fixed size + one fixed color combination, plus its own `quantity` (stock). The Storefront does not provide a runtime variant matrix selector — there is no parent-product + variants model. Different size/color combinations are separate Product records.

Before implementing variant-related features, inspect the Admin data model and API as well. Do not assume a Shopify-style variant matrix unless the backend is deliberately changed first.

## Categories

`Category` supports `parentId` (see `types.ts`), and the Storefront already consumes parent/child category structure for navigation (`includeChildCategories` on `get-products`). Do not assume deeper taxonomy behavior than this.

## Admin API Contract

The Storefront consumes Admin routes for:

- Store branding
- categories
- category detail
- billboards
- products / product detail
- sizes
- colors
- COD creation (the sole checkout flow)

If a feature requires a field the current API does not provide, do not fabricate it client-side. Identify the required Admin change.

A legacy `"STRIPE"` value remains in the `OrderResponse.paymentMethod` type union (`types.ts`) for compatibility with Admin's response shape. It is an inert, type-level leftover, not an active Storefront capability — do not resurrect a Stripe checkout flow, and do not remove the type as unrelated cleanup.

## Checkout Flows

### Checkout / COD

**Update (Task 8):** `/checkout` and `/order-confirmation` now exist as real routes. `/checkout` is Storvia's own internal COD checkout page — it is NOT a restored Stripe/card integration; Stripe remains fully removed/inactive (the inert `"STRIPE"` type value noted above is unrelated to this route and was not touched).

- Cart's "Continue to Checkout" button navigates to `/checkout` (no submission happens on Cart itself)
- `/checkout` collects customer/shipping information via `CODDetailsForm` (`app/(routes)/cart/components/cod-details-form.tsx`, now rendered full-page instead of inside a `Modal`)
- POST to `/cod` (payload shape unchanged: `{ items: {productId, quantity}[], paymentMethod: "COD", customer?, shipping? }`, never a price)
- On success: the returned `OrderResponse` is written to `sessionStorage` under the key `storvia-last-order-confirmation` (see `lib/order-confirmation.ts`), the cart is cleared, and the browser navigates (`router.replace`) to `/order-confirmation`
- `/order-confirmation` reads that sessionStorage value client-side and renders it via `OrderSuccessCard` — **no Admin lookup request exists or is made here**. This is explicitly NOT order history: no localStorage, no persisted array/list, a later order simply overwrites the same key. If nothing is stored (direct visit, expired session), it shows a graceful "no recent order confirmation" message rather than fabricating an order.

Country is currently hard-coded to `PK` for COD; the Storefront does not render a country selector (fixed "Pakistan" display text only where the address is shown).

## Current Storefront Limitations

Document these; do not silently implement them as part of unrelated work:

- no customer authentication — guest checkout only
- no customer order-history/account/status page
- no post-submission polling or status lookup after a COD order is placed
- no product size/color variant matrix (see Product Model)
- browser-known stock can go stale before submission; Admin performs the authoritative validation

## Important Cross-Repo Facts

The current Admin database is PostgreSQL, even though old tutorial documentation mentions MySQL/PlanetScale.

Correction (verified against source): the home page no longer calls `getBillboard(NEXT_PUBLIC_STORE_ID)` / `/billboards/{id}`. It now calls `getHomepageBillboard()` (`actions/get-homepage-billboard.tsx`), which hits `{NEXT_PUBLIC_API_URL}/homepage-billboard` with no id param. `actions/get-billboard.tsx` (the old `/billboards/{id}` call described below) is currently unused by any page in this repo — do not remove it as unrelated cleanup, and do not assume it is still live without checking call sites first. The previously-documented Admin bug (`billboardId` path param misused as a `storeId` query) described the old call path; whether it still applies to the current `/homepage-billboard` endpoint has not been re-verified here — Requires Admin verification.

## Known Current Issues

Do not silently fix these during unrelated work:

- split API base environment variables
- no runtime validation of Admin API responses
- generic metadata only
- dead tutorial assets/dependencies/debug logs remain

Resolved by Task 9 (Shared States + Hardening): all 9 `actions/*.tsx` fetch helpers now check `res.ok` and throw a normalized `Error` on failure (previously 7 of 9 silently mis-returned or crashed on JSON parse); `app/error.tsx`, `app/global-error.tsx` (root-layout-level, since `Navbar` fetches above any other boundary) and `app/not-found.tsx` now exist. `getProduct`/`getCategory` return `T | null` and the Product Detail / Category pages call `notFound()` on a genuine miss — verified directly against Admin's `GET /products/{id}` and `GET /categories/{id}` routes, both of which return HTTP 200 with a `null` body for an unknown id (not a 404 status), so this is a safe, source-confirmed mapping, not an inference.

## UI / Data Change Discipline

For every task:

1. Trace current page/component -> action/API -> Admin route when relevant.
2. Preserve existing visual/component patterns unless redesign is requested.
3. Avoid dependency upgrades and framework migrations.
4. Do not add a local backend to solve something that belongs in Admin.
5. Do not duplicate authoritative pricing/business logic in the browser.
6. If an API contract changes, specify both repo changes.
7. Keep current localStorage hydration safeguards when touching Zustand-persisted state.

## Testing Expectations

Use repository-local lint/type/build validation where appropriate.

Do not install browser binaries or launch automated authenticated/manual flows simply to test the UI. When browser verification is required, provide exact manual steps for the user.

## Implementation Reports

After a coding task, report:

- what changed
- files changed
- Admin API dependency/impact
- environment changes, if any
- validation performed
- manual browser steps still required
- pre-existing issues encountered but left unchanged

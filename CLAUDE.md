# CLAUDE.md — Storefront Repository

Read `docs/PROJECT_BRIEF.md` first. The source code is authoritative; the README still contains stale tutorial assumptions.

## Repository Identity

This is the customer-facing Next.js 13.4.4 Storefront. It is an API-consuming frontend, not the system of record.

The separate Admin repository owns:

- PostgreSQL/Prisma persistence
- Clerk admin auth
- catalog mutations
- order creation
    - Cash-on-delivery order creation

## Working Rules

- Inspect before editing.
- Do not upgrade dependencies or modernize App Router patterns unless explicitly requested.
- Avoid unrelated cleanup/refactors.
- Do not invent fields or APIs that the Admin does not expose.
- For Product/Order/checkout changes, consider both repos.
- Preserve localStorage hydration safeguards around persisted Zustand state.

## Store Configuration

Storefront deployment identity is controlled by:

- `NEXT_PUBLIC_STORE_ID`
- `NEXT_PUBLIC_API_URL` (store-scoped)
- `NEXT_PUBLIC_API_BASE_URL` (unscoped branding lookup)

Do not consolidate them unless that is the task.

## Cart Model

The cart persists `{ product: Product; quantity: number }[]` in Zustand/localStorage (`hooks/use-cart.tsx`), not a bare Product array.

- one line per Product ID; adding an existing product increments its line
- quantity is first-class and clamped to `product.quantity` (available stock)
- out-of-stock products (`quantity <= 0`) cannot be added
- a Product is already one fixed size/color combination — no variant matrix
- checkout sends `{ productId, quantity }`, never a price

Stock enforcement here is UX-level only; Admin remains authoritative. Do not reintroduce a bare `Product[]` cart shape or remove quantity support.

## Categories

`Category` supports `parentId`; the Storefront already consumes parent/child category navigation (`includeChildCategories` on `get-products`). Do not assume deeper taxonomy than this.

## Checkout

Checkout: customer/shipping form -> `/cod` -> returned order summary -> `OrderSuccessCard`. COD is the only active checkout flow.

Checkout sends `{ productId, quantity }` line items; authoritative prices/stock must remain server-side in Admin. A legacy `"STRIPE"` value remains in `OrderResponse.paymentMethod`'s type union for compatibility with Admin's response shape only — it is inert, not an active capability, and should not be resurrected or removed as unrelated cleanup.

## Current Storefront Limitations

- no customer authentication — guest checkout only
- no customer order-history/account/status page
- no post-submission polling/status lookup after a COD order is placed
- no product variant matrix
- browser-known stock can go stale before submission; Admin validates authoritatively

## Cross-Repo Billboard Caveat

Correction (verified against source): the home page no longer calls `getBillboard(NEXT_PUBLIC_STORE_ID)`. It calls `getHomepageBillboard()` (`actions/get-homepage-billboard.tsx`), which hits `{NEXT_PUBLIC_API_URL}/homepage-billboard` with no id param. `actions/get-billboard.tsx` (the old `/billboards/{id}` call) is currently unused by any page in this repo — do not remove it as unrelated cleanup. The previously-documented Admin `billboardId`-as-`storeId` bug described that old call path; whether it still applies to `/homepage-billboard` has not been re-verified here — Requires Admin verification.

## Known Existing Issues

Do not silently repair during unrelated tasks:

- split API URL env vars
- missing `res.ok` checks in most fetch helpers
- no `error.tsx` boundaries
- generic SEO metadata
- stale/dead tutorial code and assets

## Validation

Use relevant existing lint/build/type checks.

Do not install browser binaries or attempt authenticated/manual automation. When UI verification is required, provide the user with a short, exact manual test checklist.

## After Changes

Summarize files changed, behavior, Admin API impact, environment impact, validation, and remaining manual tests.

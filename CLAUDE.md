# CLAUDE.md — Storefront Repository

Read `docs/PROJECT_BRIEF.md` first. The source code is authoritative; the README still contains stale tutorial assumptions.

## Repository Identity

This is the customer-facing Next.js 13.4.4 Storefront. It is an API-consuming frontend, not the system of record.

The separate Admin repository owns:

- PostgreSQL/Prisma persistence
- Clerk admin auth
- catalog mutations
- order creation
- Stripe Checkout/session creation
- Stripe webhook processing

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

The cart persists full Product objects in Zustand/localStorage.

- one line per Product ID
- no quantities
- duplicate adds blocked
- a Product is already one fixed size/color combination

Do not assume a variant or quantity model exists.

## Checkout

Stripe: `/checkout` -> redirect to Stripe -> return `/cart?success=1|canceled=1`.

COD: customer/shipping form -> `/cod` -> returned order summary -> `OrderSuccessCard`.

Checkout sends product IDs; authoritative prices must remain server-side in Admin.

## Cross-Repo Billboard Caveat

The home page currently calls `getBillboard(NEXT_PUBLIC_STORE_ID)`. The Admin route is known to misuse the `billboardId` parameter as a Store ID, so this behavior is bug-dependent. Do not change only one side without understanding the other.

## Known Existing Issues

Do not silently repair during unrelated tasks:

- split API URL env vars
- missing `res.ok` checks in most fetch helpers
- no `error.tsx` boundaries
- weak Stripe POST error handling
- no Stripe order confirmation UI
- no cart quantities
- generic SEO metadata
- stale/dead tutorial code and assets

## Validation

Use relevant existing lint/build/type checks.

Do not install browser binaries or attempt authenticated/manual automation. When UI verification is required, provide the user with a short, exact manual test checklist.

## After Changes

Summarize files changed, behavior, Admin API impact, environment impact, validation, and remaining manual tests.

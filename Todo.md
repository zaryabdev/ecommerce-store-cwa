# Storvia Storefront — Roadmap

Owned by this repo: public customer-facing rendering, mobile-first UX, navigation, homepage, category/product listing, product detail, cart, COD checkout, and shared loading/empty/error states.

Architecture constraints that apply to every phase below:

- One Storefront deployment = one Store. No database/Prisma/customer auth here; Admin is the authoritative backend and this repo is a pure public API consumer.
- COD is currently the only active checkout flow. Online/card payment returns later as a proper Admin-backed capability (see Admin `Todo.md`), not during this redesign.
- `Product.quantity` already exists and the cart already uses `{ product, quantity }` items with stock clamping — do not reintroduce a no-quantity/bare-array cart model.
- Product is a concrete sellable row with one fixed size/color; there is no variant matrix. Do not build one.
- Category hierarchy already supports `parentId`; extend/use it rather than introducing a parallel classification system.
- Only one theme exists (**Default**). Do not build a theme engine, theme switching, or dark mode in Phase 1.

---

## Phase 1 — Storefront Foundation (current priority)

- [ ] Audit current Storefront UI/UX source (components, pages, styles) before starting redesign work
- [ ] Establish the Default theme's visual/design foundation (typography, color tokens, spacing scale)
- [ ] Build the mobile-first responsive layout system (base breakpoints, containers, grid)
- [x] Redesign mobile header/navigation around the existing category hierarchy (including parent/child categories)
- [x] Redesign homepage (billboard, featured products, category entry points) mobile-first
      [x] Redesign category/product-listing experience - mobile-first filters - listing grid - loading/empty states

[ ] Add product-list pagination/infinite-loading strategy when catalog scale requires it

- [x] Redesign product-detail experience (gallery, info panel, add-to-cart with stock-aware quantity controls)
- [x] Redesign cart experience (line items, quantity controls, stock clamping feedback, totals)
- [x] Redesign COD checkout experience (customer/shipping form, order submission, `OrderSuccessCard`)
- [x] Build shared loading/empty/error states reused across routes
- [ ] Accessibility pass (keyboard nav, focus states, color contrast, screen-reader labeling)
- [ ] Performance pass (image sizing/lazy-loading, bundle size, Core Web Vitals on mobile)
- [ ] Adapt the mobile-first system up to tablet/desktop breakpoints after the mobile experience is solid
- [ ] Final first-client Storefront presentation QA pass

_Note: theme-active display and per-Store branding management for Phase 1 are Admin-owned — see Admin `Todo.md`._

---

## Phase 2 — Homepage Content Management (planned)

Rendering/integration work for the merchant-managed homepage content defined in Admin (see Admin `Todo.md`):

- [ ] Render the Admin-managed homepage carousel (slide image, heading, optional supporting text, CTA)
- [ ] Render homepage "New Arrivals" — initially derive from recent active products rather than a new merchant-maintained flag
- [ ] Render homepage "Featured Products" using the existing `Product.isFeatured` field
- [ ] Render homepage "Shop by Category" using the existing category hierarchy
- [ ] Render promotional/banner content positions defined by Admin's homepage merchandising configuration

_Note: Storvia controls page structure in this phase — no drag-and-drop/page-builder rendering._

---

## Phase 3 — Commerce / Marketing Enhancements (future commerce)

Do not implement now; these require the authoritative backend work tracked in Admin `Todo.md` first.

- [ ] Render true original-price / sale-price display once Admin ships authoritative sale pricing (no Storefront-only fake sale display)
- [ ] Render discount-adjusted pricing once Admin ships discount semantics
- [ ] Coupon code entry at checkout, once Admin ships authoritative server-side coupon validation/calculation
- [ ] Support an Online Payment Gateway / Card Payments option alongside COD at checkout, once Admin ships the backend payment capability (COD remains available)

---

## Phase 4 — Platform Customization (future)

- [ ] Support additional Storefront themes once more than one theme exists in Admin
- [ ] Consume theme-selection persistence once Admin ships it
- [ ] Support richer appearance customization surfaced by Admin (typography/color options within controlled bounds)
- [ ] Support homepage section ordering once Admin exposes section configuration
- [ ] Investigation: future category-depth/navigation requirements beyond the existing `parentId` hierarchy, only if a real need arises
- [ ] Low-priority: render an optional controlled Store/page background image if Admin adds it to appearance configuration — checkout must keep a controlled neutral appearance regardless

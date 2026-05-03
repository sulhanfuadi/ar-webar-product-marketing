# Release Checklist (V2 Multi-Product)

## Functional gate
- `npm run build` passes.
- `npm run smoke:test` passes.
- `/` shows minimal intro with single dominant CTA.
- `/scan` opens full-screen AR interface with visible runtime state.
- `/after-scan` shows clean conversion handoff CTA.
- `/scan?product=<valid-id>` loads matching product copy + target.
- `/scan?product=<invalid-id>` falls back to default product with non-blocking notice.
- Product context persists across flow:
  - `/?product=<id>`
  - `/scan?product=<id>`
  - `/after-scan?product=<id>`

## Product coverage gate
- Product routes verified:
  - `/scan?product=apple-iphone`
  - `/scan?product=apple-macbook`
  - `/scan?product=apple-airpods`
  - `/scan?product=apple-ipad`
  - `/scan?product=apple-watch`
- Product configs stored in `src/content/products/` with registry update in `src/content/products/index.ts`.
- Product marker assets are present in `public/assets/markers/products/<product-id>/`.

## Mobile quality gate (strict)
- Passes on latest Chrome Android.
- Passes on latest Safari iPhone.
- No overlap, hidden-view leakage, or collapsed layout on narrow screens.
- Runtime transitions observable: requesting_camera → searching → found/lost/error.

## Deploy gate
- Vercel preview URL available for QA (HTTPS).
- SPA route rewrites work for `/scan` and `/after-scan`.
- Known limitations communicated in `docs/known-limitations.md`.

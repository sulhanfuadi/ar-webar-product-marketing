# Release Checklist (Single-Marker MVP)

## Functional gate
- `npm run marker:generate` passes.
- `npm run build` passes.
- `npm run smoke:test` passes.
- `/` shows bilingual intro + scan CTA.
- `/scan` opens full-screen AR camera flow.
- `/after-scan` shows action hub (`Detail`, `Contact`, `Buy`).
- `/after-scan` shows dummy media tabs (`2D`, `3D`).

## Marker gate
- Marker reference exists at `public/assets/markers/mvp/macbook-air/reference.png`.
- Marker target exists at `public/assets/markers/mvp/macbook-air/target.mind`.
- Tracking lock is validated using the same poster image as marker source.

## Mobile quality gate (strict)
- Passes on latest Chrome Android.
- Passes on latest Safari iPhone.
- No clipped controls around notch/safe area.
- Runtime transitions visible: requesting_camera → searching → found/lost/error.

## Deploy gate
- Vercel preview URL available over HTTPS.
- SPA rewrites work for `/scan` and `/after-scan`.
- Known limits are communicated in `docs/known-limitations.md`.

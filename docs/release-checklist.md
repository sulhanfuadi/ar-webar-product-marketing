# Release Checklist (Scan-First Single-Marker MVP)

## Functional gate
- `npm run marker:generate` passes.
- `npm run build` passes.
- `npm run smoke:test` passes.
- `/` redirects to `/scan`.
- `/scan` opens full-screen AR camera flow.
- `3D Detail` appears only when marker is locked.
- Bottom action bar appears on marker lock with `Contact`, `Buy`, `Specification`.
- `Specification` opens in-app modal and closes without leaving scan flow.
- `3D Detail` popup opens and model supports rotate + pinch zoom.
- `Reset View` restores stable default framing.
- Popup close returns cleanly to scan flow.
- When GLB load fails, UI shows explicit model-load error and `Retry Scan`.

## Marker gate
- Marker reference exists at `public/assets/markers/mvp/macbook-air/reference.png`.
- Marker target exists at `public/assets/markers/mvp/macbook-air/target.mind`.
- Tracking lock is validated against the same marker source image.

## Mobile quality gate (strict)
- Passes on latest Chrome Android.
- Passes on latest Safari iPhone.
- No clipped controls around notch/safe area.
- 3D detail modal remains readable on `360x780`, `390x844`, `412x915`.
- Runtime transitions visible: requesting_camera → searching → found/lost/error.

## Deploy gate
- HTTPS preview URL is available for mobile QA.
- SPA rewrites work for `/scan`.
- Known limitations are communicated in `docs/known-limitations.md`.
- Production domain is `https://ar-webar-product-marketing.vercel.app`.
- Production returns `200` for:
  - `/assets/models/apple-macbook/model.glb`
  - `/assets/markers/mvp/macbook-air/target.mind`

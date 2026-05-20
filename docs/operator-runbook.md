# Operator Runbook (Scan-First Product MVP)

## Pre-demo setup
- Use an HTTPS URL (Vercel preview or active tunnel).
- Open demo on a modern mobile browser.
- Prepare this marker image:
  - `public/assets/markers/mvp/macbook-air/reference.png`
- Ensure marker target exists:
  - `public/assets/markers/mvp/macbook-air/target.mind`

## Marker regeneration
If source poster changes, regenerate target:

```bash
npm run marker:generate
```

Script source priority:
1. `MVP_MARKER_SOURCE` env path (if provided)
2. `../resources/products/macbook-air-poster.png`
3. existing `public/assets/markers/mvp/macbook-air/reference.png`

## Live demo flow
1. Open `/` (auto redirects to `/scan`).
2. Grant camera permission.
3. Point camera at the same marker image until lock is detected.
4. Show that `View Details` appears only after marker lock.
5. Tap `View Details` and rotate the model by dragging.
6. Close popup and continue scan tracking.

## Troubleshooting
- Camera denied: re-enable camera permission in site settings.
- Marker not locking: reduce glare, keep full marker visible, stabilize device.
- Lost tracking: re-center marker and hold still briefly.
- Desktop opened by mistake: switch to mobile for real scan validation.

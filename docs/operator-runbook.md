# Operator Runbook (Single-Marker MacBook Air MVP)

## Pre-demo setup
- Use HTTPS URL (Vercel preview recommended).
- Open demo on modern mobile browser.
- Prepare this exact marker image:
  - `public/assets/markers/mvp/macbook-air/reference.png`
- Ensure marker target exists:
  - `public/assets/markers/mvp/macbook-air/target.mind`

## Marker regeneration
If poster source changes, regenerate target:

```bash
npm run marker:generate
```

Script source priority:
1. `MVP_MARKER_SOURCE` env path (if provided)
2. `../resources/products/macbook-air-poster.png`
3. existing `public/assets/markers/mvp/macbook-air/reference.png`

## Live demo flow
1. Open `/` and explain single-marker MVP context.
2. Tap `Start AR Scan / Mulai Scan AR`.
3. Grant camera permission.
4. Point camera to the same MacBook Air poster until marker lock.
5. Tap `Continue / Lanjut` to open action hub.
6. Demonstrate CTA links:
   - Detail (Apple product page)
   - Contact (WhatsApp)
   - Buy (Apple buy page)
7. Toggle dummy tabs `2D` and `3D`.

## Troubleshooting
- Camera denied: re-enable camera permission in site settings.
- Marker not locking: reduce glare, keep full poster visible, stabilize hands.
- Lost tracking: re-center marker and hold still briefly.
- Desktop opened by mistake: switch to mobile device for real scan.

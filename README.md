# Product Marketing AR WebAR Demo

A focused single-marker WebAR demo for product marketing using React + TypeScript + MindAR.  
Current flow is scan-first and 3D-first: marker lock unlocks detail + conversion actions in one screen.

## Core architecture
- Vite + React + TypeScript
- React Router (`/` redirects to `/scan`)
- Tailwind CSS with refined neutral design tokens
- MindAR + Three.js image-tracking runtime

## Route behavior
- `/` redirects to `/scan`
- `/scan` is the primary and only user-facing flow
- no after-scan page UX

## Single marker contract (source of truth)
- Marker reference image:
  - `public/assets/markers/mvp/macbook-air/reference.png`
- Marker target file:
  - `public/assets/markers/mvp/macbook-air/target.mind`
- Live marker URL for testers:
  - `https://ar-webar-product-marketing.vercel.app/assets/markers/mvp/macbook-air/reference.png`
- Regenerate marker target:

```bash
npm run marker:generate
```

`markers:generate` remains as a backward-compatible alias.

## Testing poster (required)
- Current AR flow is validated against this exact poster:
  - `public/assets/markers/mvp/macbook-air/reference.png`
- Use that image for QA/demo (print or show on secondary screen).
- Keep full poster visible in camera frame for stable marker lock.

## Android testing screenshots
- Local files:
  - `public/assets/testing/android/android-scanned-marker.png`
  - `public/assets/testing/android/android-3d-detail.png`
  - `public/assets/testing/android/android-spesification.png`
- Production URLs:
  - `https://ar-webar-product-marketing.vercel.app/assets/testing/android/android-scanned-marker.png`
  - `https://ar-webar-product-marketing.vercel.app/assets/testing/android/android-3d-detail.png`
  - `https://ar-webar-product-marketing.vercel.app/assets/testing/android/android-spesification.png`

## In-scan controls (current UX)
- Header controls:
  - `Restart` (always visible)
  - `Loading 3D…` badge during model loading while marker is locked
- Locked-state bottom controls:
  - `3D Detail` button (shown above action bar)
  - Action bar: `Contact`, `Buy`, `Specification`
  - `Specification` opens in-app modal (no tab switch)

## 3D detail viewer behavior
- Fullscreen mobile modal with safe-area padding.
- Interaction: rotate + pinch zoom (pan disabled).
- Utility action: `Reset View`.
- If model fails to load, viewer shows explicit error with `Retry Load`.
- Viewer can remain open even if marker tracking is temporarily lost.

## Specification modal content
- Data source is structured in product config (`specifications`).
- Current dataset is detailed and synced from official MacBook Air buy/spec pages on **May 21, 2026**.
- For latest commercial options (price, stock, promo, financing), use live `Buy` link.

## 3D model runtime
- Active GLB path:
  - `public/assets/models/apple-macbook/model.glb`
- Current default source file:
  - `resources/3d model/macbook_ultra_concept_texture1k.glb`
- If missing/invalid, runtime shows a clear load error and asks user to retry scan.

## Production demo URL
- Primary live demo:
  - `https://ar-webar-product-marketing.vercel.app`
- Do not use stale URLs that are not mapped to this deployment.

## Model attribution
- Source:
  - `https://skfb.ly/pIFA7`
- Attribution should follow the license metadata on the source page.

## Run locally
```bash
npm install
npm run dev
```

## Build and checks
```bash
npm run marker:generate
npm run build
npm run smoke:test
npm run preview
```

## QA policy
- Desktop is preview-only.
- Final sign-off requires:
  - Chrome Android (latest)
  - Safari iPhone (latest)

## MVP scope
- Included: scan-first marker AR, locked-state `3D Detail`, locked-state business action bar (`Contact`, `Buy`, `Specification`), zoomable 3D detail viewer, and in-app specification modal.
- Excluded: chatbot runtime and CMS/admin tooling.

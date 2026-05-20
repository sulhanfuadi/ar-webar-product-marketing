# Product Scan-First WebAR MVP

A focused single-marker WebAR MVP using React + TypeScript + MindAR.  
This revision is scan-first and 3D-first: marker lock reveals minimal controls with `3D Detail` plus business actions.

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
- Regenerate marker target:

```bash
npm run marker:generate
```

`markers:generate` remains as a backward-compatible alias.

## In-scan controls (minimal)
- Header controls:
  - `3D Detail` (visible only when marker is locked)
  - `Restart` (always visible)
- Bottom action bar (visible only when marker is locked):
  - `Contact`
  - `Buy`
  - `Specification` (opens in-app modal, no tab switch)

## 3D detail viewer behavior
- Fullscreen mobile modal with safe-area padding.
- Interaction: rotate + pinch zoom (pan disabled).
- Utility action: `Reset View`.
- If model fails to load, viewer shows explicit error with `Retry Load`.

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
- Included: scan-first marker AR, locked-state `3D Detail`, locked-state business action bar (`Contact`, `Buy`, `Specification`), zoomable 3D detail viewer, in-app specification modal.
- Excluded: chatbot runtime and CMS/admin tooling.

# Product Scan-First WebAR MVP

A focused single-marker WebAR MVP using React + TypeScript + MindAR.  
This revision is scan-first: all product details and conversion actions live directly inside the scan page.

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

## In-scan conversion surface
When marker is locked, the scan page reveals:
- quick product details panel
- `Details`, `Contact`, `Buy` actions
- `2D` / `3D` dummy preview tabs

Current action links:
- Details → `https://www.apple.com/macbook-air/`
- Contact → WhatsApp link with prefilled message
- Buy → `https://www.apple.com/shop/buy-mac/macbook-air`

## 3D model placement (optional)
- Optional GLB path:
  - `public/assets/models/apple-macbook/model.glb`
- If missing/invalid, runtime safely falls back to default mesh.

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
- Included: scan-first marker AR, runtime states, in-scan conversion panel, dummy 2D/3D tabs.
- Excluded: chatbot runtime and CMS/admin tooling.

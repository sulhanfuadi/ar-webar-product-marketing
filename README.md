# MacBook Air Single-Marker WebAR MVP

A focused AR-first WebAR MVP for academic demo use, built with React + TypeScript + MindAR. This version uses one MacBook Air poster image as the only marker source.

## Core architecture
- Vite + React + TypeScript
- React Router (`/`, `/scan`, `/after-scan`)
- Tailwind CSS
- MindAR + Three.js image-tracking runtime

## Fixed route flow
- `/` intro card (single product)
- `/scan` full-screen AR scan session
- `/after-scan` action hub + dummy 2D/3D tabs

No query-product routing is used in MVP mode.

## Single marker contract (source of truth)
- Marker reference image:
  - `public/assets/markers/mvp/macbook-air/reference.png`
- Marker target file:
  - `public/assets/markers/mvp/macbook-air/target.mind`
- Regenerate marker target:

```bash
npm run marker:generate
```

`markers:generate` remains as backward-compatible alias to the same MVP script.

## Conversion actions (real links)
After scan, app provides three direct actions:
- Detail → `https://www.apple.com/macbook-air/`
- Contact → WhatsApp link with prefilled message
- Buy → `https://www.apple.com/shop/buy-mac/macbook-air`

## 2D/3D dummy mode
- `2D` tab: static information card placeholder
- `3D` tab: placeholder panel describing current 3D integration state
- Real GLB remains optional at:
  - `public/assets/models/apple-macbook/model.glb`
- If GLB is missing or invalid, runtime falls back safely to default mesh.

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
- Included: single-marker scan, runtime states, action hub, dummy 2D/3D panel.
- Excluded: chatbot runtime and CMS/admin tooling.

# Product Scan-First WebAR MVP

A focused single-marker WebAR MVP using React + TypeScript + MindAR.  
This revision is scan-first and 3D-first: marker lock reveals a minimal control surface with `View Details` for model inspection.

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
- `Restart` is always visible in the header.
- `View Details` appears only when marker is locked.
- `View Details` opens a popup 3D viewer where users can drag to rotate the model.

## 3D model runtime
- Active GLB path:
  - `public/assets/models/apple-macbook/model.glb`
- Current default source file:
  - `resources/3d model/macbook_ultra_concept_texture1k.glb`
- If missing/invalid, runtime safely falls back to default mesh.

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
- Included: scan-first marker AR, minimal controls (`Restart` + locked-state `View Details`), popup rotate-only 3D detail viewer.
- Excluded: chatbot runtime and CMS/admin tooling.

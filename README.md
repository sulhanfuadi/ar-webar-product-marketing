# Apple Devices Smart Poster AR Demo

A marker-based static WebAR application for academic and campaign presentations: transforming static Apple device posters into clean, scan-first product demonstrations.

## Final focus
- Apple-inspired light UI (inspired only, no official Apple branding assets)
- Two-step presentation flow: minimal intro → AR scan → post-scan FAQ + offer
- Local-first chatbot support after AR stage
- Static-first deployment for stable demo execution

## Stack
- Vite vanilla
- A-Frame
- AR.js
- Local-first FAQ assistant (remote-ready remains optional)

## Run the project
```bash
npm install
npm run dev
```

## Build and verify
```bash
npm run build
npm run preview
npm run smoke:test
```

## Source of truth
- `src/config/content.js` for flow copy, theme tokens, runtime guidance, and chatbot configuration.
- `src/lib/arScene.js` for the three-view layout and AR scene structure.
- `src/lib/chatbot.js` for local-first FAQ behavior with safe fallback.
- `src/main.js` for view state machine and AR runtime orchestration.

## Demo flow
1. Open the page from a modern mobile browser over HTTPS or localhost.
2. Land on a minimal intro screen and tap `Start AR Scan`.
3. Allow camera access and lock the marker on the poster.
4. Explain feature hotspots while tracking is stable.
5. Continue to post-scan support for concise FAQ and offer CTA.

## Replaceable assets
- `public/assets/poster/poster-preview.svg`
- `public/assets/poster/poster-marker-guide.svg`
- `public/assets/markers/custom-marker-reference.svg`
- `public/assets/markers/custom-marker-placeholder.patt`
- `public/assets/branding/brand-thumb.svg`
- `public/assets/models/phone-demo.glb`

## Chatbot principles
- Primary mode: `local`
- `remote` mode remains an optional extension
- If remote fails, reply must safely fall back to local FAQ

## Minimum manual QA
- Intro view is minimal and shows one dominant CTA.
- AR scan view keeps overlays compact and tappable on narrow mobile.
- Camera and marker runtime states (denied/searching/found/lost) remain consistent.
- Post-scan view contains chatbot and CTA (not intro view).
- Marker/poster assets load without broken paths.

## Deploy
- Recommended target: `Vercel`
- Full scan behavior requires HTTPS in production
- `/api/chatbot` is optional for remote-ready demos

## Handoff documents
- `docs/operator-runbook.md`
- `docs/mobile-qa-matrix.md`
- `docs/known-limitations.md`
- `docs/release-checklist.md`

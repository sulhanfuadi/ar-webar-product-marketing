# Nova X Vision Smart Poster AR

A marker-based static WebAR application for academic presentations: transforming static consumer electronics posters into more engaging product demonstrations through AR hotspots and presentation-supporting FAQs.

## Final focus
- Academic polished demo, not a raw prototype
- Single presentation flow: poster → AR scan → feature hotspots → concise FAQ → CTA
- Local-first chatbot as the primary demo path
- Static-first deployment so presentations remain stable without backend dependency

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
- `src/config/content.js` for branding, narrative, runtime copy, operator guidance, CTA, and chatbot configuration.
- `src/lib/arScene.js` for landing visuals, presentation panel structure, and AR stage layout.
- `src/lib/chatbot.js` for local-first FAQ behavior and safe fallback.
- `src/main.js` for AR runtime state orchestration and UI synchronization.

## Demo flow
1. Open the page in a modern mobile browser via HTTPS or localhost.
2. Tap `Mulai Demonstrasi AR` and allow camera access.
3. Align and hold the custom marker on the poster until the AR product appears.
4. Explain features through hotspots in sequence.
5. Use concise FAQ answers when the audience asks questions.
6. Close with the `Buka Halaman Penawaran` button.

## Replaceable assets
- `public/assets/poster/poster-preview.svg`
- `public/assets/poster/poster-marker-guide.svg`
- `public/assets/markers/custom-marker-reference.svg`
- `public/assets/markers/custom-marker-placeholder.patt`
- `public/assets/branding/brand-thumb.svg`
- `public/assets/models/phone-demo.glb`

## Final chatbot principles
- Primary presentation mode: `local`
- `remote` mode is only an additional technical option
- If remote fails, answers must safely fall back to the local FAQ

## Minimum manual QA
- Layout remains clean on narrow desktop and narrow mobile screens.
- AR overlay does not collide with CTA or guidance components.
- Permission states (denied, searching, found, lost) run consistently.
- Local FAQ answers core questions (price, camera, promo, purchase).
- Poster preview and marker guide load correctly.

## Deploy
- Recommended deployment target: `Vercel`
- Final acceptance still passes on the static-first path
- `/api/chatbot` endpoint is optional for remote-ready demos

## Handoff documents
- `docs/operator-runbook.md`
- `docs/mobile-qa-matrix.md`
- `docs/known-limitations.md`
- `docs/release-checklist.md`

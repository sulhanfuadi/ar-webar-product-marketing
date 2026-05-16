# Mobile QA Matrix (Single-Marker MVP)

## Devices and browsers
- Chrome Android (latest)
- Safari iPhone (latest)

## Mandatory test paths
1. `/`
2. `/scan`
3. `/after-scan`

## Scenario checklist
- Intro CTA opens `/scan` without reload.
- Camera permission prompt appears and can be granted.
- Marker locks when scanning `public/assets/markers/mvp/macbook-air/reference.png`.
- Runtime state changes are visible (`searching`, `found`, `lost`, `error`).
- Continue button opens `/after-scan`.
- `Detail`, `Contact`, `Buy` links open expected targets.
- `2D` and `3D` tabs switch correctly and render panel content.
- Restart returns to `/` and resets session state.

## Fail criteria
- AR viewport not full-screen on mobile.
- Controls overlap/notch clipping.
- Marker lock never occurs under normal lighting.
- Action buttons open wrong links or dead links.

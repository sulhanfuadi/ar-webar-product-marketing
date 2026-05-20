# Mobile QA Matrix (Scan-First Single-Marker MVP)

## Devices and browsers
- Chrome Android (latest)
- Safari iPhone (latest)

## Mandatory test paths
1. `/` (must redirect to `/scan`)
2. `/scan`

## Scenario checklist
- Redirect from `/` to `/scan` works without breaking camera flow.
- Camera permission prompt appears and can be granted.
- Marker locks when scanning `public/assets/markers/mvp/macbook-air/reference.png`.
- Runtime state transitions are visible (`searching`, `found`, `lost`, `error`).
- `View Details` button appears only when marker is locked.
- `View Details` popup loads `public/assets/models/apple-macbook/model.glb`.
- Drag interaction rotates the model (no zoom/pan controls).
- Retry and fallback camera controls work when AR runtime fails.

## Fail criteria
- AR viewport is not full-screen on mobile.
- Controls overlap with notch/safe-area.
- Marker lock never occurs under normal lighting.
- Detail popup fails to load/rotate model after marker lock.

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
- `3D Detail` appears only when marker is locked, aligned at right-side control cluster.
- Bottom action bar appears on marker lock with `Contact`, `Buy`, and `Specification`.
- `Specification` opens as in-app modal and closes without route/tab change.
- `3D Detail` popup loads `public/assets/models/apple-macbook/model.glb`.
- Drag rotates model, pinch zoom works, pan stays disabled.
- `Reset View` returns framing to the default fit.
- Modal layout is full-screen and usable on 3 viewport baselines:
  - `360x780`
  - `390x844`
  - `412x915`
- Retry and fallback camera controls work when AR runtime fails.
- If GLB fails to load, explicit model-load error appears (no dummy mesh fallback).

## Fail criteria
- AR viewport is not full-screen on mobile.
- Controls overlap with notch/safe-area.
- Marker lock never occurs under normal lighting.
- Detail popup fails to load/rotate/zoom model after marker lock.
- Model-load failure still shows misleading placeholder mesh.

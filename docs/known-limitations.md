# Known Limitations (Scan-First Single-Marker MVP)

- Full AR validation requires HTTPS and modern mobile browsers.
- Desktop remains preview-only and is not a tracking benchmark.
- MVP supports one fixed marker/source image only.
- 3D viewer supports rotate + pinch zoom only (pan is intentionally disabled).
- Runtime uses `texture1k` GLB by default to keep mobile loading stable.
- GLB model is required for final demo quality; failed model load is reported as explicit runtime error.
- Chatbot flow is intentionally out of scope for this MVP revision.

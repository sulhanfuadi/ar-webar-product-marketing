# MacBook AR Model Asset Contract

Active runtime model path:

- `public/assets/models/apple-macbook/model.glb`

Notes:
- Recommended format: single self-contained `.glb` with embedded textures.
- Current MVP default source: `resources/3d model/macbook_ultra_concept_texture1k.glb`.
- Source attribution reference: `https://skfb.ly/pIFA7`.
- Runtime fallback is automatic: if `model.glb` fails to load, app keeps dummy mesh.
- Default transform is configured in `src/content/products/appleMacbook.ts` under `arModel`.

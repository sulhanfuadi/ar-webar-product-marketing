# Known Limitations (V2 Multi-Product)

- Full AR validation requires modern mobile browsers and HTTPS.
- Desktop remains preview-only and is not a valid tracking benchmark.
- Multi-product selection uses URL query (`?product=<id>`); there is no in-app product picker yet.
- Product config is code-based registry; there is no CMS/admin panel in v1.
- If source marker images are changed, `target.mind` must be regenerated (`npm run markers:generate`).
- If a product target URL/path is unreachable or invalid, runtime falls back to camera recovery flow.
- Chatbot is intentionally excluded from v1 and planned for v1.1.

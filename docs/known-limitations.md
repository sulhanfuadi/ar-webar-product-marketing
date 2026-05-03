# Known Limitations (V2 Multi-Product)

- Full AR validation requires modern mobile browsers and HTTPS.
- Desktop remains preview-only and is not a valid tracking benchmark.
- Multi-product selection uses URL query (`?product=<id>`); there is no in-app product picker yet.
- Product config is code-based registry; there is no CMS/admin panel in v1.
- Local marker paths are pre-mapped per product, but `target.mind` files must still be provided manually for each product folder.
- If a product target URL/path is unreachable or invalid, runtime falls back to camera recovery flow.
- Chatbot is intentionally excluded from v1 and planned for v1.1.

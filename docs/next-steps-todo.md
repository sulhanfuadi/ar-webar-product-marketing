# Next Steps TODO

## Done
- [x] Replaced per-product marker references with real images from `public/assets/products/source`.
- [x] Recompiled per-product `target.mind` files for:
  - `apple-iphone`
  - `apple-macbook`
  - `apple-airpods`
  - `apple-ipad`
  - `apple-watch`
- [x] Added marker generator script: `npm run markers:generate`.

## Remaining
- [ ] Run strict mobile QA on all product routes:
  - `/scan?product=apple-iphone`
  - `/scan?product=apple-macbook`
  - `/scan?product=apple-airpods`
  - `/scan?product=apple-ipad`
  - `/scan?product=apple-watch`
- [ ] Test with the exact final printed poster output (paper, size, lighting) to validate real-world lock stability.
- [ ] Generate fresh public HTTPS preview URL for final sign-off.

## Regeneration command
If any marker image changes, regenerate all product targets:

```bash
npm run markers:generate
```

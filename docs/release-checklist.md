# Release Checklist

## Presentation-ready
- `npm run build` passes.
- `npm run smoke:test` passes.
- Intro screen is minimal with one dominant `Start AR Scan` CTA.
- AR scan view shows compact status + guidance without overlay collisions.
- Post-scan view contains local-first FAQ support and offer CTA.
- Operator understands `docs/operator-runbook.md`.

## Deploy-ready
- Production origin uses HTTPS.
- Poster/marker/branding assets load without broken paths.
- Known limitations are communicated honestly.
- Static-first path runs without mandatory backend dependency.

# Scaled Cook Card — polish 1 handoff

## Outcome

Repaired all 27 findings from `.factory/review-1.md` on commit `cb0ee6b` (`fix: polish reviewed cook card release`). The product remains a Vite + TypeScript static web app with its warm handwritten-lab-notebook identity.

## What changed

- Fixed assistive-text word boundaries in the landing headline and recipe-file label.
- Made `?demo=1` and `/demo` isolated sample entries with the persistent banner, reset, start-for-real flow, and a home-linking wordmark.
- Registered all public, price, paid-limit, billing, provenance, implementation, and cache claims in `.factory/claims.json`; each has exactly one tagged test.
- Enforced the free tier’s one cook-card/latest-correction limit and verified paid multi-card/full-history behavior.
- Rewrote reviewed copy in plain words, unified terms around `cook card` and `recipe file`, and updated the verb-first catalog line.
- Added `/artwork`, 404 social metadata, matching 404 navigation/footer/build data, and sitemap/static-route support.
- Bumped the service-worker cache to `scaled-cook-card-v6`.

`polish-1.md` maps F-1-1 through F-1-27 to their changes and evidence. Local screenshots are under `.factory/evidence-polish-1/`.

## Verification

Fresh clone: `/tmp/scaled-cook-card-clean.mQL7Ys` cloned from pushed `main`, then `npm ci` (171 packages, 0 vulnerabilities).

- Every exact command in `.factory/claims.json` passed from that clone: 17/17 claims.
- `npm test` — PASS, 15 tests.
- `npm run lint` — PASS.
- `npm run typecheck` — PASS.
- `npm run build` — PASS; `dist/index.html` exists.
- `npm run test:e2e` — PASS in the default build (checkout-only tests correctly skipped).
- `npm run test:checkout-enabled -- --project=chromium` — PASS, 2 tests.
- `VITE_KITCHEN_PASS_CHECKOUT_ENABLED=true npx playwright test --grep @claim:billing-terms --project=chromium` — PASS.
- Axe coverage remains in the Playwright suite for landing, workspace, cook mode, and Privacy; no serious or critical violations.

Default build budget: JavaScript 79.88 kB raw / 26.93 kB gzip; CSS 20.60 kB raw / 5.28 kB gzip; no shipped web fonts.

## Deploy and live check

Pushed `cb0ee6b` to `origin/main` and the handoff commit `ae0a131`. Repeated cold checks still returned the preceding JavaScript bundle (`/assets/index-C_Kr74Dc.js`, build `2026.08.30-repair.4`). A direct, in-scope Azure Static Web App lookup for `sf-scaled-cook-card` was rejected with `AuthorizationFailed`; this work order identity has no Static Web Apps read/deploy permission. Recheck after the factory publishes the branch before accepting the deployment. The intended cold checks are `/`, `/demo`, `?demo=1`, `/privacy`, `/terms`, `/artwork`, and an unknown path.

## Known gaps

No product gaps remain locally. Live publication confirmation is blocked by unavailable factory deployment authorization.

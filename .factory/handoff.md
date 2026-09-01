# Scaled Cook Card — verification 5 handoff

## Outcome

**PASS.** Independent verification accepted candidate `036373ff5ce57a904b9264f9e7e66309ed2d0760` at <https://scaled-cook-card.sociobot.in> on 2026-09-01. The deployed JS, CSS, service worker, and hero image match the default candidate build by SHA-256. The product remains a Vite + TypeScript static web app with its warm handwritten-lab-notebook identity.

## Product scope

The app imports a user-authored YAML or JSON recipe, scales exact ingredient quantities into bound cooking steps, supports keyboard cook mode, saves actual-yield corrections locally, and exports JSON. `/demo` starts an isolated Weeknight tomato pasta sample in one click; it uses `demo:scc:` browser-local storage and has reset/start-for-real controls.

## Verification

Fresh dependency installation: `npm ci` (171 packages, no reported vulnerabilities).

- Check that every exact command in `.factory/claims.json` passes from the local demo entry point: PASS, 17/17 claims.
- `npm test` — PASS, 15 tests.
- `npm run lint` — PASS.
- `npm run typecheck` — PASS.
- `npm run build` — PASS; `dist/index.html` exists.
- `npm run test:e2e` — PASS in the default build (checkout-only tests correctly skipped).
- `npm run test:checkout-enabled -- --grep @claim:kitchen-pass-price --project=chromium` — PASS.
- `VITE_KITCHEN_PASS_CHECKOUT_ENABLED=true npx playwright test --grep @claim:billing-terms --project=chromium` — PASS.
- Check that axe serious/critical findings are absent on landing, workspace, cook mode, and Privacy: PASS.
- Check that desktop, 390px mobile, 200% text, keyboard-only use, visible focus, reduced motion, offline reload, direct legal routes, and styled 404 work: PASS.
- Check that the live cooking flow sends only same-origin runtime requests and has no console/page errors: PASS.
- Check that live response headers include CSP, HSTS, `nosniff`, referrer policy, permissions policy, 30-second HTML/worker revalidation, and one-year immutable hashed/versioned assets: PASS.
- Check that the live JS/CSS/service-worker/hero SHA-256 values match `dist/`: PASS; exact values are in `.factory/verification-5.md`.

Default build budget: JavaScript 79.88 kB raw / 26.93 kB gzip; CSS 20.60 kB raw / 5.28 kB gzip; no shipped web fonts. The responsive 768px WebP hero is 46.93 kB.

## Deploy and live check

The live site now serves candidate bundle `assets/index-BfwZ-sNo.js` and build `2026.09.01-polish.1`. No deployment action was needed for this verification.

## Known gap

`.factory/qa-live.mjs` expects an earlier active-license button label and therefore records one helper-only false result. The product displays `History upgrade active`, stores the fixture token locally, and removes it from the URL as expected. This does not affect the product, claim tests, or PASS decision; see `.factory/verification-5.md`.

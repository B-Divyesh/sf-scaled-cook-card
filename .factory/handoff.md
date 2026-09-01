# Scaled Cook Card — repair 5 handoff

## Outcome

**PASS.** Repair commit `778e5cb06664bf722c7de0cb38abba138aee023f` is pushed to `main` and deployed to <https://scaled-cook-card.sociobot.in> on 2026-09-01 UTC.

This repair closes both release blockers from [verification 7](verification-7.md):

1. The free-card claim now waits for the rendered one-step cook dialog (`Step 1 of 1`) and its `Finish & note changes` control before continuing. It no longer branches on an early visibility check before the asynchronous dialog opens.
2. The default release build no longer advertises `$9`. It plainly says `Kitchen Pass purchase is unavailable`, has no buy link, and offers only license restoration. The `$9` display and Sociobot checkout link remain behind `VITE_KITCHEN_PASS_CHECKOUT_ENABLED=true` for a future operator-enabled checkout.

The repair also bumps the offline shell to `scaled-cook-card-v8` and the visible build id to `2026.09.01-repair.5`, so an existing offline install updates to this release.

## Verification

- Clean install: `npm ci` — PASS; 171 packages installed, zero reported vulnerabilities.
- Unit/deployment checks: `npm test` — PASS, 15/15.
- Type/lint: `npm run lint` and the `npm run build` typecheck — PASS.
- Production build: `npm run build` — PASS; `dist/` contains `index.html`, 80.33 kB raw / 27.05 kB gzip JavaScript and 21.10 kB raw / 5.37 kB gzip CSS.
- Browser suite: `npm run test:e2e` — PASS; desktop and 390px mobile checks, keyboard, axe, privacy, offline, update, responsive, route, and response-policy coverage all ran. Checkout-only cases remain intentionally skipped in the default build.
- Claims: every exact command in [`.factory/claims.json`](claims.json) passed. The fixed `npm run test:e2e -- --grep @claim:free-card-limits --project=chromium` passed as a normal final run and ten repeated Chromium runs. The initial clean exact rerun passed as well; the original failure was intermittent, as documented by the verifier.
- Checkout-enabled fixture checks: `npm run test:checkout-enabled -- --grep @claim:kitchen-pass-price --project=chromium` and `VITE_KITCHEN_PASS_CHECKOUT_ENABLED=true npx playwright test --grep @claim:billing-terms --project=chromium` — PASS. These use recorded responses and do not contact checkout.
- URL verifier: local load 541 ms and live load 635 ms; both report title, `lang="en"`, one `h1`, a `main`, complete image alternatives, labelled buttons, and no console errors. See [`local-verify`](evidence-repair-5/local-verify/verify.json) and [`live-verify`](evidence-repair-5/live-verify/verify.json).
- Accessibility: the full Playwright axe coverage has no serious or critical findings on landing, workspace, dialogs, legal routes, and 404. The live audit reports 52/52 checks passing, including keyboard focus, 44px mobile targets, 200% text reflow, and reduced motion. See [`live browser audit`](evidence-repair-5/live-qa/live-browser.json).
- Privacy/offline: the live demo cooking flow made no cross-origin requests; demo data stayed in `demo:scc:`; the live `scaled-cook-card-v8` service worker controlled the page and reloaded `/demo` offline.
- Live identity: deployed JavaScript, CSS, and service worker hashes exactly match `dist/`. The recorded hashes and production headers are in [`live identity`](evidence-repair-5/live-identity-sha256.txt), [`root headers`](evidence-repair-5/live-root-headers.txt), and [`asset headers`](evidence-repair-5/live-js-headers.txt). Production sends HSTS, nosniff, strict-origin referrer policy, permissions restrictions, and the response-header CSP including `frame-ancestors 'none'`.
- Mobile Lighthouse on live `/demo`: performance 100, accessibility 100, best practices 100, SEO 100; FCP 1.1 s, LCP 1.1 s, total blocking time 30 ms, CLS 0. The full report is [`lighthouse-mobile.json`](evidence-repair-5/lighthouse-mobile.json).

## Deployment

`swa deploy ./dist --env production` completed successfully against the scoped Azure Static Web App `sf-scaled-cook-card` in resource group `sociobot`. The custom domain serves build `2026.09.01-repair.5`, JavaScript `index-BJSHDrOR.js`, and service worker cache `scaled-cook-card-v8`.

## Remaining operator step

Kitchen Pass checkout is deliberately unavailable until the product is registered and enabled by the billing operator. Do not enable `VITE_KITCHEN_PASS_CHECKOUT_ENABLED` until that registration exists and the hosted checkout path has been independently confirmed. The free cook card remains complete: import, scale, cook, corrections, local storage, export, demo, and offline reload all work without it.

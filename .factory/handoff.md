# Scaled Cook Card — repair handoff

## Release status

**PASS locally; deployment target:** `https://scaled-cook-card.sociobot.in`.

This repair addresses every release blocker reported against candidate `fa0690f6b96e73ca9acb20cff974f17190ed6d79` in the independent verification report dated 2026-08-28. The product remains a Vite + TypeScript static web app with `dist/` as its deployment output.

## Repairs

1. **Actual yield no longer disappears at toast expiry.** The initial recipe-ready toast still appears for 3.2 seconds, but its expiry now clears only the live-region text instead of rerendering the app. An incidental toast timeout can therefore not recreate the open completion form or erase its unsaved actual yield, substitutions, or notes.
2. **Production cache policy is immutable and safe to update.** Azure Static Web Apps routes now serve Vite fingerprinted `/assets/*` files with `Cache-Control: public, max-age=31536000, immutable`. Hero derivatives were explicitly versioned to `hero-notebook-v1-*`, received the same immutable policy, and the service-worker cache was bumped to `scaled-cook-card-v3`. Replace artwork only by producing a new URL version.

## Regression coverage

- `tests/e2e/app.spec.ts` includes a 390px browser regression that enters `5.5` actual yield and a substitution, crosses the precise pending 3.2-second toast boundary, asserts both fields remain intact, then confirms `Made 5 ½ servings` is saved to the ledger.
- `tests/deployment.test.ts` asserts the exact one-year immutable cache header for fingerprinted build assets and each versioned hero URL.

## Verification evidence

Performed from a clean dependency install on 2026-08-28:

```text
npm ci                                      PASS; 0 known vulnerabilities
npm test                                    PASS; 7/7 tests
npm run typecheck                           PASS
npm run build                               PASS; dist/ produced
npx playwright test --project=chromium \
  --grep 'correction|imports sample' \
  --repeat-each=3                           PASS; 6/6 runs
npm run test:e2e                            PASS; 14/14 desktop + 390px tests
```

The built JavaScript is 74.25 KB raw / 25.50 KB gzip and CSS is 18.02 KB raw / 4.90 KB gzip, both inside the static-product budgets. No separate lint script is defined by this project; TypeScript strict checking is the configured static analysis gate.

The full browser suite covers recipe import/error recovery, scaling, desktop and 390px cook keyboard flow, the timed correction regression, landing-page axe serious/critical violations, direct legal routes, paid-license restore UI, and saved-card offline reload. A direct local browser probe reported no console/page errors and only the app origin (`http://127.0.0.1:4173`) on first load. The generated `dist/` includes the config, service worker, manifest, versioned hero files, and the expected `scaled-cook-card-v3` cache name.

Local mobile Lighthouse 12.8.2 against the production preview: **Performance 100**, **Accessibility 100**, LCP **1.753 s**, TBT **0 ms**, CLS **0**.

## Privacy and product scope

Recipes, serving choices, corrections, and license state remain local-first in browser storage. The initial load makes no cross-origin request, uses no analytics or third-party fonts/scripts, and the documented Sociobot verification endpoint is still the sole license-related external connection. No paid, safety, export, or accessibility behavior was changed or gated.

## Deployment verification

Push this repair to `main` for the configured Azure Static Web Apps deployment, then verify the deployed revision has the new hashed JavaScript reference, `scaled-cook-card-v3` service worker, and the exact immutable cache header on `/assets/*` and `/hero-notebook-v1-*` responses. No known product gaps remain.

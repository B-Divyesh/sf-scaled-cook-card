# Independent verification 6 — PASS

## Scope and outcome

**PASS.** Candidate commit `b12eb4929d90dc202e30d4ae3fb7465c1c82b583` was checked from a clean dependency installation and against <https://scaled-cook-card.sociobot.in> on 2026-09-01.

Cold first read: Scaled Cook Card scales recipe amounts in every cooking step for home cooks whose hands are busy. The first action is **Try it with sample data**; it opens a ready pasta cook card in one click. The first screen therefore states what the product does, who it is for, and what to select first in plain words.

## Required claim checks

After `npm ci`, every one of the 17 commands listed in `.factory/claims.json` was run against the committed local production-preview demo entry point. All passed.

| Check that the stated behavior is observable | Result |
| --- | --- |
| Check that imported linked quantities retain exact fractions and scale in cooking steps | PASS — `@claim:recipe-import-scaling` |
| Check that the documented YAML fields parse | PASS — `@claim:recipe-format` |
| Check that a step can bind an ingredient-id list | PASS — `@claim:step-binding-list` |
| Check that actual-yield corrections survive the ready-message boundary | PASS — `@claim:actual-yield-correction` |
| Check that arrow-key cooking remains available without screen wake | PASS — `@claim:cook-controls` |
| Check that the displayed scaled cook card exports as JSON | PASS — `@claim:json-export` |
| Check that a saved sample card reloads offline | PASS — `@claim:offline-reload` |
| Check that demo data uses only the `demo:scc:` storage namespace | PASS — `@claim:demo-sandbox` |
| Check that the cooking flow makes no cross-origin runtime request | PASS — `@claim:local-only-recipe-data` |
| Check that checkout visibility is build-gated and a fixture license restores | PASS — `@claim:kitchen-pass` |
| Check that the checkout-enabled build displays `$9 once` and the documented hosted URL | PASS — `@claim:kitchen-pass-price` |
| Check that a restored fixture license retains multiple cards and corrections | PASS — `@claim:paid-history-limits` |
| Check that the free tier retains one card and its latest correction | PASS — `@claim:free-card-limits` |
| Check that a revoked fixture response removes paid-history access | PASS — `@claim:billing-terms` |
| Check that artwork provenance is retained | PASS — `@claim:art-provenance` |
| Check that no payment-provider SDK or product identifier is embedded | PASS — `@claim:payment-integration` |
| Check that versioned assets have a one-year cache rule | PASS — `@claim:versioned-asset-cache` |

## Local quality checks

- Check that unit and deployment checks pass: `npm test` — PASS, 15 checks.
- Check that TypeScript checks pass: `npm run typecheck` — PASS.
- Check that lint checks pass: `npm run lint` — PASS.
- Check that the exact production build completes and produces `dist/`: `npm run build` — PASS.
- Check that the complete browser suite passes: `npm run test:e2e` — PASS; `test-results/.last-run.json` records `status: passed` and no failed checks.
- Check that the default initial bundle is within budget: JavaScript is 80.29 kB raw / 27.09 kB gzip and CSS is 21.10 kB raw / 5.37 kB gzip. Both are within the static-product budgets.

## Independent live checks

- Check that the live landing page returns 200, has one plain-language H1, a title, language, and main landmark: PASS.
- Check that the desktop first screen visibly contains the sample-demo action and the offline, price, and browser-storage facts: PASS.
- Check that the sample flow scales pasta to 600 g at six servings, advances through cook mode with ArrowRight, and saves an actual yield of 5.5 plus a substitution: PASS.
- Check that an invalid serving value of `0.24` returns to `4` and displays `Choose a serving count between 0.25 and 999.`: PASS.
- Check that an invalid import keeps the import dialog open and displays `Servings must be a number or fraction.`: PASS.
- Check that the first Tab reaches `Skip to main content`, shows a `3px` visible focus outline, and moves to the page H1 on activation: PASS.
- Check that the deployed landing, cook mode, and Privacy route have zero axe serious or critical findings: PASS.
- Check that the demo banner says sample data is not saved to the real cook card, and that saved demo entries use `demo:scc:` keys: PASS.
- Check that the live flow makes only same-origin document, asset, image, and route requests; check that console and page errors are absent: PASS.
- Check that the live service worker controls the page and a saved sample card reloads offline with the offline notice: PASS.
- Check that the 390px demo at 200% text size has `scrollWidth` 390 for both document and body, honors reduced motion, and has at least 44px high demo controls: PASS.
- Check that `/privacy`, `/terms`, and `/artwork` open directly: PASS.
- Check that all rendered same-origin links resolve with HTTP 200: PASS.
- Check that an unknown URL returns the designed 404 page with HTTP 404: PASS.
- Check that a mobile Lighthouse run meets the required baseline: PASS — performance 99, accessibility 100, best practices 100, SEO 100; FCP 1.1 s, LCP 1.7 s, CLS 0, TBT 80 ms. Lighthouse wrote the completed report before its browser tab closed during post-report cleanup.

## Deployment identity, privacy, and headers

Check that the live deployment is the candidate build: PASS. A fresh default `npm run build` produced the same bytes as the live assets.

| Asset | SHA-256 |
| --- | --- |
| `assets/index-DQ-98reA.js` | `33c6745d482026462eea42e549c5b107d0f01a757995ed88ea8b241c0a899c72` |
| `assets/style-DFv06S3l.css` | `93fa85c64d0c06983a3c99ecce0dd38419b5e4035a167aa5891dc44338afb76c` |
| `sw.js` | `bff687c42e0e4e8553df6cdb2c67538a90729c293d48086f2b9c4f75bb58ef50` |

- Check that HTML and the service worker use 30-second revalidation: PASS.
- Check that hashed JavaScript/CSS and versioned AVIF use `public, max-age=31536000, immutable`: PASS.
- Check that HSTS, `nosniff`, strict-origin referrer policy, camera/microphone/geolocation restrictions, and the response-header CSP with `frame-ancestors 'none'` are present: PASS.
- Check that recipe data remains browser-local during the complete demo cooking flow: PASS. No analytics or third-party runtime request was observed.
- Check that a product-owned server endpoint requiring a request allowance is present: not applicable. This static product has no such endpoint; the optional billing path was checked only with its recorded fixture response.

## Findings by severity

No critical, high, medium, or low product findings.

## Reproduction

```bash
npm ci
npm test
npm run typecheck
npm run lint
npm run build
npm run test:e2e
```

Open <https://scaled-cook-card.sociobot.in/demo> for the isolated sample flow.

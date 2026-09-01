# Independent verification 5 — PASS

## Scope and result

**PASS.** Candidate commit `036373ff5ce57a904b9264f9e7e66309ed2d0760` was checked locally from a clean dependency install and against <https://scaled-cook-card.sociobot.in> on 2026-09-01. The deployed JavaScript, CSS, service worker, and hero image have the same SHA-256 values as the final default production build. No release-blocking product defect was found.

Cold first read: this is a cook card for home cooks whose hands are busy. It scales recipe amounts into every cooking step. The first action is **Try it with sample data**, which opens a ready pasta card in one click. This meets the plain-language and sample-demo acceptance check.

## Required claim checks

After `npm ci`, every command listed in `.factory/claims.json` was run against the local production-preview demo entry point. All 17 claim checks passed.

| Check that the stated behavior is observable | Command result |
| --- | --- |
| Check that imported linked quantities retain exact fractions and scale in steps | PASS — `@claim:recipe-import-scaling` |
| Check that documented YAML recipe fields parse | PASS — `@claim:recipe-format` |
| Check that ingredient-id lists bind to a step | PASS — `@claim:step-binding-list` |
| Check that actual-yield corrections survive the ready-message boundary | PASS — `@claim:actual-yield-correction` |
| Check that arrow-key cooking remains available without screen wake | PASS — `@claim:cook-controls` |
| Check that the active cook card exports as parseable JSON | PASS — `@claim:json-export` |
| Check that a saved demo card reloads offline | PASS — `@claim:offline-reload` |
| Check that demo storage uses only `demo:scc:` keys | PASS — `@claim:demo-sandbox` |
| Check that the cooking flow sends no cross-origin runtime requests | PASS — `@claim:local-only-recipe-data` |
| Check that checkout visibility is build-gated and a fixture license restores | PASS — `@claim:kitchen-pass` |
| Check that enabled checkout displays `$9 once` and the documented hosted URL | PASS — `@claim:kitchen-pass-price` |
| Check that a restored fixture license retains multiple cards and corrections | PASS — `@claim:paid-history-limits` |
| Check that the free tier retains one card and its latest correction | PASS — `@claim:free-card-limits` |
| Check that a revoked fixture response removes paid history access | PASS — `@claim:billing-terms` |
| Check that the artwork provenance is retained | PASS — `@claim:art-provenance` |
| Check that no payment-provider SDK or product identifier is embedded | PASS — `@claim:payment-integration` |
| Check that versioned assets have a one-year cache rule | PASS — `@claim:versioned-asset-cache` |

## Local quality checks

- Check that unit and deployment tests pass: `npm test` — PASS, 15 tests.
- Check that linting passes: `npm run lint` — PASS.
- Check that TypeScript checks pass: `npm run typecheck` — PASS.
- Check that the exact production build completes: `npm run build` — PASS; `dist/index.html` produced.
- Check that the complete browser suite passes: `npm run test:e2e` — PASS, 52 tests; checkout-only cases were correctly skipped in the default build.
- Check that the default initial bundle is within budget: JS 79,882 bytes raw / 26.93 kB gzip; CSS 20,603 bytes raw / 5.28 kB gzip; no shipped web fonts. Both are below the static-product budgets.
- Check that the responsive hero is within the mobile-image budget: the 768px WebP is 46,926 bytes and the 1280px AVIF is 94,495 bytes.

## Independent live checks

The live checks used fresh browser contexts at desktop and 390px widths.

- Check that the landing page returns 200, has one plain-language H1, names home cooks, and provides exactly one visible sample-demo action: PASS.
- Check that the hero image loads: PASS (748 × 499 rendered source).
- Check that the first Tab reaches the skip link and visible keyboard focus has a 3px ink-blue outline: PASS.
- Check that serious or critical axe findings are absent on landing, workspace, cook dialog, and Privacy: PASS.
- Check that the demo opens a ready recipe, retains a persistent isolated-demo banner, resets, and discards its data when leaving: PASS.
- Check that normal scaling updates ingredient and bound-step values; check that 0.25 and 999 servings work; check that 1000 returns to 999 with a clear recovery message: PASS.
- Check that invalid YAML leaves the import dialog open with a specific recovery message, and that a corrected recipe with `3/16` scales to `⅜`: PASS.
- Check that keyboard Enter opens cook mode, ArrowRight advances, and post-cook actual yield, substitutions, and notes save locally: PASS.
- Check that demo cooking only makes same-origin requests, with no console errors or page errors: PASS. The observed runtime requests were the document, same-origin JS/CSS, hero image, and SPA navigation only.
- Check that a valid recorded license response stores and removes the return token from the URL: PASS. The active control reads **History upgrade active**.
- Check that 390px at 200% text size has no horizontal overflow and visible controls are at least 44px in both dimensions: PASS.
- Check that reduced-motion mode has no material transitions or animations: PASS.
- Check that the service worker controls the live app, uses cache `scaled-cook-card-v6`, accepts an update check, and reloads `/demo` offline: PASS.
- Check that `/privacy` and `/terms` open directly with one H1 and one main landmark: PASS.
- Check that all rendered same-origin links from `/`, `/demo`, `/privacy`, and `/terms` resolve: PASS.
- Check that an unknown URL returns the styled 404 with HTTP 404: PASS.

## Deployment identity, headers, and privacy

Check that the deployment matches the candidate build: PASS. Local and live SHA-256 values matched for:

| Asset | SHA-256 |
| --- | --- |
| `assets/index-BfwZ-sNo.js` | `55edb7d4b3de0007077c61c2c801d1b656e46c3954e0462cdfb5595059c041d7` |
| `assets/style-DAbMhE8d.css` | `0f86beb6af98e42ab15f3a9389679006b154e8445c714acecb77e8e616defb05` |
| `sw.js` | `bff687c42e0e4e8553df6cdb2c67538a90729c293d48086f2b9c4f75bb58ef50` |
| `hero-notebook-v1-1280.avif` | `42252356442084930d985b746ff992a660066d91b39099711385a908561969da` |

- Check that HTML and the service worker revalidate after 30 seconds: PASS.
- Check that hashed JS/CSS and versioned art use `public, max-age=31536000, immutable`: PASS.
- Check that HTTPS, HSTS, `nosniff`, strict-origin referrer policy, a deny-by-default camera/microphone/geolocation policy, and a response-header CSP with `frame-ancestors 'none'` are present: PASS.
- Check that the live demo flow sends recipe data only to the product origin: PASS. No analytics or third-party runtime request was observed.
- Check that the static product exposes no product-owned server endpoint requiring a request-allowance check: PASS as not applicable. The optional billing behavior was checked only with recorded browser fixtures; no live billing request was made.

## Findings

No product defects were found.

**Low — repository QA helper expectation is stale.** `.factory/qa-live.mjs` still expects a button named `Kitchen Pass active` after its recorded valid-license check. The candidate deliberately presents the clearer current label `History upgrade active`; the token is stored, removed from the URL, and verified by the fixture. This helper-only expectation returns one false result and does not affect the product, its claim tests, or the release decision.

## Reproduce

```bash
npm ci
npm test
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

Open `https://scaled-cook-card.sociobot.in/demo` for the isolated sample flow.

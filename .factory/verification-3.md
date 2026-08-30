# Independent verification 3 — FAIL

**Work order:** `scaled-cook-card-verify-3`  
**Candidate commit:** `8293bfcfd575591d04a71835210490e2f45ed315`  
**Live URL:** <https://scaled-cook-card.sociobot.in>  
**Verified:** 2026-08-30 UTC  
**Result:** **FAIL**

## Verdict

The free, local-first cook-card workflow is deployed and works for the core recipe-scaling job. The candidate is not releasable because the advertised $9 Kitchen Pass checkout is still unavailable in production, and two live accessibility regressions remain at the required demo route/mobile text-size boundaries.

No product code was modified during this verification.

## Release-blocking defects

### High — the advertised Kitchen Pass purchase link returns 404

The live **Buy Kitchen Pass** link points to the documented checkout URL:

```text
https://api.sociobot.in/api/v1/products/scaled-cook-card/checkout
```

Fresh `GET` evidence returned HTTP `404`, `content-type: application/json`, with:

```json
{"error":"enabled factory product","status":404}
```

The site advertises “$9 once” on the first screen and describes the paid local-history/library feature. A visitor cannot complete that purchase, so the paid product contract is broken. The fixture-backed restore test proves the client UI shape only; it does not make a live checkout work.

### Medium — the 390 px experience overflows at 200% text size

On the deployed `/demo`, a 390 px browser viewport with the document text size set to 200% measured:

```text
window.innerWidth:                 390 px
document.documentElement.scrollWidth: 547 px
document.body.scrollWidth:            547 px
```

The header/nav, demo banner, recipe title, procedure, and footer are horizontally clipped. The captured viewport visibly truncates “Privacy” and “Kitchen Pass” in the header and clips the procedure column. This fails the required 200%-text-resize/reflow baseline. The repository's mobile regression passes only under its iPhone emulation, where `innerWidth` also expands to 547 px and therefore masks the overflow.

### Medium — leaving demo mode for Privacy loses focus and route announcement

From `/`, the Privacy link correctly moves focus to the privacy `<h1>` and announces “Opened Privacy.” From `/demo`, the same header Privacy link performs a full navigation without either behavior: after 200 ms, `document.activeElement` was not the `<h1>` and no “Opened Privacy.” live-region text was present. This violates the route-change focus/announcement requirement for a real navigation path available in the product.

## Mandatory claims

`npm ci` was run first from the clean candidate checkout, then every command in `.factory/claims.json` was run through the product's local demo entry point. All passed:

| Claim | Exact command | Result | Observed outcome |
| --- | --- | --- | --- |
| `recipe-import-scaling` | `npm run test:e2e -- --grep @claim:recipe-import-scaling` | PASS | 3/16 renders in list/step and becomes 3/8 at eight servings. |
| `recipe-format` | `npm test -- --testNamePattern @claim:recipe-format` | PASS | Documented YAML parses with recipe structure and bindings. |
| `step-binding-list` | `npm test -- --testNamePattern @claim:step-binding-list` | PASS | Ingredient-id step binding parses. |
| `actual-yield-correction` | `npm run test:e2e -- --grep @claim:actual-yield-correction` | PASS | Values survive the 3.2-second toast boundary and save. |
| `cook-controls` | `npm run test:e2e -- --grep @claim:cook-controls` | PASS | Arrow navigation works with unsupported wake lock. |
| `json-export` | `npm run test:e2e -- --grep @claim:json-export` | PASS | Downloaded sample JSON parses. |
| `offline-reload` | `npm run test:e2e -- --grep @claim:offline-reload` | PASS | A sample card reloads in its isolated offline context. |
| `demo-sandbox` | `npm run test:e2e -- --grep @claim:demo-sandbox` | PASS | Only `demo:scc:` storage is created. |
| `local-only-recipe-data` | `npm run test:e2e -- --grep @claim:local-only-recipe-data` | PASS | Demo cook/save requests are same-origin. |
| `kitchen-pass` | `npm run test:e2e -- --grep @claim:kitchen-pass` | PASS | $9 link and fixture-backed license restore appear and activate. |

The claim manifest exists, has one matching tagged test for each listed claim, and its landing/README claims are represented. The checkout defect is nevertheless a live observable failure of the listed paid claim.

## First read and demo

**PASS.** A cold desktop live load answers all three questions in plain words:

- **Does what:** “Scale recipe amounts in every step.”
- **For whom:** “For home cooks who need correct quantities while their hands are busy.”
- **Click first:** the visible **Try it with sample data** button, with “Open a ready pasta card” beside it.

One click opens the Weeknight tomato pasta card. `/demo` has a persistent “Demo — sample data, nothing is saved to your real card” banner with **Reset demo** and **Start for real**. The sample uses its documented `demo:scc:` local-storage namespace.

## Local quality gates

All commands were run on the candidate SHA after `npm ci`:

```text
npm ci             PASS — 171 packages installed; 0 vulnerabilities
npm test           PASS — 12/12 Vitest tests
npm run typecheck  PASS
npm run lint       PASS
npm run build      PASS — dist/ produced
npm run test:e2e   PASS — 36/36 Playwright tests
```

Production build sizes:

```text
JavaScript  79.13 kB raw / 26.81 kB gzip
CSS         20.15 kB raw / 5.23 kB gzip
Hero AVIF   94.50 kB
Fonts       none
```

The static JS, CSS, font, and hero-image budgets pass.

## Independent live product checks

Passing live checks included:

- importing a JSON recipe with `3/16 tsp`; both ingredient list and bound step showed `3/16`, then `⅜` at eight servings;
- rejecting `0.24` servings with “Choose a serving count between 0.25 and 999.” and retaining `4` servings;
- ArrowRight moving cook mode to Step 2; a zero actual yield appearing as “Made 0 servings” in the correction ledger;
- invalid recipe recovery: “Servings must be a number or fraction.” remained visible in the open import dialog;
- service worker update: page controlled at `https://scaled-cook-card.sociobot.in/` with cache `scaled-cook-card-v4`;
- isolated offline `/demo` reload showing the full card and “Offline — your card still works.”;
- dialog-close focus restoration and root-to-Privacy focus/announcement;
- reduced motion (`transition-duration: 1e-05s`);
- axe scans of landing, workspace, cook view, and Privacy: **0 serious / 0 critical**;
- zero console errors and zero `pageerror` events.

## Privacy, headers, cache, and deployment identity

The initial live load requested only the site document, same-origin JS/CSS, and the product's hero artwork. During the import/scale/cook/save demo flow, all recorded requests were same-origin. With a deliberately invalid license token, the URL was scrubbed and the sole extra request was the documented `api.sociobot.in` verification URL; no recipe content was in that request. No analytics, third-party script, font, or runtime asset request was observed.

Live headers include HTTPS/HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, the camera/microphone/geolocation-denying Permissions Policy, and a response-header CSP containing `frame-ancestors 'none'`. Hashed JS and versioned AVIF both return `Cache-Control: public, max-age=31536000, immutable`; HTML uses 30-second revalidation. `/demo`, `/privacy`, `/terms`, `robots.txt`, `sitemap.xml`, and `404.html` return 200, while an unknown route returns a designed HTTP 404.

Direct SHA-256 comparisons matched local `dist/` and live `index.html`, JS, CSS, worker, manifest, favicon, social image, touch icon, and hero AVIF. The live deployment matches candidate `8293bfcfd575591d04a71835210490e2f45ed315`.

The static app has no product server endpoint. The documented license verification endpoint did enforce its allowance from one client: 30 consecutive requests returned 200; request 31 returned `429` with `Retry-After: 3` (subsequent requests returned 429 with `Retry-After: 2`).

## Required next steps

1. Enable/register the production `scaled-cook-card` checkout route, then verify a hosted checkout redirect and return-token restore end to end.
2. Make the 390 px layout reflow rather than overflow when text reaches 200%, and add a regression that measures an actual 390 CSS-pixel viewport.
3. On demo-to-legal navigation, move focus to the destination `<h1>` and publish the route announcement just as root SPA navigation does.

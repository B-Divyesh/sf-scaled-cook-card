# Independent verification 4 — PASS

**Work order:** `scaled-cook-card-verify-4`  
**Candidate:** `147fad15e5b98c9b2a9ffbcd5e6b8a46f9ea9041`  
**Live URL:** <https://scaled-cook-card.sociobot.in>  
**Verified:** 2026-08-30 UTC  
**Result:** **PASS**

## Verdict and defects

The candidate passes the researched brief and release contract. The free, local-first cook card imports YAML/JSON, retains exact fractions, scales amounts in ingredient lists and bound steps, supports keyboard cooking, exports JSON, and saves post-cook corrections locally. The live deployment matches the candidate production build byte for byte.

- **Critical:** none.
- **High:** none.
- **Medium:** none.
- **Low:** none.

No product code was changed during verification.

Operational limitation, not a release blocker: the default build states that Kitchen Pass checkout is unavailable and exposes no dead purchase link. License restore remains available. Enabling checkout depends on the separately owned Sociobot billing route; the free product is complete without it.

## First-read and demo gate

**PASS.** A cold live load states all three required facts on the first screen:

- What: **“Scale recipe amounts in every step.”**
- For whom: **“For home cooks who need correct quantities while their hands are busy.”**
- First click: **“Try it with sample data,”** followed by “Open a ready pasta card.”

One click opens `/demo` with the four-step Weeknight tomato pasta card. Its persistent banner says **“Demo — sample data, nothing is saved to your real card”** and provides **Reset demo** and **Start for real**. Reset restored four servings and removed the correction; Start for real discarded `demo:scc:` data and returned to the empty real workspace.

## Mandatory claim gate

`.factory/claims.json` exists. After `npm ci`, every listed command passed from the clean candidate checkout through the local production preview:

| Claim | Exact command | Result | Evidence |
| --- | --- | --- | --- |
| `recipe-import-scaling` | `npm run test:e2e -- --grep @claim:recipe-import-scaling` | PASS — 2/2 | `3/16 tsp` remained exact, then became `⅜ tsp` at eight servings in list and step. |
| `recipe-format` | `npm test -- --testNamePattern @claim:recipe-format` | PASS — 1/1 | The documented YAML structure parsed with bindings. |
| `step-binding-list` | `npm test -- --testNamePattern @claim:step-binding-list` | PASS — 1/1 | A JSON `ingredients` list produced the expected binding. |
| `actual-yield-correction` | `npm run test:e2e -- --grep @claim:actual-yield-correction` | PASS — 2/2 | `5.5`, substitutions, and notes survived 3.2 seconds and saved. |
| `cook-controls` | `npm run test:e2e -- --grep @claim:cook-controls` | PASS — 2/2 | ArrowRight advanced with screen wake unavailable. |
| `json-export` | `npm run test:e2e -- --grep @claim:json-export` | PASS — 2/2 | Downloaded JSON parsed and contained the sample. |
| `offline-reload` | `npm run test:e2e -- --grep @claim:offline-reload` | PASS — 2/2 | An isolated context reloaded the card offline. |
| `demo-sandbox` | `npm run test:e2e -- --grep @claim:demo-sandbox` | PASS — 2/2 | Demo changes created only `demo:scc:` keys. |
| `local-only-recipe-data` | `npm run test:e2e -- --grep @claim:local-only-recipe-data` | PASS — 2/2 | The correction flow made only same-origin requests. |
| `kitchen-pass` | `npm run test:e2e -- --grep @claim:kitchen-pass` | PASS — 2/2 | The default had no checkout link; fixture restore activated locally. |

The separately enabled branch passed `npm run test:checkout-enabled -- --project=chromium` (1/1). It asserts the documented `$9` price and hosted-checkout URL without contacting it. Landing, legal-page, and README functional claims are represented by the manifest.

## Clean local gates

```text
npm ci             PASS — 171 packages; 0 vulnerabilities
npm audit --omit=dev
                   PASS — 0 vulnerabilities
npm test           PASS — 12/12
npm run lint       PASS
npm run typecheck  PASS
npm run build      PASS — dist/index.html produced
npm run test:e2e   PASS — 39 passed, 1 expected desktop skip for a mobile-only test
```

The exact default production build was rerun after the opt-in checkout test so `dist/` contains the release configuration.

```text
JavaScript  78,854 B raw / 26,480 B gzip
CSS         20,560 B raw /  5,306 B gzip
Hero AVIF   94,495 B
Fonts       none
```

## Independent end-to-end evidence

The live harness recorded **43/43 passing checks** on fresh contexts:

- six servings produced `600 g` in both ingredient list and bound step;
- `0.25` and `999` worked; `1000` showed the error and restored `999`;
- an invalid import kept its dialog open, then recovered with valid JSON;
- inline `3/16 tsp` and list-bound `1 1/2 cups` rendered; `3/16` scaled exactly to `⅜`;
- Enter started cooking, ArrowRight advanced, and yield `5.5`, substitution, and notes persisted;
- a return token was stored, scrubbed from the URL, and activated against an intercepted fixture;
- every rendered same-origin link returned 2xx; an unknown route returned the designed HTTP 404.

The static product has no candidate-owned backend endpoint. Per the work order’s resource boundary, verification did not contact the separately owned `api.sociobot.in`, so no fresh external 429 allowance was probed. The default live flow does not call it.

## Accessibility, privacy, PWA, and performance

- `verify-url.sh` passed: HTTP 200, title, `lang="en"`, one `<h1>`, `<main>`, alt text, labelled controls, and no console/page errors.
- Axe scans of landing, workspace, cook dialog, and legal page found **0 serious / 0 critical** violations.
- The first Tab reached the skip link; visible focus used a `3px` ink-blue outline.
- At 390 × 844 and 200% root text, viewport, HTML, and body widths remained `390px`.
- Every visible mobile control measured at least 44 × 44 CSS pixels.
- Reduced motion left no material animation or transition over 20 ms.
- The cold-load, demo, cook, save, reset, and exit request log was entirely same-origin, with no analytics or third-party runtime assets.
- The live service worker controlled the page, accepted an update check, used cache `scaled-cook-card-v5`, and reloaded `/demo` offline.
- HTTPS/HSTS, `nosniff`, referrer and permissions policies, and response-header CSP are present. HTTP redirects to HTTPS.
- HTML/worker use 30-second revalidation. Hashed JS/CSS and versioned art use one-year immutable caching.

Fresh live Lighthouse 12.8.2 mobile:

```text
Performance       100
Accessibility     100
Best practices    100
SEO               100
FCP               1.1 s
LCP               1.5 s
TBT               20 ms
CLS               0
Total transfer    126 KiB
```

## Deployment identity and artifacts

Fresh SHA-256 comparisons matched live and local `dist/` bytes for `index.html`, hashed JS/CSS, service worker, manifest, favicon, touch icon, social card, all hero variants, 404 HTML/CSS, `robots.txt`, and `sitemap.xml`. The tested deployment is candidate `147fad15e5b98c9b2a9ffbcd5e6b8a46f9ea9041`.

Evidence is under `.factory/evidence-verification-4/`: `live-browser.json`, desktop/mobile captures, `identity.txt`, `lighthouse-live.json`, `bundles.txt`, response headers, and `verify-url/verify.json`. The reproducible harness is `.factory/qa-live.mjs`.

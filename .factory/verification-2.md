# Independent verification 2 — FAIL

**Work order:** `scaled-cook-card-verify-2`  
**Candidate commit:** `a83316d118afa080715ce07b182dc3a55a258891`  
**Live URL:** <https://scaled-cook-card.sociobot.in>  
**Verified:** 2026-08-30 UTC  
**Result:** **FAIL**

## Verdict

The listed claim tests and the normal cook flow pass, and the live deployment is a byte-for-byte match for the candidate build. The release still fails the acceptance contract:

1. It can display an incorrect ingredient amount, which breaks the core job of retaining correctly scaled quantities in every step.
2. Its advertised $9 purchase action is dead in production.
3. Several claims shown on the landing page and in the README are absent from the required claims manifest.
4. Accessibility and site-structure requirements fail at 200% text size, after dialogs/routes, on mobile touch targets, and in required metadata/routes.

No product source code was changed during verification.

## Release-blocking defects

### High — some imported fractions are changed to a different quantity

The formatter selects a nearby common fraction whenever it is within `0.025`, even when that is not the entered or mathematically scaled quantity.

Fresh live reproduction:

1. Open `/demo` and import a recipe with 4 servings and one ingredient whose quantity is `3/16 tsp`.
2. Leave the target at the same 4 servings.
3. The ingredient list and bound step both show `⅙ tsp`.

`3/16` is `0.1875`; `1/6` is about `0.1667`, so the displayed amount is 11.1% low. The same result is produced locally by `formatQuantity(parseQuantity("3/16"))`. This directly violates the researched requirement for correctly scaled quantities and can make a cook use the wrong amount.

### High — the advertised Kitchen Pass cannot be purchased

The live UI advertises a **$9 once** Kitchen Pass and links to:

`https://api.sociobot.in/api/v1/products/scaled-cook-card/checkout`

On 2026-08-30 the endpoint returned HTTP 404 with:

```json
{"error":"enabled factory product","status":404}
```

The restore/verify path does work for an invalid token: the token was removed from the URL, stored locally, sent only to the documented verification endpoint, and the UI showed “License no longer active.” The purchase path itself is unavailable.

### High — `.factory/claims.json` omits claims visitors are asked to rely on

All four declared claims pass, but the landing page and README contain many additional functional claims with no manifest entry or `@claim:<id>` test. Representative unlisted claims include:

- scaling every ingredient reference when yield changes — the product's core claim;
- YAML/JSON import by paste, file picker, and drag-and-drop;
- decimal, simple-fraction, mixed-fraction, and Unicode-fraction support;
- JSON export;
- arrow-key cook navigation and screen-wake fallback;
- saving substitutions and notes;
- the $9 unlimited local library/full-history paid behavior;
- no analytics or third-party runtime assets.

The claims acceptance rule explicitly makes any unlisted landing/README claim a failed review. The missing core scaling claim also allowed the incorrect `3/16` rendering above to escape the declared suite. `.factory/copy-audit.md`, required by the plain-words contract, is also absent.

## Other defects

### Medium — target servings below the stated minimum are applied

The serving control declares `min="0.25"` and its error says to choose between 0.25 and 999, but `0.24` and `0.01` are accepted and immediately scale the recipe. The browser reports the input as invalid while the app displays `24 g` and `1 g` pasta respectively. `999.01`, blank, negative, and nonnumeric values correctly recover to the previous value.

### Medium — a valid zero actual yield is hidden from the ledger

The completion field explicitly accepts zero (`min="0"`). Saving `0` stores `actualYield: 0` in the demo record, but the visible ledger says “Cook completed — no changes noted.” A zero-yield correction is therefore not represented to the cook.

### Medium — the workspace does not reflow at 200% text size

At a 390 px viewport with text enlarged to 200%, the document becomes 547 px wide. The ingredient and procedure panels extend beyond the viewport, and the enlarged cook view crowds content behind its docked controls. This fails the stated requirement that text resize to 200% without loss and without horizontal reflow problems.

### Medium — focus is lost after dialogs and client-side route changes

- Closing the import dialog leaves focus on `<body>` instead of returning it to **Import my recipe**.
- Following the client-side Privacy link leaves focus on `<body>` instead of moving it to and announcing the new `<h1>`.

The initial dialog focus is correctly placed on its close button, the native dialog traps focus, and the skip link becomes visible with a 3 px blue focus ring. The failures are specifically in focus restoration and SPA route announcement.

### Medium — multiple mobile targets are below the required 44 px

At 390 px, measured live targets include:

- wordmark/home link: 36 px high;
- Reset demo: 36 px high;
- Start for real: 36 px high;
- footer Privacy and Terms links: 20 px high.

Core cook buttons are at least 44 px.

### Medium — required discovery, route, and skeleton elements are missing

- No canonical link, Open Graph/Twitter metadata, social image, or apple-touch icon.
- No `robots.txt`, `sitemap.xml`, or designed 404. Those URLs and arbitrary unknown paths all return the 788-byte app shell with HTTP 200 and `text/html`.
- The footer omits “Built by Param Factory” and a version/build id.
- The first-screen fact line gives format/offline/privacy, but not the paid product's $9 one-time price.
- The landing page has no required paid-tier section and no clear “what it does not do” section; pricing is available only through the Kitchen Pass dialog.

## Mandatory claim results

Each command was run exactly as listed in `.factory/claims.json` after `npm ci` from the clean candidate checkout.

| Claim | Exact command | Result | Observable evidence |
| --- | --- | --- | --- |
| `actual-yield-correction` | `npm run test:e2e -- --grep @claim:actual-yield-correction` | PASS, 2/2 | `5.5` and substitution survive the 3.2-second toast boundary and save. |
| `offline-reload` | `npm run test:e2e -- --grep @claim:offline-reload` | PASS, 2/2 | A saved sample card reloads offline in a dedicated browser context. |
| `demo-sandbox` | `npm run test:e2e -- --grep @claim:demo-sandbox` | PASS, 2/2 | Demo edits create only `demo:scc:` keys, not `scc:` keys. |
| `local-only-recipe-data` | `npm run test:e2e -- --grep @claim:local-only-recipe-data` | PASS, 2/2 | The correction flow makes only same-origin requests. |

Passing the declared claims does not override the unlisted-claim failure above.

## First-read and one-click demo

**PASS.** On a cold 1440 × 900 and 390 × 844 load, the first screen communicates:

- **What:** change servings once and see ingredient quantities inside recipe steps;
- **For whom:** a cook with occupied or flour-covered hands who should not calculate or scroll;
- **What to click first:** **Try it with sample data**.

At 390 × 844, the headline, explanatory copy, both actions, and the YAML/offline/device fact line are all above the fold. One click opens `/demo` with a populated five-ingredient, four-step card and a persistent “Demo — sample data, nothing is saved to your real card” banner with Reset demo and Start for real.

## Clean install, tests, and production build

```text
npm ci             PASS; 75 packages installed; 0 vulnerabilities
npm test           PASS; 8/8 tests
npm run typecheck  PASS
npm run build      PASS; dist/index.html produced
npm run test:e2e   PASS; 18/18 desktop/mobile tests
```

No lint script exists in `package.json`.

Production output:

```text
JavaScript  75.56 KB raw / 25.87 KB gzip
CSS         18.50 KB raw / 4.98 KB gzip
Hero AVIF   94.50 KB
Fonts       none
```

The static JS, CSS, font, and hero budgets pass.

## End-to-end behavior

Passing live checks on desktop and 390 px mobile:

- sample demo opens in one click and uses only `demo:scc:` storage;
- realistic JSON import with `1 1/2` and `2¾` quantities succeeds;
- scaling 1½ slices from 2 to 3 servings shows 2¼ slices in the list and bound step;
- malformed servings, an unknown ingredient binding, and a file over 1 MB each produce specific recovery text while keeping the dialog open;
- 0.25 and 999 target servings work; negative, blank, nonnumeric, and over-999 inputs recover;
- JSON export downloads `boundary-toast.json`;
- ArrowRight advances cook mode;
- actual yield, substitution, and notes save after crossing the 3.2-second toast timeout;
- Reset demo removes corrections and restores the sample at 4 servings;
- unsupported screen-wake behavior leaves cooking controls available.

The incorrect fraction, sub-minimum target, and zero-yield cases are documented as defects above.

## Accessibility and browser quality

- Playwright axe scans of landing, demo workspace, cook dialog, and privacy page: **0 serious / 0 critical**.
- `verify-url.sh`: HTTP 200, title/lang/one h1/main/alt/button labels all pass; zero console/page errors.
- Keyboard skip link: visible at `top: 8px` with `rgb(23, 105, 141) solid 3px` outline.
- Reduced motion: transitions reduce to `0.00001 s`; smooth scrolling becomes `auto`.
- Browser zoom is not disabled.
- The 200% text, focus restoration, route focus, and touch-target defects remain.

Evidence artifacts:

- `.factory/evidence-2/verify.json`
- `.factory/evidence-2/screenshot-desktop.png`
- `.factory/evidence-2/screenshot-mobile.png`

## Privacy, requests, and response policy

During the complete demo/import/scale/export/cook/reset/offline flow, every request was same-origin. Initial load requested only the document, hashed JS/CSS, and the product's own hero image. There were no analytics, third-party fonts/scripts, or CDN requests, and there were no console or page errors.

With an invalid license, the only cross-origin request was:

`GET https://api.sociobot.in/api/v1/products/scaled-cook-card/verify?license=…`

It contained no recipe data. Response headers include HTTPS/HSTS, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, restrictive camera/microphone/geolocation permissions, and a CSP with `frame-ancestors 'none'` delivered as a response header.

The license endpoint's request allowance is not stated in repository copy. Its observed rapid-request allowance was 30 successful verification requests; the 31st returned HTTP 429 with `Retry-After: 2` and `X-RateLimit-After: 2`. A retry after 3 seconds returned 200.

## PWA and offline behavior

- Service worker `/sw.js` activates and controls the page.
- A seeded stale `scaled-cook-card-v2` cache is deleted on fresh registration; only `scaled-cook-card-v3` remains.
- `registration.update()` completes with the v3 worker activated.
- `/demo` reloads offline with its full sample card and visible offline status.

## Live deployment identity, headers, and caching

SHA-256 comparison found the live and local candidate files identical for:

- `index.html`;
- `assets/index-B626S3Vy.js`;
- `assets/style-BKBPyUz4.css`;
- `sw.js`, manifest, and favicon;
- all three `hero-notebook-v1-*` variants.

This proves the live deployment matches candidate `a83316d`. `/assets/index-B626S3Vy.js` and the versioned AVIF return `Cache-Control: public, max-age=31536000, immutable`; HTML uses a 30-second revalidation policy. HTTP redirects to HTTPS.

Lighthouse 12.8.2 mobile against the live URL:

```text
Performance    98
Accessibility 100
FCP            1.1 s
LCP            1.6 s
TBT            160 ms
CLS            0
```

## Required next steps

1. Render exact entered/scaled quantities or document and safely control any rounding; add declared claim coverage for representative and adversarial fractions.
2. Register/enable the live billing product so checkout redirects successfully, then test the complete return/restore flow.
3. Inventory every landing/README claim in `.factory/claims.json`, add exactly one tagged observable test per claim, and add the required copy audit.
4. Enforce the 0.25 target minimum, represent a zero actual yield, and add boundary regression tests.
5. Fix 200% text reflow, focus restoration/route announcements, and all sub-44 px targets.
6. Add the required metadata, crawler files, real 404, landing sections, footer attribution, and build id.

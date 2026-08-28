# Verification — FAIL

**Work order:** `scaled-cook-card-verify-1`  
**Candidate commit:** `fa0690f6b96e73ca9acb20cff974f17190ed6d79`  
**Live URL:** https://scaled-cook-card.sociobot.in  
**Verified:** 2026-08-28

## Verdict

**FAIL.** The deployed site is an exact byte-for-byte match for the candidate build, but the normal post-cook correction flow can silently discard the entered actual yield. This violates the core brief requirement to save actual yield and corrections locally. The live deployment also does not meet the required long-lived immutable caching policy for hashed assets.

No product source code was changed during verification.

## Defects

### High — actual yield can be lost while completing a cook

`activateRecipe()` schedules a toast dismissal which calls `render()` after 3.2 seconds. `render()` recreates the cook-completion form from scratch, discarding values typed but not submitted.

Fresh live reproduction at 390 x 844:

1. Clear storage, select **Cook the sample**, and wait 2.7 seconds.
2. Start cook mode, advance to completion, and enter `5.5` in **Actual yield**.
3. Wait 0.9 seconds, crossing the pending toast timeout; the input becomes empty. Save the correction.
4. The saved ledger contains the substitution only (`shallot`), not `Made 5 ½ servings`.

The committed Playwright core-flow test is correspondingly flaky. `npx playwright test --project=chromium --grep 'imports sample, scales amounts' --repeat-each=3` produced **2 failed / 1 passed**. Each failure timed out waiting for `Made 5 ½ servings`; its page snapshot showed the saved substitution and no actual-yield text. An isolated run can pass when the flow completes before the pending toast render.

### Medium — hashed production assets are cached for only 30 seconds

The live response for `/assets/index-DSOQOeuH.js` (74,181 bytes), `/assets/style-Sjdb9JSJ.css` (18,018 bytes), and `/hero-notebook-1280.avif` (94,495 bytes) is `Cache-Control: public, must-revalidate, max-age=30`. The performance contract requires long-lived immutable caching for hashed assets. `public/staticwebapp.config.json` configures security headers but no caching policy.

## Evidence that passed

### Clean local checkout and build

- Began on clean `main` at the candidate SHA.
- `npm ci`: completed; `npm audit` reported 0 vulnerabilities.
- `npm test`: **5/5 passed**.
- `npm run typecheck`: passed.
- `npm run build`: passed and wrote `dist/`.
- Production output: JavaScript 74.18 KB raw / 25.47 KB gzip; CSS 18.02 KB raw / 4.90 KB gzip — both within budget.

### Browser and product behavior

- Independent committed browser checks passed across Desktop Chromium and 390 x 844 mobile Chromium: invalid-import recovery (2/2), landing axe check (2/2), direct legal routes (2/2), paid-unlock surface (2/2), and offline saved-card reload (2/2).
- A normal JSON import with mixed fractions and an explicit `ingredients` step binding scaled 1 1/2 slices at 2 servings to **2 1/4 slices** at 3 servings, in both the ingredient list and all bound steps.
- Boundary serving value `0.25` rendered 25 g pasta. Invalid `-1` recovered to the prior valid value (`0.25`). Cook mode advanced with ArrowRight. Unsupported screen wake left controls usable.
- Live axe scans of landing, imported workspace, and cook dialog had **zero serious or critical violations**. Keyboard Tab gave the skip link, cook controls, and wake checkbox a visible `rgb(23, 105, 141) solid 3px` focus outline. Reduced-motion context reduced transitions to 0.01 s. Browser probes reported zero console and page errors.

### Deployment identity, privacy, policy, and performance

- SHA-256 comparisons found live `index.html`, service worker, manifest, favicon, all hero variants, JS, and CSS **identical** to local `dist/`. `/`, `/privacy`, `/terms`, `/sw.js`, and `/manifest.webmanifest` returned HTTP 200.
- The initial page made no cross-origin requests. Recipes, servings, records, and license state use localStorage. With a deliberately invalid `?license=` token, the URL was scrubbed and the sole cross-origin request was the documented Sociobot verification endpoint; no recipe data was sent. No analytics, third-party fonts, scripts, or CDN requests were observed.
- Live headers include HTTPS, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, camera/microphone/geolocation-denying Permissions-Policy, and the declared CSP with `frame-ancestors 'none'`.
- Lighthouse 12.8.2 mobile run against the live URL: **Performance 98**, **Accessibility 100**, LCP **1.7 s**, TBT **141 ms**, CLS **0**.

## Required next steps

1. Preserve pending completion-form values across incidental renders (or avoid a full render from toast expiry), then add a regression test that crosses the 3.2-second toast boundary before saving an actual yield.
2. Configure immutable, long-lived cache headers for fingerprinted `/assets/*` files and appropriate versioned static-image caching; redeploy and re-check live response headers.
3. Re-run the complete E2E suite repeatedly, the mobile Lighthouse run, and this verification after the fixes.

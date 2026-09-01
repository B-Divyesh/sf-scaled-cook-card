# Independent verification 7 — FAIL

## Scope and decision

**FAIL.** Candidate commit `d1301126a38fb52a012db5c6ebba1e85c6fa7521` was checked from a clean worktree and fresh `npm ci` installation against <https://scaled-cook-card.sociobot.in> on 2026-09-01 UTC.

The free recipe workflow works end to end, and the live static files match the candidate build. Release acceptance is blocked because one required claim command failed during its first exact run, and the advertised one-time purchase cannot be completed on the live service.

Cold first read: the page says it scales recipe amounts in every cooking step for home cooks whose hands are busy. The first action is **Try it with sample data**, which opens the ready Weeknight tomato pasta cook card in one click. The desktop and 390px first screens also show the offline, price, and browser-storage facts.

## Findings by severity

### High — required claim check is not reliable

The exact command below failed on its first run from the clean candidate:

```text
npm run test:e2e -- --grep @claim:free-card-limits --project=chromium
```

Playwright reached its 30-second limit in `saveCorrection` at `tests/e2e/app.spec.ts:229`, waiting for a button named `Next step`. The imported card has one step, so its cook dialog correctly presents `Finish & note changes`. The check evaluates visibility immediately after opening the asynchronously rendered dialog; when that evaluation runs too early, it follows the wrong branch and waits for a control that does not belong to the one-step state.

The exact command passed on one immediate rerun. A separate ten-repeat measurement passed 10/10, and the complete browser suite later passed. The real one-step user flow also completed in direct live checking. This evidence identifies timing instability in the claim check rather than a confirmed loss of saved data. The acceptance contract nevertheless states that any failing claim test blocks release.

### High — advertised one-time purchase is unavailable

The first screen states `$9 once for optional history` and provides **View history upgrade**. The live dialog then states `Checkout is unavailable right now` and contains no purchase link. A fresh request to the documented product checkout route returned HTTP 404 with:

```json
{"error":"enabled factory product","status":404}
```

The free cook card remains usable, and existing licenses can still be entered and verified. However, a new visitor cannot complete the advertised one-time purchase.

### Critical, medium, and low

No additional findings.

## Required claim checks

Every command in `.factory/claims.json` was run exactly as listed before broader inspection.

| Check that the stated behavior is observable | Result |
| --- | --- |
| Confirm that imported linked quantities retain exact fractions and scale in steps | PASS — 2 browser projects |
| Confirm that the documented YAML recipe fields parse | PASS — 1 check |
| Confirm that a step can bind an ingredient-id list | PASS — 1 check |
| Confirm that actual-yield corrections survive the 3.2-second ready-message boundary | PASS — 2 browser projects |
| Confirm that arrow-key cooking remains available without screen wake | PASS — 2 browser projects |
| Confirm that the displayed scaled cook card exports as JSON | PASS — 2 browser projects |
| Confirm that a saved sample card reloads offline | PASS — 2 browser projects |
| Confirm that demo activity stays in the `demo:scc:` namespace | PASS — 2 browser projects |
| Confirm that the cooking flow makes only same-origin runtime requests | PASS — 2 browser projects |
| Confirm that checkout visibility is build-gated and a fixture license restores | PASS — 2 checks passed; 2 checkout-only checks skipped in the default build |
| Confirm that a checkout-enabled build displays `$9 once` and the documented hosted URL | PASS — 1 check |
| Confirm that a fixture paid license retains multiple cards and corrections | PASS — 1 check |
| Confirm that the free tier retains one card and its latest correction | **FAIL on first exact run**; immediate exact rerun passed |
| Confirm that a revoked fixture response removes paid-history access | PASS — 1 check |
| Confirm that artwork provenance and source records are retained | PASS — 1 check |
| Confirm that no direct payment-provider SDK or product identifier is embedded | PASS — 1 check |
| Confirm that versioned assets have a one-year cache rule | PASS — 1 check |

The landing page and README claim cross-check found corresponding entries for their observable product statements.

## Local installation and quality checks

- Confirm that the checkout began from the requested commit and a clean worktree: PASS. `HEAD` and `origin/main` were both `d1301126a38fb52a012db5c6ebba1e85c6fa7521`.
- Confirm that locked dependencies install: `npm ci` — PASS; 171 packages installed and the audit reported zero vulnerabilities.
- Confirm that unit and deployment checks pass: `npm test` — PASS, 15/15.
- Confirm that lint checks pass: `npm run lint` — PASS.
- Confirm that TypeScript checks pass: `npm run typecheck` — PASS.
- Confirm that the exact production build writes `dist/`: `npm run build` — PASS.
- Confirm that the complete browser suite passes after the isolated claim failure: `npm run test:e2e` — PASS, 55 passed and 5 expected checkout-disabled skips.
- Confirm that the initial bundle stays within budget: PASS. JavaScript is 80.27 kB raw / 27.08 kB gzip; CSS is 21.10 kB raw / 5.37 kB gzip; the selected AVIF hero is 94.50 kB; no web font is downloaded.

## End-to-end product checks

- Confirm that one click opens a realistic sample with five ingredients and four linked steps: PASS.
- Confirm that scaling four servings to six changes pasta to 600 g in both the list and its step: PASS.
- Confirm that 0.25 and 999 serving boundaries work and that 1000 returns to the last valid value with a recovery message: PASS.
- Confirm that a malformed recipe keeps the import dialog open and explains the required correction: PASS.
- Confirm that a YAML file loads, renders a mixed fraction, and binds that quantity into its step: PASS.
- Confirm that a file over 1 MB is refused with a clear size message: PASS.
- Confirm that cook mode starts by keyboard, advances with ArrowRight, and saves actual yield, substitutions, and notes: PASS.
- Confirm that a negative actual yield is not submitted and that zero is accepted and displayed: PASS.
- Confirm that reset restores the sample and leaving demo removes demo keys while preserving a real-data sentinel: PASS.
- Confirm that JSON export reflects the displayed six-serving amounts: PASS.
- Confirm that a one-step imported card can save a correction in direct use: PASS.

## Accessibility and responsive checks

- Confirm that the standard URL check finds a title, `lang="en"`, one H1, one main landmark, complete image alternatives, labelled buttons, and no console errors: PASS.
- Confirm that the first Tab reaches the skip link and focus uses a visible 3px blue outline: PASS.
- Confirm that keyboard-only navigation reaches the sample action, demo controls, serving controls, and cook action, and that Enter and ArrowRight operate cook mode: PASS.
- Confirm that the import dialog has an accessible name, receives focus, closes with Escape, and returns focus to its opener: PASS.
- Confirm that route changes move focus to the new H1 and announce the change: PASS.
- Confirm that Playwright axe finds no serious or critical issues on the landing page, workspace, cook dialog, import dialog, upgrade dialog, Privacy, Terms, Artwork, and missing-page views: PASS.
- Confirm that the 390px layout has no horizontal overflow at normal size or 200% text, and that visible controls meet the 44px target: PASS.
- Confirm that reduced-motion mode removes material transitions and animation: PASS.
- Confirm that the single light treatment is intentional and documented in `.factory/design.md`: PASS; a second theme is not part of this visual thesis.

## Privacy, network, and platform checks

- Confirm that the complete demo cooking flow sends only same-origin document, script, stylesheet, image, and route requests: PASS. No analytics or third-party runtime request was observed.
- Confirm that no runtime Azure key, Sociobot key, third-party script, or external font is present: PASS.
- Confirm that response headers include HSTS, `nosniff`, strict-origin referrer policy, camera/microphone/geolocation restrictions, and a response-header CSP with `frame-ancestors 'none'`: PASS.
- Confirm that HTML and the service worker revalidate after 30 seconds: PASS.
- Confirm that the hashed JavaScript/CSS and versioned AVIF use `public, max-age=31536000, immutable`: PASS.
- Confirm that the service worker controls the page, uses cache `scaled-cook-card-v7`, accepts an update check, and reloads the saved demo offline: PASS.
- Confirm that direct `/demo`, `/privacy`, `/terms`, and `/artwork` routes return 200 with route-specific metadata, and an unknown route returns the designed 404 with HTTP 404: PASS.
- Confirm that rendered same-origin links resolve: PASS.
- Confirm that the product-specific license verification route enforces a request allowance: PASS. In a fresh minute window, 30 requests returned 200; request 31 returned 429 with `Retry-After: 3`; a request after four seconds returned 200.
- Confirm that sign-in requirements apply: not applicable. This product has no account or sign-in flow.

The refreshed live browser record is `.factory/evidence-polish-3/live-qa/live-browser.json`.

## Live identity and performance

The live JavaScript, CSS, and service worker are byte-for-byte equal to the fresh candidate build:

| File | SHA-256 |
| --- | --- |
| `assets/index-D04khHhB.js` | `c144115c3abd20ed3df36e814e3b1e296753207412e02652d6546437730ff9ff` |
| `assets/style-DFv06S3l.css` | `93fa85c64d0c06983a3c99ecce0dd38419b5e4035a167aa5891dc44338afb76c` |
| `sw.js` | `0585a7fbf93bf9392a150c79f1fc2b44a66ea681fdbaf4749e553a3bd8622e66` |

Fresh mobile Lighthouse on `/demo`: performance 98, accessibility 100, best practices 100, SEO 100; FCP 1.2 s, LCP 1.3 s, total blocking time 180 ms, CLS 0.

## Reproduction

```bash
npm ci
npm test
npm run lint
npm run typecheck
npm run build
npm run test:e2e
npm run test:e2e -- --grep @claim:free-card-limits --project=chromium
```

Open <https://scaled-cook-card.sociobot.in/demo> for the isolated sample flow.

# Independent verification 8 — PASS

## Decision and scope

**PASS.** Candidate commit `778e5cb06664bf722c7de0cb38abba138aee023f` was independently verified from a detached clean worktree with a fresh locked dependency installation on 2026-09-01 UTC. The deployed site at <https://scaled-cook-card.sociobot.in> matches that candidate.

Cold first read: this page scales recipe amounts in every cooking step, for home cooks who need correct quantities while their hands are busy. The first action is **Try it with sample data**; one click opens the realistic Weeknight tomato pasta cook card. It is present on the first desktop and 390px screens, alongside the offline, local-browser-storage, and purchase-availability facts.

## Findings by severity

| Severity | Finding |
| --- | --- |
| Critical | None. |
| High | None. |
| Medium | None. |
| Low | None. |

Kitchen Pass checkout is deliberately unavailable in this release and is stated plainly; the release does not display a price or buy link. This is not a defect in the free, local-first product.

## Required claim checks

Every command declared in `.factory/claims.json` was run unchanged from the clean candidate worktree before broader QA. All 17 passed.

| Claim id | Result |
| --- | --- |
| `recipe-import-scaling` | PASS |
| `recipe-format` | PASS |
| `step-binding-list` | PASS |
| `actual-yield-correction` | PASS |
| `cook-controls` | PASS |
| `json-export` | PASS |
| `offline-reload` | PASS |
| `demo-sandbox` | PASS |
| `local-only-recipe-data` | PASS |
| `kitchen-pass` | PASS |
| `kitchen-pass-price` | PASS in the checkout-enabled fixture build |
| `paid-history-limits` | PASS |
| `free-card-limits` | PASS |
| `billing-terms` | PASS in the checkout-enabled fixture build |
| `art-provenance` | PASS |
| `payment-integration` | PASS |
| `versioned-asset-cache` | PASS |

The landing page and README claims cross-check found corresponding claim entries; no unlisted reliance claim was found.

## Local quality checks

- `npm ci` — PASS; 171 packages installed, audit reported zero vulnerabilities.
- `npm test` — PASS; 15/15 tests.
- `npm run lint` — PASS.
- `npm run typecheck` — PASS.
- `npm run build` — PASS and produced `dist/`.
- The complete Playwright suite (`npx playwright test`, using the same config as `npm run test:e2e` against the freshly built candidate preview) — PASS; 55 passed, 5 expected checkout-disabled skips. This covers desktop and 390px mobile, keyboard controls, dialog focus restoration, route focus announcements, 200% text reflow, touch targets, service-worker update checking, privacy, and axe coverage.

Production output is within the static-web budget: JavaScript is 80,331 B raw / 27.05 kB gzip, CSS is 21,103 B raw / 5.37 kB gzip, and the selected AVIF hero is 94,495 B. No runtime web font is fetched.

## End-to-end, accessibility, privacy, and PWA evidence

- Live `?demo=1` opened the persistent **Demo — sample data, nothing is saved** banner and sample recipe. Scaling from four to six showed `600 g` pasta; ArrowRight moved cook mode to step 2 of 4; a 5.5-serving correction saved successfully.
- A malformed `title: Broken` import produced `Servings must be a number or fraction.` and retained the import dialog for recovery. The full suite also exercises fraction imports, YAML, serving boundaries, file-size rejection, zero yield, JSON export, demo reset/exit, and free/paid storage limits.
- The live cooking flow made only same-origin document, script, stylesheet, image, service-worker, and route requests. It emitted no console or page errors and stored demo state only under `demo:scc:` keys.
- Fresh live axe on the 390px demo found zero violations, including zero serious/critical findings. The full suite separately checks landing, workspace, cook/import/upgrade dialogs, privacy, terms, artwork, and 404 views. Keyboard focus is visible; the first focus target is the skip link; reduced-motion and 200% text cases pass.
- A fresh live service-worker context was controlled by `https://scaled-cook-card.sociobot.in/sw.js`; after first load, an offline reload of `?demo=1` returned 200, retained the sample card and banner, and produced no errors. The worker uses versioned cache `scaled-cook-card-v8`, calls `skipWaiting`, and claims clients on activation.
- Direct `/demo`, `/privacy`, `/terms`, and `/artwork` routes returned 200 with their route titles; an unknown route returned the designed 404 with HTTP 404. Checked same-origin page links resolved.

## Headers, caching, and live identity

Live responses send HSTS, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, camera/microphone/geolocation restrictions, and a response-header CSP containing `frame-ancestors 'none'`. HTML and `sw.js` revalidate after 30 seconds; hashed assets use `public, max-age=31536000, immutable`.

The deployed artifact is exactly the candidate build:

| File | SHA-256 |
| --- | --- |
| `assets/index-BJSHDrOR.js` | `4e809d9b34f1ad5fa8b89477b250353e43a53579da6b1e30dfec7c2821f9564f` |
| `assets/style-DFv06S3l.css` | `93fa85c64d0c06983a3c99ecce0dd38419b5e4035a167aa5891dc44338afb76c` |
| `sw.js` | `613f941fa5b742dbc9252b0bb886498b5dd06afd38faca5a071694d6ca70912c` |

## Product endpoint allowance

The static app has no product-owned server endpoint. Its optional explicit license-restore flow calls the documented Sociobot product verification endpoint. From one client, 30 consecutive verification requests returned 200; request 31 returned HTTP 429 with `Retry-After: 3` (and `X-RateLimit-After: 3`); a request after four seconds returned 200. There is no sign-in flow.

## Reproduction

```bash
npm ci
npm test
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

Use <https://scaled-cook-card.sociobot.in/demo> for the isolated sample flow.

# Scaled Cook Card — repair handoff

## Release status

The non-checkout findings from independent verification 2 are repaired and covered by regressions. The external Kitchen Pass checkout remains an operator-owned environment gate: its production endpoint previously returned 404, so this repair does not retry or alter it. The purchase link now opens separately and leaves the free card usable; the license restore path is proven with a deterministic intercepted verification fixture.

## What changed

- Reproduced the reported `3/16 tsp` defect before the fix: the new regression initially received `⅙` instead of `3/16`. The formatter now accepts only exact/common fractions within floating-point noise and prints non-Unicode exact fractions as `n/d`.
- Added browser coverage for exact fraction rendering in both the ingredient list and bound step, then scaling it to `⅜`.
- Enforced the displayed 0.25-serving minimum and made a saved zero actual yield visible as `Made 0 servings`.
- Restored focus to dialog triggers, moved focus and announced client-side route changes, and added explicit mobile target and 200% text-reflow tests.
- Completed the landing skeleton, $9 paid-tier section, privacy boundary, Param Factory/build footer, metadata, canonical/social/touch assets, crawler files, direct app routes, and a styled response-overridden 404 page.
- Added the full claims inventory, exact tagged regression commands, copy audit, lint script/configuration, service-worker update coverage, and social/touch asset provenance.

## Verification evidence

Ran from a clean dependency install on 2026-08-30 UTC:

```text
npm ci                                      PASS — 171 packages; 0 vulnerabilities
npm audit --omit=dev                        PASS — 0 vulnerabilities
npm run lint                                PASS
npm run typecheck                           PASS
npm test                                    PASS — 12/12
npm run build                               PASS — dist/index.html
npm run test:e2e -- --project=chromium      PASS — 17 passed, 1 mobile-only skip
npm run test:e2e -- --project=mobile        PASS — 18/18 at 390 × 844
```

Every declared claim command passes. Browser claims run in both Chromium projects (2 passing checks each); the two parser claims run once in Vitest:

```text
@claim:recipe-import-scaling       PASS
@claim:recipe-format               PASS
@claim:step-binding-list           PASS
@claim:actual-yield-correction     PASS
@claim:cook-controls               PASS
@claim:json-export                 PASS
@claim:offline-reload              PASS
@claim:demo-sandbox                PASS
@claim:local-only-recipe-data      PASS
@claim:kitchen-pass                PASS — intercepted valid-license fixture; no live checkout request
```

Accessibility and response checks:

- Playwright axe: landing, workspace, cook dialog, and privacy route — **0 serious/critical violations** (6 project checks).
- `verify-url.sh http://127.0.0.1:4173`: HTTP 200; title, `lang`, one `<h1>`, `<main>`, image alts, and button labels present; zero console/page errors. Evidence: `.factory/evidence-repair/verify.json` and its desktop/mobile captures.
- Local mobile Lighthouse: **100 performance / 100 accessibility**; LCP **1.81 s**, TBT **16 ms**, CLS **0**. Evidence: `.factory/evidence-repair/lighthouse.json`.
- Final production bundle: JS **79.13 KB raw / 26.81 KB gzip**; CSS **20.15 KB raw / 5.23 KB gzip**; social image **99 KB**; no shipped fonts.
- Privacy capture remains same-origin through demo import, cook, and save. The only license test request is the recorded/intercepted verification fixture, which contains no recipe data.
- Offline reload and service-worker `registration.update()` both pass in isolated browser contexts. The worker cache is now `scaled-cook-card-v4`.

## Deployment note

`dist/` is the unchanged static-web deployment class. `public/staticwebapp.config.json` now rewrites only `/demo`, `/privacy`, and `/terms` to the app shell, returns the designed `/404.html` for unknown paths, preserves immutable caching for hashed assets/versioned hero art, and retains the existing restrictive response policy.

## Remaining external action

Before public release, the billing operator must enable the registered `scaled-cook-card` checkout route. This work intentionally did not call, configure, or modify that external endpoint. Everything else in the verifier report is repaired locally and committed with this handoff.

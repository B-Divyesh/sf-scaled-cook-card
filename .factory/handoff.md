# Scaled Cook Card — repair handoff

## Release status

**PASS locally; static deployment output:** `dist/` for `https://scaled-cook-card.sociobot.in`.

This repair addresses the independent verifier report at commit `7804a6ab58fbbc99e89d98609a17bf77dfc4e37c`, against candidate `fa0690f6b96e73ca9acb20cff974f17190ed6d79`. The product remains a Vite + TypeScript static web app.

## What was repaired

1. **An actual yield cannot be erased by the ready-toast timeout.** The original candidate’s 3.2-second toast dismissal called `render()`, recreating the open completion form. The current implementation clears only the existing toast live-region text. It leaves the form and all unsaved inputs in place.
2. **The failure was reproduced before repair verification.** In a detached worktree at the verifier’s candidate SHA, a controlled 390px Playwright clock entered `5.5` actual yield and a substitution, advanced exactly 3.2 seconds, and received an empty actual-yield input. That regression fails on the candidate and passes on this revision.
3. **Immutable production caching remains configured.** Vite’s fingerprinted `/assets/*` files and the versioned `hero-notebook-v1-*` files receive `Cache-Control: public, max-age=31536000, immutable` through `public/staticwebapp.config.json`. The hero URLs are versioned and the service-worker cache is `scaled-cook-card-v3`, so a changed artifact gets a new URL/cache.
4. **The demo is now a real sandbox.** `/demo` opens the shipped Weeknight tomato pasta card immediately. It uses the `demo:scc:` browser-storage namespace; the normal card uses `scc:`. Reset demo clears only demo keys, and Start for real discards demo data and returns to the normal landing page.
5. **Claims and route metadata are covered.** `.factory/claims.json` maps observable claims to tagged browser tests. Privacy and terms set their route-specific page titles, and the response-policy unit test protects the deployed CSP/security-header configuration.

## How to run and verify

```bash
npm ci
npm test
npm run typecheck
npm run build
npm run test:e2e
npm run test:e2e -- --grep @claim:
```

Demo: open `/demo` (or `?demo=1`). See [`.factory/demo.md`](demo.md) for the sample and storage isolation.

## Exact verification evidence

Run on 2026-08-30 from a clean `npm ci` install:

```text
npm ci                                      PASS; 0 vulnerabilities
npm test                                    PASS; 8/8 tests
npm run typecheck                           PASS
npm run build                               PASS; dist/index.html produced
npm run test:e2e                            PASS; 18/18 desktop + 390px tests
npm run test:e2e -- --grep @claim:          PASS; 8/8 claim runs
verify-url.sh local production preview      PASS; 200, no console/page errors
Playwright axe scan                         PASS; no serious/critical violations
Lighthouse 12.8.2 local production preview  Performance 99, Accessibility 100
                                             LCP 1.9 s, TBT 0 ms, CLS 0
```

The final build is 75.56 KB JavaScript raw / 25.87 KB gzip and 18.50 KB CSS raw / 4.98 KB gzip. Both are within the static-product budgets. The local preview intentionally does not emulate Azure Static Web Apps cache headers; `tests/deployment.test.ts` asserts the exact immutable route rules and response policy that deploy with `dist/`.

The full browser suite covers import/error recovery, scaling, desktop and 390px keyboard cooking, exact timeout-boundary correction saving, direct demo isolation, direct legal routes and titles, paid restore UI, offline saved-card reload in a dedicated browser context, privacy request capture, and axe scanning. The URL verifier checked title, language, one `<h1>`, main landmark, image alt text, unlabeled buttons, mobile rendering, and console errors.

## Privacy and scope

Recipes, serving choices, corrections, and demo data stay in browser local storage. The claim regression records every request while saving a recipe correction and allows only the same origin. There are no analytics, third-party fonts, or third-party runtime assets. License verification remains the sole documented external request and is only attempted when a license token exists; demo mode never reads or writes the normal recipe namespace.

## Deployment handoff

Push the committed `main` revision to trigger the configured Azure Static Web Apps deployment. After deployment, verify the live revision’s hashed JavaScript changes, `scaled-cook-card-v3` service worker, direct `/demo` route, and the immutable cache header on `/assets/*` plus the three `hero-notebook-v1-*` assets. No known release-blocking gaps remain.

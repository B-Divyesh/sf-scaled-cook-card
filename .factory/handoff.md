# Scaled Cook Card — verification 4 handoff

## Release status

**PASS — candidate `147fad15e5b98c9b2a9ffbcd5e6b8a46f9ea9041` is ready.**

Independent verification on 2026-08-30 UTC covered the clean local checkout and <https://scaled-cook-card.sociobot.in>. The live deployment matches the candidate production build byte for byte. No product code was modified.

## Defects

- Critical: none.
- High: none.
- Medium: none.
- Low: none.

Known operational limitation: Kitchen Pass checkout is deliberately disabled in the default release because its separately owned billing route is not enabled. The UI states that checkout is unavailable and exposes no dead buy link. License restore remains fixture-verified, and the free scaling/cooking/export/correction workflow is complete.

## Verification summary

```text
npm ci                                      PASS — 171 packages, 0 vulnerabilities
all 10 exact .factory/claims.json commands PASS
npm test                                    PASS — 12/12
npm run lint                                PASS
npm run typecheck                           PASS
npm run build                               PASS — dist/ produced
npm run test:e2e                            PASS — 39 passed, 1 expected mobile-only skip
npm run test:checkout-enabled -- --project=chromium
                                            PASS — 1/1
independent live browser checks             PASS — 43/43
```

The first screen plainly states what the product does, names home cooks, and offers one-click sample data. Live import, exact fraction scaling, list/inline bindings, serving boundaries and recovery, keyboard cook mode, correction persistence, JSON export, demo isolation/reset/exit, local-only requests, responsive reflow, touch targets, reduced motion, axe, service-worker update, and offline reload all passed.

Live Lighthouse mobile: **100 performance / 100 accessibility / 100 best practices / 100 SEO**, LCP **1.5 s**, TBT **20 ms**, CLS **0**. JS is **78.85 KB raw / 26.48 KB gzip** and CSS is **20.56 KB raw / 5.31 KB gzip**. Hashed assets have one-year immutable caching. Required security headers are present.

The static product has no candidate-owned server endpoint. Per the explicit resource boundary, no request was sent to the separately owned billing API; its client path was tested with a recorded intercepted fixture, so no fresh external 429 allowance was measured.

## Evidence and rerun

The full report is `.factory/verification-4.md`. Reproducible browser evidence and the harness are under `.factory/evidence-verification-4/` and `.factory/qa-live.mjs`.

```bash
npm ci
npm test
npm run lint
npm run typecheck
npm run build
npm run test:e2e
node .factory/qa-live.mjs
```

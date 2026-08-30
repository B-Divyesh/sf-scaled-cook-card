# Scaled Cook Card — independent verification handoff

## Release status

**FAIL** for candidate `a83316d118afa080715ce07b182dc3a55a258891` at <https://scaled-cook-card.sociobot.in>, verified 2026-08-30 UTC.

The deployment now matches the candidate byte-for-byte and the previous toast-timeout and immutable-cache defects are repaired. This candidate still must not release because it renders some fractions incorrectly, its $9 checkout returns 404, and its claims/accessibility/site-structure coverage is incomplete. Full evidence and reproduction details are in [`.factory/verification-2.md`](verification-2.md).

## Highest-priority defects

1. Importing `3/16 tsp` at unchanged servings renders `⅙ tsp` in both the list and bound step (11.1% low).
2. `https://api.sociobot.in/api/v1/products/scaled-cook-card/checkout` returns HTTP 404, so Kitchen Pass cannot be purchased.
3. Core scaling/import/export/cook/paid claims are absent from `.factory/claims.json`; the claims contract makes this release-blocking.
4. Target servings below 0.25 are applied, zero actual yield is hidden, 200% text causes horizontal overflow, route/dialog focus is lost, and mobile targets fall below 44 px.
5. Required canonical/social metadata, crawler files, real 404, landing sections, footer attribution/build id, and `.factory/copy-audit.md` are missing.

## Verification commands and results

```text
npm ci                                      PASS; 0 vulnerabilities
npm test                                    PASS; 8/8
npm run typecheck                           PASS
npm run build                               PASS
npm run test:e2e                            PASS; 18/18
four exact .factory/claims.json commands    PASS; 2/2 each
verify-url.sh live                          PASS; no console/page errors
Playwright axe, four live states            PASS; 0 serious/critical
Lighthouse 12.8.2 live mobile               98 performance / 100 accessibility
```

Build output is 75.56 KB JS raw / 25.87 KB gzip, 18.50 KB CSS raw / 4.98 KB gzip, and a 94.50 KB mobile hero AVIF. LCP was 1.6 s, TBT 160 ms, and CLS 0.

Privacy request capture passed: the full demo flow made only same-origin requests. Invalid-license verification sent only the token to the documented Sociobot endpoint. The verification API allowed 30 rapid requests and returned 429 on the 31st with `Retry-After: 2`, then recovered after 3 seconds.

The PWA worker activated, deleted a seeded stale cache, retained only `scaled-cook-card-v3`, updated successfully, and reloaded `/demo` offline.

## Evidence

- Full report: [`.factory/verification-2.md`](verification-2.md)
- URL verifier JSON: [`.factory/evidence-2/verify.json`](evidence-2/verify.json)
- Desktop capture: [`.factory/evidence-2/screenshot-desktop.png`](evidence-2/screenshot-desktop.png)
- Mobile capture: [`.factory/evidence-2/screenshot-mobile.png`](evidence-2/screenshot-mobile.png)

No product source code was changed. Next work should address the defects above, add regression/claim tests, rebuild, redeploy, and run a fresh independent verification.

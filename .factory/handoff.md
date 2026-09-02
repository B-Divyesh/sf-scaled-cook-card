# Scaled Cook Card — verification 9 handoff

## Outcome

**PASS.** Independent verification of candidate `3a08fc68a8ee36518f197e0f063946b415daa0fa` at <https://scaled-cook-card.sociobot.in> found no release-blocking defects. The deployed HTML, JavaScript, CSS, and service worker match the candidate build byte-for-byte.

The full report is [verification-9.md](verification-9.md). Product code was not changed during verification.

## What was verified

- All 18 commands in `.factory/claims.json` passed individually from a clean candidate worktree.
- Lint, typecheck, 15/15 unit/deployment tests, the exact production build, 57 enabled browser tests, and 4 checkout-enabled tests passed.
- The cold first screen names the job, the home cook, and the one-click sample action.
- Import, exact fraction scaling, step binding, cook mode, wake fallback, correction storage, export, invalid-input recovery, demo isolation, offline reload, and license restore were exercised end to end.
- Desktop, 390 px mobile, 200% text, keyboard-only use, focus restoration, reduced motion, touch targets, and axe serious/critical checks passed.
- The complete normal cooking flow made only same-origin requests and logged no console/page errors.
- Headers, caching, HTTPS redirect, direct routes, designed 404, service-worker update, and offline control passed.
- Fresh Lighthouse mobile scored 100 in performance, accessibility, best practices, and SEO; LCP was 1.6 s and CLS was 0.
- The license verifier allowed 30 requests; request 31 returned 429 with `Retry-After: 4`; it recovered after the wait.

## Run locally

```bash
npm ci
npm run lint
npm test
npm run typecheck
npm run build
npm run test:e2e
npm run test:checkout-enabled
```

The isolated sample is at <https://scaled-cook-card.sociobot.in/?demo=1>. **Reset demo** restores the shipped sample. **Start for real** discards the `demo:scc:` namespace.

## Findings by severity

- Critical: none.
- High: none.
- Medium: none.
- Low: none.

## Known operational limitation

Kitchen Pass purchase is intentionally disabled in the default build while the hosted checkout route is unavailable. The live UI states this and shows no dead buy link. The free local cook card, export, offline flow, and license restore remain usable.

## Next step

No product repair is required. Enable the checkout build flag only after the Sociobot checkout route is available, then verify a real checkout return token before release of the paid option.

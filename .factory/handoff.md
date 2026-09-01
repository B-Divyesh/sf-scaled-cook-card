# Scaled Cook Card — verification 8 handoff

## Outcome

**PASS.** Candidate `778e5cb06664bf722c7de0cb38abba138aee023f` is deployed at <https://scaled-cook-card.sociobot.in> and independently verified on 2026-09-01 UTC. No release-blocking defects were found.

The app lets a home cook import a self-authored YAML/JSON recipe, scale quantities where they appear in each cooking step, cook with keyboard fallback, and save actual yield, substitutions, and notes locally. `/demo` is a one-click, separate `demo:scc:` sandbox using the Weeknight tomato pasta sample.

## Verified

- Every exact command in `.factory/claims.json` passed from a clean detached candidate checkout.
- `npm test` (15/15), lint, typecheck, exact production build, and full Playwright suite passed (55 passed; 5 intentional checkout-disabled skips; run against the freshly built candidate preview).
- Live 390px and desktop checks passed: visible keyboard focus, skip link, dialog focus return, reduced motion, 200% text reflow, 44px controls, and zero axe serious/critical findings.
- Live recipe flow passed: sample opens in one click, 4 to 6 servings produces 600 g pasta, ArrowRight advances cook mode, a 5.5-serving correction saves, malformed import explains recovery, and demo requests remain same-origin.
- Live service worker controls the app and reloads the demo offline. Cache and response headers are correct; initial JS is 27.05 kB gzip and CSS is 5.37 kB gzip.
- Live hashed JS, CSS, and `sw.js` match the candidate byte-for-byte. Full evidence is in [verification 8](verification-8.md).
- License verification is rate limited: 30 successful requests per observed window; the 31st is 429 with `Retry-After: 3`, and requests recover after four seconds.

## Remaining operator note

Kitchen Pass checkout is intentionally unavailable in the default release. The page states this plainly and exposes no price or buy link; existing licenses can still be restored. Do not enable `VITE_KITCHEN_PASS_CHECKOUT_ENABLED` until the billing operator has registered and independently confirmed the hosted checkout. The free local-first cook card is complete without it.

## Run locally

```bash
npm ci
npm run dev
npm test
npm run lint
npm run build
npm run test:e2e
```

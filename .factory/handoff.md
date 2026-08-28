# Scaled Cook Card — verification handoff

## FAIL — do not release this candidate

Independent QA on 2026-08-28 verified commit `fa0690f6b96e73ca9acb20cff974f17190ed6d79` at https://scaled-cook-card.sociobot.in. The live deployment is byte-for-byte identical to this candidate, but it does not meet the acceptance contract.

The complete evidence and reproduction steps are in [`.factory/verification.md`](verification.md). No product source code was changed by the verifier.

### Release-blocking defect

The initial “recipe is ready to scale” toast expires after 3.2 seconds and performs a full render. If a cook has opened the completion form and entered an actual yield when that timeout expires, their value is silently erased. Saving then stores substitutions/notes but not the actual yield. This directly breaks the brief's required post-cook actual-yield correction flow. It was reproduced on the live 390 px site and made the committed Chromium core-flow test fail 2 of 3 repeated attempts.

### Other required fix

Live hashed JS, CSS, and hero assets all return `Cache-Control: public, must-revalidate, max-age=30`; they need long-lived immutable caching to meet the static/PWA performance contract.

## What passed

`npm ci`, `npm test` (5/5), TypeScript checking, and the exact `npm run build` command passed. Bundles are within budget (74.18 KB JS raw, 18.02 KB CSS raw). The app passed independent desktop and 390 px checks for valid JSON/YAML-style scaling, invalid import recovery, serving boundaries, cook keyboard navigation, offline saved-card reload, legal routes, and paid restore UI. Live axe scans had no serious/critical findings; focus and reduced-motion behavior passed. Live Lighthouse mobile: Performance 98, Accessibility 100, LCP 1.7 s, TBT 141 ms, CLS 0. Privacy and security checks found local-first recipe storage, no initial third-party requests, no tracking, and appropriate CSP/permissions/referrer/nosniff headers.

## Verify after fixes

```bash
npm ci
npm test
npm run typecheck
npm run build
npm run test:e2e
```

Then repeat the live correction reproduction across the toast expiry boundary, check the full desktop/mobile suite repeatedly, and confirm immutable cache headers on hashed assets.

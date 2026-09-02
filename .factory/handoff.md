# Scaled Cook Card — independent verification 10 handoff

## Outcome

**PASS.** Candidate `93a42bc3c371dfb15e572971107849f8e4023f1f` is verified at <https://scaled-cook-card.sociobot.in>. No product source was changed during verification.

## What was verified

- All 20 required claim commands from `.factory/claims.json` passed independently after `npm ci`.
- `npm test` (16 tests), `npm run lint`, `npm run typecheck`, `npm run build`, `npm run test:e2e` (62 tests), and `npm run test:checkout-enabled` (4 tests) passed.
- The candidate-built JavaScript and live `/assets/index--SJgiHGi.js` match SHA-256: `9b31412a6e45b65b24a7d030096b1e8ca52f72a1d005f93f17bdf4ed4e6e3925`.
- Live desktop/mobile QA passed: first-read/demo gate, import and recovery, scaling/fractions, cook mode, keyboard use, local corrections, offline reload, service-worker update, privacy request log, reduced motion, touch targets, headers, routes, and cache policy.
- `verify-url.sh` passed with no console errors. Axe had zero serious/critical findings. Mobile Lighthouse recorded 100 performance, accessibility, best practices, and SEO.

See [independent verification 10](verification-10.md) and its [live evidence](evidence-verification-10/verify.json).

## How to run and verify

```bash
npm ci
npm run lint
npm test
npm run typecheck
npm run build
npm run test:e2e
npm run test:checkout-enabled
```

Open <https://scaled-cook-card.sociobot.in/?demo=1> for the isolated sample. **Reset demo** restores the supplied pasta card. **Start for real** discards only `demo:scc:` data.

## Known gaps and next steps

None. Kitchen Pass checkout remains intentionally disabled in the public artifact; the complete free local/offline cook-card workflow, export, and license restoration remain usable.

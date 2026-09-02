# Scaled Cook Card — polish 5 handoff

## Outcome

**PASS — no known review finding remains.**

Commit `19c26f426489d1ff93404dbb4eb2768e5eae07d0` registers and proves the final documented recipe-file validation rule. The release is deployed at <https://scaled-cook-card.sociobot.in>.

## What changed

- Added the `recipe-required-fields` claim and one focused tagged test. It tries recipes missing a title, positive servings, ingredients, and preparation steps. Each case asserts the useful validation message.
- Reworded the README rule to match the public claim exactly.
- Advanced the build label to `2026.09.02-polish.5` and the service-worker cache to `scaled-cook-card-v10`.
- Updated the catalog description to the verb-first sentence: `Scale recipe servings and see the right amount in every cooking step.`
- Updated the live verification helper for the current cache and round-five evidence paths.

## Verification

Fresh clone: `/tmp/scaled-cook-card-polish5.PHskBi/repo` at `19c26f4`.

- Every one of the 19 exact commands in [claims.json](claims.json) passed independently, including `@claim:recipe-required-fields`.
- `npm run lint` — PASS.
- `npm test` — PASS, 16 tests.
- `npm run typecheck` — PASS.
- `npm run build` — PASS; `dist/index.html` is at the build root. The initial JavaScript gzip size is 27.05 KB and CSS gzip size is 5.37 KB.
- `npm run test:e2e` — PASS, 62 tests with the expected checkout-only skips in the default build.
- `npm run test:checkout-enabled` — PASS, 4 tests.
- Local semantic/load verifier — PASS, zero console errors: [local verify report](evidence-polish-5/local/verify.json).
- Live semantic/load verifier — PASS, zero console errors: [live verify report](evidence-polish-5/live/verify.json).
- Playwright axe checks found zero serious or critical issues on the landing page, cook dialog, workspace, and Privacy page. The full live audit passed 56/56 checks: [live browser report](evidence-polish-5/live-qa/live-browser.json).
- Live mobile Lighthouse — performance 100, accessibility 100, best practices 100, SEO 100; LCP 1.5 s, CLS 0, TBT 0 ms: [raw report](evidence-polish-5/live/lighthouse-mobile.json).
- Direct live responses: `/`, `/demo`, `/privacy`, `/terms`, and `/artwork` return 200; `/definitely-missing-polish-5` returns the designed HTTP 404.
- The default production artifact deliberately has no checkout URL. The final deployment was `f41f095e-f8fa-4a1c-8f98-719bd48dbdbc`; it superseded a checkout-enabled test artifact before the cold live audit.
- The live JavaScript, CSS, and service worker match the default build by SHA-256: `9b31412a6e45b65b24a7d030096b1e8ca52f72a1d005f93f17bdf4ed4e6e3925`, `93fa85c64d0c06983a3c99ecce0dd38419b5e4035a167aa5891dc44338afb76c`, and `346e8070c9addb9a59f189cdfa61e1fe605ef2194cf9d9b9186da408cdcf21d7`.

## How to run

```bash
npm ci
npm run lint
npm test
npm run typecheck
npm run build
npm run test:e2e
npm run test:checkout-enabled
```

Open <https://scaled-cook-card.sociobot.in/?demo=1> for the isolated sample. **Reset demo** restores the shipped pasta card. **Start for real** clears only `demo:scc:` storage and returns to the blank real workspace.

## Known gaps and next steps

None. Checkout remains deliberately disabled in the public build until the billing operator enables it; free scaling, local storage, export, and license restoration continue to work.

# Scaled Cook Card — polish 3 handoff

## Outcome

**PASS.** Every finding in reviews 1–3 is resolved. The release is deployed at <https://scaled-cook-card.sociobot.in>.

The round-3 workflow heading now reads `Make a cook card in three steps`. The demo works from both `/demo` and `/?demo=1`, uses only `demo:scc:` storage, preserves real-data sentinels, resets to the shipped sample, and discards demo state when leaving.

## Release

- Product repair commits: `4ab611183b24a14b8574c3422c922b6a44313913`, `d279e78aa0f802e5de4ce84e326854299ebaa56b`
- Azure Static Web Apps deployment id: `7c79c838-4189-4f9e-92fe-100e38e9e123`
- Live bundle: `assets/index-D04khHhB.js`
- Service-worker cache: `scaled-cook-card-v7`
- Visible build id: `2026.09.01-polish.3`

## Verification

- Fresh clone at `d279e78aa0f802e5de4ce84e326854299ebaa56b`: all 17 exact commands in `.factory/claims.json` passed.
- `npm test`: 15/15 passed.
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed; `dist/index.html` exists.
- `npm run test:e2e`: 55 passed, 5 expected checkout-only skips.
- JavaScript: 80.27 kB raw / 27.08 kB gzip. CSS: 21.10 kB raw / 5.37 kB gzip.
- Live URL verifier: HTTP 200, correct title and language, one H1, one main, complete image alternatives, labelled buttons, and zero console errors.
- Live browser audit: 52/52 checks passed, including direct routes, metadata, legal links, focus, 404, mobile, privacy, offline, and reduced motion.
- Playwright axe integration: zero serious or critical findings on the landing page, import dialog, workspace, cook mode, Privacy, Terms, Artwork, and missing-page UI.
- Live mobile Lighthouse: performance 100, accessibility 100, best practices 100, SEO 100; LCP 1.6 s, CLS 0, total blocking time 20 ms.

Evidence is in [`.factory/evidence-polish-3`](evidence-polish-3), with the complete finding map in [`.factory/polish-3.md`](polish-3.md).

## Run locally

```bash
npm ci
npm test
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

## Known gaps

None. Kitchen Pass checkout remains intentionally hidden in the default build until the hosted checkout is enabled; its enabled path and revoked-license behavior are fixture-tested.

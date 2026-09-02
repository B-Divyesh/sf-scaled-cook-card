# Scaled Cook Card — polish 4 handoff

## Outcome

**PASS.** Every finding in reviews 1–4 is resolved. The released static app keeps its cook-notebook visual system and complete import, scaling, cook, correction, export, offline, demo, and license-restore flows.

Round 4 changed the unclear header action to `Restore a license`, added a registered screen-wake lifecycle claim, excluded generated evidence bundles from lint, made the Privacy lede literal, and split the free-tier sentence. The catalog description and copy audit are current.

## Run and verify

```bash
npm ci
npm run lint
npm test
npm run build
npm run test:e2e
npm run test:checkout-enabled
```

The isolated sample is at <https://scaled-cook-card.sociobot.in/?demo=1>. `Reset demo` restores the sample, and `Start for real` discards the `demo:scc:` namespace.

## Exact evidence

- Clean clone `/tmp/scaled-cook-card-polish4.AQXuq9/repo` at `3a08fc6`: all 18 `.factory/claims.json` commands passed individually.
- Clean clone: lint PASS; unit/deployment 15/15; build PASS with `dist/index.html`; browser suite 57 passed and 5 expected checkout-only skips.
- Checkout-enabled suite: 4/4 passed. The billing-terms claim also passed separately.
- Production bundle: JavaScript 80.31 kB raw / 27.05 kB gzip; CSS 21.10 kB raw / 5.37 kB gzip.
- Local URL verifier: `.factory/evidence-polish-4/local/verify.json`; no console errors, one H1, one main, complete alt text, and labeled buttons.
- Live URL verifier: `.factory/evidence-polish-4/live/verify.json`; the same checks pass with no console errors.
- Live browser audit: `.factory/evidence-polish-4/live-qa/live-browser.json`; 56/56 checks pass across first read, demo isolation, screen wake, imports, focus, links, 404, mobile, reduced motion, privacy, and offline reload.
- Live Lighthouse mobile: 100 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1.6 s, CLS 0, TBT 30 ms. See `.factory/evidence-polish-4/live/lighthouse-mobile.json`.
- Response evidence: root, demo, Privacy, and Terms return HTTP 200; the unknown route returns HTTP 404. Headers are in `.factory/evidence-polish-4/live/`.
- Visual evidence: desktop landing, 390 px landing, 390 px demo, license dialog, Privacy, and live workspace screenshots are under `.factory/evidence-polish-4/`.
- Clean-build/live SHA-256 values match: JavaScript `9340ddfd68ca8a3339a2b74cd44fe4b68a5d66a41b1b588f8b4b676c6640387f`; CSS `93fa85c64d0c06983a3c99ecce0dd38419b5e4035a167aa5891dc44338afb76c`; service worker `623da020d30db3f02b00104f5035a02802bbb5d04d21da7335da961ca7cf5104`.

## Deployment

- Live URL: <https://scaled-cook-card.sociobot.in>
- Azure resource: `sf-scaled-cook-card`
- Deployment id: `0c42afc1-b2eb-478a-b15a-a7b411886f52`
- Released build label: `2026.09.02-polish.4`
- Service-worker cache: `scaled-cook-card-v9`

Checkout remains intentionally hidden in the default public build until the existing Sociobot product endpoint is enabled. License restore and the full free cook card remain available and tested.

## Known gaps

None.

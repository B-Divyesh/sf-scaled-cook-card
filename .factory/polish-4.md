# Polish 4 — Scaled Cook Card

Repaired review commit `55e4be8678a9dfe92bca95ce19a173df4a222502` in product commit `3a08fc68a8ee36518f197e0f063946b415daa0fa` on 2026-09-02.

## Review 4 finding map

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-11 | Replaced the checkout-disabled header and section action with `Restore a license`; matched the static 404 navigation. | `@claim:kitchen-pass`; `site discovery and social assets`; `header action names license restoration` in `evidence-polish-4/live-qa/live-browser.json`; `local/screenshot-desktop.png`; live `/`. |
| F-4-1 | Registered `screen-wake`. Its browser test proves `request('screen')`, the active message, release on cook exit, and recovery after rejection. | `@claim:screen-wake` passes in both projects; `live cook mode requests and releases screen wake`; live `/?demo=1`. |
| F-4-2 | Excluded only generated `.factory/evidence*/**` bundles from ESLint. Maintained factory scripts remain linted. | `npm run lint` passes in the worktree and clean clone. |
| F-4-3 | Replaced the privacy metaphor with `Your recipes stay in your browser, not in our database.` | `legal routes work directly`; `privacy lede states browser storage directly`; `local/privacy-desktop.png`; live `/privacy`. |
| F-4-4 | Split the free-tier list into two short paragraphs of 12 and 8 words. | `@claim:kitchen-pass`; `free-tier limits use two short sentences`; `local/license-dialog-mobile.png`; live `/`. |

## Earlier finding map

Every earlier item was rechecked against the current source and deployed site.

| Finding | Retained change | Evidence |
| --- | --- | --- |
| F-1-1 | The headline keeps the spoken space before `in every step`. | `keeps word boundaries in the headline and recipe-file label`; live `/`. |
| F-1-2 | The file picker has the accessible name `Choose a recipe file or drop it here`. | Same browser test; live import dialog. |
| F-1-3 | The conditional $9 price remains separately registered. | `@claim:kitchen-pass-price`; checkout-enabled clean-clone run. |
| F-1-4 | Paid storage retains multiple cook cards and corrections. | `@claim:paid-history-limits`. |
| F-1-5 | Device copy promises only license restoration on this device. | `@claim:kitchen-pass`. |
| F-1-6 | Free storage keeps one card and its latest correction. | `@claim:free-card-limits`. |
| F-1-7 | Billing copy is limited to Sociobot checkout and revoked-license behavior. | `@claim:billing-terms`. |
| F-1-8 | Artwork provenance remains registered and linked. | `@claim:art-provenance`; live `/artwork`. |
| F-1-9 | The absence of provider SDKs and product ids remains registered. | `@claim:payment-integration`. |
| F-1-10 | One-year versioned caching remains registered. | `@claim:versioned-asset-cache`; live asset headers. |
| F-1-11 | History and license actions now name their purpose. | Current-round row above; live `/` and live 404. |
| F-1-12 | The form action remains `Restore Kitchen Pass`. | `@claim:kitchen-pass`. |
| F-1-13 | Public copy uses linked ingredient amounts, not implementation language. | `uses a real three-step landing flow and route-appropriate skip labels`. |
| F-1-14 | Brace syntax stays inside a labeled recipe-file example and is explained. | `@claim:recipe-format`; `local/screenshot-desktop.png`. |
| F-1-15 | Export remains consistently named `scaled cook card JSON`. | `@claim:json-export`. |
| F-1-16 | The duplicate product eyebrow remains removed. | `local/screenshot-desktop.png`; live `/`. |
| F-1-17 | The hero caption describes the sample workflow. | `local/screenshot-desktop.png`; live `/`. |
| F-1-18 | The import dialog label remains `Import recipe`. | Import-dialog accessibility test. |
| F-1-19 | The upgrade label remains the factual `One-time upgrade`. | `local/license-dialog-mobile.png`; live `/`. |
| F-1-20 | Deployment prose and the free-tier list are split into short sentences. | `.factory/copy-audit.md`; `@claim:kitchen-pass`. |
| F-1-21 | The image instruction remains plain: rebuild images from the original image. | README copy audit. |
| F-1-22 | Checkout gating describes the visible hidden-buy-link result. | `@claim:kitchen-pass`; README copy audit. |
| F-1-23 | Checkout return guidance names license restoration. | `@claim:kitchen-pass`; README copy audit. |
| F-1-24 | Saved billing-response wording remains plain. | `@claim:kitchen-pass`; README copy audit. |
| F-1-25 | The static 404 retains route-specific Open Graph and Twitter metadata. | `site discovery and social assets`; live unknown URL returns 404. |
| F-1-26 | The 404 uses the current navigation, footer, and build id. | `site discovery and social assets`; live `/definitely-missing-polish-4`. |
| F-1-27 | The demo wordmark returns home and discards only demo data. | `sends the demo wordmark home without reading demo storage`. |
| F-2-1 | Export uses displayed servings and scaled quantities. | `@claim:json-export` asserts 6 servings and 600 g pasta. |
| F-2-2 | The three facts remain visible in 1440×900 and 390×844 first screens. | Desktop and mobile first-screen tests; `live-mobile-cold.png`; live `/`. |
| F-2-3 | The landing keeps the import, scale/cook, and correction workflow. | Three-step flow test; `local/screenshot-desktop.png`. |
| F-2-4 | The dialog H2 remains `Kitchen Pass storage upgrade`. | `@claim:kitchen-pass`; `local/license-dialog-mobile.png`. |
| F-2-5 | Every route keeps `Skip to main content`. | Route-label test; live first-Tab check. |
| F-2-6 | The maintained live QA helper matches the current UI and now reports 56/56 passing checks. | `.factory/qa-live.mjs`; `evidence-polish-4/live-qa/live-browser.json`. |
| F-3-1 | The workflow H2 remains `Make a cook card in three steps`. | Three-step flow test; live `/`. |

## Verification evidence

- Clean clone: `/tmp/scaled-cook-card-polish4.AQXuq9/repo` at `3a08fc6`.
- All 18 exact commands in `.factory/claims.json`: PASS individually.
- Clean-clone gates: `npm run lint`, `npm test` (15/15), `npm run build`, and `npm run test:e2e` (57 passed, 5 expected checkout-only skips): PASS.
- Checkout-enabled suite: `npm run test:checkout-enabled` (4/4): PASS.
- Local verifier: `evidence-polish-4/local/verify.json`; no console errors.
- Live verifier: `evidence-polish-4/live/verify.json`; no console errors.
- Live cold audit: `evidence-polish-4/live-qa/live-browser.json`; 56/56 checks pass.
- Live mobile Lighthouse: performance 100, accessibility 100, best practices 100, SEO 100; LCP 1.6 s, CLS 0, TBT 30 ms. Raw report: `evidence-polish-4/live/lighthouse-mobile.json`.
- Live response checks: `/`, `/demo`, `/privacy`, and `/terms` return 200; `/definitely-missing-polish-4` returns 404.
- Screenshots: `local/screenshot-desktop.png`, `local/screenshot-mobile.png`, `local/demo-mobile.png`, `local/license-dialog-mobile.png`, `live-qa/live-desktop-cold.png`, and `live-qa/live-mobile-demo.png` under `evidence-polish-4/`.
- Deployed JavaScript, CSS, and service worker SHA-256 values match the clean-clone build.

Deployment `0c42afc1-b2eb-478a-b15a-a7b411886f52` completed on the existing `sf-scaled-cook-card` Static Web App. The cold live recheck passed at <https://scaled-cook-card.sociobot.in>.

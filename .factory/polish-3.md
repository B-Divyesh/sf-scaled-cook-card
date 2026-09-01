# Polish 3 — Scaled Cook Card

Repaired review commit `8b4006a180a0fe70f120a427ca497bcba3a69681` in product commits `4ab611183b24a14b8574c3422c922b6a44313913` and `d279e78aa0f802e5de4ce84e326854299ebaa56b` on 2026-09-01.

## Finding map

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Preserved the heading word boundary before the visual line break. | `keeps word boundaries in the headline and recipe-file label`; clean-clone browser suite PASS. |
| F-1-2 | Preserved the file-label word boundary. | `keeps word boundaries in the headline and recipe-file label`; PASS. |
| F-1-3 | Kept the price in its own registered claim. | `@claim:kitchen-pass-price`; exact command PASS. |
| F-1-4 | Kept paid multi-card and full-history behavior registered and tested. | `@claim:paid-history-limits`; exact command PASS. |
| F-1-5 | Kept license copy limited to restoration on this device and removed an untested device-scope phrase from Terms. | `@claim:kitchen-pass`; exact command PASS. |
| F-1-6 | Kept the free one-card and latest-correction limit registered and enforced. | `@claim:free-card-limits`; exact command PASS. |
| F-1-7 | Kept billing copy limited to the tested Sociobot checkout and revoked-license result. | `@claim:billing-terms`; exact command PASS. |
| F-1-8 | Kept artwork provenance registered with its source record. | `@claim:art-provenance`; exact command PASS. |
| F-1-9 | Kept the payment-integration assurance registered and source-tested. | `@claim:payment-integration`; exact command PASS. |
| F-1-10 | Kept the one-year versioned-cache statement registered. | `@claim:versioned-asset-cache`; exact command PASS. |
| F-1-11 | Kept `View history upgrade` and `Optional recipe history`. | `@claim:kitchen-pass`; exact button lookup PASS. |
| F-1-12 | Kept the result-naming `Restore Kitchen Pass` action. | `@claim:kitchen-pass`; exact button lookup PASS. |
| F-1-13 | Kept linked-amount language in public copy. | `uses a real three-step landing flow and route-appropriate skip labels`; PASS. |
| F-1-14 | Kept brace syntax inside the recipe-file example and explained the ingredient id. | `@claim:recipe-format` and `.factory/copy-audit.md`; PASS. |
| F-1-15 | Kept `scaled cook card JSON` consistent across the action, toast, claim, and README. | `@claim:json-export`; exact command PASS. |
| F-1-16 | Kept the duplicate product-name eyebrow removed. | [live desktop capture](evidence-polish-3/live-qa/live-desktop-cold.png). |
| F-1-17 | Kept the useful sample-workflow caption in place of decorative lore. | [live desktop capture](evidence-polish-3/live-qa/live-desktop-cold.png). |
| F-1-18 | Kept the import-dialog label action-specific. | `keeps word boundaries in the headline and recipe-file label`; PASS. |
| F-1-19 | Kept the upgrade label factual and subscription-free. | `@claim:kitchen-pass`; PASS. |
| F-1-20 | Kept deployment documentation split into short sentences. | `.factory/copy-audit.md`; zero sentences over 22 words. |
| F-1-21 | Kept the image rebuild instruction in plain words. | `.factory/copy-audit.md`; PASS. |
| F-1-22 | Kept checkout gating described as a hidden buy link. | README audit and `@claim:kitchen-pass`; PASS. |
| F-1-23 | Kept checkout-return guidance focused on license restoration. | README audit and `@claim:kitchen-pass`; PASS. |
| F-1-24 | Kept the saved billing response explanation in plain words. | README audit and `@claim:kitchen-pass`; PASS. |
| F-1-25 | Kept 404-specific Open Graph and Twitter metadata. | `site discovery and social assets`; live 404 metadata check PASS. |
| F-1-26 | Updated the 404 shell to build `2026.09.01-polish.3`. | `site discovery and social assets`; [404 headers](evidence-polish-3/not-found-headers.txt) show HTTP 404. |
| F-1-27 | Kept the demo wordmark pointed home and now discards demo storage on exit. | `sends the demo wordmark home without reading demo storage`; PASS. |
| F-2-1 | Kept export tied to the displayed servings and scaled quantities. | `@claim:json-export` verifies 6 servings and 600 g; PASS. |
| F-2-2 | Kept all three facts above the fold on desktop and mobile. | Desktop and 390 px first-screen regression tests; live checks PASS. |
| F-2-3 | Kept the real import, scale/cook, and correction workflow. | `uses a real three-step landing flow and route-appropriate skip labels`; PASS. |
| F-2-4 | Kept the self-contained `Kitchen Pass storage upgrade` dialog heading. | `@claim:kitchen-pass`; PASS. |
| F-2-5 | Kept `Skip to main content` on every route. | Route-specific skip-label test and live first-Tab check; PASS. |
| F-2-6 | Updated the live QA helper for polish 3 and added current release checks. | `.factory/qa-live.mjs`; [52/52 live checks](evidence-polish-3/live-qa/live-browser.json) PASS. |
| F-3-1 | Renamed the workflow H2 to `Make a cook card in three steps`. | Exact H2 regression in the three-step flow test; live heading check PASS. |

## Claim and quality evidence

- Fresh clone at `d279e78`: all 17 exact commands from `.factory/claims.json` passed separately.
- The same clone passed `npm test` (15/15), `npm run lint`, `npm run typecheck`, `npm run build`, and `npm run test:e2e` (55 passed, 5 expected checkout-only skips).
- Local URL verification: [report](evidence-polish-3/local-verify/verify.json); zero console errors.
- Live URL verification: [report](evidence-polish-3/live-verify/verify.json); zero console errors.
- Live browser audit: [report](evidence-polish-3/live-qa/live-browser.json); 52/52 checks passed.
- Screenshots: [desktop landing](evidence-polish-3/live-qa/live-desktop-cold.png), [mobile landing](evidence-polish-3/live-qa/live-mobile-cold.png), [mobile demo](evidence-polish-3/live-qa/live-mobile-demo.png), and [desktop workspace](evidence-polish-3/live-qa/live-desktop-workspace.png).
- Live mobile Lighthouse: performance 100, accessibility 100, best practices 100, SEO 100; LCP 1.6 s, CLS 0, total blocking time 20 ms. Raw evidence: `evidence-polish-3/lighthouse-live-mobile.json`.

## Deployment and cold check

The final factory static deployment completed with deployment id `7c79c838-4189-4f9e-92fe-100e38e9e123`. The live site serves bundle `index-D04khHhB.js`, cache `scaled-cook-card-v7`, build `2026.09.01-polish.3`, the direct app routes, and a designed HTTP 404.

No finding from reviews 1–3 remains unresolved.

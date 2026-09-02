# Polish 5 — Scaled Cook Card

Repaired adversarial review commit `123aefb29c8f7940333ed9d139f7acc0e521af42` in product commit `19c26f426489d1ff93404dbb4eb2768e5eae07d0` on 2026-09-02. Final deployment: `f41f095e-f8fa-4a1c-8f98-719bd48dbdbc`.

## Finding map

| Finding | Change retained or made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the spoken space before `in every step`. | Browser word-boundary check; live root audit. |
| F-1-2 | Kept `Choose a recipe file or drop it here` as the accessible file label. | Browser word-boundary check. |
| F-1-3 | Kept the conditional $9 price in a dedicated registered claim. | `@claim:kitchen-pass-price` clean-clone PASS. |
| F-1-4 | Kept multi-card, multi-correction paid storage behavior registered. | `@claim:paid-history-limits` clean-clone PASS. |
| F-1-5 | Kept license wording limited to restoration on this device. | `@claim:kitchen-pass` clean-clone PASS. |
| F-1-6 | Kept the free one-card/latest-correction limit registered and enforced. | `@claim:free-card-limits` clean-clone PASS. |
| F-1-7 | Kept billing copy limited to the tested Sociobot checkout and revoked-license effect. | `@claim:billing-terms` clean-clone PASS. |
| F-1-8 | Kept the artwork assertion on `/artwork` with provenance source records. | `@claim:art-provenance` clean-clone PASS; live `/artwork` route check. |
| F-1-9 | Kept the payment SDK/product-id assurance source-tested. | `@claim:payment-integration` clean-clone PASS. |
| F-1-10 | Kept the one-year versioned-cache promise registered. | `@claim:versioned-asset-cache` clean-clone PASS. |
| F-1-11 | Kept the checkout-disabled header action as `Restore a license`. | Live audit `header action names license restoration`. |
| F-1-12 | Kept the result-naming `Restore Kitchen Pass` control. | `@claim:kitchen-pass` clean-clone PASS. |
| F-1-13 | Kept plain linked-ingredient-amount wording. | Live audit `normal scaling updates bound values`. |
| F-1-14 | Kept the brace example labeled as an ingredient id. | `@claim:recipe-format` clean-clone PASS. |
| F-1-15 | Kept `scaled cook card JSON` consistent in UI, README, and export. | `@claim:json-export` clean-clone PASS. |
| F-1-16 | Kept the duplicate hero eyebrow removed. | [Live desktop capture](evidence-polish-5/live-qa/live-desktop-cold.png). |
| F-1-17 | Kept the useful sample-workflow artwork caption. | [Live desktop capture](evidence-polish-5/live-qa/live-desktop-cold.png). |
| F-1-18 | Kept the import dialog action-specific. | Browser import-dialog check. |
| F-1-19 | Kept the factual `One-time upgrade` label. | Live audit free-tier check. |
| F-1-20 | Kept deployment and tier copy within the plain-words limit. | [Copy audit](copy-audit.md). |
| F-1-21 | Kept the image rebuild instruction direct. | [Copy audit](copy-audit.md). |
| F-1-22 | Kept the hidden buy-link explanation direct. | `@claim:kitchen-pass` clean-clone PASS. |
| F-1-23 | Kept checkout-return wording focused on restoration. | `@claim:kitchen-pass` clean-clone PASS. |
| F-1-24 | Kept fixture wording plain and test-scoped. | `@claim:kitchen-pass` clean-clone PASS. |
| F-1-25 | Kept route-specific social metadata on static 404. | Live audit `unknown URL returns designed 404 with metadata`. |
| F-1-26 | Updated the 404 footer to build `2026.09.02-polish.5`. | `site discovery and social assets`; live 404 audit. |
| F-1-27 | Kept demo wordmark exit and isolated storage clearing. | `@claim:demo-sandbox`; live audit `Start for real discards demo data`. |
| F-2-1 | Kept export tied to displayed servings and scaled quantities. | `@claim:json-export` asserts six servings and 600 g pasta. |
| F-2-2 | Kept all three facts above the first screen at desktop and 390px. | Live audit desktop and mobile first-screen checks. |
| F-2-3 | Kept the actual import → scale/cook → correction workflow. | Live demo and workflow-heading checks. |
| F-2-4 | Kept `Kitchen Pass storage upgrade` as the dialog H2. | `@claim:kitchen-pass` clean-clone PASS. |
| F-2-5 | Kept `Skip to main content` on each route. | Live first-Tab check; route browser checks. |
| F-2-6 | Updated and ran the maintained live QA helper. | [56/56 live audit](evidence-polish-5/live-qa/live-browser.json). |
| F-3-1 | Kept `Make a cook card in three steps` as the section heading. | Live audit workflow-heading check. |
| F-4-1 | Kept screen wake registered with request, release, and rejection coverage. | `@claim:screen-wake`; live wake-lock check. |
| F-4-2 | Kept factory scripts lintable in a clean checkout. | Clean-clone `npm run lint` PASS. |
| F-4-3 | Kept the Privacy lede direct about browser storage. | Live Privacy route audit. |
| F-4-4 | Kept free-tier limits as two short sentences. | Live audit free-tier check. |
| F-5-1 | Added `recipe-required-fields`; one focused unit test rejects missing title, zero servings, no ingredients, and no steps with useful errors. README now uses the same precise rule. | `npm test -- --testNamePattern @claim:recipe-required-fields` PASS from a clean clone. |

## Full evidence

- All 19 declared claim commands were run individually from clean clone `/tmp/scaled-cook-card-polish5.PHskBi/repo`; all passed.
- Clean-clone gates passed: lint, 16-test unit suite, typecheck, build, 62-test default browser suite, and four-test checkout-enabled suite.
- Local verifier: [report](evidence-polish-5/local/verify.json), [desktop](evidence-polish-5/local/screenshot-desktop.png), and [mobile](evidence-polish-5/local/screenshot-mobile.png). It found title, `lang`, one H1, main landmark, complete image alt text, labelled controls, and no console errors.
- Live cold verification: [report](evidence-polish-5/live/verify.json), [desktop](evidence-polish-5/live/screenshot-desktop.png), and [mobile](evidence-polish-5/live/screenshot-mobile.png). The live direct routes `/`, `/demo`, `/privacy`, `/terms`, and `/artwork` return 200; the unknown route returns 404.
- Live product audit: [56/56 checks](evidence-polish-5/live-qa/live-browser.json), [desktop landing](evidence-polish-5/live-qa/live-desktop-cold.png), [workspace](evidence-polish-5/live-qa/live-desktop-workspace.png), [mobile landing](evidence-polish-5/live-qa/live-mobile-cold.png), and [mobile demo](evidence-polish-5/live-qa/live-mobile-demo.png). It checks the demo, reset/exit isolation, requests, console, keyboard, focus, route metadata, links, 404, mobile 200% reflow, touch size, reduced motion, and offline reload.
- Live Lighthouse mobile: performance 100, accessibility 100, best practices 100, SEO 100; LCP 1.5 s, CLS 0, TBT 0 ms. [Raw report](evidence-polish-5/live/lighthouse-mobile.json).

The first deploy (`e873f373-2d1d-47e8-9b1b-b394ed81f002`) accidentally used a checkout-enabled test artifact. The cold audit caught it before handoff. The final default artifact was rebuilt, SHA-compared to live assets, and deployed as `f41f095e-f8fa-4a1c-8f98-719bd48dbdbc`; the live audit above is against that final deployment.

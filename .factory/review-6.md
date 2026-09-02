# Adversarial first-read review 6 — Scaled Cook Card

Reviewed 2026-09-02 against source commit `18bf16d76f8a86919b3bf6158fa30fb425a7470c` and <https://scaled-cook-card.sociobot.in>.

## Verdict

**PASS**

No blocking or minor finding remains. The cold first screen is clear at 390 × 844 and 1440 × 900, the one-click demo is an isolated working cook card, every registered claim command passes from a clean clone, and the live deployment matches the reviewed default build.

## Cold first read

Fresh Chromium contexts opened `/` with no prior product state. These answers were recorded at `scrollY = 0` before any interaction.

| Question | Answer from the first screen | Exact supporting text | Result |
| --- | --- | --- | --- |
| What does this do? | It scales recipe amounts and shows the correct amount inside each cooking step. | `Scale recipe amounts in every step.` | Pass |
| For whom? | Home cooks who need quantities while their hands are busy. | `For home cooks who need correct quantities while their hands are busy.` | Pass |
| What should I select first? | **Try it with sample data**. | `Try it with sample data` and `Open a ready pasta cook card, or paste a recipe you wrote.` | Pass |

The primary action and all three short facts were visible without scrolling in both contexts. Evidence: [mobile](evidence-review-6/cold-mobile.png), [desktop](evidence-review-6/cold-desktop.png), and [measured DOM](evidence-review-6/cold.json).

## Findings

### Blocking

None.

### Minor

None.

## Copy audit

Counts treat code tokens, URLs, numbers, and hyphenated terms as one word. The middle-dot separator is not a word. Recipe examples are included because visitors read them as instructions. Repeated sentences are listed at each landing-page location.

### Landing page and reachable dialogs

| # | Location | Exact sentence or instructional line | Words | Check |
| ---: | --- | --- | ---: | --- |
| 1 | Hero H1 | Scale recipe amounts in every step. | 6 | Pass |
| 2 | Hero | For home cooks who need correct quantities while their hands are busy. | 12 | Pass |
| 3 | Hero fact | Works offline after the first visit. | 6 | Pass; `offline-reload` |
| 4 | Hero fact | Kitchen Pass purchase is unavailable. | 5 | Pass; `kitchen-pass` |
| 5 | Hero fact | Cook cards stay in this browser. | 6 | Pass; `local-only-recipe-data` |
| 6 | Hero action help | Open a ready pasta cook card, or paste a recipe you wrote. | 12 | Pass |
| 7 | Figure caption | Sample cook card workflow: scale, cook, then note changes. | 9 | Pass |
| 8 | Step 1 | Paste YAML or JSON from a recipe you wrote. | 9 | Pass |
| 9 | Step 2 | Change servings. | 2 | Pass |
| 10 | Step 2 | Linked amounts update where you need them. | 7 | Pass; `recipe-import-scaling` |
| 11 | Recipe-file example | Add `{{salt}}` to the pot. | 5 | Pass |
| 12 | Example result | becomes 1½ tsp fine salt | 5 | Pass |
| 13 | Step 3 | Record the real yield, substitutions, and notes after cooking. | 9 | Pass; `actual-yield-correction` |
| 14 | Recipe boundary | Start with a recipe you wrote or can import. | 9 | Pass |
| 15 | Recipe boundary | This card focuses on scaling and cooking that recipe. | 9 | Pass |
| 16 | Upgrade section | Kitchen Pass purchase is unavailable. | 5 | Pass; `kitchen-pass` |
| 17 | Upgrade section | The free cook card keeps scaling, cooking, and export. | 9 | Pass; component claims |
| 18 | Upgrade section | Restore a license you already have. | 6 | Pass; `kitchen-pass` |
| 19 | Footer | Scaled cook cards for home cooks. | 6 | Pass |
| 20 | Footer | Built by Param Factory · build 2026.09.02-polish.5. | 6 | Pass |
| 21 | Footer link | Artwork provenance. | 2 | Pass |
| 22 | Import dialog | Paste YAML or JSON below, or choose a small `.yaml`, `.yml`, or `.json` file. | 14 | Pass |
| 23 | Import dialog | The name inside braces matches an ingredient id. | 8 | Pass |
| 24 | Import dialog | Quantities may be decimals or fractions such as `1 1/2`. | 10 | Pass; `recipe-format` |
| 25 | Upgrade dialog status | Kitchen Pass purchase is unavailable. | 5 | Pass; `kitchen-pass` |
| 26 | Upgrade dialog status | Your free cook card stays usable. | 6 | Pass; component claims |
| 27 | Upgrade dialog status | If you already bought Kitchen Pass, paste your license below. | 10 | Pass; `kitchen-pass` |
| 28 | Upgrade dialog | The free cook card scales, cooks, works offline, and exports the card. | 12 | Pass; component claims |
| 29 | Upgrade dialog | It keeps one card with its latest correction. | 8 | Pass; `free-card-limits` |
| 30 | Upgrade legal note | Kitchen Pass purchase is unavailable. | 5 | Pass; `kitchen-pass` |
| 31 | Upgrade legal note | Restore a license you already have. | 6 | Pass; `kitchen-pass` |

No sentence exceeds 22 words. The average is 7.4 words. No banned word, marketing adjective, jargon flag, mixed product term, metaphor, or mood slogan was found.

### Landing headings and actions

| Kind | Text | Words | Check |
| --- | --- | ---: | --- |
| Skip link | Skip to main content | 4 | Pass |
| Wordmark | Scaled Cook Card | 3 | Pass |
| Navigation | Demo | 1 | Pass |
| Navigation | Privacy | 1 | Pass |
| Header action | Restore a license | 3 | Pass; verb names result |
| Primary action | Try it with sample data | 6 | Pass; verb names result |
| Secondary action | Import my recipe | 3 | Pass; verb names result |
| Section label | How it works | 3 | Pass |
| H2 | Make a cook card in three steps | 7 | Pass out of context |
| H3 | Import a recipe file | 4 | Pass |
| H3 | Scale and cook each step | 5 | Pass |
| H3 | Save what changed | 3 | Pass |
| Section label | Recipe boundaries | 2 | Pass |
| H2 | What this card does not do | 6 | Pass out of context |
| Section label | Optional upgrade | 2 | Pass |
| H2 | Optional recipe history | 3 | Pass out of context |
| Dialog label | Import recipe | 2 | Pass |
| Dialog H2 | Import your recipe | 3 | Pass |
| File action | Choose a recipe file or drop it here | 8 | Pass |
| Field label | Recipe YAML or JSON | 4 | Pass |
| Dialog action | Reset example | 2 | Pass; verb names result |
| Dialog action | Make cook card | 3 | Pass; verb names result |
| Dialog label | One-time upgrade | 2 | Pass |
| Dialog H2 | Kitchen Pass storage upgrade | 4 | Pass out of context |
| License action | Restore Kitchen Pass | 3 | Pass; verb names result |

### README sentences

| # | Exact sentence or prose line | Words | Check |
| ---: | --- | ---: | --- |
| 1 | Scale a recipe once and see the amount inside every cooking step. | 12 | Pass |
| 2 | It is for home cooks whose hands are busy. | 9 | Pass |
| 3 | Use a recipe file you wrote or can import. | 9 | Pass |
| 4 | The cook card scales it while you cook. | 8 | Pass |
| 5 | Live: `https://scaled-cook-card.sociobot.in` | 2 | Pass |
| 6 | Try the isolated sample at `https://scaled-cook-card.sociobot.in/?demo=1`. | 6 | Pass |
| 7 | It uses separate browser storage and never changes a real cook card. | 12 | Pass; `demo-sandbox` |
| 8 | Imports a recipe and scales each linked ingredient amount in its cooking steps. | 13 | Pass; `recipe-import-scaling` |
| 9 | Keeps exact fractions such as `3/16` instead of changing them to a nearby amount. | 14 | Pass; `recipe-import-scaling` |
| 10 | Keeps the screen awake in cook mode when your browser allows it. | 12 | Pass; `screen-wake` |
| 11 | Arrow keys still work when screen wake is unavailable. | 9 | Pass; `cook-controls` |
| 12 | Saves actual yield, substitutions, and notes locally after cooking. | 9 | Pass; `actual-yield-correction` |
| 13 | Exports the displayed scaled cook card as JSON. | 8 | Pass; `json-export` |
| 14 | Works offline after the first visit. | 6 | Pass; `offline-reload` |
| 15 | Keeps recipe data in this browser. | 6 | Pass; `local-only-recipe-data` |
| 16 | The cooking flow makes no analytics or third-party runtime requests. | 10 | Pass; `local-only-recipe-data` |
| 17 | Runs `/demo` with separate `demo:scc:` browser storage. | 7 | Pass; `demo-sandbox` |
| 18 | When checkout is enabled, Kitchen Pass costs $9 once. | 9 | Pass; `kitchen-pass-price` |
| 19 | It keeps unlimited local cook cards and complete local cook history. | 11 | Pass; `paid-history-limits` |
| 20 | The free cook card keeps scaling, cooking, and scaled cook card export. | 12 | Pass; component claims |
| 21 | Ingredient `id` values match the names inside `{{braces}}` in each step: | 11 | Pass; `recipe-format` |
| 22 | A step may instead use an `ingredients` list; its scaled ingredient tokens appear after the step text: | 17 | Pass; `step-binding-list` |
| 23 | Recipe files need a `title`, positive `servings`, at least one `ingredient`, and at least one preparation `step`. | 17 | Pass; `recipe-required-fields` |
| 24 | Ingredient quantities may be numbers or fraction strings. | 8 | Pass; `recipe-format` |
| 25 | Requires Node.js 20 or newer. | 5 | Pass; maintainer requirement |
| 26 | The production build command is `npm run build`. | 8 | Pass; maintainer instruction |
| 27 | It type-checks and writes `dist/`, with `dist/index.html` at its root. | 10 | Pass; reproduced |
| 28 | Browser tests use Playwright 1.58.2. | 5 | Pass; lockfile confirms |
| 29 | Install its Chromium binary before running them. | 7 | Pass; maintainer instruction |
| 30 | To rebuild the responsive hero images from the original image: | 10 | Pass |
| 31 | Deploy `dist/` as an Azure Static Web App. | 8 | Pass; maintainer instruction |
| 32 | The deployment file defines routes, headers, MIME types, and caching. | 10 | Pass; deployment test |
| 33 | Versioned assets are cached for one year. | 7 | Pass; `versioned-asset-cache` |
| 34 | Bump the artwork URL version when replacing the image. | 9 | Pass; maintainer instruction |
| 35 | When enabled, the product uses only these Sociobot billing endpoints: | 10 | Pass; configuration statement |
| 36 | Checkout is disabled unless `VITE_KITCHEN_PASS_CHECKOUT_ENABLED` is `true`. | 7 | Pass; `kitchen-pass` |
| 37 | This hides the buy link until checkout is ready. | 9 | Pass; `kitchen-pass` |
| 38 | The free cook card and license restore still work. | 9 | Pass; component claims |
| 39 | Enable the setting after checkout is available. | 7 | Pass; maintainer instruction |
| 40 | Confirm that checkout returns a license and that the app restores it. | 12 | Pass; maintainer instruction |
| 41 | Browser tests use a saved billing response. | 7 | Pass; test implementation |
| 42 | They confirm license restore without contacting billing. | 7 | Pass; `kitchen-pass` |
| 43 | No payment-provider SDK or product id is embedded here. | 9 | Pass; `payment-integration` |
| 44 | MIT. | 1 | Pass |
| 45 | See `LICENSE`. | 2 | Pass |

No README sentence exceeds 22 words; the average is 8.8 words. Its headings—`What it does`, `Recipe format`, `Develop and verify`, `Deployment and billing`, `Product records`, and `License`—name their sections. YAML, JSON, browser storage, MIME types, and SDK are necessary format or maintainer terms in context. No claim-like landing or README sentence is missing from the claim registry or an applicable component claim.

Terminology is consistent: **recipe file** is imported, **cook card** is the in-app and exported object, **cooking step** is an instruction, **linked ingredient amount** is its quantity, **Kitchen Pass** is the paid license, and **demo** is isolated sample state.

## Demo and sandbox

- One selection of **Try it with sample data** opened `/?demo=1` and immediately showed `Weeknight tomato pasta`, five measured ingredients, four linked preparation steps, serving controls, and cook mode.
- The persistent banner said `Demo — sample data, nothing is saved to your real cook card.` and exposed **Reset demo** and **Start for real**.
- Changing four servings to six showed `600 g` pasta and wrote only `demo:scc:target-servings`.
- **Reset demo** restored four servings and the shipped card. **Start for real** removed all `demo:scc:` keys and returned to `/`.
- A seeded `scc:review-6-sentinel = real-data` survived entry, editing, reset, and exit unchanged. Demo mode did not read or write real cook-card storage.
- A fresh service-worker-controlled demo reloaded offline and retained the sample and banner. The page reported `Offline — your card still works`.
- The live request log contained only `https://scaled-cook-card.sociobot.in` requests. No analytics, third-party script, font, or runtime data request occurred.

Evidence: [live demo audit](evidence-review-6/live-audit.json), [mobile demo](evidence-review-6/demo-mobile.png), and [offline reload](evidence-review-6/offline-live.json).

## Registered claims

Every exact command in `.factory/claims.json` was run separately after `npm ci` in clean clone `/tmp/scaled-cook-card-review6.3oZSnL/repo`.

| Claim | Exact command result |
| --- | --- |
| `recipe-import-scaling` | Pass — 2 browser projects |
| `recipe-format` | Pass — 1 focused unit test |
| `recipe-required-fields` | Pass — 1 focused unit test |
| `step-binding-list` | Pass — 1 focused unit test |
| `actual-yield-correction` | Pass — 2 browser projects |
| `cook-controls` | Pass — 2 browser projects |
| `screen-wake` | Pass — 2 browser projects |
| `json-export` | Pass — 2 browser projects |
| `offline-reload` | Pass — 2 browser projects |
| `demo-sandbox` | Pass — 2 browser projects |
| `local-only-recipe-data` | Pass — 2 browser projects |
| `kitchen-pass` | Pass — 2 browser projects; checkout-only cases skipped as designed |
| `kitchen-pass-price` | Pass — checkout-enabled Chromium |
| `paid-history-limits` | Pass — Chromium |
| `free-card-limits` | Pass — Chromium |
| `billing-terms` | Pass — checkout-enabled Chromium |
| `art-provenance` | Pass — 1 focused deployment test |
| `payment-integration` | Pass — 1 focused deployment test |
| `versioned-asset-cache` | Pass — 1 focused deployment test |

The per-command record is [claim-results.tsv](evidence-review-6/claim-results.tsv). No listed claim is untested and no listed command failed.

## Earlier finding verification

Every earlier review, polish record, and the current handoff was read. Each finding below was checked against current source and the deployed behavior, not accepted from its prior status label.

| Earlier finding | Current source and live confirmation |
| --- | --- |
| F-1-1 | Fixed: the live H1 accessible text is `Scale recipe amounts in every step.` |
| F-1-2 | Fixed: the live file control is named `Choose a recipe file or drop it here`. |
| F-1-3 | Fixed: the conditional $9 price has `kitchen-pass-price`; its checkout-enabled command passes. The default live build correctly shows purchase unavailable. |
| F-1-4 | Fixed: `paid-history-limits` retains multiple cards and corrections; the dialog names those results. |
| F-1-5 | Fixed: current copy promises restoration on this device, not cross-device use. |
| F-1-6 | Fixed: `free-card-limits` confirms one saved card and its latest correction. |
| F-1-7 | Fixed: live copy is limited to unavailable purchase; enabled-build terms say only that checkout opens on Sociobot and revocation stops paid history. |
| F-1-8 | Fixed: live `/artwork` links to the registered provenance source record. |
| F-1-9 | Fixed: `payment-integration` checks source and output for provider SDKs and product identifiers. |
| F-1-10 | Fixed: `versioned-asset-cache` passes and the live JS header is `max-age=31536000, immutable`. |
| F-1-11 | Fixed: the default live header action is `Restore a license`; the section is `Optional recipe history`. |
| F-1-12 | Fixed: the form action is `Restore Kitchen Pass`. |
| F-1-13 | Fixed: public copy uses `linked ingredient amount`, not `bind`. |
| F-1-14 | Fixed: braces appear in a labeled recipe-file example and are explained as an ingredient id. |
| F-1-15 | Fixed: UI, README, claim, and export use `scaled cook card JSON`. |
| F-1-16 | Fixed: no duplicate product-name eyebrow appears in the hero. |
| F-1-17 | Fixed: the artwork caption says `Sample cook card workflow: scale, cook, then note changes.` |
| F-1-18 | Fixed: the import dialog label is `Import recipe`. |
| F-1-19 | Fixed: the upgrade dialog label is `One-time upgrade`. |
| F-1-20 | Fixed: no landing or README sentence exceeds 22 words. |
| F-1-21 | Fixed: README says to rebuild responsive hero images from the original image. |
| F-1-22 | Fixed: README says the setting hides the buy link until checkout is ready. |
| F-1-23 | Fixed: checkout-return guidance names returning and restoring a license. |
| F-1-24 | Fixed: README describes a saved billing response and its test result in plain words. |
| F-1-25 | Fixed: the live 404 has route-specific Open Graph and Twitter metadata. |
| F-1-26 | Fixed: the live 404 shares the current header actions, footer links, provenance link, and build id. |
| F-1-27 | Fixed: the demo wordmark points home and clears only `demo:scc:` storage. |
| F-2-1 | Fixed: six-serving JSON export contains servings 6 and pasta quantity 600. |
| F-2-2 | Fixed: all three facts are inside both measured first screens. |
| F-2-3 | Fixed: the landing shows import, scale/cook, and correction steps. |
| F-2-4 | Fixed: dialog H2 is `Kitchen Pass storage upgrade`. |
| F-2-5 | Fixed: all application routes and the static 404 use `Skip to main content`. |
| F-2-6 | Fixed: the maintained QA source expects `Restore a license`; the current live header and independent browser probe match it. |
| F-3-1 | Fixed: workflow H2 is `Make a cook card in three steps`. |
| F-4-1 | Fixed: `screen-wake` verifies request, active state, release, and rejected-request recovery. |
| F-4-2 | Fixed: `npm run lint` passes from the clean clone. |
| F-4-3 | Fixed: live Privacy says `Your recipes stay in your browser, not in our database.` |
| F-4-4 | Fixed: free-tier behavior is split into 12- and 8-word sentences. |
| F-5-1 | Fixed: `recipe-required-fields` rejects a missing title, zero servings, no ingredients, and no steps with specific errors. |

No earlier finding is unfixed, partial, or regressed.

## Structure, accessibility, and visual identity

- `/`, `/demo`, `/privacy`, `/terms`, and `/artwork` return 200. An unknown URL returns the designed static page with HTTP 404.
- Each route has one H1, one main landmark, `lang="en"`, an appropriate title, description, canonical URL, Open Graph/Twitter metadata, favicon, common header, and common footer.
- The root title is `Scaled Cook Card — scale recipe steps`; secondary routes follow the documented `Route — Scaled Cook Card` pattern.
- The all-route internal-link crawl found no dead destination. The 404 page's own `#main` skip target remains on its intentional 404 response. `robots.txt`, `sitemap.xml`, the social card, icons, CSS, JS, and original art resolve with the expected content types.
- Privacy navigation focuses its H1 and announces `Opened Privacy.` Browser Back restores and focuses the root H1 and announces `Page changed.`
- The first Tab reaches `Skip to main content`. Dialog focus return, keyboard cooking, 44 px mobile targets, 200% reflow, reduced motion, and serious/critical axe checks pass in the full browser suite.
- The live URL verifier reports one H1, a main landmark, complete image alt text, labeled buttons, and no console errors on root load.
- Response headers include CSP with `frame-ancestors`, `nosniff`, referrer policy, permissions policy, and HSTS. No inline CSP error was observed.
- The default JavaScript is 80.31 kB raw and 27.05 kB gzip. Live and clean-build JS share SHA-256 `9b31412a6e45b65b24a7d030096b1e8ca52f72a1d005f93f17bdf4ed4e6e3925`.
- The warm ruled-paper canvas, graphite/tomato/sage palette, asymmetric notebook spread, original still-life, linked blue quantities, and correction-ledger layout are distinct from a generic SaaS template and match `.factory/design.md`.

Evidence: [live route audit](evidence-review-6/live-audit.json), [all-route link crawl](evidence-review-6/link-crawl.json), [URL verifier](evidence-review-6/verify-live/verify.json), and [build identity](evidence-review-6/identity.txt).

## Quality gates

| Gate | Result |
| --- | --- |
| `npm test` | Pass — 16 tests |
| `npm run lint` | Pass |
| `npm run typecheck` | Pass |
| `npm run build` | Pass — `dist/` produced |
| `npm run test:e2e` | Pass — 57 passed, 5 intentional checkout-only skips |
| `npm run test:checkout-enabled` | Pass — 4 tests |
| Live URL verifier | Pass — no root console errors |
| Playwright axe integration | Pass — no serious or critical findings in checked states |

The full gate record is [gate-results.tsv](evidence-review-6/gate-results.tsv).

## Missed leverage

No missing brief-implied feature was confirmed. The product already provides authored-file import, deterministic scaling, linked amounts in steps, cook mode, local corrections, offline use, isolated sample data, local history, and scaled JSON export. A model-assisted step would add uncertainty and network dependence to deterministic arithmetic. No decorative runtime AI feature, provider key, or direct model endpoint is present.

## What would make this perfect

Nothing remains to change for this work order. Re-run the same clean-clone claims, live cold-browser checks, storage sentinel, request log, route crawl, and accessibility gates after any future copy, billing, service-worker, or storage change.

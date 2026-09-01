# Product QA review 3 — Scaled Cook Card

Reviewed 2026-09-01 against commit `10153bd0742efcf59fc64e0dada915b7dd08206a` and <https://scaled-cook-card.sociobot.in>.

## Verdict

**FAIL**

One minor copy and structure finding remains. The product is clear and usable on a cold first visit, the demo is isolated, all 17 registered claim commands pass, and the prior findings are fixed. Acceptance requires no findings, so this result is not a pass.

## Cold first read

Fresh Chromium contexts opened the root page at 390 x 844 and 1440 x 900 before scrolling.

| Check | Answer from the first screen | Result |
| --- | --- | --- |
| Confirm what it does | It scales ingredient quantities and shows them in each cooking step. | Pass |
| Confirm who it is for | Home cooks whose hands are busy. | Pass |
| Confirm what to select first | **Try it with sample data**. | Pass |

The answers are supplied by `Scale recipe amounts in every step.`, `For home cooks who need correct quantities while their hands are busy.`, and `Try it with sample data`. The three facts and both first actions are visible at both sizes. There is no first-screen blocking finding.

## Findings

### Blocking

None confirmed.

### Minor

#### F-3-1 — The three-step workflow heading does not name its section

- Exact quote/location: landing page `h2` above the three workflow steps, `Make one recipe easier to cook.`
- Check result: the visible eyebrow says `How it works`, but it is not a heading. A screen-reader heading list presents `Make one recipe easier to cook.` rather than a section name. The word `easier` does not state what the section contains.
- Why this matters: the section contains the required three-step workflow, so its heading should identify that workflow without relying on adjacent styling.
- Concrete fix: change the `h2` to `Make a cook card in three steps` (or `How to make a cook card`) and retain the existing three step headings.

## Copy audit

Counts treat a URL, code token, number, and hyphenated term as one word. Recipe examples are code, not prose. Dialog text is included because it is landing-page UI that a visitor can open.

### Landing-page sentences

| # | Exact sentence | Words | Result |
| ---: | --- | ---: | --- |
| 1 | Scale recipe amounts in every step. | 6 | Pass |
| 2 | For home cooks who need correct quantities while their hands are busy. | 12 | Pass |
| 3 | Works offline after the first visit. | 6 | Pass; registered |
| 4 | $9 once for optional history. | 5 | Pass; registered |
| 5 | Cook cards stay in this browser. | 6 | Pass; registered |
| 6 | Open a ready pasta cook card, or paste a recipe you wrote. | 12 | Pass |
| 7 | Sample cook card workflow: scale, cook, then note changes. | 9 | Pass |
| 8 | Make one recipe easier to cook. | 7 | F-3-1 |
| 9 | Paste YAML or JSON from a recipe you wrote. | 9 | Pass; format terms are necessary and the import dialog explains them |
| 10 | Change servings. | 2 | Pass |
| 11 | Linked amounts update where you need them. | 7 | Pass; demonstrated immediately below |
| 12 | Add `{{salt}}` to the pot. | 5 | Pass; recipe syntax example |
| 13 | Record the real yield, substitutions, and notes after cooking. | 9 | Pass; registered behavior |
| 14 | Start with a recipe you wrote or can import. | 9 | Pass |
| 15 | This card focuses on scaling and cooking that recipe. | 9 | Pass |
| 16 | Kitchen Pass checkout is unavailable right now. | 7 | Pass; registered |
| 17 | The free cook card keeps scaling, cooking, and export. | 9 | Pass; registered component behaviors |
| 18 | Scaled cook cards for home cooks. | 6 | Pass |
| 19 | Built by Param Factory · build 2026.09.01-polish.2. | 6 | Pass; build label |
| 20 | Paste YAML or JSON below, or choose a small `.yaml`, `.yml`, or `.json` file. | 14 | Pass |
| 21 | The name inside braces matches an ingredient id. | 8 | Pass; registered format behavior |
| 22 | Quantities may be decimals or fractions such as `1 1/2`. | 10 | Pass; registered format behavior |
| 23 | Checkout is unavailable right now. | 5 | Pass; registered |
| 24 | Your free cook card stays usable. | 6 | Pass; registered free behavior |
| 25 | If you already bought Kitchen Pass, paste your license below. | 10 | Pass |
| 26 | The free cook card includes scaling, cook mode, one saved cook card and its latest correction, offline use, and scaled cook card export. | 20 | Pass; component behaviors are registered |
| 27 | Checkout opens on Sociobot. | 4 | Pass; registered |
| 28 | A revoked license stops paid history. | 6 | Pass; registered |

No sentence exceeds 22 words. No banned marketing adjective was confirmed. `YAML`, `JSON`, and ingredient `id` are format terms with an explanatory path.

### Landing headings, actions, and fragments

| Exact text | Check result |
| --- | --- |
| Skip to main content | Pass; correct on all routes |
| Scaled Cook Card | Pass as wordmark |
| Try it with sample data | Pass; result-naming primary action |
| Import my recipe | Pass; result-naming action |
| How it works | Pass as visible section label, but it is not the semantic heading; see F-3-1 |
| Import a recipe file | Pass |
| Scale and cook each step | Pass |
| Save what changed | Pass |
| Recipe boundaries | Pass |
| What this card does not do | Pass |
| Optional upgrade | Pass |
| Optional recipe history | Pass |
| Import your recipe | Pass |
| Choose a recipe file or drop it here | Pass; accessible name includes the space |
| Recipe YAML or JSON | Pass |
| Reset example | Pass |
| Make cook card | Pass |
| Kitchen Pass storage upgrade | Pass |
| Save unlimited cook cards | Pass; registered paid behavior |
| Keep the complete correction history | Pass; registered paid behavior |
| Restore your license on this device | Pass |
| Restore Kitchen Pass | Pass |
| Artwork provenance | Pass as a link label |

All action labels identify a result. Apart from F-3-1, headings make sense independently and the terminology remains consistent: a **recipe file** is imported and a **cook card** is saved or exported.

### README sentences

| # | Exact sentence | Words | Result |
| ---: | --- | ---: | --- |
| 1 | Scale a recipe once and see the amount inside every cooking step. | 12 | Pass |
| 2 | It is for home cooks whose hands are busy. | 9 | Pass |
| 3 | Use a recipe file you wrote or can import. | 9 | Pass |
| 4 | The cook card scales it while you cook. | 8 | Pass |
| 5 | Live: `https://scaled-cook-card.sociobot.in` | 2 | Pass |
| 6 | Try the isolated sample at `https://scaled-cook-card.sociobot.in/demo`. | 6 | Pass |
| 7 | It uses separate browser storage and never changes a real cook card. | 12 | Pass; registered |
| 8 | Imports a recipe and scales each linked ingredient amount in its cooking steps. | 13 | Pass; registered |
| 9 | Keeps exact fractions such as `3/16` instead of changing them to a nearby amount. | 14 | Pass; registered |
| 10 | Lets you cook with arrow keys when screen wake is unavailable. | 11 | Pass; registered |
| 11 | Saves actual yield, substitutions, and notes locally after cooking. | 9 | Pass; registered |
| 12 | Exports the displayed scaled cook card as JSON. | 7 | Pass; registered |
| 13 | Works offline after the first visit. | 6 | Pass; registered |
| 14 | Keeps recipe data in this browser. | 6 | Pass; registered |
| 15 | The cooking flow makes no analytics or third-party runtime requests. | 10 | Pass; registered |
| 16 | Runs `/demo` with separate `demo:scc:` browser storage. | 7 | Pass; registered |
| 17 | When checkout is enabled, Kitchen Pass costs $9 once. | 9 | Pass; registered |
| 18 | It keeps unlimited local cook cards and complete local cook history. | 11 | Pass; registered |
| 19 | The free cook card keeps scaling, cooking, and scaled cook card export. | 10 | Pass; registered |
| 20 | Ingredient `id` values match the names inside `{{braces}}` in each step: | 11 | Pass; format explanation |
| 21 | A step may instead use an `ingredients` list; its scaled ingredient tokens appear after the step text: | 17 | Pass; registered |
| 22 | Required fields are `title`, positive `servings`, non-empty `ingredients`, and non-empty `steps`. | 11 | Pass |
| 23 | Ingredient quantities may be numbers or fraction strings. | 8 | Pass; registered |
| 24 | Requires Node.js 20 or newer. | 5 | Pass |
| 25 | The production build command is `npm run build`. | 8 | Pass |
| 26 | It type-checks and writes `dist/`, with `dist/index.html` at its root. | 10 | Pass |
| 27 | Browser tests use Playwright 1.58.2. | 5 | Pass |
| 28 | Install its Chromium binary before running them. | 7 | Pass |
| 29 | To rebuild the responsive hero images from the original image: | 10 | Pass |
| 30 | Deploy `dist/` as an Azure Static Web App. | 8 | Pass |
| 31 | The deployment file defines routes, headers, MIME types, and caching. | 10 | Pass |
| 32 | Versioned assets are cached for one year. | 7 | Pass; registered |
| 33 | Bump the artwork URL version when replacing the image. | 9 | Pass |
| 34 | When enabled, the product uses only these Sociobot billing endpoints: | 10 | Pass |
| 35 | Checkout is disabled unless `VITE_KITCHEN_PASS_CHECKOUT_ENABLED` is `true`. | 7 | Pass; registered |
| 36 | This hides the buy link until checkout is ready. | 9 | Pass; registered |
| 37 | The free cook card and license restore still work. | 9 | Pass; registered |
| 38 | Enable the setting after checkout is available. | 7 | Pass |
| 39 | Confirm that checkout returns a license and that the app restores it. | 12 | Pass |
| 40 | Browser tests use a saved billing response. | 7 | Pass |
| 41 | They confirm license restore without contacting billing. | 7 | Pass |
| 42 | No payment-provider SDK or product id is embedded here. | 9 | Pass; registered |
| 43 | MIT. | 1 | Pass |
| 44 | See `LICENSE`. | 2 | Pass |

No README sentence exceeds 22 words. Its headings are descriptive, and the technical terms occur only in the recipe-format and maintainer instructions.

## Demo and sandbox checks

- Check that one click from `/` opens `/demo`: PASS.
- Check that the first demo screen already shows realistic use: PASS. It opens `Weeknight tomato pasta` with five measured ingredients and four steps.
- Check that the persistent banner says `Demo — sample data, nothing is saved to your real cook card.` and provides `Reset demo` and `Start for real`: PASS.
- Check that changing four servings to six changes pasta from `400 g` to `600 g`: PASS.
- Check that a pre-existing `scc:review-3-sentinel` real-data key remains unchanged through entry, scaling, Reset, and Start for real: PASS.
- Check that demo writes use `demo:scc:` keys and no `scc:` key is created by the demo: PASS.
- Check that Reset returns the serving value to four: PASS.
- Check that Start for real returns to `/` and removes the demo keys: PASS.
- Check that the demo request log contains only `https://scaled-cook-card.sociobot.in`: PASS.
- Check that the demo flow has no console or page errors: PASS.
- Check that offline reload is covered by its clean-context registered browser check: PASS.

## Registered claims

After `npm ci`, every exact command in `.factory/claims.json` completed successfully. The local build uses the same JavaScript and CSS bytes as the live deployment.

| Claim id | Result |
| --- | --- |
| `recipe-import-scaling` | PASS |
| `recipe-format` | PASS |
| `step-binding-list` | PASS |
| `actual-yield-correction` | PASS |
| `cook-controls` | PASS |
| `json-export` | PASS |
| `offline-reload` | PASS |
| `demo-sandbox` | PASS |
| `local-only-recipe-data` | PASS |
| `kitchen-pass` | PASS |
| `kitchen-pass-price` | PASS |
| `paid-history-limits` | PASS |
| `free-card-limits` | PASS |
| `billing-terms` | PASS |
| `art-provenance` | PASS |
| `payment-integration` | PASS |
| `versioned-asset-cache` | PASS |

Check that live claim-like copy is represented by an applicable claim: PASS. The price, paid/free limits, local storage, offline use, export, billing wording, provenance, and payment integration all have registry entries. No additional landing or README claim was confirmed outside the registry.

## Earlier findings

Every earlier review and polish record was read. Each earlier finding was checked in both source and the live bundle.

| Earlier finding | Current result |
| --- | --- |
| F-1-1 | Fixed: live H1 accessible name has the required word boundary. |
| F-1-2 | Fixed: file label accessible name has the required word boundary. |
| F-1-3 | Fixed: price has a dedicated registered check. |
| F-1-4 | Fixed: paid history retains multiple cards and corrections. |
| F-1-5 | Fixed: copy limits license restoration to this device. |
| F-1-6 | Fixed: free storage limit has a dedicated check. |
| F-1-7 | Fixed: live wording is limited to the checked Sociobot checkout and revoked-license result. |
| F-1-8 | Fixed: provenance is linked and registered. |
| F-1-9 | Fixed: payment integration assurance is registered. |
| F-1-10 | Fixed: cache duration is registered and documentation is separated. |
| F-1-11 | Fixed: history labels name the upgrade purpose. |
| F-1-12 | Fixed: restore action names Kitchen Pass. |
| F-1-13 | Fixed: linked-amount language replaces the unclear term. |
| F-1-14 | Fixed: brace syntax is labeled and explained. |
| F-1-15 | Fixed: the result is consistently named `scaled cook card JSON`. |
| F-1-16 | Fixed: repeated hero eyebrow is absent. |
| F-1-17 | Fixed: image caption describes the sample workflow. |
| F-1-18 | Fixed: import dialog label names the action. |
| F-1-19 | Fixed: upgrade dialog label names the action. |
| F-1-20 | Fixed: no README sentence exceeds the limit. |
| F-1-21 | Fixed: image instruction uses plain wording. |
| F-1-22 | Fixed: checkout gating explains the visible result. |
| F-1-23 | Fixed: checkout return instruction names license restoration. |
| F-1-24 | Fixed: saved billing response is explained. |
| F-1-25 | Fixed: the live 404 has route-specific social metadata. |
| F-1-26 | Fixed: the live 404 shares the current header/footer identity. |
| F-1-27 | Fixed: demo wordmark returns home without reading demo storage. |
| F-2-1 | Fixed: six-serving export contains `servings: 6` and pasta quantity `600`. |
| F-2-2 | Fixed: all three facts are within the 1440 x 900 first screen. |
| F-2-3 | Fixed: the landing contains import, scale/cook, and save steps. |
| F-2-4 | Fixed: dialog heading is `Kitchen Pass storage upgrade`. |
| F-2-5 | Fixed: shared skip link says `Skip to main content`. |
| F-2-6 | Fixed: the live QA helper expects `History upgrade active`. |

## Structure, routing, accessibility, and visual identity

- Check that `/`, `/demo`, `/privacy`, `/terms`, and `/artwork` return 200: PASS.
- Check that an unknown route returns the designed 404 with HTTP 404: PASS.
- Check that all routes have an appropriate title, description, canonical URL, social image, favicon, `lang="en"`, one H1, and one main landmark: PASS.
- Check that rendered same-origin links resolve: PASS; the intentional unknown-route link returns 404.
- Check that browser Back returns to the root, focuses the root H1, restores scroll position, and announces `Page changed.`: PASS.
- Check that the common header/footer contain consistent navigation, Privacy, Terms, build id, and Param Factory attribution: PASS.
- Check that the live root has no console/page errors and that the URL verifier reports title, language, main, complete image alternatives, and labeled buttons: PASS.
- Check that Playwright axe checks in the project pass for landing, workspace, cook mode, and Privacy: PASS. The standalone axe CLI could not start because this worker image has no Selenium Chrome binary; this is an environment limitation, not a product result.
- Check that the warm paper notebook, ruled layout, original still-life, and correction-ledger treatment form a distinct product identity rather than a generic template: PASS.

## Missed leverage

No additional AI step is expected. Recipe scaling is deterministic arithmetic, so a model would add uncertainty to the core job. The brief calls for authored YAML/JSON recipe files, and the product already supplies the implied import, local correction record, offline flow, and JSON export.

## Quality checks

```text
npm ci                 PASS
17 exact claim commands PASS
npm test               PASS — 15 checks
npm run lint           PASS
npm run typecheck      PASS
npm run build          PASS — dist/ produced
npm run test:e2e       PASS
live/local JS and CSS byte comparison PASS
```

The built JavaScript is 80.29 kB raw / 27.09 kB gzip and CSS is 21.10 kB raw / 5.37 kB gzip.

## What would make this perfect

Resolve F-3-1 by giving the three-step workflow a self-contained H2. Then rerun this complete review. A perfect round has no remaining copy, structure, demo, claim, route, or accessibility finding.

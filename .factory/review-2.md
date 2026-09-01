# Adversarial first-read review 2 — Scaled Cook Card

Reviewed 2026-09-01 against commit `e8dc54bfcc0192767b005c74e31a90c17acfa02c` and <https://scaled-cook-card.sociobot.in>.

## Verdict

**FAIL**

The cold first screen, one-click demo, isolated storage, offline behavior, routes, accessibility baseline, build, and all 17 registered claim commands pass. Acceptance still fails because three blocking findings and five minor findings remain. Two earlier findings are only partly fixed, and the JSON export claim does not match a cook card scaled from four to six servings.

## Cold first read

Fresh Chromium contexts opened the live root at 390 × 844 and 1440 × 900. The page was recorded at `scrollY = 0` before interaction or scrolling.

| Question | Answer from the first screen | Result |
| --- | --- | --- |
| What does this do? | It scales recipe quantities and puts them inside cooking steps. | Pass |
| For whom? | Home cooks whose hands are busy. | Pass |
| What should I click first? | **Try it with sample data**. | Pass |

The answers come directly from “Scale recipe amounts in every step.”, “For home cooks who need correct quantities while their hands are busy.”, and “Try it with sample data”. The primary action is visible at both sizes. The required facts are visible at 390 px, but most fall below the desktop first screen; see F-2-2.

## Findings

### Blocking

#### F-1-7 — Merchant and refund claims remain broader than their registered check

- Exact quote/location: Kitchen Pass dialog, `Sociobot/Dodo is the merchant of record and handles refunds. Refunds revoke the license.`
- Confirmed behavior: `.factory/claims.json` lists `billing-terms` as “Checkout is hosted by Sociobot/Dodo, and a revoked license stops paid features.” Its browser check confirms the sentence is present, confirms the configured Sociobot checkout URL, and supplies a recorded `revoked` response that locks paid history.
- Why this remains blocking: the check does not confirm merchant-of-record status, who handles refunds, or that a refund causes revocation. Displaying the sentence is not evidence for the sentence. This earlier finding is therefore only partly fixed and returns with the same id.
- Concrete fix: replace the dialog copy with the tested result, such as `Checkout opens on Sociobot. A revoked license stops paid history.` If the merchant and refund statements must remain, add a maintained contract check that confirms those exact outcomes.

#### F-1-15 — The exported object still has inconsistent names

- Exact quote/location: README and claim registry, `Exports the active cook card as JSON.`; workspace button, `Export recipe JSON`; browser test name, `exports the active recipe as JSON`.
- Confirmed behavior: the saved in-app object is otherwise called a `cook card`, while imported input is called a `recipe file`. The export uses both terms for the same action.
- Why this remains blocking: a first-time visitor cannot tell whether the download is the scaled cook card or the original recipe file. This earlier terminology finding is only partly fixed and returns with the same id.
- Concrete fix: choose the actual result and use it everywhere. If the download remains the original input values, use `Export original recipe JSON`. If it becomes the displayed scaled card, use `Export scaled cook card JSON`.

#### F-2-1 — The active-cook-card export claim is not confirmed by its test or behavior

- Exact quote/location: `.factory/claims.json` and README, `Exports the active cook card as JSON.`
- Confirmed behavior: on the live demo, changing the visible card from four to six servings shows `600 g` pasta. The downloaded JSON still contains `servings: 4` and `quantity: 400`. The registered test exports only the unchanged four-serving sample and checks its title and original servings.
- Why this is blocking: the visible active card and the downloaded object differ, while the claim says the active card is exported. The current claim check cannot detect that difference.
- Concrete fix: either export the displayed serving count and scaled ingredient values, then add a test that scales to six before checking the file; or narrow the claim to `Exports the original recipe file as JSON` and test that exact result.

### Minor

#### F-2-2 — The desktop first screen does not show the required three facts

- Exact location: live root at 1440 × 900. `Import YAML or JSON.` begins at about 883 px; the offline, price, and browser-storage facts are below the fold.
- Why this matters: the first-screen contract calls for short privacy, offline, and price facts. A desktop visitor does not see them without scrolling.
- Concrete fix: reduce the desktop hero height or move the fact row above the action-help line so at least offline, price, and local-storage facts fit within 900 px.

#### F-2-3 — “How it works” is not a three-step explanation

- Exact location: landing section `How it works` contains one brace-to-quantity example.
- Why this matters: the required landing structure calls for three clear steps. The current section explains linking syntax but does not show the complete import → scale/cook → save-corrections flow.
- Concrete fix: present three verb-led steps using the real interface: `Import a recipe file`, `Scale and cook each step`, and `Save what changed`.

#### F-2-4 — The upgrade dialog heading does not name its purpose out of context

- Exact quote/location: closed upgrade dialog `h2`, `Kitchen Pass`.
- Why this matters: a screen-reader heading list gives only a product-specific name, not what the section does. The visible eyebrow `One-time upgrade` is a paragraph, not part of the heading.
- Concrete fix: use `Kitchen Pass storage upgrade` or `Save more cook cards and history` as the `h2`.

#### F-2-5 — The skip-link label is wrong on non-recipe routes

- Exact quote/location: `/privacy`, `/terms`, and `/artwork`, `Skip to recipe`.
- Why this matters: those routes contain legal or provenance content, not a recipe. The label gives keyboard users the wrong destination description.
- Concrete fix: use `Skip to main content` on the shared app shell.

#### F-2-6 — The repository’s live QA helper still reports a false failure

- Exact location: `.factory/qa-live.mjs:158` expects a button named `Kitchen Pass active`; the live button reads `History upgrade active`.
- Why this matters: the latest handoff records this known gap, and the helper remains out of date. A maintainer cannot use the repository check as written and receive the correct result.
- Concrete fix: update the expected accessible name to `History upgrade active`, run the helper, and keep its generated evidence outside a prior verification directory.

## Copy audit

Word counts treat a URL, code token, version, or hyphenated term as one word. The middle-dot separator is not a word. Code blocks are examples rather than prose sentences, so their surrounding explanations are counted and the code itself is not. The landing audit includes the initial page and its import and upgrade dialogs.

### Landing-page sentences

| # | Exact sentence | Words | Result |
| ---: | --- | ---: | --- |
| 1 | Scale recipe amounts in every step. | 6 | Pass |
| 2 | For home cooks who need correct quantities while their hands are busy. | 12 | Pass |
| 3 | Open a ready pasta cook card, or paste a recipe you wrote. | 12 | Pass |
| 4 | Import YAML or JSON. | 4 | Pass |
| 5 | Works offline after the first visit. | 6 | Pass; registered claim |
| 6 | $9 once for optional history. | 5 | Pass; registered claim |
| 7 | Recipes stay in this browser. | 5 | Pass; registered claim |
| 8 | Sample cook card workflow: scale, cook, then note changes. | 9 | Pass |
| 9 | See each ingredient amount inside its cooking step. | 8 | Pass |
| 10 | Add `{{salt}}` to the pot. | 5 | Pass; the next sentence explains the braces |
| 11 | The name inside braces matches an ingredient id. | 8 | Pass |
| 12 | Add 1½ tsp fine salt to the pot. | 8 | Pass |
| 13 | Start with a recipe you wrote or can import. | 9 | Pass |
| 14 | This card focuses on scaling and cooking that recipe. | 9 | Pass |
| 15 | Kitchen Pass checkout is unavailable right now. | 7 | Pass; registered claim |
| 16 | The free cook card keeps scaling, cooking, and export. | 9 | Pass; registered behavior |
| 17 | Scaled cook cards for home cooks. | 6 | Pass |
| 18 | Built by Param Factory · build 2026.09.01-polish.1. | 6 | Pass |
| 19 | Artwork provenance. | 2 | Pass as a link label |
| 20 | Paste YAML or JSON below, or choose a small `.yaml`, `.yml`, or `.json` file. | 14 | Pass |
| 21 | The name inside braces matches an ingredient id. | 8 | Pass |
| 22 | Quantities may be decimals or fractions such as `1 1/2`. | 10 | Pass; registered claim |
| 23 | Checkout is unavailable right now. | 5 | Pass; registered claim |
| 24 | Your free cook card stays usable. | 6 | Pass; registered behavior |
| 25 | If you already bought Kitchen Pass, paste your license below. | 10 | Pass |
| 26 | The free cook card includes scaling, cook mode, one saved cook card and its latest correction, offline use, and export. | 20 | Pass; registered claims |
| 27 | Have a license? | 3 | Pass |
| 28 | Paste it here. | 3 | Pass |
| 29 | Sociobot/Dodo is the merchant of record and handles refunds. | 9 | F-1-7 |
| 30 | Refunds revoke the license. | 4 | F-1-7 |

No landing sentence exceeds 22 words or uses a banned marketing adjective.

### Landing headings, actions, and fragments

| Exact text | Words | Result |
| --- | ---: | --- |
| Skip to recipe | 3 | Pass on `/`; F-2-5 on other app routes |
| Scaled Cook Card | 3 | Pass as the wordmark |
| Demo | 1 | Pass as navigation |
| Privacy | 1 | Pass as navigation |
| View history upgrade | 3 | Pass |
| Try it with sample data | 6 | Pass |
| Import my recipe | 3 | Pass |
| How it works | 3 | F-2-3 for incomplete section structure |
| In your recipe file | 4 | Pass |
| becomes | 1 | Pass as a transformation label |
| Recipe boundaries | 2 | Pass |
| What this card does not do | 6 | Pass |
| Optional upgrade | 2 | Pass |
| Optional recipe history | 3 | Pass |
| Import recipe | 2 | Pass |
| Import your recipe | 3 | Pass |
| Choose a recipe file or drop it here | 8 | Pass |
| Recipe YAML or JSON | 4 | Pass |
| Reset example | 2 | Pass |
| Make cook card | 3 | Pass |
| One-time upgrade | 2 | Pass |
| Kitchen Pass | 2 | F-2-4 |
| Save unlimited cook cards | 4 | Pass; registered claim |
| Keep the complete correction history | 5 | Pass; registered claim |
| Restore your license on this device | 7 | Pass; registered claim |
| Restore Kitchen Pass | 3 | Pass |

All landing action labels use a result-naming verb where a verb is required.

### README sentences

| # | Exact sentence | Words | Result |
| ---: | --- | ---: | --- |
| 1 | Scale a recipe once and see the amount inside every cooking step. | 12 | Pass |
| 2 | It is for home cooks whose hands are busy. | 9 | Pass |
| 3 | Use a recipe file you wrote or can import. | 9 | Pass |
| 4 | The cook card scales it while you cook. | 8 | Pass |
| 5 | Live: `https://scaled-cook-card.sociobot.in` | 2 | Pass |
| 6 | Try the isolated sample at `https://scaled-cook-card.sociobot.in/demo`. | 6 | Pass |
| 7 | It uses separate browser storage and never changes a real cook card. | 12 | Pass; registered claim |
| 8 | Imports a recipe and scales each linked ingredient amount in its cooking steps. | 13 | Pass; registered claim |
| 9 | Keeps exact fractions such as `3/16` instead of changing them to a nearby amount. | 14 | Pass; registered claim |
| 10 | Lets you cook with arrow keys when screen wake is unavailable. | 11 | Pass; registered claim |
| 11 | Saves actual yield, substitutions, and notes locally after cooking. | 9 | Pass; registered claim |
| 12 | Exports the active cook card as JSON. | 7 | F-1-15 and F-2-1 |
| 13 | Works offline after the first visit. | 6 | Pass; registered claim |
| 14 | Keeps recipe data in this browser. | 6 | Pass; registered claim |
| 15 | The cooking flow makes no analytics or third-party runtime requests. | 10 | Pass; registered claim |
| 16 | Runs `/demo` with separate `demo:scc:` browser storage. | 7 | Pass; registered claim |
| 17 | When checkout is enabled, Kitchen Pass costs $9 once. | 9 | Pass; registered claim |
| 18 | It keeps unlimited local cook cards and complete local cook history. | 11 | Pass; registered claim |
| 19 | The free cook card keeps scaling, cooking, and export. | 9 | Pass; registered claims |
| 20 | Ingredient `id` values match the names inside `{{braces}}` in each step: | 11 | Pass; format term is explained |
| 21 | A step may instead use an `ingredients` list; its scaled ingredient tokens appear after the step text: | 17 | Pass |
| 22 | Required fields are `title`, positive `servings`, non-empty `ingredients`, and non-empty `steps`. | 11 | Pass |
| 23 | Ingredient quantities may be numbers or fraction strings. | 8 | Pass; registered claim |
| 24 | Requires Node.js 20 or newer. | 5 | Pass |
| 25 | The production build command is `npm run build`. | 8 | Pass |
| 26 | It type-checks and writes `dist/`, with `dist/index.html` at its root. | 10 | Pass |
| 27 | Browser tests use Playwright 1.58.2. | 5 | Pass |
| 28 | Install its Chromium binary before running them. | 7 | Pass |
| 29 | To rebuild the responsive hero images from the original image: | 10 | Pass |
| 30 | Deploy `dist/` as an Azure Static Web App. | 8 | Pass |
| 31 | The deployment file defines routes, headers, MIME types, and caching. | 10 | Pass; maintainer context defines the scope |
| 32 | Versioned assets are cached for one year. | 7 | Pass; registered claim |
| 33 | Bump the artwork URL version when replacing the image. | 9 | Pass |
| 34 | When enabled, the product uses only these Sociobot billing endpoints: | 10 | Pass |
| 35 | Checkout is disabled unless `VITE_KITCHEN_PASS_CHECKOUT_ENABLED` is `true`. | 7 | Pass; registered claim |
| 36 | This hides the buy link until checkout is ready. | 9 | Pass; registered claim |
| 37 | The free cook card and license restore still work. | 9 | Pass; registered behavior |
| 38 | Enable the setting after checkout is available. | 7 | Pass |
| 39 | Confirm that checkout returns a license and that the app restores it. | 12 | Pass |
| 40 | Browser tests use a saved billing response. | 7 | Pass |
| 41 | They confirm license restore without contacting billing. | 7 | Pass |
| 42 | No payment-provider SDK or product id is embedded here. | 9 | Pass; registered claim |
| 43 | MIT. | 1 | Pass |
| 44 | See `LICENSE`. | 2 | Pass |

README headings are `Scaled Cook Card`, `What it does`, `Recipe format`, `Develop and verify`, `Deployment and billing`, `Product records`, and `License`. They make sense in context. No README sentence exceeds 22 words or uses a banned marketing adjective. Technical terms are limited to the recipe-format and maintainer sections.

## Demo and sandbox checks

- Check that one click from `/` opens `/demo`: PASS.
- Check that the first demo screen already shows realistic use: PASS. It shows `Weeknight tomato pasta`, five measured ingredients, four cooking steps, and scaled quantities inside those steps.
- Check that the persistent banner says `Demo — sample data, nothing is saved to your real cook card.` and includes `Reset demo` and `Start for real`: PASS.
- Check that editing four servings to six writes only `demo:scc:target-servings`: PASS.
- Check that a pre-existing real key, `scc:review-2-sentinel`, remains unchanged through entry, editing, Reset, and Start for real: PASS.
- Check that Reset restores four servings and the shipped recipe: PASS.
- Check that Start for real removes demo keys and returns to `/`: PASS.
- Check that the demo works after an offline reload: PASS through the registered claim and full browser suite.
- Check that the live demo request log contains only `https://scaled-cook-card.sociobot.in`: PASS.
- Check that the demo flow has no console or page errors: PASS.

## Registered claims

Every exact command in `.factory/claims.json` ran separately from the clean worktree after `npm ci`.

| Claim id | Exact command | Command result | Coverage result |
| --- | --- | --- | --- |
| `recipe-import-scaling` | `npm run test:e2e -- --grep @claim:recipe-import-scaling` | PASS, 2 projects | Pass |
| `recipe-format` | `npm test -- --testNamePattern @claim:recipe-format` | PASS | Pass |
| `step-binding-list` | `npm test -- --testNamePattern @claim:step-binding-list` | PASS | Pass |
| `actual-yield-correction` | `npm run test:e2e -- --grep @claim:actual-yield-correction` | PASS, 2 projects | Pass |
| `cook-controls` | `npm run test:e2e -- --grep @claim:cook-controls` | PASS, 2 projects | Pass |
| `json-export` | `npm run test:e2e -- --grep @claim:json-export` | PASS, 2 projects | **Fail; F-2-1** |
| `offline-reload` | `npm run test:e2e -- --grep @claim:offline-reload` | PASS, 2 projects | Pass |
| `demo-sandbox` | `npm run test:e2e -- --grep @claim:demo-sandbox` | PASS, 2 projects | Pass |
| `local-only-recipe-data` | `npm run test:e2e -- --grep @claim:local-only-recipe-data` | PASS, 2 projects | Pass |
| `kitchen-pass` | `npm run test:e2e -- --grep @claim:kitchen-pass` | PASS, 2 projects; 2 expected skips | Pass |
| `kitchen-pass-price` | `npm run test:checkout-enabled -- --grep @claim:kitchen-pass-price --project=chromium` | PASS | Pass |
| `paid-history-limits` | `npm run test:e2e -- --grep @claim:paid-history-limits --project=chromium` | PASS | Pass |
| `free-card-limits` | `npm run test:e2e -- --grep @claim:free-card-limits --project=chromium` | PASS | Pass |
| `billing-terms` | `VITE_KITCHEN_PASS_CHECKOUT_ENABLED=true npx playwright test --grep @claim:billing-terms --project=chromium` | PASS | **Fail; F-1-7** |
| `art-provenance` | `npm test -- --testNamePattern @claim:art-provenance` | PASS | Pass |
| `payment-integration` | `npm test -- --testNamePattern @claim:payment-integration` | PASS | Pass |
| `versioned-asset-cache` | `npm test -- --testNamePattern @claim:versioned-asset-cache` | PASS | Pass |

The command results are green, but `json-export` and `billing-terms` do not confirm their complete public wording. The claim audit therefore fails.

## History check

The repository contains `.factory/review-1.md`, `.factory/polish-1.md`, and the verification-5 handoff. Each earlier finding was checked against both the current source and the matching live bundle. Local and live SHA-256 values match for the JavaScript, CSS, service worker, and primary hero image.

| Earlier finding | Current result | Confirmation |
| --- | --- | --- |
| F-1-1 | Fixed | Live `h1` accessible name is `Scale recipe amounts in every step.` |
| F-1-2 | Fixed | Live file input label is `Choose a recipe file or drop it here`. |
| F-1-3 | Fixed | `kitchen-pass-price` is registered and its exact command passes. |
| F-1-4 | Fixed | `paid-history-limits` saves two cards and two corrections after reload. |
| F-1-5 | Fixed | Copy now says `Restore your license on this device`. |
| F-1-6 | Fixed | `free-card-limits` confirms one card and the latest correction. |
| F-1-7 | **Blocking again** | Merchant/refund wording remains broader than the check. |
| F-1-8 | Fixed | Artwork wording links to `/artwork`; `art-provenance` is registered. |
| F-1-9 | Fixed | `payment-integration` is registered and passes. |
| F-1-10 | Fixed | README sentence is split; `versioned-asset-cache` passes. |
| F-1-11 | Fixed | Header and section say `View history upgrade` and `Optional recipe history`. |
| F-1-12 | Fixed | Button says `Restore Kitchen Pass`. |
| F-1-13 | Fixed | Landing and README use linked-amount language instead of `bind`. |
| F-1-14 | Fixed | The brace example is labeled and explained. |
| F-1-15 | **Blocking again** | Export copy still alternates between `cook card` and `recipe`. |
| F-1-16 | Fixed | Repeated product eyebrow is absent. |
| F-1-17 | Fixed | Figure caption now names the sample workflow. |
| F-1-18 | Fixed | Import dialog eyebrow says `Import recipe`. |
| F-1-19 | Fixed | Upgrade eyebrow says `One-time upgrade`. |
| F-1-20 | Fixed | No README sentence exceeds 22 words. |
| F-1-21 | Fixed | Image instruction uses plain wording. |
| F-1-22 | Fixed | Checkout gating describes the hidden buy link. |
| F-1-23 | Fixed | Checkout return instruction names the license result. |
| F-1-24 | Fixed | README explains the saved billing response. |
| F-1-25 | Fixed | Live 404 has route-specific Open Graph and Twitter metadata. |
| F-1-26 | Fixed | Live 404 header, footer, links, and build id match the app shell. |
| F-1-27 | Fixed | Demo wordmark links to `/`; real storage is not replaced. |

The verification-5 handoff’s known stale-helper gap remains and is recorded as F-2-6.

## Structure, routes, accessibility, and visual identity

- Check that `/`, `/demo`, `/privacy`, `/terms`, and `/artwork` return 200: PASS.
- Check that an unknown route returns the designed page with HTTP 404 and a route-specific title, description, canonical, Open Graph image, and favicon: PASS.
- Check that each route has `lang="en"`, one `h1`, one `main`, and an ordered `h1` → `h2` outline: PASS.
- Check that titles follow the route pattern and remain under 60 characters: PASS.
- Check that same-origin links resolve: PASS. All intended links return 200; the tested unknown route correctly returns 404.
- Check that Privacy navigation moves focus to its `h1`, announces `Opened Privacy.`, and Back restores the root `h1`: PASS.
- Check that header and footer navigation are consistent across routes: PASS, apart from the inaccurate shared skip-link label in F-2-5.
- Check that live axe reports no serious or critical findings on landing, demo, Privacy, Terms, Artwork, 404, cook mode, and import dialog: PASS.
- Check that the worker URL verifier reports a title, `lang`, one `h1`, one `main`, image alt text, labeled buttons, and no console errors on `/`: PASS.
- Check that 390 px at 200% text has no horizontal overflow, controls meet 44 px, focus is visible, and reduced motion is respected: PASS through the full browser suite.
- Check that the initial JavaScript remains below budget: PASS, 79.88 kB raw and 26.93 kB gzip.
- Check that the visual identity is distinct: PASS. The warm notebook paper, ruled sheets, asymmetrical work surface, original still-life, ink marks, and correction ledger do not resemble a generic centered SaaS template.
- Check that the standard landing sequence is complete: FAIL for F-2-2 and F-2-3.

## Missed leverage

No additional AI step is justified. Recipe scaling is deterministic arithmetic, and model output would add uncertainty to the core task. Plain-text recipe parsing could be useful later, but the brief explicitly defines YAML/JSON input and prohibits copyrighted-site extraction. Import, local corrections, offline use, paid local history, and JSON export cover the brief’s expected extensions; the existing export must first be made honest under F-2-1.

## Quality-gate evidence

```text
npm ci                                      PASS — 171 packages, 0 vulnerabilities
17 exact claims.json commands               PASS as commands; 2 coverage failures
npm test                                    PASS — 15/15
npm run lint                                PASS
npm run typecheck                           PASS
npm run build                               PASS — dist/index.html produced
npm run test:e2e                            PASS — 47 passed, 5 expected skips
/opt/fleet/lib/verify-url.sh <live> <temp>   PASS
Live Playwright axe, 8 states               PASS — 0 serious/critical
Live route and internal-link crawl          PASS
Local/live asset SHA-256 comparison         PASS — JS, CSS, worker, hero match
```

## What would make this perfect

Resolve F-1-7, F-1-15, and F-2-1 through F-2-6, then rerun the complete review. A perfect round confirms only wording that its claim checks can observe, exports exactly the object it names, uses one term for that object, shows the three first-screen facts on desktop, explains the workflow in three steps, gives every heading and skip link a self-contained purpose, and leaves no stale QA helper.

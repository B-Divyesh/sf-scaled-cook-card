# Review 1 — Scaled Cook Card

Reviewed 2026-09-01 against commit `f70858d7612a31e5e0dbe66a9a1cb7c4d2f54ec2` and <https://scaled-cook-card.sociobot.in>.

## Verdict

**FAIL**

The core product and demo work, all ten registered claim commands pass, and no blocking finding was confirmed. This review still fails because acceptance requires zero findings. There are 27 minor findings: public claims outside the claim registry, unclear or joined copy, one sentence over the 22-word limit, and inconsistencies on the demo and 404 routes.

## Cold first read

Fresh Chromium contexts were opened at 390 × 844 and 1440 × 900. The page was recorded at `scrollY = 0` before interaction or scrolling.

| Question | Mobile answer | Desktop answer | Result |
| --- | --- | --- | --- |
| What does this do? | It scales recipe amounts and places them in each cooking step. | Same. | Pass |
| For whom? | Home cooks whose hands are busy. | Same. | Pass |
| What should I click first? | **Try it with sample data**. | Same. | Pass |

The first screen supplied the exact text needed to answer all three: “Scale recipe amounts in every step.”, “For home cooks who need correct quantities while their hands are busy.”, and “Try it with sample data”. The primary action was visible without scrolling at both sizes. There is no first-screen blocking finding.

## Findings

### Blocking

None confirmed.

### Minor

#### F-1-1 — The visual headline loses a word boundary for assistive technology

- Exact quote/location: landing `h1`; DOM text is `Scale recipe amountsin every step.`
- Why this matters: the `<br>` and following `<em>` have no intervening whitespace. The visual line break looks correct, but the accessible text joins “amounts” and “in”.
- Concrete fix: render `Scale recipe amounts <br><em>in every step.</em>` or add an equivalent accessible name. Add a test that checks the heading’s accessible name.

#### F-1-2 — The upload label also loses a word boundary

- Exact quote/location: import dialog file label; accessible text is `Choose a recipe fileor drop it here`.
- Why this matters: a first-time keyboard or screen-reader user hears one malformed word.
- Concrete fix: include whitespace between the `<strong>` and `<span>` nodes so the accessible label is `Choose a recipe file or drop it here`. Assert that exact accessible name.

#### F-1-3 — The $9 price is not registered as a claim

- Exact quote/location: landing fact, `$9 once for optional history.`; README, `When checkout is enabled, Kitchen Pass is a $9 one-time license.`
- Why this matters: the listed `kitchen-pass` claim covers build gating and license restore, not the advertised price. The separate checkout-enabled test passed, but `.factory/claims.json` does not tell a verifier to run it.
- Concrete fix: add a `kitchen-pass-price` claim whose command runs the checkout-enabled build and asserts `$9 once`, or remove the price until that entry exists.

#### F-1-4 — Paid library and history limits are unlisted and behavior is not checked

- Exact quote/location: README, `It adds an unlimited local recipe library and complete local cook history.`; dialog, `Save unlimited recipe cards` and `Keep the complete correction history`.
- Why this matters: the current claim test confirms the words “License active”; it does not save multiple cards or records and confirm that the paid limits actually change.
- Concrete fix: add a claim and browser test that restores a fixture license, saves at least two recipes and two records for one recipe, reloads, and confirms all remain available.

#### F-1-5 — Cross-device license use is an unlisted claim

- Exact quote/location: Kitchen Pass dialog, `Use the same license on your devices`.
- Why this matters: the current test restores a fixture only in one browser context.
- Concrete fix: add a claim test that restores the same fixture license in two clean contexts, or rewrite this as the narrower tested result: `Restore your license on this device.`

#### F-1-6 — The free-tier storage limits are not registered or fully checked

- Exact quote/location: Kitchen Pass dialog, `The free card still includes scaling, cook mode, one saved recipe and its latest correction, offline use, and export.`
- Why this matters: the registered tests confirm the individual workflow features but do not confirm the one-recipe and latest-correction limits.
- Concrete fix: add a `free-card-limits` claim that verifies replacement of a second recipe and retention of only the latest correction, or remove the numeric limit.

#### F-1-7 — Merchant and refund behavior is unlisted

- Exact quote/location: Kitchen Pass dialog, `Sociobot/Dodo is the merchant of record and handles refunds. Refunds revoke the license.`
- Why this matters: these are purchase and entitlement statements a visitor may rely on, but no claim entry confirms either one.
- Concrete fix: register the merchant statement with an appropriate contract/configuration check and add a recorded revoked-license response test, or keep these statements only where they can be maintained and verified.

#### F-1-8 — The public artwork provenance sentence is outside the claim registry

- Exact quote/location: footer, `Notebook artwork was generated for this product with Azure AI Foundry.`
- Why this matters: the repository contains provenance records, but the public claim is not represented in `.factory/claims.json`.
- Concrete fix: add an `art-provenance` claim that checks the retained prompt metadata and referenced original asset, or link the footer to the documented provenance without making an unregistered assertion.

#### F-1-9 — The payment integration assurance is outside the claim registry

- Exact quote/location: README, `No payment-provider SDK or product id is embedded here.`
- Why this matters: this is an implementation and privacy assurance. The local-request claim does not check the built bundle for provider code or identifiers.
- Concrete fix: add a claim test that checks the built output and request log, or remove the assurance.

#### F-1-10 — The quantitative cache statement is outside the claim registry

- Exact quote/location: README, `public/staticwebapp.config.json supplies direct app routes, a real 404 response, security headers, asset MIME types, and one-year immutable caching for fingerprinted assets and versioned hero art.`
- Why this matters: the one-year cache duration is quantitative. A unit test exists, but it is not tagged or listed as a claim.
- Concrete fix: add a `versioned-asset-cache` entry and tag the existing test. Rewrite the sentence as `The deployment file defines routes, headers, MIME types, and caching. Versioned assets are cached for one year.`

#### F-1-11 — “Kitchen Pass” does not name the result of the header button or section

- Exact quote/location: header button and paid section heading, `Kitchen Pass`.
- Why this matters: a first-time visitor does not yet know that this means optional recipe history and library storage. The button is also a noun rather than a result-naming action.
- Concrete fix: use `View history upgrade` for the button and `Optional recipe history` for the section heading. Keep “Kitchen Pass” in supporting copy if needed.

#### F-1-12 — “Verify” does not name the result

- Exact quote/location: license form button, `Verify`.
- Why this matters: the label does not say what will be verified or what success changes.
- Concrete fix: rename it `Restore Kitchen Pass`.

#### F-1-13 — “Bind” is unexplained implementation language

- Exact quote/location: landing heading, `Bind each amount to its cooking step.`; README, `bound ingredient reference`.
- Why this matters: “bind” describes the data model rather than the result a home cook receives.
- Concrete fix: rewrite the heading as `See each ingredient amount inside its cooking step.` and the README phrase as `linked ingredient amount`.

#### F-1-14 — The raw token example lacks a plain-language label

- Exact quote/location: how-it-works example, `Add {{salt}} to the pot.`; import dialog, `Ingredient ids connect quantities to {{tokens}} in each step.`
- Why this matters: double braces are unexplained syntax on a consumer landing page.
- Concrete fix: label the example `In your recipe file` and add `The name inside braces matches an ingredient id.`

#### F-1-15 — The same object is named inconsistently

- Exact quote/location: `real card`, `cook card`, `recipe card`, `saved recipe`, and `active recipe` across the landing page, dialogs, and README.
- Why this matters: a new visitor cannot tell whether these are different saved objects or different names for one object.
- Concrete fix: use `cook card` for the saved in-app object and `recipe file` for YAML/JSON input everywhere. For example, use `Exports the current cook card as JSON.`

#### F-1-16 — The repeated hero eyebrow carries no new information

- Exact quote/location: `SCALED COOK CARD`, immediately below the header wordmark `Scaled Cook Card`.
- Why this matters: it repeats the product name rather than helping the visitor understand the section.
- Concrete fix: remove it. The headline already states the job.

#### F-1-17 — The hero artwork label is decorative lore

- Exact quote/location: visible label above the image, `FIELD NOTES / 01`.
- Why this matters: it does not identify a section or tell the visitor how to use the product.
- Concrete fix: remove it or use `Sample cook card workflow`.

#### F-1-18 — The import dialog uses a metaphor as a label

- Exact quote/location: import dialog eyebrow, `NEW NOTEBOOK SHEET`.
- Why this matters: the visitor is importing a recipe, not creating an understood “notebook sheet”.
- Concrete fix: replace it with `IMPORT RECIPE` or remove it because the heading already says `Import your recipe`.

#### F-1-19 — The upgrade label contains an unsupported marketing adjective

- Exact quote/location: Kitchen Pass dialog eyebrow, `ONE USEFUL UPGRADE, NO SUBSCRIPTION`.
- Why this matters: “useful” is promotional and adds no verifiable information.
- Concrete fix: rewrite it as `ONE-TIME UPGRADE`.

#### F-1-20 — One README sentence exceeds the 22-word cap and uses dense deployment terms

- Exact quote/location: the 25-word deployment sentence quoted in F-1-10.
- Why this matters: it exceeds the hard cap and combines routing, 404s, headers, MIME types, and caching.
- Concrete fix: use the two-sentence rewrite in F-1-10 and link to the configuration file for details.

#### F-1-21 — The image regeneration instruction uses avoidable jargon

- Exact quote/location: README, `To regenerate the responsive AVIF and WebP hero derivatives from the retained source:`
- Why this matters: “hero derivatives” and “retained source” slow down a maintainer’s first read.
- Concrete fix: use `To rebuild the responsive hero images from the original image:`

#### F-1-22 — The checkout-gating explanation is indirect

- Exact quote/location: README, `This keeps an unavailable shared checkout endpoint out of the product while the free card and license restore path remain usable.`
- Why this matters: “shared checkout endpoint” and “restore path” describe internals instead of the visible result.
- Concrete fix: use `This hides the buy link until checkout is ready. The free card and license restore still work.`

#### F-1-23 — “Return-token flow” is unexplained jargon

- Exact quote/location: README, `After the billing operator verifies the endpoint, build with that setting enabled and verify the hosted redirect and return-token flow.`
- Why this matters: the instruction does not say what result the maintainer must confirm.
- Concrete fix: use `After checkout is available, enable the setting. Confirm that checkout returns a license and that the app restores it.`

#### F-1-24 — “Recorded verification fixture” is unexplained jargon

- Exact quote/location: README, `Browser tests use a recorded verification fixture for the restore path.`
- Why this matters: the sentence does not identify what is recorded or what the test confirms.
- Concrete fix: use `Browser tests use a saved billing response to confirm license restore without contacting billing.`

#### F-1-25 — The designed 404 lacks social metadata

- Exact quote/location: live `/not-a-real-cook-card`; no `og:title`, `og:description`, `og:image`, or `twitter:card` is present.
- Why this matters: the route does not meet the metadata contract applied to every route.
- Concrete fix: add the same product-specific Open Graph image and 404-specific title and description tags to `public/404.html`.

#### F-1-26 — The 404 header and footer do not match the rest of the site

- Exact quote/location: 404 header omits `Kitchen Pass`; footer says `build 2026.08.30-repair.1`, while normal routes say `build 2026.08.30-repair.4` and include the artwork note.
- Why this matters: an unknown URL looks like an older release with different navigation.
- Concrete fix: generate the 404 header/footer from the same release values and link set, or update the static file as part of every build.

#### F-1-27 — The demo wordmark does not link to the site home

- Exact quote/location: `/demo` header, `Scaled Cook Card` has `href="/demo"`.
- Why this matters: the standard header contract says the wordmark returns home; here it reloads the current demo route.
- Concrete fix: set the wordmark to `/` on every route. Keep `Start for real` as the action that clears demo storage, and confirm the intended storage behavior when the home link is used.

## Copy audit

Word counts treat a URL or code token as one word. Code blocks are examples rather than prose sentences and are not counted; all surrounding explanatory sentences are included.

### Landing-page sentences

This includes the initial landing page and the two dialogs reachable from it.

| # | Exact sentence | Words | Result |
| ---: | --- | ---: | --- |
| 1 | Scale recipe amounts in every step. | 6 | Pass; accessible rendering fails F-1-1 |
| 2 | For home cooks who need correct quantities while their hands are busy. | 12 | Pass |
| 3 | Open a ready pasta card, or paste a recipe you wrote. | 11 | Pass |
| 4 | Import YAML or JSON. | 4 | Pass |
| 5 | Works offline after the first visit. | 6 | Pass; registered claim |
| 6 | $9 once for optional history. | 5 | F-1-3 |
| 7 | Recipes stay in this browser. | 5 | Pass; registered claim |
| 8 | Add `{{salt}}` to the pot. | 5 | F-1-14 |
| 9 | Add 1½ tsp fine salt to the pot. | 8 | Pass |
| 10 | Start with a recipe you wrote or can import. | 9 | Pass |
| 11 | This card focuses on scaling and cooking that recipe. | 9 | Pass |
| 12 | Kitchen Pass checkout is unavailable right now. | 7 | Pass; registered claim |
| 13 | The free card keeps scaling, cooking, and export. | 8 | Pass; covered by feature claims |
| 14 | Scaled recipe cards for home cooks. | 6 | Pass |
| 15 | Built by Param Factory · build 2026.08.30-repair.4. | 6 | Pass |
| 16 | Notebook artwork was generated for this product with Azure AI Foundry. | 11 | F-1-8 |
| 17 | Paste YAML or JSON below, or choose a small `.yaml`, `.yml`, or `.json` file. | 14 | Pass |
| 18 | Ingredient ids connect quantities to `{{tokens}}` in each step. | 9 | F-1-14 |
| 19 | Quantities may be decimals or fractions such as 1 1/2. | 10 | Pass; registered claim |
| 20 | Checkout is unavailable right now. | 5 | Pass; registered claim |
| 21 | Your free cook card stays usable. | 6 | Pass |
| 22 | If you already bought Kitchen Pass, paste your license below. | 10 | Pass |
| 23 | The free card still includes scaling, cook mode, one saved recipe and its latest correction, offline use, and export. | 19 | F-1-6 |
| 24 | Have a license? | 3 | Pass |
| 25 | Paste it here. | 3 | Pass |
| 26 | Sociobot/Dodo is the merchant of record and handles refunds. | 9 | F-1-7 |
| 27 | Refunds revoke the license. | 4 | F-1-7 |

### Landing headings, actions, and fragments

| Exact text | Words | Result |
| --- | ---: | --- |
| Skip to recipe | 3 | Pass |
| Scaled Cook Card | 3 | Pass as wordmark; repeated eyebrow fails F-1-16 |
| Demo | 1 | Pass as navigation link |
| Privacy | 1 | Pass as navigation link |
| Kitchen Pass | 2 | F-1-11 |
| Try it with sample data | 6 | Pass |
| Import my recipe | 3 | Pass |
| Scale once | 2 | Pass |
| Cook step by step | 4 | Pass |
| Note what changed | 3 | Pass |
| Field notes / 01 | 3 | F-1-17 |
| How it works | 3 | Pass |
| Bind each amount to its cooking step. | 7 | F-1-13 |
| Recipe boundaries | 2 | Pass |
| What this card does not do | 6 | Pass |
| Optional upgrade | 2 | Pass |
| See Kitchen Pass details | 4 | Pass |
| New notebook sheet | 3 | F-1-18 |
| Import your recipe | 3 | Pass |
| Choose a recipe file or drop it here | 8 | F-1-2 in rendered accessible text |
| Recipe YAML or JSON | 4 | Pass |
| Reset example | 2 | Pass |
| Make cook card | 3 | Pass |
| One useful upgrade, no subscription | 5 | F-1-19 |
| Save unlimited recipe cards | 4 | F-1-4 |
| Keep the complete correction history | 5 | F-1-4 |
| Use the same license on your devices | 7 | F-1-5 |
| Verify | 1 | F-1-12 |

### README sentences

| # | Exact sentence | Words | Result |
| ---: | --- | ---: | --- |
| 1 | Scale a recipe once and see the amount inside every cooking step. | 12 | Pass |
| 2 | It is for home cooks whose hands are busy. | 9 | Pass |
| 3 | Use recipes you wrote or can import. | 7 | Pass |
| 4 | The card focuses on scaling and cooking that recipe. | 9 | Pass |
| 5 | Live: `https://scaled-cook-card.sociobot.in` | 2 | Pass |
| 6 | Try the isolated sample at `https://scaled-cook-card.sociobot.in/demo`. | 6 | Pass |
| 7 | It uses separate browser storage and never changes a real card. | 11 | Pass; F-1-15 terminology |
| 8 | Imports a recipe and scales each bound ingredient reference in its steps. | 12 | F-1-13 and F-1-15 |
| 9 | Keeps exact fractions such as `3/16` instead of changing them to a nearby amount. | 14 | Pass |
| 10 | Lets you cook with arrow keys when screen wake is unavailable. | 11 | Pass |
| 11 | Saves actual yield, substitutions, and notes locally after cooking. | 9 | Pass |
| 12 | Exports the active recipe as JSON. | 6 | F-1-15 terminology |
| 13 | Works offline after the first visit. | 6 | Pass |
| 14 | Keeps recipe data in this browser. | 6 | Pass |
| 15 | The cooking flow makes no analytics or third-party runtime requests. | 10 | Pass |
| 16 | Runs `/demo` with separate `demo:scc:` browser storage. | 7 | Pass |
| 17 | When checkout is enabled, Kitchen Pass is a $9 one-time license. | 11 | F-1-3 |
| 18 | It adds an unlimited local recipe library and complete local cook history. | 12 | F-1-4 |
| 19 | The free card keeps scaling, cooking, and export. | 8 | Pass |
| 20 | Ingredient `id` values bind to `{{id}}` tokens inside steps: | 9 | F-1-13 and F-1-14 |
| 21 | A step may instead use an `ingredients` list; its scaled ingredient tokens appear after the step text: | 17 | Pass in the schema section |
| 22 | Required top-level fields are `title`, positive `servings`, a non-empty `ingredients` array, and a non-empty `steps` array. | 16 | Pass |
| 23 | Ingredient quantities may be numbers or fraction strings. | 8 | Pass |
| 24 | Requires Node.js 20 or newer. | 5 | Pass |
| 25 | The exact production build command is `npm run build`. | 9 | Pass |
| 26 | It type-checks the app and writes the static deployment to `dist/`, with `dist/index.html` at its root. | 16 | Pass |
| 27 | Browser tests use Playwright 1.58.2 and expect its Chromium binary to be installed. | 13 | Pass |
| 28 | To regenerate the responsive AVIF and WebP hero derivatives from the retained source: | 13 | F-1-21 |
| 29 | Deploy `dist/` as an Azure Static Web App. | 8 | Pass |
| 30 | `public/staticwebapp.config.json` supplies direct app routes, a real 404 response, security headers, asset MIME types, and one-year immutable caching for fingerprinted assets and versioned hero art. | 25 | F-1-10 and F-1-20 |
| 31 | Bump the hero-art URL version when replacing that image. | 9 | Pass |
| 32 | When enabled, the product uses only these Sociobot billing endpoints: | 10 | Pass |
| 33 | Checkout is disabled unless the public build setting `VITE_KITCHEN_PASS_CHECKOUT_ENABLED` is exactly `true`. | 12 | Pass |
| 34 | This keeps an unavailable shared checkout endpoint out of the product while the free card and license restore path remain usable. | 21 | F-1-22 |
| 35 | After the billing operator verifies the endpoint, build with that setting enabled and verify the hosted redirect and return-token flow. | 20 | F-1-23 |
| 36 | Browser tests use a recorded verification fixture for the restore path. | 11 | F-1-24 |
| 37 | No payment-provider SDK or product id is embedded here. | 9 | F-1-9 |
| 38 | MIT. | 1 | Pass |
| 39 | See `LICENSE`. | 2 | Pass |

README headings make sense out of context: `Scaled Cook Card` (3), `What it does` (3), `Recipe format` (2), `Develop and verify` (3), `Deployment and billing` (3), `Product records` (2), and `License` (1). No banned plain-words term appears. F-1-15 records inconsistent object names; F-1-13, F-1-14, and F-1-21 through F-1-24 record jargon flags.

## Demo and sandbox checks

- One click from `/` opened `/demo` and immediately showed the realistic `Weeknight tomato pasta` card with five ingredients and four filled cooking steps.
- The persistent banner read `Demo — sample data, nothing is saved to your real card.` and included `Reset demo` and `Start for real`.
- Changing servings from 4 to 6 wrote only `demo:scc:target-servings`; a pre-existing `scc:review-sentinel` remained unchanged.
- `Reset demo` restored servings to 4 and the shipped recipe while retaining the real sentinel unchanged.
- The demo reloaded offline and continued to show the recipe and offline status.
- `Start for real` removed demo keys, returned to `/`, and retained the real sentinel unchanged.
- Every request during the flow used `https://scaled-cook-card.sociobot.in`; no third-party request or console error was recorded.

Result: demo requirements pass. No demo blocking finding.

## Registered claims

All commands were run separately from a fresh clone at commit `f70858d`.

| Claim id | Exact command | Result |
| --- | --- | --- |
| `recipe-import-scaling` | `npm run test:e2e -- --grep @claim:recipe-import-scaling` | Pass, 2 browser projects |
| `recipe-format` | `npm test -- --testNamePattern @claim:recipe-format` | Pass, 1 test |
| `step-binding-list` | `npm test -- --testNamePattern @claim:step-binding-list` | Pass, 1 test |
| `actual-yield-correction` | `npm run test:e2e -- --grep @claim:actual-yield-correction` | Pass, 2 browser projects |
| `cook-controls` | `npm run test:e2e -- --grep @claim:cook-controls` | Pass, 2 browser projects |
| `json-export` | `npm run test:e2e -- --grep @claim:json-export` | Pass, 2 browser projects |
| `offline-reload` | `npm run test:e2e -- --grep @claim:offline-reload` | Pass, 2 browser projects |
| `demo-sandbox` | `npm run test:e2e -- --grep @claim:demo-sandbox` | Pass, 2 browser projects |
| `local-only-recipe-data` | `npm run test:e2e -- --grep @claim:local-only-recipe-data` | Pass, 2 browser projects |
| `kitchen-pass` | `npm run test:e2e -- --grep @claim:kitchen-pass` | Pass, 2 browser projects |

The extra checkout-enabled command also passed once in Chromium. F-1-3 through F-1-10 list public assertions that still need their own claim entries or narrower wording.

## History check

There were no earlier `.factory/review-*.md` or `.factory/polish-*.md` files at the reviewed commit. The pre-review `.factory/handoff.md` recorded no defect IDs and therefore provided no earlier finding to carry forward under the same ID.

Its operational limitation remains accurately represented: checkout is disabled on the live site, there is no buy link, and fixture-backed license restore works. Its test, bundle-size, demo, offline, accessibility, and route summaries were rerun. New F-1-1 through F-1-27 are first-round findings that the earlier handoff did not record.

## Structure, accessibility, and live checks

- `/`, `/demo`, `/privacy`, and `/terms` returned 200. The designed unknown route returned 404.
- Standard routes had route-specific titles, descriptions, canonicals, Open Graph/Twitter metadata, favicon links, one `h1`, `lang="en"`, and a `main` landmark.
- The live internal-link crawl found no dead product link. Fragment targets existed.
- Privacy navigation moved focus to its `h1`, announced `Opened Privacy.`, and browser Back restored `/`, focused the landing `h1`, and announced `Page changed.`
- At 390 px, all checked routes had zero horizontal overflow.
- Playwright axe found no serious or critical issue on `/`, `/demo`, `/privacy`, `/terms`, or the 404 page. The worker `verify-url.sh` passed with no console errors on `/`.
- Focus styles, 44 px targets, form labels, reduced-motion rules, and offline status are present. F-1-1 and F-1-2 are the two confirmed accessible-name defects.
- Live headers include CSP, `X-Content-Type-Options`, `Referrer-Policy`, and `Permissions-Policy`.
- The notebook-paper palette, ruled sheets, original still-life, irregular controls, and correction-ledger layout are product-specific. The page does not have a generic SaaS-template appearance.
- F-1-25 through F-1-27 record the remaining route-contract differences.

## Missed leverage

No missing AI step is warranted. The brief asks for deterministic scaling of user-authored recipes, and an AI parser would introduce cost, uncertainty, and a network dependency without improving the core arithmetic. Import, local storage, offline use, correction history, and JSON export already cover the obvious brief-implied extensions. No decorative runtime AI feature or embedded provider key was found.

## Quality-gate evidence

```text
npm ci                                      PASS — 171 packages, 0 vulnerabilities
npm test                                    PASS — 12/12
npm run lint                                PASS
npm run typecheck                           PASS
npm run build                               PASS — dist/ produced
npm run test:e2e                            PASS — 39 passed, 1 expected skip
npm run test:checkout-enabled -- --project=chromium
                                            PASS — 1/1
/opt/fleet/lib/verify-url.sh <live URL> ...  PASS
Playwright axe on five live routes           PASS — 0 serious/critical
```

The production bundle was 78.85 KB JavaScript raw and 26.68 KB gzip, below the static-product limit.

## What would make this perfect

Resolve F-1-1 through F-1-27, register or narrow every public claim, and rerun this entire review from a fresh context and clone. A perfect next round has no joined accessible words, no unclear or decorative copy, no sentence over 22 words, no unlisted claim, identical current navigation and metadata on the 404, and a home-link contract that is explicit in demo mode.

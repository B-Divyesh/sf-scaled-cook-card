# Adversarial review 5 — Scaled Cook Card

Reviewed 2026-09-02 against source commit `aba9c559a3280099dda48e403c9c148af31354f2` and the live site at <https://scaled-cook-card.sociobot.in>.

## Verdict

**FAIL**

One minor finding remains. The product is clear on a first visit, the one-click demo is a real isolated cook card, every registered claim test passed, and no blocking defect was confirmed. Acceptance requires zero findings.

## Cold first read

Fresh Chromium contexts loaded the root URL before scrolling at 390 × 844 and 1440 × 900. The deployed JavaScript URL (`/assets/index-CVTe0MI3.js`) matched the fresh local production build.

| Question | Answer from the first screen | Result |
| --- | --- | --- |
| What does it do? | It scales ingredient amounts and places the scaled amount in each cooking step. | Pass |
| Who is it for? | Home cooks whose hands are busy. | Pass |
| What should I select first? | **Try it with sample data**. | Pass |

The required information is explicit: `Scale recipe amounts in every step.`, `For home cooks who need correct quantities while their hands are busy.`, and `Try it with sample data`. The action and all three facts were visible without scrolling at both sizes. No first-screen blocking finding applies.

## Findings

### Blocking

None confirmed.

### Minor

#### F-5-1 — README validation rules are an unlisted, untested claim

- Exact quote/location: README, **Recipe format**, `Required fields are title, positive servings, non-empty ingredients, and non-empty steps.`
- Check result: `.factory/claims.json` has no entry for the required-field, positive-serving, or non-empty-list rules. `recipe-format` only claims that recipes use the four fields and permits numeric or fractional quantities. Its tagged test parses one valid sample; it does not assert rejection for each documented validation rule. The adjacent untagged unit test only covers a missing ingredient list and an unknown binding.
- Why this matters: a visitor preparing a recipe file may rely on the stated acceptance rules. The registry therefore does not give an independent verifier a command that proves this public promise.
- Concrete fix: add a `recipe-required-fields` claim, for example `Recipe files need a title, positive servings, at least one ingredient, and at least one step.` Add one tagged unit test that tries each invalid shape and asserts the useful error. Or delete the unsupported validation sentence.

## Copy audit

Counts treat code tokens, URLs, numbers, and hyphenated terms as one word. Recipe-file code examples and command blocks are excluded from prose sentence counting. The landing audit includes the import and Kitchen Pass dialogs, because they are reachable from the landing route. No listed sentence exceeds 22 words, uses a banned marketing adjective, or is a mood/metaphor slogan. F-5-1 is the one claim-registry exception.

### Landing page and dialogs

| Sentence | Words | Check |
| --- | ---: | --- |
| Scale recipe amounts in every step. | 6 | Plain job headline |
| For home cooks who need correct quantities while their hands are busy. | 12 | Audience and change |
| Works offline after the first visit. | 6 | Registered `offline-reload` |
| Kitchen Pass purchase is unavailable. | 5 | Registered `kitchen-pass` |
| Cook cards stay in this browser. | 6 | Registered `local-only-recipe-data` |
| Open a ready pasta cook card, or paste a recipe you wrote. | 12 | Explains each first action |
| Sample cook card workflow: scale, cook, then note changes. | 9 | Informative caption |
| Paste YAML or JSON from a recipe you wrote. | 9 | Format terms explained in import dialog |
| Change servings. | 2 | Direct instruction |
| Linked amounts update where you need them. | 7 | Registered scaling behavior |
| Add `{{salt}}` to the pot. | 5 | Labeled recipe-file example |
| becomes 1½ tsp fine salt | 5 | Labeled example result |
| Record the real yield, substitutions, and notes after cooking. | 10 | Registered correction behavior |
| Start with a recipe you wrote or can import. | 10 | Product boundary |
| This card focuses on scaling and cooking that recipe. | 9 | Product boundary |
| The free cook card keeps scaling, cooking, and export. | 9 | Component behaviors are registered |
| Restore a license you already have. | 6 | Direct action explanation |
| Scaled cook cards for home cooks. | 6 | Footer one-line description |
| Built by Param Factory · build 2026.09.02-polish.4. | 6 | Attribution/build label |
| Paste YAML or JSON below, or choose a small `.yaml`, `.yml`, or `.json` file. | 14 | Import instruction |
| The name inside braces matches an ingredient id. | 8 | Format explanation |
| Quantities may be decimals or fractions such as `1 1/2`. | 10 | Registered `recipe-format` |
| Your free cook card stays usable. | 6 | Registered free-card behavior |
| If you already bought Kitchen Pass, paste your license below. | 10 | Direct next action |
| The free cook card scales, cooks, works offline, and exports the card. | 12 | Component behaviors are registered |
| It keeps one card with its latest correction. | 8 | Registered `free-card-limits` |
| Kitchen Pass purchase is unavailable. | 5 | Repeated legal note; registered `kitchen-pass` |
| Restore a license you already have. | 6 | Repeated legal note; direct action |

Headings name their sections: `Make a cook card in three steps`, `What this card does not do`, and `Optional recipe history`. Result-naming actions are `Try it with sample data`, `Import my recipe`, `Make cook card`, `Reset demo`, `Start for real`, `Restore a license`, `Restore Kitchen Pass`, and `Export scaled cook card JSON`. Terminology is consistent: **recipe file** is imported, a **cook card** is saved/exported, and a **cooking step** contains a **linked ingredient amount**.

### README

| Sentence | Words | Check |
| --- | ---: | --- |
| Scale a recipe once and see the amount inside every cooking step. | 12 | Registered scaling behavior |
| It is for home cooks whose hands are busy. | 9 | Audience |
| Use a recipe file you wrote or can import. | 9 | Scope instruction |
| The cook card scales it while you cook. | 8 | Registered scaling behavior |
| Live: `https://scaled-cook-card.sociobot.in` | 2 | Link label |
| Try the isolated sample at `https://scaled-cook-card.sociobot.in/?demo=1`. | 6 | Demo entry point |
| It uses separate browser storage and never changes a real cook card. | 12 | Registered `demo-sandbox` |
| Imports a recipe and scales each linked ingredient amount in its cooking steps. | 13 | Registered `recipe-import-scaling` |
| Keeps exact fractions such as `3/16` instead of changing them to a nearby amount. | 14 | Registered `recipe-import-scaling` |
| Keeps the screen awake in cook mode when your browser allows it. | 12 | Registered `screen-wake` |
| Arrow keys still work when screen wake is unavailable. | 9 | Registered `cook-controls` |
| Saves actual yield, substitutions, and notes locally after cooking. | 9 | Registered `actual-yield-correction` |
| Exports the displayed scaled cook card as JSON. | 8 | Registered `json-export` |
| Works offline after the first visit. | 6 | Registered `offline-reload` |
| Keeps recipe data in this browser. | 6 | Registered `local-only-recipe-data` |
| The cooking flow makes no analytics or third-party runtime requests. | 10 | Registered `local-only-recipe-data` |
| Runs `/demo` with separate `demo:scc:` browser storage. | 7 | Registered `demo-sandbox` |
| When checkout is enabled, Kitchen Pass costs $9 once. | 9 | Registered `kitchen-pass-price` |
| It keeps unlimited local cook cards and complete local cook history. | 11 | Registered `paid-history-limits` |
| The free cook card keeps scaling, cooking, and scaled cook card export. | 11 | Component behaviors are registered |
| Ingredient `id` values match the names inside `{{braces}}` in each step. | 11 | Format/binding behavior is covered |
| A step may instead use an `ingredients` list; its scaled ingredient tokens appear after the step text. | 17 | Registered `step-binding-list` |
| Required fields are `title`, positive `servings`, non-empty `ingredients`, and non-empty `steps`. | 11 | **F-5-1** |
| Ingredient quantities may be numbers or fraction strings. | 8 | Registered `recipe-format` |
| Requires Node.js 20 or newer. | 5 | Maintainer instruction |
| The production build command is `npm run build`. | 8 | Maintainer instruction |
| It type-checks and writes `dist/`, with `dist/index.html` at its root. | 10 | Maintainer instruction |
| Browser tests use Playwright 1.58.2. | 5 | Maintainer instruction |
| Install its Chromium binary before running them. | 7 | Maintainer instruction |
| To rebuild the responsive hero images from the original image: | 10 | Command introduction |
| Deploy `dist/` as an Azure Static Web App. | 8 | Maintainer instruction |
| The deployment file defines routes, headers, MIME types, and caching. | 10 | Maintainer instruction |
| Versioned assets are cached for one year. | 7 | Registered `versioned-asset-cache` |
| Bump the artwork URL version when replacing the image. | 9 | Maintainer instruction |
| When enabled, the product uses only these Sociobot billing endpoints: | 10 | Endpoint list introduction |
| Checkout is disabled unless `VITE_KITCHEN_PASS_CHECKOUT_ENABLED` is `true`. | 7 | Registered `kitchen-pass` |
| This hides the buy link until checkout is ready. | 9 | Registered `kitchen-pass` |
| The free cook card and license restore still work. | 9 | Registered component behavior |
| Enable the setting after checkout is available. | 7 | Maintainer instruction |
| Confirm that checkout returns a license and that the app restores it. | 12 | Maintainer instruction |
| Browser tests use a saved billing response. | 7 | Maintainer instruction |
| They confirm license restore without contacting billing. | 7 | Maintainer instruction |
| No payment-provider SDK or product id is embedded here. | 9 | Registered `payment-integration` |
| MIT. | 1 | License statement |
| See `LICENSE`. | 2 | Link instruction |

## Demo, privacy, claims, and sandbox checks

- **One click and first demo screen:** selecting **Try it with sample data** loaded `/?demo=1` and immediately displayed the usable **Weeknight tomato pasta** card, five ingredients, four steps, serving controls, and the cook action. This is not a landing-page mockup.
- **Demo banner and reset:** direct `/demo` showed `Demo — sample data, nothing is saved to your real cook card.` with **Reset demo** and **Start for real**. Reset restored four servings. Starting for real removed all `demo:scc:` keys.
- **Storage isolation:** I seeded `scc:sentinel = real-data`, changed demo servings, reset, and left demo. The real sentinel was unchanged; demo writes used only `demo:scc:` and were discarded on exit.
- **Network/privacy:** the full live demo flow requested only the live product origin (`/`, its JS, CSS, artwork, and demo navigation). There were no console errors and no third-party requests.
- **Offline:** `@claim:offline-reload` passed in a new browser context after service-worker installation and `context.setOffline(true)`; the sample card reloaded and reported offline state.
- **Registered claims:** all 18 registry entries have exactly one tagged test. In this clean checkout, `npm run test:e2e` passed 62 tests; `npm run test:checkout-enabled` passed 4; the checkout-enabled `billing-terms` command passed; and each of the five exact tagged Vitest commands passed. No registered claim test failed.

## Structure, routes, and accessibility

- `/`, `/demo`, `/privacy`, `/terms`, and `/artwork` each returned 200. A nonexistent route returned the designed static 404 with HTTP 404.
- Each inspected application route had one `<main>`, one `<h1>`, a route-specific title, description, canonical URL, OG/Twitter metadata, favicon, shared header/footer, and Privacy/Terms links. The static 404 provides matching metadata and a back action.
- The header has a home wordmark, Demo, Privacy, and one license action. The skip link works. Browser tests confirm History API navigation, Back focus on the new `<h1>`, and a polite route announcement.
- The sitemap lists all five routes. The live CSP, `nosniff`, referrer policy, permissions policy, and `frame-ancestors` response header are present. Crawled internal destinations were live.
- The full browser suite's axe audit found no serious or critical landing-page issues. Keyboard cook navigation, unsupported screen-wake fallback, supported screen-wake request/release, visible focus handling, reduced-motion CSS, touch sizes, and 390px layout are covered by the suite and inspected live.
- The warm ruled-paper, notebook photography, uneven card corners, graphite/tomato/sage palette, and original notebook asset are recognizably product-specific rather than a generic SaaS template.

## History check

All earlier review, polish, and handoff records were read. The table records a current source and live-site check, not the prior document's status label.

| Earlier finding | Current check |
| --- | --- |
| F-1-1 | Fixed: the live H1 accessible name includes the word boundary before `in every step`. |
| F-1-2 | Fixed: the file label is `Choose a recipe file or drop it here`. |
| F-1-3 | Fixed: the conditional price is registered as `kitchen-pass-price`; its checkout-enabled test passed. |
| F-1-4 | Fixed: paid multi-card and correction history are registered and exercised by `paid-history-limits`. |
| F-1-5 | Fixed: current wording promises restore on this device, not multi-device use. |
| F-1-6 | Fixed: free one-card/latest-correction behavior is registered and tested. |
| F-1-7 | Fixed: billing wording is limited to the tested Sociobot checkout and revoked-license effect. |
| F-1-8 | Fixed: artwork provenance is linked and registered. |
| F-1-9 | Fixed: the payment-SDK/product-id assurance is registered and source-tested. |
| F-1-10 | Fixed: one-year versioned cache wording is registered and deployment-tested. |
| F-1-11 | Fixed: checkout-disabled header action is `Restore a license`. |
| F-1-12 | Fixed: the form action is `Restore Kitchen Pass`. |
| F-1-13 | Fixed: public workflow copy uses linked ingredient amounts, not `bind`. |
| F-1-14 | Fixed: brace syntax is explicitly explained as an ingredient id. |
| F-1-15 | Fixed: UI and README use `scaled cook card JSON`. |
| F-1-16 | Fixed: the duplicate hero eyebrow remains absent. |
| F-1-17 | Fixed: artwork caption states the sample workflow. |
| F-1-18 | Fixed: import UI says `Import my recipe` and `Choose a recipe file`. |
| F-1-19 | Fixed: the upgrade label is factual `One-time upgrade`. |
| F-1-20 | Fixed: README deployment prose is split into short sentences. |
| F-1-21 | Fixed: artwork rebuild wording is direct. |
| F-1-22 | Fixed: checkout gating plainly says the buy link is hidden. |
| F-1-23 | Fixed: checkout return wording says restore a license. |
| F-1-24 | Fixed: billing fixture wording is plain and scoped to tests. |
| F-1-25 | Fixed: the static 404 has OG and Twitter metadata. |
| F-1-26 | Fixed: the static 404 uses current navigation, footer, and build label. |
| F-1-27 | Fixed: demo wordmark exit clears only demo storage. |
| F-2-1 | Fixed: JSON export test asserts displayed servings and scaled pasta quantity. |
| F-2-2 | Fixed: all first-screen facts are visible at 390px and desktop. |
| F-2-3 | Fixed: the landing contains import, scale/cook, and correction steps. |
| F-2-4 | Fixed: dialog H2 is `Kitchen Pass storage upgrade`. |
| F-2-5 | Fixed: every route says `Skip to main content`. |
| F-2-6 | Fixed: maintained live QA and current browser suite pass. |
| F-3-1 | Fixed: the workflow H2 is `Make a cook card in three steps`. |
| F-4-1 | Fixed: `screen-wake` is registered and verifies request, release, and denial recovery. |
| F-4-2 | Fixed: `npm run lint` passed in this checkout. |
| F-4-3 | Fixed: Privacy says recipes stay in the browser, not the database. |
| F-4-4 | Fixed: free-tier dialog copy is split into 12- and 8-word sentences. |

## Missed leverage

No missing AI feature is indicated: the brief's job is deterministic recipe arithmetic and a hands-free cooking procedure. Importing a user-authored YAML/JSON recipe and exporting the displayed scaled JSON are already present; adding a gateway model call would be decorative rather than useful.

## What would make this perfect

Register and test the README's recipe validation promise as described in F-5-1. With that one public assertion independently verifiable, this review would have no remaining finding.

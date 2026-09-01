# Adversarial first-read review 4 — Scaled Cook Card

Reviewed 2026-09-01 against commit `bbed9cb7deb8c272bc13611a75b75d77d7dc415b` and <https://scaled-cook-card.sociobot.in>.

## Verdict

**FAIL**

The first screen, sample flow, registered claims, offline flow, routes, metadata, visual identity, build, typecheck, and browser suite are sound. Three blocking findings and two minor findings remain. A prior clarity repair has regressed, a screen-wake promise has no claim test, and the documented lint command fails from a clean checkout.

## Cold first read

Fresh Chromium contexts at 390 × 844 and 1440 × 900 loaded `/` without prior storage. Before scrolling, the page answered all three required questions.

| Question | Answer from the first screen | Result |
| --- | --- | --- |
| What does this do? | It scales recipe amounts in every cooking step. | Pass |
| For whom? | Home cooks whose hands are busy. | Pass |
| What should I click first? | **Try it with sample data**. | Pass |

The exact supporting copy is “Scale recipe amounts in every step.”, “For home cooks who need correct quantities while their hands are busy.”, and “Try it with sample data”. The three facts are visible in both views. The warm ruled-paper, notebook, and ingredient-token treatment is distinct and not a generic SaaS template.

## Findings

### Blocking

#### F-1-11 — The header history action has regressed to an unexplained product term

- Exact quote/location: live `/` header at both viewport sizes and `src/main.ts`, `Restore a Kitchen Pass`.
- Why this is a regression: review 1 found that `Kitchen Pass` did not tell a first-time visitor what the header action or section was for. The recorded repair changed the header to `View history upgrade`. The current checkout-disabled branch replaces it with `Restore a Kitchen Pass`; a visitor who has never seen the product has no reason to know what a Kitchen Pass is or why to open it. This is not the real first action, but it is prominent header navigation and fails the prior finding again.
- Concrete fix: use `Restore a license` in the checkout-disabled header, which says what the action does, or retain `View history upgrade` and make the dialog explain the unavailable purchase and license restore. Add a browser assertion for the checkout-disabled header’s accessible name.

#### F-4-1 — Screen wake is a public feature claim without a registered success test

- Exact quote/location: cook-mode checkbox, `Keep screen awake while cooking.` Its enabled-state message is `Screen wake is active.`
- Why this matters: this is a feature a cook may rely on. `.factory/claims.json` only registers the narrower fallback claim, “Arrow-key cooking remains available when screen wake is unsupported.” The existing test deletes `navigator.wakeLock`; it never proves that a supported browser requests and holds a screen wake. The public success promise is therefore unlisted and untested.
- Concrete fix: add a claim such as `screen-wake` and a Playwright test that mocks a successful `navigator.wakeLock.request('screen')`, checks the active message, and checks release on exit. Also test the rejected-request recovery message. If the feature is not supported as a promise, change the label to an explicit request with an explained fallback and remove the success assertion.

#### F-4-2 — The documented lint verification command fails in a clean checkout

- Exact quote/location: README’s development command `npm run lint`; clean clone at the reviewed commit.
- Observed result: `npm run lint` exits non-zero with **172 errors**. ESLint lints the committed generated evidence file `.factory/evidence-repair-5/live-index-BJSHDrOR.js`; examples include `@typescript-eslint/no-unused-expressions` at line 1:282 and unused variables at line 32. `eslint.config.mjs` ignores `dist/**`, `node_modules/**`, test results, and Playwright reports, but not `.factory/evidence-*` artifacts.
- Why this matters: the README tells a maintainer to run this command, while the handoff says lint passes. A clean verification cannot reproduce that handoff.
- Concrete fix: lint only maintained source and test files, or add generated `.factory/evidence-*/**` artifacts to ESLint ignores. Run `npm run lint` from a fresh checkout and retain its zero-error output.

### Minor

#### F-4-3 — The Privacy lede uses a metaphor instead of the direct storage fact

- Exact quote/location: `/privacy` lede, `Your recipes belong in your kitchen, not in our database.`
- Why this matters: “belong in your kitchen” is a mood metaphor. It makes a concrete privacy answer less direct and violates the plain-words rule against metaphor copy on every page.
- Concrete fix: `Your recipes stay in your browser, not in our database.`

#### F-4-4 — One Kitchen Pass dialog sentence exceeds the 22-word cap

- Exact quote/location: Kitchen Pass dialog, `The free cook card includes scaling, cook mode, one saved cook card and its latest correction, offline use, and scaled cook card export.` — **23 words**.
- Why this matters: it combines five separate limits and capabilities. This is the one place a visitor deciding whether to restore a license needs short, scannable terms.
- Concrete fix: `The free cook card scales, cooks, works offline, and exports the card. It keeps one card with its latest correction.`

## Copy audit

Counts treat URLs, code tokens, and hyphenated terms as one word. The landing audit includes the import and Kitchen Pass dialogs reachable from the landing route. No landing or README sentence uses a banned marketing adjective. Findings are noted above.

### Landing-page sentences

| Text | Words | Result |
| --- | ---: | --- |
| Scale recipe amounts in every step. | 6 | Pass |
| For home cooks who need correct quantities while their hands are busy. | 12 | Pass |
| Works offline after the first visit. | 6 | Registered claim |
| Kitchen Pass purchase is unavailable. | 5 | Registered build-gating claim |
| Cook cards stay in this browser. | 6 | Registered local-data claim |
| Open a ready pasta cook card, or paste a recipe you wrote. | 12 | Pass |
| Sample cook card workflow: scale, cook, then note changes. | 9 | Pass |
| Make a cook card in three steps. | 7 | Pass heading |
| Paste YAML or JSON from a recipe you wrote. | 9 | Pass |
| Change servings. | 2 | Pass |
| Linked amounts update where you need them. | 7 | Registered scaling claim |
| Add `{{salt}}` to the pot. | 5 | Labeled recipe-file example |
| becomes 1½ tsp fine salt | 5 | Example result |
| Record the real yield, substitutions, and notes after cooking. | 10 | Registered correction claim |
| Start with a recipe you wrote or can import. | 10 | Pass |
| This card focuses on scaling and cooking that recipe. | 9 | Pass |
| The free cook card keeps scaling, cooking, and export. | 9 | Covered by registered feature claims |
| Restore a license you already have. | 6 | Pass |
| Scaled cook cards for home cooks. | 6 | Footer description |
| Built by Param Factory · build 2026.09.01-repair.5. | 6 | Footer attribution |
| Paste YAML or JSON below, or choose a small `.yaml`, `.yml`, or `.json` file. | 14 | Pass |
| The name inside braces matches an ingredient id. | 8 | Pass |
| Quantities may be decimals or fractions such as `1 1/2`. | 10 | Registered format claim |
| Your free cook card stays usable. | 6 | Covered by registered free-card behavior |
| If you already bought Kitchen Pass, paste your license below. | 10 | Pass |
| The free cook card includes scaling, cook mode, one saved cook card and its latest correction, offline use, and scaled cook card export. | 23 | **F-4-4** |
| Checkout is unavailable right now. | 5 | Registered build-gating claim |
| Unlimited recipe library and full cook history are unlocked. | 9 | Registered paid-history claim |

Landing headings and actions are descriptive except `Restore a Kitchen Pass`, which is **F-1-11**. `Try it with sample data`, `Import my recipe`, `Make cook card`, `Reset example`, and `Restore Kitchen Pass` name their results. `Make a cook card in three steps`, `What this card does not do`, and `Optional recipe history` work out of context.

### README sentences

| Text | Words | Result |
| --- | ---: | --- |
| Scale a recipe once and see the amount inside every cooking step. | 12 | Pass |
| It is for home cooks whose hands are busy. | 9 | Pass |
| Use a recipe file you wrote or can import. | 9 | Pass |
| The cook card scales it while you cook. | 8 | Pass |
| Live: `https://scaled-cook-card.sociobot.in` | 2 | Pass |
| Try the isolated sample at `https://scaled-cook-card.sociobot.in/?demo=1`. | 6 | Pass |
| It uses separate browser storage and never changes a real cook card. | 12 | Registered demo claim |
| Imports a recipe and scales each linked ingredient amount in its cooking steps. | 13 | Registered scaling claim |
| Keeps exact fractions such as `3/16` instead of changing them to a nearby amount. | 14 | Registered scaling claim |
| Lets you cook with arrow keys when screen wake is unavailable. | 11 | Registered fallback claim |
| Saves actual yield, substitutions, and notes locally after cooking. | 9 | Registered correction claim |
| Exports the displayed scaled cook card as JSON. | 8 | Registered export claim |
| Works offline after the first visit. | 6 | Registered offline claim |
| Keeps recipe data in this browser. | 6 | Registered local-data claim |
| The cooking flow makes no analytics or third-party runtime requests. | 10 | Registered local-data claim |
| Runs `/demo` with separate `demo:scc:` browser storage. | 7 | Registered demo claim |
| When checkout is enabled, Kitchen Pass costs $9 once. | 9 | Registered price claim |
| It keeps unlimited local cook cards and complete local cook history. | 11 | Registered paid-history claim |
| The free cook card keeps scaling, cooking, and scaled cook card export. | 11 | Covered by registered feature claims |
| Ingredient `id` values match the names inside `{{braces}}` in each step: | 11 | Format explanation |
| A step may instead use an `ingredients` list; its scaled ingredient tokens appear after the step text: | 17 | Registered format claim |
| Required fields are `title`, positive `servings`, non-empty `ingredients`, and non-empty `steps`. | 11 | Pass |
| Ingredient quantities may be numbers or fraction strings. | 8 | Registered format claim |
| Requires Node.js 20 or newer. | 5 | Maintainer instruction |
| The production build command is `npm run build`. | 8 | Maintainer instruction |
| It type-checks and writes `dist/`, with `dist/index.html` at its root. | 10 | Maintainer instruction |
| Browser tests use Playwright 1.58.2. | 5 | Maintainer instruction |
| Install its Chromium binary before running them. | 7 | Maintainer instruction |
| To rebuild the responsive hero images from the original image: | 10 | Pass |
| Deploy `dist/` as an Azure Static Web App. | 8 | Maintainer instruction |
| The deployment file defines routes, headers, MIME types, and caching. | 10 | Maintainer instruction |
| Versioned assets are cached for one year. | 7 | Registered cache claim |
| Bump the artwork URL version when replacing the image. | 9 | Maintainer instruction |
| When enabled, the product uses only these Sociobot billing endpoints: | 10 | Maintainer instruction |
| Checkout is disabled unless `VITE_KITCHEN_PASS_CHECKOUT_ENABLED` is `true`. | 7 | Registered build-gating claim |
| This hides the buy link until checkout is ready. | 9 | Registered build-gating claim |
| The free cook card and license restore still work. | 9 | Covered by registered behavior |
| Enable the setting after checkout is available. | 7 | Maintainer instruction |
| Confirm that checkout returns a license and that the app restores it. | 12 | Maintainer instruction |
| Browser tests use a saved billing response. | 7 | Maintainer instruction |
| They confirm license restore without contacting billing. | 7 | Maintainer instruction |
| No payment-provider SDK or product id is embedded here. | 9 | Registered payment-integration claim |
| MIT. | 1 | Pass |
| See `LICENSE`. | 2 | Pass |

No README sentence exceeds 22 words. Its technical terms are confined to recipe-format and maintainer instructions.

## Demo, sandbox, privacy, and claims

- One click on **Try it with sample data** opens `/?demo=1`. The first resulting screen is already the real product: Weeknight tomato pasta, five realistic ingredients, four steps, and quantities inside the steps.
- Direct `/demo` shows the persistent `Demo — sample data, nothing is saved to your real cook card.` banner with **Reset demo** and **Start for real**. The registered demo claim confirms reset and that the `demo:scc:` namespace cannot alter a real-storage sentinel.
- A fresh live demo request log contained only `https://scaled-cook-card.sociobot.in`; it emitted no console or page errors. The registered local-data and offline-reload checks passed.
- All 17 exact commands declared in `.factory/claims.json` were run from `/tmp/scaled-cook-card-review4`, a clean detached clone at the reviewed commit. They passed: `recipe-import-scaling`, `recipe-format`, `step-binding-list`, `actual-yield-correction`, `cook-controls`, `json-export`, `offline-reload`, `demo-sandbox`, `local-only-recipe-data`, `kitchen-pass`, `kitchen-pass-price`, `paid-history-limits`, `free-card-limits`, `billing-terms`, `art-provenance`, `payment-integration`, and `versioned-asset-cache`.
- No listed claim test failed. **F-4-1** remains because the visible supported-browser screen-wake claim has no registry entry or test.

## History check

All earlier reviews, polish records, and the handoff were read. The following checks were made against current source and the live deployment, not their “fixed” labels.

| Earlier finding | Current result |
| --- | --- |
| F-1-1 | Fixed: H1 accessible text has the space before `in every step`. |
| F-1-2 | Fixed: file label reads `Choose a recipe file or drop it here`. |
| F-1-3 | Fixed: price has a registered checkout-enabled check. |
| F-1-4 | Fixed: paid multi-card and history limits have a dedicated check. |
| F-1-5 | Fixed: device wording is limited to restoring a license on this device. |
| F-1-6 | Fixed: free one-card/latest-correction behavior is registered. |
| F-1-7 | Fixed: billing wording is limited to Sociobot checkout and revoked-license history. |
| F-1-8 | Fixed: provenance links to `/artwork` and is registered. |
| F-1-9 | Fixed: payment-integration assurance is registered. |
| F-1-10 | Fixed: cache duration is registered and README prose is split. |
| F-1-11 | **Blocking regression: current header says `Restore a Kitchen Pass`; see F-1-11 above.** |
| F-1-12 | Fixed: the form action says `Restore Kitchen Pass`. |
| F-1-13 | Fixed: public copy uses linked-amount language. |
| F-1-14 | Fixed: brace syntax is labeled and explained. |
| F-1-15 | Fixed: export is consistently called scaled cook card JSON. |
| F-1-16 | Fixed: the duplicate product eyebrow is absent. |
| F-1-17 | Fixed: the image caption describes the workflow. |
| F-1-18 | Fixed: import dialog label says `Import recipe`. |
| F-1-19 | Fixed: upgrade eyebrow says `One-time upgrade`. |
| F-1-20 | Fixed except the separate dialog overflow in F-4-4; README has no overlong sentence. |
| F-1-21 | Fixed: image rebuild instruction uses plain wording. |
| F-1-22 | Fixed: checkout gating says the buy link is hidden. |
| F-1-23 | Fixed: checkout return guidance names license restoration. |
| F-1-24 | Fixed: saved billing response is explained plainly. |
| F-1-25 | Fixed: live 404 includes route-specific social metadata. |
| F-1-26 | Fixed: 404 header, footer, navigation, and build id match the app. |
| F-1-27 | Fixed: demo wordmark points home and exits demo storage. |
| F-2-1 | Fixed: six-serving export checks servings 6 and pasta 600. |
| F-2-2 | Fixed: all three first-screen facts are visible at desktop and mobile. |
| F-2-3 | Fixed: landing presents import, scale/cook, and save steps. |
| F-2-4 | Fixed: dialog H2 is `Kitchen Pass storage upgrade`. |
| F-2-5 | Fixed: all routes use `Skip to main content`. |
| F-2-6 | Fixed: live QA helper expects `History upgrade active`. |
| F-3-1 | Fixed: the H2 is `Make a cook card in three steps`. |

## Structure, quality, and leverage

- `/`, `/demo`, `/privacy`, `/terms`, and `/artwork` return 200. An unknown route returns the designed 404 with HTTP 404.
- Each checked route has one H1/main landmark, `lang="en"`, an appropriate route title, description, canonical URL, social image, and favicon. `robots.txt` and `sitemap.xml` return 200.
- The live app provides deep links, back navigation with focus/announcement coverage in the passing Playwright suite, common header/footer, and no dead product links. The live root/demo console was clean.
- `npm test` passed 15 tests. `npm run typecheck`, `npm run build`, and `npm run test:e2e` passed from the clean clone; the Playwright last-run status is `passed`. `npm run lint` fails as **F-4-2**.
- No missing AI feature was found. Deterministic recipe scaling should not be delegated to a model. The brief-implied import, offline local storage, corrections, and export are present.

## What would make this perfect

Use a plain header action for license restoration, register and prove screen-wake success, make the lint command pass in a clean checkout, replace the Privacy metaphor, and split the 23-word free-tier sentence. Then rerun all 17 exact claim commands, `npm test`, `npm run lint`, `npm run build`, and the full browser suite against the deployed bytes.

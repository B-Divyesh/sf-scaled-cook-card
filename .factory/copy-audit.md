# Copy audit

Reviewed 2026-09-02. Counts treat code tokens and hyphenated terms as one word. Recipe examples are code, not prose.

## Landing page and reachable dialogs

| Copy | Words | Result |
| --- | ---: | --- |
| Scale recipe amounts in every step. | 6 | Pass |
| For home cooks who need correct quantities while their hands are busy. | 12 | Pass |
| Works offline after the first visit. | 6 | Pass; registered claim |
| Kitchen Pass purchase is unavailable. | 5 | Pass; registered claim |
| Cook cards stay in this browser. | 6 | Pass; registered claim |
| Open a ready pasta cook card, or paste a recipe you wrote. | 12 | Pass |
| Sample cook card workflow: scale, cook, then note changes. | 9 | Pass |
| Make a cook card in three steps. | 7 | Pass |
| Paste YAML or JSON from a recipe you wrote. | 9 | Pass |
| Change servings. | 2 | Pass |
| Linked amounts update where you need them. | 7 | Pass; registered claim |
| Add `{{salt}}` to the pot. | 5 | Pass; recipe-file example |
| becomes 1½ tsp fine salt | 5 | Pass; example result |
| Record the real yield, substitutions, and notes after cooking. | 10 | Pass; registered claim |
| Start with a recipe you wrote or can import. | 10 | Pass |
| This card focuses on scaling and cooking that recipe. | 9 | Pass |
| The free cook card keeps scaling, cooking, and export. | 9 | Pass; registered feature claims |
| Restore a license you already have. | 6 | Pass |
| Scaled cook cards for home cooks. | 6 | Pass |
| Built by Param Factory · build 2026.09.02-polish.4. | 6 | Pass |
| Paste YAML or JSON below, or choose a small `.yaml`, `.yml`, or `.json` file. | 14 | Pass |
| The name inside braces matches an ingredient id. | 8 | Pass |
| Quantities may be decimals or fractions such as `1 1/2`. | 10 | Pass; registered claim |
| Your free cook card stays usable. | 6 | Pass |
| If you already bought Kitchen Pass, paste your license below. | 10 | Pass |
| The free cook card scales, cooks, works offline, and exports the card. | 12 | Pass; registered feature claims |
| It keeps one card with its latest correction. | 8 | Pass; registered claim |
| Checkout is unavailable right now. | 5 | Pass; registered claim |
| Unlimited recipe library and full cook history are unlocked. | 9 | Pass; registered claim |

No sentence exceeds 22 words. No banned marketing term or metaphor appears.

## Headings and actions

All headings name their section without relying on nearby labels. Actions use direct labels: `Try it with sample data`, `Import my recipe`, `Restore a license`, `Make cook card`, `Restore Kitchen Pass`, and `Export scaled cook card JSON`.

The first screen states the job in six words, identifies home cooks in twelve words, shows the sample action, and lists offline, purchase, and storage facts.

## Legal copy repaired in round 4

`Your recipes stay in your browser, not in our database.` has 10 words and states the storage fact directly.

## README

No README sentence exceeds 22 words. Technical terms appear only in recipe-format and maintainer instructions. Public behavior statements map to `.factory/claims.json`.

## Catalog description

`Scale recipe servings and show each amount inside its cooking step.` — 11 words, 67 characters, verb first, no banned words.

## Terminology

| Concept | Product term |
| --- | --- |
| A recipe shown in the app | cook card |
| Imported input | recipe file |
| The prepared instructions | cooking step |
| A quantity linked to a step | linked ingredient amount |
| The paid license | Kitchen Pass |
| The action when purchase is unavailable | restore a license |
| Isolated sample state | demo |

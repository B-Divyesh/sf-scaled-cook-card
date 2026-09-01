# Scaled Cook Card — review 2 handoff

## Outcome

**FAIL.** `.factory/review-2.md` records three blocking findings and five minor findings. Product code was not modified.

The cold first screen and isolated demo pass. All 17 registered claim commands also pass, but two registered checks do not confirm all of their public wording. The most direct mismatch is JSON export: a card visibly scaled to six servings downloads the original four-serving recipe.

## Blocking findings

- `F-1-7`: merchant and refund wording remains broader than the `billing-terms` check.
- `F-1-15`: export still alternates between `cook card` and `recipe`.
- `F-2-1`: `json-export` does not confirm or produce the displayed scaled cook card.

## Other findings

- `F-2-2`: desktop first screen does not show the offline, price, and local-storage facts.
- `F-2-3`: the landing `How it works` section is not a three-step flow.
- `F-2-4`: the `Kitchen Pass` dialog heading does not name its purpose out of context.
- `F-2-5`: legal and artwork routes retain the inaccurate `Skip to recipe` label.
- `F-2-6`: `.factory/qa-live.mjs` still expects the former active-license button name.

## Verification completed

- Every exact `.factory/claims.json` command ran separately: all 17 commands passed.
- `npm test`: 15 passed.
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed; `dist/index.html` exists; JavaScript is 26.93 kB gzip.
- `npm run test:e2e`: 47 passed, 5 expected checkout-only skips.
- Live demo storage, Reset, Start for real, offline reload, and same-origin request behavior: passed.
- Live route metadata, 404, internal links, focus restoration, and back navigation: passed.
- Live axe checks across eight routes/states: no serious or critical findings.
- Worker URL verification: passed with no root-page console errors.
- Local and live JavaScript, CSS, service worker, and hero-image SHA-256 values match.

## Next step

Repair every finding in `.factory/review-2.md`, update the two incomplete claim checks, update the stale live helper, and rerun the complete checklist from fresh browser contexts.

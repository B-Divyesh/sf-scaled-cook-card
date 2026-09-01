# Polish 2 — Scaled Cook Card

Repaired candidate `036373ff5ce57a904b9264f9e7e66309ed2d0760` at repair commit `3fa34b39596721f9790cee5bcc695de5691ad505`.

## Review 2 finding map

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-7 | Removed untestable merchant/refund promises. The dialog and terms now say only `Checkout opens on Sociobot. A revoked license stops paid history.` | `@claim:billing-terms` uses the configured Sociobot URL and a recorded `revoked` response; PASS. |
| F-1-15 | Standardized the download as a `scaled cook card` in the button, toast, README, claim, and test. | `@claim:json-export`; PASS. |
| F-2-1 | Export now serializes the current serving count and scaled quantities, not the source values. | `@claim:json-export` scales pasta to six servings and asserts `servings: 6`, `pasta.quantity: 600`; PASS. |
| F-2-2 | Moved offline, price, and browser-storage facts above the actions and compacted the desktop hero. | `keeps the offline, price, and browser-storage facts on the desktop first screen`; bottoms are 646, 672, and 698 px at 1440 × 900 in `evidence-polish-2/local-check.json`. |
| F-2-3 | Replaced the single syntax panel with the real `Import a recipe file` → `Scale and cook each step` → `Save what changed` flow. | `uses a real three-step landing flow and route-appropriate skip labels`; PASS. |
| F-2-4 | Renamed the dialog heading to `Kitchen Pass storage upgrade`. | `@claim:kitchen-pass`; PASS. |
| F-2-5 | Made the shared skip link `Skip to main content`; the 404 uses the same label. | Route-label browser regression; PASS. |
| F-2-6 | Updated the live QA helper to expect the implemented accessible name, `History upgrade active`. | `.factory/qa-live.mjs:158` source check; live run is recorded in the handoff. |

## Earlier review map

All earlier findings remain fixed and were rechecked against the repair. `F-1-1`, `F-1-2`, `F-1-5`, `F-1-11`–`F-1-14`, and `F-1-16`–`F-1-24` retain their plain-language and accessible-label repairs; `F-1-3`, `F-1-4`, `F-1-6`, `F-1-8`–`F-1-10`, and `F-1-25`–`F-1-27` retain their dedicated claim, metadata, routing, cache, provenance, and demo checks. `F-1-7` and `F-1-15` are superseded by the tested fixes above.

Evidence for the retained set: `npm test` (15/15), `npm run test:e2e` (51 passed, 5 expected checkout-only skips), all 17 exact claim commands (PASS), `npm run lint`, `npm run typecheck`, and `npm run build`. Local first-screen and demo captures are [local-desktop-first-screen.png](evidence-polish-2/local-desktop-first-screen.png) and [local-demo-390.png](evidence-polish-2/local-demo-390.png).

## Local accessibility and privacy evidence

- `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173 …` passed: HTTP 200, title, `lang`, one h1, main landmark, complete image alt text, labelled buttons, and zero console errors. Evidence: `evidence-polish-2/verify-url/verify.json`.
- Playwright axe checks pass on the landing page, workspace, cook dialog, and privacy page. The standalone `@axe-core/cli` could not start because its Selenium Chrome binary is absent in this worker image; the project uses the installed Playwright Chromium integration instead.
- `@claim:local-only-recipe-data`, `@claim:demo-sandbox`, and `@claim:offline-reload` all passed from clean browser contexts.

## Live recheck

After deployment, the cold live URL, `/demo`, `?demo=1`, `/privacy`, `/terms`, `/artwork`, and a 404 are rechecked in `.factory/handoff.md`.

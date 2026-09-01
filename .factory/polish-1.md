# Polish 1 — Scaled Cook Card

Candidate repaired from `39c5ba365be0bab50615663d16e444697b542a71` on 2026-09-01.

## Finding map

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Added a space before the headline line break. | `keeps word boundaries in the headline and recipe-file label` |
| F-1-2 | Added a text-node boundary in the file-picker label. | `keeps word boundaries in the headline and recipe-file label` |
| F-1-3 | Registered the $9 one-time price and checkout-enabled test. | `@claim:kitchen-pass-price` |
| F-1-4 | Registered paid history and tested two cook cards plus two records after reload. | `@claim:paid-history-limits` |
| F-1-5 | Narrowed the copy to restoring a license on this device. | `@claim:kitchen-pass` |
| F-1-6 | Enforced one free cook card and one latest correction; added browser coverage. | `@claim:free-card-limits` |
| F-1-7 | Registered hosted billing/revocation wording and fixture-backed revoked-license behavior. | `@claim:billing-terms` |
| F-1-8 | Replaced the footer assertion with a provenance link and added a documented provenance claim. | `@claim:art-provenance` |
| F-1-9 | Registered and source-tested the no-provider-SDK/product-id assertion. | `@claim:payment-integration` |
| F-1-10 | Registered one-year versioned caching and split the README sentence. | `@claim:versioned-asset-cache` |
| F-1-11 | Renamed header action to `View history upgrade` and section to `Optional recipe history`. | local landing screenshot |
| F-1-12 | Renamed `Verify` to `Restore Kitchen Pass`. | `@claim:kitchen-pass` |
| F-1-13 | Rewrote `Bind` as a concrete linked-amount description. | local landing screenshot |
| F-1-14 | Labeled the brace example and explained its ingredient-id relationship. | local landing screenshot |
| F-1-15 | Standardized saved in-app objects as `cook card` and imported input as `recipe file`. | `.factory/copy-audit.md` |
| F-1-16 | Removed the repeated hero eyebrow. | local landing screenshot |
| F-1-17 | Replaced decorative image lore with a useful workflow caption. | local landing screenshot |
| F-1-18 | Renamed the import-dialog eyebrow to `Import recipe`. | browser import-dialog assertion |
| F-1-19 | Renamed the upgrade eyebrow to `One-time upgrade`. | `@claim:kitchen-pass` |
| F-1-20 | Split and simplified the deployment documentation. | README copy audit |
| F-1-21 | Rewrote the image rebuild instruction in plain words. | README copy audit |
| F-1-22 | Rewrote checkout gating in terms of the visible buy link. | README copy audit |
| F-1-23 | Rewrote the checkout return instruction in plain words. | README copy audit |
| F-1-24 | Rewrote fixture wording to identify the saved billing response. | README copy audit |
| F-1-25 | Added product-specific Open Graph and Twitter metadata to `404.html`. | `site discovery and social assets` test; local 404 screenshot |
| F-1-26 | Matched the 404 navigation, footer links, provenance link, and build id to this release. | `site discovery and social assets` test; local 404 screenshot |
| F-1-27 | Set the demo wordmark URL to `/`; home leaves demo storage unread. | `sends the demo wordmark home without reading demo storage` |

## Evidence

- Default production build: `npm run build` — PASS; `dist/` contains `index.html`.
- Unit/deployment: `npm test` — PASS, 15 tests.
- Lint: `npm run lint` — PASS.
- Browser/accessibility/offline: `npm run test:e2e` — PASS, 52 tests with expected checkout-only skips in the default build.
- Checkout-enabled path: `npm run test:checkout-enabled -- --project=chromium` — PASS, 2 tests.
- Extra checkout contract: `VITE_KITCHEN_PASS_CHECKOUT_ENABLED=true npx playwright test --grep @claim:billing-terms --project=chromium` — PASS.
- Visual checks: `.factory/evidence-polish-1/local-landing.png`, `.factory/evidence-polish-1/local-demo-390.png`, and `.factory/evidence-polish-1/local-404.png`.

Live recheck target: <https://scaled-cook-card.sociobot.in> with `/demo`, `/privacy`, `/terms`, `/artwork`, and an unknown route. At 2026-09-01 19:24 UTC it still served prior bundle `index-C_Kr74Dc.js` and build `2026.08.30-repair.4`; the in-scope Static Web App lookup was blocked by Azure `AuthorizationFailed` for this work-order identity.

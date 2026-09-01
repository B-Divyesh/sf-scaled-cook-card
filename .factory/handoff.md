# Scaled Cook Card — polish 2 handoff

## Outcome

**PASS.** Repair commit `3fa34b39596721f9790cee5bcc695de5691ad505` is built, pushed, and deployed to <https://scaled-cook-card.sociobot.in>. Azure Static Web Apps deployment `ef90cb93-6761-46f5-aecb-c306948c84ab` completed successfully on 2026-09-01.

## What changed

- The first screen now keeps the offline, `$9 once`, and browser-storage facts above the fold at desktop size.
- The landing page has a concrete three-step recipe flow.
- `/demo` and `?demo=1` load the isolated pasta card immediately, show the persistent banner, and provide Reset demo / Start for real.
- JSON export is consistently named **Export scaled cook card JSON** and exports the displayed servings and ingredient values.
- Paid-copy wording is limited to the fixture-tested checkout and revoked-license behavior. The dialog heading is now `Kitchen Pass storage upgrade`.
- The shared skip label now accurately says `Skip to main content`; the live QA helper expects `History upgrade active`.
- The catalog description is verb-first and 63 characters long.

The full finding map is in [`.factory/polish-2.md`](polish-2.md).

## Verification

Fresh dependency install: `npm ci` completed with zero vulnerabilities.

- `npm run lint` — PASS
- `npm run typecheck` — PASS
- `npm test` — PASS, 15 tests
- `npm run build` — PASS; `dist/index.html` exists; initial JS is 27.09 kB gzip and CSS is 5.37 kB gzip
- `npm run test:e2e` — PASS, 51 tests; 5 expected checkout-only skips in the default build
- All 17 exact commands in [`.factory/claims.json`](claims.json) — PASS from the clean install, including the checkout-enabled pricing and billing fixtures
- `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173 …` — PASS; title, language, one h1, main, alt text, labels, and no console errors. Evidence: `evidence-polish-2/verify-url/verify.json`
- Playwright axe checks — PASS on landing, workspace, cook dialog, and privacy page (zero serious/critical findings)
- Standalone `@axe-core/cli` could not start because its Selenium Chrome binary is absent in this worker; the installed Playwright axe integration is the successful accessibility evidence.
- Live Lighthouse mobile report: performance **99**, accessibility **100**. Evidence: `evidence-polish-2/live-qa/lighthouse-mobile.json`. Lighthouse wrote the report but exited after a post-audit tab crash; its completed category scores are recorded in that JSON.

## Cold live recheck

Opened a new browser context at <https://scaled-cook-card.sociobot.in> after deployment, then verified:

- One visible sample action, title/lang/main, focus ring, no console/page errors, and zero serious/critical axe findings.
- The desktop facts end at y=646, 672, and 698 in a 1440 × 900 viewport.
- `/demo` and `?demo=1` show the pasta sample and isolated demo banner. Reset and Start for real pass, as do offline reload and same-origin request checks.
- Scaling to six then exporting gives `weeknight-tomato-pasta-scaled-cook-card.json` with `servings: 6` and pasta `quantity: 600`.
- The three live steps, named Kitchen Pass dialog, narrow billing wording, legal/artwork skip links, direct legal routes, metadata, and designed 404 pass.
- The live service worker controls the page and offline demo reload passes.

Evidence: `evidence-polish-2/live-qa/live-browser.json`, `live-review-2.json`, `live-desktop-cold.png`, `live-mobile-demo.png`, and `live-desktop-workspace.png`.

## Known gaps / next steps

None. The free product remains fully usable while checkout is build-gated until its hosted endpoint is enabled.

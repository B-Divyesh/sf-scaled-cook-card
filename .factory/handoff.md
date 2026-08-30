# Scaled Cook Card — repair 4 handoff

## Release status

**PASS — ready for static deployment.** This repair addresses all product-owned release blockers from independent verification 3 (`315fa71a0cc4dc151b51b8ddcf4820b51a185690`) while preserving the local-first recipe-scaling workflow.

Application repair commits:

- `e9eeb81` — demo legal-route focus/announcement, real 390 px/200% reflow, fail-soft checkout gate, and regressions.
- `ed32298` — service-worker cache version `scaled-cook-card-v5` so deployed clients receive this shell.

## Repairs

1. **Demo to Privacy now keeps the single-page route transition.** The live region is persistent outside the application render root. Every client route clears and then updates it, while focus moves to the destination `<h1>`. The demo banner/storage namespace remain active when reading Privacy or Terms from `/demo`.
2. **The 390 px / 200% layout now reflows.** Header navigation can wrap, the mobile recipe grid uses a zero-minimum track, and bound ingredient tokens can wrap inside their source step. The exact fixed-viewport regression asserts `window.innerWidth`, HTML width, and body width are all `390`.
3. **Kitchen Pass no longer exposes a known-dead checkout.** Checkout is off unless the public build flag `VITE_KITCHEN_PASS_CHECKOUT_ENABLED=true` is supplied. The default release shows an honest unavailable state, retains license restore, and keeps the free cook card usable. The enabled-build test still proves the exact hosted-checkout link and its separate-tab behavior. The shared endpoint remains outside this repository and was not contacted or changed.
4. **Offline updates are versioned.** The worker cache advances from `scaled-cook-card-v4` to `scaled-cook-card-v5`.

## Verification

Clean final local run on 2026-08-30 UTC:

```text
npm ci                                      PASS — 171 packages; 0 vulnerabilities
npm audit --omit=dev                        PASS — 0 vulnerabilities
npm run lint                                PASS
npm run typecheck                           PASS
npm test                                    PASS — 12/12
npm run build                               PASS — dist/index.html
npm run test:e2e                            PASS — 40/40 (desktop + 390 × 844 mobile)
npm run test:checkout-enabled -- --project=chromium
                                            PASS — enabled checkout branch
```

All exact commands in `.factory/claims.json` pass from a clean install: the two Vitest parser checks pass once each and each of the eight Playwright claim commands passes in both browser projects. This includes offline reload in an isolated context, local-only request capture, demo storage isolation, fraction preservation, correction persistence, keyboard cooking, JSON export, and default fail-soft Kitchen Pass restore.

Targeted release regressions:

```text
npm run test:e2e -- --grep 'no serious accessibility|activates the current service worker|keeps focus and announces Privacy|reflows the demo'
                                            PASS — 12/12
```

- `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173 .factory/evidence-repair-4` passed: HTTP 200, valid title/lang, one `<h1>`, `<main>`, all image alts, labelled buttons, and zero console/page errors. See `.factory/evidence-repair-4/verify.json`.
- The standalone `@axe-core/cli` could not locate a system Chrome in this worker. The repository’s installed-browser `@axe-core/playwright` integration passed all landing, workspace, cook-dialog, and Privacy scans in both projects: 0 serious/critical violations.
- Fixed viewport check: `/demo` at 390 × 844 with `document.documentElement.style.fontSize = '200%'` reports `innerWidth: 390`, `documentElement.scrollWidth: 390`, and `body.scrollWidth: 390`, with no console errors. Capture: `.factory/evidence-repair-4/screenshot-390-200.png`.
- Lighthouse mobile, local production preview: **99 performance / 100 accessibility**; LCP **1.90 s**, TBT **0 ms**, CLS **0**. See `.factory/evidence-repair-4/lighthouse.json`.
- Bundle: JS **78.85 KB raw / 26.68 KB gzip**; CSS **20.56 KB raw / 5.30 KB gzip**; no shipped fonts. The app remains below the static first-load budget.

## Deployment

`dist/` is the unchanged Azure Static Web Apps artifact. Deploy it only to `sf-scaled-cook-card`; this repair does not modify shared billing, DNS, databases, secrets, or any other service. Live identity, headers, routes, offline update, and default checkout-gate checks are recorded below after deployment.

## Known gap / next step

The shared Sociobot checkout endpoint currently returns 404. This is deliberately environment-gated out of the default release, so no visitor is sent to it. After its owner verifies the endpoint, build with `VITE_KITCHEN_PASS_CHECKOUT_ENABLED=true`, run `npm run test:checkout-enabled -- --project=chromium`, then verify the hosted checkout redirect and return-token restore against the live service.

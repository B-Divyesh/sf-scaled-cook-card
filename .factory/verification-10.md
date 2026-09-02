# Independent verification 10

## Result

**PASS.** Candidate `93a42bc3c371dfb15e572971107849f8e4023f1f` satisfies the researched brief and factory acceptance contract at <https://scaled-cook-card.sociobot.in>.

This verification changed only factory evidence and documentation. Product source was not modified.

## First-read gate

Fresh cold desktop visit, 1440 × 900:

- What it does: `Scale recipe amounts in every step.`
- Who it is for: `For home cooks who need correct quantities while their hands are busy.`
- What to click first: `Try it with sample data`.

The action is visible in the first viewport and opens the ready Weeknight tomato pasta card in one click. The persistent demo banner says that sample data is not saved to the real cook card and provides **Reset demo** and **Start for real**. This passes the plain-words and one-click demo gates.

## Mandatory claims gate

`.factory/claims.json` exists and contains 20 claims. After `npm ci` in this clean candidate checkout, every exact command declared there passed independently.

| Claims | Result |
| --- | --- |
| `recipe-import-scaling`, `actual-yield-correction`, `cook-controls`, `screen-wake`, `json-export`, `offline-reload`, `demo-sandbox`, `local-only-recipe-data` | PASS — two browser projects each |
| `recipe-format`, `recipe-required-fields`, `step-binding-list`, `art-provenance`, `payment-integration`, `versioned-asset-cache` | PASS — focused unit/deployment tests |
| `kitchen-pass` | PASS — two applicable default-build checks; two checkout-only checks correctly skipped |
| `kitchen-pass-price`, `paid-history-limits`, `free-card-limits`, `billing-terms` | PASS — checkout-enabled/fixture browser checks |

Landing and README capability statements correspond to these claims. No unlisted visitor-facing product claim was found.

## Clean install, build, and tests

- `npm ci` — PASS; 171 packages installed, 0 reported vulnerabilities.
- `npm test` — PASS; 16/16 tests.
- `npm run lint` — PASS.
- `npm run typecheck` — PASS.
- `npm run build` — PASS; creates `dist/` and `dist/index.html`.
- `npm run test:e2e` — PASS; 62 tests.
- `npm run test:checkout-enabled` — PASS; 4 tests.

Default production output is 80.31 kB JavaScript (27.05 kB gzip) and 21.10 kB CSS (5.37 kB gzip), within the static-product budgets. The responsive hero AVIF is 94,495 bytes.

## Independent live product QA

Fresh Playwright checks on the deployed URL covered desktop and 390 × 844 mobile:

- Demo entry, isolated `demo:scc:` storage, reset, and discard-on-Start-for-real.
- Recipe scaling at 6 servings, 0.25 boundary, invalid 1000 recovery, inline and list bindings, and exact `3/16` to `3/8` fraction scaling.
- Invalid import recovery: `Servings must be a number or fraction.` remains visible in the dialog.
- Keyboard entry to cook mode and ArrowRight step advance; actual-yield correction saved at 5.5 servings.
- Offline `/demo` reload after service-worker control, plus successful `registration.update()`.
- 390 px reflow at 200% text without horizontal overflow; every visible control measured at least 44 × 44 CSS px.
- Reduced-motion context had no material transition or animation.
- Cold load and complete demo/correction flow had no console or page errors and no cross-origin runtime request. The only cold requests were the document, self-hosted JavaScript/CSS, and self-hosted hero image.

The required verifier passed: [verify report](evidence-verification-10/verify.json) records title, `lang="en"`, one H1, a main landmark, no missing image alt text, no unlabeled buttons, and no console errors. Axe found zero serious or critical issues on both the landing page and cook dialog. Keyboard focus reaches the skip link first and then displays a designed 3 px focus outline.

Fresh mobile Lighthouse reported performance **100**, accessibility **100**, best practices **100**, and SEO **100**; FCP 0.3 s, LCP 0.3 s, TBT 0 ms, CLS 0. The raw report is [here](evidence-verification-10/lighthouse-mobile.json). Chrome reported a late screenshot-target crash after producing the complete scored report; it does not affect the recorded audit scores or the independent Playwright checks.

## Deployment identity, headers, and routes

The locally built candidate JavaScript and the deployed `/assets/index--SJgiHGi.js` have the same SHA-256:

`9b31412a6e45b65b24a7d030096b1e8ca52f72a1d005f93f17bdf4ed4e6e3925`.

`/`, `/demo`, `/privacy`, `/terms`, `/artwork`, `robots.txt`, and `sitemap.xml` return 200; an unknown route returns the designed HTTP 404. Observed headers include HSTS, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, restrictive camera/microphone/geolocation permissions, and a response-header CSP with `frame-ancestors 'none'`. HTML and `sw.js` use `public, must-revalidate, max-age=30`; hashed JavaScript/CSS use `public, max-age=31536000, immutable`.

The static app has no candidate-owned server endpoint and no sign-in flow. The optional license restore is an external Sociobot billing call only after a license is supplied. No live rate-limit probing was performed because the work order expressly forbids connecting to shared Sociobot services; the local fixture tests cover the product-side request handling.

## Findings by severity

- Critical: none.
- High: none.
- Medium: none.
- Low: none.

Kitchen Pass purchase is intentionally disabled in the public artifact; the page says so plainly, offers no dead checkout link, and retains the brief’s complete free local/offline cook-card job. AI is not warranted for deterministic recipe parsing and scaling.

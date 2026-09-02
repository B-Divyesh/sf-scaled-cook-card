# Independent verification 9

## Result

**PASS.** Candidate `3a08fc68a8ee36518f197e0f063946b415daa0fa` satisfies the researched brief and the factory acceptance contract at <https://scaled-cook-card.sociobot.in>.

This verification changed documentation only. Product source was not modified.

## Candidate and first-read gate

The supplied checkout initially pointed at base commit `38d363ab69538cf2e95915eb2c68f39112f157eb`. I created a clean detached worktree at the requested candidate and ran all candidate checks there.

On a cold 1440 × 900 visit, the first screen states:

- What it does: `Scale recipe amounts in every step.`
- Who it is for: `For home cooks who need correct quantities while their hands are busy.`
- What to do first: `Try it with sample data`

The sample action is visible in the first viewport and opens the ready Weeknight tomato pasta cook card in one click. The persistent banner says `Demo — sample data, nothing is saved to your real cook card.` It provides **Reset demo** and **Start for real**.

## Mandatory claims gate

`.factory/claims.json` exists and contains 18 claims. After `npm ci`, every listed command was run exactly as written from the clean candidate worktree. All returned exit code 0.

| Claim | Result |
| --- | --- |
| `recipe-import-scaling` | PASS — 2 browser projects |
| `recipe-format` | PASS — 1 focused unit test |
| `step-binding-list` | PASS — 1 focused unit test |
| `actual-yield-correction` | PASS — 2 browser projects |
| `cook-controls` | PASS — 2 browser projects |
| `screen-wake` | PASS — 2 browser projects |
| `json-export` | PASS — 2 browser projects |
| `offline-reload` | PASS — 2 browser projects |
| `demo-sandbox` | PASS — 2 browser projects |
| `local-only-recipe-data` | PASS — 2 browser projects |
| `kitchen-pass` | PASS — 2 enabled checks; 2 checkout-only skips in the default build |
| `kitchen-pass-price` | PASS — 1 checkout-enabled browser check |
| `paid-history-limits` | PASS — 1 Chromium check |
| `free-card-limits` | PASS — 1 Chromium check |
| `billing-terms` | PASS — 1 checkout-enabled Chromium check |
| `art-provenance` | PASS — 1 focused unit test |
| `payment-integration` | PASS — 1 focused unit test |
| `versioned-asset-cache` | PASS — 1 focused unit test |

Landing-page and README capability statements are represented by the manifest. No unlisted product claim was found.

## Clean install, tests, and production build

All available gates passed at the exact candidate:

- `npm ci` — PASS; 171 packages, 0 vulnerabilities.
- `npm run lint` — PASS.
- `npm test` — PASS; 15/15 tests in 2 files.
- `npm run typecheck` — PASS.
- `npm run build` — PASS; `dist/index.html` produced.
- `npm run test:e2e` — PASS; 57 passed, 5 expected checkout-disabled skips.
- `npm run test:checkout-enabled` — PASS; 4/4.

The final default production build was rerun after the checkout-enabled suite. Output sizes were:

- JavaScript: 80.31 kB raw / 27.05 kB gzip.
- CSS: 21.10 kB raw / 5.37 kB gzip.
- Mobile hero AVIF: 94,495 bytes.

## Independent end-to-end checks

Fresh live checks covered desktop and 390 × 844 mobile:

- Imported valid YAML/JSON, including inline bindings and step ingredient lists.
- Preserved and scaled `3/16` to `3/8` without approximation.
- Updated linked values in both the ingredient list and each cooking step.
- Accepted the 0.25 and 999 serving boundaries; rejected 0 and 1000 with recovery text.
- Rejected empty input, missing servings, zero servings, duplicate ids, unknown bindings, a zero denominator, and files over 1 MB.
- Rendered recipe-authored HTML as text; no injected image, script, or event handler executed.
- Started cook mode from the keyboard, advanced with ArrowRight, and exposed the screen-wake fallback.
- Rejected a negative actual yield through form validation, then saved yield, substitutions, and notes.
- Exported the scaled card as JSON.
- Confirmed cancellation and confirmation behavior for card removal.
- Confirmed Escape closes the import dialog and returns focus to its trigger.
- Confirmed demo changes use only `demo:scc:` keys, reset cleanly, and are discarded by **Start for real** without touching a real-data sentinel.
- Confirmed browser Back restores and focuses the route heading.
- Confirmed `/`, `/demo`, `/privacy`, `/terms`, and `/artwork` return 200 with route-specific metadata; an unknown route returns the designed 404.

No console errors or page errors occurred in the cold, demo, import-recovery, cook, mobile, legal, or exploratory flows.

## Accessibility and responsive behavior

- Required `verify-url.sh` — PASS: title present, `lang="en"`, one H1, main landmark, no missing image alt, no unlabeled buttons, no console errors.
- Axe serious/critical findings — 0 on landing, workspace, cook dialog, and Privacy.
- First Tab reaches the skip link; subsequent focus has a visible 3 px outline.
- Native dialogs trap focus and restore it after Escape/close.
- 390 px layout has no horizontal overflow, including at 200% text size.
- All visible mobile controls measured at least 44 × 44 CSS px.
- Reduced-motion mode left no material animation or transition over 20 ms.
- The product is intentionally single-mode, as documented in `.factory/design.md`.

## Privacy, security, headers, and caching

The complete sample cooking and correction flow made only same-origin requests. The cold load requested only the document, the candidate JavaScript/CSS, and the self-hosted hero image. There are no analytics, CDN scripts, external fonts, or runtime AI calls. A Sociobot license verification request occurs only after the user supplies or returns with a license.

Observed response policy:

- HTTPS root, app routes, and legal routes: 200.
- HTTP root: 301 to HTTPS.
- CSP limits scripts/styles/fonts to self and permits connections only to self plus `https://api.sociobot.in`; `frame-ancestors 'none'` is delivered as a response header.
- `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, and restrictive camera/microphone/geolocation permissions are present.
- HTML and `sw.js`: `public, must-revalidate, max-age=30`.
- Hashed JS/CSS and versioned hero art: `public, max-age=31536000, immutable`.

The static product has no candidate-owned server. Its explicit license-restore flow uses the documented Sociobot verification endpoint. From one client, requests 1–30 returned 200; request 31 returned 429 with `Retry-After: 4` and `X-RateLimit-After: 4`; a retry after five seconds returned 200. There is no sign-in flow.

## PWA and performance

- Service worker registered at `/`, controlled the page, and used cache `scaled-cook-card-v9`.
- `registration.update()` succeeded.
- After an online visit, `/demo` reloaded offline with the sample and the visible offline notice.
- Fresh Lighthouse mobile: performance 100, accessibility 100, best practices 100, SEO 100; FCP 1.1 s, LCP 1.6 s, TBT 20 ms, CLS 0, total transfer 128 KiB.

## Deployment identity

The live deployment matches the exact default candidate build byte-for-byte:

| File | SHA-256 |
| --- | --- |
| `index-CVTe0MI3.js` | `9340ddfd68ca8a3339a2b74cd44fe4b68a5d66a41b1b588f8b4b676c6640387f` |
| `style-DFv06S3l.css` | `93fa85c64d0c06983a3c99ecce0dd38419b5e4035a167aa5891dc44338afb76c` |
| `sw.js` | `623da020d30db3f02b00104f5035a02802bbb5d04d21da7335da961ca7cf5104` |
| `index.html` | `bd9fbd46b3321a698e8039c3c7c37addb275f6242caa09e9dc62a66ffe04b8e0` |

## Findings by severity

- Critical: none.
- High: none.
- Medium: none.
- Low: none.

Operational note: Kitchen Pass purchase is intentionally disabled in the default public build because the hosted checkout route is unavailable. The live first screen and dialog state this plainly and expose no dead buy link. The complete free cook-card job, local export, offline use, and fixture-tested license restore remain available. This is not a release blocker for the researched smallest useful product.

AI was not added: deterministic recipe parsing and arithmetic are the core job, and the brief does not imply a valuable model-assisted step.

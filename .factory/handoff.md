# Scaled Cook Card — build handoff

## What was built

A finished Vite + vanilla TypeScript static web app for importing user-authored YAML/JSON recipes, changing the serving yield, and seeing every referenced ingredient’s scaled quantity directly inside its preparation step.

The end-to-end flow includes:

- clear empty state with an original notebook hero and usable sample recipe;
- paste, file-picker, and drag/drop import with schema validation and actionable errors;
- decimal, mixed, simple, and common Unicode fraction parsing;
- direct serving controls and immediate step-level amount updates;
- keyboard- and touch-friendly cook mode with one step at a time, progress, Back/Next, arrow keys, and an optional Wake Lock that degrades with an explanation;
- post-cook actual yield, substitution, and note capture in local storage;
- free JSON export, recipe replacement/deletion confirmation, offline state, and offline reload;
- privacy and terms routes;
- a $9 one-time Kitchen Pass sold only through Sociobot, including query-string license capture, local token storage, daily-cached verification, optimistic cached unlock, invalid-license notice, and paste-to-restore;
- a paid unlimited local recipe library and full local cook history, while the free tier retains one complete working card and its latest correction;
- Azure Static Web Apps fallback, security headers, PWA manifest, and versioned service-worker cache.

The product-specific handwritten lab notebook system is documented in `.factory/design.md`. The original generated source, prompt, and metadata are in `assets/src/`; production AVIF/WebP derivatives are all below 150 KB.

## How to run and verify

```bash
npm ci
npm test
npm run build
npm run test:e2e
```

`npm run build` is the work-order build command. It runs TypeScript checking and Vite, then emits `dist/index.html` at the required root.

Verification performed on 2026-08-28:

- `npm audit`: 0 vulnerabilities
- `npm test`: 5/5 unit tests passed
- `npm run test:e2e`: 12/12 tests passed across desktop Chromium and 390×844 mobile Chromium, covering import, scaling, cook navigation, correction storage, invalid-import, legal-route, paid-surface, offline, and axe checks
- `/opt/fleet/lib/verify-url.sh`: HTTP 200; title present; `lang="en"`; exactly one `h1`; main landmark present; zero images missing alt; zero unlabeled buttons; zero console/page errors
- offline probe: saved recipe reloaded from the service worker, offline notice visible, zero console errors
- production bundles: 74.18 KB JS / 25.47 KB gzip; 18.02 KB CSS / 4.90 KB gzip
- hero assets: 94.5 KB AVIF, 149.6 KB desktop WebP, 46.9 KB mobile WebP
- Lighthouse 12.8.2 mobile simulation against production preview: Performance 99, Accessibility 100, LCP 1.8 s, FCP 1.1 s, TBT 110 ms, CLS 0

## Privacy and data

Recipes, target servings, cook records, and license state are stored only in browser local storage. The only cross-origin runtime request is license verification to `api.sociobot.in` after a token is present. There are no analytics, trackers, CDN resources, web fonts, accounts, recipe uploads, or scraper behavior.

## Known gaps and release steps

- The factory must register `scaled-cook-card` and its production return URL with the Sociobot billing engine before checkout can complete. No product id is hardcoded.
- A real paid token was not available in this build container; the checkout URL, token-capture/cleanup, cached verification, invalid/offline handling, and restore UI are implemented, while live purchase completion remains a release smoke test.
- Screen Wake Lock support depends on browser/OS policy. Unsupported or denied requests leave cook mode fully usable and show an explicit explanation.
- Offline support begins after one successful online load. Clearing browser site data removes locally stored cards and history, as stated on `/privacy`.
- Web recipe extraction, meal planning, nutrition calculations, social publishing, and cloud synchronization remain intentional non-goals from the brief.

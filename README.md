# Scaled Cook Card

Scaled Cook Card turns a user-authored recipe into a live kitchen procedure. Change the yield once and every ingredient reference inside every step shows the scaled amount. Cook mode then keeps one large step on screen, supports arrow-key navigation and screen wake, and saves the actual yield, substitutions, and notes locally.

It is for home cooks who know what they want to make and do not want to recalculate or scroll between ingredients and instructions while their hands are busy. It intentionally does not scrape recipe sites, plan meals, publish recipes, or make nutrition claims.

Live: https://scaled-cook-card.sociobot.in

Try the isolated sample at `https://scaled-cook-card.sociobot.in/demo`. It uses separate browser storage and never changes a real card.

## What ships

- YAML and JSON import by paste, file picker, or drag and drop
- Decimal, simple fraction, mixed-fraction, and common Unicode-fraction quantities
- Immediate scaling with quantities bound into each preparation step
- Large-touch cook mode, arrow-key navigation, optional Screen Wake Lock, and a safe unsupported-browser fallback
- Local correction ledger for actual yield, substitutions, and notes
- JSON export that is always available
- Offline shell and saved-recipe support through a service worker
- Local-only recipe storage; no analytics or third-party runtime assets
- Direct `/demo` sandbox with the shipped sample recipe and separate `demo:scc:` browser storage
- $9 one-time Kitchen Pass integration through Sociobot billing for an unlimited local library and full local cook history

The free experience includes one saved recipe, its latest correction, all scaling and cooking features, offline use, and export. Accessibility, safety behavior, and export are never paywalled.

## Recipe format

Ingredient `id` values bind to `{{id}}` tokens inside steps:

```yaml
title: Weeknight tomato pasta
servings: 4
ingredients:
  - id: pasta
    name: dried pasta
    quantity: 400
    unit: g
  - id: oil
    name: olive oil
    quantity: 2
    unit: tbsp
steps:
  - text: Warm {{oil}} in a wide pan.
  - text: Cook {{pasta}} until just tender.
```

A step may instead use an `ingredients` list; its scaled ingredient tokens appear after the step text:

```json
{
  "text": "Toast until crisp.",
  "ingredients": ["bread"]
}
```

Required top-level fields are `title`, positive `servings`, a non-empty `ingredients` array, and a non-empty `steps` array. Ingredient quantities may be numbers or strings such as `"1 1/2"` and `"2¾"`. Files are limited to 1 MB in the interface.

## Develop and verify

Requires Node.js 20 or newer.

```bash
npm ci
npm run dev
npm test
npm run build
npm run test:e2e
```

The exact production build command is `npm run build`. It type-checks the app and writes the static deployment to `dist/`, with `dist/index.html` at its root. Browser tests use Playwright 1.58.2 and expect its Chromium binary to be installed.

To regenerate the responsive AVIF and WebP hero derivatives from the retained source:

```bash
npm run optimize:image
```

## Deployment and billing

Deploy `dist/` as an Azure Static Web App. `public/staticwebapp.config.json` supplies SPA fallbacks, security headers, asset MIME types, and one-year immutable caching for Vite's fingerprinted assets and the explicitly versioned hero artwork. Bump the hero artwork URL version when replacing that image.

The product uses only the Sociobot billing endpoints:

- checkout: `https://api.sociobot.in/api/v1/products/scaled-cook-card/checkout`
- verify: `https://api.sociobot.in/api/v1/products/scaled-cook-card/verify?license=…`

The factory must register the slug and return URL before release. No payment-provider SDK or product id is embedded here.

## Product records

- Research brief: [`.factory/brief.json`](.factory/brief.json)
- Visual system and image provenance: [`.factory/design.md`](.factory/design.md)
- Build handoff: [`.factory/handoff.md`](.factory/handoff.md)
- Demo behavior: [`.factory/demo.md`](.factory/demo.md)
- Tested product claims: [`.factory/claims.json`](.factory/claims.json)

## License

MIT. See [`LICENSE`](LICENSE).

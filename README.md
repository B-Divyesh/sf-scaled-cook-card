# Scaled Cook Card

Scale a recipe once and see the amount inside every cooking step. It is for home cooks whose hands are busy.

Use recipes you wrote or can import. The card focuses on scaling and cooking that recipe.

Live: https://scaled-cook-card.sociobot.in

Try the isolated sample at `https://scaled-cook-card.sociobot.in/demo`. It uses separate browser storage and never changes a real card.

## What it does

- Imports a recipe and scales each bound ingredient reference in its steps.
- Keeps exact fractions such as `3/16` instead of changing them to a nearby amount.
- Lets you cook with arrow keys when screen wake is unavailable.
- Saves actual yield, substitutions, and notes locally after cooking.
- Exports the active recipe as JSON.
- Works offline after the first visit.
- Keeps recipe data in this browser. The cooking flow makes no analytics or third-party runtime requests.
- Runs `/demo` with separate `demo:scc:` browser storage.

Kitchen Pass is a $9 one-time license. It adds an unlimited local recipe library and complete local cook history. The free card keeps scaling, cooking, and export.

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

Required top-level fields are `title`, positive `servings`, a non-empty `ingredients` array, and a non-empty `steps` array. Ingredient quantities may be numbers or fraction strings.

## Develop and verify

Requires Node.js 20 or newer.

```bash
npm ci
npm run dev
npm test
npm run lint
npm run build
npm run test:e2e
```

The exact production build command is `npm run build`. It type-checks the app and writes the static deployment to `dist/`, with `dist/index.html` at its root. Browser tests use Playwright 1.58.2 and expect its Chromium binary to be installed.

To regenerate the responsive AVIF and WebP hero derivatives from the retained source:

```bash
npm run optimize:image
```

## Deployment and billing

Deploy `dist/` as an Azure Static Web App. `public/staticwebapp.config.json` supplies direct app routes, a real 404 response, security headers, asset MIME types, and one-year immutable caching for fingerprinted assets and versioned hero art. Bump the hero-art URL version when replacing that image.

The product uses only the Sociobot billing endpoints:

- checkout: `https://api.sociobot.in/api/v1/products/scaled-cook-card/checkout`
- verify: `https://api.sociobot.in/api/v1/products/scaled-cook-card/verify?license=…`

The purchase link opens separately, so a checkout outage leaves the free card usable. Browser tests use a recorded verification fixture for the restore path. The factory operator must restore the checkout endpoint before release. No payment-provider SDK or product id is embedded here.

## Product records

- Research brief: [`.factory/brief.json`](.factory/brief.json)
- Visual system and image provenance: [`.factory/design.md`](.factory/design.md)
- Build handoff: [`.factory/handoff.md`](.factory/handoff.md)
- Demo behavior: [`.factory/demo.md`](.factory/demo.md)
- Tested product claims: [`.factory/claims.json`](.factory/claims.json)

## License

MIT. See [`LICENSE`](LICENSE).

# Scaled Cook Card

Scale a recipe once and see the amount inside every cooking step. It is for home cooks whose hands are busy.

Use a recipe file you wrote or can import. The cook card scales it while you cook.

Live: https://scaled-cook-card.sociobot.in

Try the isolated sample at `https://scaled-cook-card.sociobot.in/?demo=1`. It uses separate browser storage and never changes a real cook card.

## What it does

- Imports a recipe and scales each linked ingredient amount in its cooking steps.
- Keeps exact fractions such as `3/16` instead of changing them to a nearby amount.
- Keeps the screen awake in cook mode when your browser allows it.
- Arrow keys still work when screen wake is unavailable.
- Saves actual yield, substitutions, and notes locally after cooking.
- Exports the displayed scaled cook card as JSON.
- Works offline after the first visit.
- Keeps recipe data in this browser. The cooking flow makes no analytics or third-party runtime requests.
- Runs `/demo` with separate `demo:scc:` browser storage.

When checkout is enabled, Kitchen Pass costs $9 once. It keeps unlimited local cook cards and complete local cook history. The free cook card keeps scaling, cooking, and scaled cook card export.

## Recipe format

Ingredient `id` values match the names inside `{{braces}}` in each step:

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

Required fields are `title`, positive `servings`, non-empty `ingredients`, and non-empty `steps`. Ingredient quantities may be numbers or fraction strings.

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

The production build command is `npm run build`. It type-checks and writes `dist/`, with `dist/index.html` at its root. Browser tests use Playwright 1.58.2. Install its Chromium binary before running them.

To rebuild the responsive hero images from the original image:

```bash
npm run optimize:image
```

## Deployment and billing

Deploy `dist/` as an Azure Static Web App. The deployment file defines routes, headers, MIME types, and caching. Versioned assets are cached for one year. Bump the artwork URL version when replacing the image.

When enabled, the product uses only these Sociobot billing endpoints:

- checkout: `https://api.sociobot.in/api/v1/products/scaled-cook-card/checkout`
- verify: `https://api.sociobot.in/api/v1/products/scaled-cook-card/verify?license=…`

Checkout is disabled unless `VITE_KITCHEN_PASS_CHECKOUT_ENABLED` is `true`. This hides the buy link until checkout is ready. The free cook card and license restore still work. Enable the setting after checkout is available. Confirm that checkout returns a license and that the app restores it. Browser tests use a saved billing response. They confirm license restore without contacting billing. No payment-provider SDK or product id is embedded here.

## Product records

- Research brief: [`.factory/brief.json`](.factory/brief.json)
- Visual system and image provenance: [`.factory/design.md`](.factory/design.md)
- Build handoff: [`.factory/handoff.md`](.factory/handoff.md)
- Demo behavior: [`.factory/demo.md`](.factory/demo.md)
- Tested product claims: [`.factory/claims.json`](.factory/claims.json)

## License

MIT. See [`LICENSE`](LICENSE).

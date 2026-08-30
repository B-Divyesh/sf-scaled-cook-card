# Scaled Cook Card — visual thesis

## Direction: the cook's handwritten lab notebook

Scaled Cook Card should feel like the useful page a careful cook keeps beside the stove: measured, annotated, slightly warm, and more legible after each experiment. This is not rustic scrapbook decoration. It borrows the ruled structure, ingredient underlines, margin marks, and dark graphite of a lab notebook to make quantities feel traceable while the cook's hands are occupied.

The interface is deliberately single-mode: a warm paper canvas under a kitchen light. A dark theme would undermine the physical-note metaphor and reduce the immediate distinction between editable preparation and the high-focus cook card. The explicit cream background avoids browser-default white.

## Palette

All colors are encoded as CSS custom properties.

| Token | Color | Role |
| --- | --- | --- |
| `--paper` | `#F4EEDC` | warm notebook page / app background |
| `--paper-raised` | `#FFFDF5` | active page and inputs |
| `--graphite` | `#252822` | primary text and outlines |
| `--graphite-soft` | `#5D6258` | secondary copy (7:1+ on paper) |
| `--rule` | `#C8CFBF` | notebook ruling and dividers |
| `--tomato` | `#A63F32` | primary action, active step, corrections |
| `--tomato-dark` | `#7E2B23` | pressed actions and accessible text accent |
| `--sage` | `#416553` | success and fresh state |
| `--mustard` | `#A66B12` | warning / offline state |
| `--danger` | `#8B302B` | errors |
| `--ink-blue` | `#335E73` | bound ingredient tokens and focus ring |

Contrast is checked against the paper and raised-paper surfaces; the palest rule is decorative only and never carries meaning alone.

## Typography

- Interface and long-form text: the native humanist sans stack (`ui-sans-serif`, system UI). It loads instantly, remains familiar at arm's length, and avoids third-party font requests.
- Notebook voice: `ui-rounded`, system rounded fallbacks, used only for labels, counters, and the wordmark. It suggests hand labeling without sacrificing legibility.
- Body is 17px minimum, 18px in cook mode, with 1.55 line height. Quantities use tabular figures. The scale has five steps: 0.82rem, 1rem, 1.2rem, 1.56rem, and clamp(2rem, 6vw, 4.75rem).

## Spacing and layout

An 8px base rhythm: 4, 8, 12, 16, 24, 32, 48, 64. The desktop landing workspace is an asymmetric two-column spread: setup notes at left and an illustrated sample card at right. The working recipe becomes one centered notebook sheet with a narrow margin rail. On 390px screens the sidebar becomes a concise header and cook controls dock above the safe-area inset; secondary decoration drops away.

Touch targets are at least 44px, with 8px between adjacent controls. Content lines stay near 68 characters. Ingredient chips wrap naturally and never require horizontal scrolling.

## Interaction grammar

- Imported recipes arrive as a new notebook sheet rising a few pixels into place.
- Ingredient references inside a step are blue-underlined tokens with the scaled quantity in bold; the same token shape is used everywhere so a cook learns it once.
- Scaling is a direct “Serves − / number / +” control plus a numeric field for arbitrary yields. Changes update every quantity immediately and are announced to assistive technology.
- Cook mode advances one page at a time with large Previous/Next controls, keyboard arrows, and an optional screen-wake toggle. Progress is a ruled margin count, not a generic progress bar.
- Completion opens the correction ledger in place: actual yield, substitutions, and notes are saved locally to that recipe.
- Destructive recipe replacement or deletion names the affected recipe and requires confirmation; exports are never gated.

## Motion policy

Transitions last 180–240ms and affect only opacity and transform. Step changes slide a short distance in the direction of travel, matching a page moving through a card stack. Quantity updates briefly tint the token. Nothing loops. Under `prefers-reduced-motion: reduce`, transforms and smooth scrolling are removed, transitions become near-instant opacity changes, and state remains fully apparent through borders and labels.

## Original asset plan

The hero uses one original generated still-life illustration to establish the working-notebook world, then the product UI itself carries the visual language. Utility icons are original inline SVG strokes authored for this repository; no external icon library is loaded. Paper grain and ruling are CSS-only.

### Hero prompt sheet

- Use case: `stylized-concept`
- Asset: landing-page hero illustration, landscape crop
- Subject: an open spiral kitchen notebook viewed from a slightly elevated angle, one page holding a neat hand-drawn recipe procedure with abstract lines and measurement marks, a wooden spoon, three small ceramic ingredient bowls, pencil correction marks
- World/materials: real cream paper, graphite, muted enamel and worn oak; tactile editorial still life
- Light/lens: soft late-afternoon window light, restrained shadows, 50mm editorial crop
- Palette words: oat paper, graphite, tomato red pencil, sage green, ink blue
- Composition: notebook occupies the right two-thirds with open paper space on the left; no readable writing
- Avoid: readable text, numbers, logos, brands, hands, people, food glamour, excessive clutter, generic app mockup, gradients, watermarks, distorted utensils
- Mandatory: no text, no watermark, no logos

### Provenance

`public/hero-notebook-v1-1280.webp` is generated specifically for this product with the factory Azure image deployment (`factory-image`) on 2026-08-28, using the prompt sheet above. The `v1` filename is intentionally versioned so the immutable production cache can be safely replaced with a new URL when artwork changes. It is original generated imagery and is disclosed in the footer. Source PNG and the exact prompt metadata are retained under `assets/src/`.

`public/social-card.jpg` is a 1200 × 630 editorial crop derived locally from that same original notebook image on 2026-08-30. `public/apple-touch-icon.png` is a 180 × 180 PNG rasterization of this repository’s authored `public/favicon.svg`. Neither asset introduces a third-party image or font license.

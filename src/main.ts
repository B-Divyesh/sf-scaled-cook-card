import './styles.css';
import { bindingIds, formatQuantity, parseRecipe, sampleRecipe, scaledAmount } from './recipe';
import { CHECKOUT_ENABLED, CHECKOUT_URL, cachedLicenseState, captureLicenseFromUrl, clearLicense, storeLicense, verifyLicense } from './license';
import {
  getActiveRecipe, getCookRecords, getLibrary, getTargetServings, saveActiveRecipe,
  saveCookRecords, saveLibrary, saveTargetServings, setStorageNamespace, clearStorageNamespace, upsertLibrary,
} from './storage';
import type { CookRecord, LicenseState, Recipe, RecipeStep } from './types';

interface AppState {
  recipe: Recipe | null;
  targetServings: number;
  library: Recipe[];
  records: CookRecord[];
  license: LicenseState;
  importOpen: boolean;
  passOpen: boolean;
  cookOpen: boolean;
  completionOpen: boolean;
  cookStep: number;
  importError: string;
  importText: string;
  toast: string;
  online: boolean;
  wakeActive: boolean;
  wakeMessage: string;
  demo: boolean;
}

const SITE_URL = 'https://scaled-cook-card.sociobot.in';
const BUILD_ID = '2026.09.01-polish.1';

const appRoot = document.querySelector<HTMLDivElement>('#app');
if (!appRoot) throw new Error('App root is missing.');
const root: HTMLDivElement = appRoot;
const routeAnnouncementElement = document.querySelector<HTMLElement>('#route-announcement');

const demo = location.pathname === '/demo' || new URL(location.href).searchParams.get('demo') === '1';
const historyUpgrade = new URL(location.href).searchParams.get('history') === 'upgrade';
setStorageNamespace(demo ? 'demo:scc:' : 'scc:');
if (!demo) captureLicenseFromUrl();
const initialRecipe = getActiveRecipe() ?? (demo ? parseRecipe(sampleRecipe) : null);
const state: AppState = {
  recipe: initialRecipe,
  targetServings: initialRecipe ? getTargetServings(initialRecipe.servings) : 4,
  library: getLibrary(),
  records: getCookRecords(),
  license: demo ? { token: null, valid: false, checking: false, message: '' } : cachedLicenseState(),
  importOpen: false,
  passOpen: historyUpgrade,
  cookOpen: false,
  completionOpen: false,
  cookStep: 0,
  importError: '',
  importText: sampleRecipe,
  toast: '',
  online: navigator.onLine,
  wakeActive: false,
  wakeMessage: navigator.wakeLock ? 'Keep this screen awake while cooking.' : 'Screen wake is not available in this browser.',
  demo,
};

let wakeLock: WakeLockSentinel | null = null;
let toastTimer = 0;

const escapeHtml = (value: unknown): string => String(value)
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;').replaceAll("'", '&#039;');

function icon(name: 'scale' | 'arrow' | 'book' | 'upload' | 'close' | 'check'): string {
  const paths = {
    scale: '<path d="M4 12h16M7 8l-3 4 3 4M17 8l3 4-3 4"/>',
    arrow: '<path d="m9 18 6-6-6-6"/>',
    book: '<path d="M5 4.8A3.8 3.8 0 0 1 8 4h9a2 2 0 0 1 2 2v14H8a3 3 0 0 0-3 0V4.8Z"/><path d="M8 4v16"/>',
    upload: '<path d="M12 16V4m0 0L7 9m5-5 5 5M5 20h14"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
  };
  return `<svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20">${paths[name]}</svg>`;
}

function amountFor(id: string): string {
  const ingredient = state.recipe?.ingredients.find((item) => item.id === id);
  return ingredient && state.recipe ? scaledAmount(ingredient, state.recipe.servings, state.targetServings) : '';
}

function ingredientToken(id: string): string {
  const ingredient = state.recipe?.ingredients.find((item) => item.id === id);
  if (!ingredient) return '';
  return `<span class="bound-token"><strong>${escapeHtml(amountFor(id))}</strong> ${escapeHtml(ingredient.name)}</span>`;
}

function renderStepText(step: RecipeStep): string {
  const ids = bindingIds(step);
  const inlineIds = new Set<string>();
  const body = escapeHtml(step.text).replace(/\{\{\s*([\w-]+)\s*\}\}/g, (_match, id: string) => {
    inlineIds.add(id);
    return ingredientToken(id);
  });
  const extras = ids.filter((id) => !inlineIds.has(id));
  return `${body}${extras.length ? `<span class="step-bindings" aria-label="Ingredients for this step">${extras.map(ingredientToken).join('')}</span>` : ''}`;
}

function header(): string {
  return `<header class="site-header">
    <a class="wordmark" href="/" aria-label="Scaled Cook Card home">
      <span class="mark" aria-hidden="true">${icon('scale')}</span>
      <span>Scaled Cook Card</span>
    </a>
    <nav aria-label="Utility navigation">
      ${!state.online ? '<span class="connection-pill"><span aria-hidden="true">●</span> Offline — your card still works</span>' : ''}
      <a class="nav-link" href="/demo">Demo</a>
      <a class="nav-link" href="/privacy" data-nav="/privacy">Privacy</a>
      <button class="text-button" data-action="open-pass">${state.license.valid ? 'History upgrade active' : 'View history upgrade'}</button>
    </nav>
  </header>`;
}

function demoBanner(): string {
  if (!state.demo) return '';
  return `<aside class="demo-banner" aria-label="Demo mode"><span><strong>Demo</strong> — sample data, nothing is saved to your real cook card.</span><span><button class="text-button" data-action="reset-demo">Reset demo</button><button class="text-button" data-action="start-real">Start for real</button></span></aside>`;
}

function footer(): string {
  return `<footer class="site-footer">
    <p>Scaled cook cards for home cooks.</p>
    <nav aria-label="Legal">
      <a href="/privacy" data-nav="/privacy">Privacy</a>
      <a href="/terms" data-nav="/terms">Terms</a>
    </nav>
    <p class="generation-note">Built by Param Factory · build ${BUILD_ID}. <a href="/artwork" data-nav="/artwork">Artwork provenance</a>.</p>
  </footer>`;
}

function landing(): string {
  return `<main id="main" class="landing">
    <section class="hero-copy" aria-labelledby="main-title">
      <h1 id="main-title">Scale recipe amounts <br><em>in every step.</em></h1>
      <p class="lede">For home cooks who need correct quantities while their hands are busy.</p>
      <div class="hero-actions">
        <button class="button primary" data-action="try-sample">Try it with sample data ${icon('arrow')}</button>
        <button class="button secondary" data-action="open-import">${icon('upload')} Import my recipe</button>
      </div>
      <p class="action-help">Open a ready pasta cook card, or paste a recipe you wrote.</p>
      <ul class="plain-facts" aria-label="Product facts"><li>Import YAML or JSON.</li><li>Works offline after the first visit.</li><li>$9 once for optional history.</li><li>Recipes stay in this browser.</li></ul>
    </section>
    <figure class="hero-figure">
      <picture>
        <source type="image/avif" srcset="/hero-notebook-v1-1280.avif 1280w" sizes="(max-width: 760px) 94vw, 52vw">
        <source type="image/webp" srcset="/hero-notebook-v1-768.webp 768w, /hero-notebook-v1-1280.webp 1280w" sizes="(max-width: 760px) 94vw, 52vw">
        <img src="/hero-notebook-v1-1280.webp" width="1280" height="853" alt="Illustrated open kitchen notebook with ingredient bowls, a wooden spoon, and pencil corrections" fetchpriority="high" decoding="async">
      </picture>
      <figcaption>Sample cook card workflow: scale, cook, then note changes.</figcaption>
    </figure>
    <section class="how-it-works" aria-labelledby="how-heading">
      <div>
        <p class="eyebrow">How it works</p>
        <h2 id="how-heading">See each ingredient amount inside its cooking step.</h2>
      </div>
      <div class="syntax-demo" aria-label="Example of a linked ingredient amount">
        <span class="syntax-label">In your recipe file</span><code>Add &#123;&#123;salt&#125;&#125; to the pot.</code>
        <span class="syntax-help">The name inside braces matches an ingredient id.</span>
        <span aria-hidden="true">becomes</span>
        <p>Add <span class="bound-token"><strong>1½ tsp</strong> fine salt</span> to the pot.</p>
      </div>
    </section>
    <section class="landing-detail" aria-labelledby="limits-heading">
      <div><p class="eyebrow">Recipe boundaries</p><h2 id="limits-heading">What this card does not do</h2></div>
      <p>Start with a recipe you wrote or can import. This card focuses on scaling and cooking that recipe.</p>
    </section>
    <section class="landing-detail pass-section" aria-labelledby="pass-heading">
      <div><p class="eyebrow">Optional upgrade</p><h2 id="pass-heading">Optional recipe history</h2></div>
      <div>${CHECKOUT_ENABLED
    ? '<p><strong>$9 once.</strong> Keep an unlimited local recipe library and complete local cook history.</p>'
    : '<p><strong>Kitchen Pass checkout is unavailable right now.</strong> The free cook card keeps scaling, cooking, and export.</p>'}<button class="button secondary" data-action="open-pass">View history upgrade</button></div>
    </section>
  </main>`;
}

function servingControl(): string {
  return `<div class="serving-control" aria-label="Scale servings">
    <span>Serves</span>
    <button data-action="decrease-servings" aria-label="Decrease servings">−</button>
    <label class="sr-only" for="servings">Number of servings</label>
    <input id="servings" inputmode="decimal" type="number" min="0.25" max="999" step="0.25" value="${state.targetServings}" aria-describedby="scale-status">
    <button data-action="increase-servings" aria-label="Increase servings">+</button>
  </div>`;
}

function workspace(): string {
  const recipe = state.recipe!;
  const latest = state.records.find((record) => record.recipeId === recipe.id);
  return `<main id="main" class="workspace">
    <div class="recipe-masthead">
      <div>
        <p class="eyebrow">Your cook card</p>
        <h1>${escapeHtml(recipe.title)}</h1>
        <p class="recipe-fact">Original recipe: ${formatQuantity(recipe.servings)} servings · ${recipe.steps.length} steps</p>
      </div>
      <div class="recipe-actions">
        ${servingControl()}
        <button class="button primary start-cook" data-action="start-cook">Start cook mode ${icon('arrow')}</button>
      </div>
    </div>
    <p id="scale-status" class="sr-only" aria-live="polite">Recipe scaled to ${state.targetServings} servings.</p>
    ${state.license.valid ? libraryPanel() : ''}
    <div class="recipe-sheet">
      <aside class="ingredient-margin" aria-labelledby="ingredient-heading">
        <div class="section-number" aria-hidden="true">A</div>
        <h2 id="ingredient-heading">Scaled ingredients</h2>
        <ul class="ingredient-list">
          ${recipe.ingredients.map((item) => `<li><span class="quantity">${escapeHtml(scaledAmount(item, recipe.servings, state.targetServings))}</span><span>${escapeHtml(item.name)}${item.note ? `<small>${escapeHtml(item.note)}</small>` : ''}</span></li>`).join('')}
        </ul>
      </aside>
      <section class="procedure" aria-labelledby="procedure-heading">
        <div class="section-heading"><span class="section-number" aria-hidden="true">B</span><div><p class="eyebrow">Scaled amounts appear in blue</p><h2 id="procedure-heading">Procedure</h2></div></div>
        <ol class="step-list">
          ${recipe.steps.map((step, index) => `<li><span class="step-index" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span><p>${renderStepText(step)}</p></li>`).join('')}
        </ol>
      </section>
    </div>
    <section class="ledger-summary" aria-labelledby="ledger-heading">
      <div><p class="eyebrow">After cooking</p><h2 id="ledger-heading">Correction ledger</h2></div>
      ${latest ? `<div class="latest-note"><span>${new Date(latest.cookedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span><p>${latest.actualYield !== null ? `Made ${formatQuantity(latest.actualYield)} servings. ` : ''}${escapeHtml(latest.substitutions || latest.notes || 'Cook completed — no changes noted.')}</p></div>` : '<p class="muted">Finish a cook to save the real yield, substitutions, and notes on this device.</p>'}
      <button class="button secondary" data-action="start-cook">${latest ? 'Cook it again' : 'Start cooking'}</button>
    </section>
    <div class="bottom-actions">
      <button class="text-button" data-action="export-recipe">Export recipe JSON</button>
      <button class="text-button" data-action="open-import">Import another</button>
      <button class="text-button danger-link" data-action="delete-recipe">Remove this card</button>
    </div>
  </main>`;
}

function libraryPanel(): string {
  if (!state.library.length) return '';
  return `<section class="library-strip" aria-label="Saved cook card library">
    <label for="recipe-library">Kitchen Pass library</label>
    <select id="recipe-library">
      ${state.library.map((item) => `<option value="${escapeHtml(item.id)}" ${item.id === state.recipe?.id ? 'selected' : ''}>${escapeHtml(item.title)}</option>`).join('')}
    </select>
    <span>${state.library.length} saved ${state.library.length === 1 ? 'card' : 'cards'}</span>
  </section>`;
}

function legalPage(kind: 'privacy' | 'terms'): string {
  const privacy = kind === 'privacy';
  const passPurchase = CHECKOUT_ENABLED
    ? 'Kitchen Pass is a $9 one-time license. It unlocks an unlimited local recipe library and complete local cook history. Checkout is hosted by Sociobot/Dodo. A refunded, expired, or revoked license stops the paid features. Recipe export remains available.'
    : 'Kitchen Pass checkout is currently unavailable. The free card keeps scaling, cooking, offline use, and export. If you already have a Kitchen Pass license, you can restore it on this device. When checkout is enabled, it will be a $9 one-time license for one person’s devices.';
  return `<main id="main" class="legal-page">
    <p class="eyebrow">Last updated August 28, 2026</p>
    <h1>${privacy ? 'Privacy, in plain language' : 'Terms of use'}</h1>
    <p class="lede">${privacy ? 'Your recipes belong in your kitchen, not in our database.' : 'A short, practical agreement for using Scaled Cook Card.'}</p>
    ${privacy ? `<section><h2>What stays on this device</h2><p>Imported recipes, scaled serving choices, cook corrections, and license tokens are stored in your browser’s local storage. Scaled Cook Card has no account system and does not send recipe content to us.</p></section>
      <section><h2>Network requests</h2><p>The app requests its own files and, when you provide a Kitchen Pass license, asks the Sociobot billing API whether that license is valid. When checkout is enabled, Sociobot/Dodo hosts it as the merchant of record. There are no advertising or behavioral analytics scripts.</p></section>
      <section><h2>Your control</h2><p>Export is always available. “Remove this card” deletes the active cook card after confirmation. Clearing site data in your browser removes local cook cards, records, and the saved license.</p></section>`
      : `<section><h2>Use of the tool</h2><p>Scaled Cook Card performs arithmetic on user-authored recipe data. Check amounts, allergens, temperatures, and food safety for your circumstances. The tool is provided “as is” without cooking, nutrition, or medical guarantees.</p></section>
      <section><h2>Your content</h2><p>You retain all rights to recipes you enter. Only import content you have the right to use. The service does not scrape or republish recipe websites.</p></section>
      <section><h2>Kitchen Pass purchase</h2><p>${passPurchase}</p></section>
      <section><h2>Offline and availability</h2><p>Installed app files and local recipes are designed to remain usable offline after the first successful load. Browser storage and screen-wake support vary by device. We may update or discontinue the hosted service.</p></section>`}
    <p><a class="button secondary" href="/" data-nav="/">Back to cook card</a></p>
  </main>`;
}

function importDialog(): string {
  return `<dialog id="import-dialog" class="notebook-dialog" aria-labelledby="import-title">
    <button class="dialog-close" data-action="close-import" aria-label="Close import dialog">${icon('close')}</button>
    <p class="eyebrow">Import recipe</p>
    <h2 id="import-title">Import your recipe</h2>
    <p>Paste YAML or JSON below, or choose a small <code>.yaml</code>, <code>.yml</code>, or <code>.json</code> file. The name inside braces matches an ingredient id.</p>
    <label class="file-drop" for="recipe-file">${icon('upload')}<strong>Choose a recipe file </strong><span>or drop it here</span></label>
    <input id="recipe-file" class="sr-only" type="file" accept=".yaml,.yml,.json,application/json,text/yaml">
    <label for="recipe-source">Recipe YAML or JSON</label>
    <textarea id="recipe-source" rows="15" spellcheck="false" aria-describedby="import-help import-error">${escapeHtml(state.importText)}</textarea>
    <p id="import-help" class="field-help">Quantities may be decimals or fractions such as <code>1 1/2</code>.</p>
    <p id="import-error" class="form-error" aria-live="assertive">${escapeHtml(state.importError)}</p>
    <div class="dialog-actions">
      <button class="button secondary" data-action="reset-sample">Reset example</button>
      <button class="button primary" data-action="import-recipe">Make cook card ${icon('arrow')}</button>
    </div>
  </dialog>`;
}

function passDialog(): string {
  return `<dialog id="pass-dialog" class="notebook-dialog pass-dialog" aria-labelledby="pass-title">
    <button class="dialog-close" data-action="close-pass" aria-label="Close Kitchen Pass dialog">${icon('close')}</button>
    <p class="eyebrow">One-time upgrade</p>
    <h2 id="pass-title">Kitchen Pass</h2>
    ${state.license.valid ? `<div class="license-active">${icon('check')}<div><strong>License active</strong><span>Unlimited recipe library and full cook history are unlocked.</span></div></div>
      <button class="text-button danger-link" data-action="remove-license">Remove license from this device</button>`
      : `${CHECKOUT_ENABLED ? '<p class="pass-price"><strong>$9</strong> once</p>' : '<p class="checkout-unavailable" role="status"><strong>Checkout is unavailable right now.</strong> Your free cook card stays usable. If you already bought Kitchen Pass, paste your license below.</p>'}
      <ul class="check-list"><li>${icon('check')} Save unlimited cook cards</li><li>${icon('check')} Keep the complete correction history</li><li>${icon('check')} Restore your license on this device</li></ul>
      <p>The free cook card includes scaling, cook mode, one saved cook card and its latest correction, offline use, and export.</p>
      ${CHECKOUT_ENABLED ? `<a class="button primary full-button" href="${CHECKOUT_URL}" target="_blank" rel="noopener noreferrer" aria-label="Buy Kitchen Pass (opens hosted checkout in a new tab)">Buy Kitchen Pass ${icon('arrow')}</a><p class="field-help">Checkout opens separately, and your free cook card stays usable here.</p>` : ''}
      <hr>
      <form id="license-form"><label for="license-token">Have a license? Paste it here</label><div class="inline-field"><input id="license-token" name="license" autocomplete="off" required><button class="button secondary" type="submit">Restore Kitchen Pass</button></div></form>
      ${state.license.message ? `<p class="license-message" aria-live="polite">${escapeHtml(state.license.message)}</p>` : ''}`}
    <p class="legal-note">Sociobot/Dodo is the merchant of record and handles refunds. Refunds revoke the license. <a href="/privacy" data-nav="/privacy">Privacy</a> · <a href="/terms" data-nav="/terms">Terms</a></p>
  </dialog>`;
}

function cookDialog(): string {
  if (!state.recipe || !state.cookOpen) return '';
  const recipe = state.recipe;
  const step = recipe.steps[state.cookStep];
  const complete = state.completionOpen;
  return `<dialog id="cook-dialog" class="cook-dialog" aria-labelledby="cook-title">
    <header class="cook-header">
      <div><p class="eyebrow">Cooking ${escapeHtml(recipe.title)}</p><h2 id="cook-title">${complete ? 'Log what really happened' : `Step ${state.cookStep + 1} of ${recipe.steps.length}`}</h2></div>
      <button class="dialog-close" data-action="close-cook" aria-label="Exit cook mode">${icon('close')}</button>
    </header>
    ${complete ? completionForm() : `<div class="cook-progress" aria-hidden="true">${recipe.steps.map((_item, index) => `<span class="${index <= state.cookStep ? 'filled' : ''}"></span>`).join('')}</div>
      <article class="active-step"><span class="step-index">${String(state.cookStep + 1).padStart(2, '0')}</span><p>${step ? renderStepText(step) : ''}</p></article>
      <aside class="step-amounts" aria-label="Ingredients in this step">${step && bindingIds(step).length ? bindingIds(step).map((id) => `<div><span>${escapeHtml(state.recipe?.ingredients.find((item) => item.id === id)?.name ?? id)}</span><strong>${escapeHtml(amountFor(id))}</strong></div>`).join('') : '<p>No measured ingredients in this step.</p>'}</aside>
      <label class="wake-toggle"><input id="wake-toggle" type="checkbox" ${state.wakeActive ? 'checked' : ''} ${navigator.wakeLock ? '' : 'disabled'}><span><strong>Keep screen awake</strong><small>${escapeHtml(state.wakeMessage)}</small></span></label>
      <footer class="cook-controls"><button class="button secondary" data-action="previous-step" ${state.cookStep === 0 ? 'disabled' : ''}>← Previous</button><button class="button primary" data-action="next-step">${state.cookStep === recipe.steps.length - 1 ? `Finish & note changes ${icon('check')}` : `Next step ${icon('arrow')}`}</button></footer>
      <p class="keyboard-hint">Tip: use the left and right arrow keys.</p>`}
  </dialog>`;
}

function completionForm(): string {
  return `<form id="completion-form" class="completion-form">
    <p class="completion-intro">Recipes get better when the real result gets written down. Everything here stays on this device.</p>
    <label for="actual-yield">Actual yield <span>(optional)</span></label>
    <div class="yield-field"><input id="actual-yield" name="actualYield" type="number" min="0" step="0.25" inputmode="decimal" placeholder="${state.targetServings}"><span>servings</span></div>
    <label for="substitutions">Substitutions <span>(optional)</span></label>
    <textarea id="substitutions" name="substitutions" rows="3" placeholder="e.g. used shallots instead of garlic"></textarea>
    <label for="cook-notes">Notes for next time <span>(optional)</span></label>
    <textarea id="cook-notes" name="notes" rows="3" placeholder="e.g. sauce needed 5 more minutes"></textarea>
    <div class="dialog-actions"><button type="button" class="button secondary" data-action="skip-correction">Finish without notes</button><button class="button primary" type="submit">Save to ledger ${icon('check')}</button></div>
  </form>`;
}

function render(): void {
  const path = location.pathname.replace(/\/$/, '') || '/';
  updateDocumentMetadata(path);
  const page = path === '/privacy' ? legalPage('privacy')
    : path === '/terms' ? legalPage('terms')
      : path === '/artwork' ? artworkPage()
      : path === '/' || path === '/demo' ? (state.recipe ? workspace() : landing())
        : notFoundPage();
  root.innerHTML = `${header()}${demoBanner()}${page}${footer()}${importDialog()}${passDialog()}${cookDialog()}<div class="toast" role="status" aria-live="polite">${escapeHtml(state.toast)}</div>`;
  if (state.importOpen) openRenderedDialog('import-dialog');
  if (state.passOpen) openRenderedDialog('pass-dialog');
  if (state.cookOpen) openRenderedDialog('cook-dialog');
}

function notFoundPage(): string {
  return `<main id="main" class="legal-page not-found"><p class="eyebrow">Page not found</p><h1>That cook card page is missing.</h1><p class="lede">Return to the cook card to scale a recipe or open the sample.</p><p><a class="button primary" href="/" data-nav="/">Back to cook card</a></p></main>`;
}

function artworkPage(): string {
  return `<main id="main" class="legal-page"><p class="eyebrow">Artwork provenance</p><h1>Original notebook artwork</h1><p class="lede">The notebook illustration was made for this cook card.</p><section><h2>How it was made</h2><p>The image was generated with Azure AI Foundry for this product. It shows a kitchen notebook, ingredient bowls, and pencil corrections. It contains no text, brands, or people.</p></section><section><h2>Source record</h2><p>The prompt, date, model, and original source record are kept in this product’s design documentation.</p></section><p><a class="button secondary" href="/" data-nav="/">Back to cook card</a></p></main>`;
}

function updateDocumentMetadata(path: string): void {
  const page = path === '/privacy' ? { title: 'Privacy — Scaled Cook Card', description: 'How Scaled Cook Card keeps recipe data in your browser.' }
    : path === '/terms' ? { title: 'Terms — Scaled Cook Card', description: 'Terms for using Scaled Cook Card.' }
      : path === '/demo' || (path === '/' && demo) ? { title: 'Demo — Scaled Cook Card', description: 'Try Scaled Cook Card with a sample recipe.' }
        : path === '/artwork' ? { title: 'Artwork provenance — Scaled Cook Card', description: 'Original notebook artwork made for Scaled Cook Card.' }
        : path === '/' ? { title: 'Scaled Cook Card — scale recipe steps', description: 'Scale a recipe once, then see the right ingredient amount in every cooking step.' }
          : { title: 'Page not found — Scaled Cook Card', description: 'This Scaled Cook Card page is not available.' };
  document.title = page.title;
  const canonicalPath = path === '/' && demo ? '/demo' : path;
  document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', `${SITE_URL}${canonicalPath === '/' ? '/' : canonicalPath}`);
  document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute('content', page.description);
  document.querySelector<HTMLMetaElement>('meta[property="og:title"]')?.setAttribute('content', page.title);
  document.querySelector<HTMLMetaElement>('meta[property="og:description"]')?.setAttribute('content', page.description);
  document.querySelector<HTMLMetaElement>('meta[name="twitter:title"]')?.setAttribute('content', page.title);
  document.querySelector<HTMLMetaElement>('meta[name="twitter:description"]')?.setAttribute('content', page.description);
}

function openRenderedDialog(id: string): void {
  requestAnimationFrame(() => {
    const dialog = document.querySelector<HTMLDialogElement>(`#${id}`);
    if (dialog && !dialog.open) {
      dialog.addEventListener('close', () => {
        if (id === 'import-dialog' && state.importOpen) { state.importOpen = false; render(); focusAfterRender('[data-action="open-import"]'); }
        if (id === 'pass-dialog' && state.passOpen) { state.passOpen = false; render(); focusAfterRender('[data-action="open-pass"]'); }
        if (id === 'cook-dialog') {
          state.cookOpen = false;
          state.completionOpen = false;
          void toggleWake(false);
          focusAfterRender('[data-action="start-cook"]');
        }
      }, { once: true });
      dialog.showModal();
    }
  });
}

function focusAfterRender(selector: string): void {
  requestAnimationFrame(() => root.querySelector<HTMLElement>(selector)?.focus());
}

function focusRouteHeading(): void {
  requestAnimationFrame(() => {
    const heading = root.querySelector<HTMLElement>('main h1');
    if (!heading) return;
    heading.tabIndex = -1;
    heading.focus();
  });
}

function announceRoute(message: string): void {
  if (!routeAnnouncementElement) return;
  routeAnnouncementElement.textContent = '';
  requestAnimationFrame(() => { routeAnnouncementElement.textContent = message; });
}

function navigate(path: string): void {
  history.pushState({}, '', path);
  state.importOpen = false;
  state.passOpen = false;
  render();
  window.scrollTo(0, 0);
  focusRouteHeading();
  announceRoute(`Opened ${path === '/privacy' ? 'Privacy' : path === '/terms' ? 'Terms' : path === '/artwork' ? 'Artwork provenance' : 'Scaled Cook Card'}.`);
}

function notify(message: string): void {
  state.toast = message;
  window.clearTimeout(toastTimer);
  render();
  toastTimer = window.setTimeout(() => {
    state.toast = '';
    const toast = root.querySelector<HTMLElement>('.toast');
    if (toast) toast.textContent = '';
  }, 3200);
}

function activateRecipe(recipe: Recipe, addToLibrary = state.license.valid): void {
  const replacingFreeCard = !state.license.valid && Boolean(state.recipe) && state.recipe?.id !== recipe.id;
  state.recipe = recipe;
  state.targetServings = recipe.servings;
  saveActiveRecipe(recipe);
  saveTargetServings(recipe.servings);
  if (addToLibrary) state.library = upsertLibrary(recipe);
  if (replacingFreeCard) {
    state.records = [];
    saveCookRecords([]);
  }
  state.importOpen = false;
  state.importError = '';
  history.pushState({}, '', state.demo ? '/demo' : '/');
  notify(`${recipe.title} is ready to scale.`);
}

function doImport(source: string): void {
  try {
    const recipe = parseRecipe(source);
    if (state.recipe && !state.license.valid && state.recipe.id !== recipe.id && !confirm(`Replace “${state.recipe.title}” with “${recipe.title}”? Export the current card first if you want a copy.`)) return;
    activateRecipe(recipe);
  } catch (error) {
    state.importError = error instanceof Error ? error.message : 'That recipe could not be imported.';
    state.importText = source;
    render();
  }
}

async function toggleWake(enabled: boolean): Promise<void> {
  if (!enabled) {
    await wakeLock?.release();
    wakeLock = null;
    state.wakeActive = false;
    state.wakeMessage = 'Keep this screen awake while cooking.';
    render();
    return;
  }
  try {
    wakeLock = await navigator.wakeLock?.request('screen') ?? null;
    state.wakeActive = Boolean(wakeLock);
    state.wakeMessage = state.wakeActive ? 'Screen wake is active.' : 'Screen wake is not available.';
    wakeLock?.addEventListener('release', () => { state.wakeActive = false; });
  } catch {
    state.wakeActive = false;
    state.wakeMessage = 'Your browser did not allow screen wake. Cooking controls still work.';
  }
  render();
}

function finishCook(data?: FormData): void {
  if (!state.recipe) return;
  const enteredYield = String(data?.get('actualYield') ?? '').trim();
  const record: CookRecord = {
    id: crypto.randomUUID(), recipeId: state.recipe.id, cookedAt: new Date().toISOString(),
    targetServings: state.targetServings,
    actualYield: enteredYield === '' ? null : Number(enteredYield),
    substitutions: String(data?.get('substitutions') ?? '').trim(), notes: String(data?.get('notes') ?? '').trim(),
  };
  const own = state.records.filter((item) => item.recipeId === state.recipe?.id);
  state.records = state.license.valid ? [record, ...own, ...state.records.filter((item) => item.recipeId !== state.recipe?.id)] : [record];
  saveCookRecords(state.records);
  state.cookOpen = false;
  state.completionOpen = false;
  void toggleWake(false);
  notify('Cook saved to the correction ledger.');
}

root.addEventListener('click', (event) => {
  const target = (event.target as HTMLElement).closest<HTMLElement>('[data-action], [data-nav]');
  if (!target) return;
  const nav = target.dataset.nav;
  if (nav) { event.preventDefault(); navigate(nav); return; }
  const action = target.dataset.action;
  if (action === 'try-sample') location.assign('/demo');
  if (action === 'reset-demo' && state.demo) {
    clearStorageNamespace();
    state.recipe = parseRecipe(sampleRecipe);
    state.targetServings = state.recipe.servings;
    state.records = [];
    state.library = [];
    saveActiveRecipe(state.recipe);
    saveTargetServings(state.targetServings);
    notify('Demo reset to the sample recipe.');
  }
  if (action === 'start-real' && state.demo) {
    clearStorageNamespace();
    setStorageNamespace('scc:');
    location.assign('/');
  }
  if (action === 'open-import') { state.importOpen = true; state.importError = ''; render(); }
  if (action === 'close-import') { state.importOpen = false; render(); focusAfterRender('[data-action="open-import"]'); }
  if (action === 'reset-sample') { state.importText = sampleRecipe; state.importError = ''; render(); }
  if (action === 'import-recipe') doImport((document.querySelector<HTMLTextAreaElement>('#recipe-source')?.value ?? ''));
  if (action === 'increase-servings') updateServings(state.targetServings + Math.max(0.25, Math.round(state.targetServings / 4) || 1));
  if (action === 'decrease-servings') updateServings(Math.max(0.25, state.targetServings - Math.max(0.25, Math.round(state.targetServings / 4) || 1)));
  if (action === 'start-cook') { state.cookStep = 0; state.completionOpen = false; state.cookOpen = true; render(); }
  if (action === 'close-cook') { state.cookOpen = false; state.completionOpen = false; void toggleWake(false); render(); focusAfterRender('[data-action="start-cook"]'); }
  if (action === 'previous-step') { state.cookStep = Math.max(0, state.cookStep - 1); render(); }
  if (action === 'next-step' && state.recipe) { if (state.cookStep < state.recipe.steps.length - 1) state.cookStep += 1; else state.completionOpen = true; render(); }
  if (action === 'skip-correction') finishCook();
  if (action === 'export-recipe') exportRecipe();
  if (action === 'delete-recipe' && state.recipe && confirm(`Remove “${state.recipe.title}” from this device? Export it first if you want a copy.`)) {
    const deletedId = state.recipe.id; saveActiveRecipe(null); state.recipe = null;
    if (state.license.valid) { state.library = state.library.filter((item) => item.id !== deletedId); saveLibrary(state.library); }
    notify('Recipe removed from this device.');
  }
  if (action === 'open-pass') { state.passOpen = true; render(); }
  if (action === 'close-pass') { state.passOpen = false; render(); focusAfterRender('[data-action="open-pass"]'); }
  if (action === 'remove-license') { clearLicense(); state.license = cachedLicenseState(); state.passOpen = false; notify('License removed from this device.'); }
});

root.addEventListener('change', (event) => {
  const target = event.target as HTMLInputElement | HTMLSelectElement;
  if (target.id === 'servings') updateServings(Number(target.value));
  if (target.id === 'wake-toggle') void toggleWake((target as HTMLInputElement).checked);
  if (target.id === 'recipe-library') {
    const recipe = state.library.find((item) => item.id === target.value);
    if (recipe) activateRecipe(recipe, false);
  }
  if (target.id === 'recipe-file') void readRecipeFile((target as HTMLInputElement).files?.[0]);
});

root.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.target as HTMLFormElement;
  if (form.id === 'completion-form') finishCook(new FormData(form));
  if (form.id === 'license-form') {
    const token = String(new FormData(form).get('license') ?? '').trim();
    if (!token) return;
    storeLicense(token);
    state.license = { token, valid: false, checking: true, message: 'Checking license…' };
    render();
    void verifyLicense(true).then((license) => { state.license = license; if (license.valid && state.recipe) state.library = upsertLibrary(state.recipe); render(); });
  }
});

root.addEventListener('dragover', (event) => { if ((event.target as HTMLElement).closest('.file-drop')) event.preventDefault(); });
root.addEventListener('drop', (event) => {
  if (!(event.target as HTMLElement).closest('.file-drop')) return;
  event.preventDefault();
  void readRecipeFile(event.dataTransfer?.files[0]);
});

function updateServings(value: number): void {
  if (!Number.isFinite(value) || value < 0.25 || value > 999) { notify('Choose a serving count between 0.25 and 999.'); return; }
  state.targetServings = Math.round(value * 100) / 100;
  saveTargetServings(state.targetServings);
  render();
}

async function readRecipeFile(file?: File): Promise<void> {
  if (!file) return;
  if (file.size > 1_000_000) { state.importError = 'That file is over 1 MB. Choose a smaller recipe file.'; render(); return; }
  state.importText = await file.text();
  state.importError = '';
  render();
}

function exportRecipe(): void {
  if (!state.recipe) return;
  const blob = new Blob([JSON.stringify(state.recipe, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${state.recipe.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'recipe'}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
  notify('Recipe JSON exported.');
}

window.addEventListener('keydown', (event) => {
  if (!state.cookOpen || state.completionOpen || ['INPUT', 'TEXTAREA'].includes((event.target as HTMLElement).tagName)) return;
  if (event.key === 'ArrowRight') { event.preventDefault(); document.querySelector<HTMLElement>('[data-action="next-step"]')?.click(); }
  if (event.key === 'ArrowLeft') { event.preventDefault(); document.querySelector<HTMLElement>('[data-action="previous-step"]')?.click(); }
});
window.addEventListener('popstate', () => {
  state.importOpen = false;
  state.passOpen = false;
  render();
  focusRouteHeading();
  announceRoute('Page changed.');
});
window.addEventListener('online', () => { state.online = true; render(); });
window.addEventListener('offline', () => { state.online = false; render(); });
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && state.wakeActive && !wakeLock) void toggleWake(true); });

render();
if ('serviceWorker' in navigator) window.addEventListener('load', () => { void navigator.serviceWorker.register('/sw.js'); });
if (state.license.token) void verifyLicense().then((license) => { state.license = license; if (license.valid && state.recipe) state.library = upsertLibrary(state.recipe); render(); });

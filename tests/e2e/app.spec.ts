import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('imports sample, scales amounts, cooks with keyboard, and saves a correction', async ({ page }) => {
  await page.getByRole('button', { name: /try it with sample data/i }).click();
  await expect(page).toHaveURL(/\?demo=1$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Weeknight tomato pasta' })).toBeVisible();
  await page.getByLabel('Number of servings').fill('6');
  await page.getByLabel('Number of servings').press('Tab');
  await expect(page.getByText('600 g').first()).toBeVisible();

  await page.getByRole('button', { name: /start cook mode/i }).click();
  await expect(page.getByRole('heading', { name: 'Step 1 of 4' })).toBeVisible();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('heading', { name: 'Step 2 of 4' })).toBeVisible();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.getByRole('button', { name: /finish & note changes/i }).click();
  await page.getByLabel('Actual yield').fill('5.5');
  await page.getByLabel('Substitutions').fill('Used shallot for garlic');
  await page.getByRole('button', { name: /save to ledger/i }).click();
  await expect(page.getByText(/made 5 ½ servings/i)).toBeVisible();
});

test('renders exact fractions in the ingredient list and bound steps @claim:recipe-import-scaling', async ({ page }) => {
  const recipe = JSON.stringify({
    title: 'Fraction proof', servings: 4,
    ingredients: [{ id: 'spice', name: 'paprika', quantity: '3/16', unit: 'tsp' }],
    steps: [{ text: 'Stir in {{spice}}.' }],
  });
  await page.getByRole('button', { name: /import my recipe/i }).click();
  await page.getByLabel('Recipe YAML or JSON').fill(recipe);
  await page.getByRole('button', { name: /make cook card/i }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Fraction proof' })).toBeVisible();
  await expect(page.locator('.ingredient-list')).toContainText('3/16 tsp');
  await expect(page.locator('.step-list')).toContainText('3/16 tsp');

  await page.getByLabel('Number of servings').fill('8');
  await page.getByLabel('Number of servings').press('Tab');
  await expect(page.locator('.ingredient-list')).toContainText('⅜ tsp');
  await expect(page.locator('.step-list')).toContainText('⅜ tsp');

  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: /import another/i }).click();
  await page.getByLabel('Recipe YAML or JSON').fill(`title: YAML proof
servings: 2
ingredients:
  - id: oil
    name: olive oil
    quantity: 1
    unit: tbsp
steps:
  - text: Add {{oil}}.`);
  await page.getByRole('button', { name: /make cook card/i }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'YAML proof' })).toBeVisible();
});

test('keeps an in-progress correction when the ready toast expires @claim:actual-yield-correction', async ({ page }) => {
  await page.clock.install();
  await page.getByRole('button', { name: /try it with sample data/i }).click();
  await page.getByRole('button', { name: /start cook mode/i }).click();
  for (let step = 0; step < 3; step += 1) await page.getByRole('button', { name: /next step/i }).click();
  await page.getByRole('button', { name: /finish & note changes/i }).click();

  const actualYield = page.getByLabel('Actual yield');
  await actualYield.fill('5.5');
  await page.getByLabel('Substitutions').fill('Used shallot for garlic');
  await page.getByLabel('Notes for next time').fill('Simmered for five extra minutes');
  // Cross the exact 3.2-second toast boundary from the verifier report.
  await page.clock.fastForward(3_200);
  await expect(actualYield).toHaveValue('5.5');
  await expect(page.getByLabel('Substitutions')).toHaveValue('Used shallot for garlic');

  await page.getByRole('button', { name: /save to ledger/i }).click();
  await expect(page.getByText(/made 5 ½ servings/i)).toBeVisible();
  const records = await page.evaluate(() => JSON.parse(localStorage.getItem('demo:scc:cook-records') ?? '[]')) as Array<{ notes: string }>;
  expect(records[0]?.notes).toBe('Simmered for five extra minutes');
});

test('reports invalid imports without losing the dialog', async ({ page }) => {
  await page.getByRole('button', { name: /import my recipe/i }).click();
  await page.getByLabel('Recipe YAML or JSON').fill('title: Broken');
  await page.getByRole('button', { name: /make cook card/i }).click();
  await expect(page.getByText(/servings must be a number/i)).toBeVisible();
  await expect(page.getByRole('dialog', { name: 'Import your recipe' })).toBeVisible();
});

test('landing page has no serious accessibility violations', async ({ page }) => {
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
});

test('keeps the offline, price, and browser-storage facts on the desktop first screen', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  try {
    await page.goto('/');
    for (const fact of ['Works offline after the first visit.', '$9 once for optional history.', 'Cook cards stay in this browser.']) {
      const box = await page.getByText(fact, { exact: true }).boundingBox();
      expect(box, fact).not.toBeNull();
      expect((box?.y ?? 900) + (box?.height ?? 1), fact).toBeLessThanOrEqual(900);
    }
  } finally {
    await context.close();
  }
});

test('uses a real three-step landing flow and route-appropriate skip labels', async ({ page }) => {
  await expect(page.getByRole('heading', { level: 2, name: 'Make a cook card in three steps' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Import a recipe file' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Scale and cook each step' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Save what changed' })).toBeVisible();
  for (const route of ['/privacy', '/terms', '/artwork']) {
    await page.goto(route);
    await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeVisible();
  }
});

test('keeps the complete first screen visible on a 390px phone', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  try {
    await page.goto('/');
    for (const text of [
      'Scale recipe amounts in every step.',
      'For home cooks who need correct quantities while their hands are busy.',
      'Works offline after the first visit.',
      '$9 once for optional history.',
      'Cook cards stay in this browser.',
    ]) {
      const box = await page.getByText(text, { exact: true }).boundingBox();
      expect(box, text).not.toBeNull();
      expect((box?.y ?? 844) + (box?.height ?? 1), text).toBeLessThanOrEqual(844);
    }
    await expect(page.getByRole('button', { name: /try it with sample data/i })).toBeInViewport();
    await expect(page.getByRole('button', { name: /import my recipe/i })).toBeInViewport();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  } finally {
    await context.close();
  }
});

test('keeps word boundaries in the headline and recipe-file label', async ({ page }) => {
  await expect(page.getByRole('heading', { level: 1, name: 'Scale recipe amounts in every step.' })).toBeVisible();
  await page.getByRole('button', { name: /import my recipe/i }).click();
  await expect(page.getByLabel('Choose a recipe file or drop it here')).toBeVisible();
});

test('legal routes work directly', async ({ page }) => {
  await page.goto('/privacy');
  await expect(page.getByRole('heading', { level: 1, name: 'Privacy, in plain language' })).toBeVisible();
  await expect(page).toHaveTitle('Privacy — Scaled Cook Card');
  await page.goto('/terms');
  await expect(page.getByRole('heading', { level: 1, name: 'Terms of use' })).toBeVisible();
  await expect(page).toHaveTitle('Terms — Scaled Cook Card');
});

test('sets route-specific metadata and exposes legal links on every app page', async ({ page }) => {
  const routes = [
    ['/', 'Scaled Cook Card — scale recipe steps', 'https://scaled-cook-card.sociobot.in/'],
    ['/demo', 'Demo — Scaled Cook Card', 'https://scaled-cook-card.sociobot.in/demo'],
    ['/privacy', 'Privacy — Scaled Cook Card', 'https://scaled-cook-card.sociobot.in/privacy'],
    ['/terms', 'Terms — Scaled Cook Card', 'https://scaled-cook-card.sociobot.in/terms'],
    ['/artwork', 'Artwork provenance — Scaled Cook Card', 'https://scaled-cook-card.sociobot.in/artwork'],
    ['/missing-cook-card', 'Page not found — Scaled Cook Card', 'https://scaled-cook-card.sociobot.in/missing-cook-card'],
  ] as const;
  for (const [route, title, canonical] of routes) {
    await page.goto(route);
    await expect(page).toHaveTitle(title);
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /\S/);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', title);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', 'https://scaled-cook-card.sociobot.in/social-card.jpg');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonical);
    await expect(page.locator('.site-footer').getByRole('link', { name: 'Privacy' })).toHaveAttribute('href', '/privacy');
    await expect(page.locator('.site-footer').getByRole('link', { name: 'Terms' })).toHaveAttribute('href', '/terms');
  }
});

test('keeps Kitchen Pass checkout build-gated and restores a license @claim:kitchen-pass', async ({ page }) => {
  await page.route('https://api.sociobot.in/api/v1/products/scaled-cook-card/verify?license=fixture-license', async (route) => {
    await route.fulfill({ json: { valid: true, reason: 'ok' } });
  });
  await page.locator('.site-header').getByRole('button', { name: 'View history upgrade', exact: true }).click();
  const purchaseLink = page.getByRole('link', { name: /buy kitchen pass/i });
  if (process.env.VITE_KITCHEN_PASS_CHECKOUT_ENABLED === 'true') {
    await expect(page.getByText('$9', { exact: true })).toBeVisible();
    await expect(purchaseLink).toHaveAttribute('href', 'https://api.sociobot.in/api/v1/products/scaled-cook-card/checkout');
    await expect(purchaseLink).toHaveAttribute('target', '_blank');
  } else {
    await expect(page.locator('.checkout-unavailable')).toContainText('Checkout is unavailable right now.');
    await expect(purchaseLink).toHaveCount(0);
  }
  await expect(page.getByLabel(/have a license/i)).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Kitchen Pass storage upgrade' })).toBeVisible();
  await page.getByLabel(/have a license/i).fill('fixture-license');
  await page.getByRole('button', { name: 'Restore Kitchen Pass' }).click();
  await expect(page.getByText('License active')).toBeVisible();
});

test('shows the $9 one-time price and hosted checkout when enabled @claim:kitchen-pass-price', async ({ page }) => {
  test.skip(process.env.VITE_KITCHEN_PASS_CHECKOUT_ENABLED !== 'true', 'Requires the checkout-enabled build.');
  await page.locator('.site-header').getByRole('button', { name: 'View history upgrade', exact: true }).click();
  await expect(page.getByText('$9', { exact: true })).toBeVisible();
  await expect(page.locator('.pass-price')).toContainText('$9 once');
  await expect(page.getByRole('link', { name: /buy kitchen pass/i })).toHaveAttribute('href', 'https://api.sociobot.in/api/v1/products/scaled-cook-card/checkout');
});

async function importCookCard(page: import('@playwright/test').Page, source: string, replace = false): Promise<void> {
  await page.getByRole('button', { name: /import (my recipe|another)/i }).click();
  await page.getByLabel('Recipe YAML or JSON').fill(source);
  if (replace) page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: /make cook card/i }).click();
}

async function saveCorrection(page: import('@playwright/test').Page, yieldValue: string): Promise<void> {
  await page.locator('.start-cook').click();
  for (let step = 0; step < 8; step += 1) {
    const finish = page.getByRole('button', { name: /finish & note changes/i });
    if (await finish.isVisible()) { await finish.click(); break; }
    await page.getByRole('button', { name: /next step/i }).click();
  }
  await page.getByLabel('Actual yield').fill(yieldValue);
  await page.getByRole('button', { name: /save to ledger/i }).click();
}

test('keeps multiple cook cards and correction records after restoring Kitchen Pass @claim:paid-history-limits', async ({ page }) => {
  await page.route('https://api.sociobot.in/api/v1/products/scaled-cook-card/verify?license=fixture-license', (route) => route.fulfill({ json: { valid: true, reason: 'ok' } }));
  await importCookCard(page, `title: First card\nservings: 2\ningredients:\n  - id: oil\n    name: olive oil\n    quantity: 1\n    unit: tbsp\nsteps:\n  - text: Add {{oil}}.`, false);
  await page.locator('.site-header').getByRole('button', { name: 'View history upgrade', exact: true }).click();
  await page.getByLabel(/have a license/i).fill('fixture-license');
  await page.getByRole('button', { name: 'Restore Kitchen Pass' }).click();
  await expect(page.getByText('License active')).toBeVisible();
  await page.getByRole('button', { name: /close kitchen pass dialog/i }).click();
  await saveCorrection(page, '2');
  await saveCorrection(page, '3');
  await importCookCard(page, `title: Second card\nservings: 2\ningredients:\n  - id: salt\n    name: salt\n    quantity: 1\n    unit: tsp\nsteps:\n  - text: Add {{salt}}.`, true);
  await page.reload();
  await expect(page.locator('#recipe-library option')).toHaveCount(2);
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('scc:cook-records') ?? '[]')) as Array<{ recipeId: string }>;
  expect(saved).toHaveLength(2);
  expect(new Set(saved.map((record) => record.recipeId)).size).toBe(1);
});

test('keeps one free cook card and its latest correction @claim:free-card-limits', async ({ page }) => {
  await importCookCard(page, `title: First free card\nservings: 2\ningredients:\n  - id: oil\n    name: olive oil\n    quantity: 1\n    unit: tbsp\nsteps:\n  - text: Add {{oil}}.`, false);
  await saveCorrection(page, '2');
  await saveCorrection(page, '3');
  await importCookCard(page, `title: Second free card\nservings: 2\ningredients:\n  - id: salt\n    name: salt\n    quantity: 1\n    unit: tsp\nsteps:\n  - text: Add {{salt}}.`, true);
  await saveCorrection(page, '4');
  await page.reload();
  await expect(page.getByRole('heading', { level: 1, name: 'Second free card' })).toBeVisible();
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('scc:cook-records') ?? '[]')) as Array<{ actualYield: number }>;
  expect(saved).toEqual([expect.objectContaining({ actualYield: 4 })]);
});

test('opens checkout on Sociobot and locks paid history after a revoked verification @claim:billing-terms', async ({ page }) => {
  test.skip(process.env.VITE_KITCHEN_PASS_CHECKOUT_ENABLED !== 'true', 'Requires the checkout-enabled build.');
  await page.route('https://api.sociobot.in/api/v1/products/scaled-cook-card/verify?license=revoked-license', (route) => route.fulfill({ json: { valid: false, reason: 'revoked' } }));
  await page.locator('.site-header').getByRole('button', { name: 'View history upgrade', exact: true }).click();
  await expect(page.getByRole('link', { name: /buy kitchen pass/i })).toHaveAttribute('href', 'https://api.sociobot.in/api/v1/products/scaled-cook-card/checkout');
  await expect(page.locator('.legal-note')).toContainText('Checkout opens on Sociobot. A revoked license stops paid history.');
  await page.getByLabel(/have a license/i).fill('revoked-license');
  await page.getByRole('button', { name: 'Restore Kitchen Pass' }).click();
  await expect(page.getByText('License no longer active')).toBeVisible();
  await expect(page.locator('.library-strip')).toHaveCount(0);
});

test('exports the displayed scaled cook card as JSON @claim:json-export', async ({ page }) => {
  await page.getByRole('button', { name: /try it with sample data/i }).click();
  await page.getByLabel('Number of servings').fill('6');
  await page.getByLabel('Number of servings').press('Tab');
  await expect(page.locator('.step-list')).toContainText('600 g');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: /export scaled cook card json/i }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('weeknight-tomato-pasta-scaled-cook-card.json');
  const path = await download.path();
  expect(path).not.toBeNull();
  expect(JSON.parse(await readFile(path!, 'utf8'))).toMatchObject({
    title: 'Weeknight tomato pasta', servings: 6,
    ingredients: expect.arrayContaining([expect.objectContaining({ id: 'pasta', quantity: 600 })]),
  });
});

test('keeps arrow-key cooking available when screen wake is unsupported @claim:cook-controls', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, 'wakeLock', { value: undefined, configurable: true }));
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.getByRole('button', { name: /try it with sample data/i }).click();
  await page.getByRole('button', { name: /start cook mode/i }).click();
  await expect(page.getByLabel('Keep screen awake')).toBeDisabled();
  await expect(page.getByText('Screen wake is not available in this browser.')).toBeVisible();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('heading', { name: 'Step 2 of 4' })).toBeVisible();
});

test('reloads a saved card offline @claim:offline-reload', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  try {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.reload();
    await page.getByRole('button', { name: /try it with sample data/i }).click();
    await page.waitForTimeout(300);
    await context.setOffline(true);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { level: 1, name: 'Weeknight tomato pasta' })).toBeVisible();
    await expect(page.getByText(/offline — your card still works/i)).toBeVisible();
  } finally {
    await context.close();
  }
});

test('activates the current service worker and accepts an update check', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  try {
    await page.goto('/');
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.reload();
    const workerState = await page.evaluate(async () => {
      const registration = await navigator.serviceWorker.ready;
      await registration.update();
      return {
        controlled: Boolean(navigator.serviceWorker.controller),
        scope: registration.scope,
        caches: await caches.keys(),
      };
    });
    expect(workerState.controlled).toBe(true);
    expect(workerState.scope).toBe('http://127.0.0.1:4173/');
    expect(workerState.caches).toContain('scaled-cook-card-v7');
  } finally {
    await context.close();
  }
});

test('keeps demo data separate from a real card @claim:demo-sandbox', async ({ page }) => {
  await page.evaluate(() => localStorage.setItem('scc:demo-isolation-sentinel', 'real-data'));
  await page.goto('/?demo=1');
  await expect(page).toHaveTitle('Demo — Scaled Cook Card');
  await expect(page.getByLabel('Demo mode')).toContainText('sample data, nothing is saved to your real cook card');
  await expect(page.getByRole('heading', { level: 1, name: 'Weeknight tomato pasta' })).toBeVisible();
  await page.getByLabel('Number of servings').fill('6');
  await page.getByLabel('Number of servings').press('Tab');
  await expect(page.getByText('600 g').first()).toBeVisible();
  const storageKeys = await page.evaluate(() => Object.keys(localStorage));
  expect(storageKeys.some((key) => key.startsWith('demo:scc:'))).toBeTruthy();
  expect(storageKeys.filter((key) => key.startsWith('scc:'))).toEqual(['scc:demo-isolation-sentinel']);
  expect(await page.evaluate(() => localStorage.getItem('scc:demo-isolation-sentinel'))).toBe('real-data');

  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByLabel('Number of servings')).toHaveValue('4');
  expect(await page.evaluate(() => localStorage.getItem('scc:demo-isolation-sentinel'))).toBe('real-data');

  await page.getByRole('button', { name: 'Start for real' }).click();
  await expect(page).toHaveURL(/\/$/);
  expect(await page.evaluate(() => Object.keys(localStorage).some((key) => key.startsWith('demo:scc:')))).toBeFalsy();
  expect(await page.evaluate(() => localStorage.getItem('scc:demo-isolation-sentinel'))).toBe('real-data');
});

test('sends the demo wordmark home without reading demo storage', async ({ page }) => {
  await page.goto('/demo');
  await page.getByLabel('Number of servings').fill('6');
  await page.getByLabel('Number of servings').press('Tab');
  await page.getByRole('link', { name: 'Scaled Cook Card home' }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Scale recipe amounts in every step.' })).toBeVisible();
  expect(await page.evaluate(() => Object.keys(localStorage).some((key) => key.startsWith('demo:scc:')))).toBeFalsy();
});

test('does not send recipe data to another origin @claim:local-only-recipe-data', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.getByRole('button', { name: /try it with sample data/i }).click();
  await page.getByRole('button', { name: /start cook mode/i }).click();
  for (let step = 0; step < 3; step += 1) await page.getByRole('button', { name: /next step/i }).click();
  await page.getByRole('button', { name: /finish & note changes/i }).click();
  await page.getByLabel('Actual yield').fill('4.5');
  await page.getByRole('button', { name: /save to ledger/i }).click();
  expect(requests.every((url) => new URL(url).origin === 'http://127.0.0.1:4173')).toBeTruthy();
});

test('rejects servings below the stated minimum and displays a zero actual yield', async ({ page }) => {
  await page.getByRole('button', { name: /try it with sample data/i }).click();
  await page.getByLabel('Number of servings').fill('0.24');
  await page.getByLabel('Number of servings').press('Tab');
  await expect(page.getByText('Choose a serving count between 0.25 and 999.')).toBeVisible();
  await expect(page.getByLabel('Number of servings')).toHaveValue('4');

  await page.getByRole('button', { name: /start cook mode/i }).click();
  for (let step = 0; step < 3; step += 1) await page.getByRole('button', { name: /next step/i }).click();
  await page.getByRole('button', { name: /finish & note changes/i }).click();
  await page.getByLabel('Actual yield').fill('0');
  await page.getByRole('button', { name: /save to ledger/i }).click();
  await expect(page.getByText(/made 0 servings/i)).toBeVisible();
});

test('returns focus from dialogs and moves focus to the route heading', async ({ page }) => {
  const importButton = page.getByRole('button', { name: /import my recipe/i });
  await importButton.click();
  await page.getByRole('button', { name: 'Close import dialog' }).click();
  await expect(importButton).toBeFocused();

  await page.locator('.site-header').getByRole('link', { name: 'Privacy' }).click();
  await expect(page).toHaveURL(/\/privacy$/);
  const heading = page.getByRole('heading', { level: 1, name: 'Privacy, in plain language' });
  await expect(heading).toBeFocused();
  await expect(page.getByText('Opened Privacy.')).toBeAttached();
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Scale recipe amounts in every step.' })).toBeFocused();
  await expect(page.locator('#route-announcement')).toHaveText('Page changed.');
});

test('keeps focus and announces Privacy when navigating there from the demo', async ({ page }) => {
  await page.goto('/demo');
  await page.locator('.site-header').getByRole('link', { name: 'Privacy' }).click();
  await expect(page).toHaveURL(/\/privacy$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Privacy, in plain language' })).toBeFocused();
  await expect(page.locator('#route-announcement')).toHaveText('Opened Privacy.');
});

test('reflows the demo at a fixed 390px viewport with 200 percent text size', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: false, deviceScaleFactor: 1 });
  const page = await context.newPage();
  try {
    await page.goto('/demo');
    await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
    await expect.poll(() => page.evaluate(() => ({
      viewport: window.innerWidth,
      html: document.documentElement.scrollWidth,
      body: document.body.scrollWidth,
    }))).toEqual({ viewport: 390, html: 390, body: 390 });
    await expect(page.locator('.site-header')).toContainText('Privacy');
    await expect(page.locator('.demo-banner')).toContainText('Start for real');
    await expect(page.locator('.procedure')).toBeVisible();
  } finally {
    await context.close();
  }
});

test('uses accessible mobile targets at 390px', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'Mobile-only regression coverage');
  await page.getByRole('button', { name: /try it with sample data/i }).click();

  for (const locator of [
    page.locator('.wordmark'),
    page.getByRole('button', { name: 'Reset demo' }),
    page.getByRole('button', { name: 'Start for real' }),
    page.locator('.site-footer').getByRole('link', { name: 'Privacy' }),
    page.locator('.site-footer').getByRole('link', { name: 'Terms' }),
  ]) {
    const box = await locator.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(44);
  }
});

test('has no serious accessibility violations in workspace and cook mode', async ({ page }) => {
  await page.getByRole('button', { name: /try it with sample data/i }).click();
  let results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
  await page.getByRole('button', { name: /start cook mode/i }).click();
  results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
});

test('has no serious accessibility violations in dialogs and secondary routes', async ({ page }) => {
  await page.getByRole('button', { name: /import my recipe/i }).click();
  let results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
  await page.getByRole('button', { name: 'Close import dialog' }).click();
  for (const route of ['/privacy', '/terms', '/artwork', '/missing-cook-card']) {
    await page.goto(route);
    results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? '')), route).toEqual([]);
  }
});

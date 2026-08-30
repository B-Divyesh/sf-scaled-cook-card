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

test('legal routes work directly', async ({ page }) => {
  await page.goto('/privacy');
  await expect(page.getByRole('heading', { level: 1, name: 'Privacy, in plain language' })).toBeVisible();
  await expect(page).toHaveTitle('Privacy — Scaled Cook Card');
  await page.goto('/terms');
  await expect(page.getByRole('heading', { level: 1, name: 'Terms of use' })).toBeVisible();
  await expect(page).toHaveTitle('Terms — Scaled Cook Card');
});

test('presents the one-time paid unlock and restore path @claim:kitchen-pass', async ({ page }) => {
  await page.route('https://api.sociobot.in/api/v1/products/scaled-cook-card/verify?license=fixture-license', async (route) => {
    await route.fulfill({ json: { valid: true, reason: 'ok' } });
  });
  await page.getByRole('button', { name: 'Kitchen Pass', exact: true }).click();
  await expect(page.getByText('$9', { exact: true })).toBeVisible();
  const purchaseLink = page.getByRole('link', { name: /buy kitchen pass/i });
  await expect(purchaseLink).toHaveAttribute('href', 'https://api.sociobot.in/api/v1/products/scaled-cook-card/checkout');
  await expect(purchaseLink).toHaveAttribute('target', '_blank');
  await expect(page.getByLabel(/have a license/i)).toBeVisible();
  await page.getByLabel(/have a license/i).fill('fixture-license');
  await page.getByRole('button', { name: 'Verify' }).click();
  await expect(page.getByText('License active')).toBeVisible();
});

test('exports the active recipe as JSON @claim:json-export', async ({ page }) => {
  await page.getByRole('button', { name: /try it with sample data/i }).click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: /export recipe json/i }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('weeknight-tomato-pasta.json');
  const path = await download.path();
  expect(path).not.toBeNull();
  expect(JSON.parse(await readFile(path!, 'utf8'))).toMatchObject({ title: 'Weeknight tomato pasta', servings: 4 });
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
    expect(workerState.caches).toContain('scaled-cook-card-v4');
  } finally {
    await context.close();
  }
});

test('keeps demo data separate from a real card @claim:demo-sandbox', async ({ page }) => {
  await page.goto('/demo');
  await expect(page).toHaveTitle('Demo — Scaled Cook Card');
  await expect(page.getByLabel('Demo mode')).toContainText('sample data, nothing is saved to your real card');
  await expect(page.getByRole('heading', { level: 1, name: 'Weeknight tomato pasta' })).toBeVisible();
  await page.getByLabel('Number of servings').fill('6');
  await page.getByLabel('Number of servings').press('Tab');
  await expect(page.getByText('600 g').first()).toBeVisible();
  const storageKeys = await page.evaluate(() => Object.keys(localStorage));
  expect(storageKeys.some((key) => key.startsWith('demo:scc:'))).toBeTruthy();
  expect(storageKeys.some((key) => key.startsWith('scc:'))).toBeFalsy();
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
});

test('uses accessible mobile targets and reflows at 200 percent text size', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'Mobile-only regression coverage');
  await page.getByRole('button', { name: /try it with sample data/i }).click();
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();

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

test('has no serious accessibility violations on the privacy route', async ({ page }) => {
  await page.goto('/privacy');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
});

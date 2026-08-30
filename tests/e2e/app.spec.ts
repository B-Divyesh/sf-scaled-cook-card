import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

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

test('keeps an in-progress correction when the ready toast expires @claim:actual-yield-correction', async ({ page }) => {
  await page.clock.install();
  await page.getByRole('button', { name: /try it with sample data/i }).click();
  await page.getByRole('button', { name: /start cook mode/i }).click();
  for (let step = 0; step < 3; step += 1) await page.getByRole('button', { name: /next step/i }).click();
  await page.getByRole('button', { name: /finish & note changes/i }).click();

  const actualYield = page.getByLabel('Actual yield');
  await actualYield.fill('5.5');
  await page.getByLabel('Substitutions').fill('Used shallot for garlic');
  // Cross the exact 3.2-second toast boundary from the verifier report.
  await page.clock.fastForward(3_200);
  await expect(actualYield).toHaveValue('5.5');
  await expect(page.getByLabel('Substitutions')).toHaveValue('Used shallot for garlic');

  await page.getByRole('button', { name: /save to ledger/i }).click();
  await expect(page.getByText(/made 5 ½ servings/i)).toBeVisible();
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

test('presents the one-time paid unlock and restore path', async ({ page }) => {
  await page.getByRole('button', { name: 'Kitchen Pass' }).click();
  await expect(page.getByText('$9')).toBeVisible();
  await expect(page.getByRole('link', { name: /buy kitchen pass/i })).toHaveAttribute('href', 'https://api.sociobot.in/api/v1/products/scaled-cook-card/checkout');
  await expect(page.getByLabel(/have a license/i)).toBeVisible();
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

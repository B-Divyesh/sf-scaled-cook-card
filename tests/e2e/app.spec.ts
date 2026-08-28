import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('imports sample, scales amounts, cooks with keyboard, and saves a correction', async ({ page }) => {
  await page.getByRole('button', { name: /cook the sample/i }).click();
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
  await page.goto('/terms');
  await expect(page.getByRole('heading', { level: 1, name: 'Terms of use' })).toBeVisible();
});

test('presents the one-time paid unlock and restore path', async ({ page }) => {
  await page.getByRole('button', { name: 'Kitchen Pass' }).click();
  await expect(page.getByText('$9')).toBeVisible();
  await expect(page.getByRole('link', { name: /buy kitchen pass/i })).toHaveAttribute('href', 'https://api.sociobot.in/api/v1/products/scaled-cook-card/checkout');
  await expect(page.getByLabel(/have a license/i)).toBeVisible();
});

test('reloads a saved card offline', async ({ page, context }) => {
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await page.getByRole('button', { name: /cook the sample/i }).click();
  await page.waitForTimeout(300);
  await context.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { level: 1, name: 'Weeknight tomato pasta' })).toBeVisible();
  await expect(page.getByText(/offline — your card still works/i)).toBeVisible();
});

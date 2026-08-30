import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdirSync, writeFileSync } from 'node:fs';

const base = 'https://scaled-cook-card.sociobot.in';
const evidenceDir = '.factory/evidence-verification-4';
mkdirSync(evidenceDir, { recursive: true });

const checks = [];
const observations = {};
const record = (name, pass, detail) => checks.push({ name, pass: Boolean(pass), detail });
const serious = (result) => result.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''));

const browser = await chromium.launch({ headless: true });
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  const requests = [];
  const consoleErrors = [];
  const pageErrors = [];
  page.on('request', (request) => requests.push({ url: request.url(), method: request.method(), resourceType: request.resourceType() }));
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', (error) => pageErrors.push(error.message));

  const rootResponse = await page.goto(base, { waitUntil: 'networkidle' });
  const heading = (await page.locator('h1').innerText()).replace(/\s+/g, ' ').trim();
  const lede = (await page.locator('.lede').innerText()).replace(/\s+/g, ' ').trim();
  const demoButton = await page.getByRole('button', { name: /try it with sample data/i }).count();
  const hero = await page.locator('.hero-figure img').evaluate((img) => ({ complete: img.complete, naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight }));
  observations.firstRead = { heading, lede, demoButton, hero };
  record('cold first screen states the job', heading === 'Scale recipe amounts in every step.', heading);
  record('cold first screen identifies the user', lede.includes('home cooks') && lede.includes('hands are busy'), lede);
  record('cold first screen has one-click sample demo', demoButton === 1, `matching actions: ${demoButton}`);
  record('hero image loads', hero.complete && hero.naturalWidth > 0, JSON.stringify(hero));
  record('root response is 200', rootResponse?.status() === 200, String(rootResponse?.status()));
  observations.rootHeaders = await rootResponse?.allHeaders();
  await page.screenshot({ path: `${evidenceDir}/live-desktop-cold.png`, fullPage: true });

  await page.keyboard.press('Tab');
  const firstFocus = await page.evaluate(() => ({ text: document.activeElement?.textContent?.trim(), href: document.activeElement?.getAttribute('href') }));
  record('first Tab reaches skip link', firstFocus.href === '#main', JSON.stringify(firstFocus));
  await page.keyboard.press('Tab');
  const focusStyle = await page.evaluate(() => {
    const element = document.activeElement;
    if (!(element instanceof HTMLElement)) return null;
    const style = getComputedStyle(element);
    return { tag: element.tagName, text: element.textContent?.trim(), outline: style.outline, outlineColor: style.outlineColor, outlineWidth: style.outlineWidth };
  });
  record('keyboard focus is visibly styled', Number.parseFloat(focusStyle?.outlineWidth ?? '0') >= 3, JSON.stringify(focusStyle));

  const landingAxe = await new AxeBuilder({ page }).analyze();
  record('landing has zero serious or critical axe findings', serious(landingAxe).length === 0, JSON.stringify(serious(landingAxe).map((v) => ({ id: v.id, impact: v.impact }))));

  await page.getByRole('button', { name: /try it with sample data/i }).click();
  await page.waitForURL(`${base}/demo`);
  record('demo opens ready sample in one click', await page.getByRole('heading', { level: 1, name: 'Weeknight tomato pasta' }).isVisible(), page.url());
  record('demo banner persists', await page.getByLabel('Demo mode').isVisible(), (await page.getByLabel('Demo mode').innerText()).replace(/\s+/g, ' ').trim());

  const servings = page.getByLabel('Number of servings');
  await servings.fill('6');
  await servings.press('Tab');
  record('normal scaling updates bound values', (await page.locator('.ingredient-list').innerText()).includes('600 g') && (await page.locator('.step-list').innerText()).includes('600 g'), '6 servings -> 600 g in list and steps');
  await servings.fill('0.25');
  await servings.press('Tab');
  record('minimum serving boundary works', (await page.locator('.ingredient-list').innerText()).includes('25 g'), `input=${await servings.inputValue()}`);
  await servings.fill('999');
  await servings.press('Tab');
  record('maximum serving boundary works', await servings.inputValue() === '999', `input=${await servings.inputValue()}`);
  await servings.fill('1000');
  await servings.press('Tab');
  record('out-of-range serving recovers', await servings.inputValue() === '999' && await page.getByText('Choose a serving count between 0.25 and 999.').isVisible(), `input=${await servings.inputValue()}`);

  const demoKeys = await page.evaluate(() => Object.keys(localStorage));
  record('demo writes only its isolated namespace', demoKeys.length > 0 && demoKeys.every((key) => key.startsWith('demo:scc:')), demoKeys.join(', '));

  await page.getByRole('button', { name: /start cook mode/i }).focus();
  await page.keyboard.press('Enter');
  await page.getByRole('heading', { name: 'Step 1 of 4' }).waitFor({ state: 'visible' });
  record('cook mode starts from keyboard', await page.getByRole('heading', { name: 'Step 1 of 4' }).isVisible(), 'Step 1 visible');
  const cookAxe = await new AxeBuilder({ page }).analyze();
  record('cook dialog has zero serious or critical axe findings', serious(cookAxe).length === 0, JSON.stringify(serious(cookAxe).map((v) => ({ id: v.id, impact: v.impact }))));
  await page.keyboard.press('ArrowRight');
  record('ArrowRight advances cooking', await page.getByRole('heading', { name: 'Step 2 of 4' }).isVisible(), 'Step 2 visible');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.getByLabel('Actual yield').fill('5.5');
  await page.getByLabel('Substitutions').fill('Used shallot for garlic');
  await page.getByLabel('Notes for next time').fill('Reduce simmer by two minutes');
  await page.getByRole('button', { name: /save to ledger/i }).click();
  record('post-cook correction saves actual yield', await page.getByText(/made 5 ½ servings/i).isVisible(), (await page.locator('.latest-note').innerText()).replace(/\s+/g, ' ').trim());
  const savedRecords = await page.evaluate(() => JSON.parse(localStorage.getItem('demo:scc:cook-records') ?? '[]'));
  record('post-cook notes persist in demo storage', savedRecords[0]?.notes === 'Reduce simmer by two minutes', JSON.stringify(savedRecords[0]));

  const workspaceAxe = await new AxeBuilder({ page }).analyze();
  record('workspace has zero serious or critical axe findings', serious(workspaceAxe).length === 0, JSON.stringify(serious(workspaceAxe).map((v) => ({ id: v.id, impact: v.impact }))));

  await page.screenshot({ path: `${evidenceDir}/live-desktop-workspace.png`, fullPage: true });
  await page.getByRole('button', { name: 'Reset demo' }).click();
  const resetRecords = await page.evaluate(() => JSON.parse(localStorage.getItem('demo:scc:cook-records') ?? '[]'));
  record('Reset demo restores the shipped sample', await page.getByLabel('Number of servings').inputValue() === '4' && resetRecords.length === 0, `servings=${await page.getByLabel('Number of servings').inputValue()} records=${resetRecords.length}`);
  await page.getByRole('button', { name: 'Start for real' }).click();
  await page.waitForURL(`${base}/`);
  const afterDemoKeys = await page.evaluate(() => Object.keys(localStorage));
  record('Start for real discards demo data', await page.getByRole('heading', { level: 1, name: 'Scale recipe amounts in every step.' }).isVisible() && afterDemoKeys.every((key) => !key.startsWith('demo:scc:')), JSON.stringify(afterDemoKeys));

  const outbound = requests.filter((item) => new URL(item.url).origin !== base);
  record('demo cooking flow has no cross-origin requests', outbound.length === 0, JSON.stringify(outbound));
  record('live flow has no console errors', consoleErrors.length === 0, JSON.stringify(consoleErrors));
  record('live flow has no page errors', pageErrors.length === 0, JSON.stringify(pageErrors));
  observations.requests = requests;
  observations.consoleErrors = consoleErrors;
  observations.pageErrors = pageErrors;
  await context.close();

  const importContext = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const importPage = await importContext.newPage();
  const importErrors = [];
  importPage.on('console', (message) => { if (message.type() === 'error') importErrors.push(message.text()); });
  await importPage.goto(base, { waitUntil: 'networkidle' });
  await importPage.evaluate(() => localStorage.clear());
  await importPage.reload({ waitUntil: 'networkidle' });
  await importPage.getByRole('button', { name: /import my recipe/i }).click();
  await importPage.getByLabel('Recipe YAML or JSON').fill('title: Broken');
  await importPage.getByRole('button', { name: /make cook card/i }).click();
  await importPage.getByRole('dialog', { name: 'Import your recipe' }).waitFor({ state: 'visible' });
  record('invalid import explains recovery', await importPage.getByText(/servings must be a number/i).isVisible() && await importPage.getByRole('dialog', { name: 'Import your recipe' }).isVisible(), (await importPage.locator('#import-error').innerText()).trim());
  const recipe = JSON.stringify({
    title: 'Boundary soup',
    servings: 4,
    ingredients: [
      { id: 'spice', name: 'paprika', quantity: '3/16', unit: 'tsp' },
      { id: 'stock', name: 'stock', quantity: '1 1/2', unit: 'cups' },
    ],
    steps: [
      { text: 'Bloom {{spice}}.' },
      { text: 'Add the liquid.', ingredients: ['stock'] },
    ],
  });
  await importPage.getByLabel('Recipe YAML or JSON').fill(recipe);
  await importPage.getByRole('button', { name: /make cook card/i }).click();
  record('valid recovery import renders inline and list bindings', (await importPage.locator('.step-list').innerText()).includes('3/16 tsp paprika') && (await importPage.locator('.step-list').innerText()).includes('1 ½ cups stock'), (await importPage.locator('.step-list').innerText()).replace(/\s+/g, ' ').trim());
  await importPage.getByLabel('Number of servings').fill('8');
  await importPage.getByLabel('Number of servings').press('Tab');
  record('fraction import scales without approximation', (await importPage.locator('.ingredient-list').innerText()).includes('⅜ tsp') && (await importPage.locator('.step-list').innerText()).includes('⅜ tsp'), (await importPage.locator('.ingredient-list').innerText()).replace(/\s+/g, ' ').trim());
  record('import recovery has no console errors', importErrors.length === 0, JSON.stringify(importErrors));
  await importContext.close();

  const licenseContext = await browser.newContext();
  const licensePage = await licenseContext.newPage();
  let interceptedVerification = '';
  await licensePage.route('https://api.sociobot.in/api/v1/products/scaled-cook-card/verify?license=fixture-return-license', async (route) => {
    interceptedVerification = route.request().url();
    await route.fulfill({ json: { valid: true, reason: 'ok' } });
  });
  await licensePage.goto(`${base}/?license=fixture-return-license`, { waitUntil: 'networkidle' });
  const capturedToken = await licensePage.evaluate(() => localStorage.getItem('sb_license:scaled-cook-card'));
  record('return license is stored, scrubbed, and fixture-verified', licensePage.url() === `${base}/` && capturedToken === 'fixture-return-license' && interceptedVerification.endsWith('license=fixture-return-license') && await licensePage.getByRole('button', { name: 'Kitchen Pass active' }).isVisible(), `url=${licensePage.url()} token=${capturedToken} intercepted=${interceptedVerification}`);
  await licenseContext.close();

  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: false });
  const mobilePage = await mobileContext.newPage();
  const mobileErrors = [];
  mobilePage.on('console', (message) => { if (message.type() === 'error') mobileErrors.push(message.text()); });
  await mobilePage.goto(`${base}/demo`, { waitUntil: 'networkidle' });
  await mobilePage.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  const reflow = await mobilePage.evaluate(() => ({ viewport: innerWidth, html: document.documentElement.scrollWidth, body: document.body.scrollWidth }));
  record('390px at 200% text has no horizontal overflow', reflow.viewport === 390 && reflow.html === 390 && reflow.body === 390, JSON.stringify(reflow));
  await mobilePage.evaluate(() => { document.documentElement.style.fontSize = ''; });
  const undersized = await mobilePage.locator('a, button, input, select, textarea').evaluateAll((elements) => elements
    .filter((element) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden';
    })
    .map((element) => {
      const rect = element.getBoundingClientRect();
      return { tag: element.tagName, text: element.getAttribute('aria-label') ?? element.textContent?.trim() ?? '', width: Math.round(rect.width), height: Math.round(rect.height) };
    })
    .filter((item) => item.width < 44 || item.height < 44));
  observations.undersizedMobileTargets = undersized;
  record('visible mobile controls meet 44px touch target', undersized.length === 0, JSON.stringify(undersized));
  record('mobile flow has no console errors', mobileErrors.length === 0, JSON.stringify(mobileErrors));
  await mobilePage.screenshot({ path: `${evidenceDir}/live-mobile-demo.png`, fullPage: true });
  await mobileContext.close();

  const reducedContext = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 390, height: 844 } });
  const reducedPage = await reducedContext.newPage();
  await reducedPage.goto(`${base}/demo`, { waitUntil: 'networkidle' });
  const motion = await reducedPage.evaluate(() => {
    const targets = Array.from(document.querySelectorAll('*'));
    return targets.map((element) => {
      const style = getComputedStyle(element);
      return { tag: element.tagName, transition: style.transitionDuration, animation: style.animationDuration, name: style.animationName };
    }).filter((item) => item.name !== 'none' || item.transition.split(',').some((duration) => Number.parseFloat(duration) > 0.02) || item.animation.split(',').some((duration) => Number.parseFloat(duration) > 0.02));
  });
  record('reduced motion removes material animation and transitions', motion.length === 0, JSON.stringify(motion.slice(0, 10)));
  await reducedContext.close();

  const offlineContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const offlinePage = await offlineContext.newPage();
  await offlinePage.goto(`${base}/demo`, { waitUntil: 'networkidle' });
  await offlinePage.evaluate(() => navigator.serviceWorker.ready);
  await offlinePage.reload({ waitUntil: 'networkidle' });
  const worker = await offlinePage.evaluate(async () => {
    const registration = await navigator.serviceWorker.ready;
    await registration.update();
    return { controlled: Boolean(navigator.serviceWorker.controller), scope: registration.scope, caches: await caches.keys() };
  });
  record('live service worker controls the page', worker.controlled && worker.scope === `${base}/`, JSON.stringify(worker));
  record('live service worker uses candidate cache version', worker.caches.includes('scaled-cook-card-v5'), JSON.stringify(worker.caches));
  await offlineContext.setOffline(true);
  await offlinePage.reload({ waitUntil: 'domcontentloaded' });
  record('live demo reloads offline', await offlinePage.getByRole('heading', { level: 1, name: 'Weeknight tomato pasta' }).isVisible() && await offlinePage.getByText(/offline — your card still works/i).isVisible(), offlinePage.url());
  await offlineContext.close();

  const legalContext = await browser.newContext();
  const legalPage = await legalContext.newPage();
  for (const route of ['/privacy', '/terms']) {
    const response = await legalPage.goto(`${base}${route}`, { waitUntil: 'networkidle' });
    const h1Count = await legalPage.locator('h1').count();
    record(`${route} route is direct and semantic`, response?.status() === 200 && h1Count === 1 && await legalPage.locator('main').count() === 1, `status=${response?.status()} title=${await legalPage.title()} h1=${h1Count}`);
  }
  const privacyAxe = await new AxeBuilder({ page: legalPage }).analyze();
  record('legal page has zero serious or critical axe findings', serious(privacyAxe).length === 0, JSON.stringify(serious(privacyAxe).map((v) => ({ id: v.id, impact: v.impact }))));
  const crawledLinks = new Set();
  for (const route of ['/', '/demo', '/privacy', '/terms']) {
    await legalPage.goto(`${base}${route}`, { waitUntil: 'networkidle' });
    const links = await legalPage.locator('a[href]').evaluateAll((anchors) => anchors.map((anchor) => anchor.href));
    links.filter((href) => new URL(href).origin === base).forEach((href) => crawledLinks.add(href));
  }
  const linkResults = [];
  for (const href of crawledLinks) {
    const response = await legalContext.request.get(href);
    linkResults.push({ href, status: response.status() });
  }
  record('all rendered same-origin links resolve', linkResults.every((item) => item.status >= 200 && item.status < 400), JSON.stringify(linkResults));
  const missingResponse = await legalPage.goto(`${base}/definitely-missing-verification-4`, { waitUntil: 'networkidle' });
  record('unknown URL returns designed 404', missingResponse?.status() === 404 && await legalPage.getByRole('heading', { level: 1, name: 'That cook card page is missing.' }).isVisible(), `status=${missingResponse?.status()}`);
  await legalContext.close();
} finally {
  await browser.close();
}

const result = { testedAt: new Date().toISOString(), base, checks, observations, passed: checks.every((check) => check.pass) };
writeFileSync(`${evidenceDir}/live-browser.json`, `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify(result, null, 2));
process.exitCode = result.passed ? 0 : 1;

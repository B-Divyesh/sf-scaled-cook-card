import { existsSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { describe, expect, it } from 'vitest';

interface StaticWebAppsConfig {
  routes: Array<{ route: string; rewrite?: string; headers?: Record<string, string> }>;
  globalHeaders: Record<string, string>;
  responseOverrides: Record<string, { rewrite: string }>;
}

const config = JSON.parse(readFileSync(new URL('../public/staticwebapp.config.json', import.meta.url), 'utf8')) as StaticWebAppsConfig;
const immutableCache = 'public, max-age=31536000, immutable';

describe('Azure Static Web Apps cache policy', () => {
  it('uses immutable one-year caching for fingerprinted build assets @claim:versioned-asset-cache', () => {
    expect(config.routes.find((rule) => rule.route === '/assets/*')?.headers?.['Cache-Control']).toBe(immutableCache);
  });

  it('uses immutable caching only with explicit versioned hero-art URLs', () => {
    for (const route of ['/hero-notebook-v1-768.webp', '/hero-notebook-v1-1280.webp', '/hero-notebook-v1-1280.avif']) {
      expect(config.routes.find((rule) => rule.route === route)?.headers?.['Cache-Control']).toBe(immutableCache);
    }
  });
});

describe('Azure Static Web Apps response policy', () => {
  it('keeps the deployed response policy explicit and local-first', () => {
    expect(config.globalHeaders['X-Content-Type-Options']).toBe('nosniff');
    expect(config.globalHeaders['Referrer-Policy']).toBe('strict-origin-when-cross-origin');
    expect(config.globalHeaders['Permissions-Policy']).toContain('camera=()');
    expect(config.globalHeaders['Content-Security-Policy']).toContain("default-src 'self'");
    expect(config.globalHeaders['Content-Security-Policy']).toContain("frame-ancestors 'none'");
    expect(config.globalHeaders['Content-Security-Policy']).toContain('connect-src \'self\' https://api.sociobot.in');
  });

  it('keeps direct product routes and an actual 404 response explicit', () => {
    for (const route of ['/demo', '/privacy', '/terms', '/artwork']) {
      expect(config.routes.find((rule) => rule.route === route)?.rewrite).toBe('/index.html');
    }
    expect(config.responseOverrides['404']?.rewrite).toBe('/404.html');
  });
});

describe('site discovery and social assets', () => {
  it('ships canonical, social, crawler, and touch-icon metadata', () => {
    const index = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
    expect(index).toContain('rel="canonical"');
    expect(index).toContain('property="og:image"');
    expect(index).toContain('name="twitter:card"');
    expect(index).toContain('rel="apple-touch-icon"');
    expect(readFileSync(new URL('../public/robots.txt', import.meta.url), 'utf8')).toContain('Sitemap:');
    expect(readFileSync(new URL('../public/sitemap.xml', import.meta.url), 'utf8')).toContain('<loc>https://scaled-cook-card.sociobot.in/demo</loc>');
    const notFound = readFileSync(new URL('../public/404.html', import.meta.url), 'utf8');
    expect(notFound).toContain('<h1>That cook card page is missing.</h1>');
    expect(notFound).toContain('property="og:title"');
    expect(notFound).toContain('property="og:description"');
    expect(notFound).toContain('property="og:image"');
    expect(notFound).toContain('name="twitter:card"');
    expect(notFound).toContain('2026.09.01-polish.1');
  });

  it('ships a real 1200 by 630 social image and a 180 pixel touch icon', async () => {
    const social = new URL('../public/social-card.jpg', import.meta.url);
    const touchIcon = new URL('../public/apple-touch-icon.png', import.meta.url);
    expect(existsSync(social)).toBe(true);
    expect(existsSync(touchIcon)).toBe(true);
    expect(statSync(social).size).toBeGreaterThan(10_000);
    expect(statSync(touchIcon).size).toBeGreaterThan(1_000);
    await expect(sharp(fileURLToPath(social)).metadata()).resolves.toMatchObject({ width: 1200, height: 630 });
    await expect(sharp(fileURLToPath(touchIcon)).metadata()).resolves.toMatchObject({ width: 180, height: 180 });
  });
});

describe('public implementation claims', () => {
  it('registers each public claim with exactly one tagged test', () => {
    const claims = JSON.parse(readFileSync(new URL('../.factory/claims.json', import.meta.url), 'utf8')) as Array<{ id: string; test: string }>;
    const testSource = [
      readFileSync(new URL('./recipe.test.ts', import.meta.url), 'utf8'),
      readFileSync(new URL('./deployment.test.ts', import.meta.url), 'utf8'),
      readFileSync(new URL('./e2e/app.spec.ts', import.meta.url), 'utf8'),
    ].join('\n');
    for (const claim of claims) {
      const tag = new RegExp(`@claim:${claim.id}(?![-\\w])`, 'g');
      expect(testSource.match(tag)?.length ?? 0, claim.id).toBe(1);
    }
  });

  it('retains artwork provenance and its original source record @claim:art-provenance', () => {
    const design = readFileSync(new URL('../.factory/design.md', import.meta.url), 'utf8');
    const metadata = readFileSync(new URL('../assets/src/hero-notebook.prompt.json', import.meta.url), 'utf8');
    expect(design).toContain('Azure image deployment');
    expect(design).toContain('public/hero-notebook-v1-1280.webp');
    expect(metadata).toContain('Azure AI Foundry');
    expect(existsSync(new URL('../assets/src/hero-notebook.png', import.meta.url))).toBe(true);
  });

  it('contains no payment-provider SDK or payment product id @claim:payment-integration', () => {
    const source = [
      readFileSync(new URL('../src/license.ts', import.meta.url), 'utf8'),
      readFileSync(new URL('../src/main.ts', import.meta.url), 'utf8'),
      readFileSync(new URL('../package.json', import.meta.url), 'utf8'),
    ].join('\n');
    expect(source).not.toMatch(/stripe|paypal|braintree|dodo[_-]?product/i);
    expect(source).toContain('https://api.sociobot.in/api/v1/products/${PRODUCT_SLUG}/checkout');
  });
});

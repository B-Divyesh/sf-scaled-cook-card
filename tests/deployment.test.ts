import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

interface StaticWebAppsConfig {
  routes: Array<{ route: string; headers?: Record<string, string> }>;
}

const config = JSON.parse(readFileSync(new URL('../public/staticwebapp.config.json', import.meta.url), 'utf8')) as StaticWebAppsConfig;
const immutableCache = 'public, max-age=31536000, immutable';

describe('Azure Static Web Apps cache policy', () => {
  it('uses immutable one-year caching for fingerprinted build assets', () => {
    expect(config.routes.find((rule) => rule.route === '/assets/*')?.headers?.['Cache-Control']).toBe(immutableCache);
  });

  it('uses immutable caching only with explicit versioned hero-art URLs', () => {
    for (const route of ['/hero-notebook-v1-768.webp', '/hero-notebook-v1-1280.webp', '/hero-notebook-v1-1280.avif']) {
      expect(config.routes.find((rule) => rule.route === route)?.headers?.['Cache-Control']).toBe(immutableCache);
    }
  });
});

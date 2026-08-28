import type { LicenseState } from './types';

export const PRODUCT_SLUG = 'scaled-cook-card';
export const CHECKOUT_URL = `https://api.sociobot.in/api/v1/products/${PRODUCT_SLUG}/checkout`;
const TOKEN_KEY = `sb_license:${PRODUCT_SLUG}`;
const VERDICT_KEY = `sb_license_verdict:${PRODUCT_SLUG}`;
const DAY = 86_400_000;

interface CachedVerdict { valid: boolean; checkedAt: number; token: string }

export function captureLicenseFromUrl(): boolean {
  const url = new URL(location.href);
  const token = url.searchParams.get('license');
  if (!token) return false;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.removeItem(VERDICT_KEY);
  url.searchParams.delete('license');
  history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
  return true;
}

export function storeLicense(token: string): void {
  localStorage.setItem(TOKEN_KEY, token.trim());
  localStorage.removeItem(VERDICT_KEY);
}

export function clearLicense(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(VERDICT_KEY);
}

export function cachedLicenseState(): LicenseState {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return { token: null, valid: false, checking: false, message: '' };
  try {
    const cached = JSON.parse(localStorage.getItem(VERDICT_KEY) ?? 'null') as CachedVerdict | null;
    if (cached?.token === token && cached.valid) return { token, valid: true, checking: false, message: 'Kitchen Pass active' };
  } catch { /* verify below */ }
  return { token, valid: false, checking: false, message: 'Checking license…' };
}

export async function verifyLicense(force = false): Promise<LicenseState> {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return { token: null, valid: false, checking: false, message: '' };
  try {
    const cached = JSON.parse(localStorage.getItem(VERDICT_KEY) ?? 'null') as CachedVerdict | null;
    if (!force && cached?.token === token && Date.now() - cached.checkedAt < DAY) {
      return { token, valid: cached.valid, checking: false, message: cached.valid ? 'Kitchen Pass active' : 'License no longer active' };
    }
  } catch { /* request a fresh verdict */ }
  try {
    const response = await fetch(`https://api.sociobot.in/api/v1/products/${PRODUCT_SLUG}/verify?license=${encodeURIComponent(token)}`);
    if (!response.ok) throw new Error('Verification service unavailable');
    const result = await response.json() as { valid?: boolean };
    const valid = result.valid === true;
    localStorage.setItem(VERDICT_KEY, JSON.stringify({ valid, checkedAt: Date.now(), token } satisfies CachedVerdict));
    return { token, valid, checking: false, message: valid ? 'Kitchen Pass active' : 'License no longer active' };
  } catch {
    const cached = cachedLicenseState();
    return { ...cached, message: cached.valid ? 'Kitchen Pass active — offline' : 'Could not verify yet. The free card still works.' };
  }
}

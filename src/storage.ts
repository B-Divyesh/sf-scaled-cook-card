import type { CookRecord, Recipe } from './types';

const ACTIVE_KEY = 'scc:active-recipe';
const SERVINGS_KEY = 'scc:target-servings';
const LIBRARY_KEY = 'scc:recipe-library';
const RECORDS_KEY = 'scc:cook-records';

function read<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) as T : fallback;
  } catch {
    return fallback;
  }
}

export function getActiveRecipe(): Recipe | null { return read<Recipe | null>(ACTIVE_KEY, null); }
export function saveActiveRecipe(recipe: Recipe | null): void {
  if (recipe) localStorage.setItem(ACTIVE_KEY, JSON.stringify(recipe));
  else localStorage.removeItem(ACTIVE_KEY);
}
export function getTargetServings(fallback: number): number { return read<number>(SERVINGS_KEY, fallback); }
export function saveTargetServings(value: number): void { localStorage.setItem(SERVINGS_KEY, JSON.stringify(value)); }
export function getLibrary(): Recipe[] { return read<Recipe[]>(LIBRARY_KEY, []); }
export function saveLibrary(recipes: Recipe[]): void { localStorage.setItem(LIBRARY_KEY, JSON.stringify(recipes)); }
export function getCookRecords(): CookRecord[] { return read<CookRecord[]>(RECORDS_KEY, []); }
export function saveCookRecords(records: CookRecord[]): void { localStorage.setItem(RECORDS_KEY, JSON.stringify(records)); }

export function upsertLibrary(recipe: Recipe): Recipe[] {
  const library = getLibrary();
  const next = [recipe, ...library.filter((item) => item.id !== recipe.id)];
  saveLibrary(next);
  return next;
}

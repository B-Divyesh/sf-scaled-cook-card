import type { CookRecord, Recipe } from './types';

let namespace = 'scc:';

function key(name: string): string { return `${namespace}${name}`; }

export function setStorageNamespace(nextNamespace: string): void { namespace = nextNamespace; }

export function clearStorageNamespace(): void {
  for (let index = localStorage.length - 1; index >= 0; index -= 1) {
    const storedKey = localStorage.key(index);
    if (storedKey?.startsWith(namespace)) localStorage.removeItem(storedKey);
  }
}

function read<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) as T : fallback;
  } catch {
    return fallback;
  }
}

export function getActiveRecipe(): Recipe | null { return read<Recipe | null>(key('active-recipe'), null); }
export function saveActiveRecipe(recipe: Recipe | null): void {
  if (recipe) localStorage.setItem(key('active-recipe'), JSON.stringify(recipe));
  else localStorage.removeItem(key('active-recipe'));
}
export function getTargetServings(fallback: number): number { return read<number>(key('target-servings'), fallback); }
export function saveTargetServings(value: number): void { localStorage.setItem(key('target-servings'), JSON.stringify(value)); }
export function getLibrary(): Recipe[] { return read<Recipe[]>(key('recipe-library'), []); }
export function saveLibrary(recipes: Recipe[]): void { localStorage.setItem(key('recipe-library'), JSON.stringify(recipes)); }
export function getCookRecords(): CookRecord[] { return read<CookRecord[]>(key('cook-records'), []); }
export function saveCookRecords(records: CookRecord[]): void { localStorage.setItem(key('cook-records'), JSON.stringify(records)); }

export function upsertLibrary(recipe: Recipe): Recipe[] {
  const library = getLibrary();
  const next = [recipe, ...library.filter((item) => item.id !== recipe.id)];
  saveLibrary(next);
  return next;
}

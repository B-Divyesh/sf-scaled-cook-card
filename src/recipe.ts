import { load } from 'js-yaml';
import type { Ingredient, Recipe, RecipeStep } from './types';

const FRACTIONS: Array<[number, string]> = [
  [1 / 8, '⅛'], [1 / 6, '⅙'], [1 / 4, '¼'], [1 / 3, '⅓'],
  [3 / 8, '⅜'], [1 / 2, '½'], [5 / 8, '⅝'], [2 / 3, '⅔'],
  [3 / 4, '¾'], [5 / 6, '⅚'], [7 / 8, '⅞'],
];

// These denominators cover the fractions cooks commonly write by hand while
// still leaving ordinary decimals alone.  The previous formatter accepted a
// 0.025 difference, which changed 3/16 into 1/6.  A displayed fraction must
// therefore be the value (within floating-point noise), never merely nearby.
const FRACTION_DENOMINATORS = [2, 3, 4, 6, 8, 16, 32, 64];
const FRACTION_EPSILON = 0.001;

const unicodeFractions: Record<string, number> = {
  '⅛': 1 / 8, '⅙': 1 / 6, '¼': 1 / 4, '⅓': 1 / 3, '⅜': 3 / 8,
  '½': 1 / 2, '⅝': 5 / 8, '⅔': 2 / 3, '¾': 3 / 4, '⅚': 5 / 6, '⅞': 7 / 8,
};

export const sampleRecipe = `title: Weeknight tomato pasta
servings: 4
ingredients:
  - id: pasta
    name: dried pasta
    quantity: 400
    unit: g
  - id: tomatoes
    name: crushed tomatoes
    quantity: 800
    unit: g
  - id: oil
    name: olive oil
    quantity: 2
    unit: tbsp
  - id: garlic
    name: garlic
    quantity: 3
    unit: cloves
  - id: salt
    name: fine salt
    quantity: 1
    unit: tsp
steps:
  - text: Bring a large pot of water to a boil. Add {{salt}}.
  - text: Warm {{oil}} in a wide pan. Add {{garlic}} and cook until fragrant.
  - text: Stir in {{tomatoes}} and simmer for 12 minutes.
  - text: Cook {{pasta}} until just tender, then toss through the sauce.
`;

export function parseQuantity(value: unknown, path: string): number {
  if (typeof value === 'number' && Number.isFinite(value) && value >= 0) return value;
  if (typeof value !== 'string') throw new Error(`${path} must be a number or fraction.`);
  const raw = value.trim();
  const unicode = raw.match(/^(\d+)?\s*([⅛⅙¼⅓⅜½⅝⅔¾⅚⅞])$/u);
  if (unicode?.[2]) return Number(unicode[1] || 0) + (unicodeFractions[unicode[2]] ?? 0);
  const mixed = raw.match(/^(?:(\d+)\s+)?(\d+)\/(\d+)$/);
  if (mixed?.[2] && mixed[3]) {
    const denominator = Number(mixed[3]);
    if (!denominator) throw new Error(`${path} has a zero denominator.`);
    return Number(mixed[1] || 0) + Number(mixed[2]) / denominator;
  }
  const numeric = Number(raw);
  if (Number.isFinite(numeric) && numeric >= 0) return numeric;
  throw new Error(`${path} must be a positive number or fraction such as 1 1/2.`);
}

function cleanId(value: unknown, fallback: string): string {
  const id = String(value ?? fallback).trim().toLowerCase().replace(/[^a-z0-9_-]+/g, '-');
  return id || fallback;
}

export function parseRecipe(source: string): Recipe {
  if (!source.trim()) throw new Error('Paste a JSON or YAML recipe first.');
  let raw: unknown;
  try {
    raw = load(source);
  } catch (error) {
    const detail = error instanceof Error ? error.message.split('\n')[0] : 'The file could not be read.';
    throw new Error(`That YAML or JSON is not valid. ${detail}`);
  }
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('The recipe must be an object with title, servings, ingredients, and steps.');
  const value = raw as Record<string, unknown>;
  const title = String(value.title ?? '').trim();
  if (!title) throw new Error('Add a recipe title.');
  const servings = parseQuantity(value.servings, 'Servings');
  if (servings <= 0) throw new Error('Servings must be greater than zero.');
  if (!Array.isArray(value.ingredients) || value.ingredients.length === 0) throw new Error('Add at least one ingredient.');
  if (!Array.isArray(value.steps) || value.steps.length === 0) throw new Error('Add at least one preparation step.');

  const seen = new Set<string>();
  const ingredients: Ingredient[] = value.ingredients.map((item, index) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) throw new Error(`Ingredient ${index + 1} must be an object.`);
    const entry = item as Record<string, unknown>;
    const name = String(entry.name ?? '').trim();
    if (!name) throw new Error(`Ingredient ${index + 1} needs a name.`);
    const id = cleanId(entry.id, name);
    if (seen.has(id)) throw new Error(`Ingredient id “${id}” is used more than once.`);
    seen.add(id);
    return {
      id,
      name,
      quantity: parseQuantity(entry.quantity, `Quantity for ${name}`),
      unit: String(entry.unit ?? '').trim(),
      ...(entry.note ? { note: String(entry.note).trim() } : {}),
    };
  });

  const steps: RecipeStep[] = value.steps.map((item, index) => {
    if (typeof item === 'string') return { text: item.trim() };
    if (!item || typeof item !== 'object' || Array.isArray(item)) throw new Error(`Step ${index + 1} must be text or an object.`);
    const entry = item as Record<string, unknown>;
    const text = String(entry.text ?? '').trim();
    if (!text) throw new Error(`Step ${index + 1} needs text.`);
    const bindings = Array.isArray(entry.ingredients) ? entry.ingredients.map(String) : undefined;
    return { text, ...(bindings ? { ingredients: bindings } : {}) };
  });

  const referenced = steps.flatMap((step) => [
    ...Array.from(step.text.matchAll(/\{\{\s*([\w-]+)\s*\}\}/g), (match) => match[1] ?? ''),
    ...(step.ingredients ?? []),
  ]);
  const unknown = referenced.find((id) => !seen.has(id));
  if (unknown) throw new Error(`A step refers to “${unknown}”, but no ingredient has that id.`);

  const canonical = JSON.stringify({ title, servings, ingredients, steps });
  let hash = 2166136261;
  for (let i = 0; i < canonical.length; i += 1) hash = Math.imul(hash ^ canonical.charCodeAt(i), 16777619);
  return { id: `recipe-${(hash >>> 0).toString(36)}`, title, servings, ingredients, steps };
}

export function formatQuantity(value: number): string {
  if (!Number.isFinite(value)) return '—';
  if (value === 0) return '0';
  const whole = Math.floor(value);
  const decimal = value - whole;
  if (decimal < FRACTION_EPSILON) return String(whole);
  if (1 - decimal < FRACTION_EPSILON) return String(whole + 1);

  let numerator = 0;
  let denominator = 1;
  let distance = Number.POSITIVE_INFINITY;
  for (const candidateDenominator of FRACTION_DENOMINATORS) {
    const candidateNumerator = Math.round(decimal * candidateDenominator);
    if (!candidateNumerator || candidateNumerator >= candidateDenominator) continue;
    const nextDistance = Math.abs(decimal - candidateNumerator / candidateDenominator);
    if (nextDistance < distance) {
      numerator = candidateNumerator;
      denominator = candidateDenominator;
      distance = nextDistance;
    }
  }

  if (distance <= FRACTION_EPSILON) {
    const divisor = greatestCommonDivisor(numerator, denominator);
    const reducedNumerator = numerator / divisor;
    const reducedDenominator = denominator / divisor;
    const fraction = reducedNumerator / reducedDenominator;
    const unicode = FRACTIONS.find(([amount]) => amount === fraction)?.[1];
    const printed = unicode ?? `${reducedNumerator}/${reducedDenominator}`;
    return `${whole || ''}${whole ? ' ' : ''}${printed}`;
  }
  return new Intl.NumberFormat('en', { maximumFractionDigits: 2 }).format(value);
}

function greatestCommonDivisor(left: number, right: number): number {
  let dividend = left;
  let divisor = right;
  while (divisor) [dividend, divisor] = [divisor, dividend % divisor];
  return dividend;
}

export function scaledAmount(ingredient: Ingredient, baseServings: number, targetServings: number): string {
  const quantity = formatQuantity(ingredient.quantity * targetServings / baseServings);
  return [quantity, ingredient.unit].filter(Boolean).join(' ');
}

export function bindingIds(step: RecipeStep): string[] {
  const inline = Array.from(step.text.matchAll(/\{\{\s*([\w-]+)\s*\}\}/g), (match) => match[1] ?? '');
  return [...new Set([...inline, ...(step.ingredients ?? [])])];
}

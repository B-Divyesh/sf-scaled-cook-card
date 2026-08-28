import { describe, expect, it } from 'vitest';
import { bindingIds, formatQuantity, parseQuantity, parseRecipe, sampleRecipe, scaledAmount } from '../src/recipe';

describe('recipe import', () => {
  it('parses the documented YAML sample and binds step ingredients', () => {
    const recipe = parseRecipe(sampleRecipe);
    expect(recipe.title).toBe('Weeknight tomato pasta');
    expect(recipe.ingredients).toHaveLength(5);
    expect(bindingIds(recipe.steps[1]!)).toEqual(['oil', 'garlic']);
  });

  it('accepts JSON and structured step bindings', () => {
    const recipe = parseRecipe(JSON.stringify({
      title: 'Toast', servings: 1,
      ingredients: [{ id: 'bread', name: 'bread', quantity: '1 1/2', unit: 'slices' }],
      steps: [{ text: 'Toast until crisp.', ingredients: ['bread'] }],
    }));
    expect(recipe.ingredients[0]?.quantity).toBe(1.5);
    expect(bindingIds(recipe.steps[0]!)).toEqual(['bread']);
  });

  it('rejects missing and unknown ingredient bindings with useful messages', () => {
    expect(() => parseRecipe('title: No\nservings: 2')).toThrow('at least one ingredient');
    expect(() => parseRecipe(`title: Soup\nservings: 2\ningredients:\n  - { id: water, name: water, quantity: 2, unit: cups }\nsteps:\n  - Add {{salt}}.`)).toThrow('no ingredient has that id');
  });
});

describe('scaling and display', () => {
  it('handles common mixed and unicode fractions', () => {
    expect(parseQuantity('1 1/2', 'Amount')).toBe(1.5);
    expect(parseQuantity('2¾', 'Amount')).toBe(2.75);
    expect(formatQuantity(1.5)).toBe('1 ½');
    expect(formatQuantity(0.333)).toBe('⅓');
  });

  it('scales an amount for a target yield', () => {
    expect(scaledAmount({ id: 'oil', name: 'oil', quantity: 2, unit: 'tbsp' }, 4, 6)).toBe('3 tbsp');
  });
});

import { describe, expect, it } from 'vitest';
import { bindingIds, formatQuantity, parseQuantity, parseRecipe, sampleRecipe, scaledAmount } from '../src/recipe';

describe('recipe import', () => {
  it('parses the documented YAML recipe shape @claim:recipe-format', () => {
    const recipe = parseRecipe(sampleRecipe);
    expect(recipe.title).toBe('Weeknight tomato pasta');
    expect(recipe.ingredients).toHaveLength(5);
    expect(bindingIds(recipe.steps[1]!)).toEqual(['oil', 'garlic']);
    expect(parseQuantity('1 1/2', 'Quantity')).toBe(1.5);
  });

  it('requires a title, positive servings, ingredients, and preparation steps @claim:recipe-required-fields', () => {
    const validIngredients = `ingredients:\n  - id: water\n    name: water\n    quantity: 2\n    unit: cups`;
    const validSteps = 'steps:\n  - Bring {{water}} to a boil.';

    expect(() => parseRecipe(`servings: 2\n${validIngredients}\n${validSteps}`)).toThrow('Add a recipe title.');
    expect(() => parseRecipe(`title: Soup\nservings: 0\n${validIngredients}\n${validSteps}`)).toThrow('Servings must be greater than zero.');
    expect(() => parseRecipe('title: Soup\nservings: 2\nsteps:\n  - Simmer for 10 minutes.')).toThrow('Add at least one ingredient.');
    expect(() => parseRecipe(`title: Soup\nservings: 2\n${validIngredients}`)).toThrow('Add at least one preparation step.');
  });

  it('accepts structured ingredient lists after a step @claim:step-binding-list', () => {
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

  it('keeps an exact uncommon fraction instead of snapping it to a nearby amount', () => {
    expect(formatQuantity(parseQuantity('3/16', 'Amount'))).toBe('3/16');
  });

  it('scales an amount for a target yield', () => {
    expect(scaledAmount({ id: 'oil', name: 'oil', quantity: 2, unit: 'tbsp' }, 4, 6)).toBe('3 tbsp');
  });
});

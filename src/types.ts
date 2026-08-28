export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  note?: string;
}

export interface RecipeStep {
  text: string;
  ingredients?: string[];
}

export interface Recipe {
  id: string;
  title: string;
  servings: number;
  ingredients: Ingredient[];
  steps: RecipeStep[];
}

export interface CookRecord {
  id: string;
  recipeId: string;
  cookedAt: string;
  targetServings: number;
  actualYield: number | null;
  substitutions: string;
  notes: string;
}

export interface LicenseState {
  token: string | null;
  valid: boolean;
  checking: boolean;
  message: string;
}

export class Recipe {
  constructor(title, ingredients = [], steps = []) {
    if (typeof title !== 'string' || title.trim() === '') {
      throw new TypeError('Название рецепта должно быть непустой строкой.');
    }

    this.title = title;
    this.ingredients = [...ingredients];
    this.steps = [...steps];
  }

  addIngredient(ingredient) {
    this.ingredients.push(ingredient);
  }

  removeIngredient(ingredient) {
    const index = this.ingredients.indexOf(ingredient);
    if (index !== -1) {
      this.ingredients.splice(index, 1);
    }
  }

  get ingredientCount() {
    return this.ingredients.length;
  }

  addStep(step) {
    this.steps.push(step);
  }

  removeStep(step) {
    const index = this.steps.indexOf(step);
    if (index !== -1) {
      this.steps.splice(index, 1);
    }
  }

  get stepCount() {
    return this.steps.length;
  }
}

function ensureArray(recipes) {
  if (!Array.isArray(recipes)) {
    throw new TypeError('Ожидался массив рецептов.');
  }
}

function groupBy(items, getKey) {
  const groups = new Map();

  for (const item of items) {
    const key = getKey(item);
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key).push(item);
  }

  return groups;
}

export function groupRecipesByIngredientCount(recipes) {
  ensureArray(recipes);
  return groupBy(recipes, (recipe) => recipe.ingredients.length);
}

export function getUniqueIngredients(recipes) {
  ensureArray(recipes);
  return [...new Set(recipes.flatMap((recipe) => recipe.ingredients))];
}

export function findRecipesByIngredient(recipes, ingredient) {
  ensureArray(recipes);
  return recipes.filter((recipe) => recipe.ingredients.includes(ingredient));
}

export function groupRecipesByStepCount(recipes) {
  ensureArray(recipes);
  return groupBy(recipes, (recipe) => recipe.steps.length);
}

export function getRecipeTitles(recipes) {
  ensureArray(recipes);
  return recipes.map((recipe) => recipe.title);
}

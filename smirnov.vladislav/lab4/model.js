export class Recipe {
  constructor(title, ingredients = [], steps = []) {
    this.title = title;
    this.ingredients = ingredients;
    this.steps = steps;
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
}

export function groupRecipesByIngredientCount(recipes) {
  const groups = {};

  for (const recipe of recipes) {
    const count = recipe.ingredientCount;

    if (!groups[count]) {
      groups[count] = [];
    }

    groups[count].push(recipe);
  }

  return groups;
}

export function getUniqueIngredients(recipes) {
  const result = [];

  for (const recipe of recipes) {
    for (const ingredient of recipe.ingredients) {
      if (!result.includes(ingredient)) {
        result.push(ingredient);
      }
    }
  }

  return result;
}

export function findRecipesByIngredient(recipes, ingredient) {
  return recipes.filter((recipe) => recipe.ingredients.includes(ingredient));
}

export function groupRecipesByStepCount(recipes) {
  const groups = {};

  for (const recipe of recipes) {
    const count = recipe.steps.length;

    if (!groups[count]) {
      groups[count] = [];
    }

    groups[count].push(recipe);
  }

  return groups;
}

export function getRecipeTitles(recipes) {
  const result = [];

  for (const recipe of recipes) {
    result.push(recipe.title);
  }

  return result;
}

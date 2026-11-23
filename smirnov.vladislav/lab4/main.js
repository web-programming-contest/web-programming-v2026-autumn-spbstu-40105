import {Recipe} from './model.js';

const form = document.querySelector('[data-testid="entity-form"]');
const list = document.querySelector('[data-testid="entity-list"]');

const savedRecipes = JSON.parse(localStorage.getItem('recipes') || '[]');

const recipes = savedRecipes.map(
  (item) => new Recipe(item.title, item.ingredients, item.steps),
);

function saveRecipes() {
  localStorage.setItem('recipes', JSON.stringify(recipes));
}

function delay() {
  return new Promise((resolve) => {
    setTimeout(resolve, 300);
  });
}

function renderRecipes() {
  saveRecipes();
  list.innerHTML = '';

  for (const recipe of recipes) {
    const card = document.createElement('article');
    card.dataset.testid = 'entity-card';

    const title = document.createElement('h2');
    title.textContent = recipe.title;

    const ingredients = document.createElement('p');
    ingredients.textContent = `Ингредиенты: ${recipe.ingredients.join(', ')}`;

    const steps = document.createElement('p');
    steps.textContent = `Шаги: ${recipe.steps.join(', ')}`;

    const count = document.createElement('p');
    count.textContent = `Количество ингредиентов: ${recipe.ingredientCount}`;

    const stepCount = document.createElement('p');
    stepCount.textContent = `Количество шагов: ${recipe.steps.length}`;

    const addIngredientButton = document.createElement('button');
    addIngredientButton.type = 'button';
    addIngredientButton.textContent = 'Добавить ингредиент';

    addIngredientButton.addEventListener('click', async () => {
      const ingredient = prompt('Введите название ингредиента:');

      if (ingredient && ingredient.trim()) {
        await delay();
        recipe.addIngredient(ingredient.trim());
        renderRecipes();
      }
    });

    const removeIngredientButton = document.createElement('button');
    removeIngredientButton.type = 'button';
    removeIngredientButton.textContent = 'Удалить ингредиент';

    removeIngredientButton.addEventListener('click', async () => {
      const ingredient = prompt('Какой ингредиент удалить?');

      if (ingredient && ingredient.trim()) {
        await delay();
        recipe.removeIngredient(ingredient.trim());
        renderRecipes();
      }
    });

    const addStepButton = document.createElement('button');
    addStepButton.type = 'button';
    addStepButton.textContent = 'Добавить шаг';

    addStepButton.addEventListener('click', async () => {
      const step = prompt('Введите новый шаг приготовления:');

      if (step && step.trim()) {
        await delay();
        recipe.steps.push(step.trim());
        renderRecipes();
      }
    });

    const removeStepButton = document.createElement('button');
    removeStepButton.type = 'button';
    removeStepButton.textContent = 'Удалить шаг';

    removeStepButton.addEventListener('click', async () => {
      const step = prompt('Какой шаг удалить?');

      if (step && step.trim()) {
        const index = recipe.steps.indexOf(step.trim());

        if (index !== -1) {
          await delay();
          recipe.steps.splice(index, 1);
          renderRecipes();
        }
      }
    });

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.dataset.testid = 'delete-entity';
    deleteButton.textContent = 'Удалить рецепт';

    deleteButton.addEventListener('click', async () => {
      const index = recipes.indexOf(recipe);

      if (index !== -1) {
        await delay();

        recipes.splice(index, 1);
        renderRecipes();
      }
    });

    card.append(
      title,
      ingredients,
      steps,
      count,
      stepCount,
      addIngredientButton,
      removeIngredientButton,
      addStepButton,
      removeStepButton,
      deleteButton,
    );
    list.append(card);
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const title = form.elements.namedItem('title').value;
  const ingredientsText = form.elements.namedItem('ingredients').value;
  const stepsText = form.elements.namedItem('steps').value;

  const ingredients = ingredientsText
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item !== '');

  const steps = stepsText
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item !== '');

  const recipe = new Recipe(title, ingredients, steps);

  await delay();

  recipes.push(recipe);
  renderRecipes();

  form.reset();
});

renderRecipes();

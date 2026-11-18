import {
  Recipe,
  findRecipesByIngredient,
  getRecipeTitles,
  getUniqueIngredients,
  groupRecipesByIngredientCount,
  groupRecipesByStepCount,
} from './model.js';

const STORAGE_KEY = 'lab4-variant21-recipes';
const DELAY_MS = 300;

const form = document.querySelector('[data-testid="entity-form"]');
const list = document.querySelector('[data-testid="entity-list"]');
const statusLine = document.querySelector('[data-testid="status"]');
const overviewSelect = document.querySelector('.overview-select');
const overviewSearch = document.querySelector('.overview-search');
const overviewResult = document.querySelector('.overview-result');

function setStatus(message) {
  statusLine.textContent = message;
}

function createId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

function splitText(text, separator) {
  return text
    .split(separator)
    .map((part) => part.trim())
    .filter(Boolean);
}

function requireText(text, message) {
  if (!text) {
    throw new Error(message);
  }
}

function loadEntries() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const data = JSON.parse(raw);
    if (!Array.isArray(data)) {
      return [];
    }

    return data.map((item) => ({
      id: item.id,
      recipe: new Recipe(item.title, item.ingredients, item.steps),
    }));
  } catch {
    return [];
  }
}

let entries = loadEntries();

function saveEntries() {
  try {
    const data = entries.map(({id, recipe}) => ({
      id,
      title: recipe.title,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    setStatus('Не удалось сохранить данные в localStorage.');
  }
}

function runAsync(action) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(action());
      } catch (error) {
        reject(error);
      }
    }, DELAY_MS);
  });
}

async function applyChange(action, successMessage) {
  setStatus('Выполняется...');

  try {
    await runAsync(action);
    saveEntries();
    render();
    setStatus(successMessage);
    return true;
  } catch (error) {
    setStatus(error.message);
    return false;
  }
}

function findEntry(id) {
  const entry = entries.find((item) => item.id === id);
  if (!entry) {
    throw new Error('Рецепт не найден.');
  }
  return entry;
}

function createElement(tag, className = '', text) {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  if (text !== undefined) {
    element.textContent = text;
  }
  return element;
}

function createButton(label, action, testId = action) {
  const button = createElement('button', '', label);
  button.type = 'button';
  button.dataset.action = action;
  button.dataset.testid = testId;
  return button;
}

function createList(title, items, tag) {
  const block = createElement('div', 'recipe-block');
  block.append(createElement('h3', '', title));

  if (items.length === 0) {
    block.append(createElement('p', 'empty', 'Пока пусто.'));
    return block;
  }

  const listElement = createElement(tag);
  for (const item of items) {
    listElement.append(createElement('li', '', item));
  }
  block.append(listElement);
  return block;
}

function createEditor(inputName, placeholder, buttons) {
  const editor = createElement('div', 'editor');
  const input = createElement('input');
  input.type = 'text';
  input.name = inputName;
  input.placeholder = placeholder;
  input.setAttribute('aria-label', placeholder);
  editor.append(input);

  for (const [action, label] of buttons) {
    editor.append(createButton(label, action));
  }
  return editor;
}

function createCard({id, recipe}) {
  const card = createElement('article', 'recipe-card');
  card.dataset.id = id;
  card.dataset.testid = 'entity-card';

  const deleteButton = createButton(
    'Удалить рецепт',
    'delete-recipe',
    'delete-entity',
  );
  deleteButton.classList.add('danger');

  card.append(
    createElement('h2', 'recipe-title', recipe.title),
    createElement(
      'p',
      'recipe-meta',
      `Ингредиентов: ${recipe.ingredientCount} · Шагов: ${recipe.stepCount}`,
    ),
    createList('Ингредиенты', recipe.ingredients, 'ul'),
    createEditor('ingredient', 'Ингредиент', [
      ['add-ingredient', 'Добавить ингредиент'],
      ['remove-ingredient', 'Удалить ингредиент'],
    ]),
    createList('Шаги приготовления', recipe.steps, 'ol'),
    createEditor('step', 'Шаг', [
      ['add-step', 'Добавить шаг'],
      ['remove-step', 'Удалить шаг'],
    ]),
    deleteButton,
  );
  return card;
}

function groupLines(groups, unit) {
  return [...groups].map(
    ([key, recipes]) =>
      `${key} ${unit}: ${getRecipeTitles(recipes).join(', ')}`,
  );
}

function renderOverview() {
  const recipes = entries.map(({recipe}) => recipe);
  let lines;

  switch (overviewSelect.value) {
    case 'unique':
      lines = getUniqueIngredients(recipes);
      break;
    case 'ingredientCount':
      lines = groupLines(groupRecipesByIngredientCount(recipes), 'ингр.');
      break;
    case 'stepCount':
      lines = groupLines(groupRecipesByStepCount(recipes), 'шаг.');
      break;
    case 'find':
      lines = getRecipeTitles(
        findRecipesByIngredient(recipes, overviewSearch.value.trim()),
      );
      break;
    default:
      lines = getRecipeTitles(recipes);
  }

  overviewResult.replaceChildren(
    ...lines.map((line) => createElement('li', '', line)),
  );
}

function render() {
  list.replaceChildren(...entries.map(createCard));
  renderOverview();
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const title = String(data.get('title') ?? '').trim();
  const ingredients = splitText(String(data.get('ingredients') ?? ''), /[\n,]/);
  const steps = splitText(String(data.get('steps') ?? ''), /\n/);

  const isAdded = await applyChange(() => {
    entries.push({
      id: createId(),
      recipe: new Recipe(title, ingredients, steps),
    });
  }, 'Рецепт добавлен.');

  if (isAdded) {
    form.reset();
  }
});

list.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) {
    return;
  }

  const card = button.closest('[data-id]');
  const id = card.dataset.id;
  const ingredient = card.querySelector('[name="ingredient"]').value.trim();
  const step = card.querySelector('[name="step"]').value.trim();

  switch (button.dataset.action) {
    case 'add-ingredient':
      applyChange(() => {
        const {recipe} = findEntry(id);
        requireText(ingredient, 'Введите название ингредиента.');
        recipe.addIngredient(ingredient);
      }, 'Ингредиент добавлен.');
      break;
    case 'remove-ingredient':
      applyChange(() => {
        const {recipe} = findEntry(id);
        if (!recipe.ingredients.includes(ingredient)) {
          throw new Error('Такого ингредиента нет в рецепте.');
        }
        recipe.removeIngredient(ingredient);
      }, 'Ингредиент удалён.');
      break;
    case 'add-step':
      applyChange(() => {
        const {recipe} = findEntry(id);
        requireText(step, 'Введите текст шага.');
        recipe.addStep(step);
      }, 'Шаг добавлен.');
      break;
    case 'remove-step':
      applyChange(() => {
        const {recipe} = findEntry(id);
        if (!recipe.steps.includes(step)) {
          throw new Error('Такого шага нет в рецепте.');
        }
        recipe.removeStep(step);
      }, 'Шаг удалён.');
      break;
    case 'delete-recipe':
      applyChange(() => {
        findEntry(id);
        entries = entries.filter((entry) => entry.id !== id);
      }, 'Рецепт удалён.');
      break;
    default:
      break;
  }
});

overviewSelect.addEventListener('change', renderOverview);
overviewSearch.addEventListener('input', renderOverview);
window.addEventListener('beforeunload', saveEntries);

render();

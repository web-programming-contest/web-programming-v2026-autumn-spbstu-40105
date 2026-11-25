import {Product} from './model.js';

const STORAGE_KEY = 'lab4-products';
const DELAY_MS = 500;

let products = loadProducts();

const listElement = document.querySelector('[data-testid="entity-list"]');
const formElement = document.querySelector('form[data-testid="entity-form"]');

function loadProducts() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return [];
    }
    return JSON.parse(saved).map(
      (p) => new Product(p.id, p.name, p.categories, p.price),
    );
  } catch (error) {
    console.error('Не удалось прочитать localStorage', error);
    return [];
  }
}

function saveProducts() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

function renderList() {
  listElement.innerHTML = '';

  for (const product of products) {
    const card = document.createElement('article');
    card.setAttribute('data-testid', 'entity-card');
    card.className = 'entity-card';

    const title = document.createElement('h2');
    title.textContent = `${product.name} (#${product.id})`;

    const price = document.createElement('p');
    price.textContent = `Цена: ${product.price} руб.`;

    const categories = document.createElement('p');
    const label =
      product.categoryCount === 0 ? 'нет' : product.categories.join(', ');
    categories.textContent = `Категории: ${label}`;

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.setAttribute('data-testid', 'delete-entity');
    deleteButton.dataset.id = product.id;
    deleteButton.textContent = 'Удалить';

    card.append(title, price, categories, deleteButton);
    listElement.append(card);
  }
}

function updateUi() {
  saveProducts();
  renderList();
}

function addProductAsync(product) {
  return new Promise((resolve) => {
    setTimeout(() => {
      products.push(product);
      updateUi();
      resolve();
    }, DELAY_MS);
  });
}

function deleteProductAsync(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      products = products.filter((p) => String(p.id) !== String(id));
      updateUi();
      resolve();
    }, DELAY_MS);
  });
}

formElement.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(formElement);
  const id = formData.get('id');
  const name = formData.get('name');
  const price = Number(formData.get('price'));
  const categories = formData
    .get('categories')
    .split(',')
    .map((c) => c.trim())
    .filter((c) => c !== '');

  addProductAsync(new Product(id, name, categories, price)).then(() => {
    formElement.reset();
  });
});

listElement.addEventListener('click', (event) => {
  const deleteButton = event.target.closest('[data-testid="delete-entity"]');
  if (deleteButton) {
    deleteProductAsync(deleteButton.dataset.id);
  }
});

renderList();

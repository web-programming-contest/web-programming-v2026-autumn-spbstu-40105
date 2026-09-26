import {Restaurant} from './model.js';

const STORAGE_KEY = 'restaurants';

let restaurants = [];

function saveToStorage() {
  const plain = restaurants.map((r) => ({
    name: r.name,
    menu: r.menu,
  }));

  localStorage.setItem(STORAGE_KEY, JSON.stringify(plain));
}

function loadFromStorage() {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    const data = JSON.parse(raw);

    return data.map((r) => new Restaurant(r.name, r.menu));
  } catch {
    return [];
  }
}

function render() {
  const list = document.querySelector('[data-testid="entity-list"]');
  list.innerHTML = '';

  for (const restaurant of restaurants) {
    list.appendChild(createRestaurantCard(restaurant));
  }
}

function createRestaurantCard(restaurant) {
  const card = document.createElement('article');
  card.dataset.testid = 'entity-card';

  const title = document.createElement('h3');
  title.textContent = restaurant.name;
  card.appendChild(title);

  const size = document.createElement('p');
  size.textContent = `Блюд в меню: ${restaurant.menuSize}`;
  card.appendChild(size);

  const menu = document.createElement('ul');

  for (const dish of restaurant.menu) {
    menu.appendChild(createDishItem(restaurant, dish));
  }

  card.appendChild(menu);

  const dishForm = document.createElement('form');
  dishForm.className = 'dish-form';

  const dishNameInput = document.createElement('input');
  dishNameInput.type = 'text';
  dishNameInput.name = 'dishName';
  dishNameInput.placeholder = 'Название блюда';
  dishNameInput.required = true;
  dishForm.appendChild(dishNameInput);

  const dishPriceInput = document.createElement('input');
  dishPriceInput.type = 'number';
  dishPriceInput.name = 'dishPrice';
  dishPriceInput.placeholder = 'Цена';
  dishPriceInput.required = true;
  dishForm.appendChild(dishPriceInput);

  const addDishBtn = document.createElement('button');
  addDishBtn.type = 'submit';
  addDishBtn.textContent = 'Добавить блюдо';
  dishForm.appendChild(addDishBtn);

  dishForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = dishNameInput.value.trim();
    const price = dishPriceInput.value;

    if (!name || Number.isNaN(price)) {
      return;
    }

    await addDish(restaurant.name, {name, price});

    dishNameInput.value = '';
    dishPriceInput.value = '';
  });

  card.appendChild(dishForm);

  const delRestaurant = document.createElement('button');
  delRestaurant.dataset.testid = 'delete-entity';
  delRestaurant.textContent = 'Удалить ресторан';
  delRestaurant.addEventListener('click', () =>
    removeRestaurant(restaurant.name),
  );
  card.appendChild(delRestaurant);

  return card;
}

function createDishItem(restaurant, dish) {
  const li = document.createElement('li');

  const text = document.createElement('span');
  text.textContent = `${dish.name} — ${dish.price}`;
  li.appendChild(text);

  const delDish = document.createElement('button');
  delDish.type = 'button';
  delDish.textContent = 'Удалить блюдо';
  delDish.addEventListener('click', () =>
    removeDish(restaurant.name, dish.name),
  );
  li.appendChild(delDish);

  return li;
}

function addRestaurantAsync(name) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const restaurant = new Restaurant(name, []);
      restaurants.push(restaurant);
      resolve(restaurant);
    }, 300);
  });
}

function removeRestaurantAsync(name) {
  return new Promise((resolve) => {
    setTimeout(() => {
      restaurants = restaurants.filter((r) => r.name !== name);
      resolve();
    }, 300);
  });
}

function addDishAsync(restaurantName, dish) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const restaurant = restaurants.find((r) => r.name === restaurantName);

      if (restaurant) {
        restaurant.addDish(dish);
      }

      resolve();
    }, 300);
  });
}

function removeDishAsync(restaurantName, dish) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const restaurant = restaurants.find((r) => r.name === restaurantName);

      if (restaurant) {
        restaurant.removeDish(dish);
      }

      resolve();
    }, 300);
  });
}

async function addRestaurant(name) {
  await addRestaurantAsync(name);
  saveToStorage();
  render();
}

async function removeRestaurant(name) {
  await removeRestaurantAsync(name);
  saveToStorage();
  render();
}

async function addDish(restaurantName, dish) {
  await addDishAsync(restaurantName, dish);
  saveToStorage();
  render();
}

async function removeDish(restaurantName, dish) {
  await removeDishAsync(restaurantName, dish);
  saveToStorage();
  render();
}

const form = document.querySelector('[data-testid="entity-form"]');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const input = e.target.elements.name;
  const name = input.value.trim();

  if (!name) {
    return;
  }

  await addRestaurant(name);
  input.value = '';
});

restaurants = loadFromStorage();
render();

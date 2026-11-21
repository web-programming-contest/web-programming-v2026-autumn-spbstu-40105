import {
  Car,
  getUniqueOwners,
  groupCarsByMake,
  groupCarsByOwnerCount,
} from './model.js';

const STORAGE_KEY = 'cars';
const ASYNC_DELAY_MS = 150;

const carForm = document.querySelector('[data-testid="entity-form"]');
const carListElement = document.querySelector('[data-testid="entity-list"]');
const statsElement = document.querySelector('.stats-panel');

function createDefaultCars() {
  return [
    new Car('Toyota', 'Camry', ['Иван', 'Мария']),
    new Car('BMW', 'X5', ['Анна']),
  ];
}

function loadCars() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      return createDefaultCars();
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return createDefaultCars();
    }

    return parsed.map((item) => new Car(item.make, item.model, item.owners));
  } catch {
    return createDefaultCars();
  }
}

function saveCars(cars) {
  const plainCars = cars.map((car) => ({
    make: car.make,
    model: car.model,
    owners: car.owners,
  }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plainCars));
}

function runAsync(action) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(action());
    }, ASYNC_DELAY_MS);
  });
}

let cars = loadCars();

function createOwnerElement(car, ownerName) {
  const item = document.createElement('li');
  item.className = 'owner-item';

  const nameSpan = document.createElement('span');
  nameSpan.textContent = ownerName;

  const removeButton = document.createElement('button');
  removeButton.type = 'button';
  removeButton.className = 'btn-secondary';
  removeButton.textContent = 'Удалить владельца';

  removeButton.addEventListener('click', async () => {
    removeButton.disabled = true;
    await runAsync(() => {
      car.removeOwner(ownerName);
      saveCars(cars);
    });
    render();
  });

  item.append(nameSpan, removeButton);
  return item;
}

function createCarCard(car) {
  const card = document.createElement('article');
  card.className = 'car-card';
  card.setAttribute('data-testid', 'entity-card');

  const header = document.createElement('div');
  header.className = 'car-header';

  const titleGroup = document.createElement('div');
  const title = document.createElement('h2');
  title.className = 'car-title';
  title.textContent = `${car.make} ${car.model}`;

  const meta = document.createElement('span');
  meta.className = 'car-meta';
  meta.textContent = `Владельцев: ${car.ownerCount}`;
  titleGroup.append(title, meta);

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.className = 'btn-danger';
  deleteButton.setAttribute('data-testid', 'delete-entity');
  deleteButton.textContent = 'Удалить автомобиль';

  deleteButton.addEventListener('click', async () => {
    deleteButton.disabled = true;
    await runAsync(() => {
      cars = cars.filter((item) => item !== car);
      saveCars(cars);
    });
    render();
  });

  header.append(titleGroup, deleteButton);

  const ownersList = document.createElement('ul');
  ownersList.className = 'owners-list';

  if (car.owners.length === 0) {
    const emptyItem = document.createElement('li');
    emptyItem.className = 'owners-empty';
    emptyItem.textContent = 'Нет владельцев';
    ownersList.append(emptyItem);
  } else {
    for (const owner of car.owners) {
      ownersList.append(createOwnerElement(car, owner));
    }
  }

  const ownerForm = document.createElement('form');
  ownerForm.className = 'owner-form';

  const ownerInput = document.createElement('input');
  ownerInput.type = 'text';
  ownerInput.name = 'owner';
  ownerInput.placeholder = 'Имя владельца';
  ownerInput.setAttribute('aria-label', 'Имя владельца');
  ownerInput.required = true;

  const addOwnerButton = document.createElement('button');
  addOwnerButton.type = 'submit';
  addOwnerButton.className = 'btn-primary';
  addOwnerButton.textContent = 'Добавить владельца';

  ownerForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const ownerName = ownerInput.value.trim();
    if (!ownerName) {
      return;
    }

    addOwnerButton.disabled = true;
    try {
      await runAsync(() => {
        car.addOwner(ownerName);
        saveCars(cars);
      });
      render();
    } finally {
      addOwnerButton.disabled = false;
    }
  });

  ownerForm.append(ownerInput, addOwnerButton);
  card.append(header, ownersList, ownerForm);
  return card;
}

function renderStats() {
  if (!statsElement) {
    return;
  }

  const heading = document.createElement('h2');
  heading.className = 'stats-title';
  heading.textContent = 'Сводка по коллекции';

  const uniqueOwners = getUniqueOwners(cars);
  const byMake = groupCarsByMake(cars);
  const byCount = groupCarsByOwnerCount(cars);

  const ownersLine = document.createElement('p');
  ownersLine.className = 'stats-line';
  ownersLine.textContent = `Уникальные владельцы (${uniqueOwners.length}): ${
    uniqueOwners.length > 0 ? uniqueOwners.join(', ') : 'нет'
  }`;

  const makeEntries = Object.entries(byMake)
    .map(([make, list]) => `${make}: ${list.length}`)
    .join('; ');
  const makeLine = document.createElement('p');
  makeLine.className = 'stats-line';
  makeLine.textContent = `По маркам: ${makeEntries || 'нет данных'}`;

  const countEntries = Object.entries(byCount)
    .map(([count, list]) => `${count} вл. — ${list.length} авто`)
    .join('; ');
  const countLine = document.createElement('p');
  countLine.className = 'stats-line';
  countLine.textContent = `По числу владельцев: ${countEntries || 'нет данных'}`;

  statsElement.replaceChildren(heading, ownersLine, makeLine, countLine);
}

function render() {
  if (cars.length === 0) {
    const emptyMessage = document.createElement('p');
    emptyMessage.className = 'list-empty';
    emptyMessage.textContent = 'Список автомобилей пуст.';
    carListElement.replaceChildren(emptyMessage);
  } else {
    const cards = cars.map((car) => createCarCard(car));
    carListElement.replaceChildren(...cards);
  }

  renderStats();
}

carForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(carForm);
  const make = String(formData.get('make') ?? '').trim();
  const model = String(formData.get('model') ?? '').trim();

  if (!make || !model) {
    return;
  }

  const submitButton = carForm.querySelector('button[type="submit"]');
  if (submitButton) {
    submitButton.disabled = true;
  }

  try {
    await runAsync(() => {
      cars.push(new Car(make, model));
      saveCars(cars);
    });
    carForm.reset();
    render();
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
    }
  }
});

render();

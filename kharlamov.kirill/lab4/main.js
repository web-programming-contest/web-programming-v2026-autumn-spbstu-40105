import {
  ClothingItem,
  groupItemsBySize,
  getUniqueColors,
  findItemsByColor,
  groupItemsByColorCount,
  findItemsAboveColorCount,
} from './model.js';

const storageKey = 'kharlamov-kirill-lab4';
const list = document.querySelector('[data-testid="entity-list"]');
const form = document.querySelector('[data-testid="entity-form"]');
const status = document.querySelector('.status');
const queryForm = document.querySelector('.query-form');
let items = [];
let busy = false;

try {
  const saved = JSON.parse(localStorage.getItem(storageKey) ?? '[]');
  if (!Array.isArray(saved)) {
    throw new Error('Неверный формат списка.');
  }
  items = saved.map((item) => {
    if (
      !Number.isInteger(item.id) ||
      typeof item.name !== 'string' ||
      !['S', 'M', 'L', 'XL'].includes(item.size) ||
      !Array.isArray(item.colors) ||
      item.colors.some((color) => typeof color !== 'string')
    ) {
      throw new Error('Неверный формат товара.');
    }
    return new ClothingItem(item.id, item.name, item.size, item.colors);
  });
} catch {
  status.textContent = 'Не удалось восстановить список. Можно создать новый.';
}

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) {
    node.textContent = text;
  }
  if (className) {
    node.className = className;
  }
  return node;
}

function showQuery() {
  const data = new FormData(queryForm);
  const color = String(data.get('color')).trim();
  const count = Number(data.get('count'));
  const query = data.get('query');
  const output = document.querySelector('.query-result');
  output.replaceChildren();

  function showItems(collection, heading) {
    output.append(element('h3', heading));
    if (collection.length === 0) {
      output.append(element('p', 'Товары не найдены.'));
      return;
    }
    const resultList = element('ul');
    for (const item of collection) {
      resultList.append(
        element(
          'li',
          `${item.name} · ID: ${item.id} · Размер: ${item.size} · Цвета: ${item.colors.join(', ') || 'не добавлены'}`,
        ),
      );
    }
    output.append(resultList);
  }

  if (query === 'size' || query === 'count') {
    const groups =
      query === 'size'
        ? groupItemsBySize(items)
        : groupItemsByColorCount(items);
    if (groups.size === 0) {
      output.append(element('p', 'Пока нет товаров.'));
    }
    for (const [key, collection] of groups) {
      showItems(
        collection,
        query === 'size' ? `Размер ${key}` : `Количество цветов: ${key}`,
      );
    }
  } else if (query === 'colors') {
    const colors = getUniqueColors(items);
    output.append(element('h3', 'Все доступные цвета'));
    output.append(
      element('p', colors.join(', ') || 'Цвета пока не добавлены.'),
    );
  } else if (query === 'color') {
    if (!color) {
      output.append(element('p', 'Введите цвет для поиска.'));
      return;
    }
    showItems(findItemsByColor(items, color), `Товары цвета «${color}»`);
  } else {
    showItems(
      findItemsAboveColorCount(items, count),
      `Количество цветов больше ${count}`,
    );
  }
}

function render() {
  list.replaceChildren();
  if (items.length === 0) {
    list.append(element('p', 'Пока нет товаров. Добавьте первый товар.'));
  }
  for (const item of items) {
    const card = element('article', undefined, 'card');
    card.dataset.testid = 'entity-card';
    card.append(
      element('h3', item.name),
      element('p', `ID: ${item.id} · Размер: ${item.size}`),
      element('p', `Количество цветов: ${item.colorsCount}`),
    );
    const colors = element('ul', undefined, 'colors');
    for (const color of item.colors) {
      const row = element('li');
      const remove = element('button', 'Удалить цвет');
      remove.type = 'button';
      remove.setAttribute('aria-label', `Удалить цвет ${color}`);
      remove.addEventListener('click', () =>
        change(() => item.removeColor(color)),
      );
      row.append(element('span', color), remove);
      colors.append(row);
    }
    const colorForm = element('form', undefined, 'color-form');
    const label = element('label', 'Новый цвет ');
    const input = element('input');
    input.type = 'text';
    input.name = 'color';
    input.required = true;
    input.maxLength = 40;
    label.append(input);
    const add = element('button', 'Добавить цвет');
    add.type = 'submit';
    colorForm.append(label, add);
    colorForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const color = input.value.trim();
      if (!color) {
        status.textContent = 'Введите название цвета.';
        return;
      }
      change(() => item.addColor(color));
    });
    const removeItem = element('button', 'Удалить товар', 'danger');
    removeItem.type = 'button';
    removeItem.dataset.testid = 'delete-entity';
    removeItem.addEventListener('click', () =>
      change(() => {
        items = items.filter((value) => value.id !== item.id);
      }),
    );
    card.append(colors, colorForm, removeItem);
    list.append(card);
  }
  showQuery();
}

// Все изменения списка выполняются с задержкой и сохраняются после завершения.
async function change(action) {
  if (busy) {
    return;
  }
  busy = true;
  document.querySelectorAll('button').forEach((button) => {
    button.disabled = true;
  });
  status.textContent = 'Сохранение…';
  try {
    await new Promise((resolve) => {
      setTimeout(resolve, 200);
    });
    action();
    render();
    localStorage.setItem(storageKey, JSON.stringify(items));
    status.textContent = 'Изменения сохранены.';
  } catch {
    status.textContent =
      'Изменения не сохранены в браузере. Проверьте доступ к хранилищу.';
  } finally {
    busy = false;
    document.querySelectorAll('button').forEach((button) => {
      button.disabled = false;
    });
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const id = Number(data.get('id'));
  const name = String(data.get('name')).trim();
  if (!Number.isInteger(id) || !name) {
    status.textContent = 'Введите целый ID и непустое название.';
    return;
  }
  if (items.some((item) => item.id === id)) {
    status.textContent = 'Товар с таким ID уже есть.';
    return;
  }
  const size = String(data.get('size'));
  change(() => {
    items.push(new ClothingItem(id, name, size));
    form.reset();
  });
});

queryForm.addEventListener('submit', (event) => {
  event.preventDefault();
  showQuery();
});
render();

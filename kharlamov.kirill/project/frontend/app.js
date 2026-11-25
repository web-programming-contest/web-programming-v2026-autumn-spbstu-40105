import {customScenario, findBundle, scenarios} from './bundle.js';

const main = document.querySelector('#main');
const header = document.querySelector('#header');
const dialog = document.querySelector('#dialog');
const page = location.pathname;
const apiRoot = `http://${location.hostname}:8080`;
const currency = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
});
const dateFormat = new Intl.DateTimeFormat('ru-RU');
const pageSize = 9;
let username;
let goods = [];
let cart = {};
let visiblePage = 1;
let filters = {min: 0, max: Infinity, types: [], colors: []};
let sort = 'release:desc';
const selected = new Set();
let checkoutPending = false;

const icon = (name) =>
  `<img class="icon" src="/assets/images/icons/${name}.svg" alt="">`;
const text = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[char],
  );
const money = (value) => currency.format(value);
const itemCount = () =>
  Object.values(cart).reduce((sum, count) => sum + count, 0);
const cartKey = () => `gadget-hub.cart.${username}`;

async function api(path, data) {
  const options = {credentials: 'include'};
  if (data !== undefined) {
    options.method = 'POST';
    options.headers = {'Content-Type': 'application/json'};
    options.body = JSON.stringify(data);
  }
  const response = await fetch(apiRoot + path, options);
  const value = response.status === 204 ? null : await response.json();
  if (!response.ok) {
    if (response.status === 401 && page !== '/login' && page !== '/') {
      location.replace('/login');
    }
    throw new Error(value.message);
  }
  return value;
}

function readCart() {
  try {
    return Object.fromEntries(
      Object.entries(
        JSON.parse(localStorage.getItem(cartKey()) || '{}'),
      ).filter(
        ([id, count]) =>
          /^[1-9]\d*$/.test(id) &&
          Number.isInteger(count) &&
          count > 0 &&
          count <= 99,
      ),
    );
  } catch {
    return {};
  }
}

function headerMarkup() {
  const count = itemCount();
  header.innerHTML =
    `<a href="/" class="brand" aria-label="Gadget Hub — главная"><img src="/assets/logo.svg" alt="Gadget Hub"></a>` +
    `<nav aria-label="Главное меню">${navLink(
      '/catalog',
      'catalog',
      'Каталог',
    )}${
      username
        ? `${navLink(
            '/cart',
            'card',
            'Корзина',
            count,
          )}<button class="nav-link" data-action="logout">${icon(
            'profile',
          )}Выйти</button>`
        : navLink('/login', 'profile', 'Войти')
    }</nav>`;
}

function navLink(path, image, label, count = 0) {
  const current = page === path ? ' aria-current="page"' : '';
  return `<a class="nav-link" href="${path}"${current}>${icon(image)}${
    label
  }<span class="counter"${count ? '' : ' hidden'}>${count || ''}</span></a>`;
}

function saveCart() {
  if (Object.keys(cart).length) {
    localStorage.setItem(cartKey(), JSON.stringify(cart));
  } else {
    localStorage.removeItem(cartKey());
  }
  const badge = header.querySelector('a[href="/cart"] .counter');
  const count = itemCount();
  badge.hidden = count === 0;
  badge.textContent = count;
}

function labelMarkup(product) {
  return `<div class="labels">${
    product.isNew ? '<span class="new">Новинка</span>' : ''
  }${product.isHit ? '<span class="hit">Хит</span>' : ''}</div>`;
}

function rating(product) {
  return `<span class="rating" aria-label="Рейтинг ${
    product.rating
  } из 5"><span aria-hidden="true">★</span> ${product.rating.toLocaleString(
    'ru-RU',
  )}</span>`;
}

function productImage(product) {
  return `<img src="${text(product.image)}" alt="${text(product.name)}">`;
}

function quantityButtons(id, count) {
  return `<div class="stepper"><button type="button" data-action="quantity" data-id="${
    id
  }" data-delta="-1" aria-label="Уменьшить количество">−</button><span>${
    count
  }</span><button type="button" data-action="quantity" data-id="${
    id
  }" data-delta="1" aria-label="Увеличить количество"${
    count >= 99 ? ' disabled' : ''
  }>+</button></div>`;
}

function cartControls(id) {
  const count = cart[id] || 0;
  if (count) {
    return `<span class="in-cart">${count} шт.</span>${quantityButtons(
      id,
      count,
    )}`;
  }
  return `<button class="primary" type="button" data-action="quantity" data-id="${
    id
  }" data-delta="1">${icon('card')}В корзину</button>`;
}

function productCard(product, showControls = false) {
  const id = product.id;
  const details =
    `<div class="card-image">${productImage(product)}${labelMarkup(
      product,
    )}</div>` +
    `<strong class="price">${money(product.price)}</strong>` +
    `<span class="product-name" title="${text(product.name)}">${text(
      product.name,
    )}</span>${rating(product)}`;
  return `<article class="product">${
    showControls
      ? `<button type="button" class="product-link" data-action="product" data-id="${
          id
        }" aria-label="Подробнее: ${text(product.name)}">${details}</button>`
      : details
  }${
    showControls
      ? `<div class="cart-controls" data-controls="${id}">${cartControls(
          id,
        )}</div>`
      : ''
  }</article>`;
}

function showDialog(content, className = '') {
  dialog.className = className;
  dialog.innerHTML = `<button class="close" type="button" data-action="close" aria-label="Закрыть">×</button>${
    content
  }`;
  if (!dialog.open) {
    dialog.showModal();
  }
}

function message(title, description = '') {
  showDialog(
    `<h2>${text(title)}</h2>${
      description ? `<p>${text(description)}</p>` : ''
    }<div class="dialog-actions"><button class="primary" data-action="close">ОК</button></div>`,
  );
}

function showProduct(id) {
  const product = goods.find((item) => item.id === id);
  if (!product) {
    return;
  }
  const specs = Object.entries(product.specs)
    .map(
      ([key, value]) =>
        `<div><dt>${text(key)}</dt><dd>${text(value)}</dd></div>`,
    )
    .join('');
  showDialog(
    `<div class="detail-image card-image">${productImage(product)}${labelMarkup(
      product,
    )}</div><div class="detail-info"><h2>${text(product.name)}</h2>${rating(
      product,
    )}<p>${text(product.description)}</p><h3>Характеристики</h3><dl>${
      specs
    }</dl><div class="detail-price"><strong>${money(product.price)}</strong>` +
      `<div class="cart-controls" data-controls="${id}">${cartControls(
        id,
      )}</div></div></div>`,
    'product-dialog',
  );
}

async function home() {
  main.innerHTML =
    '<div class="wrap home">' +
    '<h1 class="sr-only">Gadget Hub — магазин гаджетов</h1>' +
    '<a href="/catalog" class="hero"><img src="/assets/hero.webp" alt="Super Sale — умный робот Reddy Air"></a>' +
    '<div id="features"><p role="status">Загружаем товары…</p></div>' +
    '<section class="benefits"><h2>Преимущества</h2><div class="benefit-grid">' +
    '<div><span aria-hidden="true">↗</span><strong>Утром заказали,<br>вечером получили</strong></div>' +
    '<div><span aria-hidden="true">₽</span><strong>С товаром что-то не так?<br>Вернём деньги</strong></div>' +
    '<div><span aria-hidden="true">✓</span><strong>Только оригинальные<br>товары</strong></div></div></section>' +
    '<section class="contacts"><h2>Работаем 24/7</h2><address>' +
    '<a href="tel:+78006783424">8 (800) 678-34-24</a><a href="mailto:gadget@hub.ru">gadget@hub.ru</a>' +
    '<span>Санкт-Петербург, ул. Барочная, д. 7, корпус 2</span></address></section></div>';
  const featured = await api('/featured');
  const groups = [
    {
      title: 'Хиты продаж',
      property: 'popularity',
      products: featured.filter((item) => item.isHit),
      description: 'Популярные и проверенные гаджеты.',
      symbol: '✹',
      key: 'hits',
    },
    {
      title: 'Новинки',
      property: 'release',
      products: featured.filter((item) => item.isNew),
      description: 'Последние поступления в магазине.',
      symbol: '✦',
      key: 'fresh',
    },
  ];
  const holder = document.querySelector('#features');
  holder.innerHTML = groups
    .map(
      ({title, description, symbol, key}) =>
        `<section class="carousel ${key}" aria-label="${
          title
        }"><div class="carousel-title">` +
        `<span aria-hidden="true">${symbol}</span><h2>${title}</h2><p>${
          description
        }</p></div>` +
        `<button class="carousel-arrow" data-move="-1" aria-label="Предыдущие: ${
          title
        }">‹</button>` +
        `<div class="carousel-grid" aria-live="polite"></div>` +
        `<button class="carousel-arrow" data-move="1" aria-label="Следующие: ${
          title
        }">›</button></section>`,
    )
    .join('');
  for (const group of groups) {
    const section = holder.querySelector(`.${group.key}`);
    const items = group.products.sort(
      (first, second) => second[group.property] - first[group.property],
    );
    let index = 0;
    const render = () => {
      section.querySelector('.carousel-grid').innerHTML = items
        .slice(0, 3)
        .map((_, offset) => productCard(items[(index + offset) % items.length]))
        .join('');
    };
    for (const button of section.querySelectorAll('button')) {
      button.disabled = items.length <= 3;
      button.addEventListener('click', () => {
        index =
          (index + Number(button.dataset.move) + items.length) % items.length;
        render();
      });
    }
    render();
  }
}

function field(label, name, type = 'text', extra = '') {
  return `<label class="field"><span>${label}</span><input name="${
    name
  }" type="${type}" ${
    extra
  }><small class="field-error" aria-live="polite"></small></label>`;
}

function checkFields(form) {
  let firstInvalid;
  for (const input of form.querySelectorAll('.field input, .field select')) {
    input.setCustomValidity('');
    const invalid = !input.checkValidity();
    input.setAttribute('aria-invalid', String(invalid));
    const error = input.closest('.field').querySelector('.field-error');
    error.textContent = !invalid
      ? ''
      : input.validity.valueMissing
        ? 'Заполните обязательное поле'
        : 'Проверьте значение';
    if (invalid && !firstInvalid) {
      firstInvalid = input;
    }
  }
  firstInvalid?.focus();
  return !firstInvalid;
}

function login() {
  main.className = 'login-page';
  main.innerHTML = `<section class="login"><h1>Добро пожаловать!</h1><form class="panel" novalidate>${field(
    'Логин *',
    'username',
    'text',
    'required autocomplete="username"',
  )}${field(
    'Пароль *',
    'password',
    'password',
    'required autocomplete="current-password"',
  )}<button class="primary" type="submit">Войти</button></form></section>`;
  const form = main.querySelector('form');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    form.elements.username.value = form.elements.username.value.trim();
    if (!checkFields(form)) {
      return;
    }
    const button = form.querySelector('button');
    button.disabled = true;
    try {
      await api('/login', Object.fromEntries(new FormData(form)));
      location.replace('/');
    } catch (error) {
      message('Не удалось войти', error.message);
    } finally {
      button.disabled = false;
    }
  });
}

function filterOptions(key, label, values) {
  return `<fieldset><legend>${label}</legend>${values
    .map(
      (value) =>
        `<label class="check"><input type="checkbox" name="${
          key
        }" value="${text(value)}">${text(value)}</label>`,
    )
    .join('')}</fieldset>`;
}

function showBundle() {
  const groups = Object.groupBy(
    Object.entries(scenarios),
    ([, scenario]) => scenario.group,
  );
  const categories = [
    ...new Set(goods.map((product) => product.category)),
  ].sort((a, b) => a.localeCompare(b, 'ru'));
  showDialog(
    `<h2>Собрать комплект</h2>
    <p class="bundle-intro">Выберите задачу или укажите свои типы товаров, затем задайте общий бюджет.</p>
    <form class="bundle-form" novalidate>
      <label class="field">
        <span>Для чего подбираем</span>
        <select name="scenario">
          ${Object.entries(groups)
            .map(
              ([group, options]) => `
            <optgroup label="${group}">
              ${options.map(([key, scenario]) => `<option value="${key}">${scenario.name}</option>`).join('')}
            </optgroup>`,
            )
            .join('')}
          <option value="custom">Свой комплект</option>
        </select>
      </label>
      ${field('Бюджет, ₽', 'budget', 'number', 'required min="1" step="1" value="10000"')}
      <button class="primary" type="submit">Подобрать</button>
      <div class="bundle-options bundle-roles"></div>
      <div class="bundle-options bundle-custom" hidden>
        ${filterOptions('category', 'Выберите от 2 до 4 типов товаров', categories)}
      </div>
    </form>
    <div class="bundle-result"></div>
    <p class="bundle-status" role="status"></p>`,
    'bundle-dialog',
  );

  const form = dialog.querySelector('form');
  const custom = form.querySelector('.bundle-custom');
  const roles = form.querySelector('.bundle-roles');
  const result = dialog.querySelector('.bundle-result');
  const status = dialog.querySelector('.bundle-status');
  let hasSearched = false;
  const renderRoles = () => {
    const scenario = scenarios[form.elements.scenario.value];
    custom.hidden = Boolean(scenario);
    roles.hidden = !scenario;
    roles.innerHTML = scenario
      ? `<fieldset><legend>Что включить в комплект</legend>
        ${scenario.roles
          .map(
            (role, index) => `<label class="check">
          <input type="checkbox" name="role" value="${index}" checked>${text(role.label)}
        </label>`,
          )
          .join('')}
        </fieldset>`
      : '';
  };
  renderRoles();
  form.elements.scenario.focus();
  form.addEventListener('input', (event) => {
    const name = event.target.name;
    if (name === 'scenario') {
      renderRoles();
    }
    result.replaceChildren();
    status.textContent = '';
    const budget = form.elements.budget;
    budget.removeAttribute('aria-invalid');
    budget.closest('.field').querySelector('.field-error').textContent = '';
    if (name === 'role' && hasSearched) {
      form.requestSubmit();
    } else {
      hasSearched = false;
    }
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    result.replaceChildren();
    status.textContent = '';
    const budget = form.elements.budget;
    const amount = budget.valueAsNumber;
    if (!budget.validity.valid || !Number.isSafeInteger(amount)) {
      budget.setAttribute('aria-invalid', 'true');
      budget.closest('.field').querySelector('.field-error').textContent =
        'Укажите бюджет в целых рублях больше нуля.';
      budget.focus();
      return;
    }

    const key = form.elements.scenario.value;
    const formData = new FormData(form);
    const chosenCategories = formData.getAll('category');
    if (
      key === 'custom' &&
      (chosenCategories.length < 2 || chosenCategories.length > 4)
    ) {
      status.textContent =
        'Для своего комплекта выберите от 2 до 4 типов товаров.';
      custom.querySelector('input').focus();
      return;
    }
    const pickedRoles = formData.getAll('role').map(Number);
    hasSearched = true;
    if (key !== 'custom' && !pickedRoles.length) {
      status.textContent = 'Оставьте хотя бы одну позицию в комплекте.';
      return;
    }
    const scenario =
      key === 'custom'
        ? customScenario(chosenCategories)
        : {roles: pickedRoles.map((index) => scenarios[key].roles[index])};
    const {best, minimum} = findBundle(goods, scenario, amount);
    if (!best) {
      status.textContent = Number.isFinite(minimum)
        ? `В бюджет не уложиться. Минимальная стоимость комплекта — ${money(
            minimum,
          )}.`
        : 'Сейчас в каталоге нет всех товаров для этого комплекта.';
      return;
    }
    result.innerHTML = `
      <ul class="bundle-items">
        ${best.products
          .map(
            (product, index) => `
          <li>
            <div class="bundle-photo">${productImage(product)}</div>
            <div><small>${scenario.roles[index].label}</small><strong>${text(product.name)}</strong></div>
            <span>${money(product.price)}</span>
          </li>`,
          )
          .join('')}
      </ul>
      <div class="bundle-summary">
        <strong>Итого ${money(best.total)}</strong>
        <button type="button" class="primary">Добавить комплект в корзину</button>
        <a href="/cart" hidden>Перейти в корзину</a>
      </div>`;
    status.textContent = `Комплект подобран. ${
      amount === best.total
        ? 'Бюджет использован полностью.'
        : `Остаток бюджета — ${money(amount - best.total)}.`
    }`;
    const add = result.querySelector('button');
    add.addEventListener('click', () => {
      const ids = best.products.map((product) => product.id);
      if (ids.some((id) => (cart[id] || 0) >= 99)) {
        status.textContent =
          'В корзине уже 99 единиц одного из товаров комплекта.';
        return;
      }
      for (const id of ids) {
        cart[id] = (cart[id] || 0) + 1;
      }
      saveCart();
      for (const id of ids) {
        refreshCartControls(id);
      }
      const link = result.querySelector('a');
      link.hidden = false;
      link.focus();
      add.hidden = true;
      status.textContent = 'Комплект добавлен в корзину.';
    });
  });
}

function catalog() {
  const values = (key) =>
    [...new Set(goods.map((product) => product[key]))].sort((a, b) =>
      a.localeCompare(b, 'ru'),
    );
  main.innerHTML =
    `<div class="wrap catalog"><div class="catalog-heading"><h1>Каталог товаров</h1>` +
    `<button type="button" class="bundle-trigger" data-action="bundle">Собрать комплект</button></div>` +
    `<div class="catalog-layout">` +
    `<div><label class="sort">Сортировка <select id="sort">` +
    `<option value="release:desc">Сначала новые</option><option value="release:asc">Сначала старые</option>` +
    `<option value="popularity:desc">Сначала популярные</option><option value="popularity:asc">Сначала менее популярные</option>` +
    `<option value="price:asc">Сначала дешевле</option><option value="price:desc">Сначала дороже</option>` +
    `</select></label><div id="results"></div><nav id="pagination" class="pagination" aria-label="Страницы каталога"></nav></div>` +
    `<form id="filters" class="filters"><fieldset><legend>Цена, ₽</legend><div class="range">${field(
      'От',
      'min',
      'number',
      'min="0" placeholder="0"',
    )}${field(
      'До',
      'max',
      'number',
      'min="0" placeholder="150000"',
    )}</div></fieldset><p id="filter-error" class="field-error" aria-live="polite"></p>${filterOptions(
      'types',
      'Тип товара',
      values('category'),
    )}${filterOptions(
      'colors',
      'Цвет',
      values('color'),
    )}<div class="filter-actions"><button type="submit" class="primary">Показать</button>` +
    `<button type="reset" class="plain danger">Сбросить</button></div></form></div></div>`;
  const form = main.querySelector('#filters');
  const error = main.querySelector('#filter-error');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const min = Number(data.get('min'));
    const max = data.get('max') ? Number(data.get('max')) : Infinity;
    if (min > max) {
      error.textContent = 'Цена «От» должна быть меньше или равна цене «До».';
      return;
    }
    error.textContent = '';
    filters = {
      min,
      max,
      types: data.getAll('types'),
      colors: data.getAll('colors'),
    };
    visiblePage = 1;
    renderResults();
  });
  form.addEventListener('reset', () => {
    error.textContent = '';
    filters = {min: 0, max: Infinity, types: [], colors: []};
    visiblePage = 1;
    renderResults();
  });
  main.querySelector('#sort').addEventListener('change', (event) => {
    sort = event.target.value;
    visiblePage = 1;
    renderResults();
  });
  renderResults();
}

function renderResults() {
  const [key, direction] = sort.split(':');
  const results = goods.filter(
    (product) =>
      product.price >= filters.min &&
      product.price <= filters.max &&
      (!filters.types.length || filters.types.includes(product.category)) &&
      (!filters.colors.length || filters.colors.includes(product.color)),
  );
  results.sort(
    (first, second) =>
      (direction === 'asc' ? 1 : -1) * (first[key] - second[key]) ||
      first.id - second.id,
  );
  const offset = (visiblePage - 1) * pageSize;
  const container = document.querySelector('#results');
  container.innerHTML = results.length
    ? `<div class="product-grid">${results
        .slice(offset, offset + pageSize)
        .map((product) => productCard(product, true))
        .join('')}</div>`
    : '<p class="empty-results" role="status">Товары по вашему запросу не найдены.</p>';
  const total = Math.ceil(results.length / pageSize);
  const pages = [];
  for (let number = 1; number <= total; number++) {
    if (number <= 3 || number === total || number === visiblePage) {
      pages.push(number);
    }
  }
  const pageButton = (number, label = number, aria = `Страница ${number}`) =>
    `<button type="button" data-action="page" data-id="${number}" aria-label="${
      aria
    }"${number === visiblePage ? ' aria-current="page"' : ''}>${
      label
    }</button>`;
  document.querySelector('#pagination').innerHTML =
    total > 1
      ? pages
          .map(
            (number, index) =>
              (index && number - pages[index - 1] > 1 ? '<span>…</span>' : '') +
              pageButton(number),
          )
          .join('') +
        (visiblePage < total
          ? pageButton(visiblePage + 1, '›', 'Следующая страница')
          : '')
      : '';
}

function cartPage() {
  main.className = 'cart-page';
  main.innerHTML =
    '<div class="wrap cart"><h1 class="sr-only">Корзина и заказы</h1>' +
    '<nav class="tabs" aria-label="Разделы корзины"><a href="/cart">Корзина</a>' +
    '<a href="/cart?tab=history">История заказов</a></nav><div id="cart-content"></div></div>';
  const history = new URLSearchParams(location.search).get('tab') === 'history';
  document
    .querySelectorAll('.tabs a')
    .item(Number(history))
    .setAttribute('aria-current', 'page');
  if (history) {
    showHistory();
  } else {
    renderCartRows();
  }
}

async function showHistory() {
  const holder = document.querySelector('#cart-content');
  holder.innerHTML = '<p role="status">Загружаем заказы…</p>';
  try {
    const orders = await api('/orders');
    holder.innerHTML = orders.length
      ? `<div class="panel order-history"><table><thead><tr>` +
        `<th scope="col">Заказ и дата</th><th scope="col">Количество</th><th scope="col">Стоимость</th></tr></thead><tbody>${orders
          .map(
            (order) =>
              `<tr><td>№ ${order.id} от ${dateFormat.format(
                new Date(order.createdAt),
              )}</td><td>${order.count}</td><td>${money(
                order.total,
              )}</td></tr>`,
          )
          .join('')}</tbody></table></div>`
      : '<div class="panel">История заказов пока пуста.</div>';
  } catch (error) {
    holder.textContent = error.message;
  }
}

function renderCartRows() {
  const holder = document.querySelector('#cart-content');
  const items = goods.filter((product) => cart[product.id]);
  if (!items.length) {
    holder.innerHTML =
      `<section class="cart-empty">${icon('card')}<h2>Пока пусто</h2>` +
      `<p>Ознакомьтесь с новинками и хитами на главной или найдите нужное в каталоге.</p>` +
      `<a class="primary" href="/catalog">Перейти в каталог</a> <a href="/">Главная страница</a></section>`;
    return;
  }
  if (!holder.querySelector('#cart-list')) {
    holder.innerHTML =
      `<section class="panel" id="cart-list" aria-label="Товары в корзине"></section>` +
      `<h2 class="checkout-title">Оформление заказа</h2><form id="checkout" class="panel checkout-form" novalidate>` +
      `<div class="checkout-contact">${field(
        'Телефон *',
        'phone',
        'tel',
        'required autocomplete="tel" maxlength="25"',
      )}${field(
        'E-mail',
        'email',
        'email',
        'autocomplete="email" maxlength="120"',
      )}</div>` +
      `<fieldset class="delivery"><legend class="sr-only">Получение заказа</legend>` +
      `<label class="check"><input type="radio" name="delivery" value="pickup" checked>Самовывоз</label>` +
      `<label class="check"><input type="radio" name="delivery" value="delivery">Доставка</label></fieldset>` +
      `<div id="delivery-address" class="delivery-address" hidden>${field(
        'Адрес доставки *',
        'address',
        'text',
        'autocomplete="street-address" maxlength="300" disabled',
      )}</div>` +
      `<label class="field"><span>Способ оплаты *</span><select name="payment" required>` +
      `<option value="">Не выбрано</option><option value="card">По карте</option><option value="cash">Наличными</option>` +
      `</select><small class="field-error" aria-live="polite"></small></label>` +
      `<label class="check packaging"><input name="packaging" type="checkbox">Нужна упаковка</label>` +
      `<button class="primary" type="submit">Оформить заказ</button></form>`;
    const form = holder.querySelector('#checkout');
    form.addEventListener('change', () => {
      const delivery = form.elements.delivery.value === 'delivery';
      const address = form.elements.address;
      document.querySelector('#delivery-address').hidden = !delivery;
      address.disabled = !delivery;
      address.required = delivery;
      if (!delivery) {
        address.setAttribute('aria-invalid', 'false');
        address.closest('.field').querySelector('.field-error').textContent =
          '';
      }
    });
    form.addEventListener('submit', (event) => submitOrder(event, form));
  }

  const count = items.reduce((sum, product) => sum + cart[product.id], 0);
  const total = items.reduce(
    (sum, product) => sum + product.price * cart[product.id],
    0,
  );
  const list = holder.querySelector('#cart-list');
  list.innerHTML = `<div class="cart-select"><label class="check"><input type="checkbox" data-select="all"${
    items.every((product) => selected.has(product.id)) ? ' checked' : ''
  }>Выбрать все</label>${
    selected.size
      ? '<button class="plain danger" data-action="remove-selected">Удалить выбранные</button>'
      : ''
  }</div>${items
    .map(
      (product) =>
        `<article class="cart-row"><input type="checkbox" data-select="${
          product.id
        }" aria-label="Выбрать: ${text(product.name)}"${
          selected.has(product.id) ? ' checked' : ''
        }>` +
        `<div class="cart-photo">${productImage(product)}</div><span>${text(
          product.name,
        )}</span>${quantityButtons(
          product.id,
          cart[product.id],
        )}<strong>${money(product.price * cart[product.id])}</strong>` +
        `<button class="plain danger" data-action="remove" data-id="${
          product.id
        }">× Удалить</button></article>`,
    )
    .join('')}<div class="cart-total">Товаров: ${count} · ${money(
    total,
  )}</div>`;
  list.querySelector('[data-select="all"]').indeterminate =
    selected.size > 0 && selected.size < items.length;
}

async function submitOrder(event, form) {
  event.preventDefault();
  if (checkoutPending) {
    return;
  }
  for (const key of ['phone', 'email', 'address']) {
    form.elements[key].value = form.elements[key].value.trim();
  }
  if (!checkFields(form)) {
    return;
  }
  const data = Object.fromEntries(new FormData(form));
  if (
    !/^[+\d() .-]{7,25}$/.test(data.phone) ||
    data.phone.replace(/\D/g, '').length < 7
  ) {
    const phone = form.elements.phone;
    phone.setAttribute('aria-invalid', 'true');
    phone.closest('.field').querySelector('.field-error').textContent =
      'Укажите номер телефона.';
    phone.focus();
    return;
  }
  data.packaging = form.elements.packaging.checked;
  data.items = Object.entries(cart).map(([id, quantity]) => ({
    id: Number(id),
    quantity,
  }));
  checkoutPending = true;
  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  try {
    const order = await api('/orders', data);
    cart = {};
    selected.clear();
    saveCart();
    renderCartRows();
    message(
      'Спасибо, ваш заказ успешно оформлен',
      `Номер заказа: ${order.id}.`,
    );
  } catch (error) {
    message('Не удалось оформить заказ', error.message);
  } finally {
    checkoutPending = false;
    button.disabled = false;
  }
}

function confirmRemove(ids) {
  showDialog(
    `<h2>Вы уверены, что хотите удалить?</h2><div class="dialog-actions">` +
      `<button class="plain danger" data-action="close">Отмена</button>` +
      `<button class="primary" data-action="confirm-remove" data-ids="${ids.join(
        ',',
      )}">Да, удалить</button></div>`,
  );
}

function applyQuantity(button, id) {
  const next = (cart[id] || 0) + Number(button.dataset.delta);
  if (next < 1 && page === '/cart') {
    confirmRemove([id]);
    return;
  }
  if (next > 0) {
    cart[id] = Math.min(99, next);
  } else {
    delete cart[id];
  }
  saveCart();
  if (page === '/cart') {
    renderCartRows();
    main
      .querySelector(
        `button[data-id="${id}"][data-delta="${button.dataset.delta}"]`,
      )
      ?.focus();
  } else {
    const active = button.closest('[data-controls]');
    refreshCartControls(id);
    (
      active.querySelector(`[data-delta="${button.dataset.delta}"]:enabled`) ??
      active.querySelector('button:enabled')
    )?.focus();
  }
}

function refreshCartControls(id) {
  for (const group of document.querySelectorAll(`[data-controls="${id}"]`)) {
    group.innerHTML = cartControls(id);
  }
}

document.addEventListener('click', async (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) {
    return;
  }
  const {action, id} = button.dataset;
  if (
    checkoutPending &&
    [
      'logout',
      'quantity',
      'remove',
      'remove-selected',
      'confirm-remove',
    ].includes(action)
  ) {
    return;
  }
  if (action === 'logout') {
    button.disabled = true;
    try {
      await api('/logout', {});
      location.assign('/');
    } catch (error) {
      message('Не удалось выйти', error.message);
      button.disabled = false;
    }
  } else if (action === 'product') {
    showProduct(Number(id));
  } else if (action === 'bundle') {
    showBundle();
  } else if (action === 'close') {
    dialog.close();
  } else if (action === 'quantity') {
    applyQuantity(button, Number(id));
  } else if (action === 'page') {
    visiblePage = Number(id);
    renderResults();
    document.querySelector('#pagination [aria-current]')?.focus();
    document.querySelector('.catalog').scrollIntoView({block: 'start'});
  } else if (action === 'remove') {
    confirmRemove([Number(id)]);
  } else if (action === 'remove-selected') {
    confirmRemove([...selected]);
  } else if (action === 'confirm-remove') {
    for (const item of button.dataset.ids.split(',').map(Number)) {
      delete cart[item];
      selected.delete(item);
    }
    saveCart();
    dialog.close();
    renderCartRows();
  }
});

main.addEventListener('change', (event) => {
  const {select} = event.target.dataset;
  if (!select) {
    return;
  }
  if (select === 'all') {
    selected.clear();
    if (event.target.checked) {
      for (const id of Object.keys(cart)) {
        selected.add(Number(id));
      }
    }
  } else if (event.target.checked) {
    selected.add(Number(select));
  } else {
    selected.delete(Number(select));
  }
  renderCartRows();
  main.querySelector(`[data-select="${select}"]`)?.focus();
});

main.addEventListener('input', (event) => {
  const input = event.target;
  if (!input.matches('.field [aria-invalid="true"]')) {
    return;
  }
  input.setAttribute('aria-invalid', 'false');
  input.closest('.field').querySelector('.field-error').textContent = '';
});

async function start() {
  username = (await api('/session')).username;
  if (!username && (page === '/cart' || page === '/catalog')) {
    location.replace('/login');
    return;
  }
  if (username && page === '/login') {
    location.replace('/');
    return;
  }
  if (username) {
    cart = readCart();
  }
  headerMarkup();
  const names = {'/login': 'Вход', '/cart': 'Корзина', '/catalog': 'Каталог'};
  if (names[page]) {
    document.title = `${names[page]} · Gadget Hub`;
  }
  if (page === '/') {
    await home();
  }
  if (page === '/login') {
    login();
  }
  if (page === '/catalog' || page === '/cart') {
    goods = await api('/goods');
    const ids = new Set(goods.map((item) => String(item.id)));
    const entries = Object.entries(cart);
    cart = Object.fromEntries(entries.filter(([id]) => ids.has(id)));
    if (entries.length !== Object.keys(cart).length) {
      saveCart();
    }
    if (page === '/catalog') {
      catalog();
    } else {
      cartPage();
    }
  }
}

start()
  .catch((error) => {
    if (!header.children.length) {
      headerMarkup();
    }
    const holder = document.querySelector('#features') ?? main;
    holder.innerHTML = `<div class="wrap service-error" role="alert"><h1>Не удалось загрузить данные</h1><p>${text(
      error.message,
    )}</p><p>Проверьте, запущен ли сервер Gadget Hub API на порту 8080.</p></div>`;
  })
  .finally(() => main.setAttribute('aria-busy', 'false'));

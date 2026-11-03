/* main.js — интерфейс (использует model.js) */
import {
  ClothingItem,
  SIZES,
  catalog,
  runAsync,
  groupBySize,
  getUniqueColors,
  getItemsByColor,
  groupByColorsCount,
  getItemsWithMoreColors,
} from './model.js';

window.addEventListener('pagehide', () => catalog.save());
window.addEventListener('beforeunload', () => catalog.save());

const $ = (s) => document.querySelector(s);
const LIST = '[data-testid="entity-list"]';
const ITEM_FORM = '[data-testid="entity-form"]';
const esc = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (ch) =>
      ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'})[
        ch
      ],
  );

/* Цвета*/
const RU_COLORS = {
  красный: 'red',
  синий: 'royalblue',
  зелёный: 'green',
  зеленый: 'green',
  чёрный: 'black',
  черный: 'black',
  белый: 'white',
  жёлтый: 'gold',
  желтый: 'gold',
  серый: 'gray',
  розовый: 'hotpink',
  фиолетовый: 'purple',
  оранжевый: 'orange',
  коричневый: 'saddlebrown',
  бежевый: '#e1c9a1',
  голубой: 'skyblue',
  бордовый: '#6d1a2a',
  хаки: '#78866b',
};
function swatch(c) {
  const v = RU_COLORS[c] || (CSS.supports('color', c) ? c : null);
  return `<span class="dot"${v ? ` style="background:${esc(v)}"` : ''}></span>`;
}

/* Отрисовка*/
function cardHTML(it) {
  const chips =
    it.colors
      .map((c) => `<span class="chip">${swatch(c)}${esc(c)}</span>`)
      .join('') || '<span class="meta">Цветов пока нет</span>';
  const opts = it.colors.map((c) => `<option>${esc(c)}</option>`).join('');
  const dis = it.colorsCount ? '' : ' disabled';
  return (
    `<article class="card" data-testid="entity-card" data-id="${it.id}">` +
    `<header><h3>${esc(it.name)}</h3><span class="size">${esc(
      it.size,
    )}</span></header>` +
    `<div class="meta">ID ${it.id} · цветов: ${it.colorsCount}</div>` +
    `<div class="chips">${chips}</div>` +
    `<div class="row"><button data-action="add-color">Добавить цвет</button></div>` +
    `<div class="row"><select aria-label="Цвет для удаления"${dis}>${
      opts
    }</select>` +
    `<button class="danger" data-action="remove-color"${
      dis
    }>Удалить цвет</button></div>` +
    `<div class="row"><button class="danger" data-action="remove-item" data-testid="delete-entity">Удалить товар</button></div>` +
    `</article>`
  );
}
function render() {
  const items = catalog.items;
  $(LIST).innerHTML = items.map(cardHTML).join(''); // пустой список показывает CSS (:empty)

  const sel = $('#colorItem');
  const prev = sel.value;
  sel.innerHTML = items
    .map((it) => `<option value="${it.id}">${it.id} — ${esc(it.name)}</option>`)
    .join('');
  if (items.some((it) => String(it.id) === prev)) {
    sel.value = prev;
  }
}

let msgTimer;
function say(text, isErr = false) {
  const m = $('#msg');
  m.textContent = text;
  m.className = isErr ? 'err' : '';
  clearTimeout(msgTimer);
  if (!isErr && text) {
    msgTimer = setTimeout(() => {
      m.textContent = '';
    }, 3000);
  }
}

/* Выполнение операции асинхронно, с блокировкой кнопок */
let busy = false;
async function perform(label, fn) {
  if (busy) {
    return say('Подождите, предыдущая операция ещё выполняется…');
  }
  busy = true;
  document.querySelectorAll('button').forEach((b) => (b.disabled = true));
  say(`Выполняется: ${label}…`);
  try {
    const done = await runAsync(fn);
    catalog.save();
    say(done || 'Готово');
    return true;
  } catch (e) {
    say(e.message, true);
    return false;
  } finally {
    busy = false;
    render(); // карточки пересоздаются их кнопки снова активны
    document
      .querySelectorAll(`${ITEM_FORM} button, #colorForm button, [data-report]`)
      .forEach((b) => (b.disabled = false));
  }
}

/* Операции*/
const addItem = (id, name, size) =>
  perform('добавление товара', () => {
    if (!Number.isInteger(id) || id < 1) {
      throw new Error('ID должен быть целым числом больше 0');
    }
    if (!name.trim()) {
      throw new Error('Введите название товара');
    }
    if (!SIZES.includes(size)) {
      throw new Error('Размер: S, M, L или XL');
    }
    if (catalog.find(id)) {
      throw new Error(`Товар с ID ${id} уже существует`);
    }
    catalog.items.push(new ClothingItem(id, name.trim(), size));
    return `Товар «${name.trim()}» добавлен`;
  });

const removeItem = (id) =>
  perform('удаление товара', () => {
    const i = catalog.items.findIndex((it) => it.id === Number(id));
    if (i === -1) {
      throw new Error('Товар не найден');
    }
    const [gone] = catalog.items.splice(i, 1);
    return `Товар «${gone.name}» удалён`;
  });

const addColor = (id, color) =>
  perform('добавление цвета', () => {
    const it = catalog.find(id);
    if (!it) {
      throw new Error('Выберите товар');
    }
    it.addColor(color);
    return 'Цвет добавлен';
  });

const removeColor = (id, color) =>
  perform('удаление цвета', () => {
    const it = catalog.find(id);
    if (!it) {
      throw new Error('Товар не найден');
    }
    it.removeColor(color);
    return 'Цвет удалён';
  });

/* Обработчики событий*/
$(ITEM_FORM).addEventListener('submit', async (e) => {
  e.preventDefault();
  const f = e.target;
  const d = new FormData(f); // не f.id / f.name у <form> это встроенные свойства
  if (await addItem(Number(d.get('id')), d.get('name'), d.get('size'))) {
    f.reset();
  }
});

$('#colorForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const f = e.target;
  const d = new FormData(f);
  if (await addColor(d.get('id'), d.get('color'))) {
    f.elements.color.value = '';
  }
});

$(LIST).addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-action]');
  if (!btn) {
    return;
  }
  const card = btn.closest('.card');
  const id = card.dataset.id;
  switch (btn.dataset.action) {
    case 'add-color':
      $('#colorItem').value = id;
      $('#colorInput').focus();
      $('#colorForm').scrollIntoView({behavior: 'smooth', block: 'center'});
      break;
    case 'remove-color':
      removeColor(id, card.querySelector('select').value);
      break;
    case 'remove-item':
      removeItem(id);
      break;
  }
});

/* Отчёты (функции из 4.2)*/
const nameList = (list) =>
  list.length
    ? `<ul>${list
        .map((it) => `<li>${esc(it.name)} (ID ${it.id})</li>`)
        .join('')}</ul>`
    : 'Ничего не найдено';

const groupHTML = (title, obj) =>
  Object.keys(obj).length
    ? Object.entries(obj)
        .map(
          ([k, v]) =>
            `<div class="res"><b>${esc(title)} ${esc(k)}</b>${nameList(
              v,
            )}</div>`,
        )
        .join('')
    : '<div class="res">Каталог пуст</div>';

function report(kind) {
  const items = catalog.items;
  const out = $('#results');
  if (kind === 'size') {
    out.innerHTML = groupHTML('Размер', groupBySize(items));
  }
  if (kind === 'count') {
    out.innerHTML = groupHTML('Цветов:', groupByColorsCount(items));
  }
  if (kind === 'unique') {
    const u = getUniqueColors(items);
    out.innerHTML = `<div class="res"><b>Уникальных цветов: ${u.length}</b>${
      u.length
        ? u
            .map((c) => `<span class="chip">${swatch(c)}${esc(c)}</span> `)
            .join('')
        : 'Нет цветов'
    }</div>`;
  }
  if (kind === 'color') {
    const c = $('#byColor').value;
    out.innerHTML = `<div class="res"><b>В цвете «${esc(
      c.trim(),
    )}»</b>${nameList(getItemsByColor(items, c))}</div>`;
  }
  if (kind === 'more') {
    const n = Number($('#minN').value);
    out.innerHTML = `<div class="res"><b>Больше ${n} цветов</b>${nameList(
      getItemsWithMoreColors(items, n),
    )}</div>`;
  }
}

$('#reportRow').addEventListener('click', (e) => {
  const b = e.target.closest('[data-report]');
  if (b) {
    report(b.dataset.report);
  }
});

render();

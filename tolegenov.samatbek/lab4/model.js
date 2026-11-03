/* model.js — данные и логика (без работы с DOM) */

/* 4.1 Класс */
export class ClothingItem {
  constructor(id, name, size, colors = []) {
    this.id = id;
    this.name = name;
    this.size = size;
    this.colors = [];
    colors.forEach((c) => this.addColor(c));
  }

  static norm(color) {
    return String(color).trim().toLowerCase();
  }

  addColor(color) {
    const c = ClothingItem.norm(color);
    if (!c) {
      throw new Error('Введите цвет');
    }
    if (this.colors.includes(c)) {
      throw new Error(`Цвет «${c}» уже есть у этого товара`);
    }
    this.colors.push(c);
  }

  removeColor(color) {
    const i = this.colors.indexOf(ClothingItem.norm(color));
    if (i === -1) {
      throw new Error('Такого цвета нет у товара');
    }
    this.colors.splice(i, 1);
  }

  get colorsCount() {
    return this.colors.length;
  }
}

/* 4.2 Функции над массивом товаров */
export const groupItemsBySize = (items) =>
  items.reduce((acc, it) => ((acc[it.size] ||= []).push(it), acc), {});

export const getUniqueColors = (items) => [
  ...new Set(items.flatMap((it) => it.colors)),
];

export const findItemsByColor = (items, color) => {
  const c = ClothingItem.norm(color);
  return items.filter((it) => it.colors.includes(c));
};

export const groupItemsByColorCount = (items) =>
  items.reduce((acc, it) => ((acc[it.colorsCount] ||= []).push(it), acc), {});

export const findItemsAboveColorCount = (items, n) =>
  items.filter((it) => it.colorsCount > n);

/* Прежние имена, чтобы main.js работал без правок */
export const groupBySize = groupItemsBySize;
export const getItemsByColor = findItemsByColor;
export const groupByColorsCount = groupItemsByColorCount;
export const getItemsWithMoreColors = findItemsAboveColorCount;

/* Асинхронность: Promise + setTimeout*/
export const delay = (ms = 400) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const runAsync = async (fn) => {
  await delay();
  return fn();
};

/* Хранилище (localStorage) */
export const STORAGE_KEY = 'clothing-catalog-v1';
export const SIZES = ['S', 'M', 'L', 'XL'];

export const catalog = {
  items: [],

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
    } catch {
      // localStorage недоступен
    }
  },

  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw).map(
          (o) => new ClothingItem(o.id, o.name, o.size, o.colors),
        );
      }
    } catch {
      // пусто или данные повреждены
    }
    return null;
  },

  init() {
    this.items = this.load() || [
      new ClothingItem(1, 'Футболка базовая', 'M', [
        'белый',
        'чёрный',
        'серый',
      ]),
      new ClothingItem(2, 'Худи оверсайз', 'L', ['синий', 'чёрный']),
      new ClothingItem(3, 'Джинсы прямые', 'M', ['синий']),
      new ClothingItem(4, 'Куртка демисезонная', 'XL', [
        'зелёный',
        'чёрный',
        'бежевый',
        'красный',
      ]),
      new ClothingItem(5, 'Поло', 'S', ['белый', 'голубой']),
    ];
  },

  find(id) {
    return this.items.find((it) => it.id === Number(id));
  },
};

catalog.init();

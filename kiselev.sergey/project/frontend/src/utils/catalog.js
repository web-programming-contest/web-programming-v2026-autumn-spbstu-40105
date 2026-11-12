export const PAGE_SIZE = 9;

export const TYPE_LABELS = {
  smartphone: 'Смартфоны',
  watch: 'Умные часы',
  fitness: 'Фитнес браслеты',
  headphones: 'Наушники',
  headset: 'Гарнитуры',
  speaker: 'Портативная акустика',
  microphone: 'Микрофоны',
  camera: 'Камеры',
  powerbank: 'Внешние аккумуляторы',
  case: 'Чехлы',
  'smart-home': 'Умный дом',
  security: 'Безопасность',
  vr: 'Очки виртуальной реальности',
  transport: 'Электротранспорт',
  health: 'Здоровье',
};

export const COLOR_LABELS = {
  red: 'Красный',
  orange: 'Оранжевый',
  yellow: 'Желтый',
  green: 'Зеленый',
  'light-blue': 'Голубой',
  blue: 'Синий',
  purple: 'Фиолетовый',
  pink: 'Розовый',
  beige: 'Бежевый',
  white: 'Белый',
  gray: 'Серый',
  black: 'Черный',
};

export const SORT_OPTIONS = [
  {value: 'new', label: 'Новые', isReversible: true},
  {value: 'popular', label: 'Популярные', isReversible: true},
  {value: 'cheap', label: 'Подешевле'},
  {value: 'expensive', label: 'Подороже'},
];

export const DEFAULT_SORT = {value: 'new', isReversed: false};

const COMPARATORS = {
  new: (a, b) =>
    Number(b.isNew) - Number(a.isNew) || b.createdAt.localeCompare(a.createdAt),
  popular: (a, b) => b.popularity - a.popularity,
  cheap: (a, b) => a.price - b.price,
  expensive: (a, b) => b.price - a.price,
};

export const EMPTY_FILTERS = {
  priceFrom: '',
  priceTo: '',
  types: [],
  colors: [],
};

export function getAvailable(goods, key, labels) {
  const present = new Set(goods.map((item) => item[key]));

  return Object.keys(labels).filter((value) => present.has(value));
}

export function getPriceBounds(goods) {
  if (goods.length === 0) {
    return {min: 0, max: 0};
  }

  const prices = goods.map((item) => item.price);

  return {min: Math.min(...prices), max: Math.max(...prices)};
}

export function filterGoods(goods, filters) {
  const priceFrom = filters.priceFrom === '' ? 0 : Number(filters.priceFrom);
  const priceTo = filters.priceTo === '' ? Infinity : Number(filters.priceTo);

  return goods.filter(
    (item) =>
      item.price >= priceFrom &&
      item.price <= priceTo &&
      (filters.types.length === 0 || filters.types.includes(item.type)) &&
      (filters.colors.length === 0 || filters.colors.includes(item.color)),
  );
}

export function sortGoods(goods, {value, isReversed}) {
  const compare = COMPARATORS[value];

  return [...goods].sort((a, b) =>
    isReversed ? compare(b, a) : compare(a, b),
  );
}

export function getPageItems(page, pageCount) {
  if (pageCount <= 3) {
    return Array.from({length: pageCount}, (_, index) => index + 1);
  }

  const pages = [...new Set([1, 2, 3, page, pageCount])].sort((a, b) => a - b);
  const items = [];

  pages.forEach((number, index) => {
    if (index > 0 && number - pages[index - 1] > 1) {
      items.push(`ellipsis-${number}`);
    }

    items.push(number);
  });

  return items;
}

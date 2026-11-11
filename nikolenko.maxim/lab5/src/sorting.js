export const SORT_OPTIONS = [
  {key: 'title', label: 'Название'},
  {key: 'price', label: 'Цена'},
  {key: 'rating', label: 'Рейтинг'},
];

export const DIRECTION_ARROWS = {
  asc: '↑',
  desc: '↓',
};

export const DIRECTION_NAMES = {
  asc: 'по возрастанию',
  desc: 'по убыванию',
};

export const INITIAL_SORT = {key: null, direction: null};

/**
 * Следующее состояние сортировки после клика по кнопке:
 * не задано → по возрастанию → по убыванию → не задано.
 * Клик по другой кнопке начинает цикл с возрастания.
 */
export function getNextSort(current, key) {
  if (current.key !== key || current.direction === null) {
    return {key, direction: 'asc'};
  }

  if (current.direction === 'asc') {
    return {key, direction: 'desc'};
  }

  return INITIAL_SORT;
}

function compareByKey(first, second, key) {
  if (key === 'title') {
    return first.title.localeCompare(second.title, 'ru');
  }

  return first[key] - second[key];
}

/**
 * Возвращает новый массив. Без активной сортировки сохраняется исходный порядок.
 * Равные элементы всегда идут в исходном порядке, независимо от направления.
 */
export function sortBooks(books, {key, direction}) {
  if (key === null || direction === null) {
    return books;
  }

  const factor = direction === 'asc' ? 1 : -1;

  return [...books].sort((first, second) => {
    const result = compareByKey(first, second, key);

    return result === 0 ? first.id - second.id : result * factor;
  });
}

const priceFormatter = new Intl.NumberFormat('ru-RU');

export function formatPrice(value) {
  return `${priceFormatter.format(value)} ₽`;
}

export function formatRating(value) {
  return value.toLocaleString('ru-RU', {maximumFractionDigits: 1});
}

const dateFormatter = new Intl.DateTimeFormat('ru-RU');

export function formatDate(value) {
  return dateFormatter.format(new Date(value));
}

export function pluralize(count, [one, few, many]) {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) {
    return one;
  }

  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return few;
  }

  return many;
}

export const GOODS_WORDS = ['товар', 'товара', 'товаров'];

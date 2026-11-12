const DELIVERY_TYPES = ['pickup', 'delivery'];

const PAYMENT_TYPES = ['card', 'cash'];

function isFilledString(value) {
  return typeof value === 'string' && value.trim() !== '';
}

export function validateOrder(body, goods) {
  const errors = [];
  const {contact, items} = body ?? {};

  if (!contact || typeof contact !== 'object') {
    return ['Не переданы данные покупателя'];
  }

  if (!isFilledString(contact.phone)) {
    errors.push('Не указан телефон');
  }

  if (!DELIVERY_TYPES.includes(contact.delivery)) {
    errors.push('Не выбран способ получения');
  } else if (
    contact.delivery === 'delivery' &&
    !isFilledString(contact.address)
  ) {
    errors.push('Не указан адрес доставки');
  }

  if (!PAYMENT_TYPES.includes(contact.payment)) {
    errors.push('Не выбран способ оплаты');
  }

  if (!Array.isArray(items) || items.length === 0) {
    errors.push('Корзина пуста');
    return errors;
  }

  const knownIds = new Set(goods.map((item) => item.id));
  const isValidItem = (item) =>
    knownIds.has(item?.id) &&
    Number.isInteger(item.quantity) &&
    item.quantity > 0;

  if (!items.every(isValidItem)) {
    errors.push('Некорректный список товаров');
  }

  return errors;
}

export function normalizeContact(contact) {
  return {
    email: typeof contact.email === 'string' ? contact.email.trim() : '',
    phone: contact.phone.trim(),
    delivery: contact.delivery,
    address: contact.delivery === 'delivery' ? contact.address.trim() : '',
    payment: contact.payment,
    needPackaging: Boolean(contact.needPackaging),
  };
}

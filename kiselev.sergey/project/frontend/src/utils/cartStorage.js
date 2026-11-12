const KEY_PREFIX = 'gadget-hub:cart:';

export function getCartKey(login) {
  return `${KEY_PREFIX}${login}`;
}

function isCartItem(item) {
  return (
    Number.isInteger(item?.id) &&
    Number.isInteger(item.quantity) &&
    item.quantity > 0
  );
}

export function readCart(key) {
  try {
    const items = JSON.parse(localStorage.getItem(key) ?? '[]');

    return Array.isArray(items) ? items.filter(isCartItem) : [];
  } catch {
    return [];
  }
}

export function writeCart(key, items) {
  try {
    if (items.length === 0) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(items));
    }
  } catch (error) {
    console.error('Не удалось сохранить корзину', error);
  }
}

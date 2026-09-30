import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'gadget-hub-cart';

// Корзина хранит только { id товара, количество } — сами данные товара
// (название, цена, картинка) всегда берутся из уже загруженного списка
// /goods по этому id. Так в localStorage не дублируются данные, которые
// в любой момент могут устареть (например, если бы цена товара изменилась).
function loadCartFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCartFromStorage);

  // Каждое изменение корзины сразу сохраняется в localStorage — так
  // требует методичка ("при добавлении или удалении товара соответствующие
  // данные в localStorage обновляются").
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function getQuantity(goodId) {
    return items.find((item) => item.goodId === goodId)?.quantity ?? 0;
  }

  function addItem(goodId) {
    setItems((current) => {
      const existing = current.find((item) => item.goodId === goodId);
      if (existing) {
        return current.map((item) =>
          item.goodId === goodId ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...current, { goodId, quantity: 1 }];
    });
  }

  function increment(goodId) {
    addItem(goodId);
  }

  function decrement(goodId) {
    setItems((current) =>
      current
        .map((item) =>
          item.goodId === goodId ? { ...item, quantity: item.quantity - 1 } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  function removeItem(goodId) {
    setItems((current) => current.filter((item) => item.goodId !== goodId));
  }

  function removeItems(goodIds) {
    setItems((current) => current.filter((item) => !goodIds.includes(item.goodId)));
  }

  function clearCart() {
    setItems([]);
  }

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const value = {
    items,
    totalCount,
    getQuantity,
    addItem,
    increment,
    decrement,
    removeItem,
    removeItems,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart должен использоваться внутри <CartProvider>');
  }
  return context;
}

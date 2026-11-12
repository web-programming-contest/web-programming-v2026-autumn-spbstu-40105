import {createContext, useContext, useEffect, useMemo, useState} from 'react';

import {getCartKey, readCart, writeCart} from '../utils/cartStorage.js';
import {useAuth} from './AuthContext.jsx';

const CartContext = createContext(null);

const EMPTY_CART = {key: null, items: []};

function changeQuantity(items, id, delta) {
  const exists = items.some((item) => item.id === id);

  if (!exists) {
    return delta > 0 ? [...items, {id, quantity: delta}] : items;
  }

  return items
    .map((item) =>
      item.id === id ? {...item, quantity: item.quantity + delta} : item,
    )
    .filter((item) => item.quantity > 0);
}

export function CartProvider({children}) {
  const {user} = useAuth();
  const key = user ? getCartKey(user.login) : null;
  const [cart, setCart] = useState(EMPTY_CART);

  if (cart.key !== key) {
    setCart(key ? {key, items: readCart(key)} : EMPTY_CART);
  }

  useEffect(() => {
    if (cart.key) {
      writeCart(cart.key, cart.items);
    }
  }, [cart]);

  const value = useMemo(() => {
    const update = (change) =>
      setCart((current) => ({...current, items: change(current.items)}));

    return {
      items: cart.items,
      totalCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
      getQuantity(id) {
        return cart.items.find((item) => item.id === id)?.quantity ?? 0;
      },
      increment(id) {
        update((items) => changeQuantity(items, id, 1));
      },
      decrement(id) {
        update((items) => changeQuantity(items, id, -1));
      },
      remove(ids) {
        const removed = new Set(ids);
        update((items) => items.filter((item) => !removed.has(item.id)));
      },
      clear() {
        update(() => []);
      },
    };
  }, [cart.items]);

  return <CartContext value={value}>{children}</CartContext>;
}

export function useCart() {
  return useContext(CartContext);
}

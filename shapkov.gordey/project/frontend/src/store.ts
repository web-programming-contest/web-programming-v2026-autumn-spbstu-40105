import {create} from 'zustand';
import {persist} from 'zustand/middleware';

export interface Product {
  id: number;
  name: string;
  price: number;
  rating?: number;
  category?: string;
  color?: string;
  labels?: string[];
  image?: string;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string | number;
  date: string;
  items: unknown[];
  total: number;
}

interface StoreState {
  user: string | null;
  token: string | null;
  cart: CartItem[];
  login: (username: string, token: string) => void;
  logout: () => void;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, delta: number) => void;
  clearCart: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      cart: [],
      login: (username, token) => set({user: username, token}),
      logout: () => set({user: null, token: null}),
      addToCart: (item) =>
        set((state) => {
          const existing = state.cart.find((i) => i.id === item.id);
          if (existing) {
            return {
              cart: state.cart.map((i) =>
                i.id === item.id ? {...i, quantity: i.quantity + 1} : i,
              ),
            };
          }
          return {cart: [...state.cart, {...item, quantity: 1}]};
        }),
      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((i) => i.id !== id),
        })),
      updateQuantity: (id, delta) =>
        set((state) => {
          const existing = state.cart.find((i) => i.id === id);
          if (!existing) {
            return state;
          }
          const newQty = existing.quantity + delta;
          if (newQty <= 0) {
            return {cart: state.cart.filter((i) => i.id !== id)};
          }
          return {
            cart: state.cart.map((i) =>
              i.id === id ? {...i, quantity: newQty} : i,
            ),
          };
        }),
      clearCart: () => set({cart: []}),
    }),
    {name: 'gadget-hub-storage'},
  ),
);

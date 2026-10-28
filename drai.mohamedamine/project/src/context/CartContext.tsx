import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useAuth } from './AuthContext'

export type CartItems = Record<number, number>

interface CartContextValue {
  items: CartItems
  count: number
  setQuantity: (productId: number, quantity: number) => void
  remove: (productId: number) => void
  removeMany: (productIds: number[]) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [items, setItems] = useState<CartItems>({})
  const storageKey = user ? `gadget-hub-cart-${user.id}` : null

  useEffect(() => {
    if (!storageKey) {
      setItems({})
      return
    }
    try {
      const saved = localStorage.getItem(storageKey)
      setItems(saved ? JSON.parse(saved) : {})
    } catch {
      setItems({})
    }
  }, [storageKey])

  useEffect(() => {
    if (storageKey) localStorage.setItem(storageKey, JSON.stringify(items))
  }, [items, storageKey])

  const setQuantity = useCallback((productId: number, quantity: number) => {
    setItems((current) => {
      const next = { ...current }
      if (quantity <= 0) delete next[productId]
      else next[productId] = Math.min(quantity, 99)
      return next
    })
  }, [])

  const remove = useCallback((productId: number) => setQuantity(productId, 0), [setQuantity])
  const removeMany = useCallback((productIds: number[]) => {
    setItems((current) => {
      const next = { ...current }
      productIds.forEach((id) => delete next[id])
      return next
    })
  }, [])
  const clear = useCallback(() => setItems({}), [])
  const count = Object.values(items).reduce((sum, quantity) => sum + quantity, 0)
  const value = useMemo(() => ({ items, count, setQuantity, remove, removeMany, clear }), [items, count, setQuantity, remove, removeMany, clear])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used inside CartProvider')
  return context
}

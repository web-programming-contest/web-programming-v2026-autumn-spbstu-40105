import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { api } from '@/lib/api'
import type { Product } from '@/types/store'

interface ProductContextValue {
  products: Product[]
  loading: boolean
  error: string
  reload: () => void
}

const ProductContext = createContext<ProductContextValue | null>(null)

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(() => {
    setLoading(true)
    setError('')
    api.products()
      .then(setProducts)
      .catch(() => setError('Не удалось загрузить каталог. Проверьте соединение и повторите попытку.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(load, [load])
  const value = useMemo(() => ({ products, loading, error, reload: load }), [products, loading, error, load])
  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
}

export function useProducts() {
  const context = useContext(ProductContext)
  if (!context) throw new Error('useProducts must be used inside ProductProvider')
  return context
}

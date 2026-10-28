import { Minus, Plus, ShoppingCart } from 'lucide-react'
import { useCart } from '@/context/CartContext'

export function QuantityControl({ productId, compact = false }: { productId: number; compact?: boolean }) {
  const { items, setQuantity } = useCart()
  const quantity = items[productId] || 0

  if (!quantity) {
    return (
      <button type="button" className={`button button--primary add-button ${compact ? 'add-button--compact' : ''}`} onClick={(event) => { event.stopPropagation(); setQuantity(productId, 1) }}>
        <ShoppingCart size={19} aria-hidden="true" />
        В корзину
      </button>
    )
  }

  return (
    <div className={`quantity ${compact ? 'quantity--compact' : ''}`} onClick={(event) => event.stopPropagation()} aria-label={`В корзине ${quantity} шт.`}>
      <button type="button" onClick={() => setQuantity(productId, quantity - 1)} aria-label="Уменьшить количество"><Minus size={18} /></button>
      <span><strong>{quantity}</strong> шт.</span>
      <button type="button" onClick={() => setQuantity(productId, quantity + 1)} disabled={quantity >= 99} aria-label="Увеличить количество"><Plus size={18} /></button>
    </div>
  )
}

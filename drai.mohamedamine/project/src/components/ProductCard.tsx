import { Star } from 'lucide-react'
import type { Product } from '@/types/store'
import { formatPrice } from '@/lib/format'
import { QuantityControl } from './QuantityControl'

interface ProductCardProps {
  product: Product
  onOpen?: (product: Product) => void
  withCart?: boolean
}

export function ProductCard({ product, onOpen, withCart = true }: ProductCardProps) {
  const open = () => onOpen?.(product)
  return (
    <article
      className={`product-card ${onOpen ? 'product-card--interactive' : ''}`}
      onClick={onOpen ? open : undefined}
      onKeyDown={onOpen ? (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open() } } : undefined}
      tabIndex={onOpen ? 0 : undefined}
      aria-label={onOpen ? `Подробнее: ${product.name}` : undefined}
    >
      <div className="product-card__image">
        <div className="product-card__labels">
          {product.is_new && <span className="label label--new">Новинка</span>}
          {product.is_hit && <span className="label label--hit">Хит</span>}
        </div>
        <img src={product.image} alt={product.name} loading="lazy" />
      </div>
      <div className="product-card__body">
        <div className="product-card__price">{formatPrice(product.price)}</div>
        <h3 className="product-card__name">{product.name}</h3>
        <div className="rating" aria-label={`Рейтинг ${product.rating} из 5`}>
          <Star size={19} fill="currentColor" aria-hidden="true" />
          <span>{String(product.rating).replace('.', ',')}</span>
        </div>
        {withCart && <QuantityControl productId={product.id} compact />}
      </div>
    </article>
  )
}

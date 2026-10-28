import { Star } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import type { Product } from '@/types/store'
import { formatPrice } from '@/lib/format'
import { QuantityControl } from './QuantityControl'

export function ProductModal({ product, onClose }: { product: Product | null; onClose: () => void }) {
  return (
    <Dialog open={Boolean(product)} onOpenChange={(open) => { if (!open) onClose() }}>
      {product && (
        <DialogContent className="product-modal" aria-describedby="product-description">
          <div className="product-modal__image">
            <div className="product-card__labels">
              {product.is_new && <span className="label label--new">Новинка</span>}
              {product.is_hit && <span className="label label--hit">Хит</span>}
            </div>
            <img src={product.image} alt={product.name} />
          </div>
          <div className="product-modal__content">
            <DialogTitle className="product-modal__title">{product.name}</DialogTitle>
            <DialogDescription id="product-description" className="product-modal__description">{product.description}</DialogDescription>
            <div className="rating" aria-label={`Рейтинг ${product.rating} из 5`}><Star size={20} fill="currentColor" />{String(product.rating).replace('.', ',')}</div>
            <h3>Характеристики</h3>
            <dl className="specs">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key}><dt>{key}</dt><dd>{value}</dd></div>
              ))}
              <div><dt>Цвет</dt><dd>{product.color_display}</dd></div>
            </dl>
            <div className="product-modal__purchase">
              <strong>{formatPrice(product.price)}</strong>
              <QuantityControl productId={product.id} />
            </div>
          </div>
        </DialogContent>
      )}
    </Dialog>
  )
}

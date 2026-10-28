import useEmblaCarousel from 'embla-carousel-react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import type { Product } from '@/types/store'
import { ProductCard } from './ProductCard'

export function ProductCarousel({ products }: { products: Product[] }) {
  const [ref, embla] = useEmblaCarousel({ loop: true, align: 'start' })
  return (
    <div className="carousel-wrap">
      <div className="carousel" ref={ref}>
        <div className="carousel__container">
          {products.map((product) => (
            <div className="carousel__slide" key={product.id}>
              <ProductCard product={product} withCart={false} />
            </div>
          ))}
        </div>
      </div>
      <div className="carousel__controls">
        <button type="button" className="icon-button" onClick={() => embla?.scrollPrev()} aria-label="Предыдущие товары"><ArrowLeft /></button>
        <button type="button" className="icon-button" onClick={() => embla?.scrollNext()} aria-label="Следующие товары"><ArrowRight /></button>
      </div>
    </div>
  )
}

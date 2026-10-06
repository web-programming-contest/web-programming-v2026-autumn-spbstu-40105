import ProductLabels from '../ProductLabels.jsx';
import Rating from '../Rating.jsx';
import {formatPrice} from '../../utils/format.js';
import CartControl from './CartControl.jsx';

export default function ProductCard({product, onOpen}) {
  return (
    <article className="product-card">
      <div className="preview-card-image">
        <img
          src={product.image}
          alt=""
          width="220"
          height="220"
          loading="lazy"
        />
        <ProductLabels product={product} className="preview-card-labels" />
      </div>
      <p className="preview-card-price">{formatPrice(product.price)}</p>
      <h3 className="preview-card-name" title={product.name}>
        <button
          type="button"
          className="product-card-open"
          onClick={() => onOpen(product)}
        >
          {product.name}
        </button>
      </h3>
      <Rating value={product.rating} />
      <div className="product-card-actions">
        <CartControl product={product} />
      </div>
    </article>
  );
}

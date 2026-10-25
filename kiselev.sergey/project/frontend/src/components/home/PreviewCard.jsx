import ProductLabels from '../ProductLabels.jsx';
import Rating from '../Rating.jsx';
import {formatPrice} from '../../utils/format.js';

export default function PreviewCard({product}) {
  return (
    <article className="preview-card">
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
        {product.name}
      </h3>
      <Rating value={product.rating} />
    </article>
  );
}

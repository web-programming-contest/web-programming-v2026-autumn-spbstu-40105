import Modal from '../Modal.jsx';
import ProductLabels from '../ProductLabels.jsx';
import Rating from '../Rating.jsx';
import {formatPrice} from '../../utils/format.js';
import CartControl from './CartControl.jsx';

export default function ProductModal({product, onClose}) {
  return (
    <Modal
      isOpen={Boolean(product)}
      onClose={onClose}
      label={product?.name}
      className="product-modal"
    >
      {product && (
        <div className="product-modal-content">
          <div className="product-modal-image">
            <img src={product.image} alt="" width="280" height="280" />
            <ProductLabels product={product} className="preview-card-labels" />
          </div>
          <div className="product-modal-info">
            <h2 className="product-modal-title">{product.name}</h2>
            <Rating value={product.rating} />
            <p className="product-modal-description">{product.description}</p>
            <h3 className="product-modal-subtitle">Характеристики</h3>
            <dl className="product-specs">
              {product.specs.map((spec) => (
                <div key={spec.name} className="product-spec">
                  <dt>{spec.name}</dt>
                  <dd>{spec.value}</dd>
                </div>
              ))}
            </dl>
            <p className="product-modal-price">{formatPrice(product.price)}</p>
            <div className="product-modal-actions">
              <CartControl product={product} isDetailed />
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}

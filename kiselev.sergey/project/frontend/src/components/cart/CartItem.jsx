import {formatPrice} from '../../utils/format.js';
import QuantityStepper from '../QuantityStepper.jsx';

export default function CartItem({
  product,
  quantity,
  isSelected,
  onSelect,
  onRemove,
}) {
  return (
    <li className="cart-item">
      <label className="checkbox cart-item-select">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(event) => onSelect(product.id, event.target.checked)}
        />
        <span className="visually-hidden">Выбрать: {product.name}</span>
      </label>
      <div className="cart-item-image">
        <img src={product.image} alt="" width="88" height="88" />
      </div>
      <h3 className="cart-item-name">{product.name}</h3>
      <QuantityStepper product={product} />
      <p className="cart-item-total">{formatPrice(product.price * quantity)}</p>
      <button
        type="button"
        className="link-pink cart-remove"
        aria-label={`Удалить: ${product.name}`}
        onClick={() => onRemove([product.id])}
      >
        Удалить
      </button>
    </li>
  );
}

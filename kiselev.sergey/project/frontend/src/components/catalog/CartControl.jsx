import {Link} from 'react-router-dom';

import {useCart} from '../../context/CartContext.jsx';
import QuantityStepper from '../QuantityStepper.jsx';
import CartIcon from '../icons/CartIcon.jsx';

export default function CartControl({product, isDetailed = false}) {
  const {getQuantity, increment} = useCart();
  const quantity = getQuantity(product.id);

  if (quantity === 0) {
    return (
      <button
        type="button"
        className="button"
        onClick={() => increment(product.id)}
      >
        <CartIcon />В корзину
      </button>
    );
  }

  const inCart = (
    <Link to="/cart" className="button button-pink">
      <CartIcon />
      {isDetailed ? `В корзине ${quantity} шт.` : `${quantity} шт.`}
    </Link>
  );

  return (
    <div className="cart-control">
      {isDetailed ? (
        <>
          <QuantityStepper product={product} />
          {inCart}
        </>
      ) : (
        <>
          {inCart}
          <QuantityStepper product={product} />
        </>
      )}
    </div>
  );
}

import {useCart} from '../context/CartContext.jsx';

export default function QuantityStepper({product}) {
  const {getQuantity, increment, decrement} = useCart();

  return (
    <div
      className="stepper"
      role="group"
      aria-label={`Количество: ${product.name}`}
    >
      <button
        type="button"
        className="stepper-button"
        aria-label="Убрать одну штуку"
        onClick={() => decrement(product.id)}
      >
        −
      </button>
      <output className="stepper-value" aria-live="polite">
        {getQuantity(product.id)}
      </output>
      <button
        type="button"
        className="stepper-button"
        aria-label="Добавить ещё одну штуку"
        onClick={() => increment(product.id)}
      >
        +
      </button>
    </div>
  );
}

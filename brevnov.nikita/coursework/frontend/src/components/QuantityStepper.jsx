import { useCart } from '../context/CartContext.jsx';
import './quantityStepper.css';

// Переиспользуемый счётчик количества товара — одинаково нужен на карточке
// в каруселях главной, в сетке каталога и в самой корзине: пока товара нет
// в корзине, показываем кнопку «В корзину», а как только он там появился —
// переключаемся на степпер «− количество +».
export function QuantityStepper({ goodId, size = 'md' }) {
  const { getQuantity, increment, decrement } = useCart();
  const quantity = getQuantity(goodId);

  if (quantity === 0) {
    return (
      <button
        type="button"
        className={`stepper-add stepper-${size}`}
        onClick={() => increment(goodId)}
      >
        В корзину
      </button>
    );
  }

  return (
    <div className={`stepper stepper-${size}`}>
      <button
        type="button"
        className="stepper-button"
        aria-label="Уменьшить количество"
        onClick={() => decrement(goodId)}
      >
        −
      </button>
      <span className="stepper-value">{quantity}</span>
      <button
        type="button"
        className="stepper-button"
        aria-label="Увеличить количество"
        onClick={() => increment(goodId)}
      >
        +
      </button>
    </div>
  );
}

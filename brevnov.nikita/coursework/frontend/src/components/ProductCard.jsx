import { getGoodImageUrl } from '../utils/images.js';
import { QuantityStepper } from './QuantityStepper.jsx';
import './productCard.css';

// Карточка товара общая для карусели на главной и сетки каталога (шаг 6) —
// чтобы не дублировать вёрстку, весь вид карточки живёт в одном месте.
// onOpen (необязательный) — если передан, клик по картинке и названию
// открывает подробности товара (модалка в каталоге).
export function ProductCard({ good, onOpen }) {
  const open = onOpen ? () => onOpen(good) : undefined;

  return (
    <article className="product-card">
      {good.isHit && <span className="product-badge product-badge-hit">Хит</span>}
      {good.isNew && !good.isHit && (
        <span className="product-badge product-badge-new">Новинка</span>
      )}

      <img
        className={onOpen ? 'product-card-image product-card-clickable' : 'product-card-image'}
        src={getGoodImageUrl(good.image)}
        alt={good.title}
        loading="lazy"
        onClick={open}
      />

      <h3
        className={onOpen ? 'product-card-title product-card-clickable' : 'product-card-title'}
        onClick={open}
      >
        {good.title}
      </h3>

      <div className="product-card-rating" aria-label={`Рейтинг ${good.rating} из 5`}>
        {'★'.repeat(good.rating)}
        <span className="product-card-rating-empty">{'★'.repeat(5 - good.rating)}</span>
      </div>

      <div className="product-card-footer">
        <span className="product-card-price">{good.price.toLocaleString('ru-RU')} ₽</span>
        <QuantityStepper goodId={good.id} size="sm" />
      </div>
    </article>
  );
}

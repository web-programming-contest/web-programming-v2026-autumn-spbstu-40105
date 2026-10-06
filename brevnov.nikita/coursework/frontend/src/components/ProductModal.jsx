import { useEffect } from 'react';
import { getGoodImageUrl } from '../utils/images.js';
import { getColorLabel, getTypeLabel } from '../utils/labels.js';
import { QuantityStepper } from './QuantityStepper.jsx';
import './productModal.css';

// Модалка с подробной информацией о товаре. Закрывается крестиком, кликом
// по затемнённому фону и клавишей Escape.
export function ProductModal({ good, onClose }) {
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    // Пока модалка открыта, страница под ней не должна прокручиваться.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={good.title}
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="modal-close" aria-label="Закрыть" onClick={onClose}>
          ×
        </button>

        <img className="modal-image" src={getGoodImageUrl(good.image)} alt={good.title} />

        <div className="modal-body">
          <h2 className="modal-title">{good.title}</h2>
          <p className="modal-meta">
            {getTypeLabel(good.type)} · {getColorLabel(good.color)} · {'★'.repeat(good.rating)}
          </p>
          <p className="modal-description">{good.description}</p>

          <dl className="modal-characteristics">
            {good.characteristics.map((item) => (
              <div className="modal-characteristic" key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>

          <div className="modal-footer">
            <span className="modal-price">{good.price.toLocaleString('ru-RU')} ₽</span>
            <div className="modal-stepper">
              <QuantityStepper goodId={good.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import {useEffect} from 'react';
import {useStore} from '../store';
import type {Product} from '../store';

export default function ProductModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const {addToCart, updateQuantity, cart} = useStore();
  const inCart = cart.find((i) => i.id === product.id);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        <div style={{display: 'flex', gap: '24px'}}>
          <div
            style={{
              width: '250px',
              height: '250px',
              background: '#f0f0f0',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <img
              src={product.image || '/images/goods/image_1.png'}
              alt={product.name}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
              }}
            />
          </div>
          <div style={{flex: 1}}>
            <div style={{marginBottom: '8px'}}>
              {product.labels?.includes('Новинка') && (
                <span
                  className="label label-new"
                  style={{position: 'static', marginRight: '8px'}}
                >
                  Новинка
                </span>
              )}
              {product.labels?.includes('Хит') && (
                <span className="label label-hit" style={{position: 'static'}}>
                  Хит
                </span>
              )}
            </div>
            <h2 style={{fontSize: '24px', marginBottom: '12px'}}>
              {product.name}
            </h2>
            <p style={{color: '#666', marginBottom: '12px'}}>
              Описание: Высококачественный гаджет с гарантией 1 год.
              Оригинальная упаковка.
            </p>
            <p style={{marginBottom: '12px'}}>
              Характеристики: Цвет - {product.color || 'Не указан'}, Категория -{' '}
              {product.category || 'Не указана'}
            </p>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '20px',
              }}
            >
              <span style={{fontSize: '28px', fontWeight: 'bold'}}>
                {product.price} ₽
              </span>
              <span style={{color: '#FF9500', fontSize: '18px'}}>
                ★ {product.rating || 4.5}
              </span>
            </div>

            {inCart ? (
              <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                <button
                  className="btn btn-outline"
                  onClick={() => updateQuantity(product.id, -1)}
                >
                  -
                </button>
                <span style={{fontSize: '18px', fontWeight: 'bold'}}>
                  {inCart.quantity} шт.
                </span>
                <button
                  className="btn btn-blue"
                  onClick={() => updateQuantity(product.id, 1)}
                >
                  +
                </button>
              </div>
            ) : (
              <button
                className="btn btn-blue"
                style={{width: '100%'}}
                onClick={() =>
                  addToCart({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image || '',
                  })
                }
              >
                Добавить в корзину
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

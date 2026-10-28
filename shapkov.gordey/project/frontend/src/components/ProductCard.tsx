import {useStore} from '../store';
import type {Product} from '../store';

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

export default function ProductCard({product, onClick}: ProductCardProps) {
  const {addToCart, updateQuantity, cart} = useStore();
  const inCart = cart.find((i) => i.id === product.id);

  const handleCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inCart) {
      updateQuantity(product.id, 1);
    } else {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image || '',
      });
    }
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div className="product-card" onClick={handleCardClick}>
      <div className="product-image">
        {product.labels?.includes('Новинка') && (
          <span className="label label-new">Новинка</span>
        )}
        {product.labels?.includes('Хит') && (
          <span className="label label-hit">Хит</span>
        )}
        <img
          src={product.image || '/images/goods/image_1.png'}
          alt={product.name}
          style={{width: '100%', height: '100%', objectFit: 'contain'}}
        />
      </div>
      <h4
        style={{
          fontSize: '16px',
          marginBottom: '8px',
          flex: 1,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}
      >
        {product.name}
      </h4>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
        }}
      >
        <span style={{fontWeight: 'bold', fontSize: '18px'}}>
          {product.price} ₽
        </span>
        <span style={{color: '#FF9500'}}>★ {product.rating || 4.5}</span>
      </div>
      {inCart ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#f0f0f0',
            borderRadius: '8px',
            padding: '4px',
          }}
        >
          <button
            className="btn btn-outline"
            style={{padding: '4px 12px'}}
            onClick={(e) => {
              e.stopPropagation();
              updateQuantity(product.id, -1);
            }}
          >
            -
          </button>
          <span>{inCart.quantity}</span>
          <button
            className="btn btn-blue"
            style={{padding: '4px 12px'}}
            onClick={handleCartClick}
          >
            +
          </button>
        </div>
      ) : (
        <button
          className="btn btn-blue"
          style={{width: '100%'}}
          onClick={handleCartClick}
        >
          В корзину
        </button>
      )}
    </div>
  );
}

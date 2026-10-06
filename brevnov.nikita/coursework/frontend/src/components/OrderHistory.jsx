import { useEffect, useState } from 'react';
import { api } from '../api/client.js';
import { getGoodImageUrl } from '../utils/images.js';
import './orderHistory.css';

function formatPrice(value) {
  return `${value.toLocaleString('ru-RU')} ₽`;
}

// Вкладка «История заказов». refreshKey меняется после оформления нового
// заказа, чтобы список перезапросился с сервера, а не показывал старые данные.
export function OrderHistory({ refreshKey }) {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
    api
      .getOrders()
      .then((data) => setOrders([...data].reverse()))
      .catch((requestError) => setError(requestError.message));
  }, [refreshKey]);

  if (error) {
    return <p className="orders-error">Не удалось загрузить заказы: {error}</p>;
  }

  if (orders === null) {
    return <p className="orders-empty">Загрузка…</p>;
  }

  if (orders.length === 0) {
    return <p className="orders-empty">Вы пока не оформляли заказов.</p>;
  }

  return (
    <ul className="orders-list">
      {orders.map((order) => (
        <li className="order" key={order.id}>
          <div className="order-header">
            <span className="order-number">Заказ №{order.id}</span>
            <span className="order-date">
              {new Date(order.createdAt).toLocaleString('ru-RU', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </span>
          </div>

          <ul className="order-items">
            {order.items.map((item) => (
              <li className="order-item" key={item.goodId}>
                {item.image && (
                  <img
                    className="order-item-image"
                    src={getGoodImageUrl(item.image)}
                    alt=""
                    aria-hidden="true"
                  />
                )}
                <span className="order-item-title">{item.title}</span>
                <span className="order-item-qty">× {item.quantity}</span>
                <span className="order-item-sum">{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>

          <div className="order-footer">
            <span>Товаров: {order.itemsCount}</span>
            <span className="order-total">Итого: {formatPrice(order.totalPrice)}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

import {
  GOODS_WORDS,
  formatDate,
  formatPrice,
  pluralize,
} from '../../utils/format.js';

export default function OrderHistory({orders, isLoading, error}) {
  if (isLoading) {
    return <p className="home-status">Загружаем заказы…</p>;
  }

  if (error) {
    return (
      <p className="home-status home-status-error">
        Не удалось загрузить заказы: {error}
      </p>
    );
  }

  if (orders.length === 0) {
    return (
      <p className="cart-card orders-empty">Вы ещё ничего не заказывали.</p>
    );
  }

  return (
    <ul className="cart-card orders">
      {orders.map((order) => (
        <li key={order.id} className="order">
          <span>
            № {order.id} от{' '}
            <time dateTime={order.createdAt}>
              {formatDate(order.createdAt)}
            </time>
          </span>
          <span>
            {order.totalQuantity} {pluralize(order.totalQuantity, GOODS_WORDS)}
          </span>
          <span>{formatPrice(order.totalPrice)}</span>
        </li>
      ))}
    </ul>
  );
}

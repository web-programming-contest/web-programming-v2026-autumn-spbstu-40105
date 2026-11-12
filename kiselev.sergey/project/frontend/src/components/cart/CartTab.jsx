import {useState} from 'react';
import {Link} from 'react-router-dom';

import {createOrder} from '../../api/index.js';
import {useCart} from '../../context/CartContext.jsx';
import {useGoods} from '../../hooks/useGoods.js';
import {GOODS_WORDS, formatPrice, pluralize} from '../../utils/format.js';
import Modal from '../Modal.jsx';
import CartItem from './CartItem.jsx';
import CheckoutForm from './CheckoutForm.jsx';

function EmptyCart({isOrdered}) {
  return (
    <div className="cart-empty">
      <h2 className="cart-empty-title">
        {isOrdered ? 'Спасибо, ваш заказ успешно оформлен' : 'Пока пусто'}
      </h2>
      <p className="cart-empty-text">
        Ознакомьтесь с новинками и хитами на главной или найдите нужное в
        каталоге
      </p>
      <div className="cart-empty-actions">
        <Link to="/catalog" className="button">
          Перейти в каталог
        </Link>
        <Link to="/" className="link-blue">
          Главная страница
        </Link>
      </div>
    </div>
  );
}

export default function CartTab({onOrderCreated}) {
  const {goods, isLoading, error} = useGoods();
  const cart = useCart();
  const [selected, setSelected] = useState(new Set());
  const [removal, setRemoval] = useState(null);
  const [isOrdered, setIsOrdered] = useState(false);
  const [result, setResult] = useState(null);

  const goodsById = new Map(goods.map((item) => [item.id, item]));
  const rows = cart.items
    .filter((item) => goodsById.has(item.id))
    .map((item) => ({
      product: goodsById.get(item.id),
      quantity: item.quantity,
    }));
  const totalCount = rows.reduce((sum, row) => sum + row.quantity, 0);
  const totalPrice = rows.reduce(
    (sum, row) => sum + row.product.price * row.quantity,
    0,
  );
  const selectedIds = rows
    .map((row) => row.product.id)
    .filter((id) => selected.has(id));
  const isAllSelected = rows.length > 0 && selectedIds.length === rows.length;

  if (isOrdered && rows.length > 0) {
    setIsOrdered(false);
  }

  function select(id, isChecked) {
    setSelected((current) => {
      const next = new Set(current);

      if (isChecked) {
        next.add(id);
      } else {
        next.delete(id);
      }

      return next;
    });
  }

  function selectAll(isChecked) {
    setSelected(new Set(isChecked ? rows.map((row) => row.product.id) : []));
  }

  function confirmRemoval() {
    cart.remove(removal);
    setSelected((current) => {
      const next = new Set(current);
      removal.forEach((id) => next.delete(id));

      return next;
    });
    setRemoval(null);
  }

  async function checkout(contact) {
    try {
      const order = await createOrder({
        items: rows.map((row) => ({
          id: row.product.id,
          quantity: row.quantity,
        })),
        contact,
      });

      cart.clear();
      setSelected(new Set());
      setIsOrdered(true);
      setResult({order});
      onOrderCreated();
    } catch (orderError) {
      setResult({error: orderError.message});
    }
  }

  if (isLoading) {
    return <p className="home-status">Загружаем корзину…</p>;
  }

  if (error) {
    return (
      <p className="home-status home-status-error">
        Не удалось загрузить товары: {error}
      </p>
    );
  }

  const removalText =
    removal?.length === 1
      ? 'Вы уверены, что хотите удалить?'
      : `Вы уверены, что хотите удалить выбранные товары (${removal?.length})?`;

  return (
    <>
      {rows.length === 0 ? (
        <EmptyCart isOrdered={isOrdered} />
      ) : (
        <>
          <section className="cart-card" aria-label="Товары в корзине">
            <div className="cart-toolbar">
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={(event) => selectAll(event.target.checked)}
                />
                Выбрать все
              </label>
              {selectedIds.length > 0 && (
                <button
                  type="button"
                  className="link-pink cart-remove"
                  onClick={() => setRemoval(selectedIds)}
                >
                  {isAllSelected ? 'Удалить все' : 'Удалить выбранные'}
                </button>
              )}
            </div>
            <ul className="cart-list">
              {rows.map((row) => (
                <CartItem
                  key={row.product.id}
                  product={row.product}
                  quantity={row.quantity}
                  isSelected={selected.has(row.product.id)}
                  onSelect={select}
                  onRemove={setRemoval}
                />
              ))}
            </ul>
            <p className="cart-summary">
              {totalCount} {pluralize(totalCount, GOODS_WORDS)} на{' '}
              {formatPrice(totalPrice)}
            </p>
          </section>

          <CheckoutForm onSubmit={checkout} />
        </>
      )}

      <Modal
        isOpen={removal !== null}
        label="Подтверждение удаления"
        className="modal-small"
        onClose={() => setRemoval(null)}
      >
        <p className="modal-question">{removalText}</p>
        <div className="modal-actions">
          <button
            type="button"
            className="link-pink"
            onClick={() => setRemoval(null)}
          >
            Отмена
          </button>
          <button type="button" className="button" onClick={confirmRemoval}>
            Да, удалить
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={result !== null}
        label={result?.order ? 'Заказ оформлен' : 'Ошибка оформления'}
        className="modal-small"
        onClose={() => setResult(null)}
      >
        {result?.order ? (
          <>
            <h2 className="modal-title">Спасибо за заказ!</h2>
            <p className="modal-text">
              Номер заказа {result.order.id}.
              <br />
              Мы свяжемся с вами в течение 10 минут, чтобы уточнить удобное для
              вас время доставки
            </p>
          </>
        ) : (
          <>
            <h2 className="modal-title">Не удалось оформить заказ</h2>
            <p className="modal-text">{result?.error}</p>
          </>
        )}
        <div className="modal-actions">
          <button
            type="button"
            className="button"
            onClick={() => setResult(null)}
          >
            Ок
          </button>
        </div>
      </Modal>
    </>
  );
}

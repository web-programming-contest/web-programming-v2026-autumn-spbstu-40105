import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client.js';
import { OrderHistory } from '../components/OrderHistory.jsx';
import { QuantityStepper } from '../components/QuantityStepper.jsx';
import { useCart } from '../context/CartContext.jsx';
import { getGoodImageUrl } from '../utils/images.js';
import './cart.css';

function formatPrice(value) {
  return `${value.toLocaleString('ru-RU')} ₽`;
}

// Телефон считаем корректным, если в нём есть хотя бы 10 цифр — формат
// записи (скобки, пробелы, +7/8) пользователь выбирает сам.
function isPhoneValid(phone) {
  return phone.replace(/\D/g, '').length >= 10;
}

// Страница корзины: две вкладки («Корзина» и «История заказов»). В заказ
// попадают только отмеченные товары — после оформления именно они и
// убираются из корзины (removeItems), остальные остаются.
export function CartPage() {
  const { items, removeItem, removeItems } = useCart();

  const [tab, setTab] = useState('cart');
  const [goods, setGoods] = useState([]);
  const [loadError, setLoadError] = useState(null);
  // Храним снятые отметки, а не отмеченные: новые товары в корзине по
  // умолчанию сразу считаются выбранными.
  const [unselectedIds, setUnselectedIds] = useState([]);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successOrderId, setSuccessOrderId] = useState(null);
  const [ordersRefreshKey, setOrdersRefreshKey] = useState(0);

  useEffect(() => {
    api
      .getGoods()
      .then(setGoods)
      .catch((requestError) => setLoadError(requestError.message));
  }, []);

  // Данные товара (название, цена, картинка) берём из актуального /goods
  // по id из корзины; товары, которых уже нет в каталоге, пропускаем.
  const cartLines = useMemo(
    () =>
      items
        .map((item) => {
          const good = goods.find((candidate) => candidate.id === item.goodId);
          return good ? { good, quantity: item.quantity } : null;
        })
        .filter(Boolean),
    [items, goods],
  );

  const selectedLines = cartLines.filter((line) => !unselectedIds.includes(line.good.id));
  const selectedTotal = selectedLines.reduce(
    (sum, line) => sum + line.good.price * line.quantity,
    0,
  );
  const selectedCount = selectedLines.reduce((sum, line) => sum + line.quantity, 0);
  const allSelected = cartLines.length > 0 && selectedLines.length === cartLines.length;

  function toggleSelected(goodId) {
    setUnselectedIds((current) =>
      current.includes(goodId)
        ? current.filter((id) => id !== goodId)
        : [...current, goodId],
    );
  }

  function toggleAll() {
    setUnselectedIds(allSelected ? cartLines.map((line) => line.good.id) : []);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError(null);

    if (selectedLines.length === 0) {
      setFormError('Отметьте хотя бы один товар для заказа');
      return;
    }
    if (!isPhoneValid(phone)) {
      setFormError('Введите корректный номер телефона (не меньше 10 цифр)');
      return;
    }

    setIsSubmitting(true);
    try {
      const order = await api.createOrder(
        selectedLines.map((line) => ({
          goodId: line.good.id,
          title: line.good.title,
          image: line.good.image,
          price: line.good.price,
          quantity: line.quantity,
        })),
        { name: name.trim(), phone: phone.trim() },
      );

      removeItems(selectedLines.map((line) => line.good.id));
      setUnselectedIds([]);
      setSuccessOrderId(order.id);
      setOrdersRefreshKey((key) => key + 1);
    } catch (submitError) {
      setFormError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="page-container cart-page">
      <h1 className="cart-title">Корзина</h1>

      <div className="cart-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'cart'}
          className={tab === 'cart' ? 'cart-tab cart-tab-active' : 'cart-tab'}
          onClick={() => setTab('cart')}
        >
          Корзина
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'history'}
          className={tab === 'history' ? 'cart-tab cart-tab-active' : 'cart-tab'}
          onClick={() => setTab('history')}
        >
          История заказов
        </button>
      </div>

      {tab === 'history' && <OrderHistory refreshKey={ordersRefreshKey} />}

      {tab === 'cart' && (
        <>
          {loadError && <p className="cart-error">Не удалось загрузить товары: {loadError}</p>}

          {successOrderId && (
            <p className="cart-success" role="status">
              Заказ №{successOrderId} оформлен. Он появился во вкладке «История заказов».
            </p>
          )}

          {cartLines.length === 0 ? (
            <p className="cart-empty">В корзине пока ничего нет.</p>
          ) : (
            <div className="cart-layout">
              <div className="cart-lines">
                <label className="cart-select-all">
                  <input type="checkbox" checked={allSelected} onChange={toggleAll} />
                  <span>Выбрать все</span>
                </label>

                <ul className="cart-list">
                  {cartLines.map(({ good, quantity }) => (
                    <li className="cart-line" key={good.id}>
                      <input
                        type="checkbox"
                        aria-label={`Добавить в заказ: ${good.title}`}
                        checked={!unselectedIds.includes(good.id)}
                        onChange={() => toggleSelected(good.id)}
                      />
                      <img
                        className="cart-line-image"
                        src={getGoodImageUrl(good.image)}
                        alt={good.title}
                      />
                      <div className="cart-line-info">
                        <span className="cart-line-title">{good.title}</span>
                        <span className="cart-line-price">{formatPrice(good.price)}</span>
                      </div>
                      <div className="cart-line-stepper">
                        <QuantityStepper goodId={good.id} size="sm" />
                      </div>
                      <span className="cart-line-sum">{formatPrice(good.price * quantity)}</span>
                      <button
                        type="button"
                        className="cart-line-remove"
                        aria-label="Удалить из корзины"
                        onClick={() => removeItem(good.id)}
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <form className="cart-checkout" onSubmit={handleSubmit}>
                <h2 className="cart-checkout-title">Оформление заказа</h2>

                <p className="cart-summary">
                  Выбрано товаров: <strong>{selectedCount}</strong>
                </p>
                <p className="cart-summary">
                  Итого: <strong>{formatPrice(selectedTotal)}</strong>
                </p>

                <label className="cart-field">
                  <span>Имя</span>
                  <input
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                </label>

                <label className="cart-field">
                  <span>Телефон *</span>
                  <input
                    type="tel"
                    autoComplete="tel"
                    placeholder="+7 (999) 123-45-67"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                  />
                </label>

                {formError && (
                  <p className="cart-error" role="alert">
                    {formError}
                  </p>
                )}

                <button type="submit" className="cart-submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Оформляем…' : 'Оформить заказ'}
                </button>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
}

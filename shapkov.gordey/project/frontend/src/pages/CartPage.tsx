import {useState} from 'react';
import {Link} from 'react-router-dom';
import {getOrders, createOrder} from '../api';
import {useStore} from '../store';
import type {CartItem, Order} from '../store';

export default function CartPage() {
  const [tab, setTab] = useState<'cart' | 'history'>('cart');
  const {cart, updateQuantity, removeFromCart, clearCart} = useStore();
  const [history, setHistory] = useState<Order[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [form, setForm] = useState({
    email: '',
    phone: '',
    delivery: false,
    address: '',
    payment: 'card',
    packaging: false,
  });
  const [errors, setErrors] = useState<{phone?: string; address?: string}>({});
  const [orderSuccess, setOrderSuccess] = useState(false);

  const loadHistory = () =>
    getOrders().then((res) => setHistory(res.data || []));
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleDeleteSelected = () => {
    if (selectedItems.length === 0) {
      return;
    }
    if (window.confirm('Вы уверены, что хотите удалить?')) {
      selectedItems.forEach((id) => removeFromCart(id));
      setSelectedItems([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: {phone?: string; address?: string} = {};

    if (!form.phone) {
      newErrors.phone = 'Заполните обязательное поле';
    }
    if (form.delivery && !form.address) {
      newErrors.address = 'Заполните обязательное поле';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await createOrder({items: cart, total, ...form});
    clearCart();
    setOrderSuccess(true);
  };

  if (orderSuccess) {
    return (
      <div style={{textAlign: 'center', padding: '60px'}}>
        <h2>Спасибо, ваш заказ успешно оформлен</h2>
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          gap: '24px',
          marginBottom: '24px',
          borderBottom: '1px solid #eee',
        }}
      >
        <button
          className="btn"
          style={{
            borderBottom: tab === 'cart' ? '2px solid #007AFF' : 'none',
            borderRadius: 0,
            color: tab === 'cart' ? '#007AFF' : '#333',
          }}
          onClick={() => setTab('cart')}
        >
          Корзина
        </button>
        <button
          className="btn"
          style={{
            borderBottom: tab === 'history' ? '2px solid #007AFF' : 'none',
            borderRadius: 0,
            color: tab === 'history' ? '#007AFF' : '#333',
          }}
          onClick={() => {
            setTab('history');
            loadHistory();
          }}
        >
          История заказов
        </button>
      </div>

      {tab === 'history' ? (
        <div>
          <h2 style={{marginBottom: '20px'}}>История заказов</h2>
          <button
            className="btn btn-blue"
            onClick={loadHistory}
            style={{marginBottom: '20px'}}
          >
            Обновить
          </button>
          {history.length === 0 ? (
            <p>История заказов пуста</p>
          ) : (
            history.map((order) => (
              <div
                key={order.id}
                style={{
                  background: 'white',
                  padding: '16px',
                  borderRadius: '8px',
                  marginBottom: '12px',
                }}
              >
                <p>
                  <strong>Заказ</strong> от {order.date}
                </p>
                <p>
                  Товаров: {order.items?.length || 0} | Общая стоимость:{' '}
                  {order.total} ₽
                </p>
              </div>
            ))
          )}
        </div>
      ) : cart.length === 0 ? (
        <div style={{textAlign: 'center', padding: '60px'}}>
          <p style={{fontSize: '18px'}}>
            Ознакомьтесь с новинками и хитами на главной или найдите нужное в{' '}
            <Link to="/catalog" style={{color: '#007AFF'}}>
              каталоге
            </Link>
          </p>
        </div>
      ) : (
        <div style={{display: 'flex', gap: '40px', flexWrap: 'wrap'}}>
          <div style={{flex: 1, minWidth: '300px'}}>
            {cart.map((item: CartItem) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  gap: '16px',
                  background: 'white',
                  padding: '16px',
                  borderRadius: '8px',
                  marginBottom: '12px',
                  alignItems: 'center',
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={() =>
                    setSelectedItems((prev) =>
                      prev.includes(item.id)
                        ? prev.filter((i) => i !== item.id)
                        : [...prev, item.id],
                    )
                  }
                  style={{width: '20px', height: '20px', cursor: 'pointer'}}
                />
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    background: '#f0f0f0',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={item.image || '/images/goods/image_1.png'}
                    alt={item.name}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                    }}
                  />
                </div>
                <div style={{flex: 1}}>
                  <h4 style={{marginBottom: '4px'}}>{item.name}</h4>
                  <p style={{color: '#666'}}>{item.price} ₽</p>
                </div>
                <div
                  style={{display: 'flex', alignItems: 'center', gap: '12px'}}
                >
                  <button
                    className="btn btn-outline"
                    style={{padding: '4px 12px'}}
                    onClick={() => updateQuantity(item.id, -1)}
                  >
                    -
                  </button>
                  <span
                    style={{
                      fontWeight: 'bold',
                      minWidth: '20px',
                      textAlign: 'center',
                    }}
                  >
                    {item.quantity}
                  </span>
                  <button
                    className="btn btn-blue"
                    style={{padding: '4px 12px'}}
                    onClick={() => updateQuantity(item.id, 1)}
                  >
                    +
                  </button>
                </div>
                <div style={{textAlign: 'right', minWidth: '100px'}}>
                  <p style={{fontWeight: 'bold', fontSize: '18px'}}>
                    {item.price * item.quantity} ₽
                  </p>
                  <button
                    className="btn btn-pink"
                    style={{
                      padding: '6px 12px',
                      fontSize: '12px',
                      marginTop: '8px',
                    }}
                    onClick={() => {
                      if (window.confirm('Вы уверены, что хотите удалить?')) {
                        removeFromCart(item.id);
                      }
                    }}
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))}
            {selectedItems.length > 0 && (
              <button
                className="btn btn-pink"
                style={{marginTop: '12px'}}
                onClick={handleDeleteSelected}
              >
                Удалить выбранные ({selectedItems.length})
              </button>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            style={{
              width: '380px',
              background: 'white',
              padding: '24px',
              borderRadius: '12px',
              height: 'fit-content',
            }}
          >
            <h3 style={{marginBottom: '20px'}}>Оформление заказа</h3>

            <div style={{marginBottom: '16px'}}>
              <label style={{fontSize: '14px', color: '#666'}}>
                Электронная почта
              </label>
              <input
                value={form.email}
                onChange={(e) => setForm({...form, email: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px',
                  marginTop: '4px',
                  borderRadius: '6px',
                  border: '1px solid #ccc',
                }}
              />
            </div>

            <div style={{marginBottom: '16px'}}>
              <label style={{fontSize: '14px', color: '#666'}}>
                Номер телефона *
              </label>
              <input
                className={errors.phone ? 'input-error' : ''}
                value={form.phone}
                onChange={(e) => {
                  setForm({...form, phone: e.target.value});
                  setErrors({...errors, phone: undefined});
                }}
                style={{
                  width: '100%',
                  padding: '10px',
                  marginTop: '4px',
                  borderRadius: '6px',
                  border: '1px solid #ccc',
                }}
              />
              {errors.phone && <div className="error-text">{errors.phone}</div>}
            </div>

            <div style={{marginBottom: '16px', display: 'flex', gap: '16px'}}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="radio"
                  checked={!form.delivery}
                  onChange={() => setForm({...form, delivery: false})}
                />{' '}
                Самовывоз
              </label>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="radio"
                  checked={form.delivery}
                  onChange={() => setForm({...form, delivery: true})}
                />{' '}
                Доставка
              </label>
            </div>

            {form.delivery && (
              <div style={{marginBottom: '16px'}}>
                <label style={{fontSize: '14px', color: '#666'}}>
                  Адрес доставки *
                </label>
                <input
                  className={errors.address ? 'input-error' : ''}
                  value={form.address}
                  onChange={(e) => {
                    setForm({...form, address: e.target.value});
                    setErrors({...errors, address: undefined});
                  }}
                  style={{
                    width: '100%',
                    padding: '10px',
                    marginTop: '4px',
                    borderRadius: '6px',
                    border: '1px solid #ccc',
                  }}
                />
                {errors.address && (
                  <div className="error-text">{errors.address}</div>
                )}
              </div>
            )}

            <div style={{marginBottom: '16px'}}>
              <label style={{fontSize: '14px', color: '#666'}}>
                Способ оплаты
              </label>
              <select
                value={form.payment}
                onChange={(e) => setForm({...form, payment: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px',
                  marginTop: '4px',
                  borderRadius: '6px',
                  border: '1px solid #ccc',
                }}
              >
                <option value="card">По карте</option>
                <option value="cash">Наличными</option>
              </select>
            </div>

            <div style={{marginBottom: '24px'}}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={form.packaging}
                  onChange={(e) =>
                    setForm({...form, packaging: e.target.checked})
                  }
                />{' '}
                Нужна подарочная упаковка
              </label>
            </div>

            <div style={{borderTop: '1px solid #eee', paddingTop: '16px'}}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  marginBottom: '16px',
                }}
              >
                <span>Итого:</span>
                <span>{total} ₽</span>
              </div>
              <button
                type="submit"
                className="btn btn-blue"
                style={{width: '100%'}}
              >
                Оформить заказ
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

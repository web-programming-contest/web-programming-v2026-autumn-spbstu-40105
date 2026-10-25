import {useSearchParams} from 'react-router-dom';

import CartTab from '../components/cart/CartTab.jsx';
import OrderHistory from '../components/cart/OrderHistory.jsx';
import {useOrders} from '../hooks/useOrders.js';

const TABS = [
  {id: 'cart', label: 'Корзина'},
  {id: 'history', label: 'История заказов'},
];

export default function CartPage() {
  const [params, setParams] = useSearchParams();
  const tab = params.get('tab') === 'history' ? 'history' : 'cart';
  const orders = useOrders();

  function openTab(id) {
    setParams(id === 'cart' ? {} : {tab: id}, {replace: true});
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="visually-hidden">Корзина</h1>
        <div className="tabs" role="tablist">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`tab-${item.id}`}
              className={`tab ${item.id === tab ? 'tab-active' : ''}`}
              aria-selected={item.id === tab}
              aria-controls="cart-tabpanel"
              onClick={() => openTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div id="cart-tabpanel" role="tabpanel" aria-labelledby={`tab-${tab}`}>
          {tab === 'cart' ? (
            <CartTab onOrderCreated={orders.reload} />
          ) : (
            <OrderHistory
              orders={orders.orders}
              isLoading={orders.isLoading}
              error={orders.error}
            />
          )}
        </div>
      </div>
    </div>
  );
}

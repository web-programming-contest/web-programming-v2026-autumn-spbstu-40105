import {Link, useLocation} from 'react-router-dom';
import {useStore} from '../store';

export default function Header() {
  const {user, logout, cart} = useStore();
  const location = useLocation();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const isActive = (path: string) =>
    location.pathname === path ? {fontWeight: 'bold', color: '#007AFF'} : {};

  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 0',
        borderBottom: '1px solid #eee',
      }}
    >
      <Link
        to="/"
        style={{
          fontSize: '24px',
          fontWeight: 'bold',
          textDecoration: 'none',
          color: '#333',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        📱 Gadget Hub
      </Link>
      <nav style={{display: 'flex', gap: '24px', alignItems: 'center'}}>
        <Link to="/catalog" style={isActive('/catalog')}>
          Каталог
        </Link>
        {user ? (
          <>
            <Link
              to="/cart"
              style={{position: 'relative', ...isActive('/cart')}}
            >
              🛒 Корзина{' '}
              {cartCount > 0 && (
                <span
                  style={{
                    background: '#FF2D55',
                    color: 'white',
                    borderRadius: '50%',
                    padding: '2px 6px',
                    fontSize: '12px',
                    position: 'absolute',
                    top: '-8px',
                    right: '-12px',
                  }}
                >
                  {cartCount}
                </span>
              )}
            </Link>
            <span>{user}</span>
            <button
              className="btn btn-pink"
              onClick={() => {
                logout();
                window.location.href = '/';
              }}
            >
              Выйти
            </button>
          </>
        ) : (
          <Link to="/login">
            <button className="btn btn-blue">Войти</button>
          </Link>
        )}
      </nav>
    </header>
  );
}

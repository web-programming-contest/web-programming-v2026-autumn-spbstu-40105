import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import logoIcon from '../assets/images/icons/catalog.svg';
import cartIcon from '../assets/images/icons/card.svg';
import profileIcon from '../assets/images/icons/profile.svg';
import './header.css';

// Шапка одинакова на всех страницах (требование 4.1). Активный раздел
// (каталог/корзина) подсвечивается через NavLink — он сам добавляет класс
// "active", когда текущий адрес совпадает со ссылкой, без ручного
// сравнения useLocation().
export function Header() {
  const { user, logout } = useAuth();
  const { totalCount } = useCart();
  const navigate = useNavigate();

  async function handleLogoutClick() {
    await logout();
    navigate('/');
  }

  return (
    <header className="header">
      <div className="page-container header-inner">
        <Link to="/" className="header-logo">
          <img src={logoIcon} alt="" aria-hidden="true" />
          <span>Gadget Hub</span>
        </Link>

        <nav className="header-nav">
          <NavLink
            to="/catalog"
            className={({ isActive }) =>
              isActive ? 'header-nav-link header-nav-link-active' : 'header-nav-link'
            }
          >
            Каталог
          </NavLink>
        </nav>

        <div className="header-actions">
          {user ? (
            <>
              <button type="button" className="header-text-button" onClick={handleLogoutClick}>
                Выйти
              </button>
              <NavLink
                to="/cart"
                className={({ isActive }) =>
                  isActive ? 'header-icon-button header-icon-button-active' : 'header-icon-button'
                }
                aria-label="Корзина"
              >
                <img src={cartIcon} alt="" aria-hidden="true" />
                {totalCount > 0 && <span className="header-cart-badge">{totalCount}</span>}
              </NavLink>
            </>
          ) : (
            <Link to="/login" className="header-icon-button" aria-label="Войти">
              <img src={profileIcon} alt="" aria-hidden="true" />
              <span>Войти</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

import {useEffect, useState} from 'react';
import {NavLink, useNavigate} from 'react-router-dom';

import {useAuth} from '../../context/AuthContext.jsx';
import {useCart} from '../../context/CartContext.jsx';
import Logo from './Logo.jsx';

function menuClassName({isActive}) {
  return isActive ? 'menu-button menu-button-active' : 'menu-button';
}

function useIsScrolled() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const update = () => setIsScrolled(window.scrollY > 0);

    update();
    window.addEventListener('scroll', update, {passive: true});

    return () => window.removeEventListener('scroll', update);
  }, []);

  return isScrolled;
}

export default function Header() {
  const {user, isChecking, logout} = useAuth();
  const {totalCount} = useCart();
  const navigate = useNavigate();
  const isScrolled = useIsScrolled();

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
    <header className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
      <div className="container header-inner">
        <Logo />
        <nav className="header-nav" aria-label="Основное меню">
          <NavLink to="/catalog" className={menuClassName}>
            <img
              src="/images/icons/catalog.svg"
              alt=""
              width="16"
              height="16"
            />
            Каталог
          </NavLink>
          {user && (
            <NavLink to="/cart" className={menuClassName}>
              <img src="/images/icons/card.svg" alt="" width="16" height="16" />
              Корзина
              {totalCount > 0 && (
                <span className="badge" aria-label={`товаров: ${totalCount}`}>
                  {totalCount}
                </span>
              )}
            </NavLink>
          )}
          {isChecking ? null : user ? (
            <button
              type="button"
              className="menu-button"
              onClick={handleLogout}
            >
              <img
                src="/images/icons/profile.svg"
                alt=""
                width="16"
                height="16"
              />
              Выйти
            </button>
          ) : (
            <NavLink to="/login" className={menuClassName}>
              <img
                src="/images/icons/profile.svg"
                alt=""
                width="16"
                height="16"
              />
              Войти
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}

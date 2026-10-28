import { LayoutGrid, LogIn, LogOut, ShoppingCart, UserRound } from 'lucide-react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'
import { Logo } from './Logo'

export function Header() {
  const { user, logout } = useAuth()
  const { count } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const [pending, setPending] = useState(false)

  const handleLogout = async () => {
    setPending(true)
    try { await logout(); navigate('/') } finally { setPending(false) }
  }

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Logo />
        <nav className="main-nav" aria-label="Основная навигация">
          <NavLink to="/catalog" aria-label="Каталог" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <LayoutGrid size={21} aria-hidden="true" /><span>Каталог</span>
          </NavLink>
          {user && (
            <NavLink to="/cart" aria-label="Корзина" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <span className="cart-icon"><ShoppingCart size={21} aria-hidden="true" />{count > 0 && <b>{count}</b>}</span>
              <span>Корзина</span>
            </NavLink>
          )}
          {user ? (
            <div className="user-actions">
              <span className="username"><UserRound size={18} />{user.username}</span>
              <button type="button" className="nav-link nav-button" onClick={handleLogout} disabled={pending}>
                <LogOut size={20} />{pending ? 'Выход…' : 'Выйти'}
              </button>
            </div>
          ) : (
            <Link to="/login" state={{ from: location.pathname }} className="nav-link">
              <LogIn size={20} />Войти
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}

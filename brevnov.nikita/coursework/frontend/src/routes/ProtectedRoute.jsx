import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// Оборачивает страницы, которые методичка запрещает показывать
// неавторизованному пользователю (каталог, корзина) — раздел 4.2:
// "если пользователь не прошел авторизацию и пытается попасть в каталог
// или корзину -> редирект на страницу с формой логина".
export function ProtectedRoute({ children }) {
  const { user, isChecking } = useAuth();
  const location = useLocation();

  if (isChecking) {
    // Первая проверка сессии (GET /me) ещё не завершилась — не редиректим
    // вслепую, иначе уже залогиненного пользователя на секунду выкинет
    // на /login при каждой перезагрузке страницы.
    return null;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

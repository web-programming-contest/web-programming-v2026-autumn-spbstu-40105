import {Navigate, useLocation} from 'react-router-dom';

import {useAuth} from '../context/AuthContext.jsx';

export default function ProtectedRoute({children}) {
  const {user, isChecking} = useAuth();
  const location = useLocation();

  if (isChecking) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{from: location.pathname}} />;
  }

  return children;
}

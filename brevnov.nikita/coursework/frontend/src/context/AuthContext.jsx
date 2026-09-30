import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api/client.js';

const AuthContext = createContext(null);

// Хранит состояние авторизации на верхнем уровне приложения, чтобы шапка,
// защищённые роуты и страница логина смотрели на одни и те же данные,
// а не запрашивали /me каждая по отдельности.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // isChecking — идёт ли ещё самая первая проверка сессии при загрузке
  // страницы. Пока она не завершилась, нельзя решать, редиректить ли на
  // логин: мы просто ещё не знаем, залогинен человек или нет.
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    api
      .me()
      .then((data) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setIsChecking(false));
  }, []);

  async function login(username, password) {
    const data = await api.login(username, password);
    setUser(data);
    return data;
  }

  async function logout() {
    await api.logout();
    setUser(null);
  }

  const value = { user, isChecking, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth должен использоваться внутри <AuthProvider>');
  }
  return context;
}

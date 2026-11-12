import {createContext, useContext, useEffect, useMemo, useState} from 'react';

import * as api from '../api/index.js';

const AuthContext = createContext(null);

export function AuthProvider({children}) {
  const [user, setUser] = useState(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let isActive = true;

    api
      .fetchCurrentUser()
      .then((currentUser) => isActive && setUser(currentUser))
      .catch(() => isActive && setUser(null))
      .finally(() => isActive && setIsChecking(false));

    return () => {
      isActive = false;
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      isChecking,
      async login(credentials) {
        setUser(await api.login(credentials));
      },
      async logout() {
        try {
          await api.logout();
        } finally {
          setUser(null);
        }
      },
    }),
    [user, isChecking],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth() {
  return useContext(AuthContext);
}

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api, { setAuthToken } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = window.localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  });

  const refreshSession = async () => {
    try {
      const { data } = await api.post('/auth/refresh', {});
      setAuthToken(data.accessToken);
      setUser(data.user);
      window.localStorage.setItem('user', JSON.stringify(data.user));
      return true;
    } catch (error) {
      setAuthToken(null);
      setUser(null);
      window.localStorage.removeItem('user');
      return false;
    }
  };

  useEffect(() => {
    refreshSession();
  }, []);

  const login = async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    setUser(data.user);
    setAuthToken(data.accessToken);
    window.localStorage.setItem('user', JSON.stringify(data.user));
  };

  const register = async (payload) => {
    await api.post('/auth/register', payload);
  };

  const logout = async () => {
    await api.post('/auth/logout', {});
    setAuthToken(null);
    setUser(null);
    window.localStorage.removeItem('user');
  };

  const value = useMemo(() => ({ user, login, register, logout, refreshSession }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

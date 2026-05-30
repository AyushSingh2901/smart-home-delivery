import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { endpoints } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadSession = async () => {
    const { data } = await endpoints.me();
    setUser(data.user);
    setProvider(data.provider);
    return data.user;
  };

  useEffect(() => {
    const hydrate = async () => {
      if (!localStorage.getItem('smartHomeToken')) {
        setLoading(false);
        return;
      }
      try {
        await loadSession();
      } catch {
        localStorage.removeItem('smartHomeToken');
      } finally {
        setLoading(false);
      }
    };
    hydrate();
  }, []);

  const login = async (payload) => {
    const { data } = await endpoints.login(payload);
    localStorage.setItem('smartHomeToken', data.token);
    const freshUser = await loadSession();
    toast.success(`Welcome back, ${data.user.name}`);
    return freshUser;
  };

  const register = async (payload) => {
    const { data } = await endpoints.register(payload);
    localStorage.setItem('smartHomeToken', data.token);
    const freshUser = await loadSession();
    toast.success('Account created successfully');
    return freshUser;
  };

  const logout = () => {
    localStorage.removeItem('smartHomeToken');
    setUser(null);
    setProvider(null);
    toast.success('Signed out');
  };

  const value = useMemo(() => ({ user, provider, loading, login, register, logout, isAuthenticated: Boolean(user) }), [user, provider, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

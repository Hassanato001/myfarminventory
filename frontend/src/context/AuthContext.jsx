import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import authService from '../services/authService.js';
import { setAuthState } from '../services/api.js';

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('farmshop_user');
    return raw ? JSON.parse(raw) : null;
  });
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem('farmshop_access_token') || '');
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem('farmshop_refresh_token') || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const sync = () => {
      const rawUser = localStorage.getItem('farmshop_user');
      setUser(rawUser ? JSON.parse(rawUser) : null);
      setAccessToken(localStorage.getItem('farmshop_access_token') || '');
      setRefreshToken(localStorage.getItem('farmshop_refresh_token') || '');
    };

    window.addEventListener('farmshop-auth-changed', sync);
    return () => window.removeEventListener('farmshop-auth-changed', sync);
  }, []);

  async function login(credentials) {
    setLoading(true);
    try {
      const response = await authService.login(credentials);
      setUser(response.data.user);
      setAccessToken(response.data.accessToken);
      setRefreshToken(response.data.refreshToken);
      setAuthState({
        user: response.data.user,
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken
      });
      return response.data;
    } finally {
      setLoading(false);
    }
  }

  async function register(payload) {
    setLoading(true);
    try {
      const response = await authService.register(payload);
      return response.data;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    const token = accessToken;
    setUser(null);
    setAccessToken('');
    setRefreshToken('');
    setAuthState({ user: null, accessToken: '', refreshToken: '' });

    if (token) {
      authService.logout(token).catch(() => {
        // Local logout already completed.
      });
    }
  }

  const value = useMemo(
    () => ({
      user,
      accessToken,
      refreshToken,
      loading,
      login,
      register,
      logout,
      setUser,
      setAccessToken,
      setRefreshToken
    }),
    [user, accessToken, refreshToken, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
}

export { AuthProvider, useAuthContext };

import { createContext, useContext, useEffect, useState } from 'react';
import { api, getToken, setToken } from '../api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first load, check whether the saved token is still valid
  useEffect(() => {
    if (!getToken()) {
      setLoading(false);
      return;
    }
    api('/auth/me')
      .then((data) => setUser(data.user))
      .catch(() => setToken(null))
      .finally(() => setLoading(false));
  }, []);

  const handleAuth = ({ token, user }) => {
    setToken(token);
    setUser(user);
  };

  const signIn = async (email, password) =>
    handleAuth(await api('/auth/signin', { method: 'POST', body: { email, password } }));

  const signUp = async (name, email, password) =>
    handleAuth(await api('/auth/signup', { method: 'POST', body: { name, email, password } }));

  const signOut = () => {
    setToken(null);
    setUser(null);
  };

  // PUT /api/users/me — returns the updated user
  const updateProfile = async (changes) => {
    const data = await api('/users/me', { method: 'PUT', body: changes });
    setUser(data.user);
    return data.user;
  };

  // DELETE /api/users/me — removes the account and all its applications
  const deleteAccount = async (currentPassword) => {
    await api('/users/me', { method: 'DELETE', body: { currentPassword } });
    signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, updateProfile, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

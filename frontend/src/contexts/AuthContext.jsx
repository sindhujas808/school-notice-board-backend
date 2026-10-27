import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = authService.getCurrentUser();
    if (savedUser) {
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  const handleLogin = async (username, password) => {
    const data = await authService.login(username, password);
    setUser(data);
    return data;
  };

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
  };

  const value = {
    user,
    role: user ? user.role : null,
    isAuthenticated: !!user,
    isAdmin: user ? user.role === 'ADMIN' : false,
    isTeacher: user ? user.role === 'TEACHER' : false,
    isStudent: user ? user.role === 'STUDENT' : false,
    isParent: user ? user.role === 'PARENT' : false,
    login: handleLogin,
    logout: handleLogout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

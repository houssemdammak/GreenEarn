// AuthUtils.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(JSON.parse(localStorage.getItem('auth')) || '');

  useEffect(() => {
    if (token !== '') {
      const user = JSON.parse(localStorage.getItem('auth'))

    }
  }, []);

  const login = (token) => {
    setToken(token);
    localStorage.setItem('auth', JSON.stringify(token));
  };

  const logout = () => {
    setToken('');
    localStorage.removeItem('auth');
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

// AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(JSON.parse(localStorage.getItem('auth')) || '');

  useEffect(() => {
    if (token !== '') {
      // Additional logic for checking the validity of the token if needed
      // For example, you might want to make an API call to verify the token
    }
  }, [token]);

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

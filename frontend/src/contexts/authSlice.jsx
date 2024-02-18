import React, { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [token, setToken] = useState(JSON.parse(localStorage.getItem('auth')) || null);

  useEffect(() => {
    if (!token) {
      navigate("/login"); // Redirect to login if not authenticated
    }
  }, [token, navigate]);
///login manager
  const login = (token) => {
    setToken(token);
    localStorage.setItem('auth', JSON.stringify(token));
    navigate("/")
  };
///login shipper
  const logout = () => {
    setToken(null);
    localStorage.removeItem('auth');
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

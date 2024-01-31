// AuthUtils.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [token, setToken] = useState(JSON.parse(localStorage.getItem('auth')) || '');
  useEffect(() => {
    if (token !== "") {
      navigate("/");
    }
  }, [token, navigate]);

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

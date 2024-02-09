import React, { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [token, setToken] = useState(JSON.parse(localStorage.getItem('citizienAuth')) || null);

  useEffect(() => {
    if (!token) {
      navigate("/Login"); // Redirect to login if not authenticated
    }
  }, [token, navigate]);

  const login = (token) => {
    setToken(token);
    localStorage.setItem('citizienAuth', JSON.stringify(token));
    navigate("/Home")
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('citizienAuth');
    navigate("/Login");
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

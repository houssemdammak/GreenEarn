import React, { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [token, setToken] = useState(JSON.parse(localStorage.getItem('auth')) || null);
  const [name, setName] = useState(JSON.parse(localStorage.getItem('name')) || null);
  const [role, setRole] = useState(JSON.parse(localStorage.getItem('role')) || null);

  useEffect(() => {
    if (!token) {
      navigate("/login"); // Redirect to login if not authenticated
    }
  }, [token, navigate]);
///login manager
  const login = (token,name,role) => {
      setToken(token);
      setName(name)
      localStorage.setItem('auth', JSON.stringify(token));
      localStorage.setItem('name', JSON.stringify(name));
    if(role=="Manager"){
      setRole("Manager")
      localStorage.setItem('role', JSON.stringify("Manager"));
      navigate("/manager")
    }
    if(role=="Shipper"){
      setRole("Shipper")
      localStorage.setItem('role', JSON.stringify("Shipper"));
      navigate("/shipperApp")
    }
    
  };
///login shipper
  const logout = () => {
    setToken(null);
    localStorage.removeItem('auth');
    localStorage.removeItem('name');
    localStorage.removeItem('role');
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ token,name,role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

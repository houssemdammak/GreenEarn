import React, { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [token, setToken] = useState(JSON.parse(localStorage.getItem('auth')) || null);
  const [name, setName] = useState(JSON.parse(localStorage.getItem('name')) || null);
  const [role, setRole] = useState(JSON.parse(localStorage.getItem('role')) || null);
  const [id, setID] = useState(JSON.parse(localStorage.getItem('id')) || null);

  useEffect(() => {
    if (!token) {
      navigate("/"); // Redirect to login if not authenticated
    }
  }, [token, navigate]);
///login manager
  const login = (token,name,id,role) => {
      setToken(token);
      setName(name)
      setID(id)
      localStorage.setItem('auth', JSON.stringify(token));
      localStorage.setItem('name', JSON.stringify(name));
      localStorage.setItem('id', JSON.stringify(id));
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
    setToken(null);setRole(null);
    setID(null);
    localStorage.removeItem('auth');
    localStorage.removeItem('name');
    localStorage.removeItem('role');
    localStorage.removeItem('id');
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ token,name,id,role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

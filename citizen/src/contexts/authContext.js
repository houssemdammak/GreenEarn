import React, { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [token, setToken] = useState(JSON.parse(localStorage.getItem('citizienAuth')) || null);
  const [id, setID] = useState(JSON.parse(localStorage.getItem('citizienID')) || null);
  const [name, setName] = useState(JSON.parse(localStorage.getItem('citizienName')) || null);
  console.log(name ,id)

  useEffect(() => {
    if (!token) {
      navigate("/Login"); // Redirect to login if not authenticated
    }
  }, [token]);

  const login = (token,id,name) => {
    setToken(token);
    setID(id)
    setName(name)
    localStorage.setItem('citizienAuth', JSON.stringify(token) );
    localStorage.setItem('citizienID', JSON.stringify(id) );
    localStorage.setItem('citizienName', JSON.stringify(name) );
    navigate("/Home")
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('citizienAuth');
    localStorage.removeItem('citizienID');
    localStorage.removeItem('citizienName');
    navigate("/Login");
  };

  return (
    <AuthContext.Provider value={{ token, name ,id ,login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

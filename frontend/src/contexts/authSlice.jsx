// AuthProvider.js
import React, { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [token, setToken] = useState(JSON.parse(localStorage.getItem('auth')) || null);
  const [name, setName] = useState(JSON.parse(localStorage.getItem('name')) || null);
  const [role, setRole] = useState(JSON.parse(localStorage.getItem('role')) || null);
  const [id, setID] = useState(JSON.parse(localStorage.getItem('id')) || null);

  useEffect(() => {
    console.log(token)
    if (!token) {
      navigate("/"); // Redirige vers la page de connexion si l'utilisateur n'est pas authentifié
    } else {
      // Vérifier si le token est autorisé côté serveur
      axios.post('/api/authorization/', null, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        // Si le token est autorisé, nous pouvons définir les informations d'authentification
        // setName(response.data.name);
        // setRole(response.data.role);
        // setID(response.data.id);
        console.log("authorisé",response)
      })
      .catch(error => {
        console.log("error")

        // Si le token n'est pas autorisé, déconnectez l'utilisateur et redirigez-le vers la page de connexion
        logout();
      });
    }
  }, [token, navigate]);

  const login = (token, name, id, role) => {
    setToken(token);
    setName(name);
    setID(id);
    localStorage.setItem('auth', JSON.stringify(token));
    localStorage.setItem('name', JSON.stringify(name));
    localStorage.setItem('id', JSON.stringify(id));
    // Redirigez l'utilisateur en fonction de son rôle
    switch (role) {
      case "Manager":
        setRole("Manager");
        localStorage.setItem('role', JSON.stringify("Manager"));
        navigate("/manager");
        break;
      case "Shipper":
        setRole("Shipper");
        localStorage.setItem('role', JSON.stringify("Shipper"));
        navigate("/shipperApp");
        break;
      case "RecyclingCenter":
        setRole("RecyclingCenter");
        localStorage.setItem('role', JSON.stringify("RecyclingCenter"));
        navigate("/RecyclingCenter");
        break;
      default:
        logout();
        break;
    }
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setID(null);
    localStorage.removeItem('auth');
    localStorage.removeItem('name');
    localStorage.removeItem('role');
    localStorage.removeItem('id');
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ token, name, id, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

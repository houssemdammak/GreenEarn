import React, { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(JSON.parse(localStorage.getItem('citizienAuth')) || null);
  const [id, setID] = useState(JSON.parse(localStorage.getItem('citizienID')) || null);
  const [name, setName] = useState(JSON.parse(localStorage.getItem('citizienName')) || null);
  const [WalletID, setWalletID] = useState(JSON.parse(localStorage.getItem('WalletID')) || null);
  const [action, setAction] = useState("");

  //console.log(name ,id)

  useEffect(() => {
    if (!token) {
      if(action == "login"){
        navigate("/Login"); 
      } else if(action == "signup"){
        navigate("/SignUp"); 
      } else {
        navigate("/Login");
      }
      console.log(action)

      //navigate("/Login"); // Redirect to login if not authenticated
    }
  }, [token,action]);
  useEffect(() => {
    //console.log(token)
      // Vérifier si le token est autorisé côté serveur
      if(token){
      axios.post('/api/authorization/', null, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        
        console.log("authorisé",response)
      })
      .catch(error => {
        console.log("error")

        // Si le token n'est pas autorisé, déconnectez l'utilisateur et redirigez-le vers la page de connexion
        logout();
      });
    }}
  , [token,navigate]);

  const login = (token,id,name,WalletID) => {
    setToken(token);
    setID(id)
    setName(name)
    setWalletID(WalletID)
    localStorage.setItem('citizienAuth', JSON.stringify(token) );
    localStorage.setItem('citizienID', JSON.stringify(id) );
    localStorage.setItem('citizienName', JSON.stringify(name) );
    localStorage.setItem('WalletID', JSON.stringify(WalletID) );
    navigate("/Home")
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('citizienAuth');
    localStorage.removeItem('citizienID');
    localStorage.removeItem('citizienName');
    localStorage.removeItem('WalletID');
    navigate("/Login");
  };
  return (
    <AuthContext.Provider value={{ token, name ,id,WalletID,action,setAction ,login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

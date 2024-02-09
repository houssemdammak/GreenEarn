
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../contexts/authContext';
const PrivateRoute = ({ element }) => {
    const { token } = useContext(AuthContext);
    //console.log(token)
    return token ? element : <Navigate to="/Login" replace />;
  };

export default PrivateRoute;

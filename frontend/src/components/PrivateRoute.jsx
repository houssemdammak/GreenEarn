// File: PrivateRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../contexts/authSlice';
const PrivateRoute = ({ element }) => {
    const { token } = useContext(AuthContext);
    console.log(token)
    return token ? element : <Navigate to="/login" replace />;
  };

export default PrivateRoute;

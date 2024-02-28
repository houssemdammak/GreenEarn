
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../contexts/authSlice';
const PrivateRoute = ({ element,Role }) => {
    const { token,role } = useContext(AuthContext);
    //console.log(token)
    if(!token){
      if(Role="Login"){
        return element
      }
      else {
        return <Navigate to="/" replace />
      }
    }else{
      if(role=="Manager" && Role!="Manager"){
        return <Navigate to="/manager" replace />
      }
      else if (role === "Shipper" && Role !== "Shipper"){
        return <Navigate to="/shipperApp" replace />
      }
      else if (role === "RecyclingCenter" && Role !== "RecyclingCenter"){
        return <Navigate to="/RecyclingCenter" replace />
      }
      else if(role=="Manager" && Role=="Manager"){
        return element
      }
      else if (role === "Shipper" && Role == "Shipper"){
        return element
      }
      else if (role === "RecyclingCenter" && Role == "RecyclingCenter"){
        return element
      }
      else if (Role="Login" && role === "Shipper"){
        return <Navigate to="/shipperApp" replace />
      }
      else if(Role="Login" && role === "Manager"){
        return <Navigate to="/manager" replace />
    }
  }
    //return element;
    //return token ? element : <Navigate to="/login" replace />;
  };

export default PrivateRoute;

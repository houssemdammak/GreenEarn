
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../contexts/authSlice';
const PrivateRoute = ({ element,Role }) => {
    const { token,role } = useContext(AuthContext);
    //console.log(token)
    if(!token){
      return <Navigate to="/login" replace />
    }else{
      if(role=="Manager" && Role!="Manager"){
        return <Navigate to="/manager" replace />
      }
      else if (role === "Shipper" && Role !== "Shipper"){
        return <Navigate to="/shipperApp" replace />
      }
      else if(role=="Manager" && Role=="Manager"){
        return element
      }
      else if (role === "Shipper" && Role == "Shipper"){
        return element
      }
    }
    //return element;
    //return token ? element : <Navigate to="/login" replace />;
  };

export default PrivateRoute;

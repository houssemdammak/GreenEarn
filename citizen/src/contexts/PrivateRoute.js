
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../contexts/authContext';
const PrivateRoute = ({ element }) => {
    const { token } = useContext(AuthContext);
    //console.log(token)
    return token ? element : <Navigate to="/Login" replace />;
  };
// const PrivateRoute = ({ element }) => {
//   const { token } = useContext(AuthContext);
//   // Vérifiez si l'utilisateur est authentifié
//   if (token) {
//       // S'il est authentifié, affichez le composant passé en tant qu'élément
//       return element;
//   } else {
//       // Si l'URL correspond à '/Signup', affichez le composant SignupPage
//       if (element?.props?.path === '/SignUp') {
//         return <Navigate to="/SignUp" replace />;
//       } else {
//           // Sinon, redirigez l'utilisateur vers la page de connexion
//           return <Navigate to="/Login" replace />;
//       }
//   }
// };
export default PrivateRoute;

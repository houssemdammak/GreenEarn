import React from 'react';
import { Route, Router,Routes  } from 'react-router-dom';
import ShipperDemo from '../pages/ShipperPage';
import BinsDemo from "../pages/BinsPage";
import CitizensDemo from "../pages/CitizensPage";
import Home from "../pages/Home";

const Routes = () => {
  return (
    
<Router>
        <Routes>
          <Route path="/shippers" element={<div className="ProductDemo"><ShipperDemo /></div>} />
          <Route path="/" element={<div className="ProductDemo"><Home /></div>} />
          <Route path="/citizens" element={<div className="ProductDemo"><CitizensDemo /></div>} />
          <Route path="/bins" element={<div className="ProductDemo"><BinsDemo /></div>} />
        </Routes>
  </Router>
  );
};

export default Routes;
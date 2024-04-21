import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import PrivateRoute from './components/PrivateRoute';
import Index from './pages/index';
import ShipperApp from './pages/App Shipper/AppShipper';
import RecyclingCenter from './pages/RecyclingCenter/RecyclingCenter';
function App() {
 return(
        <Routes>
          <Route path="/shipperApp" element={<PrivateRoute element={<ShipperApp />} Role="Shipper" />} />
          <Route path="/manager/*" element={<PrivateRoute element={<Index />} Role="Manager" />} />
          <Route path="/" element={<PrivateRoute element={<Login />} Role="Login" />}/>
          {/* <Route path="/" element={<Login />} Role="Login" /> */}
          <Route path="/RecyclingCenter" element={<PrivateRoute element={<RecyclingCenter/> } Role="RecyclingCenter" />}/>
        </Routes>
     
);
}

export default App;

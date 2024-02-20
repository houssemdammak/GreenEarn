// App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ShipperDemo from './pages/ShipperPage';
import BinsDemo from './pages/BinsPage';
import CitizensDemo from './pages/CitizensPage';
import Home from './pages/Home';
import Login from './pages/login';
import Sidebar from './pages/Sidebar';
import PrivateRoute from './components/PrivateRoute';
import { PageProvider } from './contexts/pageContext';
import { AuthProvider } from './contexts/authSlice';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Index from './pages/index';
import ShipperApp from './pages/App Shipper/AppShipper';
function App() {
 return(
        <Routes>
          <Route path="/shipperApp" element={<PrivateRoute element={<ShipperApp />} Role="Shipper" />} />
          <Route path="/manager/*" element={<PrivateRoute element={<Index />} Role="Manager" />} />
          {/* <Route path="/" element={<PrivateRoute element={<Login />} />}/> */}
          <Route path="/" element={<Login />} />
        </Routes>
     
);
}

export default App;

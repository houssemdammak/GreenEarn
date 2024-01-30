import { useState,useEffect } from "react";
import {  theme } from "antd";
import { BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import ShipperDemo from "./pages/ShipperPage";
import BinsDemo from "./pages/BinsPage";
import CitizensDemo from "./pages/CitizensPage";
import Home from "./pages/Home";
import Login from './pages/loginM' 
import Register from  "./pages/Register"
import Sidebar from "./pages/Sidebar";
import { InplaceDisplay } from "primereact/inplace";
import Dashboard from "./pages/dashboard";
import { ToastContainer, toast } from 'react-toastify';
function App() {
    const user = JSON.parse(localStorage.getItem('auth'))
  
  return (
    <div className="App">
   <ToastContainer position='top-center' />
   <Routes>
          <Route path="/login" element={<Login/>} />
          <Route path="/shippers" element={user ?<div className="container"><Sidebar/><div className="ProductDemo"><ShipperDemo /></div></div>: <Navigate to="/login" />} />
          <Route path="/" element={ user ? <div className="container"><Sidebar/><div className="ProductDemo"><Home /></div></div>: <Navigate to="/login" />} />
          <Route path="/citizens" element={user ? <div className="container"><Sidebar/><div className="ProductDemo"><CitizensDemo /></div></div>: <Navigate to="/login" />} />
          <Route path="/bins" element={user ?<div className="container"><Sidebar/><div className="ProductDemo"><BinsDemo /></div></div>: <Navigate to="/login" />} />
    </Routes>
        
    </div>
  );
}

export default App;
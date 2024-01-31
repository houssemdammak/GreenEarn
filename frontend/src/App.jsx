// App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ShipperDemo from './pages/ShipperPage';
import BinsDemo from './pages/BinsPage';
import CitizensDemo from './pages/CitizensPage';
import Home from './pages/Home';
import Login from './pages/loginM';
import Sidebar from './pages/Sidebar';
import { useAuth } from './contexts/useAuth'

const PrivateRoute = ({ element, ...rest }) => {
  const { token } = useAuth();

  return token ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />}/>
        <Route path="/"element={<div className="container"><Sidebar /><div className="ProductDemo"><PrivateRoute element={<Home />} /> </div></div>}/>
        <Route path="/shippers" element={<div className="container"><Sidebar /><div className="ProductDemo"><PrivateRoute element={<ShipperDemo />}/></div></div>}/>
        <Route path="/citizens" element={<div className="container"> <Sidebar /><div className="ProductDemo"><PrivateRoute element={<CitizensDemo />} /></div></div>}/>
        <Route path="/bins" element={<div className="container"><Sidebar /><div className="ProductDemo"><PrivateRoute element={<BinsDemo />} /></div></div> }/>
      </Routes>
    </div>
  );
}

export default App;

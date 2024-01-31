// index.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import ShipperDemo from './ShipperPage';
import BinsDemo from './BinsPage';
import CitizensDemo from './CitizensPage';
import Sidebar from './Sidebar';

function Index() {
  return (
    <div className="App">
      <Sidebar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shippers" element={<ShipperDemo />} />
        <Route path="/citizens" element={<CitizensDemo />} />
        <Route path="/bins" element={<BinsDemo />} />
      </Routes>
    </div>
  );
}

export default Index;

import { Routes, Route } from "react-router-dom";
import React from 'react';
import "./App.css";
import Login from "./pages/login/login";
import StepForm from "./pages/Home1/StepForm";
import BinDemo from "./pages/bins/bin";
import PrivateRoute from './contexts/PrivateRoute';
function App() {
  return (
    <div className="App">
      <Routes>
      
      <Route path="/Home" element={<PrivateRoute element={<StepForm />} />} />

        <Route path="/" element={<PrivateRoute element={<StepForm />} />} />
        <Route path="/Bin"  element={<PrivateRoute element={<BinDemo />} />} />
        <Route path="/SignUp" element={<Login  />} />
        <Route path="/Login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;

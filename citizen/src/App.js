import { Routes, Route } from "react-router-dom";

import "./App.css";
import Login from "./pages/login/login";
import StepForm from "./pages/home/StepForm";
import BinDemo from "./pages/bins/bin";
import PrivateRoute from './contexts/PrivateRoute';

function App() {
  return (
    <div className="App">
      <Routes>
        
        
        <Route path="/Home" element={<PrivateRoute element={<StepForm />} />} />
        <Route path="/bin"  element={<PrivateRoute element={<BinDemo />} />} />
        <Route path="/Signup" element={<Login />} />
        <Route path="/Login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;

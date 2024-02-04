import { Routes, Route } from "react-router-dom";

import "./App.css";
import Login from "./pages/login/login";
import StepForm from "./pages/home/StepForm";
import BinDemo from "./pages/bins/bin";
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<StepForm />} />
        <Route path="/bin" element={<BinDemo />} />
      </Routes>
    </div>
  );
}

export default App;

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "primeicons/primeicons.css";
import { PrimeReactProvider } from "primereact/api";
import "primeflex/primeflex.css";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import { BrowserRouter } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./responsive.css";
import { AuthProvider } from "./contexts/authSlice.jsx"

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <React.StrictMode>
     
      <AuthProvider>
        <PrimeReactProvider>
          <App />
        </PrimeReactProvider>
      </AuthProvider>
      
    </React.StrictMode>
    </BrowserRouter>
);

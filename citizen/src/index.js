import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "primeicons/primeicons.css";
import { PrimeReactProvider } from "primereact/api";
import "primeflex/primeflex.css";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/authContext"
import { Web3Provider } from './contexts/web3Context';
import "react-toastify/dist/ReactToastify.css";



const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <React.StrictMode>
    <AuthProvider>
    <Web3Provider>
          <PrimeReactProvider>
            <App />
          </PrimeReactProvider>
        </Web3Provider>
      </AuthProvider>
    </React.StrictMode>
  </BrowserRouter>
);



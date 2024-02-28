// web3.js
import Web3 from "web3";

import WasteManagement from "./contracts/WasteManagement.json"; 

const initWeb3 = async () => {
  let web3;
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    try {
      // Request account access
      await window.ethereum.request({ method: "eth_requestAccounts" });
      console.log("ethereum enabled");
    } catch (error) {
      // User denied account access...
      console.error("User denied account access");
    }
  }
  // Legacy dapp browsers...
  else if (window.web3) {
    web3 = new Web3(window.web3.currentProvider);
  }
  // If no injected web3 instance is detected, fall back to Ganache
  else {
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
  }
  return web3;
};

const initContract = async (web3) => {
  const contract = new web3.eth.Contract(
    WasteManagement.abi,
    WasteManagement.networks[5777].address
  );
  return contract;
};




export { initWeb3,
         initContract,
        };
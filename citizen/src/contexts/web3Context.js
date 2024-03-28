// Web3Context.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { initWeb3, initContract } from '../web3';

const Web3Context = createContext();

export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider = ({ children }) => {
  const [web3, setWeb3] = useState(null);
  const [wasteManagementContract, setWasteManagementContract] = useState(null);
  const [citizenContract, setCitizenContract] = useState(null);

  useEffect(() => {
    const init = async () => {
      const web3Instance = await initWeb3();
      setWeb3(web3Instance);

      const contractInstance = await initContract(web3Instance);
      setWasteManagementContract(contractInstance.wasteManagementContract);
      setCitizenContract(contractInstance.citizenContract);
    };
    init();
  }, []);

  return (
    <Web3Context.Provider value={{ web3, wasteManagementContract, citizenContract }}>
      {children}
    </Web3Context.Provider>
  );
};

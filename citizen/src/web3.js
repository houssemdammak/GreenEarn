import Web3 from "web3";
import WasteManagement from "./contracts/WasteManagement.json"; 
import CitizenContract from "./contracts/CitizenContract.json";

const initWeb3 = async () => {
  let web3;
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    try {
      // Request account access
      await window.ethereum.request({ method: "eth_requestAccounts" });
      console.log("ethereum enabled");
      console.log("Accounts", web3.eth.getAccounts());

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
  const wasteManagementContract = new web3.eth.Contract(
    WasteManagement.abi,
    WasteManagement.networks[5777].address
  );

  const citizenContract = new web3.eth.Contract(
    CitizenContract.abi,
    CitizenContract.networks[5777].address
);

  return { wasteManagementContract, citizenContract };
};


//*********waste**********/
const createWaste = async (citizenContract,Weight, CitizenId,BinId) => {
  try {
    const web3 = await initWeb3(); // Initialize Web3 instance
    const accounts = await web3.eth.getAccounts(); // Get accounts
    const senderAddress = accounts[1]; //the citizen address

    // Send transaction to the blockchain
    const transaction = await citizenContract.methods.createWaste(Weight, CitizenId,BinId).send({ 
      from: senderAddress
    });  
    console.log("Wastes created successfully!");
    // Retrieve the bin ID from the emitted event
    return { status: 'accepted'}; // Return 'accepted' status along with bin ID
  } catch (error) {
    console.error("Error creating Wastes:", error);
    return { status: 'rejected'}; // Return 'rejected' status and null bin ID if transaction fails
  }
};

export { initWeb3, initContract,createWaste };

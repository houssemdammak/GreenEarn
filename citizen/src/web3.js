import Web3 from "web3";
//import WasteManagement from "./contracts/WasteManagement.json"; 
import WasteManagement from "./frontend/src/contracts/WasteManagement.json"; 

const initWeb3 = async () => {
  let web3;
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    try {
      // Request account access
      await window.ethereum.request({ method: "eth_requestAccounts" });
      console.log("ethereum enabled");
      const accounts = await web3.eth.getAccounts();
      console.log("account metamask :",accounts)
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


//*********waste**********/
const createWaste = async (contract,Weight, CitizenId,BinId) => {
  try {
    const web3 = await initWeb3(); // Initialize Web3 instance
    const accounts = await web3.eth.getAccounts(); // Get accounts
    const senderAddress = accounts[0]; //the citizen address

    // Send transaction to the blockchain
    const transaction = await contract.methods.createWaste(Weight, CitizenId,BinId).send({ 
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

const createCitizen = async (contract,CitizenId) => {
  try {
    const web3 = await initWeb3(); // Initialize Web3 instance
    const accounts = await web3.eth.getAccounts(); // Get accounts
    const senderAddress = accounts[0]; //the citizen address

    // Send transaction to the blockchain
    const transaction = await contract.methods.createCitizen(CitizenId).send({ 
      from: senderAddress
    });  
    console.log("Citizen created successfully!");
    // Retrieve the bin ID from the emitted event
    return { status: 'accepted'}; // Return 'accepted' status along with bin ID
  } catch (error) {
    console.error("Error creating citizen:", error);
    return { status: 'rejected'}; // Return 'rejected' status and null bin ID if transaction fails
  }
};




export { initWeb3, initContract,createWaste,createCitizen };
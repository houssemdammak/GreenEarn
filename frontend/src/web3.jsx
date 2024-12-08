// web3.js
import Web3 from "web3";
import WasteManagement from "./contracts/WasteManagement.json"; // Assuming you have this JSON file

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
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:22000"));
  }
  return web3;
};

const initContract = async (web3) => {
  const contract = new web3.eth.Contract(
    WasteManagement.abi,
    WasteManagement.networks[10].address
  );
  return contract;
};


//*********BIN**********/
const createBin = async (contract, location, capacity, currentWeight) => {
  try {
    const web3 = await initWeb3(); // Initialize Web3 instance
    const accounts = await web3.eth.getAccounts(); // Get accounts
    const senderAddress = accounts[0]; // Assuming you want to use the first account

    // Send transaction to the blockchain
    const transaction = await contract.methods.createBin(location, capacity, currentWeight).send({ 
      from: senderAddress,gasPrice: await web3.eth.getGasPrice()
    });  
    console.log("Bin created successfully!");
    // Retrieve the bin ID from the emitted event
    const binId = transaction.events.BinCreated.returnValues.id;
    console.log(binId)
    return { status: 'accepted', binId }; // Return 'accepted' status along with bin ID
  } catch (error) {
    console.error("Error creating bin:", error);
    console.error("Error details:", error.message || error);
    return { status: 'rejected', binId: null }; // Return 'rejected' status and null bin ID if transaction fails
  }
};

const deleteBin = async (contract, id) => {
  const web3 = await initWeb3(); // Initialize Web3 instance
    const accounts = await web3.eth.getAccounts(); // Use web3 instance to access getAccounts
    console.log(accounts)
    const senderAddress = accounts[0];
  try {
    await contract.methods.deleteBin(id).send({ 
      from: senderAddress
  });  
    console.log("Bin deleted successfully!");
    return { status: 'accepted'}; 

  } catch (error) {
    console.error("Error deleting bin:", error);
    return { status: 'rejected'};
  }
};

const modifyBin = async (contract, binId, location,  capacity) => {
  try {
    const web3 = await initWeb3(); // Initialize Web3 instance
    const accounts = await web3.eth.getAccounts(); // Get accounts
    const senderAddress = accounts[0]; // Assuming you want to use the first account
    // Send transaction to the blockchain
    await contract.methods.modifyBin(binId, location, capacity).send({ 
      from: senderAddress,gasPrice: await web3.eth.getGasPrice()
    });  

    console.log("Bin modified successfully!");

    return { status: 'accepted' }; // Return 'accepted' status if transaction succeeds
  } catch (error) {
    console.error("Error modifying bin:", error);
    return { status: 'rejected' }; // Return 'rejected' status if transaction fails
  }
};

//*********Shipper**********/
const createShipper = async (contract, walletId) => {
  try {
    const web3 = await initWeb3(); // Initialize Web3 instance
    const accounts = await web3.eth.getAccounts(); // Get accounts
    const senderAddress = accounts[0]; // Assuming you want to use the first account

    // Send transaction to the blockchain
    const transaction = await contract.methods.createShipper(walletId).send({ 
      from: senderAddress
    });  
    console.log("Shipper created successfully!");
    return { status: 'accepted'}; 
  } catch (error) {
    console.error("Error creating shipper:", error);
    return { status: 'rejected'}; 
  }
};

const deleteShipper = async (contract, walletId) => {
  const web3 = await initWeb3(); // Initialize Web3 instance
    const accounts = await web3.eth.getAccounts(); // Use web3 instance to access getAccounts
    console.log(accounts)
    const senderAddress = accounts[0];
  try {
    await contract.methods.deleteShipper(walletId).send({ 
      from: senderAddress
  });  
    console.log("Shipper deleted successfully!");
    return { status: 'accepted'}; 

  } catch (error) {
    console.error("Error deleting Shipper:", error);
    return { status: 'rejected'};
  }
};

const modifyShipper = async (contract,walletId) => {
  try {
    const web3 = await initWeb3(); // Initialize Web3 instance
    const accounts = await web3.eth.getAccounts(); // Get accounts
    const senderAddress = accounts[0]; // Assuming you want to use the first account
    // Send transaction to the blockchain
    await contract.methods.modifyShipper(walletId).send({ 
      from: senderAddress
    });  

    console.log("Shipper modified successfully!");

    return { status: 'accepted' }; 
  } catch (error) {
    console.error("Error modifying Shipper:", error);
    return { status: 'rejected' }; 
  }
};


//*********Citizen**********/

const createCitizen = async (contract, walletId) => {
  try {
    const web3 = await initWeb3(); // Initialize Web3 instance
    const accounts = await web3.eth.getAccounts(); // Get accounts
    const senderAddress = accounts[0]; // Assuming you want to use the first account

    // Send transaction to the blockchain
    const transaction = await contract.methods.createCitizen(walletId).send({ 
      from: senderAddress
    });  
    console.log("Citizen created successfully!");
    return { status: 'accepted'}; 
  } catch (error) {
    console.error("Error creating Citizen:", error);
    return { status: 'rejected'}; 
  }
};

const deleteCitizen = async (contract, walletId) => {
  const web3 = await initWeb3(); // Initialize Web3 instance
    const accounts = await web3.eth.getAccounts(); // Use web3 instance to access getAccounts
    console.log(accounts)
    const senderAddress = accounts[0];
  try {
    await contract.methods.deleteCitizen(walletId).send({ 
      from: senderAddress
  });  
    console.log("Citizen deleted successfully!");
    return { status: 'accepted'}; 

  } catch (error) {
    console.error("Error deleting Citizen:", error);
    return { status: 'rejected'};
  }
};

const modifyCitizen = async (contract,walletId) => {
  try {
    const web3 = await initWeb3(); // Initialize Web3 instance
    const accounts = await web3.eth.getAccounts(); // Get accounts
    const senderAddress = accounts[0]; // Assuming you want to use the first account
    // Send transaction to the blockchain
    await contract.methods.modifyCitizen(walletId).send({ 
      from: senderAddress
    });  

    console.log("Citizen modified successfully!");

    return { status: 'accepted' }; 
  } catch (error) {
    console.error("Error modifying Citizen:", error);
    return { status: 'rejected' }; 
  }
};

const createCollection = async (contract, shipperId, binId, date) => {
  try {
    const web3 = await initWeb3(); // Initialize Web3 instance
    const accounts = await web3.eth.getAccounts(); // Get accounts
    const senderAddress = accounts[0]; // Assuming you want to use the first account

    // Send transaction to the blockchain
    const transaction = await contract.methods.createCollection(shipperId, binId, date).send({ 
      from: senderAddress
    });  
    console.log("Collection created successfully!");
    // Retrieve the bin ID from the emitted event
    const collectionId = transaction.events.CollectionCreated.returnValues.id;
    console.log(binId)
    return { status: 'accepted', collectionId }; // Return 'accepted' status along with bin ID
  } catch (error) {
    console.error("Error creating Collection:", error);
    return { status: 'rejected', collectionId: null }; // Return 'rejected' status and null bin ID if transaction fails
  }
};

const shipCollection = async (contract, collectionId,shipperId,date) => {
  try {
    const web3 = await initWeb3(); // Initialize Web3 instance
    const accounts = await web3.eth.getAccounts(); // Get accounts
    const senderAddress = accounts[0]; // Assuming you want to use the first account

    // Send transaction to the blockchain
    const transaction = await contract.methods.shipCollection(collectionId,shipperId,date).send({ 
      from: senderAddress
    });  
    console.log("Collection shipped successfully!");
    return { status: 'accepted', collectionId }; // Return 'accepted' status along with bin ID
  } catch (error) {
    console.error("Error shipping Collection:", error);
    return { status: 'rejected', collectionId: null }; // Return 'rejected' status and null bin ID if transaction fails
  }
};


const RecycleCollection = async (contract, collectionId,date) => {
  try {
    const web3 = await initWeb3(); // Initialize Web3 instance
    const accounts = await web3.eth.getAccounts(); // Get accounts
    const senderAddress = accounts[0]; // Assuming you want to use the first account

    // Send transaction to the blockchain
    const transaction = await contract.methods.recycleCollection(collectionId,date).send({ 
      from: senderAddress
    });  
    console.log("Collection recycled successfully!");
    return { status: 'accepted', collectionId }; 
  } catch (error) {
    console.error("Error recycling Collection:", error);
    return { status: 'rejected', collectionId: null }; 
  }
};


// const notifyShipper = async (contract,shipperID,BinID) => {
//   try {
//     const web3 = await initWeb3(); // Initialize Web3 instance
//     const accounts = await web3.eth.getAccounts(); // Get accounts
//     const senderAddress = accounts[0]; // Assuming you want to use the first account
//     // Send transaction to the blockchain
//     await contract.methods.notifyShipper(shipperID,BinID).send({ 
//       from: senderAddress
//     });  



export { initWeb3,
         initContract,
         createBin,
         deleteBin,
         modifyBin,
         createShipper,
         deleteShipper,
         modifyShipper,
         createCitizen,
         deleteCitizen,
         modifyCitizen,
         createCollection,
         shipCollection,
         RecycleCollection
        };
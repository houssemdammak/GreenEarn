const WasteManagement = artifacts.require("./WasteManagement.sol");
module.exports = function (deployer) {
  deployer.deploy(WasteManagement);
};

// const WasteManagement = artifacts.require("./WasteManagement.sol");
// const CitizenContract = artifacts.require("./CitizenContract.sol");

// module.exports = function (deployer) {
//   deployer.deploy(WasteManagement)
//   .then(function() {
//     return deployer.deploy(CitizenContract, WasteManagement.address);
//   })
//   .catch(function(error) {
//     console.error("Error during deployment aaaaaaaaaa:", error);
//   });
// };
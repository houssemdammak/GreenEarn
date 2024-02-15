const WasteManagement = artifacts.require("./WasteManagement.sol");
module.exports = function (deployer) {
  deployer.deploy(WasteManagement);
};

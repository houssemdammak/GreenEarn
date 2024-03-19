// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "./WasteManagement.sol";

contract CitizenContract {
    WasteManagement WasteManage;

    constructor(address _wasteManagementAddress) {
        WasteManage = WasteManagement(_wasteManagementAddress);
    }
    event   WasteCreated(string wasteId);
  function createWaste(string memory _id, uint256 _weight, address _citizenId, string memory _binId) external {
    require(WasteManage.getIsBin(_binId), "Bin doesn't exist");
    require(WasteManage.getIsCitizen(_citizenId), "Citizen doesn't exist");
    require(WasteManage.CheckWaste(_id), "Waste already exists");
    WasteManage.setWaste(_id,  _weight, _citizenId, _binId);
    emit WasteCreated(_id);
}    
}

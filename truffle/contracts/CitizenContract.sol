// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./WasteManagement.sol";
contract CitizenContract{
    WasteManagement WasteManage;
    function createWaste(string memory _id, uint256 _weight, address _citizenId, string memory _binId) external {
    require(WasteManage.getIsBin(_binId), "Bin doesn't exist");
    require(WasteManage.isCitizen(_citizenId), "Citizen doesn't exist");
    require(!WasteManage.isWaste(_id), "Waste already exists");
    WasteManage.wasteCount++;
    WasteManage.wastes[_id] = WasteManagement.Waste(_id, "In Bin", _weight, _citizenId, address(0), address(0), _binId);
    WasteManage.wasteIds.push(_id);
    WasteManage.isWaste[_id] = true;
}






}
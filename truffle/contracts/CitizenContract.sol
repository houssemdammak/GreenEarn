// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "./WasteManagement.sol";

contract CitizenContract {
    WasteManagement WasteManage;

    constructor(address _wasteManagementAddress) {
        WasteManage = WasteManagement(_wasteManagementAddress);
    }

    function createWaste(string memory _id, uint256 _weight, address _citizenId, string memory _binId) external {
        require(WasteManage.getIsBin(_binId), "Bin doesn't exist");
        require(WasteManage.getIsCitizen(_citizenId), "Citizen doesn't exist");
        require(WasteManage.CheckWaste(_id), "Waste already exists");

        uint256 wasteCount = WasteManage.getWasteCount();
        WasteManage.setWasteCount(wasteCount + 1);

        WasteManagement.Waste memory newWaste = WasteManagement.Waste(_id, "In Bin", _weight, _citizenId, address(0), address(0), _binId);
        WasteManage.setWastes(_id, newWaste);
    }
}

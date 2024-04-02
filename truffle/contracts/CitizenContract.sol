// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
// import "./WasteManagement.sol";

// contract CitizenContract {
//     WasteManagement WasteManage;

//     constructor(address _wasteManagementAddress) {
//         WasteManage = WasteManagement(_wasteManagementAddress);
//     }
//     event   WasteCreated(string wasteId);
//   function createWaste(uint256 _weight, address _citizenId, string memory _binId) external {
//     string memory _id =generateUniqueId();
//     require(WasteManage.getIsBin(_binId), "Bin doesn't exist");
//     require(WasteManage.getIsCitizen(_citizenId), "Citizen doesn't exist");
//     require(WasteManage.CheckWaste(_id), "Waste already exists");
//     WasteManage.setWaste(_id,  _weight, _citizenId, _binId);
//     emit WasteCreated(_id);
// }       

// function generateUniqueId() internal view returns (string memory) {
//     bytes32 hash = keccak256(abi.encodePacked(
//         block.timestamp,
//         block.prevrandao,
//         block.coinbase,
//         msg.sender
//     ));

//     // Convert hash to string
//     uint256 value = uint256(hash);
//     if (value == 0) {
//         return "0";
//     }
    
//     uint256 temp = value;
//     uint256 digits;
    
//     while (temp != 0) {
//         digits++;
//         temp /= 10;
//     }
    
//     bytes memory buffer = new bytes(digits);
    
//     while (value != 0) {
//         digits -= 1;
//         buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
//         value /= 10;
//     }
    
//     return string(buffer);
// }
// }

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract WasteManagement {
    struct Bin {
        string id;
        string location;
        string state;
        uint256 capacity;
        uint256 currentWeight;
    }
    struct Notif{
        address shipperNotified;
        uint256 binNotif;
        bool done;
    }
    event BinCreated(string id);


    uint256 public binCount;
    mapping(string => Bin) public bins;
    string[] binIds;
    address[] citizens; // Array to store addresses of citizens
    address[] shippers; // Array to store addresses of shippers
    mapping(string => bool) isBin; // Mapping to check if an address is a bin
    mapping(address => bool) isCitizen; // Mapping to check if an address is a citizen
    mapping(address => bool) isShipper; // Mapping to check if an address is a shipper
    address public owner;
    mapping(address => mapping(uint256 => Notif)) public notifications;
    


    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
    }



                     //*************Bin************//
 function createBin(string memory _location, string memory _state, uint256 _capacity, uint256 _currentWeight) external onlyOwner returns (string memory) {
        string memory _id = generateUniqueId();
        require(!isBin[_id], "Generated ID already exists");
        bins[_id] = Bin(_id, _location, _state, _capacity, _currentWeight);
        binIds.push(_id);
        binCount++;
        isBin[_id] = true;
        emit BinCreated(_id);
        return _id;
    }


    function modifyBin(string memory _id, string memory _location, string memory _state, uint256 _capacity, uint256 _currentWeight) external onlyOwner {
        require(isBin[_id], "Bin does not exist");
        bins[_id] = Bin(_id, _location, _state, _capacity, _currentWeight);
    }

    function deleteBin(string memory _id) external onlyOwner {
        require(isBin[_id], "Bin does not exist");

        // Find the index of the bin ID in binIds
        uint256 indexToDelete = binIds.length; // Initialize to an out-of-bounds index
        for (uint256 i = 0; i < binIds.length; i++) {
            if (keccak256(abi.encodePacked(binIds[i])) == keccak256(abi.encodePacked(_id))) {
                indexToDelete = i;
                break;
            }
        }

        // Ensure the bin ID was found in the binIds array
        require(indexToDelete < binIds.length, "Bin ID not found in binIds array");

        // Remove the bin ID from binIds
        for (uint256 i = indexToDelete; i < binIds.length - 1; i++) {
            binIds[i] = binIds[i + 1];
        }
        binIds.pop();

        // Decrement binCount
        binCount--;

        // Update mappings
        isBin[_id] = false;
        delete bins[_id];
    }
    
    function getBins() public view returns (string [] memory, string[] memory, string[] memory, uint256[] memory, uint256[] memory) {
        string[] memory locations = new string[](binCount);
        string[] memory states = new string[](binCount);
        uint256[] memory capacities = new uint256[](binCount);
        uint256[] memory currentWeights = new uint256[](binCount);

        for (uint256 i = 0; i < binCount; i++) {
            Bin memory bin = bins[binIds[i]];
            locations[i] = bin.location;
            states[i] = bin.state;
            capacities[i] = bin.capacity;
            currentWeights[i] = bin.currentWeight;
        }

        return (binIds, locations, states, capacities, currentWeights);
    }
    function generateUniqueId() internal view returns (string memory) {
        bytes32 hash = keccak256(abi.encodePacked(block.timestamp, block.prevrandao, binCount));
        return toStringUniqueId(uint64(uint256(hash)));
    }
    //ena zedt fazat uint64 bech nsa8arha

    function toStringUniqueId(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }

}
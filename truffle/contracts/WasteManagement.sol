// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract WasteManagement {
    struct Bin {
        uint256 id;
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

    uint256 public binCount;
    mapping(uint256 => Bin) public bins;
    uint256[] binIds;
    address[] citizens; // Array to store addresses of citizens
    address[] shippers; // Array to store addresses of shippers
    mapping(uint256 => bool) isBin; // Mapping to check if an address is a bin
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
    function createBin(uint256 _id, string memory _location, string memory _state, uint256 _capacity, uint256 _currentWeight) external onlyOwner {
        require(!isBin[_id], "Bin already exists");
        bins[_id] = Bin(_id, _location, _state, _capacity, _currentWeight);
        binIds.push(_id);
        binCount++;
        isBin[_id] = true;
    }

    function modifyBin(uint256 _id, string memory _location, string memory _state, uint256 _capacity, uint256 _currentWeight) external onlyOwner {
        require(isBin[_id], "Bin does not exist");
        bins[_id] = Bin(_id, _location, _state, _capacity, _currentWeight);
    }

    function deleteBin(uint256 _id) external onlyOwner {
        require(isBin[_id], "Bin does not exist");
        
        // Update mappings and arrays
        isBin[_id] = false;
        delete bins[_id];
        
        // Find and remove the bin ID from binIds array
        for (uint256 i = 0; i < binIds.length; i++) {
            if (binIds[i] == _id) {
                for (uint256 j = i; j < binIds.length - 1; j++) {
                    binIds[j] = binIds[j + 1];
                }
                binIds.pop();
                break;
            }
        }
        
        // Decrement binCount
        binCount--;
    }
    
    function getBins() public view returns (uint256[] memory, string[] memory, string[] memory, uint256[] memory, uint256[] memory) {
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




                        //*************Citizen************//
    function createCitizen(address _citizen) external onlyOwner {
        require(!isCitizen[_citizen], "Citizen already exists");
        require(_citizen != owner, "Cannot create citizen with owner's address");

        citizens.push(_citizen);
        isCitizen[_citizen] = true;
    }


    function getCitizens() public view returns (address[] memory) {
        return citizens;
    }

    function deleteCitizen(address _citizenAddress) external onlyOwner {
        for (uint256 i = 0; i < citizens.length; i++) {
            if (citizens[i] == _citizenAddress) {
                citizens[i] = citizens[
                    citizens.length - 1
                ];
                citizens.pop();
                break;
            }
        }
    }


                         //*************Shipper************//
    function createShipper(address _shipper) external onlyOwner {
        // Check if the shipper already exists
        require(!isShipper[_shipper], "Shipper already exists");

        // Add the shipper to the database
        shippers.push(_shipper);
        isShipper[_shipper] = true;
    }

    function getShippers() public view returns (address[] memory) {
        return shippers;
    }

    function notifyShipper(address _shipper, uint256 _idBin) external onlyOwner {
        require(isShipper[_shipper], "Shipper doesn't exist");
        require(isBin[_idBin], "Bin doesn't exist");
        notifications[_shipper][_idBin] = Notif(_shipper, _idBin, false);
    }

    function getNotifByShipper(address _shipper) public view returns (Notif[] memory) {
        // Create an array to store notifications for the specified shipper
        Notif[] memory shipperNotifications = new Notif[](binCount);

        for (uint256 i = 0; i < binCount; i++) {
            uint256 binId = binIds[i];
            if (isBin[binId]) {
                shipperNotifications[i] = notifications[_shipper][binId];
            }
        }

        return shipperNotifications;
    }

   function getAllNotif() public view returns (Notif[] memory) {
        // Calculate the total number of notifications
        uint256 totalNotifications = 0;
        for (uint256 i = 0; i < shippers.length; i++) {
            for (uint256 j = 0; j < binCount; j++) {
                uint256 binId = binIds[j];
                if (isBin[binId] && notifications[shippers[i]][binId].shipperNotified != address(0)) {
                    totalNotifications++;
                }
            }
        }

        // Create an array to store all notifications
        Notif[] memory allNotifications = new Notif[](totalNotifications);

        uint256 index = 0;
        for (uint256 i = 0; i < shippers.length; i++) {
            for (uint256 j = 0; j < binCount; j++) {
                uint256 binId = binIds[j];
                Notif memory notification = notifications[shippers[i]][binId];
                if (isBin[binId] && notification.shipperNotified != address(0)) {
                    allNotifications[index] = notification;
                    index++;
                }
            }
        }

        return allNotifications;
    }




   function deleteShipper(address _shipperAddress) external onlyOwner {
        for (uint256 i = 0; i < shippers.length; i++) {
            if (shippers[i] == _shipperAddress) {
                shippers[i] = shippers[
                    shippers.length - 1
                ];
                shippers.pop();
                break;
            }
        }
    }



}
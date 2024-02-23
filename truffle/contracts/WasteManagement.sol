// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract WasteManagement {
    struct Bin {
        string id; // Changed type to string
        string location;
        uint256 capacity;
        uint256 currentWeight;
    }
    struct Waste {
        string id;
        string status;
        uint256 weight;
        address citizenId;
        address shipperId;
        address recyclerId;
        string binId; // Changed type to string
    }
    struct Notif {
        address shipperNotified;
        string binNotif; // Changed type to string
        bool done;
    }
    event BinCreated(string id);
    event ModifShipper(string message);
    event ModifCitizen(string message);
    uint256 public wasteCount;
    uint256 public binCount;
    mapping(string => Bin) public bins; // Changed key type to string
    string[] binIds; // Changed type to string
    string[] wasteIds; // Changed type to string
    mapping(string => Waste) public wastes; // Changed key type to string
    address[] citizens;
    address recycler = address(0x4494f3bb19F95BB33EC116887b9dbd728C008f9b);
    address[] shippers;
    mapping(string => bool) isBin;
    mapping(string => bool) isWaste;
    mapping(address => bool) isCitizen;
    mapping(address => bool) isShipper;
    address public owner;
    mapping(address => mapping(string => Notif)) public notifications; // Changed key type to string
    mapping(address => uint256) public citizenRewards;
    


    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
    }



                     //*************Bin************//
    function createBin(string memory _location,  uint256 _capacity, uint256 _currentWeight) external onlyOwner returns (string memory) {
        string memory _id = generateUniqueId();
        require(!isBin[_id], "Generated ID already exists");
        bins[_id] = Bin(_id, _location,  _capacity, _currentWeight);
        binIds.push(_id);
        binCount++;
        isBin[_id] = true;
        emit BinCreated(_id);
        return _id;
    }

    function modifyBin(string memory _id, string memory _location,  uint256 _capacity, uint256 _currentWeight) external onlyOwner {
        require(isBin[_id], "Bin does not exist");
        bins[_id] = Bin(_id, _location,  _capacity, _currentWeight);
    }

    function deleteBin(string memory _id) external onlyOwner {
        require(isBin[_id], "Bin does not exist");
        
        // Update mappings and arrays
        isBin[_id] = false;
        delete bins[_id];
        
        // Find and remove the bin ID from binIds array
        for (uint256 i = 0; i < binIds.length; i++) {
            if (keccak256(bytes(binIds[i])) == keccak256(bytes(_id))) {
                for (uint256 j = i; j < binIds.length - 1; j++) {
                    binIds[j] = binIds[j + 1];
                }
                binIds.pop();
                isBin[_id]=false;
                break;
            }
        }
        
        // Decrement binCount
        binCount--;
    }
    
    function getBins() public view returns (string[] memory, string[] memory, uint256[] memory, uint256[] memory) {
        string[] memory ids = new string[](binCount);
        string[] memory locations = new string[](binCount);
       
        uint256[] memory capacities = new uint256[](binCount);
        uint256[] memory currentWeights = new uint256[](binCount);

        for (uint256 i = 0; i < binCount; i++) {
            Bin memory bin = bins[binIds[i]];
            ids[i] = bin.id;
            locations[i] = bin.location;
            capacities[i] = bin.capacity;
            currentWeights[i] = bin.currentWeight;
        }

        return (ids, locations, capacities, currentWeights);
    }
    function generateUniqueId() internal view returns (string memory) {
        bytes32 hash = keccak256(abi.encodePacked(block.timestamp, block.prevrandao, binCount));
        return toStringUniqueId((uint256(hash)));
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

                   //*****************Shipper********************//



    function createShipper(address _shipper) external onlyOwner {
        require(!isShipper[_shipper], "Shipper already exists");

        shippers.push(_shipper);
        isShipper[_shipper] = true;
    }

    function getShippers() public view returns (address[] memory) {
        return shippers;
    }

    function notifyShipper(address _shipper, string memory _idBin) external onlyOwner {
        require(isShipper[_shipper], "Shipper doesn't exist");
        require(isBin[_idBin], "Bin doesn't exist");
        notifications[_shipper][_idBin] = Notif(_shipper, _idBin, false);
    }

    function getNotifByShipper(address _shipper) public view returns (Notif[] memory) {
        Notif[] memory shipperNotifications = new Notif[](binCount);

        for (uint256 i = 0; i < binCount; i++) {
            string memory binId = binIds[i];
            if (isBin[binId]) {
                shipperNotifications[i] = notifications[_shipper][binId];
            }
        }

        return shipperNotifications;
    }

    function getAllNotif() public view returns (Notif[] memory) {
        uint256 totalNotifications = 0;
        for (uint256 i = 0; i < shippers.length; i++) {
            for (uint256 j = 0; j < binCount; j++) {
                string memory binId = binIds[j];
                if (isBin[binId] && notifications[shippers[i]][binId].shipperNotified != address(0)) {
                    totalNotifications++;
                }
            }
        }

        Notif[] memory allNotifications = new Notif[](totalNotifications);

        uint256 index = 0;
        for (uint256 i = 0; i < shippers.length; i++) {
            for (uint256 j = 0; j < binCount; j++) {
                string memory binId = binIds[j];
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
                isShipper[_shipperAddress]=false;
                break;
            }
        }
    }

    function modifyShipper(address _shipperAddress) external onlyOwner {
        require(isShipper[ _shipperAddress], "Shipper does not exist");
        
        // Emit a message after the require statement
        emit ModifShipper("Shipper can be modified");
        
        // Further logic here if needed
    }
                        //*****************Citizen********************//
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
                isCitizen[_citizenAddress]=false;
                break;
            }
        }
    }
    function modifyCitizen(address _citizenAddress) external onlyOwner {
        require(isCitizen[ _citizenAddress], "Citizen does not exist");
        
        // Emit a message after the require statement
        emit ModifCitizen("Citizen can be modified");
        
        // Further logic here if needed
    }


}
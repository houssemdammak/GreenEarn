// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WasteManagement is ERC20, Ownable {
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
        string dateCollection;
    }
    struct Collection {
        string idCollection;
        address shipperNotified;
        string binNotif; // Changed type to string
        bool done;
        string date;
        string status;
    }
    struct Notif {
        address shipperNotified;
        string binNotif; // Changed type to string
        bool done;
    }
    event BinCreated(string id);
    //event BinCreated(string id);
    event CollectionCreated(string id);
    event ModifShipper(string message);
    event ModifCitizen(string message);
    uint256 public wasteCount;
    uint256 public binCount;
    uint256 public collectionCount;
    mapping(string => Bin) public bins; // Changed key type to string
    mapping(string => Collection) public collections;
    string[] binIds; // Changed type to string
    string[] collectionIds;
    string[] public wasteIds; // Changed type to string
    mapping(string => Waste) public wastes; // Changed key type to string
    address[] citizens;
    address recycler = address(0x4494f3bb19F95BB33EC116887b9dbd728C008f9b);
    address[] shippers;
    mapping(string => bool) isBin;
    mapping(string => bool) isCollection;
    mapping(string => bool) isWaste;
    mapping(address => bool) isCitizen;
    mapping(address => bool) isShipper;
    //mapping(address => mapping(string => Notif)) public notifications; // Changed key type to string
    mapping(address => uint256) public citizenRewards;
    uint256 shipCount=0;
    mapping(address => mapping(string => Notif))  notifications;


  uint public maxSupply;
    constructor() ERC20("GreenEarn Transfer", "GRN") Ownable(msg.sender) {
        maxSupply = 1000000000000000000000; // 1000000000000000000000 GRN
        mint(msg.sender, 1000000000000000000000); // Mint initial supply to contract deployer
    }

    function mint(address to, uint amount) public onlyOwner {
        require(totalSupply() + amount <= maxSupply, "Max Supply Exceeded");
        _mint(to, amount);
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
    // function generateUniqueId() internal view returns (string memory) {
    //     bytes32 hash = keccak256(abi.encodePacked(block.timestamp, block.prevrandao, binCount));
    //     uint256 value=(uint256(hash));
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

// Function to generate a unique ID
function generateUniqueId() internal view returns (string memory) {
    bytes32 hash = keccak256(abi.encodePacked(
        block.timestamp,
        block.prevrandao,
        block.coinbase,
        msg.sender,
        binCount,
        collectionCount // Assuming this is a counter for collections
    ));

    // Convert hash to string
    uint256 value = uint256(hash);
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

    // function getShippers() public view returns (address[] memory) {
    //     return shippers;
    // }

    // function notifyShipper(address _shipper, string memory _idBin, string memory _date) external onlyOwner {

    //     require(isShipper[_shipper], "Shipper doesn't exist");
    //     require(isBin[_idBin], "Bin doesn't exist");
    //     notifications[_shipper][_idBin] = Notif(_shipper, _idBin, false);
    // }

    function createCollection(address _shipper, string memory _idBin, string memory _date) external onlyOwner returns (string memory) {
        require(isShipper[_shipper], "Shipper doesn't exist");
        require(isBin[_idBin], "Bin doesn't exist");

        // Check if a collection with the same bin and date already exists
        for (uint256 i = 0; i < collectionIds.length; i++) {
            Collection storage collection = collections[collectionIds[i]];
            if (keccak256(bytes(collection.binNotif)) == keccak256(bytes(_idBin)) && keccak256(bytes(collection.date)) == keccak256(bytes(_date))) {
                revert("Collection already exists for this bin and date");
            }
        }
        // Generate a unique ID for the new collection
        string memory _idCollection = generateUniqueId();
        require(!isCollection[_idCollection], "Generated IDCollection already exists");

        // Update dateCollection for waiting wastes with the same bin ID
        for (uint256 j = 0; j < wasteIds.length; j++) {
            Waste storage waste = wastes[wasteIds[j]];
            if (keccak256(bytes(waste.binId)) == keccak256(bytes(_idBin)) && keccak256(bytes(waste.status)) == keccak256(bytes("Waiting"))) {
                waste.dateCollection = _date;
                waste.shipperId=_shipper;
            }
        }
        // Create the new collection
        collections[_idCollection] = Collection(_idCollection, _shipper, _idBin, false, _date, "Waiting");
        collectionIds.push(_idCollection);
        collectionCount++;
        isCollection[_idCollection] = true;
         if (!notifications[_shipper][_date].done) {
            // If not, create a new notification
            notifications[_shipper][_date] = Notif(_shipper, _idBin, false);
        }
        emit CollectionCreated(_idCollection);

        return _idCollection;
    }


    function shipCollection(string memory _idCollection, address _shipperId, string memory _date) external onlyOwner  {
        require(isCollection[_idCollection], "Collection doesn't exist");
        if (collections[_idCollection].shipperNotified != _shipperId) {
            revert("This collection doesn't concern this shipper");
        }
        string storage date= collections[_idCollection].date;
        // Update collection status and shipper notification
        // Update waste status and dateCollection for all wastes in the collection
        for (uint256 i = 0; i < wasteIds.length; i++) {
            Waste storage waste = wastes[wasteIds[i]];
            if ((keccak256(bytes(waste.binId)) == keccak256(bytes(collections[_idCollection].binNotif)) )&&
                (waste.shipperId == _shipperId) && (keccak256(bytes(waste.dateCollection)) == keccak256(bytes(collections[_idCollection].date)))) {
                    waste.dateCollection = _date;
                    waste.status = "Shipped"; 
                    shipCount++; // Increment shipCount for each waste that meets the conditions
            }
        }
        collections[_idCollection].date = _date;
        collections[_idCollection].status = "Shipped";
        notifications[_shipperId][date].done=true;
    }
 
    // function deleteShipper(address _shipperAddress) external onlyOwner {
    //     for (uint256 i = 0; i < shippers.length; i++) {
    //         if (shippers[i] == _shipperAddress) {
    //             shippers[i] = shippers[
    //                 shippers.length - 1
    //             ];
    //             shippers.pop();
    //             isShipper[_shipperAddress]=false;
    //             break;
    //         }
    //     }
    // }

    function modifyShipper(address _shipperAddress) external onlyOwner {
        require(isShipper[ _shipperAddress], "Shipper does not exist");
        
        // Emit a message after the require statement
        emit ModifShipper("Shipper can be modified");
        
        // Further logic here if needed
    }
    
                         //*****************Recycler********************//
    
    function recycleCollection(string memory _idCollection,string memory _date) external  {
        require(isCollection[_idCollection], "Collection doesn't exist");
        
        for (uint256 i = 0; i < wasteIds.length; i++) {
            Waste storage waste = wastes[wasteIds[i]];
            if (keccak256(bytes(waste.binId)) == keccak256(bytes(collections[_idCollection].binNotif)) &&
                keccak256(bytes(waste.dateCollection)) == keccak256(bytes(collections[_idCollection].date))) {
                if (keccak256(bytes(waste.status)) == keccak256(bytes("Shipped"))) {
                    waste.dateCollection=_date;
                    waste.status = "Recyled";
                    uint256 rewardAmount = waste.weight * 1000; // Example: 1000 tokens per unit weight
                    // Transfer reward to citizen
                    _transfer(msg.sender, waste.citizenId, rewardAmount);
                }
            }
        }
        collections[_idCollection].date=_date;
        collections[_idCollection].status = "Recyled";
    }                         
                     
                     
                        //*****************Citizen********************//
    function createCitizen(address _citizen) external onlyOwner {
        require(!isCitizen[_citizen], "Citizen already exists");
       // require(_citizen != owner, "Cannot create citizen with owner's address");

        citizens.push(_citizen);
        isCitizen[_citizen] = true;
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

    // function getIsBin(string memory _binId) internal view returns (bool) {
    //     require(isBin[_binId], "Bin doesn't exist");
    //     return isBin[_binId];
    // }

    // function getIsCitizen(address _citizenId) internal view returns (bool) {
    //     require(isCitizen[_citizenId], "Citizen doesn't exist");
    //     return isCitizen[_citizenId];
    // }

    // function CheckWaste(string memory _wasteId) internal view returns (bool) {
    //     require(!isWaste[_wasteId], "Watse exist");
    //     return !isWaste[_wasteId];
    // }

    // function setWaste(string memory _wasteId,uint256 _weight,address _citizenId,string memory _binId) internal {
    //     wastes[_wasteId]=Waste(_wasteId, "Waiting", _weight, _citizenId, address(0), address(0), _binId, "");
    //     wasteIds.push(_wasteId);
    //     isWaste[_wasteId]=true;
    //     wasteCount++;
    //    // emit WasteCreated(_wasteId);

       
    // }


    /*TEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEESTS */
    // function getCountWaste() view external onlyOwner() returns (uint256){
    //     return wasteCount;
    // }

    // function getWastes()view external onlyOwner returns (Waste[]memory){
    //     Waste[] memory trash = new Waste[](wasteIds.length);
    //      for (uint256 i = 0; i < wasteIds.length; i++) {
    //         Waste storage waste = wastes[wasteIds[i]];
    //         trash[i]=waste;
    //      }
    //     return trash;
    // }

    // function getWastesIDs()view external onlyOwner returns (string[] memory){
       
    //     return wasteIds;
    // }

    // function getWastesStatus()view external onlyOwner returns (string[] memory,string[] memory){
    //     string[] memory Status = new string[](wasteIds.length);
    //     for (uint256 i = 0; i < wasteIds.length; i++) {
    //         Waste storage waste = wastes[wasteIds[i]];
    //         Status[i] = waste.status;
    //     }
    //     return(wasteIds,Status);
    // }

    // function getCollectionsIds()view external onlyOwner returns(string[] memory) {
    //      return collectionIds;
    // } 

    // function getCollectionsStatus()view external onlyOwner returns(string[] memory) {
    //       string[] memory Status = new string[](collectionIds.length);
    //     for (uint256 i = 0; i < collectionIds.length; i++) {
    //         Collection storage coll = collections[collectionIds[i]];
    //         Status[i] = coll.status;
    //     }
    //     return(Status);
    // } 

    // // function getShipCount() view external onlyOwner() returns(uint256){
    // //     return shipCount;
    // // }
    // // function getCitizens() public view returns (address[] memory) {
    // //     return citizens;
    // // }
    // function getNotifByShipper(address _shipper) public view returns (Notif[] memory) {
    //     Notif[] memory shipperNotifications = new Notif[](binCount);

    //     for (uint256 i = 0; i < binCount; i++) {
    //         string memory binId = binIds[i];
    //         if (isBin[binId]) {
    //             shipperNotifications[i] = notifications[_shipper][binId];
    //         }
    //     }

    //     return shipperNotifications;
    // }

    function createWaste(uint256 _weight, address _citizenId, string memory _binId) external {
        string memory _id =generateUniqueId();
       //require(getIsBin(_binId), "Bin doesn't exist");
        require(isBin[_binId], "Bin doesn't exist");
        require(isCitizen[_citizenId], "Citizen doesn't exist");
        //require(getIsCitizen(_citizenId), "Citizen doesn't exist");
        require(!isWaste[_id], "Watse exist");

        //setWaste(_id,  _weight, _citizenId, _binId);
        wastes[_id]=Waste(_id, "Waiting", _weight, _citizenId, address(0), address(0), _binId, "");
        wasteIds.push(_id);
        isWaste[_id]=true;
        wasteCount++;


        // emit WasteCreated(_id);
    }
}
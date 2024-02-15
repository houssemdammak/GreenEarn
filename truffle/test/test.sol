 // SPDX-License-Identifier: MIT
 pragma solidity ^0.8.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/WasteManagement.sol";

contract TestWasteManagement {
    WasteManagement wasteManagement;

    function beforeEach() public {
        wasteManagement = new WasteManagement();
    }

    function testOwner() public {
        address expectedOwner = address(this);
        Assert.equal(wasteManagement.owner(), expectedOwner, "Owner should be the test contract address");
    }

    function testCreateShipper() public {
        address shipperAddress = address(0x8c52092f81Ad04515B97d897B1eB2e6Bc3A0f0D6);
        wasteManagement.createShipper(shipperAddress);
        address[] memory shipperAddresses = wasteManagement.getShipperAddresses();
        Assert.equal(shipperAddresses[0], shipperAddress, "Shipper address should be added");
    }

    function testCreateCitizen() public {
        address citizenAddress = address(0xb9732EDD8E7eB19535cB2a79A4031c12f2dFF963);
        wasteManagement.createCitizen(citizenAddress);
        address[] memory citizenAddresses = wasteManagement.getCitizenAddresses();
        Assert.equal(citizenAddresses[0], citizenAddress, "Citizen address should be added");
    }

    function testCreateBin() public {
        uint256 id = 1;
        string memory location = "Location";
        string memory state = "State";
        uint256 capacity = 100;
        uint256 currentWeight = 50;
        wasteManagement.createBin(id, location, state, capacity, currentWeight);
        (uint256 binId, string memory binLocation, string memory binState, uint256 binCapacity, uint256 binCurrentWeight) = wasteManagement.getBinById(id);
        Assert.equal(binId, id, "Bin ID should match");
        Assert.equal(binLocation, location, "Bin location should match");
        Assert.equal(binState, state, "Bin state should match");
        Assert.equal(binCapacity, capacity, "Bin capacity should match");
        Assert.equal(binCurrentWeight, currentWeight, "Bin current weight should match");
    }

    function testModifyBin() public {
        uint256 id = 1;
        string memory newLocation = "New Location";
        string memory newState = "New State";
        uint256 newCapacity = 200;
        uint256 newCurrentWeight = 100;
        wasteManagement.modifyBin(id, newLocation, newState, newCapacity, newCurrentWeight);
        (, string memory binLocation, string memory binState, uint256 binCapacity, uint256 binCurrentWeight) = wasteManagement.getBinById(id);
        Assert.equal(binLocation, newLocation, "Bin location should be modified");
        Assert.equal(binState, newState, "Bin state should be modified");
        Assert.equal(binCapacity, newCapacity, "Bin capacity should be modified");
        Assert.equal(binCurrentWeight, newCurrentWeight, "Bin current weight should be modified");
    }

    function testDeleteBin() public {
    // Create a bin
    uint256 id = 1;
    string memory location = "Location";
    string memory state = "State";
    uint256 capacity = 100;
    uint256 currentWeight = 50;
    wasteManagement.createBin(id, location, state, capacity, currentWeight);

    // Check if bin exists before deletion
    (uint256 binIdBefore, , , , ) = wasteManagement.getBinById(id);
    Assert.notEqual(binIdBefore, 0, "Bin should exist before deletion");

    // Delete the bin
    wasteManagement.deleteBin(id);

    // Check if bin is deleted
    (uint256 binIdAfter, string memory binLocation, string memory binState, uint256 binCapacity, uint256 binCurrentWeight) = wasteManagement.getBinById(id);
    Assert.equal(binIdAfter, 0, "Bin should be deleted");
    Assert.equal(bytes(binLocation).length, 0, "Bin location should be empty");
    Assert.equal(bytes(binState).length, 0, "Bin state should be empty");
    Assert.equal(binCapacity, 0, "Bin capacity should be zero");
    Assert.equal(binCurrentWeight, 0, "Bin current weight should be zero");
}


    function testVerifyCitizenByAddress() public {
        address citizenAddress = address(0x456);
        wasteManagement.createCitizen(citizenAddress);
        bool isVerified = wasteManagement.verifyCitizenByAddress(citizenAddress);
        Assert.isTrue(isVerified, "Citizen should be verified");
    }

    function testVerifyShipperByAddress() public {
        address shipperAddress = address(0x123);
        wasteManagement.createShipper(shipperAddress);
        bool isVerified = wasteManagement.verifyShipperByAddress(shipperAddress);
        Assert.isTrue(isVerified, "Shipper should be verified");
    }
}

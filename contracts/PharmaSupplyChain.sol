// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PharmaSupplyChain {
    struct Drug {
        string name;
        uint256 batchNumber;
        address manufacturer;
        bool verified;
    }

    mapping(uint256 => Drug) public drugs;

    event DrugRegistered(uint256 batchNumber, string name, address indexed manufacturer);
    event DrugVerified(uint256 batchNumber, bool verified);

    // Function to register a new drug
    function registerDrug(uint256 _batchNumber, string memory _name) public {
        require(drugs[_batchNumber].manufacturer == address(0), "Batch number already registered");

        drugs[_batchNumber] = Drug({
            name: _name,
            batchNumber: _batchNumber,
            manufacturer: msg.sender,
            verified: false
        });

        emit DrugRegistered(_batchNumber, _name, msg.sender);
    }

    // Function to verify a drug
    function verifyDrug(uint256 _batchNumber) public {
        require(drugs[_batchNumber].manufacturer != address(0), "Drug not registered");

        drugs[_batchNumber].verified = true;

        emit DrugVerified(_batchNumber, true);
    }

    // Function to retrieve drug details
    function getDrug(uint256 _batchNumber) public view returns (string memory, address, bool) {
        require(drugs[_batchNumber].manufacturer != address(0), "Drug not registered");

        Drug memory d = drugs[_batchNumber];
        return (d.name, d.manufacturer, d.verified);
    }
}
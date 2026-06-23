// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

contract VerificationRegistry is Ownable {
    mapping(address => bool) public hasStd;
    mapping(address => bool) public hasDna;
    mapping(address => bool) private _verified;

    event StdSet(address indexed user, bool status);
    event DnaSet(address indexed user, bool status);

    error InvalidAddress();

    constructor(address initialOwner) Ownable(initialOwner) {}

    function setStd(address user, bool status) external onlyOwner {
        if (user == address(0)) revert InvalidAddress();
        hasStd[user] = status;
        _updateVerified(user);
        emit StdSet(user, status);
    }

    function setDna(address user, bool status) external onlyOwner {
        if (user == address(0)) revert InvalidAddress();
        hasDna[user] = status;
        _updateVerified(user);
        emit DnaSet(user, status);
    }

    function setBoth(address user, bool stdStatus, bool dnaStatus) external onlyOwner {
        if (user == address(0)) revert InvalidAddress();
        hasStd[user] = stdStatus;
        hasDna[user] = dnaStatus;
        _updateVerified(user);
        emit StdSet(user, stdStatus);
        emit DnaSet(user, dnaStatus);
    }

    function isVerified(address user) external view returns (bool) {
        return _verified[user];
    }

    function getStatus(address user) external view returns (bool std, bool dna, bool verified) {
        return (hasStd[user], hasDna[user], _verified[user]);
    }

    function _updateVerified(address user) private {
        _verified[user] = hasStd[user] && hasDna[user];
    }
}

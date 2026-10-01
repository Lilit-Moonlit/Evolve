// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @notice Interface for the DNAVerification contract so the registry can
///         query on-chain DNA verification status.
interface IDNAVerification {
    struct DNAProfile {
        bytes32 dnaHash;
        uint256 timestamp;
        bool verified;
        address verifier;
        bytes metadata;
    }

    function verifyDNA(address user, bytes32 dnaHash, bytes calldata metadata) external;
    function getDNAProfile(address user) external view returns (DNAProfile memory);
    function isDNAVerified(address user) external view returns (bool);
    function revokeDNA(address user) external;
}

contract VerificationRegistry is Ownable {
    mapping(address => bool) public hasStd;
    mapping(address => bool) public hasDna;
    mapping(address => bool) private _verified;

    IDNAVerification private _dnaVerification;

    event StdSet(address indexed user, bool status);
    event DnaSet(address indexed user, bool status);
    event DnaVerified(address indexed user);
    event DnaRevoked(address indexed user);
    event DNAVerificationContractSet(address indexed dnaVerification);

    error InvalidAddress();
    error NotConfigured();

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

    /// @notice Points the registry at the deployed DNAVerification contract.
    function setDNAVerification(address dnaVerification) external onlyOwner {
        if (dnaVerification == address(0)) revert InvalidAddress();
        _dnaVerification = IDNAVerification(dnaVerification);
        emit DNAVerificationContractSet(dnaVerification);
    }

    function getDNAVerification() external view returns (address) {
        return address(_dnaVerification);
    }

    /// @notice Directly sets DNA verification status (owner-only).
    function setDNAVerified(address user, bool status) external onlyOwner {
        if (user == address(0)) revert InvalidAddress();
        _applyDnaStatus(user, status);
    }

    /// @notice Mirrors the on-chain DNA verification status from the
    ///         configured DNAVerification contract. Callable by anyone since
    ///         it only reflects the source of truth.
    function syncDNAVerified(address user) external {
        if (address(_dnaVerification) == address(0)) revert NotConfigured();
        _applyDnaStatus(user, _dnaVerification.isDNAVerified(user));
    }

    function isVerified(address user) external view returns (bool) {
        return _verified[user];
    }

    function getStatus(address user) external view returns (bool std, bool dna, bool verified) {
        return (hasStd[user], hasDna[user], _verified[user]);
    }

    function _applyDnaStatus(address user, bool status) private {
        bool changed = hasDna[user] != status;
        hasDna[user] = status;
        _updateVerified(user);
        if (changed) {
            if (status) {
                emit DnaVerified(user);
            } else {
                emit DnaRevoked(user);
            }
        }
    }

    function _updateVerified(address user) private {
        _verified[user] = hasStd[user] && hasDna[user];
    }
}

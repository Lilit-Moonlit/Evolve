// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract DNAVerification is Ownable, Pausable, ReentrancyGuard {
    struct DNAProfile {
        bytes32 dnaHash;
        uint256 timestamp;
        bool verified;
        address verifier;
        bytes metadata;
    }

    mapping(address => DNAProfile) private _dnaProfiles;

    event DNAVerified(address indexed user, bytes32 dnaHash, address indexed verifier);
    event DNARevoked(address indexed user);
    event VerifierAdded(address indexed verifier);
    event VerifierRemoved(address indexed verifier);

    mapping(address => bool) private _verifiers;

    error NotVerifier();
    error NotVerified();

    constructor(address initialOwner) Ownable(initialOwner) {}

    /// @notice Pauses all verification (owner-only).
    function pause() external onlyOwner {
        _pause();
    }

    /// @notice Resumes verification (owner-only).
    function unpause() external onlyOwner {
        _unpause();
    }

    modifier onlyVerifier() {
        if (!_verifiers[msg.sender] && msg.sender != owner()) revert NotVerifier();
        _;
    }

    function addVerifier(address verifier) external onlyOwner {
        _verifiers[verifier] = true;
        emit VerifierAdded(verifier);
    }

    function removeVerifier(address verifier) external onlyOwner {
        _verifiers[verifier] = false;
        emit VerifierRemoved(verifier);
    }

    function verifyDNA(address user, bytes32 dnaHash, bytes calldata metadata)
        external
        onlyVerifier
        whenNotPaused
        nonReentrant
    {
        _dnaProfiles[user] = DNAProfile({
            dnaHash: dnaHash,
            timestamp: block.timestamp,
            verified: true,
            verifier: msg.sender,
            metadata: metadata
        });
        emit DNAVerified(user, dnaHash, msg.sender);
    }

    function getDNAProfile(address user) external view returns (DNAProfile memory) {
        return _dnaProfiles[user];
    }

    function isDNAVerified(address user) external view returns (bool) {
        return _dnaProfiles[user].verified;
    }

    function revokeDNA(address user) external onlyOwner {
        delete _dnaProfiles[user];
        emit DNARevoked(user);
    }
}
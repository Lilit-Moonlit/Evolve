// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title EvolveSmartAccount
 * @dev ERC-4337-compatible Smart Account for Evolve users.
 */
contract EvolveSmartAccount {
    address public owner;
    uint256 public nonce;
    address public paymaster;

    error OnlyOwner();
    error ExecutionFailed();
    error BatchLengthMismatch();
    error AlreadyInitialized();

    event Executed(address indexed target, uint256 value, bool success);
    event BatchExecuted(uint256 count);
    event PaymasterSet(address indexed paymaster);

    modifier onlyOwner() {
        if (msg.sender != owner) revert OnlyOwner();
        _;
    }

    /// @dev Called once by the factory during proxy creation
    function initialize(address _owner) external {
        if (owner != address(0)) revert AlreadyInitialized();
        owner = _owner;
    }

    /// @dev ERC-4337 validateUserOp
    function validateUserOp(
        bytes calldata,
        uint256,
        bytes calldata
    ) external returns (uint256 validationData) {
        if (msg.sender != owner) return 1;
        return 0;
    }

    function execute(
        address target,
        uint256 value,
        bytes calldata data
    ) external onlyOwner {
        nonce++;
        (bool success, ) = target.call{value: value}(data);
        emit Executed(target, value, success);
        if (!success) revert ExecutionFailed();
    }

    function executeBatch(
        address[] calldata targets,
        uint256[] calldata values,
        bytes[] calldata datas
    ) external onlyOwner {
        if (targets.length != values.length || targets.length != datas.length)
            revert BatchLengthMismatch();

        nonce++;
        for (uint256 i = 0; i < targets.length; i++) {
            (bool success, ) = targets[i].call{value: values[i]}(datas[i]);
            if (!success) revert ExecutionFailed();
        }
        emit BatchExecuted(targets.length);
    }

    function setPaymaster(address _paymaster) external onlyOwner {
        paymaster = _paymaster;
        emit PaymasterSet(_paymaster);
    }

    function getNonce() external view returns (uint256) {
        return nonce;
    }

    receive() external payable {}
}

/**
 * @title EvolveSmartAccountFactory
 * @dev Factory for creating Smart Accounts with deterministic addresses.
 */
contract EvolveSmartAccountFactory is Ownable {
    address public immutable accountImplementation;

    event SmartAccountCreated(address indexed account, address indexed owner);

    constructor(address _accountImplementation) Ownable(msg.sender) {
        accountImplementation = _accountImplementation;
    }

    function createAccount(
        address owner
    ) external returns (address account) {
        bytes32 salt = keccak256(abi.encodePacked(owner));
        bytes memory initData = abi.encodeCall(
            EvolveSmartAccount.initialize,
            (owner)
        );

        account = address(
            new ERC1967Proxy{salt: salt}(accountImplementation, initData)
        );
        emit SmartAccountCreated(account, owner);
    }

    function getAccountAddress(
        address owner
    ) external view returns (address) {
        bytes32 salt = keccak256(abi.encodePacked(owner));
        bytes memory initCode = abi.encodePacked(
            type(ERC1967Proxy).creationCode,
            abi.encode(
                accountImplementation,
                abi.encodeCall(EvolveSmartAccount.initialize, (owner))
            )
        );
        bytes32 hash = keccak256(
            abi.encodePacked(
                bytes1(0xff),
                address(this),
                salt,
                keccak256(initCode)
            )
        );
        return address(uint160(uint256(hash)));
    }
}

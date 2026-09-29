// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { OFT } from "@layerzerolabs/oft-evm/contracts/OFT.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { ERC20Burnable } from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";

contract EVOLVE is OFT, ERC20Burnable, AccessControl {
    uint256 public immutable MAX_SUPPLY;
    uint256 public totalMinted;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    uint256 public maxBridgePerTx;
    uint256 public bridgeWindowLimit;
    uint64 public bridgeWindowStart;
    uint256 public bridgeWindowUsed;
    uint256 public constant WINDOW_SIZE = 1 days;

    event MaxSupplySet(uint256 maxSupply);
    event BridgeLimitsSet(uint256 perTx, uint256 perWindow);

    error MaxSupplyExceeded();
    error BridgeLimitExceeded(uint256 amount, uint256 max);
    error WindowLimitExceeded(uint256 amount, uint256 remaining);

    constructor(
        address initialOwner,
        uint256 maxSupply,
        address lzEndpoint
    )
        OFT("EVOLVE", "EVOLVE", lzEndpoint, initialOwner)
        Ownable(initialOwner)
        AccessControl()
    {
        MAX_SUPPLY = maxSupply > 0 ? maxSupply : 8_000_000_000 * 10**18;
        _grantRole(DEFAULT_ADMIN_ROLE, initialOwner);
        _grantRole(MINTER_ROLE, initialOwner);
        emit MaxSupplySet(MAX_SUPPLY);
    }

    function setBridgeLimits(uint256 perTx, uint256 perWindow) external onlyRole(DEFAULT_ADMIN_ROLE) {
        maxBridgePerTx = perTx;
        bridgeWindowLimit = perWindow;
        emit BridgeLimitsSet(perTx, perWindow);
    }

    function _checkBridgeLimit(uint256 amount) internal {
        if (maxBridgePerTx > 0 && amount > maxBridgePerTx) revert BridgeLimitExceeded(amount, maxBridgePerTx);

        if (bridgeWindowLimit > 0) {
            if (block.timestamp >= bridgeWindowStart + WINDOW_SIZE) {
                bridgeWindowStart = uint64(block.timestamp);
                bridgeWindowUsed = 0;
            }
            if (bridgeWindowUsed + amount > bridgeWindowLimit) revert WindowLimitExceeded(amount, bridgeWindowLimit - bridgeWindowUsed);
            bridgeWindowUsed += amount;
        }
    }

    function _debit(
        address _from,
        uint256 _amountLD,
        uint256 _minAmountLD,
        uint32 _dstEid
    ) internal override returns (uint256 amountSentLD, uint256 amountReceivedLD) {
        _checkBridgeLimit(_amountLD);
        return super._debit(_from, _amountLD, _minAmountLD, _dstEid);
    }

    function _credit(
        address _to,
        uint256 _amountLD,
        uint32 _srcEid
    ) internal override returns (uint256 amountReceivedLD) {
        _checkBridgeLimit(_amountLD);
        return super._credit(_to, _amountLD, _srcEid);
    }

    function sharedDecimals() public view virtual override returns (uint8) {
        return 6;
    }

    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        if (totalMinted + amount > MAX_SUPPLY) revert MaxSupplyExceeded();
        totalMinted += amount;
        _mint(to, amount);
    }
}
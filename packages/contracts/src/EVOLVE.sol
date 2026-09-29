// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { OFT } from "@layerzerolabs/oft-evm/contracts/OFT.sol";
import { ERC20Burnable } from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";

contract EVOLVE is OFT, ERC20Burnable, AccessControl {
    uint256 public immutable MAX_SUPPLY;
    uint256 public totalMinted;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    event MaxSupplySet(uint256 maxSupply);

    error MaxSupplyExceeded();

    constructor(
        address initialOwner,
        uint256 maxSupply,
        address lzEndpoint
    )
        OFT("EVOLVE", "EVOLVE", lzEndpoint, address(0))
        AccessControl()
    {
        MAX_SUPPLY = maxSupply > 0 ? maxSupply : 8_000_000_000 * 10**18;
        _grantRole(DEFAULT_ADMIN_ROLE, initialOwner);
        _grantRole(MINTER_ROLE, initialOwner);
        emit MaxSupplySet(MAX_SUPPLY);
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
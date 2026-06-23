// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract EVOLVE is ERC20, ERC20Burnable, ERC20Pausable, AccessControl {
    uint256 public immutable MAX_SUPPLY;
    uint256 public totalMinted;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    event MaxSupplySet(uint256 maxSupply);

    error MaxSupplyExceeded();

    constructor(address initialOwner, uint256 maxSupply)
        ERC20("EVOLVE", "EVOLVE")
        AccessControl()
    {
        MAX_SUPPLY = maxSupply;
        _grantRole(DEFAULT_ADMIN_ROLE, initialOwner);
        _grantRole(MINTER_ROLE, initialOwner);
        emit MaxSupplySet(maxSupply);
    }

    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        if (totalMinted + amount > MAX_SUPPLY) revert MaxSupplyExceeded();
        totalMinted += amount;
        _mint(to, amount);
    }

    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Pausable)
    {
        super._update(from, to, value);
    }
}

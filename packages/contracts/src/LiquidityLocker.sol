// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LiquidityLocker is Ownable {
    using SafeERC20 for IERC20;

    uint64 public immutable unlockTime;

    event Locked(address indexed lpToken, address indexed locker, uint256 amount);
    event Withdrawn(address indexed lpToken, address indexed to, uint256 amount);

    error UnlockInPast();
    error StillLocked(uint64 unlockTime);

    constructor(address initialOwner, uint64 unlockTime_) Ownable(initialOwner) {
        if (unlockTime_ <= block.timestamp) revert UnlockInPast();
        unlockTime = unlockTime_;
    }

    function lock(address lpToken, uint256 amount) external {
        IERC20(lpToken).safeTransferFrom(msg.sender, address(this), amount);
        emit Locked(lpToken, msg.sender, amount);
    }

    function withdraw(address lpToken, address to) external onlyOwner {
        if (block.timestamp < unlockTime) revert StillLocked(unlockTime);
        uint256 balance = IERC20(lpToken).balanceOf(address(this));
        IERC20(lpToken).safeTransfer(to, balance);
        emit Withdrawn(lpToken, to, balance);
    }

    function lockedBalance(address lpToken) external view returns (uint256) {
        return IERC20(lpToken).balanceOf(address(this));
    }
}

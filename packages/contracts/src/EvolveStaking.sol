// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IVerificationRegistry {
    function isVerified(address user) external view returns (bool);
}

contract EvolveStaking is Ownable, ReentrancyGuard {
    IERC20 public immutable evolveToken;
    IVerificationRegistry public verification;

    uint256 public constant MIN_STAKE = 100 * 10**18;
    uint256 public constant MIN_DURATION = 30 days;

    struct StakeInfo {
        uint256 amount;
        uint256 unlockTime;
        bool exists;
    }

    mapping(address => StakeInfo) public stakes;
    mapping(address => bool) public lockedByBond;

    address public bondManager;

    event Staked(address indexed user, uint256 amount, uint256 unlockTime);
    event Unstaked(address indexed user, uint256 amount);
    event Extended(address indexed user, uint256 newUnlockTime);
    event Locked(address indexed user);
    event Unlocked(address indexed user);
    event StakeTransferred(address indexed from, address indexed to, uint256 amount);
    event BondManagerSet(address indexed manager);
    event VerificationSet(address indexed registry);

    error NotVerified();
    error BelowMinimum();
    error DurationTooShort();
    error NotUnlockedYet();
    error NoStake();
    error LockedByBond();
    error NotBondManager();
    error TransferFailed();

    modifier onlyBondManager() {
        if (msg.sender != bondManager) revert NotBondManager();
        _;
    }

    constructor(address _evolveToken, address registry, address initialOwner) Ownable(initialOwner) {
        evolveToken = IERC20(_evolveToken);
        verification = IVerificationRegistry(registry);
    }

    function setVerification(address registry) external onlyOwner {
        verification = IVerificationRegistry(registry);
        emit VerificationSet(registry);
    }

    function setBondManager(address manager) external onlyOwner {
        bondManager = manager;
        emit BondManagerSet(manager);
    }

    function stake(uint256 amount, uint256 duration) external nonReentrant {
        if (!verification.isVerified(msg.sender)) revert NotVerified();
        if (amount < MIN_STAKE) revert BelowMinimum();
        if (duration < MIN_DURATION) revert DurationTooShort();

        StakeInfo storage s = stakes[msg.sender];
        uint256 unlock = block.timestamp + duration;

        if (s.exists) {
            s.amount += amount;
            if (unlock > s.unlockTime) s.unlockTime = unlock;
        } else {
            stakes[msg.sender] = StakeInfo({ amount: amount, unlockTime: unlock, exists: true });
        }

        if (!evolveToken.transferFrom(msg.sender, address(this), amount)) revert TransferFailed();
        emit Staked(msg.sender, amount, unlock);
    }

    function extend(uint256 additionalDuration) external {
        StakeInfo storage s = stakes[msg.sender];
        if (!s.exists) revert NoStake();
        s.unlockTime += additionalDuration;
        emit Extended(msg.sender, s.unlockTime);
    }

    function unstake() external nonReentrant {
        StakeInfo storage s = stakes[msg.sender];
        if (!s.exists) revert NoStake();
        if (block.timestamp < s.unlockTime) revert NotUnlockedYet();
        if (lockedByBond[msg.sender]) revert LockedByBond();

        uint256 amount = s.amount;
        delete stakes[msg.sender];

        if (!evolveToken.transfer(msg.sender, amount)) revert TransferFailed();
        emit Unstaked(msg.sender, amount);
    }

    function lockStake(address user) external onlyBondManager {
        lockedByBond[user] = true;
        emit Locked(user);
    }

    function unlockStake(address user) external onlyBondManager {
        lockedByBond[user] = false;
        emit Unlocked(user);
    }

    function transferStake(address from, address to, uint256 amount) external onlyBondManager nonReentrant {
        StakeInfo storage s = stakes[from];
        if (!s.exists) revert NoStake();
        if (amount > s.amount) revert BelowMinimum();

        s.amount -= amount;
        if (s.amount == 0) {
            if (lockedByBond[from]) lockedByBond[from] = false;
            delete stakes[from];
        }

        if (!evolveToken.transfer(to, amount)) revert TransferFailed();
        emit StakeTransferred(from, to, amount);
    }

    function getStake(address user) external view returns (uint256 amount, uint256 unlockTime, bool isLocked, bool exists) {
        StakeInfo storage s = stakes[user];
        return (s.amount, s.unlockTime, lockedByBond[user], s.exists);
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract EvolveFund is Ownable, ReentrancyGuard {
    IERC20 public immutable evolveToken;

    uint256 public constant MIN_DEPOSIT = 15 * 10**18;
    uint256 public constant MIN_DURATION = 30 days;
    uint256 public constant MIN_EXTENSION = 7 days;

    // Deposit types: Conception (Зачаття) and PostCopulation (Посткопуляція)
    enum DepositType { Conception, PostCopulation }

    struct StakeInfo {
        uint256 amount;
        uint256 unlockTime;
        bool exists;
        DepositType depositType;
    }

    // Women can set different requirements for each deposit type
    struct WomanRequirements {
        uint256 conceptionRequired;    // Min EVOLVE needed for Conception
        uint256 postCopulationRequired; // Min EVOLVE needed for PostCopulation
        bool exists;
    }

    mapping(address => StakeInfo) public stakes;
    mapping(address => StakeInfo) public postCopulationStakes; // Separate stake for PostCopulation
    mapping(address => bool) public lockedByBond;

    // Women's requirements for each mode
    mapping(address => WomanRequirements) public womanRequirements;

    address public bondManager;

    event Deposited(address indexed user, uint256 amount, uint256 unlockTime, DepositType depositType);
    event Withdrawn(address indexed user, uint256 amount, DepositType depositType);
    event Extended(address indexed user, uint256 newUnlockTime, DepositType depositType);
    event Locked(address indexed user, DepositType depositType);
    event Unlocked(address indexed user, DepositType depositType);
    event StakeTransferred(address indexed from, address indexed to, uint256 amount, DepositType depositType);
    event BondManagerSet(address indexed manager);
    event WomanRequirementsSet(address indexed woman, uint256 conceptionRequired, uint256 postCopulationRequired);

    error BelowMinimum();
    error DurationTooShort();
    error NotUnlockedYet();
    error NoStake();
    error LockedByBond();
    error NotBondManager();
    error TransferFailed();
    error InsufficientStake();
    error InvalidDepositType();
    error InsufficientForRequirements();

    modifier onlyBondManager() {
        if (msg.sender != bondManager) revert NotBondManager();
        _;
    }

    constructor(address _evolveToken, address initialOwner) Ownable(initialOwner) {
        evolveToken = IERC20(_evolveToken);
    }

    function setBondManager(address manager) external onlyOwner {
        bondManager = manager;
        emit BondManagerSet(manager);
    }

    // Women set their requirements for each mode
    function setWomanRequirements(uint256 conceptionRequired, uint256 postCopulationRequired) external {
        womanRequirements[msg.sender] = WomanRequirements({
            conceptionRequired: conceptionRequired,
            postCopulationRequired: postCopulationRequired,
            exists: true
        });
        emit WomanRequirementsSet(msg.sender, conceptionRequired, postCopulationRequired);
    }

    function deposit(uint256 amount, uint256 duration, DepositType depositType) external nonReentrant {
        if (amount < MIN_DEPOSIT) revert BelowMinimum();
        if (duration < MIN_DURATION) revert DurationTooShort();

        StakeInfo storage s = depositType == DepositType.Conception ? stakes[msg.sender] : postCopulationStakes[msg.sender];
        uint256 unlock = block.timestamp + duration;

        if (s.exists) {
            s.amount += amount;
            if (unlock > s.unlockTime) s.unlockTime = unlock;
        } else {
            s.amount = amount;
            s.unlockTime = unlock;
            s.exists = true;
            s.depositType = depositType;
        }

        if (!evolveToken.transferFrom(msg.sender, address(this), amount)) revert TransferFailed();
        emit Deposited(msg.sender, amount, unlock, depositType);
    }

    function extend(uint256 additionalDuration, DepositType depositType) external {
        StakeInfo storage s = depositType == DepositType.Conception ? stakes[msg.sender] : postCopulationStakes[msg.sender];
        if (!s.exists) revert NoStake();
        if (additionalDuration < MIN_EXTENSION) revert InsufficientStake();
        s.unlockTime += additionalDuration;
        emit Extended(msg.sender, s.unlockTime, depositType);
    }

    function withdraw(DepositType depositType) external nonReentrant {
        StakeInfo storage s = depositType == DepositType.Conception ? stakes[msg.sender] : postCopulationStakes[msg.sender];
        if (!s.exists) revert NoStake();
        if (block.timestamp < s.unlockTime) revert NotUnlockedYet();
        if (lockedByBond[msg.sender]) revert LockedByBond();

        uint256 amount = s.amount;
        if (depositType == DepositType.Conception) {
            delete stakes[msg.sender];
        } else {
            delete postCopulationStakes[msg.sender];
        }

        if (!evolveToken.transfer(msg.sender, amount)) revert TransferFailed();
        emit Withdrawn(msg.sender, amount, depositType);
    }

    function lockStake(address user, DepositType depositType) external onlyBondManager {
        lockedByBond[user] = true;
        emit Locked(user, depositType);
    }

    function unlockStake(address user, DepositType depositType) external onlyBondManager {
        lockedByBond[user] = false;
        emit Unlocked(user, depositType);
    }

    function bondWithdraw(address user, uint256 amount, address to, DepositType depositType) external onlyBondManager nonReentrant {
        StakeInfo storage s = depositType == DepositType.Conception ? stakes[user] : postCopulationStakes[user];
        if (!s.exists) revert NoStake();
        if (amount > s.amount) revert InsufficientStake();

        s.amount -= amount;
        if (s.amount == 0) {
            if (lockedByBond[user]) lockedByBond[user] = false;
            if (depositType == DepositType.Conception) {
                delete stakes[user];
            } else {
                delete postCopulationStakes[user];
            }
        }

        if (!evolveToken.transfer(to, amount)) revert TransferFailed();
    }

    function transferStake(address from, address to, uint256 amount, DepositType depositType) external onlyBondManager nonReentrant {
        StakeInfo storage s = depositType == DepositType.Conception ? stakes[from] : postCopulationStakes[from];
        if (!s.exists) revert NoStake();
        if (amount > s.amount) revert InsufficientStake();

        s.amount -= amount;
        if (s.amount == 0) {
            if (lockedByBond[from]) lockedByBond[from] = false;
            if (depositType == DepositType.Conception) {
                delete stakes[from];
            } else {
                delete postCopulationStakes[from];
            }
        }

        if (!evolveToken.transfer(to, amount)) revert TransferFailed();
        emit StakeTransferred(from, to, amount, depositType);
    }

    function getStake(address user) external view returns (uint256 amount, uint256 unlockTime, bool isLocked, bool exists) {
        StakeInfo storage s = stakes[user];
        return (s.amount, s.unlockTime, lockedByBond[user], s.exists);
    }

    function getPostCopulationStake(address user) external view returns (uint256 amount, uint256 unlockTime, bool isLocked, bool exists) {
        StakeInfo storage s = postCopulationStakes[user];
        return (s.amount, s.unlockTime, lockedByBond[user], s.exists);
    }

    // Check if a man can view a woman's profile based on his stake and her requirements
    function canManViewProfile(address man, address woman, DepositType depositType) external view returns (bool) {
        WomanRequirements storage req = womanRequirements[woman];
        if (!req.exists) return true; // No requirements set, anyone can view

        uint256 requiredAmount = depositType == DepositType.Conception ? req.conceptionRequired : req.postCopulationRequired;
        if (requiredAmount == 0) return true; // No requirement for this type

        StakeInfo storage s = depositType == DepositType.Conception ? stakes[man] : postCopulationStakes[man];
        if (!s.exists) return false;

        return s.amount >= requiredAmount;
    }

    // Get total stake across both types for governance
    function getTotalStake(address user) external view returns (uint256 totalAmount) {
        totalAmount = 0;
        if (stakes[user].exists) totalAmount += stakes[user].amount;
        if (postCopulationStakes[user].exists) totalAmount += postCopulationStakes[user].amount;
    }
}

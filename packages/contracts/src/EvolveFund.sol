// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IEvolve2EarnGift {
    function giftToBatch(address to, uint256 count) external;
}

contract EvolveFund is Ownable, ReentrancyGuard {
    IERC20 public immutable evolveToken;

    uint256 public constant MIN_DEPOSIT = 15 * 10**18;
    uint256 public constant MIN_DURATION = 30 days;
    uint256 public constant MIN_EXTENSION = 7 days;

    // Birth roses: 1 EVOLVE = 1 rose (matches Evolve2Earn.EMOJI_GIFT_PRICE)
    uint256 public constant ROSE_PRICE = 1 * 10**18;

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

    // Birth-rose escrow: EVOLVE held 1:1 (ROSE_PRICE per rose) for the roses
    // a man adds at deposit time. Escrowed roses are gifted to the mother
    // ONLY when paternity is confirmed (BondManager triggers it together
    // with the stake payout); otherwise the man can reclaim the EVOLVE via
    // withdrawRoseEscrow() once his stake is not locked by a bond.
    mapping(address => uint256) public roseEscrow;

    address public bondManager;
    address public evolve2Earn;

    event Deposited(address indexed user, uint256 amount, uint256 unlockTime, DepositType depositType);
    event Withdrawn(address indexed user, uint256 amount, DepositType depositType);
    event Extended(address indexed user, uint256 newUnlockTime, DepositType depositType);
    event Locked(address indexed user, DepositType depositType);
    event Unlocked(address indexed user, DepositType depositType);
    event StakeTransferred(address indexed from, address indexed to, uint256 amount, DepositType depositType);
    event BondManagerSet(address indexed manager);
    event WomanRequirementsSet(address indexed woman, uint256 conceptionRequired, uint256 postCopulationRequired);
    event Evolve2EarnSet(address indexed giftContract);
    event RoseEscrowAdded(address indexed user, uint256 count, uint256 newEscrowTotal);
    event RoseEscrowGifted(address indexed from, address indexed to, uint256 count);
    event RoseEscrowWithdrawn(address indexed user, uint256 count);

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
    error NoRosesEscrowed();
    error InsufficientRoses();
    error Evolve2EarnNotSet();

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

    function setEvolve2Earn(address giftContract) external onlyOwner {
        evolve2Earn = giftContract;
        emit Evolve2EarnSet(giftContract);
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

        uint256 unlock = _stake(amount, duration, depositType);

        if (!evolveToken.transferFrom(msg.sender, address(this), amount)) revert TransferFailed();
        emit Deposited(msg.sender, amount, unlock, depositType);
    }

    /// @notice Deposit + birth-rose escrow in one call: `amount` is staked
    ///         exactly like deposit(), and additionally `roseCount` EVOLVE
    ///         (ROSE_PRICE per rose) is escrowed for the birth-rose gift.
    ///         The escrowed roses are gifted to the mother ONLY when
    ///         paternity is confirmed (BondManager); if paternity is never
    ///         confirmed, the man reclaims the EVOLVE via withdrawRoseEscrow().
    function depositWithRoses(uint256 amount, uint256 duration, DepositType depositType, uint256 roseCount) external nonReentrant {
        if (amount < MIN_DEPOSIT) revert BelowMinimum();
        if (duration < MIN_DURATION) revert DurationTooShort();

        uint256 unlock = _stake(amount, duration, depositType);

        uint256 totalPull = amount;
        if (roseCount > 0) {
            roseEscrow[msg.sender] += roseCount;
            totalPull += roseCount * ROSE_PRICE;
            emit RoseEscrowAdded(msg.sender, roseCount, roseEscrow[msg.sender]);
        }

        if (!evolveToken.transferFrom(msg.sender, address(this), totalPull)) revert TransferFailed();
        emit Deposited(msg.sender, amount, unlock, depositType);
    }

    function _stake(uint256 amount, uint256 duration, DepositType depositType) private returns (uint256 unlock) {
        StakeInfo storage s = depositType == DepositType.Conception ? stakes[msg.sender] : postCopulationStakes[msg.sender];
        unlock = block.timestamp + duration;

        if (s.exists) {
            s.amount += amount;
            if (unlock > s.unlockTime) s.unlockTime = unlock;
        } else {
            s.amount = amount;
            s.unlockTime = unlock;
            s.exists = true;
            s.depositType = depositType;
        }
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

    /// @notice BondManager-only: gift `count` of `from`'s escrowed birth
    ///         roses to the mother — executed at the moment paternity is
    ///         confirmed, together with the stake payout. The escrowed
    ///         EVOLVE is spent through the Evolve2Earn gift economy, so the
    ///         1 EVOLVE per rose is distributed proportionally among the
    ///         existing rose owners (perpetual revenue split) and the mother
    ///         becomes the owner of `count` roses.
    function giftEscrowedRoses(address from, address to, uint256 count) external onlyBondManager nonReentrant {
        if (evolve2Earn == address(0)) revert Evolve2EarnNotSet();
        if (count == 0 || count > roseEscrow[from]) revert InsufficientRoses();

        roseEscrow[from] -= count;
        uint256 amount = count * ROSE_PRICE;

        if (!evolveToken.approve(evolve2Earn, amount)) revert TransferFailed();
        IEvolve2EarnGift(evolve2Earn).giftToBatch(to, count);
        if (!evolveToken.approve(evolve2Earn, 0)) revert TransferFailed();

        emit RoseEscrowGifted(from, to, count);
    }

    /// @notice Reclaim the birth-rose escrow when paternity was NOT
    ///         confirmed. Available only while the caller's stake is not
    ///         locked by an active bond/session.
    function withdrawRoseEscrow() external nonReentrant {
        uint256 count = roseEscrow[msg.sender];
        if (count == 0) revert NoRosesEscrowed();
        if (lockedByBond[msg.sender]) revert LockedByBond();

        roseEscrow[msg.sender] = 0;
        uint256 amount = count * ROSE_PRICE;
        if (!evolveToken.transfer(msg.sender, amount)) revert TransferFailed();
        emit RoseEscrowWithdrawn(msg.sender, count);
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

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";

import "./EVOLVE.sol";

/**
 * @title RewardMinter
 * @notice Narrowly rate-limited mint entry points the backend server key may
 * call without a timelock proposal. Holds MINTER_ROLE on EVOLVE (granted via
 * a 48h TimelockController proposal in production; directly in tests).
 *
 * Two FIXED-amount functions with SEPARATE daily limits:
 *  - mintReward(to): exactly REWARD_AMOUNT (1 EVOLVE), reward limit/day
 *  - mintFaucet(to): exactly FAUCET_AMOUNT (50 EVOLVE), faucet limit/day
 *
 * There is deliberately NO arbitrary-amount mint on this contract.
 *
 * DEFAULT_ADMIN_ROLE belongs to the TimelockController, so rotating the
 * whitelisted backend key (setMinter) always requires a 48h proposal.
 */
contract RewardMinter is AccessControl {
    // Fixed mint amounts (wei).
    uint256 public constant REWARD_AMOUNT = 1e18; // 1 EVOLVE
    uint256 public constant FAUCET_AMOUNT = 50e18; // 50 EVOLVE

    // Documented production daily limits. They are immutable constructor
    // parameters (tests deploy with small values); ignition passes these
    // defaults explicitly.
    uint256 public constant DEFAULT_REWARD_DAILY_LIMIT = 10_000;
    uint256 public constant DEFAULT_FAUCET_DAILY_LIMIT = 1_000;

    EVOLVE public immutable evolveToken;
    uint256 public immutable rewardDailyLimit;
    uint256 public immutable faucetDailyLimit;

    /// @notice The single whitelisted backend server key allowed to mint.
    address public minter;

    // Lazy-reset daily counters: slot keeps the last window that wrote it;
    // a read/write in a newer window treats the count as zero.
    uint256 private _rewardWindow;
    uint256 private _rewardCount;
    uint256 private _faucetWindow;
    uint256 private _faucetCount;

    error DailyLimitExceeded();
    error NotWhitelisted(address account);

    event MinterRotated(address indexed previousMinter, address indexed newMinter);
    event RewardMinted(address indexed to, uint256 indexed window);
    event FaucetMinted(address indexed to, uint256 indexed window);

    modifier onlyMinter() {
        if (msg.sender != minter) revert NotWhitelisted(msg.sender);
        _;
    }

    /**
     * @param token_ EVOLVE token this minter holds MINTER_ROLE on.
     * @param admin TimelockController — receives DEFAULT_ADMIN_ROLE.
     * @param initialMinter Backend server key whitelisted for mint calls.
     * @param rewardLimit_ Max mintReward calls per 24h window (prod: 10_000).
     * @param faucetLimit_ Max mintFaucet calls per 24h window (prod: 1_000).
     */
    constructor(
        address token_,
        address admin,
        address initialMinter,
        uint256 rewardLimit_,
        uint256 faucetLimit_
    ) {
        evolveToken = EVOLVE(token_);
        rewardDailyLimit = rewardLimit_;
        faucetDailyLimit = faucetLimit_;
        minter = initialMinter;
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
    }

    /// @notice Mints exactly 1 EVOLVE. Counts against the reward limit only.
    function mintReward(address to) external onlyMinter {
        uint256 window = currentWindow();
        if (window != _rewardWindow) {
            _rewardWindow = window;
            _rewardCount = 0;
        }
        if (_rewardCount >= rewardDailyLimit) revert DailyLimitExceeded();
        _rewardCount += 1;
        evolveToken.mint(to, REWARD_AMOUNT);
        emit RewardMinted(to, window);
    }

    /// @notice Mints exactly 50 EVOLVE. Counts against the faucet limit only.
    function mintFaucet(address to) external onlyMinter {
        uint256 window = currentWindow();
        if (window != _faucetWindow) {
            _faucetWindow = window;
            _faucetCount = 0;
        }
        if (_faucetCount >= faucetDailyLimit) revert DailyLimitExceeded();
        _faucetCount += 1;
        evolveToken.mint(to, FAUCET_AMOUNT);
        emit FaucetMinted(to, window);
    }

    /// @notice Timelock-only rotation of the whitelisted backend key.
    function setMinter(address newMinter) external onlyRole(DEFAULT_ADMIN_ROLE) {
        emit MinterRotated(minter, newMinter);
        minter = newMinter;
    }

    /// @notice Current daily window index (block.timestamp / 1 days).
    function currentWindow() public view returns (uint256) {
        return block.timestamp / 1 days;
    }

    /// @notice mintReward calls made in the current daily window (0 in a new one).
    function rewardMintedToday() external view returns (uint256) {
        return currentWindow() == _rewardWindow ? _rewardCount : 0;
    }

    /// @notice mintFaucet calls made in the current daily window (0 in a new one).
    function faucetMintedToday() external view returns (uint256) {
        return currentWindow() == _faucetWindow ? _faucetCount : 0;
    }
}

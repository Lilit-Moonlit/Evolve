// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./EVOLVE.sol";

contract Evolve2Earn is Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for EVOLVE;

    EVOLVE public immutable evolveToken;

    uint256 public constant VERIFICATION_REWARD = 100e18;
    uint256 public constant MATCH_REWARD = 50e18;
    uint256 public constant DAILY_ACTIVE_REWARD = 10e18;
    uint256 public constant EMOJI_GIFT_PRICE = 1e18;

    mapping(address => uint256) public lastActiveDay;
    mapping(address => bool) public verified;

    uint256 public totalDistributed;

    mapping(bytes32 => address) public emojiOwner;
    mapping(address => uint256) public ownerGiftCount;
    address[] public giftOwners;
    mapping(address => bool) private isGiftOwner;
    uint256 public totalGifts;

    event RewardDistributed(address indexed user, string rewardType, uint256 amount);
    event UserVerified(address indexed user);
    event DailyRewardClaimed(address indexed user, uint256 day);
    event EmergencyWithdrawal(address indexed to, uint256 amount);
    event EmojiGiftBought(bytes32 indexed emojiId, address indexed owner, uint256 price);
    event EmojiGiftTransferred(bytes32 indexed emojiId, address indexed from, address indexed to);
    event EmojiRevenueDistributed(address indexed buyer, uint256 totalAmount, address[] recipients, uint256[] amounts);

    error AlreadyVerified();
    error NotVerified();
    error DailyRewardAlreadyClaimed();
    error InsufficientBalance();
    error EmojiAlreadyOwned();
    error EmojiNotFound();
    error NotEmojiOwner();
    error ZeroAddress();
    error TransferToSelf();

    constructor(address initialOwner, address _evolveTokenAddress) Ownable(initialOwner) {
        evolveToken = EVOLVE(_evolveTokenAddress);
    }

    function verifyUser(address user) external onlyOwner nonReentrant whenNotPaused {
        if (verified[user]) revert AlreadyVerified();

        verified[user] = true;
        _distributeReward(user, VERIFICATION_REWARD, "verification");

        emit UserVerified(user);
    }

    function rewardMatch(address user1, address user2) external onlyOwner nonReentrant whenNotPaused {
        if (!verified[user1] || !verified[user2]) revert NotVerified();

        _distributeReward(user1, MATCH_REWARD, "match");
        _distributeReward(user2, MATCH_REWARD, "match");
    }

    function claimDailyReward(address user) external onlyOwner nonReentrant whenNotPaused {
        if (!verified[user]) revert NotVerified();

        uint256 today = block.timestamp / 1 days;
        if (lastActiveDay[user] == today) revert DailyRewardAlreadyClaimed();

        lastActiveDay[user] = today;
        _distributeReward(user, DAILY_ACTIVE_REWARD, "daily_active");

        emit DailyRewardClaimed(user, today);
    }

    function buyEmojiGift(bytes32 emojiId) external nonReentrant whenNotPaused {
        if (emojiOwner[emojiId] != address(0)) revert EmojiAlreadyOwned();

        evolveToken.safeTransferFrom(msg.sender, address(this), EMOJI_GIFT_PRICE);

        address[] memory recipients;
        uint256[] memory amounts;
        uint256 currentTotal = totalGifts;
        if (currentTotal > 0) {
            (recipients, amounts) = _distributeEmojiRevenue(currentTotal);
        }

        emojiOwner[emojiId] = msg.sender;
        ownerGiftCount[msg.sender] += 1;
        if (!isGiftOwner[msg.sender]) {
            isGiftOwner[msg.sender] = true;
            giftOwners.push(msg.sender);
        }
        totalGifts += 1;

        emit EmojiGiftBought(emojiId, msg.sender, EMOJI_GIFT_PRICE);
        if (recipients.length > 0) {
            emit EmojiRevenueDistributed(msg.sender, EMOJI_GIFT_PRICE, recipients, amounts);
        }
    }

    function transferEmojiGift(bytes32 emojiId, address to) external nonReentrant whenNotPaused {
        address from = emojiOwner[emojiId];
        if (from == address(0)) revert EmojiNotFound();
        if (from != msg.sender) revert NotEmojiOwner();
        if (to == address(0)) revert ZeroAddress();
        if (to == from) revert TransferToSelf();

        emojiOwner[emojiId] = to;
        ownerGiftCount[from] -= 1;
        ownerGiftCount[to] += 1;
        if (!isGiftOwner[to]) {
            isGiftOwner[to] = true;
            giftOwners.push(to);
        }

        emit EmojiGiftTransferred(emojiId, from, to);
    }

    function getGiftOwners() external view returns (address[] memory) {
        return giftOwners;
    }

    function getOwnerMarketShare(address owner) external view returns (uint256) {
        if (totalGifts == 0) return 0;
        return (ownerGiftCount[owner] * 1e18) / totalGifts;
    }

    function previewDistribution(address exclude) external view returns (address[] memory recipients, uint256[] memory amounts) {
        uint256 currentTotal = totalGifts;
        if (currentTotal == 0) {
            return (new address[](0), new uint256[](0));
        }

        uint256 activeOwnerCount = 0;
        for (uint256 i = 0; i < giftOwners.length; i++) {
            if (ownerGiftCount[giftOwners[i]] > 0 && giftOwners[i] != exclude) {
                activeOwnerCount++;
            }
        }

        recipients = new address[](activeOwnerCount);
        amounts = new uint256[](activeOwnerCount);
        uint256 idx = 0;
        for (uint256 i = 0; i < giftOwners.length; i++) {
            address owner = giftOwners[i];
            if (owner == exclude) continue;
            uint256 count = ownerGiftCount[owner];
            if (count > 0) {
                recipients[idx] = owner;
                amounts[idx] = (count * EMOJI_GIFT_PRICE) / currentTotal;
                idx++;
            }
        }
    }

    function emergencyWithdraw(address to) external onlyOwner {
        uint256 balance = evolveToken.balanceOf(address(this));
        evolveToken.safeTransfer(to, balance);
        emit EmergencyWithdrawal(to, balance);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function _distributeReward(address user, uint256 amount, string memory rewardType) internal {
        if (evolveToken.balanceOf(address(this)) < amount) revert InsufficientBalance();

        evolveToken.safeTransfer(user, amount);
        totalDistributed += amount;

        emit RewardDistributed(user, rewardType, amount);
    }

    function _distributeEmojiRevenue(uint256 currentTotal) internal returns (address[] memory recipients, uint256[] memory amounts) {
        uint256 activeOwnerCount = 0;
        for (uint256 i = 0; i < giftOwners.length; i++) {
            if (ownerGiftCount[giftOwners[i]] > 0 && giftOwners[i] != msg.sender) {
                activeOwnerCount++;
            }
        }

        recipients = new address[](activeOwnerCount);
        amounts = new uint256[](activeOwnerCount);
        uint256 distributed = 0;
        uint256 idx = 0;

        for (uint256 i = 0; i < giftOwners.length; i++) {
            address owner = giftOwners[i];
            if (owner == msg.sender) continue;
            uint256 count = ownerGiftCount[owner];
            if (count > 0) {
                uint256 share = (count * EMOJI_GIFT_PRICE) / currentTotal;
                recipients[idx] = owner;
                amounts[idx] = share;
                idx++;
                if (share > 0 && evolveToken.balanceOf(address(this)) >= share) {
                    evolveToken.safeTransfer(owner, share);
                    distributed += share;
                }
            }
        }

        if (distributed > 0 && distributed < EMOJI_GIFT_PRICE && evolveToken.balanceOf(address(this)) > 0) {
            uint256 dust = EMOJI_GIFT_PRICE - distributed;
            uint256 contractBalance = evolveToken.balanceOf(address(this));
            if (dust > contractBalance) dust = contractBalance;
            if (dust > 0) {
                evolveToken.safeTransfer(msg.sender, dust);
            }
        }
    }

    function getBalance() external view returns (uint256) {
        return evolveToken.balanceOf(address(this));
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./EVOLVE.sol";

contract Evolve2Earn is Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for EVOLVE;

    EVOLVE public immutable evolveToken;

    uint256 public constant EMOJI_GIFT_PRICE = 1e18;
    uint256 public constant MAX_GIFT_OWNERS = 1000;

    mapping(address => bool) public verified;

    mapping(bytes32 => address) public emojiOwner;
    mapping(address => uint256) public ownerGiftCount;
    address[] public giftOwners;
    mapping(address => bool) private isGiftOwner;
    uint256 public totalGifts;

    // ──────────────────────────────────────────────
    //  P2P TOKEN MARKETPLACE
    // ──────────────────────────────────────────────

    enum OrderStatus { Active, Filled, Cancelled }

    struct TokenOrder {
        uint256 id;
        address seller;
        uint256 evolveAmount;      // Amount of EVOLVE tokens offered
        address tokenAddress;      // Token to receive (ETH = address(0))
        uint256 tokenAmount;       // Amount of token requested
        uint256 networkId;         // Network ID (1=ETH, 56=BNB, 137=POLYGON, etc.)
        OrderStatus status;
        uint256 createdAt;
        string metadata;           // Optional metadata (IPFS hash, etc.)
    }

    mapping(uint256 => TokenOrder) public orders;
    mapping(address => uint256[]) public userOrders;
    uint256 private _nextOrderId;

    // Supported networks
    mapping(uint256 => bool) public supportedNetworks;
    uint256[] public networkIds;

    event UserVerified(address indexed user);
    event EmojiGiftBought(bytes32 indexed emojiId, address indexed owner, uint256 price);
    event EmojiGiftTransferred(bytes32 indexed emojiId, address indexed from, address indexed to);
    event EmojiRevenueDistributed(address indexed buyer, uint256 totalAmount, address[] recipients, uint256[] amounts);
    event OrderCreated(uint256 indexed orderId, address indexed seller, uint256 evolveAmount, address tokenAddress, uint256 tokenAmount, uint256 networkId);
    event OrderFilled(uint256 indexed orderId, address indexed buyer, uint256 evolveAmount, uint256 tokenAmount);
    event OrderCancelled(uint256 indexed orderId);
    event NetworkAdded(uint256 indexed networkId);
    event NetworkRemoved(uint256 indexed networkId);

    error AlreadyVerified();
    error EmojiAlreadyOwned();
    error EmojiNotFound();
    error NotEmojiOwner();
    error ZeroAddress();
    error TransferToSelf();
    error MaxGiftOwnersReached();
    error InvalidNetwork();
    error NetworkNotSupported();
    error OrderNotActive();
    error NotOrderSeller();
    error InsufficientBalance();
    error InvalidAmount();
    error CannotBuyOwnOrder();
    error NotBondManager();

    address public bondManager;

    constructor(address initialOwner, address _evolveTokenAddress) Ownable(initialOwner) {
        evolveToken = EVOLVE(_evolveTokenAddress);
        // Initialize default supported networks
        _addDefaultNetworks();
    }

    function setBondManager(address _bondManager) external onlyOwner {
        bondManager = _bondManager;
    }

    /// @notice Owner-only helper to migrate the EVOLVE balance held by this
    ///         (old) contract to a freshly deployed replacement.
    function transferToNewPool(address newPool, uint256 amount) external onlyOwner nonReentrant {
        if (newPool == address(0)) revert ZeroAddress();
        uint256 balance = evolveToken.balanceOf(address(this));
        if (amount > balance) revert InsufficientBalance();
        evolveToken.safeTransfer(newPool, amount);
    }

    /// @notice Owner-only helper for migration FROM an old contract instance that
    ///         predates `transferToNewPool` (it holds a pre-approved EVOLVE allowance
    ///         for this contract). Pulls `amount` from `oldPool` on behalf of owner.
    function migrateFromOldPool(address oldPool, uint256 amount) external onlyOwner nonReentrant {
        if (oldPool == address(0)) revert ZeroAddress();
        evolveToken.safeTransferFrom(oldPool, address(this), amount);
    }

    function _addDefaultNetworks() private {
        // Ethereum Mainnet
        supportedNetworks[1] = true;
        networkIds.push(1);
        // BNB Chain
        supportedNetworks[56] = true;
        networkIds.push(56);
        // Polygon
        supportedNetworks[137] = true;
        networkIds.push(137);
        // Arbitrum
        supportedNetworks[42161] = true;
        networkIds.push(42161);
        // Avalanche
        supportedNetworks[43114] = true;
        networkIds.push(43114);
        // Optimism
        supportedNetworks[10] = true;
        networkIds.push(10);
        // Tron (mapped to EVM compatible)
        supportedNetworks[19] = true;
        networkIds.push(19);
        // Solana (mapped to EVM compatible)
        supportedNetworks[900000] = true;
        networkIds.push(900000);
    }

    function verifyUser(address user) external onlyOwner nonReentrant whenNotPaused {
        if (verified[user]) revert AlreadyVerified();
        verified[user] = true;
        emit UserVerified(user);
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
        if (!isGiftOwner[msg.sender] && giftOwners.length >= MAX_GIFT_OWNERS) revert MaxGiftOwnersReached();
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

        if (ownerGiftCount[from] == 0 && isGiftOwner[from]) {
            isGiftOwner[from] = false;
            for (uint256 i = 0; i < giftOwners.length; i++) {
                if (giftOwners[i] == from) {
                    giftOwners[i] = giftOwners[giftOwners.length - 1];
                    giftOwners.pop();
                    break;
                }
            }
        }

        if (!isGiftOwner[to] && giftOwners.length >= MAX_GIFT_OWNERS) revert MaxGiftOwnersReached();
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

    // ──────────────────────────────────────────────
    //  P2P MARKETPLACE FUNCTIONS
    // ──────────────────────────────────────────────

    function createOrder(
        uint256 evolveAmount,
        address tokenAddress,
        uint256 tokenAmount,
        uint256 networkId,
        string calldata metadata
    ) external nonReentrant whenNotPaused returns (uint256) {
        if (evolveAmount == 0 || tokenAmount == 0) revert InvalidAmount();
        if (!supportedNetworks[networkId]) revert NetworkNotSupported();

        uint256 balance = evolveToken.balanceOf(msg.sender);
        if (balance < evolveAmount) revert InsufficientBalance();

        // Transfer EVOLVE to contract as escrow
        evolveToken.safeTransferFrom(msg.sender, address(this), evolveAmount);

        uint256 orderId = _nextOrderId++;
        orders[orderId] = TokenOrder({
            id: orderId,
            seller: msg.sender,
            evolveAmount: evolveAmount,
            tokenAddress: tokenAddress,
            tokenAmount: tokenAmount,
            networkId: networkId,
            status: OrderStatus.Active,
            createdAt: block.timestamp,
            metadata: metadata
        });

        userOrders[msg.sender].push(orderId);
        emit OrderCreated(orderId, msg.sender, evolveAmount, tokenAddress, tokenAmount, networkId);
        return orderId;
    }

    function fillOrder(uint256 orderId) external payable nonReentrant whenNotPaused {
        TokenOrder storage order = orders[orderId];
        if (order.status != OrderStatus.Active) revert OrderNotActive();
        if (order.seller == msg.sender) revert CannotBuyOwnOrder();

        // Transfer EVOLVE from contract to buyer
        evolveToken.safeTransfer(msg.sender, order.evolveAmount);

        // Transfer payment to seller
        if (order.tokenAddress == address(0)) {
            // Native ETH payment
            if (msg.value < order.tokenAmount) revert InsufficientBalance();
            (bool success, ) = order.seller.call{value: order.tokenAmount}("");
            require(success, "ETH transfer failed");
        } else {
            // ERC20 token payment - buyer must approve this contract first
            IERC20 token = IERC20(order.tokenAddress);
            uint256 balance = token.balanceOf(msg.sender);
            if (balance < order.tokenAmount) revert InsufficientBalance();
            token.transferFrom(msg.sender, order.seller, order.tokenAmount);
        }

        order.status = OrderStatus.Filled;
        emit OrderFilled(orderId, msg.sender, order.evolveAmount, order.tokenAmount);
    }

    function cancelOrder(uint256 orderId) external nonReentrant whenNotPaused {
        TokenOrder storage order = orders[orderId];
        if (order.status != OrderStatus.Active) revert OrderNotActive();
        if (order.seller != msg.sender) revert NotOrderSeller();

        // Return EVOLVE to seller
        evolveToken.safeTransfer(msg.sender, order.evolveAmount);
        order.status = OrderStatus.Cancelled;
        emit OrderCancelled(orderId);
    }

    function addNetwork(uint256 networkId) external onlyOwner {
        if (!supportedNetworks[networkId]) {
            supportedNetworks[networkId] = true;
            networkIds.push(networkId);
            emit NetworkAdded(networkId);
        }
    }

    function removeNetwork(uint256 networkId) external onlyOwner {
        if (supportedNetworks[networkId]) {
            supportedNetworks[networkId] = false;
            // Remove from array
            for (uint256 i = 0; i < networkIds.length; i++) {
                if (networkIds[i] == networkId) {
                    networkIds[i] = networkIds[networkIds.length - 1];
                    networkIds.pop();
                    break;
                }
            }
            emit NetworkRemoved(networkId);
        }
    }

    function getOrdersBySeller(address seller) external view returns (uint256[] memory) {
        return userOrders[seller];
    }

    function getActiveOrders() external view returns (uint256[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < _nextOrderId; i++) {
            if (orders[i].status == OrderStatus.Active) count++;
        }

        uint256[] memory result = new uint256[](count);
        uint256 idx = 0;
        for (uint256 i = 0; i < _nextOrderId; i++) {
            if (orders[i].status == OrderStatus.Active) {
                result[idx] = i;
                idx++;
            }
        }
        return result;
    }

    function getOrdersByNetwork(uint256 networkId) external view returns (uint256[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < _nextOrderId; i++) {
            if (orders[i].status == OrderStatus.Active && orders[i].networkId == networkId) count++;
        }

        uint256[] memory result = new uint256[](count);
        uint256 idx = 0;
        for (uint256 i = 0; i < _nextOrderId; i++) {
            if (orders[i].status == OrderStatus.Active && orders[i].networkId == networkId) {
                result[idx] = i;
                idx++;
            }
        }
        return result;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function getBalance() external view returns (uint256) {
        return evolveToken.balanceOf(address(this));
    }

    // ──────────────────────────────────────────────
    //  MODE 3 REWARDS (Cryptic Female Choice)
    // ──────────────────────────────────────────────

    function rewardMode3Father(address father, uint256 fatherDeposit, uint256 otherParticipants) external nonReentrant whenNotPaused {
        if (msg.sender != bondManager) revert NotBondManager();
        
        // Reward = 2x fatherDeposit + 1 EVOLVE per other participant
        uint256 reward = (fatherDeposit * 2) + (otherParticipants * 1e18);
        
        if (evolveToken.balanceOf(address(this)) < reward) revert InsufficientBalance();
        
        evolveToken.safeTransfer(father, reward);
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
}

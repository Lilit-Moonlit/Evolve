// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title EvolvePaymaster
 * @dev ERC-4337 Paymaster that sponsors gas fees for Evolve users.
 * Users can deposit EVOLVE tokens or native ETH to cover gas costs.
 */
contract EvolvePaymaster is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public immutable evolveToken;
    address public entryPoint;

    uint256 public minBalanceForSponsorship;
    uint256 public tokenPaymentRate;

    mapping(address => uint256) public userDeposits;

    event Deposited(address indexed user, uint256 amount, bool isToken);
    event Withdrawn(address indexed user, uint256 amount, bool isToken);
    event EntryPointSet(address indexed entryPoint);

    error OnlyEntryPoint();
    error OnlyOwner();
    error InsufficientDeposit();
    error WithdrawFailed();
    error InvalidAmount();

    modifier onlyEntryPoint() {
        if (msg.sender != entryPoint) revert OnlyEntryPoint();
        _;
    }

    constructor(
        address _evolveToken,
        address _entryPoint,
        uint256 _minBalanceForSponsorship,
        uint256 _tokenPaymentRate
    ) Ownable(msg.sender) {
        evolveToken = IERC20(_evolveToken);
        entryPoint = _entryPoint;
        minBalanceForSponsorship = _minBalanceForSponsorship;
        tokenPaymentRate = _tokenPaymentRate;
    }

    function setEntryPoint(address _entryPoint) external onlyOwner {
        entryPoint = _entryPoint;
        emit EntryPointSet(_entryPoint);
    }

    function setMinBalanceForSponsorship(uint256 _min) external onlyOwner {
        minBalanceForSponsorship = _min;
    }

    function setTokenPaymentRate(uint256 _rate) external onlyOwner {
        tokenPaymentRate = _rate;
    }

    function depositETH() external payable {
        if (msg.value == 0) revert InvalidAmount();
        userDeposits[msg.sender] += msg.value;
        emit Deposited(msg.sender, msg.value, false);
    }

    function depositEVOLVE(uint256 amount) external {
        if (amount == 0) revert InvalidAmount();
        evolveToken.safeTransferFrom(msg.sender, address(this), amount);
        userDeposits[msg.sender] += amount;
        emit Deposited(msg.sender, amount, true);
    }

    function withdrawETH(uint256 amount) external nonReentrant {
        if (userDeposits[msg.sender] < amount) revert InsufficientDeposit();
        userDeposits[msg.sender] -= amount;
        (bool success, ) = msg.sender.call{value: amount}("");
        if (!success) revert WithdrawFailed();
        emit Withdrawn(msg.sender, amount, false);
    }

    function withdrawEVOLVE(uint256 amount) external nonReentrant {
        if (userDeposits[msg.sender] < amount) revert InsufficientDeposit();
        userDeposits[msg.sender] -= amount;
        evolveToken.safeTransfer(msg.sender, amount);
        emit Withdrawn(msg.sender, amount, true);
    }

    function validatePaymasterUserOp(
        bytes calldata,
        bytes32,
        uint256 maxCost
    ) external onlyEntryPoint returns (uint256 validationData, bytes memory context) {
        address sender = msg.sender;

        if (userDeposits[sender] >= minBalanceForSponsorship) {
            return (0, abi.encode(true, sender, maxCost));
        }

        uint256 requiredTokens = (maxCost * tokenPaymentRate) / 1000;
        if (userDeposits[sender] < requiredTokens) {
            return (1, abi.encode(false, sender, requiredTokens));
        }

        return (0, abi.encode(false, sender, requiredTokens));
    }

    function postOp(
        uint256,
        bytes calldata context,
        uint256 actualGasCost
    ) external onlyEntryPoint {
        (bool sponsored, address sender, uint256 maxCostOrTokens) = abi.decode(
            context,
            (bool, address, uint256)
        );

        if (!sponsored) {
            uint256 charge = (actualGasCost * tokenPaymentRate) / 1000;
            if (charge > maxCostOrTokens) charge = maxCostOrTokens;
            if (userDeposits[sender] < charge) revert InsufficientDeposit();
            userDeposits[sender] -= charge;
        }
    }

    function getDeposit(address user) external view returns (uint256) {
        return userDeposits[user];
    }

    receive() external payable {
        userDeposits[msg.sender] += msg.value;
        emit Deposited(msg.sender, msg.value, false);
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IGovVoting {
    function calculateWeight(address user) external view returns (uint256);
    function receivedVotes(address user) external view returns (uint256);
}

interface IGovVerification {
    function hasStd(address user) external view returns (bool);
    function hasDna(address user) external view returns (bool);
    function isVerified(address user) external view returns (bool);
}

interface IERC20Min {
    function balanceOf(address account) external view returns (uint256);
}

interface IEvolveStaking {
    function getStake(address user) external view returns (uint256 amount, uint256 unlockTime, bool isLocked, bool exists);
}

contract Governance is Ownable, ReentrancyGuard {
    struct Proposal {
        uint256 id;
        string description;
        address creator;
        uint256 totalWeightFor;
        uint256 totalWeightAgainst;
        uint256 deadline;
        uint256 quorumWeight;
        bool executed;
        bool canceled;
        uint256 executionTime;
    }

    mapping(uint256 => Proposal) private _proposals;
    mapping(uint256 => mapping(address => bool)) private _hasVoted;
    mapping(uint256 => address[]) private _voters;
    mapping(address => uint256) private _proposalCount;
    mapping(uint256 => mapping(address => uint256)) private _voteWeights;

    IGovVoting public voting;
    IGovVerification public verification;
    IERC20Min public evolveToken;
    IEvolveStaking public staking;

    uint256 public constant VOTING_PERIOD = 7 days;
    uint256 public constant TIMELOCK_DELAY = 2 days;
    uint256 public constant QUORUM_PERCENTAGE = 40;
    uint256 public constant MIN_VOTERS_TO_EXECUTE = 10;

    // Weight multipliers (basis points = % * 100)
    uint256 public constant RECURSIVE_BP = 4000;  // 40%
    uint256 public constant STD_BP = 1000;        // 10%
    uint256 public constant DNA_BP = 1000;        // 10%
    uint256 public constant EVOLVE_BP = 4000;        // 40%
    uint256 public constant TOTAL_BP = 10000;     // 100%

    event ProposalCreated(uint256 indexed id, string description, address indexed creator, uint256 deadline, uint256 quorumWeight);
    event VoteCast(uint256 indexed proposalId, address indexed voter, bool support, uint256 weight);
    event ProposalExecuted(uint256 indexed id);
    event ProposalCanceled(uint256 indexed id);
    event ProposalQueued(uint256 indexed id, uint256 executionTime);
    event GovContractsSet(address indexed voting, address indexed verification, address indexed evolveToken);

    error VotingEnded();
    error VotingNotEnded();
    error AlreadyVoted();
    error ProposalNotExecutable();
    error ProposalWasCanceled();
    error InsufficientVoters();
    error InvalidProposal();
    error QuorumNotReached();
    error TimelockNotExpired();
    error AlreadyQueued();
    error ZeroAddress();

    constructor(address initialOwner) Ownable(initialOwner) {}

    function setContracts(address _voting, address _verification, address _evolveToken, address _staking) external onlyOwner {
        if (_voting == address(0) || _verification == address(0) || _evolveToken == address(0) || _staking == address(0)) revert ZeroAddress();
        voting = IGovVoting(_voting);
        verification = IGovVerification(_verification);
        evolveToken = IERC20Min(_evolveToken);
        staking = IEvolveStaking(_staking);
        emit GovContractsSet(_voting, _verification, _evolveToken);
    }

    // ──────────────────────────────────────────────
    //  WEIGHT CALCULATION
    // ──────────────────────────────────────────────

    function calculateVoteWeight(address user) public view returns (uint256) {
        // 1. Recursive weight (40%) — from Voting contract
        uint256 recursiveWeight = voting.calculateWeight(user);

        // 2. STD (10%) — binary: has it or not
        uint256 stdWeight = verification.hasStd(user) ? 1 : 0;

        // 3. DNA (10%) — binary: has it or not
        uint256 dnaWeight = verification.hasDna(user) ? 1 : 0;

        // 4. Staked EVOLVE holdings (40%) — ONLY staked tokens count. Free wallet balance gives NO weight.
        // Only verified users (STD + DNA) can participate in Modes 2/3, so staking implies verification.
        uint256 evolveWeight = 0;
        if (address(staking) != address(0)) {
            (uint256 stakedAmount, , , bool exists) = staking.getStake(user);
            if (exists && stakedAmount > 0) {
                evolveWeight = stakedAmount / (100 * 10**18); // 1 point per 100 EVOLVE staked
                if (evolveWeight > 100) evolveWeight = 100; // cap at 100
            }
        }

        // Combine: recursive (0-∞) + std (0-1) + dna (0-1) + evolve (0-100)
        // Normalize to a single uint256 for voting
        // Scale: recursiveWeight * RECURSIVE_BP / TOTAL_BP + ...
        // But recursiveWeight can be very large, so we use it as-is
        // and add the other components as multipliers

        // Simple approach: each component contributes proportionally
        // recursive * 40% + std * 10% + dna * 10% + evolve * 40%
        // Normalize by dividing by TOTAL_BP

        uint256 total = recursiveWeight * RECURSIVE_BP
                      + stdWeight * STD_BP
                      + dnaWeight * DNA_BP
                      + evolveWeight * EVOLVE_BP;

        return total / 100; // Scale down to readable number (divide BP by 100 → percentage)
    }

    // ──────────────────────────────────────────────
    //  PROPOSAL LIFECYCLE
    // ──────────────────────────────────────────────

    function createProposal(string memory description) external onlyOwner returns (uint256) {
        uint256 proposalId = _proposalCount[msg.sender]++;

        _proposals[proposalId] = Proposal({
            id: proposalId,
            description: description,
            creator: msg.sender,
            totalWeightFor: 0,
            totalWeightAgainst: 0,
            deadline: block.timestamp + VOTING_PERIOD,
            quorumWeight: 0, // Set when first vote is cast
            executed: false,
            canceled: false,
            executionTime: 0
        });

        emit ProposalCreated(proposalId, description, msg.sender, block.timestamp + VOTING_PERIOD, 0);
        return proposalId;
    }

    function vote(uint256 proposalId, bool support) external nonReentrant {
        Proposal storage proposal = _proposals[proposalId];
        if (proposal.creator == address(0) && proposal.id == 0) revert InvalidProposal();
        if (proposal.canceled) revert ProposalWasCanceled();
        if (block.timestamp > proposal.deadline) revert VotingEnded();
        if (_hasVoted[proposalId][msg.sender]) revert AlreadyVoted();

        uint256 weight = calculateVoteWeight(msg.sender);

        _hasVoted[proposalId][msg.sender] = true;
        _voters[proposalId].push(msg.sender);
        _voteWeights[proposalId][msg.sender] = weight;

        if (support) {
            proposal.totalWeightFor += weight;
        } else {
            proposal.totalWeightAgainst += weight;
        }

        // Set quorum on first vote using the voter's weight as baseline
        if (proposal.quorumWeight == 0) {
            proposal.quorumWeight = (weight * QUORUM_PERCENTAGE) / 100;
            if (proposal.quorumWeight < 10) proposal.quorumWeight = 10;
        }

        emit VoteCast(proposalId, msg.sender, support, weight);
    }

    function queueProposal(uint256 proposalId) external onlyOwner {
        Proposal storage proposal = _proposals[proposalId];
        if (proposal.executed) revert ProposalNotExecutable();
        if (proposal.canceled) revert ProposalWasCanceled();
        if (block.timestamp <= proposal.deadline) revert VotingNotEnded();
        if (_voters[proposalId].length < MIN_VOTERS_TO_EXECUTE) revert InsufficientVoters();
        if (proposal.totalWeightFor < proposal.quorumWeight) revert QuorumNotReached();
        if (proposal.executionTime != 0) revert AlreadyQueued();

        proposal.executionTime = block.timestamp + TIMELOCK_DELAY;
        emit ProposalQueued(proposalId, proposal.executionTime);
    }

    function executeProposal(uint256 proposalId) external onlyOwner nonReentrant {
        Proposal storage proposal = _proposals[proposalId];
        if (proposal.executed) revert ProposalNotExecutable();
        if (proposal.canceled) revert ProposalWasCanceled();
        if (proposal.executionTime == 0) revert ProposalNotExecutable();
        if (block.timestamp < proposal.executionTime) revert TimelockNotExpired();

        proposal.executed = true;
        emit ProposalExecuted(proposalId);
    }

    function cancelProposal(uint256 proposalId) external {
        Proposal storage proposal = _proposals[proposalId];
        if (proposal.executed) revert ProposalNotExecutable();
        if (msg.sender != proposal.creator && msg.sender != owner()) revert InvalidProposal();

        proposal.canceled = true;
        emit ProposalCanceled(proposalId);
    }

    // ──────────────────────────────────────────────
    //  VIEW
    // ──────────────────────────────────────────────

    function getProposal(uint256 proposalId) external view returns (Proposal memory) {
        return _proposals[proposalId];
    }

    function hasVoted(uint256 proposalId, address voter) external view returns (bool) {
        return _hasVoted[proposalId][voter];
    }

    function getVoteWeight(uint256 proposalId, address voter) external view returns (uint256) {
        return _voteWeights[proposalId][voter];
    }

    function getProposalCount(address creator) external view returns (uint256) {
        return _proposalCount[creator];
    }

    function getVoters(uint256 proposalId) external view returns (address[] memory) {
        return _voters[proposalId];
    }

    function getVoteCount(uint256 proposalId) external view returns (uint256 forVotes, uint256 againstVotes) {
        Proposal storage proposal = _proposals[proposalId];
        return (proposal.totalWeightFor, proposal.totalWeightAgainst);
    }
}

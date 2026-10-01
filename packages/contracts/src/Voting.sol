// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract Voting is Ownable, Pausable {
    uint256 public constant MAX_VOTES = 8;
    // Full recursive depth - no limit (only cycle detection prevents infinite loops)
    uint256 public constant MAX_ITERATIONS = 10000;

    mapping(address => address[]) private _votesGiven;
    mapping(address => mapping(address => uint256)) private _voteIndex;
    mapping(address => uint256) public voteCount;
    mapping(address => uint256) public receivedVotes;

    mapping(address => address[]) private _votersForUser;
    mapping(address => uint256) private _weightCache;
    mapping(address => uint256) private _weightTimestamp;
    uint256 public constant WEIGHT_CACHE_DURATION = 1 hours;

    // Gender tracking: Men can only vote for Women, Women can only vote for Men
    enum Gender { Unknown, Male, Female }
    mapping(address => Gender) public genderOf;

    event VoteCast(address indexed voter, address indexed target, uint256 totalVotes);
    event VoteRetracted(address indexed voter, address indexed target, uint256 totalVotes);
    event GenderSet(address indexed user, Gender gender);

    error MaxVotesReached(address voter);
    error AlreadyVotedFor(address target);
    error NotVotedFor(address target);
    error InvalidTarget();
    error SelfVote();
    error NoVotesToRetract();
    error SameGenderVote();
    error UnknownVoterGender();
    error UnknownTargetGender();

    constructor(address initialOwner) Ownable(initialOwner) {}

    function setGender(address user, Gender gender) external onlyOwner {
        genderOf[user] = gender;
        emit GenderSet(user, gender);
    }

    function vote(address target) external whenNotPaused {
        if (target == address(0)) revert InvalidTarget();
        if (target == msg.sender) revert SelfVote();
        if (_voteIndex[msg.sender][target] != 0) revert AlreadyVotedFor(target);
        if (voteCount[msg.sender] >= MAX_VOTES) revert MaxVotesReached(msg.sender);

        // Gender restriction: Men vote for Women, Women vote for Men
        Gender voterGender = genderOf[msg.sender];
        Gender targetGender = genderOf[target];
        if (voterGender == Gender.Unknown) revert UnknownVoterGender();
        if (targetGender == Gender.Unknown) revert UnknownTargetGender();
        if (voterGender == targetGender) revert SameGenderVote();

        _votesGiven[msg.sender].push(target);
        _voteIndex[msg.sender][target] = _votesGiven[msg.sender].length;
        voteCount[msg.sender] += 1;
        receivedVotes[target] += 1;

        _votersForUser[target].push(msg.sender);
        _invalidateWeight(target);

        emit VoteCast(msg.sender, target, voteCount[msg.sender]);
    }

    function retractVote(address target) external whenNotPaused {
        uint256 idx = _voteIndex[msg.sender][target];
        if (idx == 0) revert NotVotedFor(target);

        uint256 lastIdx = _votesGiven[msg.sender].length - 1;
        if (idx - 1 != lastIdx) {
            address lastTarget = _votesGiven[msg.sender][lastIdx];
            _votesGiven[msg.sender][idx - 1] = lastTarget;
            _voteIndex[msg.sender][lastTarget] = idx;
        }
        _votesGiven[msg.sender].pop();
        delete _voteIndex[msg.sender][target];
        voteCount[msg.sender] -= 1;
        receivedVotes[target] -= 1;

        _removeVoterForUser(target, msg.sender);
        _invalidateWeight(target);

        emit VoteRetracted(msg.sender, target, voteCount[msg.sender]);
    }

    function getReputationScore(address user) external view returns (uint256) {
        uint256 votes = receivedVotes[user];
        if (votes == 0) return 0;
        uint256 score = (votes * 100) / MAX_VOTES;
        return score > 100 ? 100 : score;
    }

    // ──────────────────────────────────────────────
    //  RECURSIVE WEIGHT CALCULATION
    // ──────────────────────────────────────────────

    function calculateWeight(address user) public view returns (uint256) {
        return _calculateWeight(user, 0, new address[](0));
    }

    function _calculateWeight(address user, uint256 depth, address[] memory visited) private view returns (uint256) {
        // Safety limit to prevent stack overflow (effectively unlimited for practical use)
        if (depth >= MAX_ITERATIONS) return 1;

        // Check for cycle - this is the ONLY termination condition besides depth limit
        for (uint256 i = 0; i < visited.length; i++) {
            if (visited[i] == user) return 1;
        }

        address[] memory voters = _votersForUser[user];
        uint256 total = 1;

        // Build new visited array with current user
        address[] memory newVisited = new address[](visited.length + 1);
        for (uint256 i = 0; i < visited.length; i++) {
            newVisited[i] = visited[i];
        }
        newVisited[visited.length] = user;

        // Recursively add weight from all voters (full depth, no artificial limit)
        for (uint256 i = 0; i < voters.length; i++) {
            total += _calculateWeight(voters[i], depth + 1, newVisited);
        }

        return total;
    }

    function batchCalculateWeights(address[] calldata users) external view returns (uint256[] memory) {
        uint256[] memory weights = new uint256[](users.length);
        for (uint256 i = 0; i < users.length; i++) {
            weights[i] = calculateWeight(users[i]);
        }
        return weights;
    }

    function _invalidateWeight(address user) private {
        _weightTimestamp[user] = 0;
    }

    function _removeVoterForUser(address target, address voter) private {
        address[] storage voters = _votersForUser[target];
        for (uint256 i = 0; i < voters.length; i++) {
            if (voters[i] == voter) {
                voters[i] = voters[voters.length - 1];
                voters.pop();
                break;
            }
        }
    }

    // ──────────────────────────────────────────────
    //  VIEW
    // ──────────────────────────────────────────────

    function getVotesGiven(address voter) external view returns (address[] memory) {
        return _votesGiven[voter];
    }

    function getVotersForUser(address user) external view returns (address[] memory) {
        return _votersForUser[user];
    }

    function getRemainingVotes(address voter) external view returns (uint256) {
        if (voteCount[voter] >= MAX_VOTES) return 0;
        return MAX_VOTES - voteCount[voter];
    }

    function hasVotedFor(address voter, address target) external view returns (bool) {
        return _voteIndex[voter][target] != 0;
    }

    function pause() external onlyOwner { _pause(); }
    function unpause() external onlyOwner { _unpause(); }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IVoting {
    function getReputationScore(address user) external view returns (uint256);
}

contract TrustScore is Ownable, ReentrancyGuard {
    struct ScoreEntry {
        uint256 score;
        uint256 lastUpdated;
        bool exists;
    }

    mapping(address => ScoreEntry) private _scores;

    IVoting public votingContract;

    uint256 public constant MIN_SCORE = 0;
    uint256 public constant MAX_SCORE = 100;
    uint256 public constant UPDATE_COOLDOWN = 1 days;

    event ScoreUpdated(address indexed user, uint256 newScore, uint256 timestamp);
    event ScoreInitialized(address indexed user, uint256 timestamp);
    event BatchScoresInitialized(uint256 count, uint256 timestamp);
    event BatchScoresUpdated(uint256 count, uint256 timestamp);
    event VotingContractSet(address indexed votingContract);

    error ScoreOutOfBounds();
    error UpdateTooFrequent();
    error ScoreNotInitialized();
    error BatchEmpty();
    error BatchTooLarge();

    uint256 public constant MAX_BATCH_SIZE = 50;

    constructor(address initialOwner) Ownable(initialOwner) {}

    function setVotingContract(address _votingContract) external onlyOwner {
        votingContract = IVoting(_votingContract);
        emit VotingContractSet(_votingContract);
    }

    function initializeScore(address user) external onlyOwner {
        if (!_scores[user].exists) {
            _scores[user] = ScoreEntry({
                score: 50,
                lastUpdated: block.timestamp,
                exists: true
            });
            emit ScoreInitialized(user, block.timestamp);
        }
    }

    function initializeScores(address[] calldata users) external onlyOwner {
        if (users.length == 0) revert BatchEmpty();
        if (users.length > MAX_BATCH_SIZE) revert BatchTooLarge();

        uint256 count = 0;
        for (uint256 i = 0; i < users.length; i++) {
            if (!_scores[users[i]].exists) {
                _scores[users[i]] = ScoreEntry({
                    score: 50,
                    lastUpdated: block.timestamp,
                    exists: true
                });
                emit ScoreInitialized(users[i], block.timestamp);
                count++;
            }
        }
        emit BatchScoresInitialized(count, block.timestamp);
    }

    function updateScore(address user, uint256 newScore) external onlyOwner nonReentrant {
        if (!_scores[user].exists) revert ScoreNotInitialized();
        if (newScore > MAX_SCORE) revert ScoreOutOfBounds();
        if (block.timestamp - _scores[user].lastUpdated < UPDATE_COOLDOWN) revert UpdateTooFrequent();

        _scores[user].score = newScore;
        _scores[user].lastUpdated = block.timestamp;

        emit ScoreUpdated(user, newScore, block.timestamp);
    }

    function updateScores(address[] calldata users, uint256[] calldata newScores) external onlyOwner nonReentrant {
        if (users.length == 0) revert BatchEmpty();
        if (users.length != newScores.length) revert BatchEmpty();
        if (users.length > MAX_BATCH_SIZE) revert BatchTooLarge();

        uint256 count = 0;
        for (uint256 i = 0; i < users.length; i++) {
            if (!_scores[users[i]].exists) continue;
            if (newScores[i] > MAX_SCORE) continue;
            if (block.timestamp - _scores[users[i]].lastUpdated < UPDATE_COOLDOWN) continue;

            _scores[users[i]].score = newScores[i];
            _scores[users[i]].lastUpdated = block.timestamp;
            emit ScoreUpdated(users[i], newScores[i], block.timestamp);
            count++;
        }
        emit BatchScoresUpdated(count, block.timestamp);
    }

    function getScore(address user) external view returns (uint256) {
        if (!_scores[user].exists) revert ScoreNotInitialized();
        return _scores[user].score;
    }

    function getTotalScore(address user) external view returns (uint256) {
        if (!_scores[user].exists) revert ScoreNotInitialized();

        uint256 base = _scores[user].score;
        uint256 reputation = 0;

        if (address(votingContract) != address(0)) {
            try votingContract.getReputationScore(user) returns (uint256 r) {
                reputation = r;
            } catch {
                reputation = 0;
            }
        }

        uint256 total = base + reputation;
        return total > MAX_SCORE ? MAX_SCORE : total;
    }

    function hasScore(address user) external view returns (bool) {
        return _scores[user].exists;
    }

    function getLastUpdated(address user) external view returns (uint256) {
        if (!_scores[user].exists) revert ScoreNotInitialized();
        return _scores[user].lastUpdated;
    }

    function getScores(address[] calldata users) external view returns (uint256[] memory) {
        uint256[] memory scores = new uint256[](users.length);
        for (uint256 i = 0; i < users.length; i++) {
            scores[i] = _scores[users[i]].score;
        }
        return scores;
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IEvolveStaking {
    function lockStake(address user) external;
    function unlockStake(address user) external;
    function transferStake(address from, address to, uint256 amount) external;
    function getStake(address user) external view returns (uint256 amount, uint256 unlockTime, bool isLocked, bool exists);
}

contract BondManager is Ownable, ReentrancyGuard {
    IEvolveStaking public staking;

    uint256 private _nextBondId;
    uint256 private _nextSessionId;

    uint256 public constant SESSION_DURATION = 48 hours;
    uint256 public constant MIN_PREGNANCY_DELAY = 14 days;
    uint256 public constant PREGNANCY_PERIOD = 9 * 30 days;
    uint256 public constant STAKE_THRESHOLD = 100 * 10**18;
    uint256 public constant MIN_REMAINING = 30 days;
    uint256 public constant SHARE_TO_WOMAN = 90;
    uint256 public constant SHARE_TO_FATHER = 10;

    enum BondStatus { Active, AwaitingPaternity, Resolved }
    enum SexType { Vaginal }

    struct PregnancyBond {
        uint256 id;
        address man;
        address woman;
        bool manConfirmed;
        bool womanConfirmed;
        uint256 confirmedAt;
        BondStatus status;
        bool paternityConfirmed;
        bool resolved;
    }

    struct CrypticSession {
        uint256 id;
        address woman;
        uint256 startTime;
        uint256 periodEnd;
        bool active;
        uint256 participantCount;
        mapping(uint256 => address) participants;
        mapping(address => bool) hasConfirmed;
        bool resolved;
        address father;
    }

    mapping(uint256 => PregnancyBond) public bonds;
    mapping(uint256 => CrypticSession) private _sessions;
    mapping(address => uint256[]) public userBonds;
    mapping(address => uint256) public activeSession;

    event BondCreated(uint256 indexed id, address indexed man, address indexed woman);
    event BondConfirmed(uint256 indexed id, address indexed by);
    event BondBothConfirmed(uint256 indexed id);
    event BondPregnant(uint256 indexed id);
    event BondPaternityResult(uint256 indexed id, bool confirmed);
    event BondResolved(uint256 indexed id, address indexed woman);
    event SessionCreated(uint256 indexed id, address indexed woman, uint256 periodEnd);
    event SessionJoined(uint256 indexed id, address indexed man);
    event SessionConfirmed(uint256 indexed id, address indexed participant);
    event SessionResolved(uint256 indexed id, address indexed father, uint256 totalDistributed);

    error NotVerified(address user);
    error NoActiveStake(address user);
    error BelowStakeThreshold(address user);
    error AlreadyInBond(address user);
    error NotParticipant();
    error AlreadyConfirmed();
    error AlreadyResolved();
    error NotWoman();
    error WomenCantJoin();
    error SessionExpired();
    error SessionNotExpired();
    error SessionNotOver();
    error InvalidPaternityResult();
    error StakeTooLow();
    error TooEarly();
    error TooLate();
    error SelfPair();
    error NotInSession();
    error NoActiveBond();
    error NotManOrWoman();

    modifier onlyWomanOfBond(uint256 bondId) {
        if (bonds[bondId].woman != msg.sender) revert NotWoman();
        _;
    }

    modifier onlyUnresolvedBond(uint256 bondId) {
        if (bonds[bondId].resolved) revert AlreadyResolved();
        _;
    }

    constructor(address stakingContract, address initialOwner) Ownable(initialOwner) {
        staking = IEvolveStaking(stakingContract);
    }

    function setStaking(address stakingContract) external onlyOwner {
        staking = IEvolveStaking(stakingContract);
    }

    // ──────────────────────────────────────────────
    //  MODE 2 — Pregnancy Bond
    // ──────────────────────────────────────────────

    function createBond(address man) external returns (uint256) {
        if (msg.sender == man) revert SelfPair();
        _requireActiveStake(man);

        uint256 id = _nextBondId++;
        bonds[id] = PregnancyBond({
            id: id,
            man: man,
            woman: msg.sender,
            manConfirmed: false,
            womanConfirmed: false,
            confirmedAt: 0,
            status: BondStatus.Active,
            paternityConfirmed: false,
            resolved: false
        });

        userBonds[man].push(id);
        userBonds[msg.sender].push(id);

        emit BondCreated(id, man, msg.sender);
        return id;
    }

    function confirmBond(uint256 bondId) external onlyUnresolvedBond(bondId) {
        PregnancyBond storage bond = bonds[bondId];
        bool isMan = msg.sender == bond.man;
        bool isWoman = msg.sender == bond.woman;
        if (!isMan && !isWoman) revert NotManOrWoman();

        if (isMan) {
            if (bond.manConfirmed) revert AlreadyConfirmed();
            bond.manConfirmed = true;
        } else {
            if (bond.womanConfirmed) revert AlreadyConfirmed();
            bond.womanConfirmed = true;
        }

        emit BondConfirmed(bondId, msg.sender);

        if (bond.manConfirmed && bond.womanConfirmed) {
            bond.confirmedAt = block.timestamp;
            staking.lockStake(bond.man);
            emit BondBothConfirmed(bondId);
        }
    }

    function reportPregnancy(uint256 bondId) external onlyWomanOfBond(bondId) onlyUnresolvedBond(bondId) {
        PregnancyBond storage bond = bonds[bondId];
        if (bond.status != BondStatus.Active) revert AlreadyResolved();
        if (!bond.manConfirmed || !bond.womanConfirmed) revert TooEarly();
        if (block.timestamp < bond.confirmedAt + MIN_PREGNANCY_DELAY) revert TooEarly();
        if (block.timestamp > bond.confirmedAt + PREGNANCY_PERIOD) revert TooLate();

        bond.status = BondStatus.AwaitingPaternity;
        emit BondPregnant(bondId);
    }

    function submitPaternityResult(uint256 bondId, bool confirmed) external onlyOwner {
        PregnancyBond storage bond = bonds[bondId];
        if (bond.status != BondStatus.AwaitingPaternity) revert InvalidPaternityResult();
        if (bond.resolved) revert AlreadyResolved();

        bond.paternityConfirmed = confirmed;
        bond.status = BondStatus.Resolved;
        bond.resolved = true;

        if (confirmed) {
            (uint256 amount,,,) = staking.getStake(bond.man);
            if (amount > 0) {
                staking.transferStake(bond.man, bond.woman, amount);
            }
        }
        staking.unlockStake(bond.man);

        emit BondPaternityResult(bondId, confirmed);
        emit BondResolved(bondId, bond.woman);
    }

    // ──────────────────────────────────────────────
    //  MODE 3 — Cryptic Female Choice
    // ──────────────────────────────────────────────

    function createSession() external returns (uint256) {
        _requireActiveStake(msg.sender);

        uint256 existing = activeSession[msg.sender];
        if (existing != 0 && !_sessions[existing].resolved) revert AlreadyInBond(msg.sender);

        uint256 id = _nextSessionId++;
        CrypticSession storage session = _sessions[id];
        session.id = id;
        session.woman = msg.sender;
        session.startTime = block.timestamp;
        session.periodEnd = block.timestamp + SESSION_DURATION;
        session.active = true;
        session.participantCount = 0;
        session.resolved = false;
        session.father = address(0);

        activeSession[msg.sender] = id;
        emit SessionCreated(id, msg.sender, session.periodEnd);
        return id;
    }

    function joinSession(uint256 sessionId) external {
        CrypticSession storage session = _sessions[sessionId];
        if (session.resolved) revert AlreadyResolved();
        if (block.timestamp >= session.periodEnd) revert SessionExpired();
        if (msg.sender == session.woman) revert WomenCantJoin();

        _requireActiveStake(msg.sender);

        // Check if already joined
        for (uint256 i = 0; i < session.participantCount; i++) {
            if (session.participants[i] == msg.sender) revert AlreadyInBond(msg.sender);
        }

        uint256 idx = session.participantCount;
        session.participants[idx] = msg.sender;
        session.participantCount++;
        session.hasConfirmed[msg.sender] = false;

        emit SessionJoined(sessionId, msg.sender);
    }

    function confirmSession(uint256 sessionId) external {
        CrypticSession storage session = _sessions[sessionId];
        if (session.resolved) revert AlreadyResolved();
        if (block.timestamp >= session.periodEnd) revert SessionExpired();
        if (msg.sender == session.woman) revert NotParticipant();

        bool found = false;
        for (uint256 i = 0; i < session.participantCount; i++) {
            if (session.participants[i] == msg.sender) { found = true; break; }
        }
        if (!found) revert NotParticipant();
        if (session.hasConfirmed[msg.sender]) revert AlreadyConfirmed();

        session.hasConfirmed[msg.sender] = true;
        staking.lockStake(msg.sender);

        emit SessionConfirmed(sessionId, msg.sender);
    }

    function resolveSession(uint256 sessionId, address father) external onlyOwner {
        CrypticSession storage session = _sessions[sessionId];
        if (session.resolved) revert AlreadyResolved();
        if (block.timestamp < session.periodEnd + 14 days) revert SessionNotOver();
        if (session.participantCount == 0) revert NotParticipant();

        session.active = false;
        session.resolved = true;
        session.father = father;

        uint256 totalDistributed = 0;
        address woman = session.woman;

        for (uint256 i = 0; i < session.participantCount; i++) {
            address participant = session.participants[i];
            if (participant == father) {
                // Father keeps his stake — just unlock from bond
                staking.unlockStake(participant);
                continue;
            }

            (uint256 amount,,,) = staking.getStake(participant);
            if (amount == 0) continue;

            staking.unlockStake(participant);

            uint256 toWoman = (amount * SHARE_TO_WOMAN) / 100;
            uint256 toFather = (amount * SHARE_TO_FATHER) / 100;

            // Transfer full amount, then woman sends father's share
            // (Or we can split: transfer to woman first, then to father)
            if (toFather > 0 && father != address(0)) {
                staking.transferStake(participant, father, toFather);
            }
            if (toWoman > 0) {
                staking.transferStake(participant, woman, toWoman);
            }

            totalDistributed += amount;
        }

        emit SessionResolved(sessionId, father, totalDistributed);
    }

    // ──────────────────────────────────────────────
    //  INTERNAL
    // ──────────────────────────────────────────────

    function _requireActiveStake(address user) private view {
        (uint256 amount, uint256 unlockTime, bool isLocked, bool exists) = staking.getStake(user);
        if (!exists) revert NoActiveStake(user);
        if (amount < STAKE_THRESHOLD) revert BelowStakeThreshold(user);
        if (unlockTime < block.timestamp + MIN_REMAINING) revert StakeTooLow();
        if (isLocked) revert AlreadyInBond(user);
    }

    function getBond(uint256 bondId) external view returns (PregnancyBond memory) {
        return bonds[bondId];
    }

    function getSession(uint256 sessionId) external view returns (
        address woman, uint256 periodEnd, bool active, bool resolved, address father, uint256 participantCount
    ) {
        CrypticSession storage session = _sessions[sessionId];
        return (session.woman, session.periodEnd, session.active, session.resolved, session.father, session.participantCount);
    }

    function getSessionParticipants(uint256 sessionId) external view returns (address[] memory) {
        CrypticSession storage session = _sessions[sessionId];
        address[] memory result = new address[](session.participantCount);
        for (uint256 i = 0; i < session.participantCount; i++) {
            result[i] = session.participants[i];
        }
        return result;
    }

    function getUserBonds(address user) external view returns (uint256[] memory) {
        return userBonds[user];
    }
}

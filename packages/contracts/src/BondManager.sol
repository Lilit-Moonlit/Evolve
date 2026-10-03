// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IEvolveFund {
    function lockStake(address user, uint8 depositType) external;
    function unlockStake(address user, uint8 depositType) external;
    function bondWithdraw(address user, uint256 amount, address to, uint8 depositType) external;
    function getStake(address user) external view returns (uint256 amount, uint256 unlockTime, bool isLocked, bool exists);
    function getPostCopulationStake(address user) external view returns (uint256 amount, uint256 unlockTime, bool isLocked, bool exists);
}

interface IVerificationRegistry {
    function isVerified(address user) external view returns (bool);
}

interface IEvolve2Earn {
    function rewardMode3Father(address father, uint256 fatherDeposit, uint256 otherParticipants) external;
}

contract BondManager is Ownable, ReentrancyGuard {
    IEvolveFund public evolveFund;
    IVerificationRegistry public verification;
    IEvolve2Earn public evolve2Earn;

    uint256 private _nextBondId;
    uint256 private _nextSessionId;

    uint256 public constant SESSION_DURATION = 48 hours;
    uint256 public constant MIN_PREGNANCY_DELAY = 14 days;
    uint256 public constant PREGNANCY_PERIOD = 9 * 30 days;
    uint256 public constant STAKE_THRESHOLD = 15 * 10**18;
    uint256 public constant MIN_REMAINING = 30 days;
    uint256 public constant SHARE_TO_WOMAN = 90;
    uint256 public constant SHARE_TO_FATHER = 10;
    uint256 public constant MAX_PARTICIPANTS = 50;
    // 1 month to report pregnancy (30 days)
    uint256 public constant PREGNANCY_REPORT_DEADLINE = 30 days;

    enum BondStatus { Active, AwaitingPaternity, Resolved }
    enum TestStatus { NotRequired, Pending, Passed, Failed }

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
        // Test statuses - only required at meeting, not upfront
        TestStatus stdTestMan;
        TestStatus stdTestWoman;
        TestStatus dnaTestMan;
        TestStatus dnaTestWoman;
        // Timestamps for test completion
        uint256 stdTestCompletedAt;
        uint256 dnaTestCompletedAt;
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
        // Test statuses for participants
        mapping(address => TestStatus) stdTests;
        mapping(address => TestStatus) dnaTests;
    }

    mapping(uint256 => PregnancyBond) public bonds;
    mapping(uint256 => CrypticSession) private _sessions;
    mapping(address => uint256[]) public userBonds;
    mapping(address => uint256) public activeSession;

    mapping(address => uint256) private _childrenCount;
    uint256 private _totalMothers;
    uint256 private _totalFathers;
    mapping(address => bool) private _isMother;
    mapping(address => bool) private _isFather;

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

    // Test status events with user-friendly descriptions
    event STDTestSubmitted(uint256 indexed bondId, address indexed user, TestStatus status, string description);
    event DNATestSubmitted(uint256 indexed bondId, address indexed user, TestStatus status, string description);
    event PregnancyReported(uint256 indexed id, uint256 deadline, string description);
    event TestStatusUpdated(uint256 indexed bondId, address indexed user, string testType, TestStatus status);

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
    error NoActiveFund(address user);
    error NoActiveBond();
    error NotManOrWoman();
    error MaxParticipantsReached();
    error PregnancyReportDeadlinePassed();
    error InvalidTestStatus();

    modifier onlyWomanOfBond(uint256 bondId) {
        if (bonds[bondId].woman != msg.sender) revert NotWoman();
        _;
    }

    modifier onlyUnresolvedBond(uint256 bondId) {
        if (bonds[bondId].resolved) revert AlreadyResolved();
        _;
    }

    constructor(address _evolveFund, address _verification, address _evolve2Earn, address initialOwner) Ownable(initialOwner) {
        evolveFund = IEvolveFund(_evolveFund);
        verification = IVerificationRegistry(_verification);
        evolve2Earn = IEvolve2Earn(_evolve2Earn);
    }

    function setEvolveFund(address _evolveFund) external onlyOwner {
        evolveFund = IEvolveFund(_evolveFund);
    }

    function setVerification(address _verification) external onlyOwner {
        verification = IVerificationRegistry(_verification);
    }

    function setEvolve2Earn(address _evolve2Earn) external onlyOwner {
        evolve2Earn = IEvolve2Earn(_evolve2Earn);
    }

    // ──────────────────────────────────────────────
    //  MODE 2 — Pregnancy Bond
    // ──────────────────────────────────────────────

    function createBond(address man) external returns (uint256) {
        if (msg.sender == man) revert SelfPair();
        _requireActiveFund(man);

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
            resolved: false,
            stdTestMan: TestStatus.NotRequired,
            stdTestWoman: TestStatus.NotRequired,
            dnaTestMan: TestStatus.NotRequired,
            dnaTestWoman: TestStatus.NotRequired,
            stdTestCompletedAt: 0,
            dnaTestCompletedAt: 0
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
            evolveFund.lockStake(bond.man, 0); // 0 = Conception type
            emit BondBothConfirmed(bondId);
        }
    }

    function reportPregnancy(uint256 bondId) external onlyWomanOfBond(bondId) onlyUnresolvedBond(bondId) {
        PregnancyBond storage bond = bonds[bondId];
        if (bond.status != BondStatus.Active) revert AlreadyResolved();
        if (!bond.manConfirmed || !bond.womanConfirmed) revert TooEarly();
        if (block.timestamp < bond.confirmedAt + MIN_PREGNANCY_DELAY) revert TooEarly();
        if (block.timestamp > bond.confirmedAt + PREGNANCY_PERIOD) revert TooLate();

        // Check if pregnancy report deadline has passed (1 month after confirmation)
        if (block.timestamp > bond.confirmedAt + PREGNANCY_REPORT_DEADLINE) {
            revert PregnancyReportDeadlinePassed();
        }

        bond.status = BondStatus.AwaitingPaternity;
        
        // Calculate deadline for user reference
        uint256 reportDeadline = bond.confirmedAt + PREGNANCY_REPORT_DEADLINE;
        
        emit BondPregnant(bondId);
        emit PregnancyReported(bondId, reportDeadline, "Woman reported pregnancy. Deadline: 1 month after bond confirmation.");
    }

    // ──────────────────────────────────────────────
    //  TEST STATUS MANAGEMENT
    //  Тести потрібні саме при зустрічі, а не відразу
    //  STD тести важливі для свіжості, DNA - ні
    // ──────────────────────────────────────────────

    function submitSTDTest(uint256 bondId, TestStatus status) external {
        PregnancyBond storage bond = bonds[bondId];
        if (bond.id == 0) revert NoActiveBond();
        if (bond.resolved) revert AlreadyResolved();

        bool isMan = msg.sender == bond.man;
        bool isWoman = msg.sender == bond.woman;
        if (!isMan && !isWoman) revert NotManOrWoman();

        if (status != TestStatus.Passed && status != TestStatus.Failed) revert InvalidTestStatus();

        if (isMan) {
            bond.stdTestMan = status;
        } else {
            bond.stdTestWoman = status;
        }
        bond.stdTestCompletedAt = block.timestamp;

        string memory description = isMan 
            ? "Man submitted STD test. Result: passed/failed. STD tests are important for freshness of results."
            : "Woman submitted STD test. Result: passed/failed. STD tests are important for freshness of results.";

        emit STDTestSubmitted(bondId, msg.sender, status, description);
        emit TestStatusUpdated(bondId, msg.sender, "STD", status);
    }

    function submitDNATest(uint256 bondId, TestStatus status) external {
        PregnancyBond storage bond = bonds[bondId];
        if (bond.id == 0) revert NoActiveBond();
        if (bond.resolved) revert AlreadyResolved();

        bool isMan = msg.sender == bond.man;
        bool isWoman = msg.sender == bond.woman;
        if (!isMan && !isWoman) revert NotManOrWoman();

        if (status != TestStatus.Passed && status != TestStatus.Failed) revert InvalidTestStatus();

        if (isMan) {
            bond.dnaTestMan = status;
        } else {
            bond.dnaTestWoman = status;
        }
        bond.dnaTestCompletedAt = block.timestamp;

        string memory description = isMan 
            ? "Man submitted DNA test. Result: passed/failed. DNA test freshness is not important."
            : "Woman submitted DNA test. Result: passed/failed. DNA test freshness is not important.";

        emit DNATestSubmitted(bondId, msg.sender, status, description);
        emit TestStatusUpdated(bondId, msg.sender, "DNA", status);
    }

    function getTestStatuses(uint256 bondId) external view returns (
        TestStatus stdMan, TestStatus stdWoman, TestStatus dnaMan, TestStatus dnaWoman,
        uint256 stdCompletedAt, uint256 dnaCompletedAt
    ) {
        PregnancyBond storage bond = bonds[bondId];
        return (
            bond.stdTestMan, bond.stdTestWoman, bond.dnaTestMan, bond.dnaTestWoman,
            bond.stdTestCompletedAt, bond.dnaTestCompletedAt
        );
    }

    function submitPaternityResult(uint256 bondId, bool confirmed) external onlyOwner {
        PregnancyBond storage bond = bonds[bondId];
        if (bond.status != BondStatus.AwaitingPaternity) revert InvalidPaternityResult();
        if (bond.resolved) revert AlreadyResolved();

        bond.paternityConfirmed = confirmed;
        bond.status = BondStatus.Resolved;
        bond.resolved = true;

        if (confirmed) {
            (uint256 amount,,,) = evolveFund.getStake(bond.man);
            if (amount > 0) {
                evolveFund.bondWithdraw(bond.man, amount, bond.woman, 0); // 0 = Conception type
            }

            _childrenCount[bond.man] += 1;
            _childrenCount[bond.woman] += 1;
            if (!_isFather[bond.man]) { _isFather[bond.man] = true; _totalFathers += 1; }
            if (!_isMother[bond.woman]) { _isMother[bond.woman] = true; _totalMothers += 1; }
        }
        evolveFund.unlockStake(bond.man, 0); // 0 = Conception type

        emit BondPaternityResult(bondId, confirmed);
        emit BondResolved(bondId, bond.woman);
    }

    // ──────────────────────────────────────────────
    //  MODE 3 — Cryptic Female Choice
    // ──────────────────────────────────────────────

    function createSession() external returns (uint256) {
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

        _requireActiveFund(msg.sender);

        if (session.participantCount >= MAX_PARTICIPANTS) revert MaxParticipantsReached();

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
        evolveFund.lockStake(msg.sender, 1); // 1 = PostCopulation type

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

        // Count other participants (excluding father) for extra reward
        uint256 otherParticipants = 0;

        for (uint256 i = 0; i < session.participantCount; i++) {
            address participant = session.participants[i];
            if (participant == father) {
                continue;
            }
            otherParticipants++;
        }

        for (uint256 i = 0; i < session.participantCount; i++) {
            address participant = session.participants[i];
            if (participant == father) {
                continue;
            }

            (uint256 amount,,,) = evolveFund.getPostCopulationStake(participant);
            if (amount == 0) continue;

            evolveFund.unlockStake(participant, 1); // 1 = PostCopulation type

            uint256 toWoman = (amount * SHARE_TO_WOMAN) / 100;
            uint256 toFather = (amount * SHARE_TO_FATHER) / 100;

            if (toFather > 0 && father != address(0)) {
                evolveFund.bondWithdraw(participant, toFather, father, 1); // 1 = PostCopulation type
            }
            if (toWoman > 0) {
                evolveFund.bondWithdraw(participant, toWoman, woman, 1); // 1 = PostCopulation type
            }

            totalDistributed += amount;
        }

        if (father != address(0)) {
            // Unlock father's stake (his deposit is returned to him via the reward)
            evolveFund.unlockStake(father, 1); // 1 = PostCopulation type

            // Pay father: 2x his deposit + 1 EVOLVE per other participant
            (uint256 fatherDeposit,,,) = evolveFund.getPostCopulationStake(father);
            if (fatherDeposit > 0) {
                // Withdraw the father's original deposit back to him from EvolveFund
                evolveFund.bondWithdraw(father, fatherDeposit, father, 1);
                // Pay the reward (2x deposit + 1 per other participant) from the Evolve2Earn pool
                evolve2Earn.rewardMode3Father(father, fatherDeposit, otherParticipants);
            }

            _childrenCount[father] += 1;
            _childrenCount[woman] += 1;
            if (!_isFather[father]) { _isFather[father] = true; _totalFathers += 1; }
            if (!_isMother[woman]) { _isMother[woman] = true; _totalMothers += 1; }
        }

        emit SessionResolved(sessionId, father, totalDistributed);
    }

    // ──────────────────────────────────────────────
    //  CHILDREN TRACKING (for Governance)
    // ──────────────────────────────────────────────

    function getChildrenCount(address user) external view returns (uint256) {
        return _childrenCount[user];
    }

    function getTotalMothers() external view returns (uint256) {
        return _totalMothers;
    }

    function getTotalFathers() external view returns (uint256) {
        return _totalFathers;
    }

    // ──────────────────────────────────────────────
    //  INTERNAL
    // ──────────────────────────────────────────────

    function _requireActiveFund(address user) private view {
        // Check Conception stake
        (uint256 amount1, uint256 unlockTime1, bool isLocked1, bool exists1) = evolveFund.getStake(user);
        // Check PostCopulation stake
        (uint256 amount2, uint256 unlockTime2, bool isLocked2, bool exists2) = evolveFund.getPostCopulationStake(user);

        // At least one type must exist and meet requirements
        bool hasValidConception = exists1 && amount1 >= STAKE_THRESHOLD && unlockTime1 >= block.timestamp + MIN_REMAINING && !isLocked1;
        bool hasValidPostCopulation = exists2 && amount2 >= STAKE_THRESHOLD && unlockTime2 >= block.timestamp + MIN_REMAINING && !isLocked2;

        if (!hasValidConception && !hasValidPostCopulation) {
            if (!exists1 && !exists2) revert NoActiveFund(user);
            if ((exists1 && amount1 < STAKE_THRESHOLD) || (exists2 && amount2 < STAKE_THRESHOLD)) revert BelowStakeThreshold(user);
            if ((exists1 && unlockTime1 < block.timestamp + MIN_REMAINING) || (exists2 && unlockTime2 < block.timestamp + MIN_REMAINING)) revert StakeTooLow();
            if (isLocked1 || isLocked2) revert AlreadyInBond(user);
        }
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

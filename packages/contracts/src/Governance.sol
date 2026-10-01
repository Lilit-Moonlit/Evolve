// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IGovVoting {
    function calculateWeight(address user) external view returns (uint256);
    function receivedVotes(address user) external view returns (uint256);
}

interface IERC20Min {
    function balanceOf(address account) external view returns (uint256);
}

interface IEvolveFund {
    function getStake(address user) external view returns (uint256 amount, uint256 unlockTime, bool isLocked, bool exists);
}

interface IBondManager {
    function getChildrenCount(address user) external view returns (uint256);
    function getTotalMothers() external view returns (uint256);
    function getTotalFathers() external view returns (uint256);
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
        ProposalType proposalType;
    }

    enum ProposalType { General, Implementation, Amendment }

    struct ImplementationProposal {
        uint256 proposalId;
        string title;
        string description;
        string status; // "proposed", "approved", "in_progress", "completed", "rejected"
        uint256 createdAt;
        uint256 completedAt;
        address[] contributors;
    }

    struct Amendment {
        uint256 id;
        uint256 proposalId;
        address creator;
        string description;
        uint256 votesFor;
        uint256 votesAgainst;
        bool executed;
    }

    mapping(uint256 => Proposal) private _proposals;
    mapping(uint256 => mapping(address => bool)) private _hasVoted;
    mapping(uint256 => address[]) private _voters;
    mapping(address => uint256) private _proposalCount;
    mapping(uint256 => mapping(address => uint256)) private _voteWeights;

    // Implementation proposals tracking
    mapping(uint256 => ImplementationProposal) public implementationProposals;
    uint256 private _nextImplProposalId;

    // Amendments to proposals
    mapping(uint256 => Amendment) public amendments;
    mapping(uint256 => uint256[]) public proposalAmendments;
    uint256 private _nextAmendmentId;

    // Project description in multiple languages
    mapping(string => string) public projectDescriptions;
    string[] public supportedLanguages;

    // Features tracking
    struct Feature {
        string name;
        string description;
        bool implemented;
        uint256 implementedAt;
        string language; // Primary language for this feature
    }

    mapping(string => Feature) public features;
    string[] public featureNames;
    mapping(string => bool) public featureExists;

    enum Gender { Unknown, Male, Female }

    IGovVoting public voting;
    IERC20Min public evolveToken;
    IEvolveFund public evolveFund;
    IBondManager public bondManager;

    mapping(address => Gender) public genderOf;

    uint256 public constant VOTING_PERIOD = 7 days;
    uint256 public constant TIMELOCK_DELAY = 2 days;
    uint256 public constant QUORUM_PERCENTAGE = 40;
    uint256 public constant MIN_VOTERS_TO_EXECUTE = 10;

    uint256 public constant RECURSIVE_BP = 3000;
    uint256 public constant CHILDREN_BP = 4000;
    uint256 public constant TOKEN_BP = 3000;
    uint256 public constant TOTAL_BP = 10000;

    event ProposalCreated(uint256 indexed id, string description, address indexed creator, uint256 deadline, uint256 quorumWeight);
    event VoteCast(uint256 indexed proposalId, address indexed voter, bool support, uint256 weight);
    event ProposalExecuted(uint256 indexed id);
    event ProposalCanceled(uint256 indexed id);
    event ProposalQueued(uint256 indexed id, uint256 executionTime);
    event GovContractsSet(address indexed voting, address indexed evolveToken);
    event GenderSet(address indexed user, Gender gender);
    event ImplementationProposalCreated(uint256 indexed id, string title, address indexed creator);
    event ImplementationProposalStatusChanged(uint256 indexed id, string status);
    event AmendmentCreated(uint256 indexed id, uint256 indexed proposalId, address indexed creator);
    event AmendmentVoted(uint256 indexed amendmentId, address indexed voter, bool support);
    event ProjectDescriptionUpdated(string language, string description);
    event FeatureAdded(string name, string description, string language);
    event FeatureStatusChanged(string name, bool implemented);

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
    error UnknownGender();
    error InvalidImplementationProposal();
    error InvalidAmendment();
    error AmendmentAlreadyVoted();
    error FeatureAlreadyExists();
    error FeatureNotFound();

    constructor(address initialOwner) Ownable(initialOwner) {
        // Initialize default project descriptions
        _initProjectDescriptions();
    }

    function _initProjectDescriptions() private {
        // Add initial supported languages
        supportedLanguages.push("uk");
        supportedLanguages.push("en");
        supportedLanguages.push("de");
        supportedLanguages.push("fr");
        supportedLanguages.push("es");
        supportedLanguages.push("pt");
        supportedLanguages.push("ja");
        supportedLanguages.push("ko");
        supportedLanguages.push("zh");
        supportedLanguages.push("ar");
        supportedLanguages.push("vi");
        supportedLanguages.push("hi");
        supportedLanguages.push("tr");
        supportedLanguages.push("th");
        supportedLanguages.push("id");
        supportedLanguages.push("ms");
        supportedLanguages.push("ru");

        // Default Ukrainian description
        projectDescriptions["uk"] = "EVOLVE - decentralizovana platforma dlya znayomstv z vykorystannyam blokcheyn-tekhnologij. Platforma zabezpechuje bezpeku, privatnist ta spravedlyvu ekonomiku cherez token EVOLVE.";

        // Default English description
        projectDescriptions["en"] = "EVOLVE is a decentralized dating platform using blockchain technology. The platform ensures security, privacy, and fair economy through the EVOLVE token.";
    }

    function setContracts(address _voting, address _evolveToken, address _fund, address _bondManager) external onlyOwner {
        if (_voting == address(0) || _evolveToken == address(0) || _fund == address(0) || _bondManager == address(0)) revert ZeroAddress();
        voting = IGovVoting(_voting);
        evolveToken = IERC20Min(_evolveToken);
        evolveFund = IEvolveFund(_fund);
        bondManager = IBondManager(_bondManager);
        emit GovContractsSet(_voting, _evolveToken);
    }

    function setGender(address user, Gender gender) external onlyOwner {
        genderOf[user] = gender;
        emit GenderSet(user, gender);
    }

    // ──────────────────────────────────────────────
    //  WEIGHT CALCULATION
    // ──────────────────────────────────────────────

    function calculateVoteWeight(address user) public view returns (uint256) {
        Gender g = genderOf[user];
        if (g == Gender.Unknown) revert UnknownGender();

        uint256 recursiveWeight = voting.calculateWeight(user);

        uint256 childrenWeight = _calculateChildrenWeight(user, g);

        uint256 tokenWeight = 0;
        if (g == Gender.Female) {
            uint256 balance = evolveToken.balanceOf(user);
            tokenWeight = balance / (100 * 10**18);
            if (tokenWeight > 100) tokenWeight = 100;
        } else {
            if (address(evolveFund) != address(0)) {
                (uint256 stakedAmount, , , bool exists) = evolveFund.getStake(user);
                if (exists && stakedAmount > 0) {
                    tokenWeight = stakedAmount / (100 * 10**18);
                    if (tokenWeight > 100) tokenWeight = 100;
                }
            }
        }

        // 30% tokens + 30% recursive reputation + 40% children
        uint256 total = recursiveWeight * RECURSIVE_BP
                      + childrenWeight * CHILDREN_BP
                      + tokenWeight * TOKEN_BP;

        return total / 100;
    }

    function _calculateChildrenWeight(address user, Gender g) private view returns (uint256) {
        if (address(bondManager) == address(0)) return 0;

        uint256 userChildren = bondManager.getChildrenCount(user);
        if (userChildren == 0) return 0;

        uint256 totalPeers;
        if (g == Gender.Female) {
            totalPeers = bondManager.getTotalMothers();
        } else {
            totalPeers = bondManager.getTotalFathers();
        }

        if (totalPeers == 0) return 0;

        return (userChildren * 100) / totalPeers;
    }

    // ──────────────────────────────────────────────
    //  PROPOSAL LIFECYCLE
    // ──────────────────────────────────────────────

    function createProposal(string memory description) public returns (uint256) {
        return _createProposalWithType(description, ProposalType.General);
    }

    function createProposalWithAmendment(string memory description) external returns (uint256) {
        return _createProposalWithType(description, ProposalType.Amendment);
    }

    function _createProposalWithType(string memory description, ProposalType pType) internal returns (uint256) {
        uint256 proposalId = _proposalCount[msg.sender]++;

        _proposals[proposalId] = Proposal({
            id: proposalId,
            description: description,
            creator: msg.sender,
            totalWeightFor: 0,
            totalWeightAgainst: 0,
            deadline: block.timestamp + VOTING_PERIOD,
            quorumWeight: 0,
            executed: false,
            canceled: false,
            executionTime: 0,
            proposalType: pType
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

    // ──────────────────────────────────────────────
    //  PROJECT DESCRIPTION MANAGEMENT
    // ──────────────────────────────────────────────

    function setProjectDescription(string calldata language, string calldata description) external onlyOwner {
        projectDescriptions[language] = description;

        // Add to supported languages if not exists
        bool found = false;
        for (uint256 i = 0; i < supportedLanguages.length; i++) {
            if (keccak256(bytes(supportedLanguages[i])) == keccak256(bytes(language))) {
                found = true;
                break;
            }
        }
        if (!found) {
            supportedLanguages.push(language);
        }

        emit ProjectDescriptionUpdated(language, description);
    }

    function getProjectDescription(string calldata language) external view returns (string memory) {
        return projectDescriptions[language];
    }

    function getSupportedLanguages() external view returns (string[] memory) {
        return supportedLanguages;
    }

    // ──────────────────────────────────────────────
    //  IMPLEMENTATION PROPOSALS
    // ──────────────────────────────────────────────

    function createImplementationProposal(
        string calldata title,
        string calldata description
    ) external returns (uint256) {
        uint256 proposalId = createProposal(description);

        uint256 implId = _nextImplProposalId++;
        implementationProposals[implId] = ImplementationProposal({
            proposalId: proposalId,
            title: title,
            description: description,
            status: "proposed",
            createdAt: block.timestamp,
            completedAt: 0,
            contributors: new address[](0)
        });

        // Update proposal type
        _proposals[proposalId].proposalType = ProposalType.Implementation;

        emit ImplementationProposalCreated(implId, title, msg.sender);
        return implId;
    }

    function updateImplementationStatus(uint256 implId, string calldata status) external onlyOwner {
        ImplementationProposal storage impl = implementationProposals[implId];
        if (impl.proposalId == 0) revert InvalidImplementationProposal();

        impl.status = status;
        if (keccak256(bytes(status)) == keccak256(bytes("completed"))) {
            impl.completedAt = block.timestamp;
        }

        emit ImplementationProposalStatusChanged(implId, status);
    }

    function addContributor(uint256 implId, address contributor) external onlyOwner {
        ImplementationProposal storage impl = implementationProposals[implId];
        if (impl.proposalId == 0) revert InvalidImplementationProposal();
        impl.contributors.push(contributor);
    }

    // ──────────────────────────────────────────────
    //  AMENDMENTS TO PROPOSALS
    // ──────────────────────────────────────────────

    function createAmendment(
        uint256 proposalId,
        string calldata description
    ) external returns (uint256) {
        Proposal storage proposal = _proposals[proposalId];
        if (proposal.creator == address(0) && proposal.id == 0) revert InvalidProposal();
        if (proposal.executed) revert ProposalNotExecutable();

        uint256 amendmentId = _nextAmendmentId++;
        amendments[amendmentId] = Amendment({
            id: amendmentId,
            proposalId: proposalId,
            creator: msg.sender,
            description: description,
            votesFor: 0,
            votesAgainst: 0,
            executed: false
        });

        proposalAmendments[proposalId].push(amendmentId);
        emit AmendmentCreated(amendmentId, proposalId, msg.sender);
        return amendmentId;
    }

    function voteOnAmendment(uint256 amendmentId, bool support) external nonReentrant {
        Amendment storage amendment = amendments[amendmentId];
        if (amendment.id == 0) revert InvalidAmendment();
        if (amendment.executed) revert ProposalNotExecutable();

        uint256 weight = calculateVoteWeight(msg.sender);

        if (support) {
            amendment.votesFor += weight;
        } else {
            amendment.votesAgainst += weight;
        }

        emit AmendmentVoted(amendmentId, msg.sender, support);
    }

    function executeAmendment(uint256 amendmentId) external onlyOwner {
        Amendment storage amendment = amendments[amendmentId];
        if (amendment.id == 0) revert InvalidAmendment();
        if (amendment.executed) revert ProposalNotExecutable();

        // Check if amendment has more votes for than against
        if (amendment.votesFor <= amendment.votesAgainst) revert QuorumNotReached();

        amendment.executed = true;

        // Update proposal description with amendment
        Proposal storage proposal = _proposals[amendment.proposalId];
        proposal.description = amendment.description;

        emit ProposalCanceled(amendment.proposalId); // Reuse event for amendment execution
    }

    // ──────────────────────────────────────────────
    //  FEATURES TRACKING
    // ──────────────────────────────────────────────

    function addFeature(
        string calldata name,
        string calldata description,
        string calldata language
    ) external onlyOwner {
        if (featureExists[name]) revert FeatureAlreadyExists();

        features[name] = Feature({
            name: name,
            description: description,
            implemented: false,
            implementedAt: 0,
            language: language
        });

        featureNames.push(name);
        featureExists[name] = true;

        emit FeatureAdded(name, description, language);
    }

    function markFeatureImplemented(string calldata name) external onlyOwner {
        if (!featureExists[name]) revert FeatureNotFound();

        features[name].implemented = true;
        features[name].implementedAt = block.timestamp;

        emit FeatureStatusChanged(name, true);
    }

    function getFeature(string calldata name) external view returns (Feature memory) {
        if (!featureExists[name]) revert FeatureNotFound();
        return features[name];
    }

    function getFeatures() external view returns (string[] memory) {
        return featureNames;
    }

    function getImplementedFeatures() external view returns (string[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < featureNames.length; i++) {
            if (features[featureNames[i]].implemented) count++;
        }

        string[] memory result = new string[](count);
        uint256 idx = 0;
        for (uint256 i = 0; i < featureNames.length; i++) {
            if (features[featureNames[i]].implemented) {
                result[idx] = featureNames[i];
                idx++;
            }
        }
        return result;
    }

    function getPlannedFeatures() external view returns (string[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < featureNames.length; i++) {
            if (!features[featureNames[i]].implemented) count++;
        }

        string[] memory result = new string[](count);
        uint256 idx = 0;
        for (uint256 i = 0; i < featureNames.length; i++) {
            if (!features[featureNames[i]].implemented) {
                result[idx] = featureNames[i];
                idx++;
            }
        }
        return result;
    }
}

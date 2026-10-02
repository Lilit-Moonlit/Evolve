# EVOLVE: How It Works

EVOLVE is a decentralized platform designed to facilitate secure, private, and verifiable interactions for dating, conception, and health verification. Our architecture prioritizes user control and data privacy.

## User Flows

### 1. Authentication

EVOLVE offers self-custodial authentication methods:

- **SIWE (Sign-In with Ethereum)**: Users log in using their cryptocurrency wallet, providing a secure and decentralized identity.
- **DNA Recovery**: In case of lost access, accounts can be recovered using on-chain DNA verification, eliminating the need for traditional email or phone-based recovery.

### 2. Mode Selection

After authentication, users select their desired interaction mode, which tailors the platform experience:

- **Dating**: Standard mode for finding compatible partners.
- **Pregnancy Bond (Mode 2)**: For users interested in co-parenting or establishing a pregnancy bond.
- **Cryptic Choice (Mode 3)**: A specialized mode for anonymous conception scenarios.

### 3. Profile Creation and Search Filters

Users create comprehensive profiles while maintaining control over their privacy:

- **Profile Details**: Users set their age (with an option to hide it), languages, and bio.
- **Photo Privacy**: Photos can be uploaded with a blur effect. Owners can grant temporary (15-second) or permanent viewing access to other users.
- **Search Filters**: Users can filter profiles based on:
  - **"What are you looking for?"**: Dating, Conception (Pregnancy Bond), Polyandrous Conception (Cryptic Choice), or STD Testing.
  - **"Who are you looking for?"**: Gender preferences (man, woman, couples) dynamically adjusted based on the selected "What" purpose and user's own gender.
  - **Location**: Cascading country and city selections.
  - **STD Compatibility**: Filter by anonymous compatibility verdicts.
  - **Can Travel**: Filter for users willing to travel to your country, with an option to specify a list of countries they can travel to.
  - **Skin Color**: Filter by various skin tones.
  - **Testing Preference**: Filter by preference for lab testing (lab, portable, both, none).

### 4. STD/DNA Verification

A core feature of EVOLVE is its anonymous health verification system:

- **Test Upload**: Users upload STD and DNA test results (raw text or PDF).
- **Parsing**: The system parses the results, extracting information for 8 key pathogens (HIV-1/2, Syphilis, Chlamydia, Gonorrhea, HSV-1, HSV-2, Hepatitis B, Hepatitis C).
- **Anonymous Compatibility**: Individual pathogen statuses are **never** revealed. Instead, the platform provides an anonymous compatibility verdict (Safe, Compatible, Caution, Risk) when comparing two profiles.
- **On-chain DNA Commitment**: DNA test results are converted into a SHA-256 hash (bytes32) and committed on-chain via `DNAVerification.sol`, enabling secure and private recovery.

### 5. Matching and Communication

- **Profile Ranking**: Profiles are ranked based on compatibility with user-defined filters and reputation score.
- **Peer-to-Peer Chat**: Messaging operates primarily over decentralized networks (libp2p gossipsub + Nostr), with a central HTTP API as a fallback for convenience. This ensures ban-resistance and privacy.
- **Photo Access Requests**: Users can request photo access, and owners can approve, deny, or proactively offer access.

### 6. Laboratory Partner Flow

EVOLVE integrates with laboratory partners for seamless verification:

- **Lab Registration**: Labs can register as partners.
- **Patient Verification**: Labs verify patient identities using QR codes and face matching.
- **Report Upload**: Labs upload STD reports, which are then processed by the EVOLVE system to update the user's anonymous compatibility status.

### 7. Pregnancy Bond (Mode 2)

This mode facilitates secure agreements for co-parenting:

- **Bond Creation**: A woman initiates a bond.
- **Token Staking**: A man stakes a minimum of 100 EVOLVE tokens.
- **Confirmation & Lock**: Both parties confirm, and the staked tokens are locked.
- **Paternity Confirmation**: If pregnancy is reported (14-270 days) and paternity is confirmed by an admin, the man's staked tokens are transferred to the woman.

### 8. Cryptic Choice (Mode 3)

A specialized mode for anonymous conception:

- **Session Creation**: A woman creates a session.
- **Men Join**: Men join the session by staking a minimum of 100 EVOLVE tokens.
- **Choice & Distribution**: After a 48-hour window, the woman chooses a father. The chosen father's stake is returned, while others' stakes are distributed (90% to the woman, 10% to the chosen father).

### 9. Companion Mode

A lightweight, standalone mode for evaluating STD test results:

- Users can upload and evaluate their STD test results independently.
- Routes to `/companion`, `/companion/upload`, `/companion/result`.

### 10. Safety Mode (Public Facade)

EVOLVE includes a `safety` mode (`VITE_PRODUCT_MODE=safety`) as a public facade:

- **Limited Features**: Provides basic STD status checks, public profile links, and incoming/outgoing compatibility checks.
- **Resilience**: Designed to remain functional even if dating/conception features are banned in certain jurisdictions or app stores.

## Architecture Overview

EVOLVE is built as a monorepo, organizing various components into distinct packages:

```
C:\CFC\
├── apps/
│   ├── web/          # Vite + React (main web application)
│   └── mobile/       # Expo + React Native (mobile application)
├── packages/
│   ├── config/       # Feature flags & dynamic remote configuration
│   ├── contracts/    # Solidity smart contracts (0.8.24, Hardhat, Ignition)
│   ├── core/         # Shared types, utilities, middleware, web3 integrations
│   ├── matching/     # Algorithms for profile matching, filters, and ranking
│   ├── p2p/          # Decentralized networking (libp2p v3 + Nostr)
│   └── storage/      # Decentralized storage (IPFS, Arweave, Lit Protocol)
└── docs/             # Project documentation
```

### Key Smart Contracts

- `EVOLVE.sol`: The ERC-20 token powering the ecosystem.
- `ProfileNFT.sol`: ERC-721 tokens representing user profiles.
- `TrustScore.sol`: Manages user reputation and trust scores.
- `Voting.sol`: Handles on-chain governance and vote weighting.
- `Evolve2Earn.sol`: Manages rewards and the emoji gift economy.
- `Governance.sol`: Orchestrates token-weighted proposals and execution.
- `BondManager.sol`: Manages Mode 2 (pregnancy-bond) and Mode 3 (cryptic-choice) logic.
- `EvolveFund.sol`: Contract for male token deposits (staking).
- `VerificationRegistry.sol`: Registers and verifies STD and DNA test results.
- `DNAVerification.sol`: Stores on-chain DNA verification records.
- `TimelockController (OpenZeppelin)`: Provides a time-delayed administrative control for critical contract operations.

### Data Flow Diagrams (Text-based)

#### User Onboarding

```
User → Evolve2Earn.verify() → mints ProfileNFT → initializes TrustScore (1)
     → receives EVOLVE tokens (verification reward)
```

#### Matching & Communication

```
User A → p2p ChatManager.sendMessage() → libp2p gossipsub → User B
       → matching.calculateMatchScore() → profile ranking
```

#### Emoji Gift Economy

```
User A → Evolve2Earn.buyEmojiGift(id) → 1 EVOLVE spent
       → revenue split among existing owners (proportional)
       → gift tradeable via transferEmojiGift()
```

#### Voting → Reputation

```
User A votes for User B
  → Voting.sol: weight = 1 + Σ(calculateWeight(voter)) [depth ≤ 3]
  → TrustScore.sol: totalScore = baseScore + reputationScore (capped 100)
  → Governance.sol: voteWeight = (recursiveWeight × 30% + children × 40% + Staked EVOLVE × 30%). Free balance on wallet gives NO weight for men; women use wallet balance.
```

#### Mode 2: Pregnancy Bond

```
Woman creates bond → Man stakes ≥ 100 EVOLVE → Both confirm → Stake locked
  → Woman reports pregnancy (14-270 days) → Admin confirms paternity
  → Man's stake transfers to Woman
```

#### Mode 3: Cryptic Choice

```
Woman creates session → Men join (stake ≥ 100 EVOLVE) → Confirm → Stakes locked
  → 48h window → Woman chooses father
  → Father: stake returned | Others: 90% to Woman, 10% to Father
```

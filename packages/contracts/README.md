# @evolve/contracts

Solidity smart contracts for Evolve dating platform. Solidity ^0.8.24, OpenZeppelin ^5.6.1.

## Contracts

### `EVOLVE` (`src/EVOLVE.sol`)

ERC20 token with mint and burn (no pause — deliberately removed). `MAX_SUPPLY` is immutable (default 8B), enforced via a `totalMinted` counter. `MINTER_ROLE` gates `mint()`; on deploy, Ignition grants `DEFAULT_ADMIN_ROLE` and `MINTER_ROLE` to the `TimelockController`, so every admin/mint action must pass a 48h-delayed proposal. The deployer keeps its constructor-granted roles only for the post-deploy pre-mint and should renounce them afterwards.

### `TimelockController` (OZ 5.6, via `src/TimelockController.sol`)

OpenZeppelin TimelockController deployed from the Ignition module `ignition/modules/TimelockController.js` with a 48h min delay. The Safe multisig holds `PROPOSER_ROLE` (+ `CANCELLER_ROLE`) and `EXECUTOR_ROLE`; the timelock is self-administered (`admin = 0`). `src/TimelockController.sol` is an import-only anchor so the OZ artifact enters the Hardhat compilation queue.

### `ProfileNFT` (`src/ProfileNFT.sol`)

ERC721 profile NFT with pausable minting/burning. Stores a metadata URI per token.

### `TrustScore` (`src/TrustScore.sol`)

Reputation scoring system. New users start with a base score of 1. Scores range 1–100 with a 1-day cooldown between updates. Optional `Voting` integration: `getTotalScore(user)` combines base score + voting reputation (capped at 100). Batch operations via `initializeScores`/`updateScores` (max 50 per call).

### `Voting` (`src/Voting.sol`)

8-vote-per-user system. `vote(target)` / `retractVote(target)` with swap-and-pop storage. `getReputationScore(user)` maps received votes to a 0â€“100 score. Integrated with TrustScore via `setVotingContract`.

### `Evolve2Earn` (`src/Evolve2Earn.sol`)

Earn EVOLVE tokens by verifying your profile, matching, and daily activity. Emoji gift economy: buy emoji gifts (Roses, Cacti, etc.) for 1 EVOLVE each; existing owners split the revenue proportionally (50:50 for 2 owners, 75:25 for 3:1, etc.). Gifts are transferable.

### `Governance` (`src/Governance.sol`)

Basic governance with proposal creation, voting, and execution. `MIN_VOTING_DELAY` and `MIN_EXECUTION_DELAY` enforce timelocks.

### `DNAVerification` (`src/DNAVerification.sol`)

On-chain DNA verification storing STR markers and haplogroup per user. Supports verify/revoke with revocation-time tracking. Integrated with `VerificationRegistry` via `setDNAVerification` so the registry can query live on-chain DNA status. Owner-only `pause`/`unpause` (OZ 5.6.1 `Pausable` exposes only internal variants).

### `VerificationRegistry` (`src/VerificationRegistry.sol`)

STD + DNA verification registry. Implements `IDNAVerification` and syncs on-chain DNA status via `setDNAVerification` / `setDNAVerified` / `syncDNAVerified`.

## Deployment

Ignition module at `ignition/modules/index.js`. Deploys 13 futures — `EVOLVE`, `VerificationRegistry`, `ProfileNFT`, `EvolveFund`, `BondManager`, `DNAVerification`, `TrustScore`, `Evolve2Earn`, `Governance`, `EvolveSmartAccount` + `EvolveSmartAccountFactory`, `EvolvePaymaster`, `TimelockController` — wired via `m.useModule`, with post-deploy calls `EvolveFund.setBondManager`, `VerificationRegistry.setDNAVerification`, `Evolve2Earn.setBondManager`, and `EVOLVE.grantRole(DEFAULT_ADMIN_ROLE/MINTER_ROLE → timelock)`.

```bash
npm run compile
npm run deploy:local          # hardhat in-process network (local params)
npm run deploy:localhost      # persistent localhost network (local params)
```

Two parameter files, both module-scoped and BOM-free:

| File                             | Used by                           | Notes                                                                                  |
| -------------------------------- | --------------------------------- | -------------------------------------------------------------------------------------- |
| `ignition-parameters.json`       | testnet/mainnet deploys           | `owner` = testnet deployer EOA; timelock proposer/executor = Safe multisig placeholder |
| `ignition-parameters.local.json` | `deploy:local`/`deploy:localhost` | owner/proposer/executor = hardhat#0 (ignition sends txs from the first signer)         |

| Parameter   | Default   | Description                      |
| ----------- | --------- | -------------------------------- |
| `owner`     | hardhat#0 | Contract owner address           |
| `maxSupply` | 8B        | EVOLVE max supply (wei)          |
| `minDelay`  | 172800    | Timelock delay, seconds (48h)    |
| `proposer`  | —         | Safe multisig (proposes/cancels) |
| `executor`  | —         | Safe multisig (executes)         |

> Note: ignition 0.15 requires **module-scoped** parameters (`"ModuleName": { "owner": "..." }`); top-level keys and the legacy `$global` key are not supported. The file must not contain a UTF-8 BOM — a BOM silently disables all parameters and fails every module with IGN725.

Post-deploy: call `EVOLVE.mint` to fund `Evolve2Earn`, and `Voting` → `TrustScore.setVotingContract` to enable reputation integration.

## Scripts

```bash
npm test                # npx hardhat test
npm run compile         # npx hardhat compile
npm run coverage        # npx hardhat coverage
npm run deploy:local    # deploy to ephemeral hardhat node
npm run deploy:localhost # deploy to persistent localhost
```

## Testing

199 tests across 14 test files:

| File                                | Tests                                                                    |
| ----------------------------------- | ------------------------------------------------------------------------ |
| `test/EVOLVE.test.js`               | mint, burn, roles                                                        |
| `test/EVOLVEAdmin.test.js`          | DEFAULT_ADMIN_ROLE=timelock: 48h delay, propose/execute/cancel, renounce |
| `test/RewardMinter.test.js`         | mintReward 1e18 / mintFaucet 50e18, separate daily limits, whitelist     |
| `test/ProfileNFT.test.js`           | mint, burn, URIs                                                         |
| `test/TrustScore.test.js`           | base score 1, batch ops, edge cases, voting integration                  |
| `test/Voting.test.js`               | vote, retract, reputation score                                          |
| `test/Evolve2Earn.test.js`          | rewards, emoji gift economy                                              |
| `test/Evolve2EarnGifts.test.js`     | emoji gift economy edge cases                                            |
| `test/Governance.test.js`           | proposals, voting, execution                                             |
| `test/BondManager.test.js`          | pregnancy bond, cryptic choice                                           |
| `test/VerificationRegistry.test.js` | STD/DNA verification registry (incl. DNA integration)                    |
| `test/DNAVerification.test.js`      | DNA verification, revocation, events                                     |
| `test/Paymaster.test.js`            | ETH/EVOLVE deposits, entry point setter                                  |
| `test/SmartAccountFactory.test.js`  | ERC-4337 smart account factory + implementation                          |

```bash
npm test
```

## License

UNLICENSED â€” internal Evolve project.

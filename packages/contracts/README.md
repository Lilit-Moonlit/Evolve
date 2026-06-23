# @evolve/contracts

Solidity smart contracts for Evolve dating platform. Solidity ^0.8.24, OpenZeppelin ^5.6.1.

## Contracts

### `CFC` (`src/CFC.sol`)

ERC20 token with mint, burn, and pausable controls. Mined to users and the Evolve2Earn contract on deploy. `MAX_SUPPLY` capped at `_maxSupply` (default 100M).

### `ProfileNFT` (`src/ProfileNFT.sol`)

ERC721 profile NFT with pausable minting/burning. Stores a metadata URI per token.

### `TrustScore` (`src/TrustScore.sol`)

Reputation scoring system. Scores range 0â€“100 with a 1-day cooldown between updates. Optional `Voting` integration: `getTotalScore(user)` combines base score + voting reputation (capped at 100). Batch operations via `initializeScores`/`updateScores` (max 50 per call).

### `Voting` (`src/Voting.sol`)

8-vote-per-user system. `vote(target)` / `retractVote(target)` with swap-and-pop storage. `getReputationScore(user)` maps received votes to a 0â€“100 score. Integrated with TrustScore via `setVotingContract`.

### `Evolve2Earn` (`src/Evolve2Earn.sol`)

Earn CFC tokens by verifying your profile, matching, and daily activity. Emoji gift economy: buy emoji gifts (Roses, Cacti, etc.) for 1 CFC each; existing owners split the revenue proportionally (50:50 for 2 owners, 75:25 for 3:1, etc.). Gifts are transferable.

### `Governance` (`src/Governance.sol`)

Basic governance with proposal creation, voting, and execution. `MIN_VOTING_DELAY` and `MIN_EXECUTION_DELAY` enforce timelocks.

## Deployment

Ignition module at `ignition/modules/index.js`. Deploy order: `CFC` â†’ `ProfileNFT` â†’ `TrustScore` â†’ `Evolve2Earn` â†’ `Governance`.

```bash
npm run compile
npm run deploy:local          # hardhat node
npm run deploy:localhost      # localhost network
```

Parameters in `ignition-parameters.json`:

| Parameter   | Default   | Description            |
| ----------- | --------- | ---------------------- |
| `owner`     | hardhat#0 | Contract owner address |
| `maxSupply` | 100M      | CFC max supply (wei)   |

Post-deploy: call `CFC.mint` to fund `Evolve2Earn`, and `Voting` â†’ `TrustScore.setVotingContract` to enable reputation integration.

## Scripts

```bash
npm test                # npx hardhat test
npm run compile         # npx hardhat compile
npm run coverage        # npx hardhat coverage
npm run deploy:local    # deploy to ephemeral hardhat node
npm run deploy:localhost # deploy to persistent localhost
```

## Testing

118 tests across 6 test files:

| File                       | Tests                                 |
| -------------------------- | ------------------------------------- |
| `test/CFC.test.js`         | mint, burn, pause                     |
| `test/ProfileNFT.test.js`  | mint, burn, URIs                      |
| `test/TrustScore.test.js`  | scores, batch ops, voting integration |
| `test/Voting.test.js`      | vote, retract, reputation score       |
| `test/Evolve2Earn.test.js` | rewards, emoji gift economy           |
| `test/Governance.test.js`  | proposals, voting, execution          |

```bash
npm test
```

## License

UNLICENSED â€” internal Evolve project.

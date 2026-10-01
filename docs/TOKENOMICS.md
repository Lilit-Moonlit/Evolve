# EVOLVE Tokenomics

## Token Details

| Property       | Value                            |
| -------------- | -------------------------------- |
| **Contract**   | `EVOLVE.sol` (ERC-20)            |
| **Max Supply** | 8,000,000,000 EVOLVE             |
| **Decimals**   | 18                               |
| **Network**    | EVM-compatible (Solidity 0.8.24) |

## Earning EVOLVE

The primary way to earn EVOLVE is through the **Emoji Gift Economy** (see below).

There is a narrowly-scoped exception for verification rewards: 1 EVOLVE is minted to the verified user and 1 EVOLVE to the confirming laboratory upon STD/DNA test verification. These rewards are minted via `RewardMinter.mintReward()` (packages/contracts/src/RewardMinter.sol, `REWARD_AMOUNT = 1e18`), invoked from `apps/web/src/lib/registration-reward.ts` (`grantRegistrationReward`, `REWARD_WEI = 1e18`). A separate rate-limited test faucet `mintFaucet()` (`FAUCET_AMOUNT = 50e18`) exists for onboarding.

There are no daily, match, or general activity rewards.

## Spending EVOLVE

| Action                    | Cost          | Contract                     |
| ------------------------- | ------------- | ---------------------------- |
| Emoji gift (Rose, Cactus) | 1 EVOLVE      | `Evolve2Earn.buyEmojiGift()` |
| EvolveFund deposit        | min 15 EVOLVE | `EvolveFund.deposit()`       |

## Emoji Gift Economy

When a user buys an emoji gift for 1 EVOLVE, that 1 EVOLVE is distributed proportionally among all existing gift owners:

- **1 owner**: receives full 1 EVOLVE (first buyer pays but gets nothing — starts the economy)
- **2 owners**: 50:50 split (0.5 EVOLVE each)
- **3 owners**: ~33.3% each
- **Any ratio**: split proportional to `ownerGiftCount` (e.g. owner with 3 gifts gets 3× more than owner with 1 gift)
- **Buyer**: excluded from their own purchase distribution

### Example Flows

**Alice buys first rose (id=rose)** — costs 1 EVOLVE. No distribution (no prior owners).

**Bob buys first cactus (id=cactus)** — costs 1 EVOLVE. Alice (only owner) receives 1 EVOLVE.

**Charlie buys a rose** — costs 1 EVOLVE. Alice has 1 gift, Bob has 1 gift. Split: 0.5 EVOLVE each.

**Alice buys another rose** — Alice now has 2 gifts, Bob has 1. Alice's share of new purchases: 2/3, Bob's: 1/3.

Gifts are transferable via `transferEmojiGift(id, newOwner)`. Ownership and future revenue rights transfer.

## Staking → EvolveFund

**EvolveStaking has been removed.** Men use `EvolveFund` (deposit, 30+ day lock). Women hold tokens on their wallet balance (free withdrawal/transfer).

- **Men**: deposit into EvolveFund (min 15 EVOLVE, min 30 days) → affects Governance as staked weight
- **Women**: tokens on wallet balance → affects Governance as balance (can withdraw anytime, rating will drop)

## Governance

EVOLVE holders govern via `Governance.sol`:

### Vote Weight — 3 Components

**Women:**

1. Wallet balance (30%) — 1 point per 100 EVOLVE, capped at 100
2. Recursive reputation (30%) — 8 votes, depth 3
3. % children born relative to all mothers (40%)

**Men:**

1. EvolveFund balance (30%) — 1 point per 100 EVOLVE, capped at 100
2. Recursive reputation (30%) — 8 votes, depth 3
3. % fathered children relative to all fathers (40%)

### Proposal Lifecycle

1. **Proposal creation**: any user creates a proposal with description and calldata
2. **Voting period**: 7 days, quorum 40%
3. **Timelock**: 2 days after voting ends
4. **Execution**: approved proposals execute after timelock

## Supply Distribution

| Bucket             | %         | EVOLVE        | wei                    |
| :----------------- | :-------- | :------------ | :--------------------- |
| Founder            | 1.0000%   | 80,000,000    | 80_000_000e18 = 8.0e25 |
| Developers         | 1.0000%   | 80,000,000    | 8.0e25                 |
| Community treasury | 90.0000%  | 7,200,000,000 | 7.2e27                 |
| Reserve            | 8.0000%   | 640,000,000   | 6.4e26                 |
| **Total**          | 100.0000% | 8,000,000,000 | 8.0e27                 |

DEX liquidity is a **named sub-bucket** of the Community treasury: 1,000,000 EVOLVE per DEX. Assuming 5 DEXes, this totals 5,000,000 EVOLVE (0.0625% of total supply). The Community treasury remainder after DEX liquidity is 7,195,000,000 EVOLVE.

_Historical Sepolia testnet deployment (2026-09-05) minted to the legacy reward pool and escrow vault; superseded by the 8B model above. No daily/match/verification rewards — emoji gift economy only._

> **Downstream deltas (NOT changed in this phase):**
> (i) `VestingWalletCliff.sol` and `ignition/modules/VestingWallet.js` hardcode `TEAM_ALLOCATION = 1.6B` with a 12-month cliff and 36-month linear vesting. This is now stale and must later become two separate allocations: Founder (80M) and Developers (80M).
> (ii) The old 30/20/20/15/10/5 pre-mint 5.6B narrative is superseded by this new distribution.
> (iii) `LiquidityLocker` and DEX liquidity will now be funded from the Community treasury sub-bucket and will be reviewed in a later phase.

## Economic Model

```
User Activity → Earn EVOLVE via gifts → Revenue to Owners → Incentive to Hold
     ↓                                                         ↑
  Reputation ←── Voting ←── EvolveFund deposit ←───────────────┘
```

The flywheel: active users earn EVOLVE → spend on gifts → gift owners earn passive EVOLVE → incentive to stay active and earn more → higher engagement → more EVOLVE demand.

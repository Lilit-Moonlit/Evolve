# EVOLVE Tokenomics

## Token Details

| Property       | Value                            |
| -------------- | -------------------------------- |
| **Contract**   | `EVOLVE.sol` (ERC-20)            |
| **Max Supply** | 8,000,000,000 EVOLVE             |
| **Decimals**   | 18                               |
| **Network**    | EVM-compatible (Solidity 0.8.24) |

## Earning EVOLVE

The only way to earn EVOLVE is through the **Emoji Gift Economy** (see below). There is no daily reward, match reward, or verification reward.

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

## Supply Distribution (Proposed)

| Allocation               | % of Max | Amount      |
| ------------------------ | -------- | ----------- |
| Evolve2Earn rewards pool | 30%      | 2.4B EVOLVE |
| Team & operations        | 20%      | 1.6B EVOLVE |
| Community & marketing    | 20%      | 1.6B EVOLVE |
| Liquidity & partnerships | 15%      | 1.2B EVOLVE |
| Governance treasury      | 10%      | 800M EVOLVE |
| Advisors                 | 5%       | 400M EVOLVE |

**Pre-mint 5.6B + on-demand headroom 2.4B.** The 8B supply splits into **pre-mint 5.6B** (Team 1.6B + Community 1.6B + Liquidity 1.2B + Governance 800M + Advisors 400M) and **on-demand headroom 2.4B** (Evolve2Earn seed 400M + ~2B reserve for RewardMinter rewards/faucet), so mintReward/mintFaucet always have headroom under the 8B cap. Pre-mint 5.6B is governance policy, not a code invariant — the 48h TimelockController holds MINTER_ROLE and can technically mint into headroom.

_Historical Sepolia testnet deployment (2026-09-05) minted to the legacy reward pool and escrow vault; superseded by the 8B model above. No daily/match/verification rewards — emoji gift economy only._

## Economic Model

```
User Activity → Earn EVOLVE via gifts → Revenue to Owners → Incentive to Hold
     ↓                                                         ↑
  Reputation ←── Voting ←── EvolveFund deposit ←───────────────┘
```

The flywheel: active users earn EVOLVE → spend on gifts → gift owners earn passive EVOLVE → incentive to stay active and earn more → higher engagement → more EVOLVE demand.

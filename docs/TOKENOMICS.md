# EVOLVE Tokenomics

## Token Details

| Property       | Value                            |
| -------------- | -------------------------------- |
| **Contract**   | `EVOLVE.sol` (ERC-20)            |
| **Max Supply** | 100,000,000 EVOLVE               |
| **Decimals**   | 18                               |
| **Network**    | EVM-compatible (Solidity 0.8.24) |

## Earning EVOLVE

Users earn EVOLVE through on-chain activity:

| Action               | Reward     | Contract                         |
| -------------------- | ---------- | -------------------------------- |
| Profile verification | 100 EVOLVE | `Evolve2Earn.verifyProfile()`    |
| Match confirmation   | 50 EVOLVE  | `Evolve2Earn.claimMatchReward()` |
| Daily active use     | 10 EVOLVE  | `Evolve2Earn.claimDailyReward()` |

Initial supply: 1,000,000 EVOLVE minted to `Evolve2Earn` contract at deploy for rewards.

## Spending EVOLVE

| Action                          | Cost     | Contract                     |
| ------------------------------- | -------- | ---------------------------- |
| Emoji gift (Rose, Cactus, etc.) | 1 EVOLVE | `Evolve2Earn.buyEmojiGift()` |
| Premium features                | TBD      | Future                       |

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

## Reputation ↔ Token Connection

| Action         | Reputation Effect                                      |
| -------------- | ------------------------------------------------------ |
| Receive a vote | +1 receivedVote → `getReputationScore()` maps to 0–100 |
| Base score     | Set by owner (admin), range 0–100                      |
| Total score    | `baseScore + reputationScore` (capped at 100)          |
| Vote limit     | 8 votes per user (max)                                 |

Higher reputation → better profile visibility (future feature).

## Governance

EVOLVE holders govern via `Governance.sol`:

1. **Proposal creation**: any user creates a proposal with description and calldata
2. **Voting period**: tokens determine voting weight (1 EVOLVE = 1 vote)
3. **Execution**: approved proposals execute after timelock

## Supply Distribution (Proposed)

| Allocation               | % of Max | Amount     |
| ------------------------ | -------- | ---------- |
| Evolve2Earn rewards pool | 30%      | 30M EVOLVE |
| Team & operations        | 20%      | 20M EVOLVE |
| Community & marketing    | 20%      | 20M EVOLVE |
| Liquidity & partnerships | 15%      | 15M EVOLVE |
| Governance treasury      | 10%      | 10M EVOLVE |
| Advisors                 | 5%       | 5M EVOLVE  |

_Current implementation: initial 1M minted to Evolve2Earn. Full distribution requires upgrade or governance vote._

## Economic Model

```
User Activity → Earn EVOLVE → Buy Gifts → Revenue to Owners → Incentive to Hold
     ↓                                                         ↑
  Reputation ◄──────── Voting ◄──────── EVOLVE stake ◄──────────┘
```

The flywheel: active users earn EVOLVE → spend on gifts → gift owners earn passive EVOLVE → incentive to stay active and earn more → higher engagement → more EVOLVE demand.

# EVOLVE — RewardVault & Trustless Emission (Future Implementation Plan)

> **Status: PLANNED — NOT IMPLEMENTED.**
> This is a design record for the near future. Do **not** rush it: the contracts must be
> provably bug-free and the corresponding app functionality must be tested end-to-end
> (the flow is still raw and complex) before anything here is deployed.

## 1. Why

The project owner requires that the un-circulated supply can **never** be withdrawn or
dumped by any admin — including the founder. Today that guarantee does **not** hold:

| Contract | Function | Problem |
| --- | --- | --- |
| `Evolve2Earn.sol` | `transferToNewPool(newPool, amount)` (`onlyOwner`) | Owner can move **any** amount to **any** address — a full drain. |
| `Evolve2Earn.sol` | `migrateFromOldPool(oldPool, amount)` (`onlyOwner`) | Same class of arbitrary token pull. |
| `Evolve2Earn.sol` | `pause()` / `unpause()` (`onlyOwner`) | Owner can freeze emission. |
| `EVOLVE.sol` | `DEFAULT_ADMIN_ROLE` / `MINTER_ROLE` | Granted to the deployer EOA in the constructor; must end up **only** on the Timelock (deployer renounces). |
| `RewardMinter.sol` | `mintReward` / `mintFaucet` | Mints **new** tokens; once the 8B cap is reached these revert (`MaxSupplyExceeded`). Must be repointed at the vault instead of minting. |
| `Governance.sol` | `queueProposal` / `executeProposal` (`onlyOwner`) | Owner-gated and only flip a bool — they execute **no calldata** and cannot change any contract. Also: no `for > against` check, odd quorum math. |
| `TimelockController` | `PROPOSER_ROLE` | Held by the Safe multisig → the multisig could unilaterally propose rule changes, bypassing a vote. |

## 2. Approved decisions

1. **Architecture option (a):** pre-minted reserve held by a new **non-drainable `RewardVault`**. (Option (b) "mint on demand" is rejected: it is weaker — any `MINTER_ROLE` holder could mint to any address — and still requires redeploying `EVOLVE`, because `totalMinted` is not reduced by burn.)
2. **Governance is the sole `PROPOSER_ROLE`** on the timelock that administers the vault (the Safe multisig keeps only executor/canceller, or a separate ops-timelock is used).
3. **Allocation of the 8,000,000,000 supply:**

| Purpose | EVOLVE | Share |
| --- | ---: | ---: |
| Founder (salary / reward) | 8,000,000 | 0.1% |
| DEX reserve (future) | 4,000,000 | 0.05% |
| Public sale (sold by the app, **$0.8 / EVOLVE**, paid in any supported token; proceeds fund development) | 5,000,000 | 0.0625% |
| **Explicitly allocated** | **17,000,000** | **0.2125%** |
| Reward reserve — labs, lab patients, mothers, fathers (emitted gradually) | 7,983,000,000 | 99.7875% |

4. **No developer allocation** (0). Founder = 8M (0.1%).

## 3. Target architecture

### 3.1 `RewardVault.sol` (new, immutable — no proxy)
- Holds the ~7,983,000,000 reserve.
- Release functions only, each with a **fixed amount + per-epoch cap**:
  `releaseLabReward(lab, patient)` (1 + 1 EVOLVE), `releaseConceptionReward(...)`,
  `releaseMode3Father(...)`, `releaseFaucet(to)` (50 EVOLVE).
- **No** `transfer` / `withdraw` / `sweep` / `approve` / `pause` / upgrade.
- `AccessControl`: `DEFAULT_ADMIN_ROLE` = Timelock; `EMITTER_ROLE` = whitelisted reward-flow
  contracts only; `setRate` bounded by **immutable `MAX_*`**; releases may only target
  **whitelisted "sink"** contracts (beneficiary derivation lives in the sink).
- Same lazy-reset daily-window pattern as `RewardMinter`.

### 3.2 `Governance.sol` (rewrite)
- `createProposal(description, target, value, data)` commits the calldata.
- `queueProposal` / `executeProposal`: **remove `onlyOwner`** (permissionless once the vote passes).
- On execution: `timelock.schedule(target, value, data, predecessor, salt, delay)`.
- Add the missing `for > against` check and fix the quorum computation.

### 3.3 Role graph
- `TimelockController`: `admin = 0` (self-administered); `PROPOSER_ROLE` = **Governance only**;
  `EXECUTOR_ROLE` = Governance and/or the Safe multisig (mechanical execution only).
- No EOA holds any role on the vault or the timelock after migration.

### 3.4 Invariants (to be proven by tests)
1. No code path in `RewardVault` transfers tokens to an arbitrary address.
2. Every release is bounded by immutable per-epoch maxima.
3. The only admin is the Timelock; the Timelock can only be proposed to by Governance.
4. Releases route only to whitelisted sinks.
5. Even a malicious 51% governance vote cannot drain to an EOA — at most it accelerates
   emission within bounds toward permitted reward flows.

## 4. Migration plan (when the time comes)

1. Deploy `RewardVault` (admin = Timelock).
2. Deploy `Evolve2EarnV2` (no `transferToNewPool` / `migrateFromOldPool`; gifts + marketplace only).
3. Rewrite + deploy `Governance`.
4. Split 17M: 8M founder vesting · 4M `LiquidityLocker` · 5M `Sale` contract; move **7,983,000,000 → `RewardVault`**.
5. Neutralize the old `Evolve2Earn` (balance ≈ 0; drain functions gone via V2 redeploy — a deployed
   contract's functions cannot be removed, so it must be replaced).
6. Roles: deployer renounces; all ownerships → Timelock; Timelock `admin = 0`, proposer = Governance.
7. On-chain verification + invariant tests.

## 5. Required tests (before deploy)

- `RewardVault`: no drain selectors; rate cap enforced; `EMITTER_ROLE` gate; sink whitelist;
  `setRate` bounded by `MAX_*`; admin is the Timelock (EOA calls revert); not upgradeable.
- `Governance`: a passed vote schedules a timelock op; a failed vote cannot; `queue`/`execute`
  callable without an owner; `for > against` + quorum enforced.
- `EVOLVEAdmin`: after migration the deployer holds no roles.
- Migration: buckets equal 8M / 4M / 5M / 7,983,000,000; old `Evolve2Earn` balance ≈ 0.

## 6. Preconditions (do not skip)

- **Contract correctness first:** full test suite + independent review (Oracle / audit) of the
  new contracts before any deploy.
- **App functionality must be tested end-to-end** across this flow — the reward/sale/vault path is
  raw and complex and must "work like clockwork" first.

## 7. Related

- `docs/TOKENOMICS.md`, `AGENTS.md` §7 — token allocation (to be reconciled with §2 above).
- `packages/contracts/src/Evolve2Earn.sol`, `Governance.sol`, `RewardMinter.sol`, `EVOLVE.sol`,
  `ignition/modules/index.js`, `ignition/modules/TimelockController.js`.
- `packages/contracts/src/VestingWalletCliff.sol` — stale `TEAM_ALLOCATION = 1.6B`; must be updated
  to the new founder (8M) / developers (0) model.

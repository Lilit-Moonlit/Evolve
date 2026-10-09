# Shielded Mode 2/3 Stakes — Design Investigation

Status: investigation only, 2026-10-09. This document examines whether the Mode 2
(pregnancy-bond) and Mode 3 (cryptic-choice) at-risk stakes can be routed through
Railgun shielded notes. It contains **no implementation** and defines the go/no-go
criteria that gate a future, separate plan. Per change control (see
`.omo/plans/evolve-privacy-roadmap.md`), any implementation requires a new plan and
explicit user approval.

## Context

Today the conception stakes are public EVM balances:

- `EvolveFund.sol` holds each man's stake in public mappings — `stakes` (Conception)
  and `postCopulationStakes` (PostCopulation) — keyed by his EOA, with a
  `lockedByBond` flag and `bondWithdraw`/`transferStake` transfer primitives.
- `BondManager.sol` reads those balances directly: `_requireActiveFund` checks
  `getStake`/`getPostCopulationStake`; on confirmation it calls
  `EvolveFund.lockStake`; on resolution it calls `EvolveFund.bondWithdraw` (Mode 2:
  whole stake to the woman on confirmed paternity; Mode 3: 90/10 split to the
  woman/chosen father).

The question: can a man keep his stake in a **Railgun shielded (0zk) wallet** so the
amount and the participant identities are hidden from chain observers, while the
contract still enforces the lock and the reward split?

## Options

### Option A — Escrow-held 0zk with view-keys

The man shields his stake into Railgun and grants a **view-key** to a settlement
agent so the eventual payout can be audited.

- **How it would work**: the stake value sits in the Railgun pool; a view-only wallet
  proves the shielded balance exists; a settlement agent (app or oracle) releases the
  note to the woman/father on resolution.
- **Why it fails today**: the `BondManager`/`EvolveFund` contracts cannot read a
  per-user shielded balance — Railgun only exposes the aggregate pool. `lockStake`
  and `bondWithdraw` operate on public ERC-20 balances, so they cannot touch a
  shielded note. A settlement agent that can release notes is itself a trusted
  counterparty that can see the link between the man and his stake, which re-introduces
  the exact identity exposure we want to remove.

### Option B — App-mediated claims (synthetic public stake)

Keep the public `EvolveFund` contract unchanged; the app (or an oracle) attests "user
X holds ≥N shielded EVOLVE" and credits a synthetic public stake that `BondManager`
can lock.

- **How it would work**: minimal contract change — a trusted attestor writes the
  synthetic stake into `EvolveFund`.
- **Why it fails today**: the attestor is a central trust point that sees the mapping
  between the shielded holder and the stake; anonymity becomes "anonymity except from
  the app", which is weaker than the two-wallet model's goal. There is no audited,
  decentralized attestation primitive in the current Railgun contract set for
  arbitrary consumer contracts.

### Option C — Aztec-native bonds (private contracts)

Implement the bond (stake → join → confirm → choose → settle) as Aztec **private
contracts** in Noir, where the stake, choice, and settlement are private notes with
nullifiers.

- **How it would work**: the whole flow moves off the public EVM path; stake, join,
  confirm, choose and settle are private state transitions.
- **Status**: Aztec is alpha (state is not migrated between releases; the Beta bar —
  10+ TPS sustained, 99.9% uptime, 3 months without a critical bounty finding — is
  not yet met). This is the Phase-3/4 direction documented in
  `docs/AZTEC-PROTOTYPE.md`, and it is explicitly out of scope for the current plan.

## Blockers

1. **Smart contracts cannot hold or spend shielded funds.** Railgun shielded balances
   live in the Railgun note pool; an EVM contract sees only the aggregate pool, never a
   per-user shielded balance. `EvolveFund`/`BondManager` are balance-based and cannot
   lock or transfer notes.
2. **No audited "hold/escrow a shielded balance for N days" primitive** is exposed by
   the live Railgun contracts for third-party consumer contracts. Locking semantics
   (`lockedByBond`, time-locked, non-transferable) do not map to bearer notes without a
   nullifier-management scheme that Railgun does not currently offer to non-Railgun
   contracts.
3. **Trusted-attestor reintroduction.** Any Option A/B settlement requires an app or
   oracle that can observe the holder→stake link, which defeats the privacy goal unless
   a decentralized attestation exists (it does not today).
4. **Reward-split correctness.** Mode 3 splits stakes 90/10 and pays the father 2× his
   deposit + 1 EVOLVE per other participant from the `Evolve2Earn` pool. Reproducing
   these reads/transfers on shielded notes requires new proving circuits, not a wrapper.

## Costs (gas / UX)

- Each shield, lock, settle, and unshield step adds a client-side ZK proof
  (wasm/snarkjs) plus L2 gas, versus the current single `deposit` transaction. The
  lock→settle cycle becomes a multi-step, proof-heavy flow with materially higher
  friction.
- Shielded-note sync requires chain-history scanning; first sync is slow on low-end
  devices (same caveat as `docs/RAILGUN-INTEGRATION.md` §Risks).
- Any attestation-based approach adds an oracle trust assumption and its own
  liveness/cost profile.

## Criteria (go / no-go)

Implementation is **NO-GO within the current plan**. A future plan may proceed only
when ALL of the following are green:

1. **Wrapper stability clock**: the `railgun.ts` wrapper + `PrivateWallet` UI (plan
   todos 8/10) have run **≥ 1 month without wrapper regressions** in production-like
   usage.
2. **Demand signal**: measurable user demand for deeper privacy in stakes
   (complaints about stake/identity exposure, or direct requests) — the same evidence
   column as the Aztec Phase-4 gate.
3. **Primitive availability**: either (a) Railgun ships an audited
   hold/escrow-shielded-balance primitive usable by third-party contracts, or (b) an
   audited 0zk escrow with view-keys that `BondManager` can settle against **without**
   a trusted app oracle.
4. **New plan + explicit approval**: a separate work plan under the change-control
   protocol (`.omo/plans/evolve-privacy-roadmap.md`), with its own Must-NOT-Have list.

## Recommendation

**Defer implementation to a separate future plan.** The public-stake contracts
(`EvolveFund`, `BondManager`) are correct and audited-in-scope today; the privacy
value of shielded stakes is not yet reachable without either a new Railgun primitive
or the Aztec-native rewrite (Option C), both of which are gated behind the criteria
above and the Aztec Beta bar. This document is the record of the investigation and the
gate — nothing in it authorizes implementation.

Sources: `packages/contracts/src/BondManager.sol`,
`packages/contracts/src/EvolveFund.sol`, `docs/RAILGUN-INTEGRATION.md`,
`docs/AZTEC-PROTOTYPE.md`, `.omo/plans/evolve-privacy-roadmap.md`.

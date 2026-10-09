# Aztec Prototype (Phase 3) — Findings

Status: **COMPLETE (local, dockerless)** — 2026-10-09. The private-gift and private-bond
Noir prototypes compile and pass `aztec-nargo test` headlessly (no Docker sandbox).

## Toolchain (pinned)

- **Aztec release `v5.2.0`**, installed via the **native, dockerless** `aztec-up`:
  `VERSION=5.2.0 bash -i <(curl -sL https://install.aztec.network/5.2.0)` (WSL2 Ubuntu-24.04).
  Docker is only required for node infrastructure (`aztec-sandbox`), **not** for
  compiling/testing contracts.
- **Noir compiler `1.0.0-beta.25`** (noirc `75061fab15986eedee4e7d9104ff87dd9fa4ca10`),
  exposed as `aztec-nargo`.
- Live in `packages/contracts/aztec-prototype/` (README.md + two crates).

## What was built

Two **pure-Noir** crates model the ZK primitive Aztec private state is built on
(note = value + owner + blinding secret → commitment; spending reveals a nullifier),
using `std::hash::pedersen_hash` for the stable std API (production Aztec uses poseidon2
with the same commitment/nullifier structure):

1. **`private_gift`** — private transfer: `transfer(sender_note, amount, recipient, secret)`
   nullifies the sender's note and mints a fresh commitment for the recipient.
   `aztec-nargo test` → **5/5 passed** (deterministic commitment; nullifier ≠ commitment;
   transfer produces the expected recipient commitment; recipient output unlinked from the
   spent note; double-spend yields an identical nullifier).
2. **`private_bond`** — Mode-3 settlement skeleton: `settle_stake(stake_note, woman, father, …)`
   nullifies the stake note once and splits 90% → woman / 10% → father as two fresh notes.
   `aztec-nargo test` → **3/3 passed** (90/10 split; nullifies the stake; woman/father
   commitments distinct and unlinked).

## Tooling friction (real, encountered)

- The full Aztec.nr `TestEnvironment` path (`aztec test`) requires the Node-based `aztec`
  CLI + `nc` to spawn a local TXE server; it did not emit output cleanly in this headless
  WSL environment. Pivot (recorded as plan Amendment 2026-10-09): express the same
  commitment/nullifier primitives in **pure Noir** and verify with `aztec-nargo test`,
  which is deterministic and needs no sandbox/chain.
- Noir `Field` values are not orderable — `<`/`>`/`<=` require an integer cast
  (`value as u64`). Values in the prototypes are assumed < 2^64 (true for EVOLVE amounts).
- Noir `0x…` integer literals must be valid hex (`0xman` is a compile error); use numeric
  placeholders in examples.

## Gaps (documented, not silently assumed)

1. **Timing logic in private context** — the Mode-3 48h session window and 14-day settle
   delay are enforced by a _public_ contract (`BondManager.sol`) reading block timestamps.
   A pure-Noir private circuit has no clock oracle, so timing is deliberately out of scope
   here and must stay in public state (or an Aztec time oracle).
2. **Nullifier management** — only nullifier _derivation_ is modeled. The on-chain
   nullifier-set membership check (the thing that actually rejects a double-spend) is
   Aztec's tree machinery and is not reproducible in a headless pure-Noir test.
3. **Fee Juice** — Aztec's fee abstraction was **not exercised** (no on-chain execution in
   a headless pure-Noir run). Remains an open item for any future Aztec.nr sandbox pass.
4. **Encrypted memo** — the plan's "(optional) encrypted memo" was not implemented; the
   note's blinding `secret` demonstrates the hiding primitive, memo encryption is deferred.

## Phase-4 gate checklist (the ONLY accepted trigger for any migration)

Both columns must be green before any migration plan. A Phase-4 migration **cannot** start
from inside this plan (change control; requires a new plan + explicit user approval).

### Column A — Aztec Beta bar

- [ ] 10+ TPS sustained
- [ ] 99.9% uptime
- [ ] 3 months without a critical bounty finding
- [ ] State migration across releases (no data loss between Aztec releases)

### Column B — product evidence

- [ ] ≥N user complaints about gift privacy (N to be set at the time of evaluation)
- [ ] Direct requests for deeper privacy (beyond the current voucher + Railgun phases)

Status: **OPEN** — Aztec is alpha (V5 live 2026-07-21; V6 expected later 2026, state not
migrated between releases), so no criteria are currently met.

## Conclusion

The concepts behind sender-private gifts and private conception bonds are expressible as
note/commitment/nullifier circuits and verified with passing tests under the pinned
dockerless toolchain. The strategic decision remains the same as the plan's TL;DR: **do not
build on Aztec yet** — it is an alpha research option, gated behind the checklist above.

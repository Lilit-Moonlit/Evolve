# Aztec/Noir Prototype (Phase 3)

Status: local, dockerless. This directory holds two Noir prototypes for the privacy
roadmap's Phase-3 research track (plan todos 5 + 11). They model the **ZK primitives**
behind private gifts and private conception bonds using note commitments + nullifiers.
They are deliberately NOT wired into `npm test`/turbo and are NOT deployed anywhere.

## Pinned toolchain (installed 2026-10-09, WSL2 Ubuntu-24.04, dockerless)

| Component     | Version                                                            | Install command                                                         |
| ------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| Aztec release | `v5.2.0`                                                           | `VERSION=5.2.0 bash -i <(curl -sL https://install.aztec.network/5.2.0)` |
| Noir compiler | `1.0.0-beta.25` (noirc `75061fab15986eedee4e7d9104ff87dd9fa4ca10`) | bundled via `aztec-up` (as `aztec-nargo`)                               |
| Node.js       | installed by aztec-up (20.x)                                       | —                                                                       |

- Installer is **native/dockerless** (`aztec-up`). Docker is only required to run node
  infrastructure (the `aztec-sandbox`), which is NOT used here — the prototypes are
  compiled and unit-tested with `aztec-nargo test` (no sandbox, no chain).
- Version pairing: Aztec pairs compiler + libraries by the single release tag `v5.2.0`;
  there is no separately-pinned Noir version beyond `1.0.0-beta.25`.

## Layout

```
aztec-prototype/
  private_gift/   # private transfer via note commitment + nullifier (todo 5)
  private_bond/   # stake → private choice → 90/10 settlement skeleton (todo 11)
```

## Run

```bash
# from this directory (inside WSL2), with aztec-nargo on PATH:
aztec-nargo test --package private_gift
aztec-nargo test --package private_bond
# or run both crates directly:
(cd private_gift && aztec-nargo test)
(cd private_bond && aztec-nargo test)
```

## Notes

- These are **pure-Noir** models of the Aztec private-state primitives (note = value +
  owner + blinding secret → commitment; spending reveals a nullifier). The full
  Aztec.nr `TestEnvironment`/sandbox path was unavailable (Docker absent; see
  `docs/AZTEC-PROTOTYPE.md` and the plan Amendment 2026-10-09), so the concepts are
  expressed with `std::hash::pedersen_hash` directly — the same commitment/nullifier
  structure Aztec's poseidon2 note hashing uses, with the stable std API for a
  headless `aztec-nargo test` run.
- Gaps documented in `docs/AZTEC-PROTOTYPE.md`: timing logic in private context, nullifier
  management (the contracts below model nullifier _derivation_, not the on-chain
  nullifier-set membership check Aztec performs).

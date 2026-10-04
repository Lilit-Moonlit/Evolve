# Railgun Integration Spike

Status: pinned 2026-10-04. Source of truth for the Phase-2 Railgun shielded-wallet work
(plan todos 8, 10, 12). Primary sources only; each claim carries a URL.

## Addresses

Railgun smart contracts are live on **Ethereum, Arbitrum, Polygon, BSC** (a Base
deployment was in governance as of 2026-08-24 — not yet confirmed live).

- Canonical per-chain addresses are NOT hardcoded in this repo — they are resolved
  at integration time from the official `@railgun-community/deployments` package
  (`chainConfig.ethereum` / `chainConfig[arbitrum]` / `chainConfig[polygon]` /
  `chainConfig[bsc]`).
  Source: https://www.npmjs.com/package/@railgun-community/deployments (v0.4.12, updated 2026-07-23)
  and https://github.com/Railgun-Community/deployments
- Overview of supported chains: https://docs.railgun.org/wiki (RAILGUN runs on
  "Ethereum, BSC, Polygon, and Arbitrum").

## SDK versions pinned

Stable install set per the official getting-started guide
(https://docs.railgun.org/developer-guide/wallet/getting-started):

```
npm install @railgun-community/wallet@10.4.0 @railgun-community/shared-models@7.6.1 ethers@6.13.1 snarkjs @types/snarkjs
```

Supporting packages (pin at integration, record exact in package.json):

| Package                            | Version                | Role                                | Source                                                          |
| ---------------------------------- | ---------------------- | ----------------------------------- | --------------------------------------------------------------- |
| `@railgun-community/wallet`        | 10.4.0 (latest 10.8.4) | wallet SDK (browser/mobile/node)    | https://registry.npmjs.org/@railgun-community/wallet            |
| `@railgun-community/engine`        | 9.5.4                  | low-level engine (`RailgunEngine`)  | https://www.npmjs.com/package/@railgun-community/engine         |
| `@railgun-community/shared-models` | 7.6.1                  | shared types                        | https://docs.railgun.org/developer-guide/wallet/getting-started |
| `@railgun-community/deployments`   | 0.4.12                 | per-chain contract addresses + ABIs | https://www.npmjs.com/package/@railgun-community/deployments    |

Note: the wallet SDK peer-depends on `ethers@^6.6.0` (the repo already uses viem;
viem is used for the rest of the app, the Railgun SDK itself is ethers-based — the
wrapper lib must bridge, not mix).

## Test strategy (DECISION)

- **Integration chain = Arbitrum** (when a mainnet EVOLVE deploy happens). Rationale:
  Railgun is live there, L2 fees are low, and the tokenomics already names Arbitrum
  as primary. Source: https://docs.railgun.org/wiki
- **Sepolia is NOT supported** by mainnet Railgun. Therefore the wrapper is unit-tested
  against a mocked engine interface (DI, per `apps/web/src/lib/pdf-text.ts`), and any
  end-to-end shielding test runs against a **local Hardhat fork of Arbitrum** with live
  Railgun contracts, OR against Railgun's own hardhat deploy
  (https://github.com/Railgun-Community/engine — `npm run deploy` deploys contracts
  deterministically to a hardhat node for tests).
- Arbitrary ERC-20 shielding is supported; the token does not need an allowlist
  entry for basic shield/unshield. Confirm against the current `@railgun-community/deployments`
  token-vault config at integration time.

## Kohaku status

- The Ethereum Foundation's Kohaku toolkit integrated Railgun as its privacy backend
  (announced 2025-10); the first public SDK release `@kohaku-eth/railgun` v0.0.1-alpha
  shipped 2026-05-25. Its repository explicitly warns "UNAUDITED / NOT READY FOR
  PRODUCTION USE".
- DECISION: **tracked, NOT used** in production paths. The production integration uses
  the audited live Railgun contracts + the official `@railgun-community/*` SDKs above.
  Source: https://github.com/kohaku-eth (Kohaku) — see the repo's own "UNAUDITED" notice.

## Fees

- On-chain cost = the underlying L2 gas (Arbitrum) plus a client-side ZK proving step
  (the engine generates proofs locally via wasm/snarkjs — no per-proof chain fee beyond
  gas). No Railgun protocol tax.
- Users pay their own L2 gas (or the existing ERC-4337 paymaster abstraction covers it
  where wired); the app pays nothing per transaction.
- Source (model): https://docs.railgun.org/wiki (privacy achieved "without the need to
  move to a separate chain" — interactions cost normal chain gas).

## Risks

1. **Client-side proving burden** — the engine loads a wasm prover + snarkjs; first-run
   artifact download and proof generation are slow on low-end devices. Mitigation: lazy
   DI loaders (pdf-text pattern), feature-flag off by default, browser-only.
2. **Reliance on third-party live contracts** — Railgun contracts are audited and live
   since 2021, but they are not ours; a protocol-level incident would affect shielded
   balances. Mitigation: only shield what users explicitly opt into; never all funds.
3. **Compliance** — Railgun's built-in "Private Proofs of Innocence" (prove funds are
   absent from a maintained bad-transaction list without revealing identity) is the key
   regulatory differentiator vs Tornado Cash. Keep it in the flow; do not bypass.
   Source: https://docs.railgun.org/wiki
4. **Indexer/scan latency** — shielded-note sync requires scanning chain history; slow
   first sync. Mitigation: engine's `fullRescanUTXOMerkletreesAndWallets` + view-only
   wallets for background scanning.

[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)

# EVOLVE

**Dating, conception and health verification — private by default, verified where it matters.**

EVOLVE is an open-source, decentralized platform for verifiable intimate connections: dating, conception, and anonymous STD/DNA compatibility. You sign in with your own crypto wallet (Sign-In with Ethereum) — no phone number, no email, no KYC — and you can recover your account through an on-chain DNA commitment. Health data stays yours: lab results are parsed automatically, individual pathogen statuses are **never** shown to anyone, and matching relies only on anonymous compatibility verdicts (Safe / Compatible / Caution / Risk). Chat runs peer-to-peer over libp2p and Nostr, with an HTTP fallback for convenience, and the app ships with a lightweight "Safety Mode" public facade plus a standalone Companion Mode for STD test evaluation.

> **Status: early-stage alpha.** EVOLVE is under active development and is not a finished product.
> Smart contracts are deployed **only on the Ethereum Sepolia testnet**.
> There is **no mainnet deployment, no DEX, no liquidity, and no public token sale** — and none is promised.
> Features may change or break at any time. Nothing here is financial advice or an investment offer.

## What & Why

Traditional dating platforms ask you to hand over your phone number, email, photos and intimate health details to a central database. EVOLVE starts from the opposite premise: privacy by default, self-custody, and no central point of failure. Core values:

- **Privacy by default** — health data is never exposed; only anonymous verdicts.
- **Ban resistance** — P2P-first messaging, decentralized storage (IPFS / Arweave), multi-network design, no hardcoded domains.
- **Self-custodial identity** — your wallet is your login; DNA-based recovery instead of email/phone.
- **No KYC gate** — no government ID, phone or email required to use the platform.

Read the full rationale in [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md).

## Key Features

### Identity & Privacy

- **SIWE wallet login** (MetaMask and other EVM wallets) — the censorship-resistant escape hatch.
- **DNA account recovery** — your DNA test result is hashed (SHA-256, committed on-chain as `bytes32`) and can restore access without phone or email.
- **Account Abstraction (ERC-4337)** — smart accounts and a paymaster for gasless onboarding; SIWE always remains available.

### Anonymous Health Compatibility

- Upload STD test results as raw text or PDF (text-layer extraction with OCR fallback for scanned pages).
- The parser recognizes 8 pathogens: HIV-1/2, Syphilis, Chlamydia, Gonorrhea, HSV-1, HSV-2, Hepatitis B, Hepatitis C (English, Ukrainian and Russian report formats).
- **Individual pathogen status is never displayed to other users.** Profiles only show an anonymous verdict: **Safe / Compatible / Caution / Risk**.
- On-chain DNA verification records (`DNAVerification.sol`) power recovery and verification flows.

### Profiles, Search & Communication

- Search filters: "What are you looking for" (dating / conception / polyandrous conception / STD testing), "Who are you looking for" (men, women, couples), cascading country → city selects, "can travel to your country" with per-country lists, skin colour, testing preference, STD-compatible-only.
- Onboarding wizard: age (hideable), languages, bio, photo.
- **Photo privacy**: photos are blurred by default; the owner grants 15-second or permanent views, proactively or on request. Viewing is free.
- **P2P chat** over libp2p (gossipsub) + Nostr, with an HTTP API fallback.

### Conception Modes

- **Mode 2 — Pregnancy Bond**: a woman creates a bond, a man stakes EVOLVE (≥ 100 on the current testnet build), both confirm; after a confirmed pregnancy and paternity, the stake transfers to the woman.
- **Mode 3 — Cryptic Choice**: a woman opens a 48-hour session, men join by staking; she chooses the father — his stake is returned, others split 90% to her / 10% to the chosen father.

### Labs & Verification

- **Laboratory partner flow**: labs register as partners, verify patients via QR code and face match, and attach STD reports (PDF/text with OCR extraction).
- **Companion Mode**: standalone flow to evaluate STD test results without joining the dating platform.
- **Safety Mode** (`VITE_PRODUCT_MODE=safety`): a limited public facade (STD status, public profile links, compatibility checks) that keeps working even if dating/conception features are restricted in a jurisdiction or app store.

### EVOLVE Token (testnet only)

- ERC-20, max supply 8,000,000,000 EVOLVE, admin actions gated by a 48-hour TimelockController.
- **Emoji gift economy**: a gift costs 1 EVOLVE, which is split proportionally among existing gift owners — a perpetual revenue model for holders; gifts are transferable.
- **EvolveFund**: male staking (min 15 EVOLVE, 30-day lock) that counts toward governance weight; women use their wallet balance.
- **Verification rewards**: 1 EVOLVE to the verified user and 1 EVOLVE to the confirming lab upon STD/DNA verification (plus a rate-limited test faucet).
- Governance vote weight combines recursive reputation (8 votes, depth 3), children/fatherhood share, and staked or held EVOLVE.
- **LayerZero OFT** integration for future multichain EVOLVE transfers (dependencies in place; nothing deployed beyond Sepolia yet).

### Platform

- Web app (PWA-installable) and Expo/React Native mobile app.
- Interface translated into **34 languages**.
- Multi-network ready: 18 EVM network configurations (Arbitrum and Avalanche are the planned primary L2s — **not yet deployed**).

## Architecture & Tech Stack

Monorepo managed with npm workspaces + Turborepo:

```
apps/
  web/          # Vite + React + TypeScript (main web app, i18next, Prisma)
  mobile/       # Expo + React Native
packages/
  config/       # Feature flags & dynamic remote configuration
  contracts/    # Solidity 0.8.24, Hardhat, Ignition, OpenZeppelin, LayerZero
  core/         # Shared types, utilities, middleware, web3
  matching/     # Matching algorithms, filters, ranking
  p2p/          # libp2p (gossipsub) + Nostr networking
  storage/      # IPFS, Arweave, Lit Protocol
docs/           # Architecture, tokenomics, roadmap, FAQ
```

Key smart contracts: `EVOLVE.sol` (ERC-20), `ProfileNFT.sol` (ERC-721), `TrustScore.sol`, `Voting.sol`, `Evolve2Earn.sol` (emoji gifts + rewards), `Governance.sol`, `BondManager.sol` (Modes 2 & 3), `EvolveFund.sol`, `VerificationRegistry.sol`, `DNAVerification.sol`, ERC-4337 `SmartAccountFactory` + `Paymaster`, and an OpenZeppelin `TimelockController`.

Details: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md)

## Roadmap

In progress: production-readiness of the web app. Planned: on-chain lab registry and test certification, real mail-provider adapter for lab report ingestion, on-chain verified attestations on profiles, token vesting update for founder/developer allocations, DEX liquidity provisioning (currently blocked — requires mainnet token deployments). Multi-network expansion (Arbitrum, Avalanche and other EVM chains) follows after testnet hardening.

Full list: [docs/ROADMAP.md](docs/ROADMAP.md).

## Getting Started (Developers)

Requirements: **Node.js 20+** and npm 10.x.

```bash
# Clone and install all workspaces
git clone https://github.com/Lilit-Moonlit/Evolve.git
cd Evolve
npm install

# Web app (Vite dev server on http://localhost:3000)
cd apps/web
npm run dev
npm test                # vitest suite

# Smart contracts
cd packages/contracts
npm run compile         # hardhat compile
npm test                # hardhat test suite
npm run deploy:local    # deploy all contracts to an in-process Hardhat network
```

## Contributing

Contributions are welcome — code, bug reports, feature suggestions and proposals. Please read [CONTRIBUTING.md](CONTRIBUTING.md) and our [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before you start.

## Support the Project

If you find EVOLVE useful, you can support development with a donation — details in [DONATE.md](DONATE.md). Prefer a web page? Use the multilingual donation page (34 languages): **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**.

**There is no token sale and there will be none.** EVOLVE tokens cannot be "invested in"; donations are gifts to support open-source development and do not entitle the donor to tokens, equity, returns or any financial claim.

## Repositories (Mirrors)

| Mirror   | URL                                        |
| -------- | ------------------------------------------ |
| GitHub   | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg | https://codeberg.org/limitafternoon/Evolve |
| GitLab   | https://gitlab.com/evolve-group3/evolve    |

## Documentation

- [What & Why](docs/WHAT-AND-WHY.md) — problem, vision, core values
- [How It Works](docs/HOW-IT-WORKS.md) — user flows, step by step
- [Architecture](docs/ARCHITECTURE.md) — monorepo, packages, data flows
- [Tokenomics](docs/TOKENOMICS.md) — token model and supply distribution
- [Roadmap](docs/ROADMAP.md) — milestones and current status
- [FAQ](docs/FAQ.md) — frequently asked questions
- [Wallet guide](docs/WALLETS.md) — how to create wallets and get donation addresses

## License

Licensed under the [MIT License](LICENSE).

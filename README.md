[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)

# EVOLVE

**Dating, conception and verified health — private by default, trusted where it counts.**

EVOLVE is an open-source, decentralized platform for people who are done handing their phone number, their face and their most intimate health data to somebody else's database. You sign in with your own crypto wallet — no phone, no email, no KYC — and you can get your account back through an on-chain DNA commitment. Your health data stays yours: test results are parsed automatically, individual pathogen statuses are **never** shown to anyone, and matching relies only on anonymous compatibility verdicts (Safe / Compatible / Caution / Risk). Chat runs peer-to-peer over libp2p and Nostr, with an HTTP fallback for convenience.

> **Status — the platform works today; mainnet and DEX are next.**
> Dating, conception, health verification, the laboratory flow, P2P chat, the EVOLVE token and governance are all up and running. Still ahead: a **mainnet deployment and DEX liquidity**, plus a **planned public sale** (see [The EVOLVE token](#the-evolve-token-testnet-only)).
> Smart contracts are deployed on the **Ethereum Sepolia testnet only**. Nothing here is financial advice or an investment offer.

> **Find EVOLVE useful? Support development — every donation goes to code, lab partnerships, hosting and translation → [DONATE.md](DONATE.md).**

## Nothing to fear

EVOLVE was built around the questions people actually ask before trusting a platform like this.

| The worry                                  | What EVOLVE already does about it                                                                                                                                          |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| "My health data will leak."                | Individual pathogen results are **never** shown to anyone — only an anonymous verdict: Safe / Compatible / Caution / Risk.                                                 |
| "My photos will end up somewhere."         | Photos are blurred by default. The owner grants a **15-second** or **permanent** view — on request or proactively. Viewing is free.                                        |
| "I'll have to hand over my ID or phone."   | Wallet login (SIWE). No phone, no email, no KYC. Recovery works through an on-chain DNA commitment.                                                                        |
| "He or she is lying about being healthy."  | Results are **lab-verified** (QR + face match), and the couple's tests are taken **at the meeting** — recent STD results matter, DNA does not age.                         |
| "Will someone take my money and vanish?"   | Conception runs on a real, at-risk stake: a man's deposit only moves when paternity is **confirmed**; otherwise it is simply returned to him.                              |
| "Is the token a pump-and-dump?"            | No sale is live today; the code is open (MIT); the un-circulated reserve is planned to be locked in a **non-drainable vault** that not even the founder can withdraw from. |
| "Can the platform be shut down or banned?" | Peer-to-peer messaging first, decentralized storage (IPFS / Arweave), 18 EVM network configs, and no hardcoded domain.                                                     |

## What & Why

Traditional dating apps ask you to trade your phone number, email, photos and intimate health details for a central database — and then to trust that database forever. EVOLVE starts from the opposite premise: **privacy by default, self-custody, and no single point of failure**.

- **Privacy by default** — health data is never exposed; only anonymous verdicts.
- **Ban resistance** — P2P-first messaging, decentralized storage, multi-network design, no hardcoded domains.
- **Self-custodial identity** — your wallet is your login; DNA-based recovery instead of email or phone.
- **No KYC gate** — no government ID, phone or email required to use the platform.

Read the full rationale in [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md).

## Health you can actually trust

- Upload an STD test as raw text or PDF (text-layer extraction, with an OCR fallback for scans).
- The parser knows 8 pathogens: HIV-1/2, Syphilis, Chlamydia, Gonorrhea, HSV-1, HSV-2, Hepatitis B, Hepatitis C — in English, Ukrainian and Russian report formats.
- **Individual pathogen status is never displayed to other users.** Profiles only ever show the anonymous verdict: **Safe / Compatible / Caution / Risk**.
- On-chain DNA records (`DNAVerification.sol`) power recovery and verification.

### Partner laboratories — proof, not promises

Walk into a partner lab and show your QR code. The lab scans it, confirms your identity with **face matching** (so nobody else can collect your result) and attaches the STD report — PDF, scan or text, even a poor OCR. The result is signed by a real laboratory, not by you, so others see a **verified fact** instead of your word. And every confirmed verification pays **1 EVOLVE to the patient and 1 EVOLVE to the laboratory** — both sides have a reason to be honest. Individual pathogens are still never shown to anyone.

## Finding someone

- Search filters: "What are you looking for" (dating / conception / polyandrous conception / STD testing), "Who are you looking for" (men, women, couples), cascading country → city selects, "can travel to your country" with per-country lists, skin colour, testing preference, STD-compatible-only.
- Onboarding wizard: age (hideable), languages, bio, photo.
- **P2P chat** over libp2p (gossipsub) + Nostr, with an HTTP API fallback.

## Conception

Two ways to plan a child, and both rest on the same idea: real intention is shown with a real stake in EVOLVE — never with promises. A man's commitment lives in his EvolveFund deposit (from 15 EVOLVE, locked for at least 30 days), and a woman can set her own minimum deposit for the men who reach her.

**Conception.** The woman leads: she invites a specific man and names him in a bond. He needs an active EvolveFund deposit; when both confirm, it is locked and the countdown starts. Pregnancy is reported between 14 and 30 days after confirmation, and the couple's STD and DNA tests are taken at the meeting itself — recent STD results matter, DNA does not age. Once paternity is confirmed, the man's deposit passes to the woman; if it is not confirmed, the deposit is simply released back to him. Nothing changes hands until the facts are settled.

**Polyandrous conception.** The choice belongs to her, and stays private. She opens a session that runs for 48 hours — with no deposit of her own (she may add one only for reputation, if she wishes). Men with an active deposit may join — up to 50 — and confirm, which locks their stake. Fourteen days after the session closes, the father is chosen. He gets his deposit back plus a reward from the pool: twice his deposit and 1 EVOLVE for every other participant. The men who are not chosen lose their stake — 90% to the woman, 10% to the chosen father. She risks nothing and can only gain; the men put their stake behind the right to be chosen.

## The EVOLVE token (testnet only)

- ERC-20, max supply **8,000,000,000 EVOLVE**. Admin actions are gated by a 48-hour `TimelockController`.
- **Planned supply allocation** — designed to put almost the whole supply to work for users, not for insiders:

| Purpose                                           |        EVOLVE |
| ------------------------------------------------- | ------------: |
| Founders and team (salary / reward) | 25,000,000 |
| DEX reserve (future)                              |     4,000,000 |
| Public sale (planned)                             |     5,000,000 |
| Reward reserve — labs, patients, mothers, fathers | 7,966,000,000 |

- **Planned public sale** — 5,000,000 EVOLVE sold by the app at **$0.8 each**, payable in any token the app supports; proceeds fund development. _(Planned — not live yet.)_
- **Trustless emission (planned)** — the ~7,966,000,000 reward reserve is to be locked in a non-drainable `RewardVault`: released only gradually through lab, patient, mother and father rewards, with rule changes requiring a governance vote. Not even the founder can withdraw it. Design: [docs/REWARD-VAULT-PLAN.md](docs/REWARD-VAULT-PLAN.md).
- **Emoji gift economy** — a gift costs 1 EVOLVE, split proportionally among existing gift owners; a perpetual revenue model, and gifts are transferable.
- **EvolveFund** — male staking (min 15 EVOLVE, 30-day lock) that counts toward governance weight; women use their wallet balance.
- **Verification rewards** — 1 EVOLVE to the verified user and 1 EVOLVE to the confirming lab per STD/DNA verification (plus a rate-limited faucet).
- **Governance** — vote weight combines recursive reputation (8 votes, depth 3), children/fatherhood share, and staked or held EVOLVE.
- **LayerZero OFT** integration for future multichain EVOLVE transfers (dependencies in place; nothing deployed beyond Sepolia yet).

## Support the project

EVOLVE is independent and open-source. If it is useful to you, you can support development with a donation — every contribution goes to code, laboratory partnerships, hosting and translation.

- **Donation details (EVM, Monero and more):** [DONATE.md](DONATE.md)
- **Multilingual donation page (34 languages):** **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**

A public token sale is on the roadmap but is **not** live today. Donations are gifts that support open-source development and give no claim to tokens, equity, returns or profit. Please only give what you can afford to lose.

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

Key smart contracts: `EVOLVE.sol` (ERC-20), `ProfileNFT.sol` (ERC-721), `TrustScore.sol`, `Voting.sol`, `Evolve2Earn.sol` (emoji gifts + rewards), `Governance.sol`, `BondManager.sol` (conception and polyandrous conception), `EvolveFund.sol`, `VerificationRegistry.sol`, `DNAVerification.sol`, ERC-4337 `SmartAccountFactory` + `Paymaster`, and an OpenZeppelin `TimelockController`.

Details: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md)

## Roadmap

In progress: production-readiness of the web app. Planned: on-chain lab registry and test certification, a real mail-provider adapter for lab report ingestion, on-chain verified attestations on profiles, the **trustless RewardVault** with governance-gated emission ([design](docs/REWARD-VAULT-PLAN.md)), the **public token sale**, token vesting update for the founder allocation, and DEX liquidity provisioning (currently blocked — it requires mainnet token deployments). Multi-network expansion (Arbitrum, Avalanche and other EVM chains) follows after testnet hardening.

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
- [RewardVault plan](docs/REWARD-VAULT-PLAN.md) — trustless emission (planned)
- [Roadmap](docs/ROADMAP.md) — milestones and current status
- [FAQ](docs/FAQ.md) — frequently asked questions
- [Wallet guide](docs/WALLETS.md) — how to create wallets and get donation addresses

## License

Licensed under the [MIT License](LICENSE).

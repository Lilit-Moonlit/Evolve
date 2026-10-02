[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)

# EVOLVE

**Pagnanais na makahanap ng kapareha, pagbubuntis at beripikasyon ng kalusugan — pribado bilang default, beripikado kung saan mahalaga.**

Ang EVOLVE ay isang open-source at desentralisadong plataporma para sa mababeriipikang malapit na ugnayan: paghahanap ng kapareha, pagbubuntis, at anonimong STD/DNA compatibility. Nagla-log-in ka gamit ang sarili mong crypto wallet (Sign-In with Ethereum) — walang numero ng telepono, walang email, walang KYC — at maaari mong mabawi ang iyong account sa pamamagitan ng on-chain na DNA commitment. Ang data ng kalusugan ay mananatili sa iyo: awtomatikong sinusuri ng sistema ang mga resulta ng laboratoryo, ang indibidwal na status ng bawat pathogen ay **hindi kailanman** ipinapakita kahit kanino, at ang pagtutugma ay nakasalalay lamang sa anonimong verdict ng compatibility (Safe / Compatible / Caution / Risk). Ang chat ay tumatakbo nang peer-to-peer sa ibabaw ng libp2p at Nostr, na may HTTP fallback para sa kaginhawaan, at kasama ng app ang magaan at pampublikong "Safety Mode" facade pati na ang standalone na Companion Mode para sa pagsusuri ng mga STD test.

> **Status: maagang yugto ng alpha.** Ang EVOLVE ay nasa aktibong pag-develop at hindi pa tapos na produkto.
> Ang mga smart contract ay naka-deploy **sa Ethereum Sepolia testnet lamang**.
> **Walang mainnet deployment, walang DEX, walang liquidity, at walang pampublikong pagbebenta ng token** — at walang anumang ipinangako.
> Ang mga feature ay maaaring magbago o masira anumang oras. Walang anuman dito ang payo pananalapi o alok ng pamumuhunan.

## Ano at Bakit

Ang mga tradisyonal na dating platform ay hinihiling na ibigay mo ang iyong numero ng telepono, email, mga litrato at pinakapribadong detalye ng kalusugan sa isang sentral na database. Ang EVOLVE ay nagsisimula sa kabaligtar na premisa: privacy bilang default, self-custody, at walang sentral na punto ng pagkakamali. Mga pangunahing halaga:

- **Privacy bilang default** — ang data ng kalusugan ay hindi kailanman inilalantad; anonimong verdict lamang.
- **Paglaban sa pagbabawal (ban resistance)** — P2P-first na pagmemensahe, desentralisadong storage (IPFS / Arweave), multi-network na disenyo, walang hardcoded na domain.
- **Self-custodial na pagkakakilanlan** — ang iyong wallet ang iyong login; pagbawi gamit ang DNA sa halip na email/telepono.
- **Walang KYC gate** — walang government ID, telepono o email na kailangan para magamit ang plataporma.

Basahin ang buong paliwanag sa [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md) (sa Ingles).

## Pangunahing Mga Feature

### Pagkakakilanlan at Privacy

- **Pag-log-in sa wallet gamit ang SIWE** (MetaMask at iba pang EVM wallet) — ang escape hatch laban sa sensura.
- **Pagbawi ng account gamit ang DNA** — ang iyong DNA test result ay hinahash (SHA-256, naka-commit on-chain bilang `bytes32`) at maaaring maibalik ang access nang walang telepono o email.
- **Account Abstraction (ERC-4337)** — mga smart account at paymaster para sa gasless na onboarding; ang SIWE ay laging nananatiling available.

### Anonimong Health Compatibility

- I-upload ang mga STD test result bilang raw text o PDF (pagkuha mula sa text-layer na may OCR fallback para sa mga na-scan na pahina).
- Kinikilala ng parser ang 8 na pathogen: HIV-1/2, Syphilis, Chlamydia, Gonorrhea, HSV-1, HSV-2, Hepatitis B, Hepatitis C (format ng report sa Ingles, Ukrainian at Russian).
- **Ang indibidwal na status ng pathogen ay hindi kailanman ipinapakita sa ibang user.** Ang mga profile ay nagpapakita lamang ng anonimong verdict: **Safe / Compatible / Caution / Risk**.
- Ang mga on-chain na DNA verification record (`DNAVerification.sol`) ang nagpapatakbo ng mga flow ng pagbawi at beripikasyon.

### Mga Profile, Paghahanap at Komunikasyon

- Mga search filter: "Ano ang hinahanap mo" (dating / pagbubuntis / polyandrous na pagbubuntis / STD testing), "Sino ang hinahanap mo" (mga lalaki, mga babae, mga mag-asawa), cascading na pagpili ng bansa → lungsod, "kayang pumarito sa iyong bansa" na may listahan kada bansa, kulay ng balat, kagustuhan sa pagte-test, STD-compatible lamang.
- Onboarding wizard: edad (maaring itago), mga wika, bio, litrato.
- **Privacy ng litrato**: ang mga litrato ay blurred bilang default; ang may-ari ay nagbibigay ng 15-segundo o permanenteng pagtingin, kusang-loob o kapag hiningi. Ang pagtingin ay libre.
- **P2P chat** sa ibabaw ng libp2p (gossipsub) + Nostr, na may HTTP API fallback.

### Mga Mode ng Pagbubuntis

- **Mode 2 — Pregnancy Bond**: gumagawa ng bond ang isang babae, nagta-stake ng EVOLVE ang lalaki (≥ 100 sa kasalukuyang testnet build), tinutiyak ng dalawa; pagkatapos ng kumpirmadong pagbubuntis at pagiging ama, ang stake ay inililipat sa babae.
- **Mode 3 — Cryptic Choice**: nagbubukas ang babae ng 48-oras na sesyon, sasali ang mga lalaki sa pamamagitan ng pag-stake; siya ang pumipili ng ama — ang kanyang stake ay ibinabalik, ang iba ay nahahati: 90% sa kanya / 10% sa napiling ama.

### Mga Laboratoryo at Beripikasyon

- **Partner flow ng mga laboratoryo**: ang mga laboratoryo ay nagre-register bilang partner, nagbe-beripika ng mga pasyente sa pamamagitan ng QR code at face match, at naglalakip ng mga STD report (PDF/text na may OCR extraction).
- **Companion Mode**: standalone na flow para masuri ang mga STD test result nang hindi sumasali sa dating platform.
- **Safety Mode** (`VITE_PRODUCT_MODE=safety`): isang limitadong pampublikong facade (STD status, pampublikong link ng profile, mga compatibility check) na patuloy na gumagana kahit na ang mga feature ng dating/pagbubuntis ay paghigpitan sa isang hurisdiksyon o app store.

### EVOLVE Token (testnet lamang)

- ERC-20, maximum supply na 8,000,000,000 EVOLVE, ang mga admin action ay naka-gate sa 48-oras na TimelockController.
- **Ekonomiya ng emoji gift**: ang isang gift ay nagkakahalaga ng 1 EVOLVE, na hinahati nang proporsyonal sa mga kasalukuyang may-ari ng gift — isang perpetual na modelo ng kita para sa mga may-hawak; ang mga gift ay naililipat.
- **EvolveFund**: pag-stake ng mga lalaki (pinakamababang 15 EVOLVE, 30-araw na lock) na binabatay sa governance weight; ang mga babae ay gumagamit ng kanilang wallet balance.
- **Mga gantimpala sa beripikasyon**: 1 EVOLVE sa beripikadong user at 1 EVOLVE sa kumpirmadong laboratoryo sa bawat STD/DNA verification (kasama ang rate-limited na test faucet).
- Ang governance vote weight ay pinagsasama ang recursive reputation (8 boto, depth 3), bahagi sa mga anak/pagiging ama, at staked o hawak na EVOLVE.
- **LayerZero OFT** integration para sa susunod na multichain na paglilipat ng EVOLVE (nasa lugar na ang mga dependency; wala pang naka-deploy bukod sa Sepolia).

### Plataporma

- Web app (PWA-installable) at Expo/React Native mobile app.
- Ang interface ay isinalin sa **34 na wika**.
- Multi-network ready: 18 na configuration ng EVM network (ang Arbitrum at Avalanche ang planadong pangunahing L2 — **hindi pa naka-deploy**).

## Arkitektura at Tech Stack

Monorepo na pinamamahalaan ng npm workspaces + Turborepo:

```
apps/
  web/          # Vite + React + TypeScript (pangunahing web app, i18next, Prisma)
  mobile/       # Expo + React Native
packages/
  config/       # Mga feature flag at dynamic na remote configuration
  contracts/    # Solidity 0.8.24, Hardhat, Ignition, OpenZeppelin, LayerZero
  core/         # Mga shared na uri, utility, middleware, web3
  matching/     # Mga algorithm ng pagtutugma, filter, ranking
  p2p/          # libp2p (gossipsub) + Nostr networking
  storage/      # IPFS, Arweave, Lit Protocol
docs/           # Arkitektura, tokenomics, roadmap, FAQ
```

Mga pangunahing smart contract: `EVOLVE.sol` (ERC-20), `ProfileNFT.sol` (ERC-721), `TrustScore.sol`, `Voting.sol`, `Evolve2Earn.sol` (mga emoji gift + gantimpala), `Governance.sol`, `BondManager.sol` (Mode 2 at 3), `EvolveFund.sol`, `VerificationRegistry.sol`, `DNAVerification.sol`, ERC-4337 `SmartAccountFactory` + `Paymaster`, at isang OpenZeppelin `TimelockController`.

Mga detalye: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md) (sa Ingles).

## Roadmap

Kasalukuyang isinasagawa: ang production-readiness ng web app. Naka-plan: on-chain na registry ng laboratoryo at sertipikasyon ng test, tunay na mail-provider adapter para sa pagtanggap ng mga report ng laboratoryo, on-chain na beripikadong attestasyon sa mga profile, pag-update ng token vesting para sa alokasyon ng founder/developer, at pag-provision ng DEX liquidity (kasalukuyang naka-block — nangangailangan ng mainnet deployment ng token). Ang pagpapalawak sa maraming network (Arbitrum, Avalanche at iba pang EVM chain) ay susunod pagkatapos ng testnet hardening.

Buong listahan: [docs/ROADMAP.md](docs/ROADMAP.md) (sa Ingles).

## Pagsisimula (Mga Developer)

Mga kinakailangan: **Node.js 20+** at npm 10.x.

```bash
# I-clone at i-install ang lahat ng workspace
git clone https://github.com/Lilit-Moonlit/Evolve.git
cd Evolve
npm install

# Web app (Vite dev server sa http://localhost:3000)
cd apps/web
npm run dev
npm test                # vitest suite

# Mga smart contract
cd packages/contracts
npm run compile         # hardhat compile
npm test                # hardhat test suite
npm run deploy:local    # i-deploy ang lahat ng contract sa in-process na Hardhat network
```

## Pag-ambag

Ang mga kontribusyon ay malugod na tinatanggap — code, mga bug report, mga mungkahing feature at mga proposal. Mangyaring basahin ang [CONTRIBUTING.md](CONTRIBUTING.md) at ang aming [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) bago ka magsimula.

## Pagsuporta sa Proyekto

Kung nakikita mong kapaki-pakinabang ang EVOLVE, maaari mong suportahan ang pag-develop sa pamamagitan ng donasyon — mga detalye sa [DONATE.md](DONATE.md). Mas gusto mo ba ang web page? Gamitin ang multilingual na pahina ng donasyon (34 na wika): **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**.

**Walang pagbebenta ng token at walang kailanman magiging ganoon.** Hindi maaaring "i-invest" ang mga EVOLVE token; ang mga donasyon ay regalong tumutulong sa open-source development at hindi nagbibigay sa donor ng karapatan sa token, equity, kita o anumang pinansiyal na claim.

## Mga Repository (Mirror)

| Mirror   | URL                                        |
| -------- | ------------------------------------------ |
| GitHub   | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg | https://codeberg.org/limitafternoon/Evolve |
| GitLab   | https://gitlab.com/evolve-group3/evolve    |

## Dokumentasyon

- [Ano at Bakit](docs/WHAT-AND-WHY.md) — problema, bisyon, mga pangunahing halaga (sa Ingles)
- [Paano Ito Gumagana](docs/HOW-IT-WORKS.md) — mga user flow, hakbang-hakbang (sa Ingles)
- [Arkitektura](docs/ARCHITECTURE.md) — monorepo, mga package, daloy ng data (sa Ingles)
- [Tokenomics](docs/TOKENOMICS.md) — modelo ng token at distribusyon ng supply (sa Ingles)
- [Roadmap](docs/ROADMAP.md) — mga milestone at kasalukuyang status (sa Ingles)
- [FAQ](docs/FAQ.md) — mga madalas itanong (sa Ingles)
- [Gabay sa Wallet](docs/WALLETS.md) — paano gumawa ng mga wallet at kumuha ng mga address ng donasyon (sa Ingles)

## Lisensya

Nakalisensya sa ilalim ng [MIT License](LICENSE).

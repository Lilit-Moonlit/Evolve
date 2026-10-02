[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)

# EVOLVE

**Daten, conceptie en gezondheidsverificatie — standaard privé, geverifieerd waar het telt.**

EVOLVE is een open-source, gedecentraliseerd platform voor verifieerbare intieme contacten: daten, conceptie en anonieme STD/DNA-compatibiliteit. Je logt in met je eigen cryptowallet (Sign-In with Ethereum) — geen telefoonnummer, geen e-mail, geen KYC — en je kunt je account herstellen via een on-chain DNA-commitment. Gezondheidsgegevens blijven van jou: labresultaten worden automatisch geparseerd, individuele pathogeenstatussen worden **nooit** aan iemand getoond, en matching berust uitsluitend op anonieme compatibiliteitsuitspraken (Safe / Compatible / Caution / Risk). De chat draait peer-to-peer via libp2p en Nostr, met een HTTP-fallback voor het gemak, en de app wordt geleverd met een lichtgewicht openbaar “Safety Mode”-front plus een zelfstandige Companion Mode voor het beoordelen van STD-testresultaten.

> **Status: vroege alfaversie.** EVOLVE is in actieve ontwikkeling en is geen afgerond product.
> Smart contracts zijn **alleen op de Ethereum Sepolia-testnet** gedeployd.
> Er is **geen mainnet-implementatie, geen DEX, geen liquiditeit en geen openbare tokenverkoop** — en niets daarvan wordt beloofd.
> Functionaliteit kan op elk moment wijzigen of breken. Niets hier is financieel advies of een investeringsaanbod.

## Wat & waarom

Traditionele datingplatformen vragen je om je telefoonnummer, e-mail, foto's en intieme gezondheidsgegevens over te dragen aan een centrale database. EVOLVE vertrekt vanuit de tegenovergestelde premisse: privacy standaard, zelfcustodie en geen centraal storingspunt. Kernwaarden:

- **Privacy standaard** — gezondheidsgegevens worden nooit blootgesteld; alleen anonieme uitspraken.
- **Banbestendigheid** — berichtenverkeer P2P-eerst, gedecentraliseerde opslag (IPFS / Arweave), multi-netwerkontwerp, geen hardcoderde domeinen.
- **Zelfcustodiale identiteit** — je wallet is je login; herstel via DNA in plaats van e-mail/telefoon.
- **Geen KYC-drempel** — voor het gebruik van het platform zijn geen identiteitsbewijs, telefoon of e-mail vereist.

Lees de volledige onderbouwing in [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md) (in het Engels).

## Belangrijkste functies

### Identiteit & privacy

- **Wallet-login via SIWE** (MetaMask en andere EVM-wallets) — de censuurbestendige nooduitgang.
- **Accountherstel via DNA** — je DNA-testresultaat wordt gehasht (SHA-256, on-chain vastgelegd als `bytes32`) en kan de toegang herstellen zonder telefoon of e-mail.
- **Account Abstraction (ERC-4337)** — slimme accounts en een paymaster voor gasloos onboarding; SIWE blijft altijd beschikbaar.

### Anonieme gezondheidscompatibiliteit

- Upload van STD-testresultaten als platte tekst of PDF (tekstlaag-extractie met OCR-fallback voor gescande pagina's).
- De parser herkent 8 pathogenen: hiv-1/2, syfilis, chlamydia, gonorroe, hsv-1, hsv-2, hepatitis B, hepatitis C (Engelse, Oekraïense en Russische rapportformaten).
- **De individuele pathogeenstatus wordt nooit aan andere gebruikers getoond.** Profielen tonen alleen een anonieme uitspraak: **Safe / Compatible / Caution / Risk**.
- On-chain DNA-verificatieregisters (`DNAVerification.sol`) vormen de basis voor herstel- en verificatieflows.

### Profielen, zoeken & communicatie

- Zoekfilters: “Wat zoek je” (daten / conceptie / polyandrische conceptie / STD-tests), “Wie zoek je” (mannen, vrouwen, stellen), cascaderende land-→-stad-selecties, “kan naar jouw land reizen” met lijsten per land, huidskleur, testvoorkeur, alleen STD-compatibel.
- Onboardingwizard: leeftijd (verbergbaar), talen, bio, foto.
- **Foto-privacy**: foto's zijn standaard wazig; de eigenaar verleent weergaven van 15 seconden of permanent, op verzoek of uit eigen beweging. Bekijken is gratis.
- **P2P-chat** via libp2p (gossipsub) + Nostr, met een HTTP-API-fallback.

### Conceptiemodi

- **Modus 2 — Pregnancy Bond**: een vrouw creëert een bond, een man zet EVOLVE in stake (≥ 100 in de huidige testnet-build), beiden bevestigen; na een bevestigde zwangerschap en vaderschap gaat de stake naar de vrouw.
- **Modus 3 — Cryptic Choice**: een vrouw opent een sessie van 48 uur, mannen doen mee door te staken; zij kiest de vader — zijn stake wordt teruggegeven, de rest wordt verdeeld: 90% voor haar / 10% voor de gekozen vader.

### Laboratoria & verificatie

- **Partnerflow voor laboratoria**: laboratoria registreren zich als partner, verifiëren patiënten via QR-code en gezichtsherkenning en voegen STD-rapporten toe (PDF/tekst met OCR-extractie).
- **Companion Mode**: zelfstandige flow om STD-testresultaten te beoordelen zonder je aan te melden op het datingplatform.
- **Safety Mode** (`VITE_PRODUCT_MODE=safety`): een beperkt openbaar front (STD-status, openbare profiellinks, compatibiliteitscontroles) dat blijft werken, zelfs als dating-/conceptiefuncties in een jurisdictie of appstore worden beperkt.

### EVOLVE-token (alleen testnet)

- ERC-20, maximale voorraad 8.000.000.000 EVOLVE, adminhandelingen gekoppeld aan een TimelockController van 48 uur.
- **Emoji-cadeauseconomie**: een cadeau kost 1 EVOLVE, dat evenredig wordt verdeeld onder de bestaande cadeaueigenaren — een perpetueel inkomstenmodel voor houders; cadeaus zijn overdraagbaar.
- **EvolveFund**: mannasting (min. 15 EVOLVE, 30 dagen vergrendeld) dat meetelt voor het governancegewicht; vrouwen gebruiken hun walletsaldo.
- **Verificatiebeloningen**: 1 EVOLVE voor de geverifieerde gebruiker en 1 EVOLVE voor het bevestigende laboratorium bij STD/DNA-verificatie (plus een testfaucet met frequentielimiet).
- Het stemgewicht in governance combineert recursieve reputatie (8 stemmen, diepte 3), het aandeel kinderen/vaderschap en gestakede of gehouden EVOLVE.
- **LayerZero OFT**-integratie voor toekomstige multichain-overdrachten van EVOLVE (afhankelijkheden aanwezig; nog niets buiten Sepolia gedeployd).

### Platform

- Webapp (installeerbaar als PWA) en mobiele app op Expo/React Native.
- Interface vertaald in **34 talen**.
- Multi-netwerkklaar: 18 EVM-netwerkconfiguraties (Arbitrum en Avalanche zijn de geplande primaire L2's — **nog niet gedeployd**).

## Architectuur & techstack

Monorepo beheerd met npm workspaces + Turborepo:

```
apps/
  web/          # Vite + React + TypeScript (hoofdwebapp, i18next, Prisma)
  mobile/       # Expo + React Native
packages/
  config/       # Feature flags & dynamische externe configuratie
  contracts/    # Solidity 0.8.24, Hardhat, Ignition, OpenZeppelin, LayerZero
  core/         # Gedeelde types, utilities, middleware, web3
  matching/     # Matching-algoritmen, filters, ranking
  p2p/          # libp2p (gossipsub) + Nostr-netwerk
  storage/      # IPFS, Arweave, Lit Protocol
docs/           # Architectuur, tokenomics, roadmap, FAQ
```

Belangrijkste smart contracts: `EVOLVE.sol` (ERC-20), `ProfileNFT.sol` (ERC-721), `TrustScore.sol`, `Voting.sol`, `Evolve2Earn.sol` (emoji-cadeaus + beloningen), `Governance.sol`, `BondManager.sol` (modi 2 & 3), `EvolveFund.sol`, `VerificationRegistry.sol`, `DNAVerification.sol`, ERC-4337 `SmartAccountFactory` + `Paymaster`, en een OpenZeppelin `TimelockController`.

Details: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md) (in het Engels).

## Roadmap

In uitvoering: productierijpheid van de webapp. Gepland: on-chain laboratoriumregister en testcertificering, echte e-mailprovider-adapter voor het ontvangen van labrapporten, on-chain geverifieerde attestaties op profielen, update van token-vesting voor founder/ontwikkelaars-allocaties, DEX-liquiditeitsvoorziening (momenteel geblokkeerd — vereist mainnet-implementaties van de token). Multi-netwerkuitbreiding (Arbitrum, Avalanche en andere EVM-chains) volgt na het harden op het testnet.

Volledige lijst: [docs/ROADMAP.md](docs/ROADMAP.md) (in het Engels).

## Aan de slag (ontwikkelaars)

Vereisten: **Node.js 20+** en npm 10.x.

```bash
# Kloon en installeer alle workspaces
git clone https://github.com/Lilit-Moonlit/Evolve.git
cd Evolve
npm install

# Webapp (Vite-devserver op http://localhost:3000)
cd apps/web
npm run dev
npm test                # vitest-suite

# Smart contracts
cd packages/contracts
npm run compile         # hardhat compile
npm test                # hardhat-testsuite
npm run deploy:local    # deploy alle contracts naar een in-process Hardhat-netwerk
```

## Bijdragen

Bijdragen zijn welkom — code, bugrapporten, functiesuggesties en voorstellen. Lees vóór je begint [CONTRIBUTING.md](CONTRIBUTING.md) en onze [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Het project steunen

Als je EVOLVE nuttig vindt, kun je de ontwikkeling steunen met een donatie — details in [DONATE.md](DONATE.md). Liever een webpagina? Gebruik de meertalige donatiepagina (34 talen): **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**.

**Er is geen tokenverkoop en die zal er nooit komen.** In EVOLVE-tokens kan niet worden “geïnvesteerd”; donaties zijn geschenken ter ondersteuning van open-source-ontwikkeling en geven de donor geen recht op tokens, aandelen, rendement of enige financiële claim.

## Repositories (mirrors)

| Mirror   | URL                                        |
| -------- | ------------------------------------------ |
| GitHub   | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg | https://codeberg.org/limitafternoon/Evolve |
| GitLab   | https://gitlab.com/evolve-group3/evolve    |

## Documentatie

- [Wat & waarom](docs/WHAT-AND-WHY.md) — probleem, visie, kernwaarden (Engels)
- [Hoe het werkt](docs/HOW-IT-WORKS.md) — gebruikersflows, stap voor stap (Engels)
- [Architectuur](docs/ARCHITECTURE.md) — monorepo, packages, datastromen (Engels)
- [Tokenomics](docs/TOKENOMICS.md) — tokenmodel en verdeling van de voorraad (Engels)
- [Roadmap](docs/ROADMAP.md) — mijlpalen en huidige status (Engels)
- [FAQ](docs/FAQ.md) — veelgestelde vragen (Engels)
- [Walletgids](docs/WALLETS.md) — wallets aanmaken en donatieadressen krijgen (Engels)

## Licentie

Gelicentieerd onder de [MIT-licentie](LICENSE).

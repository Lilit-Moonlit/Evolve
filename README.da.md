[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)

# EVOLVE

**Dating, undfangelse og sundhedsverifikation — privat som standard, verificeret der hvor det betyder noget.**

EVOLVE er en open source-baseret, decentraliseret platform til verificerbare intime forbindelser: dating, undfangelse og anonym STD/DNA-kompatibilitet. Du logger ind med din egen krypto-wallet (Sign-In with Ethereum) — intet telefonnummer, ingen e-mail, ingen KYC — og du kan gendanne din konto gennem et on-chain DNA-commitment. Sundhedsdata forbliver dine: laboratorieresultater parses automatisk, status for enkelte patogener vises **aldrig** for nogen, og matchning bygger udelukkende på anonyme kompatibilitetsvurderinger (Safe / Compatible / Caution / Risk). Chatten kører peer-to-peer over libp2p og Nostr med en HTTP-fallback for bekvemmelighedens skyld, og appen leveres med en letvægts offentlig »Safety Mode«-facade samt en selvstændig Companion Mode til evaluering af STD-testresultater.

> **Status: tidlig alfa.** EVOLVE er under aktiv udvikling og er ikke et færdigt produkt.
> Smart contracts er deployet **kun på Ethereum Sepolia-testnettet**.
> Der er **ingen mainnet-implementering, ingen DEX, ingen likviditet og intet offentligt tokensalg** — og ingen af delene er lovet.
> Funktioner kan ændre sig eller gå i stykker når som helst. Intet her er finansiel rådgivning eller et investeringstilbud.

## Hvad & hvorfor

Traditionelle datingplatforme beder dig om at aflevere dit telefonnummer, din e-mail, fotos og intime sundhedsdetaljer til en central database. EVOLVE tager udgangspunkt i det modsatte: privatliv som standard, self-custody og intet centralt fejlpunkt. Kerneværdier:

- **Privatliv som standard** — sundhedsdata eksponeres aldrig; kun anonyme vurderinger.
- **Modstandskraft over for forbud** — P2P-først-beskeder, decentraliseret lagring (IPFS / Arweave), multi-netværksdesign, ingen hardkodede domæner.
- **Self-custodial identitet** — din wallet er din login; DNA-baseret gendannelse i stedet for e-mail/telefon.
- **Ingen KYC-barriere** — hverken myndigheds-ID, telefon eller e-mail kræves for at bruge platformen.

Læs den fulde begrundelse i [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md) (på engelsk).

## Nøglefunktioner

### Identitet & privatliv

- **SIWE-wallet-login** (MetaMask og andre EVM-wallets) — nødudgangen der modstår censur.
- **DNA-kontogendannelse** — dit DNA-testresultat hashes (SHA-256, committed on-chain som `bytes32`) og kan genoprette adgangen uden telefon eller e-mail.
- **Account Abstraction (ERC-4337)** — smart accounts og en paymaster til gasløs onboarding; SIWE forbliver altid tilgængelig.

### Anonym sundhedskompatibilitet

- Upload STD-testresultater som rå tekst eller PDF (tekstlagsudtrækning med OCR-fallback til skannede sider).
- Parseren genkender 8 patogener: HIV-1/2, syfilis, klamydia, gonoré, HSV-1, HSV-2, hepatitis B, hepatitis C (engelske, ukrainske og russiske rapportformater).
- **Status for enkelte patogener vises aldrig for andre brugere.** Profiler viser kun en anonym vurdering: **Safe / Compatible / Caution / Risk**.
- On-chain DNA-verifikationsposter (`DNAVerification.sol`) driver gendannelses- og verifikationsflows.

### Profiler, søgning & kommunikation

- Søgefiltre: »Hvad søger du« (dating / undfangelse / polyandrisk undfangelse / STD-test), »Hvem søger du« (mænd, kvinder, par), kaskaderende land → by-valg, »kan rejse til dit land« med lister pr. land, hudfarve, testpræference, kun STD-kompatible.
- Onboarding-guide: alder (kan skjules), sprog, bio, foto.
- **Foto-privatliv**: fotos er slørede som standard; ejeren tildeler 15-sekunders eller permanente visninger — proaktivt eller på anmodning. Det er gratis at se.
- **P2P-chat** over libp2p (gossipsub) + Nostr, med en HTTP-API-fallback.

### Undfangelsestilstande

- **Tilstand 2 — Pregnancy Bond**: en kvinde opretter en bond, en mand staker EVOLVE (≥ 100 i den nuværende testnet-build), begge bekræfter; efter en bekræftet graviditet og fastslået faderskab overføres staken til kvinden.
- **Tilstand 3 — Cryptic Choice**: en kvinde åbner en 48-timers session, mænd deltager ved at stake; hun vælger faderen — hans stake returneres, de øvrige: 90 % går til hende / 10 % til den valgte far.

### Laboratorier & verifikation

- **Laboratorie-partnerflow**: laboratorier registrerer sig som partnere, verificerer patienter via QR-kode og ansigtsgenkendelse og vedhæfter STD-rapporter (PDF/tekst med OCR-udtrækning).
- **Companion Mode**: selvstændigt flow til at evaluere STD-testresultater uden at tilslutte sig datingplatformen.
- **Safety Mode** (`VITE_PRODUCT_MODE=safety`): en begrænset offentlig facade (STD-status, offentlige profillinks, kompatibilitetstjek), der fortsat fungerer, selv hvis dating-/undfangelsesfunktioner bliver begrænset i en jurisdiktion eller en app-butik.

### EVOLVE-token (kun testnet)

- ERC-20, maksimal udbudsmængde 8.000.000.000 EVOLVE, admin-handlinger er bundet af en 48-timers TimelockController.
- **Emoji-gaveøkonomi**: en gave koster 1 EVOLVE, som fordeles proportionalt mellem eksisterende gaveejere — en evig indtægtsmodel for indehavere; gaver kan overdrages.
- **EvolveFund**: mandlig staking (min. 15 EVOLVE, 30 dages lås), der indgår i governance-vægten; kvinder bruger deres wallet-saldo.
- **Verifikationsbelønninger**: 1 EVOLVE til den verificerede bruger og 1 EVOLVE til det bekræftende laboratorium ved STD/DNA-verifikation (plus en ratebegrænset test-faucet).
- Governance-stemmevægten kombinerer rekursiv omdømme (8 stemmer, dybde 3), andelen af børn/faderskab samt staked eller holdt EVOLVE.
- **LayerZero-OFT**-integration til fremtidige multichain-overførsler af EVOLVE (afhængigheder er på plads; intet deployet uden for Sepolia endnu).

### Platform

- Webapp (installérbar som PWA) og mobilapp bygget i Expo/React Native.
- Brugergrænsefladen er oversat til **34 sprog**.
- Klar til flere netværk: 18 EVM-netværkskonfigurationer (Arbitrum og Avalanche er de planlagte primære L2-netværk — **endnu ikke deployet**).

## Arkitektur & tech stack

Monorepo administreret med npm workspaces + Turborepo:

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

Vigtige smart contracts: `EVOLVE.sol` (ERC-20), `ProfileNFT.sol` (ERC-721), `TrustScore.sol`, `Voting.sol`, `Evolve2Earn.sol` (emoji-gaver + belønninger), `Governance.sol`, `BondManager.sol` (tilstande 2 & 3), `EvolveFund.sol`, `VerificationRegistry.sol`, `DNAVerification.sol`, ERC-4337 `SmartAccountFactory` + `Paymaster` samt en OpenZeppelin-`TimelockController`.

Detaljer: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md) (på engelsk).

## Roadmap

I gang: produktionsmodenhed af webappen. Planlagt: on-chain laboratorieregister og testcertificering, en rigtig mail-provider-adapter til indtagelse af labrapporter, on-chain-verificerede attester på profiler, opdatering af token-vesting for founder-/udvikler-allokeringer, DEX-likviditetsforsyning (i øjeblikket blokeret — kræver mainnet-deployments af tokenen). Multi-netværksudvidelse (Arbitrum, Avalanche og andre EVM-kæder) følger efter testnet-hærdning.

Fuld liste: [docs/ROADMAP.md](docs/ROADMAP.md) (på engelsk).

## Kom godt i gang (udviklere)

Krav: **Node.js 20+** og npm 10.x.

```bash
# Klon og installér alle workspaces
git clone https://github.com/Lilit-Moonlit/Evolve.git
cd Evolve
npm install

# Webapp (Vite-devserver på http://localhost:3000)
cd apps/web
npm run dev
npm test                # vitest-suite

# Smart contracts
cd packages/contracts
npm run compile         # hardhat compile
npm test                # hardhat-testsuite
npm run deploy:local    # installér alle kontrakter på et in-process Hardhat-netværk
```

## Bidrag

Bidrag er velkomne — kode, fejlrapporter, funktionsforslag og forslag. Læs venligst [CONTRIBUTING.md](CONTRIBUTING.md) og vores [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md), før du går i gang.

## Støt projektet

Hvis du synes, at EVOLVE er nyttig, kan du støtte udviklingen med en donation — detaljer i [DONATE.md](DONATE.md). Foretrækker du en webside? Brug den flersprogede donationsside (34 sprog): **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**.

**Der er ingen tokensalg, og der kommer aldrig til at være ét.** Man kan ikke »investere« i EVOLVE-tokens; donationer er gaver til støtte for open source-udvikling og giver donoren ingen ret til tokens, egenkapital, afkast eller nogen form for økonomisk krav.

## Repositories (spejlinger)

| Spejl    | URL                                        |
| -------- | ------------------------------------------ |
| GitHub   | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg | https://codeberg.org/limitafternoon/Evolve |
| GitLab   | https://gitlab.com/evolve-group3/evolve    |

## Dokumentation

- [Hvad & hvorfor](docs/WHAT-AND-WHY.md) — problem, vision, kerneværdier (engelsk)
- [Sådan fungerer det](docs/HOW-IT-WORKS.md) — brugerflows, trin for trin (engelsk)
- [Arkitektur](docs/ARCHITECTURE.md) — monorepo, pakker, datastrømme (engelsk)
- [Tokenomics](docs/TOKENOMICS.md) — tokenmodel og fordeling af udbuddet (engelsk)
- [Roadmap](docs/ROADMAP.md) — milepæle og aktuel status (engelsk)
- [FAQ](docs/FAQ.md) — ofte stillede spørgsmål (engelsk)
- [Wallet-guide](docs/WALLETS.md) — hvordan man opretter wallets og får donationsadresser (engelsk)

## Licens

Licenseret under [MIT-licensen](LICENSE).

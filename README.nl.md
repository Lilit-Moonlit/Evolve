[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)

# EVOLVE

**Dating, conceptie en geverifieerde gezondheid — standaard privé, vertrouwen waar het telt.**

EVOLVE is een open-source, gedecentraliseerd platform voor mensen die het zat zijn om hun telefoonnummer, hun gezicht en hun meest intieme gezondheidsgegevens aan de database van iemand anders te geven. Je logt in met je eigen cryptowallet — geen telefoon, geen e-mail, geen KYC — en je kunt je account terugkrijgen via een on-chain DNA-commitment. Je gezondheidsgegevens blijven van jou: testuitslagen worden automatisch geparseerd, individuele pathogeenstatussen worden **nooit** aan iemand getoond, en matching steunt uitsluitend op anonieme compatibiliteitsuitspraken (Safe / Compatible / Caution / Risk). De chat draait peer-to-peer over libp2p en Nostr, met een HTTP-fallback voor het gemak.

> **Status — het platform werkt vandaag; mainnet en DEX zijn de volgende stap.**
> Dating, conceptie, gezondheidsverificatie, de laboratoriumflow, P2P-chat, de EVOLVE-token en governance draaien allemaal. Nog vooruit: een **mainnet-implementatie en DEX-liquiditeit**, plus een **geplande publieke verkoop** (zie [De EVOLVE-token](#de-evolve-token-alleen-testnet)).
> De smart contracts zijn **alleen op de Ethereum Sepolia-testnet** gedeployd. Niets hier is financieel advies of een investeringsaanbod.

> **Vind je EVOLVE nuttig? Steun de ontwikkeling — elke donatie gaat naar code, laboratoriumpartnerschappen, hosting en vertaling → [DONATE.md](DONATE.md).**

## Niets te vrezen

EVOLVE is gebouwd rond de vragen die mensen zich écht stellen voordat ze zo'n platform vertrouwen.

| De zorg                                            | Wat EVOLVE er al aan doet                                                                                                                                                                           |
| -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| «Mijn gezondheidsgegevens lekken uit.»             | Individuele pathogeenresultaten worden **nooit** aan iemand getoond — alleen een anonieme uitspraak: Safe / Compatible / Caution / Risk.                                                            |
| «Mijn foto's belanden ergens.»                     | Foto's zijn standaard wazig. De eigenaar geeft een weergave van **15 seconden** of **permanent** — op verzoek of uit eigen beweging. Kijken is gratis.                                              |
| «Ik moet mijn ID of telefoon afgeven.»             | Inloggen met wallet (SIWE). Geen telefoon, geen e-mail, geen KYC. Herstel verloopt via een on-chain DNA-commitment.                                                                                 |
| «Hij of zij liegt over gezond zijn.»               | Resultaten worden **door een lab gecontroleerd** (QR + gezichtsherkenning), en de tests van het stel worden **bij de ontmoeting zelf** afgenomen — verse soa-resultaten tellen, DNA veroudert niet. |
| «Neemt iemand mijn geld en verdwijnt?»             | Conceptie draait op een echte, risico dragende inzet: het depot van een man beweegt pas als het vaderschap is **bevestigd**; anders wordt het gewoon aan hem teruggegeven.                          |
| «Is de token een pump-and-dump?»                   | Vandaag is er geen verkoop actief; de code is open (MIT); de niet in omloop gebrachte reserve moet worden opgesloten in een **niet-ledigbare kluis** waaruit niet eens de oprichter kan opnemen.    |
| «Kan het platform worden afgesloten of verbannen?» | Peer-to-peer-berichten eerst, gedecentraliseerde opslag (IPFS / Arweave), 18 EVM-netwerkconfiguraties en geen vastgekoppeld domein.                                                                 |

## Wat & waarom

Traditionele datingapps vragen je om je telefoonnummer, e-mail, foto's en intieme gezondheidsdetails te ruilen voor een centrale database — en die database daarna eeuwig te vertrouwen. EVOLVE begint vanuit de tegenovergestelde premisse: **standaard privacy, zelfcustodie en geen enkel punt van falen**.

- **Standaard privacy** — gezondheidsgegevens worden nooit blootgesteld; alleen anonieme uitspraken.
- **Banbestendigheid** — P2P-berichten eerst, gedecentraliseerde opslag, multi-netwerkontwerp, geen vastgekoppelde domeinen.
- **Zelfcustodiale identiteit** — je wallet is je login; herstel via DNA in plaats van e-mail of telefoon.
- **Geen KYC-drempel** — geen legitimatiebewijs, telefoon of e-mail nodig om het platform te gebruiken.

Lees de volledige onderbouwing in [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md).

## Gezondheid die je echt kunt vertrouwen

- Upload een soa-test als platte tekst of PDF (tekstlaag-extractie, met OCR-fallback voor scans).
- De parser kent 8 pathogenen: hiv-1/2, syfilis, chlamydia, gonorroe, hsv-1, hsv-2, hepatitis B, hepatitis C — in Engelse, Oekraïense en Russische rapportformaten.
- **Individuele pathogeenstatus wordt nooit aan andere gebruikers getoond.** Profielen tonen alleen de anonieme uitspraak: **Safe / Compatible / Caution / Risk**.
- On-chain DNA-registraties (`DNAVerification.sol`) ondersteunen herstel en verificatie.

### Partnerlaboratoria — bewijs, geen beloftes

Stap een partnerlaboratorium binnen en toon je QR-code. Het lab scant hem, bevestigt je identiteit met **gezichtsherkenning** (zodat niemand anders jouw resultaat kan ophalen) en voegt het soa-rapport toe — PDF, scan of tekst, zelfs met slechte OCR. Het resultaat wordt getekend door een echt laboratorium, niet door jou, dus anderen zien een **geverifieerd feit** in plaats van jouw woord. En elke bevestigde verificatie betaalt **1 EVOLVE aan de patiënt en 1 EVOLVE aan het laboratorium** — beide kanten hebben een reden om eerlijk te zijn. Individuele pathogenen worden ook dan nog aan niemand getoond.

## Iemand vinden

- Zoekfilters: «Wat zoek je» (daten / conceptie / polyandrische conceptie / soa-tests), «Wie zoek je» (mannen, vrouwen, stellen), trapsgewijze selecties land → stad, «kan naar jouw land reizen» met lijsten per land, huidskleur, testvoorkeur, alleen soa-compatibel.
- Onboardingwizard: leeftijd (verbergbaar), talen, bio, foto.
- **P2P-chat** over libp2p (gossipsub) + Nostr, met een HTTP-API-fallback.

## Conceptie

Twee manieren om een kind te plannen, en beide rusten op hetzelfde idee: echte intentie toon je met een echte inzet in EVOLVE — nooit met beloftes. De commit van een man leeft in zijn EvolveFund-depot (vanaf 15 EVOLVE, minstens 30 dagen geblokkeerd), en een vrouw kan haar eigen minimumdepot bepalen voor de mannen die haar bereiken.

**Conceptie.** De vrouw leidt: ze nodigt een specifieke man uit en noemt hem in een bond. Hij heeft een actief EvolveFund-depot nodig; als beiden bevestigen, wordt het geblokkeerd en start de afloop. De zwangerschap wordt 14 tot 30 dagen na de bevestiging gemeld, en de soa- en DNA-tests van het stel worden bij de ontmoeting zelf afgenomen — verse soa-resultaten tellen, DNA veroudert niet. Zodra het vaderschap is bevestigd, gaat het depot van de man naar de vrouw; wordt het niet bevestigd, dan wordt het depot gewoon aan hem teruggegeven. Er verandert niets van eigenaar tot de feiten vaststaan.

**Polyandrische conceptie.** De keuze is van haar, en blijft privé. Ze opent een sessie van 48 uur — zonder eigen depot (ze mag er een toevoegen alleen voor reputatie, als ze wil). Mannen met een actief depot mogen deelnemen — tot 50 — en bevestigen, waarmee hun inzet wordt geblokkeerd. Veertien dagen na het sluiten van de sessie wordt de vader gekozen. Hij krijgt zijn depot terug plus een beloning uit de pot: het dubbele van zijn depot en 1 EVOLVE voor elke andere deelnemer. De niet-gekozen mannen verliezen hun inzet — 90% naar de vrouw, 10% naar de gekozen vader. Zij riskeert niets en kan alleen maar winnen; de mannen zetten hun inzet in voor het recht om gekozen te worden.

## De EVOLVE-token (alleen testnet)

- ERC-20, maximale voorraad **8,000,000,000 EVOLVE**. Adminhandelingen worden begrensd door een 48-uurs `TimelockController`.
- **Geplande verdeling van de voorraad** — ontworpen om bijna de hele voorraad voor gebruikers te laten werken, niet voor insiders:

| Doel                                                |        EVOLVE |
| --------------------------------------------------- | ------------: |
| Oprichters en team (salaris / beloning)             |    25,000,000 |
| DEX-reserve (toekomst)                              |     4,000,000 |
| Publieke verkoop (gepland)                          |     5,000,000 |
| Beloningsreserve — labs, patiënten, moeders, vaders | 7,966,000,000 |

- **Geplande publieke verkoop** — 5,000,000 EVOLVE verkocht door de app tegen **$0.8 per stuk**, te betalen met elke token die de app ondersteunt; de opbrengst financiert de ontwikkeling. _(Gepland — nog niet live.)_
- **Trustless-emissie (gepland)** — de beloningsreserve van ~7,966,000,000 moet worden opgesloten in een niet-ledigbare `RewardVault`: alleen geleidelijk vrijgegeven via beloningen voor labs, patiënten, moeders en vaders, met regelwijzigingen die een governance-stemming vereisen. Zelfs de oprichter kan er niet uit opnemen. Ontwerp: [docs/REWARD-VAULT-PLAN.md](docs/REWARD-VAULT-PLAN.md).
- **Emoji-cadeauseconomie** — een cadeau kost 1 EVOLVE, evenredig verdeeld onder bestaande cadeaueigenaren; een eeuwig verdienmodel, en cadeaus zijn overdraagbaar.
- **EvolveFund** — mannen-staking (min 15 EVOLVE, 30 dagen blokkade) die meetelt voor governance-gewicht; vrouwen gebruiken hun walletsaldo.
- **Verificatiebeloningen** — 1 EVOLVE aan de geverifieerde gebruiker en 1 EVOLVE aan het bevestigende lab per soa/DNA-verificatie (plus een faucet met snelheidslimiet).
- **Governance** — stemgewicht combineert recursieve reputatie (8 stemmen, diepte 3), aandeel kinderen/vaderschap en gestaked of vastgehouden EVOLVE.
- **LayerZero OFT**-integratie voor toekomstige multichain EVOLVE-overdrachten (afhankelijkheden aanwezig; nog niets gedeployd buiten Sepolia).

## Steun het project

EVOLVE is onafhankelijk en open-source. Als het nuttig voor je is, kun je de ontwikkeling steunen met een donatie — elke bijdrage gaat naar code, laboratoriumpartnerschappen, hosting en vertaling.

- **Donatiedetails (EVM, Monero en meer):** [DONATE.md](DONATE.md)
- **Meertalige donatiepagina (34 talen):** **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**

Een publieke tokenverkoop staat op de roadmap maar is vandaag **niet** actief. Donaties zijn geschenken die open-source ontwikkeling steunen en geen recht geven op tokens, aandelen, rendement of winst. Geef alleen wat je kunt missen.

## Architectuur & techstack

Monorepo beheerd met npm workspaces + Turborepo:

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

Belangrijkste smart contracts: `EVOLVE.sol` (ERC-20), `ProfileNFT.sol` (ERC-721), `TrustScore.sol`, `Voting.sol`, `Evolve2Earn.sol` (emoji-cadeaus + beloningen), `Governance.sol`, `BondManager.sol` (conceptie en polyandrische conceptie), `EvolveFund.sol`, `VerificationRegistry.sol`, `DNAVerification.sol`, ERC-4337 `SmartAccountFactory` + `Paymaster`, en een `TimelockController` van OpenZeppelin.

Details: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md)

## Roadmap

In uitvoering: productierijpheid van de webapp. Gepland: een on-chain labregister en testcertificering, een echte mailprovider-adapter voor het ontvangen van labrapporten, on-chain geverifieerde attestaties op profielen, de **trustless RewardVault** met via governance beheerde emissie ([ontwerp](docs/REWARD-VAULT-PLAN.md)), de **publieke tokenverkoop**, een vesting-update voor de oprichtersallocatie en de voorziening van DEX-liquiditeit (nu geblokkeerd — vereist mainnet-tokendeploys). Uitbreiding naar meerdere netwerken (Arbitrum, Avalanche en andere EVM-ketens) volgt na het beproeven op de testnet.

Volledige lijst: [docs/ROADMAP.md](docs/ROADMAP.md).

## Aan de slag (ontwikkelaars)

Vereisten: **Node.js 20+** en npm 10.x.

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

## Bijdragen

Bijdragen zijn welkom — code, bugmeldingen, functiesuggesties en voorstellen. Lees vóór je begint [CONTRIBUTING.md](CONTRIBUTING.md) en onze [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Repositories (mirrors)

| Spiegel  | URL                                        |
| -------- | ------------------------------------------ |
| GitHub   | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg | https://codeberg.org/limitafternoon/Evolve |
| GitLab   | https://gitlab.com/evolve-group3/evolve    |

## Documentatie

- [Wat & waarom](docs/WHAT-AND-WHY.md) — probleem, visie, kernwaarden
- [Hoe het werkt](docs/HOW-IT-WORKS.md) — gebruikersstromen, stap voor stap
- [Architectuur](docs/ARCHITECTURE.md) — monorepo, packages, datastromen
- [Tokenomics](docs/TOKENOMICS.md) — tokenmodel en verdeling van de voorraad
- [RewardVault-plan](docs/REWARD-VAULT-PLAN.md) — trustless emissie (gepland)
- [Roadmap](docs/ROADMAP.md) — mijlpalen en huidige status
- [FAQ](docs/FAQ.md) — veelgestelde vragen
- [Wallet-gids](docs/WALLETS.md) — hoe je wallets aanmaakt en donatieadressen krijgt

## Licentie

Uitgebracht onder de [MIT-licentie](LICENSE).

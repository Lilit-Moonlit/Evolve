[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)
<!-- evolve-readme-sync: 3796750887b0bd65 -->

# EVOLVE

**Dating, conceptie en geverifieerde gezondheid — standaard privé, betrouwbaar waar het ertoe doet.**

EVOLVE is een open-source, gedecentraliseerd platform voor mensen die het beu zijn om hun telefoonnummer, hun gezicht en hun meest intieme gezondheidsgegevens aan de database van iemand anders toe te vertrouwen. Je logt in met je eigen cryptowallet — geen telefoon, geen e-mail, geen KYC — en je kunt je account terugkrijgen via een on-chain DNA-commitment. Je gezondheidsgegevens blijven van jou: testresultaten worden automatisch geparset, de status van individuele pathogenen wordt **nooit** aan iemand getoond, en matching is uitsluitend gebaseerd op anonieme compatibiliteitsuitspraken (Safe / Compatible / Caution / Risk). Chat draait peer-to-peer via libp2p en Nostr, met een HTTP-fallback voor het gemak. Cadeaus en overdrachten bewegen richting volledige vertrouwelijkheid: cadeaus met een privé-afzender zijn vandaag al live, en een Railgun shielded wallet en een Aztec zero-knowledge-prototype staan op de roadmap (zie [Privacy & vertrouwelijke transacties](#privacy--vertrouwelijke-transacties)).

> **Status — demomodus, in actieve ontwikkeling.**
> Dating, conceptie, gezondheidsverificatie, de laboratoriumflow, P2P-chat, de EVOLVE-token en governance zijn allemaal geïmplementeerd en draaien in een **lokale demo** — de app is **nog niet publiek uitgerold**. Nog op de planning: een **mainnet-deployment en DEX-liquiditeit**, plus een **geplande publieke verkoop** (zie [De EVOLVE-token](#de-evolve-token-alleen-testnet)).
> Smart contracts zijn **uitsluitend op het Ethereum Sepolia-testnet** uitgerold. Niets hier is financieel advies of een investeringsaanbod.

> **Vind je EVOLVE nuttig? Steun de ontwikkeling — elke donatie gaat naar code, laboratoriumpartnerschappen, hosting en vertaling → [DONATE.md](DONATE.md).**

## Niets te vrezen

EVOLVE is gebouwd rond de vragen die mensen zich écht stellen voordat ze een platform als dit vertrouwen.

| De zorg                                           | Wat EVOLVE er al aan doet                                                                                                                                                                                                                                             |
| ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| "Mijn gezondheidsgegevens lekken uit."            | Individuele pathogeenresultaten worden **nooit** aan iemand getoond — alleen een anonieme uitspraak: Safe / Compatible / Caution / Risk.                                                                                                                              |
| "Mijn foto's belanden ergens."                    | Foto's zijn standaard wazig. De eigenaar verleent een weergave van **15 seconden** of **permanent** — op verzoek of proactief. Kijken is gratis.                                                                                                                      |
| "Ik moet mijn ID of telefoon afgeven."            | Wallet-login (SIWE). Geen telefoon, geen e-mail, geen KYC. Herstel werkt via een on-chain DNA-commitment.                                                                                                                                                             |
| "Hij of zij liegt over gezond zijn."              | Resultaten zijn **laboratoriumgeverifieerd** (QR + gezichtsmatching), en de tests van het stel worden **tijdens de ontmoeting** afgenomen — recente STD-resultaten tellen, DNA veroudert niet.                                                                        |
| "Neemt iemand mijn geld en verdwijnt ermee?"      | Conceptie draait op een echte, risicodragende inzet: de storting van een man schuift pas door wanneer het vaderschap is **bevestigd**; anders wordt deze gewoon aan hem teruggegeven.                                                                                 |
| "Is de token een pump-and-dump?"                  | De code is open (MIT); vrijwel de volledige voorraad is gereserveerd voor gebruikersbeloningen, en de niet-gecirculeerde reserve is gepland om vergrendeld te worden in een **kluis die niet leeggehaald kan worden** — waaruit zelfs de oprichter niets kan opnemen. |
| "Kan het platform worden afgesloten of verboden?" | Peer-to-peer berichtenverkeer voorop, gedecentraliseerde opslag (IPFS / Arweave), 18 EVM-netwerkconfiguraties en geen hardgecodeerd domein.                                                                                                                           |

## Wat & Waarom

Traditionele datingapps vragen je om je telefoonnummer, e-mail, foto's en intieme gezondheidsdetails in te ruilen voor een centrale database — en om die database daarna voor altijd te vertrouwen. EVOLVE vertrekt vanuit de tegenovergestelde premisse: **privacy als standaard, eigen beheer en geen enkel single point of failure**.

- **Privacy als standaard** — gezondheidsgegevens worden nooit blootgesteld; alleen anonieme uitspraken.
- **Weerstand tegen blokkades** — berichtenverkeer P2P-first, gedecentraliseerde opslag, multi-netwerkontwerp, geen hardgecodeerde domeinen.
- **Identiteit in eigen beheer** — je wallet is je inlog; DNA-gebaseerd herstel in plaats van e-mail of telefoon.
- **Geen KYC-drempel** — geen legitimatiebewijs, telefoon of e-mail nodig om het platform te gebruiken.

Lees de volledige onderbouwing in [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md).

## Gezondheid die je echt kunt vertrouwen

- Upload een STD-test als platte tekst of PDF (extractie uit de tekstlaag, met een OCR-fallback voor scans).
- De parser kent 8 pathogenen: HIV-1/2, syfilis, chlamydia, gonorroe, HSV-1, HSV-2, hepatitis B, hepatitis C — in Engelse, Oekraïense en Russische rapportformaten.
- **De status van individuele pathogenen wordt nooit aan andere gebruikers getoond.** Profielen tonen uitsluitend de anonieme uitspraak: **Safe / Compatible / Caution / Risk**.
- On-chain DNA-records (`DNAVerification.sol`) vormen de basis voor herstel en verificatie.

### Partnerlaboratoria — bewijs, geen beloftes

Loop een partnerlaboratorium binnen en toon je QR-code. Het lab scant de code, bevestigt je identiteit met **gezichtsmatching** (zodat niemand anders jouw resultaat kan ophalen) en koppelt het STD-rapport — PDF, scan of tekst, zelfs een slechte OCR. Het resultaat wordt ondertekend door een echt laboratorium, niet door jou, dus anderen zien een **geverifieerd feit** in plaats van jouw woord. En elke bevestigde verificatie betaalt **1 EVOLVE aan de patiënt en 1 EVOLVE aan het laboratorium** — beide kanten hebben een reden om eerlijk te zijn. Individuele pathogenen worden ook dan aan niemand getoond.

## Iemand vinden

- Zoekfilters: "Wat zoek je" (daten / conceptie / polyandre conceptie / STD-testen), "Wie zoek je" (mannen, vrouwen, stellen), cascaderende land → stad-selecties, "kan naar jouw land reizen" met lijsten per land, huidskleur, testvoorkeur, alleen STD-compatibel.
- Onboarding-wizard: leeftijd (verbergbaar), talen, bio, foto.
- **P2P-chat** via libp2p (gossipsub) + Nostr, met een HTTP-API-fallback.

## Conceptie

Twee manieren om een kind te plannen, en beide rusten op hetzelfde idee: echte intentie toon je met een echte inzet in EVOLVE — nooit met beloftes. De verbintenis van een man leeft in zijn EvolveFund-storting (vanaf 15 EVOLVE, minimaal 30 dagen vergrendeld), en een vrouw kan haar eigen minimale storting instellen voor de mannen die haar bereiken.

**Conceptie.** De vrouw leidt: zij nodigt een specifieke man uit en noemt hem in een bond. Hij heeft een actieve EvolveFund-storting nodig; wanneer beiden bevestigen, wordt die vergrendeld en start de aftelling. Een zwangerschap wordt gemeld tussen 14 en 30 dagen na de bevestiging, en de STD- en DNA-tests van het stel worden tijdens de ontmoeting zelf afgenomen — recente STD-resultaten tellen, DNA veroudert niet. Zodra het vaderschap is bevestigd, gaat de storting van de man naar de vrouw; wordt het niet bevestigd, dan wordt de storting gewoon aan hem vrijgegeven. Er verandert niets van eigenaar totdat de feiten vaststaan.

**Polyandre conceptie.** De keuze is van haar, en blijft privé. Zij opent een sessie die 48 uur loopt — zonder eigen storting (die mag ze uitsluitend toevoegen voor haar reputatie, als ze dat wil). Mannen met een actieve storting mogen deelnemen — tot 50 — en bevestigen, waardoor hun inzet wordt vergrendeld. Veertien dagen na het sluiten van de sessie wordt de vader gekozen. Hij krijgt zijn storting terug plus een beloning uit de pot: het dubbele van zijn storting en 1 EVOLVE voor elke andere deelnemer. De mannen die niet worden gekozen verliezen hun inzet — 90% gaat naar de vrouw, 10% naar de gekozen vader. Zij riskeert niets en kan alleen maar winnen; de mannen zetten hun inzet in voor het recht om gekozen te worden.

## Privacy & vertrouwelijke transacties

Privacy is de standaard — en EVOLVE bouwt aan een roadmap richting volledig vertrouwelijke on-chain overdrachten.

- **Privécadeaus** — stuur een roos 🌹 of een cactus 🌵 (1 EVOLVE) en kies wie kan zien dat jij het was: _publiek_, _anoniem voor iedereen behalve de ontvanger_, of _volledig anoniem_. In de anonieme modi reist het cadeau als een eenmalige voucher die de ontvanger met de eigen wallet claimt, zodat de afzender nooit on-chain verschijnt. (Afzenderanonimiteit is vandaag op gelegenheidsniveau: de financieringstransactie kan via tijdstip en bedrag worden gecorreleerd.)
- **Railgun shielded wallet** — een privé-wallet achter een featureflag (`VITE_RAILGUN_ENABLED`, standaard uit) die bedragen en adressen verbergt met Railguns live zero-knowledge pool. Dit is het pad naar echte afzenderanonimiteit.
- **Aztec-prototype** — dezelfde logica voor privé-overdrachten en privé-bonds, uitgedrukt als zero-knowledge Noir-circuits en gehouden achter een expliciete poort totdat Aztec productierijp is. Zie [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md).
- **Twee-walletmodel** — een publieke stake-wallet neemt deel aan governance; een privé shielded wallet wordt bewust **uitgesloten** van governance-gewicht, zodat privacy en stemkracht gescheiden blijven.

Details: [docs/RAILGUN-INTEGRATION.md](docs/RAILGUN-INTEGRATION.md) · [docs/SHIELDED-STAKES-DESIGN.md](docs/SHIELDED-STAKES-DESIGN.md) · [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md).

## De EVOLVE-token (alleen testnet)

- ERC-20, maximale voorraad **8.000.000.000 EVOLVE**. Adminacties worden afgeschermd door een 48-uurs `TimelockController`.
- **Geplande voorraadverdeling** — ontworpen om vrijwel de volledige voorraad te laten werken voor gebruikers, niet voor insiders:

| Doel                                                |        EVOLVE |
| --------------------------------------------------- | ------------: |
| Oprichters en team (salaris / beloning)             |    25.000.000 |
| DEX-reserve (toekomst)                              |     4.000.000 |
| Publieke verkoop (gepland)                          |     5.000.000 |
| Beloningsreserve — labs, patiënten, moeders, vaders | 7.966.000.000 |

- **Geplande publieke verkoop** — 5.000.000 EVOLVE, verkocht door de app tegen **$0,8 per stuk**, te betalen in elke token die de app ondersteunt; de opbrengst financiert de ontwikkeling. _(Gepland — nog niet live.)_
- **Trustloze emissie (gepland)** — de ~7.966.000.000 aan beloningsreserve moet worden vergrendeld in een niet leeg te halen `RewardVault`: deze wordt alleen geleidelijk vrijgegeven via beloningen voor labs, patiënten, moeders en vaders, en regelwijzigingen vereisen een governance-stemming. Zelfs de oprichter kan er niets uit opnemen. Ontwerp: [docs/REWARD-VAULT-PLAN.md](docs/REWARD-VAULT-PLAN.md).
- **Emoji-cadeauseconomie** — een cadeau kost 1 EVOLVE, evenredig verdeeld onder de bestaande cadeaueigenaren; een eeuwig verdienmodel, en cadeaus zijn overdraagbaar.
- **EvolveFund** — staking voor mannen (minimaal 15 EVOLVE, 30 dagen vergrendeld) die meetelt voor het governance-gewicht; vrouwen rekenen op hun wallet-saldo.
- **Verificatiebeloningen** — 1 EVOLVE voor de geverifieerde gebruiker en 1 EVOLVE voor het bevestigende lab per STD/DNA-verificatie (plus een faucet met snelheidsbeperking).
- **Governance** — het stemgewicht combineert recursieve reputatie (8 stemmen, diepte 3), het aandeel kinderen/vaderschap en ingezette of vastgehouden EVOLVE.
- **LayerZero OFT**-integratie voor toekomstige multichain EVOLVE-overdrachten (afhankelijkheden zijn aanwezig; voorbij Sepolia is nog niets uitgerold).

## Steun het project

EVOLVE is onafhankelijk en open-source. Als je het nuttig vindt, kun je de ontwikkeling steunen met een donatie — elke bijdrage gaat naar code, laboratoriumpartnerschappen, hosting en vertaling.

- **Donatiedetails (EVM, Monero en meer):** [DONATE.md](DONATE.md)
- **Meertalige donatiepagina (34 talen):** **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**

Een publieke tokenverkoop is **gepland** — 5.000.000 EVOLVE, verkocht door de app (zie [De EVOLVE-token](#de-evolve-token-alleen-testnet)). Donaties zijn geschenken die de open-source-ontwikkeling steunen en geen recht geven op tokens, aandelen, rendement of winst. Geef alleen wat je kunt missen.

## Architectuur & Tech Stack

Monorepo, beheerd met npm workspaces + Turborepo:

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

Belangrijkste smart contracts: `EVOLVE.sol` (ERC-20), `ProfileNFT.sol` (ERC-721), `TrustScore.sol`, `Voting.sol`, `Evolve2Earn.sol` (emoji-cadeaus + beloningen), `Governance.sol`, `BondManager.sol` (conceptie en polyandre conceptie), `EvolveFund.sol`, `VerificationRegistry.sol`, `DNAVerification.sol`, ERC-4337 `SmartAccountFactory` + `Paymaster`, en een OpenZeppelin `TimelockController`.

Details: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md)

## Roadmap

In uitvoering: productierijpheid van de webapp. Gepland: een on-chain labregister en testcertificering, een echte mailprovider-adapter voor het innemen van labrapporten, on-chain geverifieerde attestaties op profielen, de **trustloze RewardVault** met via governance afgeschermde emissie ([ontwerp](docs/REWARD-VAULT-PLAN.md)), de **publieke tokenverkoop**, een update van de token-vesting voor de oprichtersallocatie, en het leveren van DEX-liquiditeit (momenteel geblokkeerd — dit vereist mainnet-deployments van de token). Op het gebied van privacy zijn de cadeaus met privé-afzender klaar, terwijl de Railgun shielded wallet en de Aztec-migratie van privé-bonds achter de controles in [docs/ROADMAP.md](docs/ROADMAP.md) en [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md) blijven wachten. Uitbreiding naar meerdere netwerken (Arbitrum, Avalanche en andere EVM-chains) volgt nadat het testnet is verhard.

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

Bijdragen zijn welkom — code, bugrapporten, functiesuggesties en voorstellen. Lees voor je begint [CONTRIBUTING.md](CONTRIBUTING.md) en onze [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Repositories (mirrors)

| Mirror   | URL                                        |
| -------- | ------------------------------------------ |
| GitHub   | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg | https://codeberg.org/limitafternoon/Evolve |
| GitLab   | https://gitlab.com/evolve-group3/evolve    |

## Documentatie

- [Wat & Waarom](docs/WHAT-AND-WHY.md) — probleem, visie, kernwaarden
- [Hoe het werkt](docs/HOW-IT-WORKS.md) — gebruikersflows, stap voor stap
- [Architectuur](docs/ARCHITECTURE.md) — monorepo, packages, datastromen
- [Tokenomics](docs/TOKENOMICS.md) — tokenmodel en voorraadverdeling
- [RewardVault-plan](docs/REWARD-VAULT-PLAN.md) — trustloze emissie (gepland)
- [Railgun-integratie](docs/RAILGUN-INTEGRATION.md) — integratiespike voor de shielded wallet
- [Afgeschermde stakes](docs/SHIELDED-STAKES-DESIGN.md) — privé-stakes voor conceptie (ontwerp)
- [Aztec-prototype](docs/AZTEC-PROTOTYPE.md) — ZK-privé-overdrachten & -bonds (onderzoek)
- [Roadmap](docs/ROADMAP.md) — mijlpalen en huidige status
- [FAQ](docs/FAQ.md) — veelgestelde vragen
- [Wallet-gids](docs/WALLETS.md) — hoe je wallets aanmaakt en aan donatieadressen komt

## Licentie

Uitgebracht onder de [MIT-licentie](LICENSE).

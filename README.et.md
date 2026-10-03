[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)

# EVOLVE

**Tutvumine, eostamine ja kontrollitud tervis — vaikimisi privaatne, usaldusväärne seal, kus see loeb.**

EVOLVE on avatud lähtekoodiga detsentraliseeritud platvorm inimestele, kes on tüdinud oma telefoninumbri, näo ja kõige intiimsemate terviseandmete andmisest kellegi teise andmebaasi. Logite sisse oma krüptorahakotiga — ei telefoni, ei e-posti, ei KYC-d — ja saate oma konto tagasi plokkahelas oleva DNA-kohustuse kaudu. Terviseandmed jäävad teie omaks: testitulemusi parsitakse automaatselt, üksikute patogeenide olekuid **ei näidata kunagi** kellelegi, ja sobitamine põhineb ainult anonüümsetel ühilduvusotsustel (Safe / Compatible / Caution / Risk). Vestlus töötab võrdõiguslikult (peer-to-peer) libp2p ja Nostri kaudu, mugavuse tagab HTTP-varuvariant.

> **Olek — platvorm töötab juba täna; põhivõrk ja DEX on järgmisena.**
> Tutvumine, eostamine, tervise kontrollimine, laboratooriumivoog, P2P-vestlus, EVOLVE token ja juhtimine — kõik töötavad. Ees ootavad veel: **põhivõrgu juurutamine ja DEX-i likviidsus** ning **planeeritud avalik müük** (vt [EVOLVE token](#evolve-token-ainult-testvõrk)).
> Nutilepingud on juurutatud **ainult Ethereum Sepolia testvõrgus**. Mitte miski siin ei ole finantsnõuanne ega investeerimispakkumine.

> **Leiate, et EVOLVE on kasulik? Toetage arendust — iga annetus läheb koodi, laboripartnerlustesse, majutusse ja tõlkesse → [DONATE.md](DONATE.md).**

## Pole midagi karta

EVOLVE ehitati küsimuste ümber, mida inimesed tegelikult esitavad, enne kui hakkavad sellisele platvormile usaldama.

| Mure                                          | Mida EVOLVE juba selle vastu teeb                                                                                                                                          |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| "Minu terviseandmed lekivad."                 | Üksikute patogeenide tulemusi **ei näidata kunagi** kellelegi — ainult anonüümne otsus: Safe / Compatible / Caution / Risk.                                                |
| "Minu fotod satuvad kuhugi."                  | Fotod on vaikimisi hägustatud. Omanik annab **15-sekundilise** või **püsiva** vaatamisõiguse — taotluse peale või oma algatusel. Vaatamine on tasuta.                      |
| "Peaksin üle andma isikutõendi või telefoni." | Rahakotiga sisselogimine (SIWE). Ei telefoni, ei e-posti, ei KYC-d. Taastamine toimib plokkahelas oleva DNA-kohustuse kaudu.                                               |
| "Ta valetab, et on terve."                    | Tulemused on **laborikontrollitud** (QR + näokattumine) ja paari testid tehakse **kohtumise ajal endal** — värskeid STD-tulemusi loeb, DNA ei vanane.                      |
| "Kas keegi võtab mu raha ja kaob?"            | Eostamine toimib tegeliku, ohustatud panusega: mehe tagatis liigub ainult siis, kui isadus on **kinnitatud**; muidu lihtsalt tagastatakse see talle.                       |
| "Kas token on pump-and-dump?"                 | Täna ei ole ükski müük käimas; kood on avatud (MIT); käibele võtmata reserv plaanitakse lukustada **tühjendamatusse hoidlasse**, millest ei saa välja võtta isegi asutaja. |
| "Kas platvormi saab sulgeda või keelata?"     | Kõigepealt võrdõiguslik sõnumivahetus, detsentraliseeritud salvestus (IPFS / Arweave), 18 EVM-i võrgukonfiguratsiooni ja ühtegi kõvasti kodeeritud domeeni.                |

## Mis & miks

Traditsioonilised tutvusrakendused paluvad teil vahetada oma telefoninumber, e-post, fotod ja intiimsed terviseandmed keskset andmebaasi vastu — ja seejärel seda andmebaasi igaveseks usaldada. EVOLVE lähtub vastupidisest eeldusest: **privaatsus vaikimisi, enesehoid (self-custody) ja ükski üksik rikkepunkt**.

- **Privaatsus vaikimisi** — terviseandmeid ei paljastata kunagi; ainult anonüümsed otsused.
- **Keelustamiskindlus** — kõigepealt P2P-sõnumid, detsentraliseeritud salvestus, mitme võrgu disain, ei kõvasti kodeeritud domeene.
- **Enesehoitud identiteet** — teie rahakott on teie sisselogimine; DNA-põhine taastamine e-posti või telefoni asemel.
- **Ei KYC-tõket** — platvormi kasutamiseks ei nõuta riiklikku isikut tõendavat dokumenti, telefoni ega e-posti.

Loe kogu põhjendust failist [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md).

## Tervis, mida saab tegelikult usaldada

- Laadige STD-test üles toortekstina või PDFina (tekstikihi eraldamine, OCR-varuvariant skannide jaoks).
- Parser tunneb 8 patogeeni: HIV-1/2, süüfilis, klamüüdia, gonorrea, HSV-1, HSV-2, B-hepatiit, C-hepatiit — inglise, ukraina ja vene aruannete vormingus.
- **Üksiku patogeeni olekut ei näidata teistele kasutajatele kunagi.** Profiilid näitavad ainult anonüümset otsust: **Safe / Compatible / Caution / Risk**.
- Plokkahela DNA-kanded (`DNAVerification.sol`) võimaldavad taastamist ja kontrollimist.

### Partnerlaborid — tõendid, mitte lubadused

Sisenege partnerlaborisse ja näidake oma QR-koodi. Labor skaneerib selle, kinnitab teie identiteedi **näokattumisega** (et keegi teine ei saaks teie tulemust kätte) ja manustab STD-aruande — PDF, skann või tekst, isegi halva OCR-iga. Tulemuse allkirjastab päris laboratoorium, mitte teie, nii et teised näevad **kontrollitud fakti** teie sõna asemel. Ja iga kinnitatud kontroll maksab **1 EVOLVE patsiendile ja 1 EVOLVE laborile** — mõlemal poolel on põhjus aus olla. Üksikuid patogeene ei näidata ikkagi kunagi kellelegi.

## Kellegi leidmine

- Otsingufiltrid: "Mida te otsite" (tutvumine / eostamine / polüandriline eostamine / STD-testimine), "Keda te otsite" (mehed, naised, paarid), kaskaadsed riik → linn valikud, "saab teie riiki tulla" riigiti loenditega, nahavärv, testimise eelistus, ainult STD-ühilduvad.
- Tutvumisviisard: vanus (peideldav), keeled, elulookirjeldus, foto.
- **P2P-vestlus** libp2p (gossipsub) + Nostr kaudu, HTTP-API varuvariandiga.

## Eostamine

Kaks viisi last planeerida, ja mõlemad põhinevad samal ideel: tõelist kavatsust näidatakse tegeliku EVOLVE-panusega — mitte kunagi lubadustega. Mehe pühendumus elab tema EvolveFund-tagatises (alates 15 EVOLVE, lukustatud vähemalt 30 päevaks), ja naine saab määrata oma minimaalse tagatise meestele, kes temani jõuavad.

**Eostamine.** Naine juhib: ta kutsub konkreetse mehe ja nimetab ta sidemesse. Mehele on vaja aktiivset EvolveFund-tagatist; kui mõlemad kinnitavad, see lukustatakse ja loendamine algab. Rasedusest teatatakse 14 kuni 30 päeva pärast kinnitamist, ja paari STD- ning DNA-testid tehakse kohtumise ajal endal — värskeid STD-tulemusi loeb, DNA ei vanane. Kui isadus on kinnitatud, läheb mehe tagatis naisele; kui seda ei kinnitata, tagatis lihtsalt vabastatakse talle tagasi. Mitte miski ei vaheta omanikku enne, kui faktid on selged.

**Polüandriline eostamine.** Valik kuulub naisele ja jääb privaatseks. Ta avab sessiooni, mis kestab 48 tundi — ilma enda tagatiseta (ainult maine jaoks võib ta selle lisada, kui soovib). Mehed aktiivse tagatisega võivad liituda — kuni 50 — ja kinnitada, mis lukustab nende panuse. Neliteist päeva pärast sessiooni sulgemist valitakse isa. Ta saab oma tagatise tagasi pluss preemia fondist: topelt oma tagatis ja 1 EVOLVE iga teise osaleja kohta. Mittevalitud mehed kaotavad oma panuse — 90 % naisele, 10 % valitud isale. Ta ei riski mitte millegagi ja saab ainult võita; mehed panevad oma panuse õiguse taha, et neid valitaks.

## EVOLVE token (ainult testvõrk)

- ERC-20, maksimaalne pakkumine **8,000,000,000 EVOLVE**. Admini toiminguid piirab 48-tunnine `TimelockController`.
- **Planeeritud pakkumise jaotus** — loodud nii, et peaaegu kogu pakkumine töötaks kasutajate heaks, mitte siseringi heaks:

| Eesmärk                                            |        EVOLVE |
| -------------------------------------------------- | ------------: |
| Asutajad ja meeskond (palk / preemia)              |    25,000,000 |
| DEX-i reserv (tulevik)                             |     4,000,000 |
| Avalik müük (planeeritud)                          |     5,000,000 |
| Preemiate reserv — laborid, patsiendid, emad, isad | 7,966,000,000 |

- **Planeeritud avalik müük** — 5,000,000 EVOLVE müüb rakendus hinnaga **$0.8 tükk**, makstava mis tahes rakenduse toetatud tokeniga; tulud rahastavad arendust. _(Planeeritud — veel pole käimas.)_
- **Usalduseta emissioon (planeeritud)** — ~7,966,000,000 preemiate reserv plaanitakse lukustada tühjendamatusse `RewardVault`-i: see vabaneb ainult järk-järgult labori-, patsiendi-, ema- ja isapreemiatena, ja reeglite muutmine nõuab juhtimishääletust. Isegi asutaja ei saa sealt välja võtta. Disain: [docs/REWARD-VAULT-PLAN.md](docs/REWARD-VAULT-PLAN.md).
- **Emojikingituste majandus** — kingitus maksab 1 EVOLVE, mis jaotatakse proportsionaalselt olemasolevate kingituste omanike vahel; lõputu tulude mudel, ja kingitused on ülekantavad.
- **EvolveFund** — meeste staking (vähemalt 15 EVOLVE, 30-päevane lukustus), mis läheb juhtimiskaalu; naised kasutavad oma rahakoti jääki.
- **Kontrollimise preemiad** — 1 EVOLVE kontrollitud kasutajale ja 1 EVOLVE kinnitavale laborile iga STD-/DNA-kontrolli kohta (pluss mahupiirangutega kraan).
- **Juhtimine** — hääle kaal ühendab rekursiivse maine (8 häält, sügavus 3), laste/isaduse osa ning stakingus või hoitud EVOLVE-id.
- **LayerZero OFT** integratsioon tulevasteks mitme ahela EVOLVE ülekanneteks (sõltuvused olemas; Sepoliast kaugemale pole veel midagi juurutatud).

## Toetage projekti

EVOLVE on sõltumatu ja avatud lähtekoodiga. Kui see on teile kasulik, saate toetada arendust annetusega — iga panus läheb koodi, laboripartnerlustesse, majutusse ja tõlkesse.

- **Annetuse üksikasjad (EVM, Monero ja palju muud):** [DONATE.md](DONATE.md)
- **Mitmekeelne annetamisleht (34 keelt):** **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**

Avalik tokenimüük on tegevuskavas, kuid see **pole** täna käimas. Annetused on kingitused, mis toetavad avatud lähtekoodiga arendust ega anna õigust tokenitele, osalusele, tulule ega kasumile. Annake ainult seda, mida saate endale lubada kaotada.

## Arhitektuur & tehnoloogiapinu

Monorepo, mida hallatakse npm workspaces + Turborepo abil:

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

Põhilised nutilepingud: `EVOLVE.sol` (ERC-20), `ProfileNFT.sol` (ERC-721), `TrustScore.sol`, `Voting.sol`, `Evolve2Earn.sol` (emojikingitused + preemiad), `Governance.sol`, `BondManager.sol` (eostamine ja polüandriline eostamine), `EvolveFund.sol`, `VerificationRegistry.sol`, `DNAVerification.sol`, ERC-4337 `SmartAccountFactory` + `Paymaster` ning OpenZeppelini `TimelockController`.

Üksikasjad: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md)

## Tegevuskava

Töös: veebirakenduse tootmisvalmidus. Planeeritud: plokkahelas laboriregister ja testide sertifitseerimine, päris e-posti teenusepakkuja adapter laboriaruannete vastuvõtuks, plokkahelas kontrollitud tunnistused profiilidel, **usalduseta RewardVault** juhtimisega piiratud emissiooniga ([disain](docs/REWARD-VAULT-PLAN.md)), **avalik tokenimüük**, tokenite vestingu uuendus asutaja allokeerimise jaoks ning DEX-i likviidsuse tagamine (praegu blokeeritud — see nõuab tokenite juurutusi põhivõrkudes). Mitme võrgu laienemine (Arbitrum, Avalanche ja teised EVM-ahelad) järgneb testvõrgu kõvastumisele.

Täielik loend: [docs/ROADMAP.md](docs/ROADMAP.md).

## Alustamine (arendajad)

Nõuded: **Node.js 20+** ja npm 10.x.

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

## Kaasamine

Panused on teretulnud — kood, vearaportid, funktsioonisoovitused ja ettepanekud. Palun lugege enne alustamist [CONTRIBUTING.md](CONTRIBUTING.md) ja meie [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Hoidlad (peegeldused)

| Peegeldus | URL                                        |
| --------- | ------------------------------------------ |
| GitHub    | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg  | https://codeberg.org/limitafternoon/Evolve |
| GitLab    | https://gitlab.com/evolve-group3/evolve    |

## Dokumentatsioon

- [Mis & miks](docs/WHAT-AND-WHY.md) — probleem, visioon, tuumväärtused
- [Kuidas see töötab](docs/HOW-IT-WORKS.md) — kasutajavood, samm-sammult
- [Arhitektuur](docs/ARCHITECTURE.md) — monorepo, pakid, andmevood
- [Tokenomics](docs/TOKENOMICS.md) — tokeni mudel ja pakkumise jaotus
- [RewardVaulti plaan](docs/REWARD-VAULT-PLAN.md) — usalduseta emissioon (planeeritud)
- [Tegevuskava](docs/ROADMAP.md) — verstapostid ja praegune seis
- [KKK](docs/FAQ.md) — korduma kippuvad küsimused
- [Rahakoti juhend](docs/WALLETS.md) — kuidas luua rahakotte ja saada annetusaadresse

## Litsents

Litsentseeritud [MIT litsentsi alusel](LICENSE).

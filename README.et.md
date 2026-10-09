[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)
<!-- evolve-readme-sync: 3796750887b0bd65 -->

# EVOLVE

**Tutvumine, eostus ja kontrollitud tervis — vaikimisi privaatne, usaldusväärne seal, kus see tõesti loeb.**

EVOLVE on avatud lähtekoodiga detsentraliseeritud platvorm inimestele, kes ei taha enam loovutada oma telefoninumbrit, oma nägu ega kõige intiimsemaid terviseandmeid võõrasse andmebaasi. Logite sisse oma krüptorahakotiga — telefoni, e-posti ega KYC-d pole vaja — ja oma konto saate tagasi plokiahelasse salvestatud DNA-kohustuse abil. Teie terviseandmed jäävad teie omaks: testitulemused parsitakse automaatselt, üksikute patogeenide olekuid **ei näidata kunagi** kellelegi ning sobitamine tugineb üksnes anonüümsetele kokkusobivushinnangutele (Ohutu / Ühilduv / Ettevaatlik / Riskantne). Vestlus toimub P2P-põhiselt libp2p ja Nostr vahendusel, mugavuse huvides on olemas HTTP-varutee. Kingitused ja ülekanded liiguvad täieliku konfidentsiaalsuse suunas: saatjapoolse privaatsusega kingitused on täna juba olemas, Railguni varjatud rahakott ja Azteci nuliteadmiste prototüüp seisavad teekonnakaardil (vt [Privaatsus ja konfidentsiaalsed ülekanded](#privacy--confidential-transactions)).

> **Olek — demorežiim, areneb aktiivselt.**
> Tutvumine, eostus, terviseandmete verifitseerimine, laborivoog, P2P-vestlus, EVOLVE token ja valitsemine on kõik teostatud ja töötavad **kohalikus demos** — rakendus **pole veel avalikult juurutatud**. Ees ootab veel: **peavõrgu juurutamine ja DEX-i likviidsus** ning **planeeritud avalik müük** (vt [EVOLVE token](#the-evolve-token-testnet-only)).
> Nutikad lepingud on paigaldatud **ainult Ethereumi Sepolia testvõrku**. Miski siin ei ole finantsnõuanne ega investeerimispakkumine.

> **Leiate, et EVOLVE on kasulik? Toetage arendust — iga annetus läheb koodi, laboripartnerlustesse, hostimisse ja tõlgetesse → [DONATE.md](DONATE.md).**

## Pole midagi karta

EVOLVE on üles ehitatud küsimuste ümber, mida inimesed tõepoolest esitavad, enne kui hakkavad sellist platvormi usaldama.

| Mure                                       | Mida EVOLVE juba teeb                                                                                                                                                                                                        |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| "Minu terviseandmed lekivad."              | Üksikute patogeenide tulemusi **ei näidata kunagi** kellelegi — ainult anonüümne hinnang: Ohutu / Ühilduv / Ettevaatlik / Riskantne.                                                                                         |
| "Minu fotod satuvad kuhugi."               | Fotod on vaikimisi hägustatud. Omanik annab **15-sekundilise** või **püsiva** vaatamisõiguse — taotluse alusel või omaalgatuslikult. Vaatamine on tasuta.                                                                    |
| "Pean üle andma isikutõendi või telefoni." | Sisselogimine rahakotiga (SIWE). Ei telefoni, ei e-posti, ei KYC-d. Taastamine toimub plokiahelasse salvestatud DNA-kohustuse kaudu.                                                                                         |
| "Ta valetab, et on terve."                 | Tulemused on **labori poolt kinnitatud** (QR + näotuvastus) ja paari testid tehakse **juba kohtumise ajal** — STD-tulemuste värskus loeb, DNA ei vanane.                                                                     |
| "Kas keegi võtab mu raha ja kaob?"         | Eostus toimib päris, riskiga panusel: mehe tagatis liigub alles siis, kui isadus on **kinnitatud**; vastasel juhul lihtsalt tagastatakse see talle.                                                                          |
| "Kas token on pump-and-dump?"              | Kood on avatud (MIT); peaaegu kogu pakkumine on reserveeritud kasutajate preemiateks ning käibele viimata reserv plaanitakse lukustada **tühjendamatusse hoidlasse**, millest ei saa midagi välja võtta isegi mitte asutaja. |
| "Kas platvormi saab sulgeda või keelata?"  | Eelkõige P2P-sõnumside, detsentraliseeritud salvestus (IPFS / Arweave), 18 EVM-võrgu seadistust ja ühtegi kõvasti kodeeritud domeeni.                                                                                        |

## Mis ja miks

Traditsioonilised tutvumisrakendused paluvad teil vahetada oma telefoninumber, e-posti aadress, fotod ja intiimsed tervise üksikasjad keskse andmebaasi vastu — ja seejärel seda andmebaasi igaveseks usaldada. EVOLVE lähtub vastupidisest eeldusest: **privaatsus vaikimisi, identiteedi ja varade isevaldus ning mitte ühtegi üksikut rikkepunkti**.

- **Privaatsus vaikimisi** — terviseandmeid ei paljastata kunagi; ainult anonüümsed hinnangud.
- **Keelamiskindlus** — sõnumside eelkõige P2P-põhiselt, detsentraliseeritud salvestus, mitme võrgu disain, kõvasti kodeeritud domeene pole.
- **Isehallatav identiteet** — teie rahakott on teie sisselogimine; DNA-põhine taastamine e-posti või telefoni asemel.
- **KYC-tõket pole** — platvormi kasutamiseks pole vaja riiklikku isikutunnistust, telefoni ega e-posti.

Loege kogu põhjendus failist [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md).

## Tervis, mida saab tõepoolest usaldada

- Laadige STD-test üles toortekstina või PDF-ina (tekstikihi eraldamine, skannide jaoks OCR-varutee).
- Parser tunneb 8 patogeeni: HIV-1/2, süüfilis, klamüüdia, gonorröa, HSV-1, HSV-2, B-hepatiit, C-hepatiit — ingliskeelsetes, ukrainakeelsetes ja venekeelsetes aruannete vormingutes.
- **Üksiku patogeeni olekut ei kuvata teistele kasutajatele kunagi.** Profiilid näitavad ainult anonüümset hinnangut: **Ohutu / Ühilduv / Ettevaatlik / Riskantne**.
- Plokiahelas hoitavad DNA-kirjed (`DNAVerification.sol`) võimaldavad taastamist ja verifitseerimist.

### Partnerlaborid — tõendid, mitte lubadused

Astuge partnerlaborisse ja näidake oma QR-koodi. Labor skaneerib selle, kinnitab teie isiku **näotuvastusega** (et keegi teine ei saaks teie tulemust kätte) ja manustab STD-aruanne — PDF, skann või tekst, isegi halva OCR-i korral. Tulemuse allkirjastab päris laboratoorium, mitte teie, nii et teised näevad teie sõna asemel **kinnitatud fakti**. Ja iga kinnitatud verifitseerimine maksab **1 EVOLVE patsiendile ja 1 EVOLVE laborile** — mõlemal poolel on põhjus olla aus. Üksikuid patogeene ei näidata ikkagi kunagi kellelegi.

## Kellegi leidmine

- Otsingufiltrid: "Mida te otsite" (tutvumine / eostus / polüandrine eostus / STD-testimine), "Keda te otsite" (mehed, naised, paarid), kaskaadsed riigi → linna valikud, "saab teie riiki tulla" riigipõhiste loenditega, nahavärv, testimise eelistus, ainult STD-ühilduvad.
- Registreerimisviisard: vanus (peidetav), keeled, enda kirjeldus, foto.
- **P2P-vestlus** libp2p (gossipsub) + Nostr vahendusel, HTTP API varuteega.

## Eostus

Kaks viisi last planeerida, ja mõlemad tuginevad samale ideele: tõsist kavatsust näitab tõsine panus EVOLVE-s — mitte kunagi lubadused. Mehe pühendumus elab tema EvolveFundi tagatises (alates 15 EVOLVE, lukustatud vähemalt 30 päevaks), ja naine võib ise kehtestada minimaalse tagatise meestele, kes temani jõuavad.

**Eostus.** Naine juhib: ta kutsub välja konkreetse mehe ja nimetab ta sidemesse. Mehele on vaja aktiivset EvolveFundi tagatist; kui mõlemad kinnitavad, läheb see lukku ja algab tagasilugemine. Rasedusest teatatakse 14 kuni 30 päeva jooksul pärast kinnitust, ja paari STD- ning DNA-testid tehakse juba kohtumise käigus — STD-tulemuste värskus loeb, DNA ei vanane. Kui isadus on kinnitatud, läheb mehe tagatis naisele; kui see ei kinnitu, tagatis lihtsalt vabastatakse talle tagasi. Mitte miski ei vaheta omanikku enne, kui faktid on paigas.

**Polüandrine eostus.** Valik kuulub talle ja jääb privaatseks. Ta avab 48 tundi kestva sessiooni — ilma enda tagatiseta (soovi korral võib ta lisada ühe ainult maine jaoks). Aktiivse tagatisega mehed võivad liituda — kuni 50 — ja kinnitada, mis nende panuse lukustab. Neliteist päeva pärast sessiooni sulgumist valitakse isa. Ta saab oma tagatise tagasi koos preemiaga fondist: kaks korda oma tagatis ja 1 EVOLVE iga teise osaleja kohta. Mittevalitud mehed kaotavad oma panuse — 90% naisele, 10% valitud isale. Ta ei riski millegagi ja saab ainult võita; mehed seavad oma panuse õiguse tagant olla valitud.

## Privaatsus ja konfidentsiaalsed ülekanded

Privaatsus on vaikeolek — ja EVOLVE liigub teekonnakaardi abil täielikult konfidentsiaalsete plokiahela ülekannete poole.

- **Privaatsed kingitused** — saatke roos 🌹 või kaktus 🌵 (1 EVOLVE) ja valige, kes näeb, et saatja olite teie: _avalik_, _anonüümne kõigile peale saaja_ või _täielikult anonüümne_. Anonüümsetes režiimides liigub kingitus ühekordse vautšerina, mille saaja lunastab oma rahakotiga, nii et saatja ei ilmu ahelasse kunagi. (Saatja anonüümsus on täna levinud vaatleja tasandil: rahastamistehingu saab ajast ja summast kokku viia.)
- **Railguni varjatud rahakott** — funktsioonilipu taga olev privaatne rahakott (`VITE_RAILGUN_ENABLED`, vaikimisi väljalülitatud), mis peidab summad ja aadressid Railguni töötava nuliteadmise pooli abil. See on tee tõelise saatja anonüümsuseni.
- **Azteci prototüüp** — sama privaatse ülekande ja privaatse sideme loogika, väljendatud nuliteadmise vooluringitena Noir'is ja hoitud eraldi lüliti taga, kuni Aztec on tootmisvalmis. Vaadake [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md).
- **Kahe rahakoti mudel** — avalik panustamisrahakott osaleb valitsemises; privaatne varjatud rahakott on tahtlikult valitsemiskaalust **välja arvatud**, hoides privaatsuse ja hääletusjõu eraldi.

Üksikasjad: [docs/RAILGUN-INTEGRATION.md](docs/RAILGUN-INTEGRATION.md) · [docs/SHIELDED-STAKES-DESIGN.md](docs/SHIELDED-STAKES-DESIGN.md) · [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md).

## EVOLVE token (ainult testvõrk)

- ERC-20, maksimaalne pakkumine **8,000,000,000 EVOLVE**. Haldustoimingud on piiratud 48-tunnise `TimelockController`-iga.
- **Planeeritud pakkumise jaotus** — kujundatud nii, et peaaegu kogu pakkumine töötaks kasutajate kasuks, mitte siseringi kasuks:

| Eesmärk                                         |        EVOLVE |
| ----------------------------------------------- | ------------: |
| Asutajad ja meeskond (palk / preemia)           |    25,000,000 |
| DEX-i reserv (tulevik)                          |     4,000,000 |
| Avalik müük (planeeritud)                       |     5,000,000 |
| Preemiareserv — laborid, patsiendid, emad, isad | 7,966,000,000 |

- **Planeeritud avalik müük** — 5,000,000 EVOLVE, mida müüb rakendus hinnaga **$0.8 tükk**, maksta saab mis tahes rakenduse toetatud tokeniga; tulud rahastavad arendust. _(Planeeritud — veel käivitumata.)_
- **Usalduseta emissioon (planeeritud)** — umbes 7,966,000,000 EVOLVE suurune preemiareserv plaanitakse lukustada tühjendamatusse `RewardVault`-i: see vabaneb ainult järk-järgult labori-, patsiendi-, ema- ja isapreemiatena ning reeglite muutmiseks on vaja valitsemishääletust. Ei saa välja võtta isegi mitte asutaja. Disain: [docs/REWARD-VAULT-PLAN.md](docs/REWARD-VAULT-PLAN.md).
- **Emojikingituste majandus** — kingitus maksab 1 EVOLVE, mis jaguneb proportsionaalselt olemasolevate kingituste omanike vahel; lõputu tulumudel ning kingitused on üleantavad.
- **EvolveFund** — meeste panustamine ehk staking (vähemalt 15 EVOLVE, 30-päevane lukustus), mis loeb kaasa valitsemiskaalus; naised kasutavad oma rahakoti jääki.
- **Verifitseerimise preemiad** — 1 EVOLVE verifitseeritud kasutajale ja 1 EVOLVE kinnitavale laborile iga STD/DNA-verifitseerimise eest (lisaks piirangutega testkraan).
- **Valitsemine** — hääle kaal ühendab rekursiivse maine (8 häält, sügavus 3), laste/isaduse osa ning panditud või hoitud EVOLVE-i.
- **LayerZero OFT** integratsioon tulevasteks mitmeahelalisteks EVOLVE ülekanneteks (sõltuvused olemas; Sepoliast kaugemale pole veel midagi juurutatud).

## Toetage projekti

EVOLVE on sõltumatu ja avatud lähtekoodiga. Kui see on teile kasulik, võite arendust toetada annetusega — iga panus läheb koodi, laboripartnerlustesse, hostimisse ja tõlgetesse.

- **Annetuse üksikasjad (EVM, Monero ja palju muud):** [DONATE.md](DONATE.md)
- **Mitmekeelne annetamisleht (34 keelt):** **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**

Avalik tokenimüük on **planeeritud** — 5,000,000 EVOLVE, mida müüb rakendus (vt [EVOLVE token](#the-evolve-token-testnet-only)). Annetused on kingitused, mis toetavad avatud lähtekoodiga arendust ega anna õigust ühelegi tokenile, osalusele, tootlusele ega kasumile. Palun andke ainult nii palju, kui võite endale kaotada lubada.

## Arhitektuur ja tehnoloogiad

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

Põhilised nutikad lepingud: `EVOLVE.sol` (ERC-20), `ProfileNFT.sol` (ERC-721), `TrustScore.sol`, `Voting.sol`, `Evolve2Earn.sol` (emojikingitused + preemiad), `Governance.sol`, `BondManager.sol` (eostus ja polüandrine eostus), `EvolveFund.sol`, `VerificationRegistry.sol`, `DNAVerification.sol`, ERC-4337 `SmartAccountFactory` + `Paymaster` ning OpenZeppelini `TimelockController`.

Üksikasjad: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md)

## Teekonnakaart

Käimas: veebirakenduse tootmisvalmidus. Planeeritud: plokiahelapõhine laboriregister ja testide sertifitseerimine, päris e-postiteenuse pakkuja adapter laboriaruannete vastuvõtmiseks, plokiahelapõhiselt verifitseeritud kinnitused profiilidel, **usalduseta RewardVault** valitsemisega piiratud emissiooniga ([disain](docs/REWARD-VAULT-PLAN.md)), **avalik tokenimüük**, asutaja eraldise tokenite vestingu uuendus ning DEX-i likviidsuse paigaldamine (praegu blokeeritud — see nõuab tokenite juurutamist peavõrku). Privaatsuse poolel on saatjapoolt privaatsed kingitused valmis, samas kui Railguni varjatud rahakott ja Azteci privaatse sideme migreerimine jäävad [docs/ROADMAP.md](docs/ROADMAP.md) ja [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md) kontrollide taha. Mitme võrgu laienemine (Arbitrum, Avalanche ja teised EVM-ahelad) järgneb pärast testvõrgu kõvastumist.

Täielik loend: [docs/ROADMAP.md](docs/ROADMAP.md).

## Alustamine (arendajatele)

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

## Kaastöö

Kaastöö on teretulnud — kood, veateated, funktsioonisoovitused ja ettepanekud. Palun lugege enne alustamist [CONTRIBUTING.md](CONTRIBUTING.md) ja meie [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Hoidlad (peeglid)

| Peegel   | URL                                        |
| -------- | ------------------------------------------ |
| GitHub   | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg | https://codeberg.org/limitafternoon/Evolve |
| GitLab   | https://gitlab.com/evolve-group3/evolve    |

## Dokumentatsioon

- [Mis ja miks](docs/WHAT-AND-WHY.md) — probleem, visioon, põhiväärtused
- [Kuidas see töötab](docs/HOW-IT-WORKS.md) — kasutajavood, samm-sammult
- [Arhitektuur](docs/ARCHITECTURE.md) — monorepo, paketid, andmevood
- [Tokenomika](docs/TOKENOMICS.md) — tokeni mudel ja pakkumise jaotus
- [RewardVaulti plaan](docs/REWARD-VAULT-PLAN.md) — usalduseta emissioon (planeeritud)
- [Railguni integratsioon](docs/RAILGUN-INTEGRATION.md) — varjatud rahakoti integratsiooni väljavõte
- [Varjatud panused](docs/SHIELDED-STAKES-DESIGN.md) — privaatsed eostuspanused (disain)
- [Azteci prototüüp](docs/AZTEC-PROTOTYPE.md) — ZK-privaatülekanded ja -sidemed (uurimus)
- [Teekonnakaart](docs/ROADMAP.md) — verstapostid ja praegune seis
- [KKK](docs/FAQ.md) — korduma kippuvad küsimused
- [Rahakoti juhend](docs/WALLETS.md) — kuidas rahakotte luua ja annetamisaadresse hankida

## Litsents

Litsentseeritud [MIT litsentsi](LICENSE) alusel.

[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)

# EVOLVE

**Tutvumine, eostamine ja tervise verifitseerimine — vaikimisi privaatne, verifitseeritud seal, kus see loeb.**

EVOLVE on avatud lähtekoodiga detsentraliseeritud platvorm kontrollitavate intiimsete suhete jaoks: tutvumine, eostamine ja anonüümne suguhaiguste/DNA-ga ühilduvus. Logite sisse oma krüptorahakotiga (Sign-In with Ethereum) — ei telefoninumbrit, ei e-posti, ei KYC-d — ja saate oma konto taastada ahelas asuva DNA-sidumise kaudu. Terviseandmed jäävad teie omaks: laboritulemusi sõelutakse automaatselt, üksikute patogeenide staatust **ei näidata kunagi** kellelegi ning sobitamine põhineb ainult anonüümsetel ühilduvushinnangutel (Safe / Compatible / Caution / Risk). Vestlus töötab kaaslasvõrgus libp2p ja Nostri kaudu, mugavuse tagab HTTP-varuvari; rakenduses on lisaks kerge avalik "Safety Mode" fassaad ning eraldiseisev Companion Mode suguhaiguste testitulemuste hindamiseks.

> **Olek: varajane alfa.** EVOLVE on aktiivse arenduse all ega ole valmis toode.
> Nutilepingud on juurutatud **ainult Ethereumi Sepolia testivõrgus**.
> **Põhivõrgu juurutust, DEX-i, likviidsust ja avalikku tokenimüüki ei ole** — ega ole ühtegi neist lubatudki.
> Funktsioonid võivad igal ajal muutuda või katki minna. Mitte miski siin ei ole finantsnõuanne ega investeerimispakkumine.

## Mis & miks

Traditsioonilised tutvumisplatvormid paluvad teil oma telefoninumber, e-post, fotod ja intiimsed terviseandmed kesksesse andmebaasi üle anda. EVOLVE lähtub vastupidisest eeldusest: privaatsus vaikimisi, enesehoius (self-custody) ja ühtegi keskset veapunkti pole. Põhiväärtused:

- **Privaatsus vaikimisi** — terviseandmeid ei paljastata kunagi; ainult anonüümsed hinnangud.
- **Keelamiskindlus** — P2P-esmajärgu sõnumivahetus, detsentraliseeritud salvestus (IPFS / Arweave), mitme võrgu disain, ei kõvasti kodeeritud domeene.
- **Enesehoiuline identiteet** — teie rahakott on teie sisselogimine; DNA-põhine taastamine e-posti/telefoni asemel.
- **Ei KYC-tõket** — platvormi kasutamiseks ei nõuta riiklikku isikut tõendavat dokumenti, telefoni ega e-posti.

Kogu põhjendus: [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md) (inglise keeles).

## Põhifunktsioonid

### Identiteet & privaatsus

- **SIWE rahakotiga sisselogimine** (MetaMask ja teised EVM-rahakotid) — tsensuurikindel päästutee.
- **DNA-põhine konto taastamine** — teie DNA-testi tulemuse põhjal arvutatakse räsi (SHA-256, ahelas sidutakse `bytes32`-na) ja see saab taastada ligipääsu ilma telefonita või e-postita.
- **Account Abstraction (ERC-4337)** — nutikontod ja paymaster gaasivabaks kasutuselevõtuks; SIWE jääb alati kättesaadavaks.

### Anonüümne terviseühilduvus

- Laadige suguhaiguste testitulemused üles tekstina või PDF-ina (tekstikihi eraldamine, skannitud lehtede puhul OCR-varuvari).
- Parser tunneb ära 8 patogeeni: HIV-1/2, süüfilis, klamüüdia, gonorröa, HSV-1, HSV-2, B-hepatiit, C-hepatiit (inglise-, ukraina- ja venekeelsed aruannete formaadid).
- **Üksiku patogeeni staatust ei näidata teistele kasutajatele kunagi.** Profiilid näitavad ainult anonüümset hinnangut: **Safe / Compatible / Caution / Risk**.
- Ahelas olevad DNA-verifitseerimiskirjed (`DNAVerification.sol`) toidavad taastamis- ja verifitseerimisvooge.

### Profiilid, otsing & suhtlus

- Otsingufiltrid: "Mida te otsite" (tutvumine / eostamine / polüandrine eostamine / suguhaiguste testimine), "Keda te otsite" (mehed, naised, paarid), kaskaadsed riik → linn valikud, "saab teie riiki reisida" riigipõhiste loenditega, nahavärv, testimise eelistus, ainult suguhaigustega ühilduvad.
- Tutvustuse nõustaja: vanus (peidetav), keeled, kirjeldus, foto.
- **Fotode privaatsus**: fotod on vaikimisi udustatud; omanik annab 15-sekundilisi või püsivaid vaatamisõigusi kas proaktiivselt või taotluse peale. Vaatamine on tasuta.
- **P2P-vestlus** libp2p (gossipsub) + Nostri kaudu, HTTP-API varuvariga.

### Eostamisrežiimid

- **Režiim 2 — Pregnancy Bond**: naine loob sideme, mees paneb EVOLVE'i panuseks (≥ 100 praeguses testivõrgu versioonis), mõlemad kinnitavad; pärast kinnitatud rasedust ja isadust läheb panus naisele.
- **Režiim 3 — Cryptic Choice**: naine avab 48-tunnise sessiooni, mehed liituvad panustades; tema valib isa — viimase panus tagastatakse, ülejäänutel jagatakse: 90 % temale / 10 % valitud isale.

### Laborid & verifitseerimine

- **Laboripartneri voog**: laborid registreeruvad partneritena, verifitseerivad patsiente QR-koodi ja näotuvastusega ning manustavad suguhaiguste aruandeid (PDF/tekst OCR-eraldamisega).
- **Companion Mode**: eraldiseisev voog suguhaiguste testitulemuste hindamiseks ilma tutvumisplatvormiga liitumata.
- **Safety Mode** (`VITE_PRODUCT_MODE=safety`): piiratud avalik fassaad (suguhaiguste olek, avalikud profiililingid, ühilduvuskontrollid), mis jätkab tööd ka siis, kui tutvumis-/eostamisfunktsioone piiratakse mingis jurisdiktsioonis või rakenduspoes.

### EVOLVE token (ainult testivõrgus)

- ERC-20, maksimaalne kogus 8 000 000 000 EVOLVE, administraatori toimingud 48-tunnise TimelockControlleri taga.
- **Emojikingu majandus**: kingitus maksab 1 EVOLVE, mis jagatakse proportsionaalselt olemasolevatele kingituste omanikele — püsiv tulumudel hoidjatele; kingitused on ülekantavad.
- **EvolveFund**: meeste panustamine (vähemalt 15 EVOLVE, 30-päevane lukustus), mis arvestatakse halduskaalu; naised kasutavad oma rahakoti saldot.
- **Verifitseerimise preemiad**: 1 EVOLVE verifitseeritud kasutajale ja 1 EVOLVE kinnitavale laborile suguhaiguste/DNA-verifitseerimise eest (pluss mahupiiranguga testkraan).
- Halduse häälte kaal ühendab rekursiivse maine (8 häält, sügavus 3), laste/isaduste osa ning panustatud või hoitud EVOLVE'i.
- **LayerZero OFT** integratsioon tulevasteks ahelatevahelisteks EVOLVE'i ülekanneteks (sõltuvused olemas; Sepolia tagant pole veel midagi juurutatud).

### Platvorm

- Veebirakendus (PWA-na paigaldatav) ja Expo/React Native mobiilirakendus.
- Liidest on tõlgitud **34 keelde**.
- Mitme võrgu valmisolek: 18 EVM-võrgu konfiguratsiooni (Arbitrum ja Avalanche on kavandatud peamised L2-d — **veel juurutamata**).

## Arhitektuur & tehnoloogiapinu

Monorepo, mida hallatakse npm workspaces + Turborepoga:

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

Tähtsad nutilepingud: `EVOLVE.sol` (ERC-20), `ProfileNFT.sol` (ERC-721), `TrustScore.sol`, `Voting.sol`, `Evolve2Earn.sol` (emojikingitused + preemiad), `Governance.sol`, `BondManager.sol` (režiimid 2 ja 3), `EvolveFund.sol`, `VerificationRegistry.sol`, `DNAVerification.sol`, ERC-4337 `SmartAccountFactory` + `Paymaster` ning OpenZeppelini `TimelockController`.

Üksikasjad: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md) (inglise keeles).

## Tegevuskava

Töös: veebirakenduse tootmisvalmidus. Kavas: ahelas asuv laboriregister ja testisertifitseerimine, päris e-posti teenusepakkuja adapter laboriaruannete vastuvõtuks, ahelas verifitseeritud kinnitused profiilidel, tokenite sidumise (vesting) uuendus asutajate/arendajate allokatsioonidele, DEX-i likviidsuse varustamine (praegu blokeeritud — nõuab tokenite peamise võrgu juurutusi). Mitme võrgu laienemine (Arbitrum, Avalanche ja teised EVM-ahelad) järgneb pärast testivõrgu kõvendamist.

Täielik loend: [docs/ROADMAP.md](docs/ROADMAP.md) (inglise keeles).

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

## Panustamine

Panused on teretulnud — kood, veateated, funktsioonisoovitused ja ettepanekud. Enne alustamist lugege [CONTRIBUTING.md](CONTRIBUTING.md) ja meie [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Toeta projekti

Kui leiate, et EVOLVE on kasulik, saate arendust toetada annetusega — üksikasjad failis [DONATE.md](DONATE.md). Eelistate veebilehte? Kasutage mitmekeelset annetuslehte (34 keelt): **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**.

**Tokenimüüki ei ole ega tule.** EVOLVE tokenitesse ei saa "investeerida"; annetused on kingitused avatud lähtekoodi arenduse toetamiseks ega anna annetajale õigust tokenitele, omakapitalile, tuludele ega ühelegi finantsnõudele.

## Hoidlad (peegeldused)

| Peegel   | URL                                        |
| -------- | ------------------------------------------ |
| GitHub   | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg | https://codeberg.org/limitafternoon/Evolve |
| GitLab   | https://gitlab.com/evolve-group3/evolve    |

## Dokumentatsioon

- [Mis & miks](docs/WHAT-AND-WHY.md) — probleem, visioon, põhiväärtused (inglise keeles)
- [Kuidas see töötab](docs/HOW-IT-WORKS.md) — kasutajavood samm-sammult (inglise keeles)
- [Arhitektuur](docs/ARCHITECTURE.md) — monorepo, paketid, andmevood (inglise keeles)
- [Tokenomics](docs/TOKENOMICS.md) — tokeni mudel ja pakkumise jaotus (inglise keeles)
- [Tegevuskava](docs/ROADMAP.md) — verstapostid ja praegune olek (inglise keeles)
- [KKK](docs/FAQ.md) — korduma kippuvad küsimused (inglise keeles)
- [Rahakoti juhend](docs/WALLETS.md) — kuidas luua rahakotte ja saada annetusaadresse (inglise keeles)

## Litsents

Litsentseeritud [MIT-litsentsi alusel](LICENSE).

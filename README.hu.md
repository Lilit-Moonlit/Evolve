[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)
<!-- evolve-readme-sync: 3796750887b0bd65 -->

# EVOLVE

**Randizás, fogantatás és ellenőrzött egészség — alapértelmezetten privát, bizalom ott, ahol valóban számít.**

Az EVOLVE egy nyílt forráskódú, decentralizált platform azoknak, akik megelégelték, hogy telefonszámukat, arcukat és legintimebb egészségügyi adataikat másvalaki adatbázisára bízzák. Saját kriptotárcájával jelentkezik be — telefon, e-mail és KYC nélkül —, és fiókját egy láncon lévő (on-chain) DNA-kötelezettségvállalás segítségével kaphatja vissza. Egészségügyi adatai az önéi maradnak: a teszteredmények automatikusan elemzésre kerülnek, az egyes kórokozók státuszát **soha senkinek** nem mutatjuk meg, a párosítás pedig kizárólag névtelen kompatibilitási ítéletekre támaszkodik (Safe / Compatible / Caution / Risk). A csevegés peer-to-peer alapú, libp2p és Nostr fölött működik, kényelmi HTTP-tartalékkal. Az ajándékok és átutalások a teljes bizalmasság felé haladnak: a feladó oldaláról privát ajándékok már ma elérhetők, a Railgun védett tárca és az Aztec nulla-tudású prototípus pedig szerepel az ütemtervben (lásd [Adatvédelem és bizalmas tranzakciók](#adatvédelem-és-bizalmas-tranzakciók)).

> **Állapot — demó üzemmód, aktív fejlesztés alatt.**
> A randizás, a fogantatás, az egészség-ellenőrzés, a laboratóriumi folyamat, a P2P csevegés, az EVOLVE token és a governance (irányítás) mind implementálva van, és **helyi demóban** fut — az alkalmazás **még nincs nyilvánosan telepítve**. Még hátravan: a **mainnet-telepítés és a DEX-likviditás**, valamint egy **tervezett nyilvános eladás** (lásd [Az EVOLVE token](#az-evolve-token-csak-tesztnet)).
> Az okosszerződéseket **kizárólag az Ethereum Sepolia tesztnetre** telepítettük. Semmi itt nem minősül pénzügyi tanácsadásnak vagy befektetési ajánlatnak.

> **Hasznosnak találja az EVOLVE-ot? Támogassa a fejlesztést — minden adomány a kódra, a laboratóriumi partnerségekre, a tárhelyre és a fordításra megy → [DONATE.md](DONATE.md).**

## Nincs mitől félni

Az EVOLVE azokra a kérdésekre épült, amelyeket az emberek valójában feltesznek, mielőtt megbíznak egy ilyen platformban.

| Aggodalom                                              | Amit az EVOLVE már ma ellene tesz                                                                                                                                                                                             |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| „El fog szivárogni az egészségügyi adatom.”            | Az egyes kórokozók eredményeit **soha senkinek** nem mutatjuk meg — csak névtelen ítélet: Safe / Compatible / Caution / Risk.                                                                                                 |
| „A fotóim valahol máshol kötnek ki.”                   | A fotók alapértelmezetten el vannak homályosítva. A tulajdonos **15 másodperces** vagy **végleges** megtekintést ad — kérésre vagy magától kezdeményezve. A megtekintés ingyenes.                                             |
| „Át kell majd adnom a személyimet vagy a telefonomat.” | Tárca-bejelentkezés (SIWE). Nincs telefon, nincs e-mail, nincs KYC. A fiók visszaállítása láncon lévő (on-chain) DNA-kötelezettségvállaláson keresztül működik.                                                               |
| „Hazudik arról, hogy egészséges.”                      | Az eredményeket **laboratórium hitelesíti** (QR + arcegyeztetés), és a pár tesztjei **a találkozáskor** készülnek — a friss STD-eredmények számítanak, a DNA nem öregszik.                                                    |
| „Valaki elviszi a pénzem, és eltűnik?”                 | A fogantatás valódi, kockázatnak kitett téten nyugszik: a férfi betétje csak akkor mozdul meg, amikor az apaság **meg van erősítve**; ellenkező esetben egyszerűen visszaadatik neki.                                         |
| „A token egy pump-and-dump?”                           | A kód nyílt (MIT); a kínálat szinte egésze felhasználói jutalmakra van fenntartva, és a forgalomba nem került tartalékot tervezés szerint egy **nem kiüríthető széfbe (vault)** zárjuk — még az alapító sem veheti ki belőle. |
| „Le lehet zárni vagy tiltani a platformot?”            | Mindenekelőtt peer-to-peer üzenetküldés, decentralizált tárolás (IPFS / Arweave), 18 EVM hálózati konfiguráció, és nincs mereven kódolt domain.                                                                               |

## Mi és miért

A hagyományos randiapplikációkatól azt kérik, hogy cserélje el telefonszámát, e-mailjét, fotóit és intim egészségügyi részleteit egy központi adatbázisra — majd bízzon abban az adatbázisban örökre. Az EVOLVE az ellenkező feltevésből indul ki: **alapértelmezett adatvédelem, önkezelés (self-custody) és nincs egypontos meghibásodás**.

- **Alapértelmezett adatvédelem** — az egészségügyi adatok soha nem kerülnek nyilvánosságra; csak névtelen ítéletek.
- **Tiltási ellenállóság** — P2P-először üzenetküldés, decentralizált tárolás, többhálózatos kialakítás, nincsenek mereven kódolt domainek.
- **Önkezelésű identitás** — a tárcája a bejelentkezése; DNA-alapú fiók-visszaállítás e-mail vagy telefon helyett.
- **Nincs KYC-kapu** — a platform használatához nem szükséges személyi okmány, telefon vagy e-mail.

A teljes indoklást itt olvashatja: [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md).

## Egészség, amelyben valóban megbízhat

- Töltsön fel STD-tesztet nyers szövegként vagy PDF-ként (szövegréteg-kinyerés, beolvasott dokumentumokra OCR-tartalékkal).
- A parser 8 kórokozót ismer: HIV-1/2, szifilisz, chlamydia, gonorrhoea, HSV-1, HSV-2, B-hepatitis, C-hepatitis — angol, ukrán és orosz riportformátumokban.
- **Az egyes kórokozók státusza soha nem jelenik meg más felhasználók számára.** A profilok kizárólag a névtelen ítéletet mutatják: **Safe / Compatible / Caution / Risk**.
- A láncon lévő (on-chain) DNA-rekordok (`DNAVerification.sol`) működtetik a fiók-visszaállítást és az ellenőrzést.

### Partnerségi laboratóriumok — bizonyíték, nem ígéretek

Sétáljon be egy partnerségi laborba, és mutassa meg QR-kódját. A labor beszkenneli, **arcegyeztetéssel** igazolja a személyazonosságát (így senki más nem veheti át az eredményét), és csatolja az STD-riportot — PDF, szkennelt kép vagy szöveg, akár gyenge OCR-rel is. Az eredményt egy valódi laboratórium írja alá, nem Ön, így a többiek **hitelesített tényt** látnak, nem pedig az Ön szavát. És minden megerősített ellenőrzés **1 EVOLVE-t fizet a páciensnek és 1 EVOLVE-t a laboratóriumnak** — mindkét félnek érdeke a becsületesség. Az egyes kórokozók továbbra is soha senkinek nem látszanak.

## Valaki megtalálása

- Keresési szűrők: „Mit keres” (randizás / fogantatás / többférjű fogantatás / STD-tesztelés), „Kit keres” (férfiak, nők, párok), kaszkádolt ország → város legördülő listák, „elutazhat az Ön országába” országonkénti listákkal, bőrszín, tesztelési preferencia, csak STD-kompatibilis partnerek.
- Regisztrációs varázsló: életkor (elrejthető), nyelvek, bemutatkozás, fotó.
- **P2P csevegés** libp2p (gossipsub) + Nostr fölött, HTTP API tartalékkal.

## Fogantatás

Két módja van egy gyerek tervezésének, és mindkettő ugyanazon az elven nyugszik: a valódi szándékot valódi, EVOLVE-ban lévő tét mutatja — soha nem ígéretek. A férfi elköteleződése az EvolveFund-betéte (15 EVOLVE-tól, legalább 30 napra zárolva), a nő pedig maga állíthatja be a minimális betétet azoknak a férfiaknak, akik eljutnak hozzá.

**Fogantatás.** A nő a vezető: meghív egy konkrét férfit, és megnevezi őt egy kötelékben (bond). Neki aktív EvolveFund-betétre van szüksége; amikor mindketten megerősítik, a betét zárolásra kerül, és elindul a visszaszámlálás. A terhességet a megerősítés után a 14. és a 30. nap között jelentik, és a pár STD- és DNA-tesztjei magánál a találkozón készülnek — a friss STD-eredmények számítanak, a DNA nem öregszik. Amint az apaságot megerősítik, a férfi betétje a nőhöz kerül; ha nem erősítik meg, a betét egyszerűen visszaadatik neki. Semmi nem cserél gazdát, amíg a tények nem rendeződnek.

**Többférjű fogantatás.** A választás az övé, és privát is marad. Megnyit egy 48 órán át futó munkamenetet — saját betét nélkül (kizárólag a reputációja érdekében tehet be egyet, ha úgy kívánja). Az aktív betéttel rendelkező férfiak csatlakozhatnak — legfeljebb 50-en —, és megerősíthetik a részvételt, ami zárolja a tétjüket. A munkamenet lezárása után tizennégy nappal kiválasztásra kerül az apa. Ő visszakapja a betétjét, ráadásul jutalmat is kap a poolból: a betétje dupláját és 1 EVOLVE-t minden további résztvevő után. A ki nem választott férfiak elveszítik a tétjüket — 90% a nőé, 10% a kiválasztott apáé. A nő semmit nem kockáztat, csak nyerhet; a férfiak a tétjüket teszik fel a kiválasztás jogára.

## Adatvédelem és bizalmas tranzakciók

Az adatvédelem az alapértelmezés — és az EVOLVE a teljesen bizalmas, láncon belüli átutalások felé építi ki az ütemtervét.

- **Privát ajándékok** — küldjön rózsát 🌹 vagy kaktuszt 🌵 (1 EVOLVE), és válassza ki, ki láthassa, hogy Ön volt az: _nyilvános_, _névtelen mindenki számára a címzett kivételével_, vagy _teljesen névtelen_. A névtelen módokban az ajándék egyszer használatos utalványként (voucher) utazik, amelyet a címzett a saját tárcájával vált be, így a feladó soha nem jelenik meg a láncon. (A feladói anonimitás ma még alkalmi szintű: a finanszírozási tranzakció idő és összeg alapján összekapcsolható.)
- **Railgun védett tárca** — funkciójelzővel vezérelt privát tárca (`VITE_RAILGUN_ENABLED`, alapértelmezetten kikapcsolva), amely a Railgun élő nulla-tudású poolja segítségével elrejti az összegeket és a címeket. Ez az út vezet az igazi feladói anonimitáshoz.
- **Aztec prototípus** — ugyanaz a privát átutalási és privát kötelék-logika, nulla-tudású Noir áramkörökkel kifejezve, és egy explicit kapu mögött tartva, amíg az Aztec készen nem áll az éles használatra. Lásd [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md).
- **Kéttárcás modell** — a nyilvános tét-tárca részt vesz a governance-ben; a privát védett tárca szándékosan **ki van zárva** a governance-súlyból, így az adatvédelem és a szavazati erő külön marad.

Részletek: [docs/RAILGUN-INTEGRATION.md](docs/RAILGUN-INTEGRATION.md) · [docs/SHIELDED-STAKES-DESIGN.md](docs/SHIELDED-STAKES-DESIGN.md) · [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md).

## Az EVOLVE token (csak tesztnet)

- ERC-20, maximális kínálat **8,000,000,000 EVOLVE**. Az adminisztratív műveleteket egy 48 órás `TimelockController` védi.
- **Tervezett kiosztás** — úgy tervezve, hogy a kínálat szinte egésze a felhasználók érdekében dolgozzon, ne a bennfentesekéért:

| Cél                                                |        EVOLVE |
| -------------------------------------------------- | ------------: |
| Alapítók és csapat (fizetés / jutalom)             |    25,000,000 |
| DEX-tartalék (jövőbeli)                            |     4,000,000 |
| Nyilvános eladás (tervezett)                       |     5,000,000 |
| Jutalék-tartalék — laborok, páciensek, anyák, apák | 7,966,000,000 |

- **Tervezett nyilvános eladás** — 5,000,000 EVOLVE, amelyet az alkalmazás ad el **darabonként $0.8-ért**, és amely az alkalmazás által támogatott bármely tokenben fizethető; a bevétel a fejlesztést finanszírozza. _(Tervezett — még nem él.)_
- **Trustless kibocsátás (tervezett)** — a ~7,966,000,000 EVOLVE-os jutalék-tartalék egy nem kiüríthető `RewardVault`-ba kerül zárolásra: kizárólag fokozatosan, laboratóriumi, páciens-, anyai és apai jutalmakon keresztül szabadul fel, a szabályok megváltoztatása pedig governance-szavazást igényel. Még az alapító sem veheti ki. Terv: [docs/REWARD-VAULT-PLAN.md](docs/REWARD-VAULT-PLAN.md).
- **Emoji ajándékgazdaság** — egy ajándék 1 EVOLVE-ba kerül, amely arányosan oszlik meg a meglévő ajándéktulajdonosok között; örökös bevételi modell, ráadásul az ajándékok átruházhatók.
- **EvolveFund** — férfi staking (min. 15 EVOLVE, 30 napos zárolás), amely beleszámít a governance-súlyba; a nők a tárcájuk egyenlegét használják.
- **Ellenőrzési jutalmak** — STD/DNA-ellenőrzésenként 1 EVOLVE a hitelesített felhasználónak és 1 EVOLVE a megerősítő labornak (plusz egy sebességkorlátozott faucet).
- **Governance** — a szavazati súly a rekurzív reputációt (8 szavazat, 3-as mélység), a gyermekek/apaság arányát és a letett vagy birtokolt EVOLVE-ot egyesíti.
- **LayerZero OFT** integráció a jövőbeli többláncos EVOLVE-átutalásokhoz (a függőségek a helyükön vannak; a Sepolián túl még semmi nincs telepítve).

## A projekt támogatása

Az EVOLVE független és nyílt forráskódú. Ha hasznosnak találja, adománnyal támogathatja a fejlesztést — minden hozzájárulás a kódra, a laboratóriumi partnerségekre, a tárhelyre és a fordításra megy.

- **Adományozási részletek (EVM, Monero és egyebek):** [DONATE.md](DONATE.md)
- **Többnyelvű adományozási oldal (34 nyelven):** **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**

**Tervezett** a nyilvános tokeneladás — 5,000,000 EVOLVE, amelyet az alkalmazás ad el (lásd [Az EVOLVE token](#az-evolve-token-csak-tesztnet)). Az adományok olyan ajándékok, amelyek a nyílt forráskódú fejlesztést támogatják, és nem jelentenek igényt tokenre, tulajdonrészre, hozamra vagy haszonra. Kérem, csak olyan összeggel adakozzon, amelynek az elvesztését megengedheti magának.

## Architektúra és technológiai stack

npm workspaces + Turborepoval kezelt monorepo:

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

Fő okosszerződések: `EVOLVE.sol` (ERC-20), `ProfileNFT.sol` (ERC-721), `TrustScore.sol`, `Voting.sol`, `Evolve2Earn.sol` (emoji ajándékok + jutalmak), `Governance.sol`, `BondManager.sol` (fogantatás és többférjű fogantatás), `EvolveFund.sol`, `VerificationRegistry.sol`, `DNAVerification.sol`, ERC-4337 `SmartAccountFactory` + `Paymaster`, valamint egy OpenZeppelin `TimelockController`.

Részletek: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md)

## Ütemterv

Folyamatban: a webalkalmazás élesre készre tétele. Tervezett: láncon lévő (on-chain) laboratóriumi nyilvántartás és teszthitelesítés, valódi levelezőszolgáltató-adapter a laborriportok beépítéséhez, láncon hitelesített tanúsítványok a profilokon, a **trustless RewardVault** governance által kapuzott kibocsátással ([terv](docs/REWARD-VAULT-PLAN.md)), a **nyilvános tokeneladás**, a token-vesting frissítése az alapítói kiosztáshoz, valamint a DEX-likviditás biztosítása (jelenleg blokkolva — mainnetes token-telepítéseket igényel). Adatvédelmi oldalon a feladó oldaláról privát ajándékok készen vannak, miközben a Railgun védett tárca és az Aztec privát kötelék-migráció a [docs/ROADMAP.md](docs/ROADMAP.md) és a [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md) ellenőrzései mögött marad. A többhálózatos bővítés (Arbitrum, Avalanche és más EVM láncok) a tesztnet megerősítése után következik.

Teljes lista: [docs/ROADMAP.md](docs/ROADMAP.md).

## Első lépések (fejlesztőknek)

Követelmények: **Node.js 20+** és npm 10.x.

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

## Hozzájárulás

A hozzájárulások szívesen látottak — kód, hibajelentések, funkciójavaslatok és proposalok. Kérem, olvassa el a [CONTRIBUTING.md](CONTRIBUTING.md)-t és a [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)-unkat, mielőtt elkezdi.

## Tárolók (tükrök)

| Tükör    | URL                                        |
| -------- | ------------------------------------------ |
| GitHub   | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg | https://codeberg.org/limitafternoon/Evolve |
| GitLab   | https://gitlab.com/evolve-group3/evolve    |

## Dokumentáció

- [Mi és miért](docs/WHAT-AND-WHY.md) — probléma, vízió, alapértékek
- [Hogyan működik](docs/HOW-IT-WORKS.md) — felhasználói folyamatok, lépésről lépésre
- [Architektúra](docs/ARCHITECTURE.md) — monorepo, csomagok, adatfolyamok
- [Tokenomia](docs/TOKENOMICS.md) — tokenmodell és kínálati elosztás
- [RewardVault terv](docs/REWARD-VAULT-PLAN.md) — trustless kibocsátás (tervezett)
- [Railgun integráció](docs/RAILGUN-INTEGRATION.md) — védett tárca integrációs spike
- [Védett tétek](docs/SHIELDED-STAKES-DESIGN.md) — privát fogantatási tétek (terv)
- [Aztec prototípus](docs/AZTEC-PROTOTYPE.md) — ZK privát átutalások és kötelékek (kutatás)
- [Ütemterv](docs/ROADMAP.md) — mérföldkövek és jelenlegi állapot
- [GYIK](docs/FAQ.md) — gyakran ismételt kérdések
- [Tárca-útmutató](docs/WALLETS.md) — hogyan hozzon létre tárcákat, és hogyan szerezzen be adományzási címeket

## Licenc

Az [MIT licenc](LICENSE) alatt licencelt.

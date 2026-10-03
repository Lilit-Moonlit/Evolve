[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)

# EVOLVE

**Randizás, fogantatás és ellenőrzött egészség — alapértelmezetten privát, bizalom ott, ahol számít.**

Az EVOLVE egy nyílt forráskódú, decentralizált platform azoknak, akik belefáradtak, hogy telefonszámukat, arcukat és legintimebb egészségügyi adataikat másvalaki adatbázisára bízzák. Saját kriptotárcájával jelentkezik be — telefon, e-mail és KYC nélkül —, és fiókját egy láncon belüli (on-chain) DNS-kötelezettségvállaláson keresztül kaphatja vissza. Egészségügyi adatai az önéi maradnak: a teszteredmények automatikusan elemzésre kerülnek, az egyes kórokozók státuszát **soha senkinek** nem mutatjuk meg, a párosítás pedig kizárólag névtelen kompatibilitási ítéletekre támaszkodik (Safe / Compatible / Caution / Risk). A csevegés peer-to-peer működik libp2p és Nostr fölött, kényelmi HTTP-tartalékkal.

> **Állapot — a platform ma már működik; a mainnet és a DEX a következő lépés.**
> A randizás, a fogantatás, az egészség-ellenőrzés, a laboratóriumi folyamat, a P2P csevegés, az EVOLVE token és a governance mind működik. Még hátravan: egy **mainnet-telepítés és DEX-likviditás**, valamint egy **tervezett nyilvános eladás** (lásd [Az EVOLVE token](#az-evolve-token-csak-tesztnet)).
> Az okosszerződések **kizárólag az Ethereum Sepolia tesztneten** vannak telepítve. Semmi itt nem pénzügyi tanácsadás vagy befektetési ajánlat.

> **Hasznosnak találja az EVOLVE-ot? Támogassa a fejlesztést — minden adomány kódra, laboratóriumi partnerségekre, tárhelyre és fordításra megy → [DONATE.md](DONATE.md).**

## Nincs mitől félni

Az EVOLVE azok köré a kérdések köré épült, amelyeket az emberek valóban feltesznek, mielőtt megbíznak egy ilyen platformban.

| Az aggodalom                              | Mit tesz ellene már ma az EVOLVE                                                                                                                                                    |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| „Kiszivárog az egészségügyi adatom."      | Az egyes kórokozók eredményeit **soha senkinek** nem mutatjuk meg — csak névtelen ítélet: Safe / Compatible / Caution / Risk.                                                       |
| „A fotóim valahol landolnak."             | A fotók alapértelmezetten el vannak homályosítva. A tulajdonos **15 másodperces** vagy **végleges** megtekintést ad — kérésre vagy proaktívan. A megtekintés ingyenes.              |
| „Azonosítót vagy telefont kell átadnom."  | Tárca-bejelentkezés (SIWE). Nincs telefon, nincs e-mail, nincs KYC. A helyreállítás láncon belüli DNS-kötelezettségvállaláson keresztül működik.                                    |
| „Hazudik arról, hogy egészséges."         | Az eredmények **laboratóriumilag ellenőrzöttek** (QR + arcpárosítás), és a pár tesztjei **a találkozáson magán** készülnek — a friss STD-eredmények számítanak, a DNS nem öregszik. |
| „Elveszi valaki a pénzem és eltűnik?"     | A fogantatás valódi, kockázatnak kitett tételen nyugszik: egy férfi betétje csak akkor mozdul meg, ha az apaság **meg lett erősítve**; különben egyszerűen visszaadják neki.        |
| „A token egy pump-and-dump?"              | Ma nincs élő eladás; a kód nyílt (MIT); a forgalomba nem hozott tartalékot egy **kiüríthetetlen széfben** tervezik bezárni, amelyből még az alapító sem vonhat ki.                  |
| „Leállítható vagy betiltható a platform?" | Elsősorban peer-to-peer üzenetküldés, decentralizált tárolás (IPFS / Arweave), 18 EVM-hálózati konfiguráció és nem a kódba rögzített domain.                                        |

## Mi és miért

A hagyományos randiappok arra kérik, hogy telefonszámát, e-mailjét, fotóit és intim egészségügyi részleteit egy központi adatbázisra cserélje — majd örökre bízzon abban az adatbázisban. Az EVOLVE az ellenkező feltevésből indul ki: **alapértelmezett magánszféra, saját kezű felügyelet (self-custody) és nincs egyetlen meghibásodási pont**.

- **Alapértelmezett magánszféra** — az egészségügyi adatok soha nem kerülnek napvilágra; csak névtelen ítéletek.
- **Tiltás-tűrés** — P2P-first üzenetküldés, decentralizált tárolás, többhálózati kialakítás, nem a kódba rögzített domainek.
- **Saját kezű identitás** — a tárcája a belépése; DNS-alapú helyreállítás e-mail vagy telefon helyett.
- **Nincs KYC-küszöb** — hatósági azonosító, telefon vagy e-mail nem szükséges a platform használatához.

A teljes indoklást a [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md) fájlban olvashatja.

## Egészség, amiben valóban megbízhat

- Töltsön fel egy STD-tesztet nyers szövegként vagy PDF-ként (szövegréteg-kinyerés, OCR-tartalékkal szkenneléseknél).
- A parser 8 kórokozót ismer: HIV-1/2, szifilisz, chlamydia, gonorrhoea, HSV-1, HSV-2, B-hepatitisz, C-hepatitisz — angol, ukrán és orosz jelentési formátumokban.
- **Az egyes kórokozók státuszát soha nem mutatjuk meg más felhasználóknak.** A profilok kizárólag a névtelen ítéletet mutatják: **Safe / Compatible / Caution / Risk**.
- A láncon belüli DNS-bejegyzések (`DNAVerification.sol`) a helyreállítást és az ellenőrzést táplálják.

### Partnerlaboratóriumok — bizonyíték, nem ígéretek

Lépjen be egy partnerlaboratóriumba, és mutassa meg a QR-kódját. A laboratórium leolvassa, **arcpárosítással** megerősíti a személyazonosságát (így senki más nem veheti át az eredményét), és csatolja az STD-jelentést — PDF, szken vagy szöveg, akár gyenge OCR-rel is. Az eredményt egy valódi laboratórium írja alá, nem Ön, így mások **ellenőrzött tényt** látnak az Ön szava helyett. És minden megerősített ellenőrzés **1 EVOLVE-ot fizet a páciensnek és 1 EVOLVE-ot a laboratóriumnak** — mindkét félnek érdeke a becsületesség. Az egyes kórokozók továbbra is soha nem láthatók senkinek.

## Valaki megtalálása

- Keresési szűrők: „Mit keres" (randizás / fogantatás / poliandrikus fogantatás / STD-tesztelés), „Kit keres" (férfiak, nők, párok), kaszkádolt ország → város legördülők, „elutazhat az Ön országába" országonkénti listákkal, bőrszín, tesztpreferencia, csak STD-kompatibilis partnerek.
- Bevezető varázsló: életkor (elrejthető), nyelvek, bemutatkozás, fotó.
- **P2P csevegés** libp2p (gossipsub) + Nostr fölött, HTTP-API tartalékkal.

## Fogantatás

Két út egy gyermek tervezéséhez — mindkettő ugyanazon az elképzelésen nyugszik: a valódi szándék valódi, EVOLVE-ban letett tétellel mutatkozik meg — soha nem ígéretekkel. Egy férfi elköteleződése az EvolveFund-betétjében él (15 EVOLVE-tól, legalább 30 napig zárolva), a nő pedig megállapíthatja saját minimális betétjét azoknak a férfiaknak, akik elérnek hozzá.

**Fogantatás.** A nő vezet: meghív egy konkrét férfit, és megnevezi őt egy kötelékben (bond). A férfinak aktív EvolveFund-betétre van szüksége; amikor mindketten megerősítik, az zárolódik, és elindul a visszaszámlálás. A terhességet a megerősítés után 14 és 30 nap között jelentik, a pár STD- és DNS-tesztjei pedig magán a találkozáson készülnek — a friss STD-eredmények számítanak, a DNS nem öregszik. Ha az apaságot megerősítették, a férfi betétje a nőhöz kerül; ha nem, a betét egyszerűen visszaadatik neki. Semmi nem cserél gazdát, amíg a tények tisztázódnak.

**Poliandrikus fogantatás.** A választás az övé — és privát marad. Egy 48 órás munkamenetet nyit — saját betét nélkül (csak a reputáció érdekében tehet be egyet, ha akar). Aktív betéttel rendelkező férfiak csatlakozhatnak — legfeljebb 50 — és megerősíthetik, ami zárolja a tétüket. A munkamenet lezárása után tizennégy nappal kiválasztásra kerül az apa. Visszakapja a betétjét, plusz jutalmat a készletből: kétszeres betétet és 1 EVOLVE-ot minden más résztvevőért. A ki nem választott férfiak elveszítik a tétüket — 90% a nőnek, 10% a kiválasztott apának. Ő semmit nem kockáztat és csak nyerhet; a férfiak a tétjüket állítják a kiválasztás jogába.

## Az EVOLVE token (csak tesztnet)

- ERC-20, maximális kínálat **8,000,000,000 EVOLVE**. Az adminisztratív műveleteket egy 48 órás `TimelockController` korlátozza.
- **Tervezett kínálati elosztás** — úgy tervezve, hogy a kínálat szinte egésze a felhasználókért dolgozzon, ne a bennfentesekért:

| Cél                                               |        EVOLVE |
| ------------------------------------------------- | ------------: |
| Alapítók és csapat (fizetés / jutalom)            |    25,000,000 |
| DEX-tartalék (jövőbeli)                           |     4,000,000 |
| Nyilvános eladás (tervezett)                      |     5,000,000 |
| Jutaléktartalék — laborok, páciensek, anyák, apák | 7,966,000,000 |

- **Tervezett nyilvános eladás** — 5,000,000 EVOLVE, amelyet az app **darabonként $0.8-ért** ad el, bármilyen, az app által támogatott tokenben fizethető; a bevétel a fejlesztést finanszírozza. _(Tervezett — még nem él.)_
- **Bizalom nélküli kibocsátás (tervezett)** — a ~7,966,000,000 nagyságú jutaléktartalékot egy kiüríthetetlen `RewardVault`-ba zárják: csak fokozatosan, labor-, páciens-, anya- és apajutalmakon keresztül szabadul fel, a szabályok megváltoztatása governance-szavazást igényel. Még az alapító sem vonhatja ki. Terv: [docs/REWARD-VAULT-PLAN.md](docs/REWARD-VAULT-PLAN.md).
- **Emojiajándék-gazdaság** — egy ajándék 1 EVOLVE-ba kerül, arányosan oszlik meg a meglévő ajándékbirtokosok között; örökös bevételi modell, és az ajándékok átruházhatók.
- **EvolveFund** — férfi staking (min. 15 EVOLVE, 30 napos zárolás), amely beleszámít a governance-súlyba; a nők a tárcájuk egyenlegét használják.
- **Ellenőrzési jutalmak** — 1 EVOLVE az ellenőrzött felhasználónak és 1 EVOLVE az ellenőrzést végző laboronként STD/DNS-ellenőrzésenként (plusz egy frekvenciakorlátozott faucet).
- **Governance** — a szavazati súly a rekurzív reputációt (8 szavazat, 3-as mélység), a gyermekek/apasági arányt valamint a letett vagy tartott EVOLVE-ot kombinálja.
- **LayerZero OFT** integráció a jövőbeli többláncú EVOLVE-átutalásokhoz (a függőségek a helyükön; a Sepolián túl még semmi nincs telepítve).

## Támogassa a projektet

Az EVOLVE független és nyílt forráskódú. Ha hasznos Önnek, adománnyal támogathatja a fejlesztést — minden hozzájárulás kódra, laboratóriumi partnerségekre, tárhelyre és fordításra megy.

- **Adomány részletei (EVM, Monero és más):** [DONATE.md](DONATE.md)
- **Többnyelvű adományoldal (34 nyelven):** **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**

Egy nyilvános tokeneladás szerepel az ütemtervben, de ma **nem** él. Az adományok a nyílt forráskódú fejlesztést támogató ajándékok, és nem jelentenek igényt tokenekre, tulajdonrészre, hozamra vagy haszonra. Kérem, csak annyit adjon, amennyinek az elvesztését megengedheti magának.

## Architektúra & technológiai stack

Monorepo, npm workspaces + Turborepo-val kezelve:

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

Fő okosszerződések: `EVOLVE.sol` (ERC-20), `ProfileNFT.sol` (ERC-721), `TrustScore.sol`, `Voting.sol`, `Evolve2Earn.sol` (emojiajándékok + jutalmak), `Governance.sol`, `BondManager.sol` (fogantatás és poliandrikus fogantatás), `EvolveFund.sol`, `VerificationRegistry.sol`, `DNAVerification.sol`, ERC-4337 `SmartAccountFactory` + `Paymaster`, valamint egy OpenZeppelin `TimelockController`.

Részletek: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md)

## Ütemterv

Folyamatban: a webapp termelési készenléte. Tervezett: láncon belüli laboratóriumi nyilvántartás és teszttanúsítvány, valódi e-mail-szolgáltató adapter laborjelentések fogadásához, láncon belül ellenőrzött tanúsítványok a profilokon, a **bizalom nélküli RewardVault** governance-kapuzott kibocsátással ([terv](docs/REWARD-VAULT-PLAN.md)), a **nyilvános tokeneladás**, a token-vesting frissítése az alapítói allokációhoz, valamint a DEX-likviditás biztosítása (jelenleg blokkolva — a token mainnetes telepítését igényli). A többhálózati bővítés (Arbitrum, Avalanche és más EVM-láncok) a tesztnet megerősítése után következik.

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

A hozzájárulásokat szívesen fogadjuk — kód, hibajelentések, funkciójavaslatok és javaslatok. Kérjük, olvassa el a [CONTRIBUTING.md](CONTRIBUTING.md)-t és a [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)-ot, mielőtt elkezdi.

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
- [Tokenomika](docs/TOKENOMICS.md) — tokenmodell és kínálati elosztás
- [RewardVault-terv](docs/REWARD-VAULT-PLAN.md) — bizalom nélküli kibocsátás (tervezett)
- [Ütemterv](docs/ROADMAP.md) — mérföldkövek és aktuális állapot
- [GYIK](docs/FAQ.md) — gyakran ismételt kérdések
- [Tárca-útmutató](docs/WALLETS.md) — hogyan hozzon létre tárcákat és kapjon adománycímeket

## Licenc

Az [MIT licenc](LICENSE) alatt kiadva.

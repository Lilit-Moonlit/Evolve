[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)

# EVOLVE

**Ismerkedés, fogantatás és egészség-ellenőrzés — alapértelmezetten privát, ott ellenőrizve, ahol ez számít.**

Az EVOLVE egy nyílt forráskódú, decentralizált platform ellenőrizhető intim kapcsolatokhoz: ismerkedés, fogantatás és névtelen STD/DNS-kompatibilitás. Saját kriptotárcáddal jelentkezel be (Sign-In with Ethereum) — telefonszám nélkül, e-mail nélkül, KYC nélkül —, és fiókodat egy láncon belüli (on-chain) DNS-kötelezettség révén állíthatod helyre. Az egészségügyi adataid a tieid maradnak: a laboreredmények automatikus elemzésre kerülnek, az egyes kórokozók státuszát **soha** nem mutatjuk meg senkinek, a párosítás pedig kizárólag névtelen kompatibilitási ítéletekre támaszkodik (Safe / Compatible / Caution / Risk). A csevegés peer-to-peer fut libp2p és Nostr felett, kényelmi HTTP-tartalékkal, az alkalmazás pedig egy könnyű „Safety Mode” nyilvános homlokzattal és egy önálló Companion Mode-dal érkezik az STD-tesztek kiértékeléséhez.

> **Állapot: korai alfa.** Az EVOLVE aktív fejlesztés alatt áll, és nem kész termék.
> Az okosszerződések **kizárólag az Ethereum Sepolia teszthálózaton** lettek telepítve.
> **Nincs mainnet-telepítés, nincs DEX, nincs likviditás és nincs nyilvános tokeneladás** — és egyik sincs megígérve.
> A funkciók bármikor változhatnak vagy működésképtelenné válhatnak. Semmi itt nem minősül pénzügyi tanácsadásnak vagy befektetési ajánlatnak.

## Mi és miért

A hagyományos ismerkedőplatformok azt kérik, hogy add át telefonszámodat, e-mail címedet, fotóidat és intim egészségügyi részleteidet egy központi adatbázisnak. Az EVOLVE az ellenkező feltevésből indul ki: alapértelmezett adatvédelem, önkezelés és nincs központi meghibásodási pont. Alapvető értékek:

- **Alapértelmezett adatvédelem** — az egészségügyi adatok soha nem kerülnek nyilvánosságra; csak névtelen ítéletek.
- **Tiltásokkal szembeni ellenállás** — P2P-alapú üzenetküldés, decentralizált tárolás (IPFS / Arweave), többhálós kialakítás, beégetett (hardcoded) domainek nélkül.
- **Önkezelő személyazonosság** — a tárcád a bejelentkezésed; DNS-alapú fiók-helyreállítás e-mail/telefon helyett.
- **Nincs KYC-kapu** — a platform használatához nem szükséges hatósági igazolvány, telefon vagy e-mail.

A teljes indoklást a [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md) fájlban találod (angolul).

## Fő funkciók

### Személyazonosság és adatvédelem

- **SIWE-tárcás bejelentkezés** (MetaMask és más EVM-tárcák) — a cenzúrának ellenálló vészkijárat.
- **DNS-alapú fiókhelyreállítás** — a DNS-teszted eredménye hash-elésre kerül (SHA-256, on-chain `bytes32`-ként kötelezettségvállalás), és telefon vagy e-mail nélkül visszaállíthatja a hozzáférésed.
- **Számlaabsztrakció (ERC-4337)** — okosfiókok és paymaster a gázmentes belépéshez; az SIWE mindig elérhető marad.

### Névtelen egészségügyi kompatibilitás

- STD-teszteredmények feltöltése nyers szövegként vagy PDF-ként (szövegréteg-kinyerés OCR-tartalékkal a beolvasott oldalakhoz).
- A parser nyolc kórokozót ismer fel: HIV-1/2, szifilisz, chlamydia, gonorrhoea, HSV-1, HSV-2, hepatitisz B, hepatitisz C (angol, ukrán és orosz jelentési formátumok).
- **Az egyes kórokozók státusza soha nem jelenik meg más felhasználóknak.** A profilok csak névtelen ítéletet mutatnak: **Safe / Compatible / Caution / Risk**.
- Az on-chain DNS-ellenőrzési bejegyzések (`DNAVerification.sol`) működtetik a helyreállítási és ellenőrzési folyamatokat.

### Profilok, keresés és kommunikáció

- Keresési szűrők: „Mit keresel” (ismerkedés / fogantatás / poliandrikus fogantatás / STD-tesztelés), „Kit keresel” (férfiak, nők, párok), kaszkádos ország → város legördülő listák, „el tud utazni az országodba” országonkénti listákkal, bőrszín, tesztelési preferencia, csak STD-kompatibilisek.
- Bevezető varázsló (onboarding): életkor (elrejthető), nyelvek, bemutatkozás, fotó.
- **Fotók adatvédelme**: a fotók alapértelmezetten homályosak; a tulajdonos 15 másodperces vagy végleges megtekintést adhat — kérésre vagy magától. A megtekintés ingyenes.
- **P2P-csevegés** libp2p (gossipsub) + Nostr felett, HTTP-API tartalékkal.

### Fogantatási módok

- **2. mód — Pregnancy Bond**: egy nő kötelezettséget (bond) hoz létre, egy férfi EVOLVE-ot helyez letétbe (≥ 100 a jelenlegi teszthálózati buildben), mindketten megerősítik; megerősített terhesség és apaság után a letét a nőhöz kerül.
- **3. mód — Cryptic Choice**: egy nő 48 órás munkamenetet nyit, a férfiak letétbehelyetéssel csatlakoznak; ő választja ki az apát — az ő letéte visszakapja, a többieké felosztásra kerül: 90% a nőnek / 10% a kiválasztott apának.

### Laboratóriumok és ellenőrzés

- **Laboratóriumi partneri folyamat**: a laboratóriumok partnerként regisztrálnak, QR-kód és arcegyeztetés alapján azonosítják a pácienseket, és STD-jelentéseket csatolnak (PDF/szöveg OCR-kinyeréssel).
- **Companion Mode**: önálló folyamat az STD-teszteredmények kiértékeléséhez, ismerkedőplatformra való regisztráció nélkül.
- **Safety Mode** (`VITE_PRODUCT_MODE=safety`): korlátozott nyilvános homlokzat (STD-státusz, nyilvános profil-linkek, kompatibilitási ellenőrzések), amely akkor is működik, ha az ismerkedési/fogantatási funkciókat egy joghatóság vagy alkalmazásbolt korlátozza.

### EVOLVE token (csak teszthálózaton)

- ERC-20, maximális kibocsátás 8 000 000 000 EVOLVE, a rendszergazdai műveleteket 48 órás TimelockController köti.
- **Emodzsi-ajándékgazdaság**: egy ajándék 1 EVOLVE-ba kerül, amely arányosan oszlik el a meglévő ajándéktulajdonosok között — örökös bevételi modell a birtokosoknak; az ajándékok átruházhatók.
- **EvolveFund**: férfiak által végzett letétbe helyezés (min. 15 EVOLVE, 30 napos zárolás), amely beleszámít a kormányzási súlyba; a nők a tárcájuk egyenlegét használják.
- **Ellenőrzési jutalmak**: 1 EVOLVE az ellenőrzött felhasználónak és 1 EVOLVE a megerősítő laboratóriumnak STD/DNS-ellenőrzés esetén (plusz egy gyakoriságkorlátozásos teszt-csap).
- A kormányzási szavazati súly a rekurzív reputációt (8 szavazat, 3-as mélység), a gyermekek/apaság arányát, valamint a letett vagy birtokolt EVOLVE-ot egyesíti.
- **LayerZero OFT** integráció a jövőbeli többlánccá EVOLVE-átutalásokhoz (a függőségek készen állnak; a Sepolián túl még semmi nincs telepítve).

### Platform

- Webalkalmazás (PWA-ként telepíthető) és Expo/React Native mobilalkalmazás.
- A felület **34 nyelvre** lett lefordítva.
- Többhálózatra készen: 18 EVM-hálózati konfiguráció (az Arbitrum és az Avalanche a tervezett elsődleges L2-ek — **még nincsenek telepítve**).

## Architektúra és technológiai stack

Monorepo, npm workspaces + Turborepo segítségével kezelve:

```
apps/
  web/          # Vite + React + TypeScript (fő webalkalmazás, i18next, Prisma)
  mobile/       # Expo + React Native
packages/
  config/       # Funkciókapcsolók és dinamikus távoli konfiguráció
  contracts/    # Solidity 0.8.24, Hardhat, Ignition, OpenZeppelin, LayerZero
  core/         # Közös típusok, segédprogramok, middleware, web3
  matching/     # Párosítási algoritmusok, szűrők, rangsorolás
  p2p/          # libp2p (gossipsub) + Nostr hálózatkezelés
  storage/      # IPFS, Arweave, Lit Protocol
docs/           # Architektúra, tokenomika, ütemterv, GYIK
```

Fontosabb okosszerződések: `EVOLVE.sol` (ERC-20), `ProfileNFT.sol` (ERC-721), `TrustScore.sol`, `Voting.sol`, `Evolve2Earn.sol` (emozsi-ajándékok + jutalmak), `Governance.sol`, `BondManager.sol` (2. és 3. mód), `EvolveFund.sol`, `VerificationRegistry.sol`, `DNAVerification.sol`, ERC-4337 `SmartAccountFactory` + `Paymaster`, valamint egy OpenZeppelin `TimelockController`.

Részletek: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md) (angolul).

## Ütemterv

Folyamatban: a webalkalmazás éles készültsége. Tervezett: on-chain laboratóriumi nyilvántartás és teszttanúsítás, valódi levelezőszolgáltató-adapter a laborjelentések befogadásához, on-chain ellenőrzött tanúsítványok a profilokon, token-vesting frissítése az alapítói/fejlesztői allokációkhoz, DEX-likviditás biztosítása (jelenleg blokkolva — mainnetes token-telepítéseket igényel). A többhálós bővítés (Arbitrum, Avalanche és egyéb EVM-láncok) a teszthálózati megszilárdulás után következik.

Teljes lista: [docs/ROADMAP.md](docs/ROADMAP.md) (angolul).

## Első lépések (fejlesztőknek)

Előfeltételek: **Node.js 20+** és npm 10.x.

```bash
# Klónozd és telepítsd az összes workspace-t
git clone https://github.com/Lilit-Moonlit/Evolve.git
cd Evolve
npm install

# Webalkalmazás (Vite fejlesztői szerver a http://localhost:3000 címen)
cd apps/web
npm run dev
npm test                # vitest tesztcsomag

# Okosszerződések
cd packages/contracts
npm run compile         # hardhat compile
npm test                # hardhat tesztcsomag
npm run deploy:local    # minden szerződés telepítése in-process Hardhat hálózatra
```

## Hozzájárulás

A hozzájárulásokat szívesen fogadjuk — kód, hibajelentések, funkciójavaslatok és javaslatok. Kezdés előtt kérjük, olvasd el a [CONTRIBUTING.md](CONTRIBUTING.md) fájlt és a [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) dokumentumunkat.

## A projekt támogatása

Ha hasznosnak találod az EVOLVE-ot, támogathatod a fejlesztést adománnyal — a részletek a [DONATE.md](DONATE.md) fájlban. Inkább weboldalt szeretnél? Használd a többnyelvű adományozási oldalt (34 nyelven): **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**.

**Nincs tokeneladás, és nem is lesz soha.** Az EVOLVE tokenekbe nem lehet „befektetni”; az adományok a nyílt forráskódú fejlesztés támogatására adott ajándékok, és nem jogosítják fel az adományozót tokenekre, tulajdonrészre, hozamra vagy bármilyen egyéb pénzügyi igényre.

## Tárolók (tükrök)

| Tükör    | URL                                        |
| -------- | ------------------------------------------ |
| GitHub   | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg | https://codeberg.org/limitafternoon/Evolve |
| GitLab   | https://gitlab.com/evolve-group3/evolve    |

## Dokumentáció

- [Mi és miért](docs/WHAT-AND-WHY.md) — probléma, vízió, alapvető értékek (angolul)
- [Hogyan működik](docs/HOW-IT-WORKS.md) — felhasználói folyamatok, lépésről lépésre (angolul)
- [Architektúra](docs/ARCHITECTURE.md) — monorepo, csomagok, adatfolyamok (angolul)
- [Tokenomika](docs/TOKENOMICS.md) — tokenmodell és a kibocsátás eloszlása (angolul)
- [Ütemterv](docs/ROADMAP.md) — mérföldkövek és jelenlegi állapot (angolul)
- [GYIK](docs/FAQ.md) — gyakran ismételt kérdések (angolul)
- [Tárca-útmutató](docs/WALLETS.md) — hogyan hozz létre tárcákat és hogyan jutsz adományzási címekhez (angolul)

## Licenc

Az [MIT licenc](LICENSE) alatt kiadva.

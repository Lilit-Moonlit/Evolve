[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)

# EVOLVE

**Pažintys, samprata ir sveikatos verifikavimas — privatu pagal numatytuosius nustatymus, patvirtinta ten, kur svarbiausia.**

EVOLVE yra atvirojo kodo, decentralizuota platforma patikrintiems intymiems ryšiams: pažintys, samprata ir anoniminis LPL/DNR suderinamumas. Prisijungiate savo kriptovaliutų pinigine (Sign-In with Ethereum) — jokio telefono numerio, jokio el. pašto, jokio KYC — ir galite atkurti paskyrą naudodami grandinėje esantį DNR įsipareigojimą. Sveikatos duomenys lieka jūsų: laboratorinių rezultatų išskaidoma automatiškai, atskirų patogenų būsenų **niekada** niekam nerodoma, o suderinamumo paieška remiasi tik anoniminiais suderinamumo verdiktais (Safe / Compatible / Caution / Risk). Pokalbiai vyksta tarpusavyje (P2P) per libp2p ir Nostr, patogumui paliekant HTTP atsarginį variantą; programa taip pat turi lengvą viešąjį „Safety Mode“ fasadą ir atskirą Companion Mode LPL testų rezultatams vertinti.

> **Būsena: ankstyvosios stadijos alfa.** EVOLVE aktyviai kuriama ir nėra baigtas produktas.
> Išmaniosios sutartys įdiegtos **tik Ethereum Sepolia testiniame tinkle**.
> **Nėra pagrindinio tinklo įdiegimo, DEX, likvidumo ir viešo tokenų pardavimo** — ir niekas iš to nepažadėta.
> Funkcijos bet kada gali pasikeisti ar sugesti. Niekas čia nėra finansų patarimas ar investicijų pasiūlymas.

## Kas ir kodėl

Tradicinės pažinčių platformos prašo atiduoti savo telefono numerį, el. paštą, nuotraukas ir intymius sveikatos duomenis centrinei duomenų bazei. EVOLVE kyla iš priešingos prielaidos: privatumas pagal numatytuosius, savarankiškas valdymas (self-custody) ir jokio centrinio gedimo taško. Pagrindinės vertybės:

- **Privatumas pagal numatytuosius** — sveikatos duomenys niekada neatskleidžiami; tik anoniminiai verdiktai.
- **Atsparumas blokavimui** — P2P pirmiausia žinutės, decentralizuota saugykla (IPFS / Arweave), kelių tinklų dizainas, jokių nekintamai įrašytų domenų.
- **Savarankiškai valdoma tapatybė** — jūsų piniginė yra jūsų prisijungimas; DNR pagrįstas atkūrimas vietoj el. pašto/telefono.
- **Nėra KYC barjero** — norint naudotis platforma, nereikia valstybinio ID, telefono ar el. pašto.

Visą pagrindimą skaitykite [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md) (angliškai).

## Pagrindinės funkcijos

### Tapatybė ir privatumas

- **Prisijungimas pinigine per SIWE** (MetaMask ir kitos EVM piniginės) — atsparus cenzūrai atsarginis kelias.
- **Paskyros atkūrimas per DNR** — iš jūsų DNR testo rezultato apskaičiuojamas hešas (SHA-256, grandinėje patvirtinamas kaip `bytes32`), ir jis gali atkurti prieigą be telefono ar el. pašto.
- **Account Abstraction (ERC-4337)** — išmaniosios paskyros ir paymaster, leidžiantys pradėti be dujų mokesčio; SIWE visada išlieka prieinama.

### Anoniminis sveikatos suderinamumas

- Įkelkite LPL testų rezultatus kaip tekstą arba PDF (teksto sluoksnio ištraukimas, skenuotiems puslapiams — OCR atsarginis variantas).
- Analizatorius atpažįsta 8 patogenus: ŽIV-1/2, sifilis, chlamidijos, gonorėja, HSV-1, HSV-2, B hepatitas, C hepatitas (anglų, ukrainiečių ir rusų ataskaitų formatai).
- **Atskirų patogenų būsena kitiems naudotojams niekada nerodoma.** Profiliai rodo tik anoniminį verdiktą: **Safe / Compatible / Caution / Risk**.
- Grandinėje esantys DNR verifikavimo įrašai (`DNAVerification.sol`) užtikrina atkūrimo ir verifikavimo procesus.

### Profiliai, paieška ir bendravimas

- Paieškos filtrai: „Ko ieškote“ (pažintys / samprata / poliandrinė samprata / LPL testavimas), „Ką ieškote“ — partnerio (vyrai, moterys, poros), kaskadiniai šalis → miestas pasirinkimai, „gali atvykti į jūsų šalį“ su šalių sąrašais, odos spalva, testavimo pageidavimas, tik LPL suderinami.
- Supažindinimo vedlys: amžius (galima slėpti), kalbos, aprašymas, nuotrauka.
- **Nuotraukų privatumas**: nuotraukos pagal numatytuosius yra suliejamos; savininkas suteikia 15 sekundžių arba nuolatinius peržiūrėjimus — savo iniciatyva arba pagal prašymą. Peržiūra yra nemokama.
- **P2P pokalbiai** per libp2p (gossipsub) + Nostr, su HTTP API atsargine galimybe.

### Sampratos režimai

- **2 režimas — Pregnancy Bond**: moteris sukuria ryšį (bond), vyras įšaldo EVOLVE (≥ 100 dabartinėje testinio tinklo versijoje), abu patvirtina; po patvirtintos nėštumo ir tėvystės užstatas pereina moteriai.
- **3 režimas — Cryptic Choice**: moteris atidaro 48 valandų sesiją, vyrai prisijungia įšaldami; ji pasirenka tėvą — jam užstatas grąžinamas, kiti dalijasi: 90 % jai / 10 % pasirinktam tėvui.

### Laboratorijos ir verifikavimas

- **Laboratorijos partnerių procesas**: laboratorijos registruojasi kaip partneriai, patvirtina pacientus QR kodu ir veido atitiktimi bei prideda LPL ataskaitas (PDF/tekstas su OCR ištraukimu).
- **Companion Mode**: atskiras procesas LPL testų rezultatams vertinti neprisijungus prie pažinčių platformos.
- **Safety Mode** (`VITE_PRODUCT_MODE=safety`): ribotas viešasis fasadas (LPL būsena, vieši profilio saitai, suderinamumo patikros), kuris veikia net tada, jei pažinčių/sampratos funkcijos būtų apribotos tam tikroje jurisdikcijoje ar programėlių parduotuvėje.

### EVOLVE tokenas (tik testiniame tinkle)

- ERC-20, maksimali apimtis 8 000 000 000 EVOLVE, administratoriaus veiksmai apribojami 48 valandų TimelockController.
- **Emodžių dovanų ekonomika**: dovana kainuoja 1 EVOLVE, kuris padalijamas proporcingai esamiems dovanų savininkams — nuolatinis pajamų modelis turėtojams; dovanos yra perkeliamos.
- **EvolveFund**: vyrų įšaldymas (mažiausiai 15 EVOLVE, 30 dienų užrakinimas), kuris įskaitomas į valdymo svorį; moterys naudoja savo piniginės balansą.
- **Verifikavimo atlygiai**: 1 EVOLVE patvirtintam naudotojui ir 1 EVOLVE patvirtinančiai laboratorijai už LPL/DNR verifikavimą (plius greitį ribojantis testinis čiaupas).
- Valdymo balso svoris derina rekursyvią reputaciją (8 balsai, gylis 3), vaikų/tėvystės dalį bei įšaldytus ar laikomus EVOLVE.
- **LayerZero OFT** integracija būsimiems daugiagrandžiams EVOLVE perkėlimams (priklausomybės paruoštos; už Sepolijos ribų kol kas nieko neįdiegta).

### Platforma

- Žiniatinklio programa (diegiama kaip PWA) ir Expo/React Native mobilioji programa.
- Sąsaja išversta į **34 kalbas**.
- Pasirengimas keliems tinklams: 18 EVM tinklo konfigūracijų (Arbitrum ir Avalanche yra planuojami pagrindiniai L2 — **dar neįdiegti**).

## Architektūra ir technologijų stekas

Monorepo, valdomas naudojant npm workspaces + Turborepo:

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

Pagrindinės išmaniosios sutartys: `EVOLVE.sol` (ERC-20), `ProfileNFT.sol` (ERC-721), `TrustScore.sol`, `Voting.sol`, `Evolve2Earn.sol` (emočių dovanos + atlygiai), `Governance.sol`, `BondManager.sol` (2 ir 3 režimai), `EvolveFund.sol`, `VerificationRegistry.sol`, `DNAVerification.sol`, ERC-4337 `SmartAccountFactory` + `Paymaster` bei OpenZeppelin `TimelockController`.

Išsamiai: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md) (angliškai).

## Veiksmų planas

Vykdoma: žiniatinklio programos paruošimas gamybai. Planuojama: grandinėje esantis laboratorijų registras ir testų sertifikavimas, realus pašto teikėjo adapteris laboratorinių ataskaitų gavimui, grandinėje patvirtinti patvirtinimai profiliuose, tokenų vestingo atnaujinimas įkūrėjų/plėtotojų alokacijoms, DEX likvidumo tiekimas (šiuo metu blokuota — reikia tokenų įdiegimo pagrindiniame tinkle). Kelių tinklų plėtra (Arbitrum, Avalanche ir kitos EVM grandinės) seks po testinio tinklo sutvirtinimo.

Pilnas sąrašas: [docs/ROADMAP.md](docs/ROADMAP.md) (angliškai).

## Pradžia (kūrėjams)

Reikalavimai: **Node.js 20+** ir npm 10.x.

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

## Prisidėjimas

Indėliai laukiami — kodas, klaidų pranešimai, funkcijų pasiūlymai ir pasiūlymai. Prieš pradėdami perskaitykite [CONTRIBUTING.md](CONTRIBUTING.md) ir mūsų [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Palaikykite projektą

Jei EVOLVE atrodo naudinga, galite paremti kūrimą auka — išsami informacija [DONATE.md](DONATE.md). Verčiau tinklalapį? Naudokite daugiakalbį aukojimo puslapį (34 kalbos): **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**.

**Tokenų pardavimo nėra ir nebus.** Į EVOLVE tokenus „investuoti“ negalima; aukos yra dovanos atvirojo kodo kūrimo palaikymui ir nesuteikia rėmėjui teisių į tokenus, kapitalą, grąžą ar jokį finansinį reikalavimą.

## Saugyklos (veidrodžiai)

| Veidrodis | URL                                        |
| --------- | ------------------------------------------ |
| GitHub    | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg  | https://codeberg.org/limitafternoon/Evolve |
| GitLab    | https://gitlab.com/evolve-group3/evolve    |

## Dokumentacija

- [Kas ir kodėl](docs/WHAT-AND-WHY.md) — problema, vizija, pagrindinės vertybės (angliškai)
- [Kaip tai veikia](docs/HOW-IT-WORKS.md) — naudotojų procesai žingsnis po žingsnio (angliškai)
- [Architektūra](docs/ARCHITECTURE.md) — monorepo, paketai, duomenų srautai (angliškai)
- [Tokenomika](docs/TOKENOMICS.md) — tokenų modelis ir pasiūlos pasiskirstymas (angliškai)
- [Veiksmų planas](docs/ROADMAP.md) — etapai ir dabartinė būsena (angliškai)
- [DUK](docs/FAQ.md) — dažnai užduodami klausimai (angliškai)
- [Piniginių vadovas](docs/WALLETS.md) — kaip sukurti pinigines ir gauti aukojimo adresus (angliškai)

## Licencija

Licencijuota pagal [MIT licenciją](LICENSE).

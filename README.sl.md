[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)

# EVOLVE

**Zmenki, zanositev in preverjanje zdravja — zasebnost privzeto, preverjanje tam, kjer je pomembno.**

EVOLVE je odprtokodna, decentralizirana platforma za preverljive intimne povezave: zmenki, zanositev in anonimna STD/DNA združljivost. Prijavite se s svojo kripto denarnico (Sign-In with Ethereum) — brez telefonske številke, brez e-pošte, brez KYC — dostop do računa pa lahko obnovite z on-chain DNA zavezujočim zapisom. Zdravstveni podatki ostanejo vaši: rezultati testov se razčlenjujejo samodejno, posamezni statusi povzročiteljev se **nikoli** nikomur ne prikažejo, ujemanje pa temelji samo na anonimnih verdiktih združljivosti (Safe / Compatible / Caution / Risk). Klepet poteka neposredno med uporabniki (peer-to-peer) prek libp2p in Nostr (z HTTP rezervo za udobje), aplikacija pa vsebuje lahkotno javno fasado „Safety Mode“ in samostojni Companion Mode za oceno rezultatov STD testov.

> **Status: zgodnja alfa.** EVOLVE je v aktivnem razvoju in ni končan izdelek.
> Pametne pogodbe so uvedene **samo na testnem omrežju Ethereum Sepolia**.
> **Ni uvedbe na glavnem omrežju, ne DEX, ne likvidnosti in ne javne prodaje žetonov** — in nič od tega ne obljujemo.
> Funkcionalnosti se lahko kadar koli spremenijo ali pokvarijo. Nič tu ni finančno svetovanje ali investicijska ponudba.

## Kaj in zakaj

Tradicionalne platforme za zmenke od vas zahtevajo, da centralni zbirki podatkov predate telefonsko številko, e-pošto, fotografije in intimne zdravstvene podrobnosti. EVOLVE izhaja iz nasprotne predpostavke: zasebnost privzeto, samostojna hramba (self-custody) in brez osrednje točke odpovedi. Ključne vrednote:

- **Zasebnost privzeto** — zdravstveni podatki se nikoli ne razkrijejo; samo anonimni verdikti.
- **Odpornost na izključitve** — predvsem P2P sporočanje, decentralizirana shramba (IPFS / Arweave), večomrežna zasnova, brez vkodiranih domen.
- **Self-custody identiteta** — vaša denarnica je vaša prijava; obnova prek DNA namesto e-pošte/telefona.
- **Brez KYC pregrade** — za uporabo platforme ni zahtevan osebni dokument, telefon ali e-pošta.

Celotna utemeljitev: [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md).

## Ključne funkcije

### Identiteta in zasebnost

- **Prijava z denarnico SIWE** (MetaMask in druge denarnice EVM) — cenzuri odporen rešilni izhod.
- **Obnova računa prek DNA** — rezultat testa DNA se zgoščuje (SHA-256, on-chain zavezujoči zapis kot `bytes32`) in lahko obnovi dostop brez telefona in e-pošte.
- **Abstrakcija računa (ERC-4337)** — pametni računi in paymaster za onboarding brez plačila gasa; SIWE je vedno na voljo.

### Anonimna zdravstvena združljivost

- Nalaganje rezultatov STD testov kot besedilo ali PDF (izluščitev besedilne plasti z OCR rezervo za skenirane strani).
- Razčlenjevalnik prepozna 8 povzročiteljev: HIV-1/2, sifilis, klamidija, gonoreja, HSV-1, HSV-2, hepatitis B, hepatitis C (oblike poročil v angleščini, ukrajinščini in ruščini).
- **Posamezen status povzročiteljev se nikoli ne prikaže drugim uporabnikom.** Profili pokažejo samo anonimni verdikt: **Safe / Compatible / Caution / Risk**.
- On-chain zapisi preverjanja DNA (`DNAVerification.sol`) poganjajo tokove obnove in preverjanja.

### Profili, iskanje in komunikacija

- Iskalni filtri: „Kaj iščete“ (zmenki / zanositev / poliandrična zanositev / STD testiranje), „Koga iščete“ (moški, ženske, pari), kaskadni izbiri država → mesto, „lahko pride v vašo državo“ s seznami po državah, barva kože, prednost testiranja, samo STD-združljivi.
- Čarovnik za onboarding: starost (možno skriti), jeziki, bio, fotografija.
- **Zasebnost fotografij**: fotografije so privzeto zabrisane; lastnik podeljuje 15-sekundne ali trajne vpoglede — proaktivno ali na zahtevo. Vpogled je brezplačen.
- **P2P klepet** prek libp2p (gossipsub) + Nostr, z rezervo na HTTP API.

### Načini zanositve

- **Način 2 — Pregnancy Bond**: ženska ustvari bond, moški položi EVOLVE v stake (≥ 100 v trenutni testni različici), oba potrdita; po potrjeni nosečnosti in očetovstvu stake preide na žensko.
- **Način 3 — Cryptic Choice**: ženska odpre 48-urno sejo, moški se pridružijo s stakeom; ona izbere očeta — njegov stake se vrne, pri ostalih se znesek razdeli: 90 % njej / 10 % izbranemu očetu.

### Laboratoriji in preverjanje

- **Tok partnerskih laboratorijev**: laboratoriji se registrirajo kot partnerji, preverjajo paciente prek QR kode in ujemanja obraza ter priložijo STD poročila (PDF/besedilo z OCR izluščitvijo).
- **Companion Mode**: samostojni tok za oceno rezultatov STD testov brez vpisa na platformo za zmenke.
- **Safety Mode** (`VITE_PRODUCT_MODE=safety`): omejena javna fasada (status STD, javne povezave profilov, preverjanja združljivosti), ki deluje tudi, če so funkcije zmenkov ali zanositve omejene v kakšni pristojnosti ali trgovini z aplikacijami.

### Žeton EVOLVE (samo testno omrežje)

- ERC-20, največja ponudba 8.000.000.000 EVOLVE, skrbniška dejanja so varovana s 48-urnim TimelockController.
- **Ekonomija emoji daril**: darilo stane 1 EVOLVE, ki se sorazmerno razdeli med obstoječe lastnike daril — trajni prihodkovni model za imetnike; darila so prenosljiva.
- **EvolveFund**: moški staking (min 15 EVOLVE, 30-dnevna zaklenitev), ki se šteje v težo glasu pri upravljanju; ženske uporabljajo saldo denarnice.
- **Nagrade za preverjanje**: 1 EVOLVE preverjenemu uporabniku in 1 EVOLVE potrjujočemu laboratoriju ob STD/DNA preverjanju (plus testni pip (faucet) z omejitvami).
- Teža glasu pri upravljanju združuje rekurzivni ugled (8 glasov, globina 3), delež otrok/očetovstva ter v stake postavljene ali držane EVOLVE.
- Integracija **LayerZero OFT** za prihodnje večverižne prenose EVOLVE (odvisnosti so na mestu; izven Sepolie ni nič uvedeno).

### Platforma

- Spletna aplikacija (namestljiva kot PWA) in mobilna aplikacija Expo/React Native.
- Vmesnik preveden v **34 jezikov**.
- Večomrežna pripravljenost: 18 konfiguracij omrežij EVM (Arbitrum in Avalanche sta načrtovani primarni L2 — **še nista uvedeni**).

## Arhitektura in tehnološki sklad

Monorepo, upravljan z npm workspaces + Turborepo:

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

Ključne pametne pogodbe: `EVOLVE.sol` (ERC-20), `ProfileNFT.sol` (ERC-721), `TrustScore.sol`, `Voting.sol`, `Evolve2Earn.sol` (emoji darila + nagrade), `Governance.sol`, `BondManager.sol` (načina 2 in 3), `EvolveFund.sol`, `VerificationRegistry.sol`, `DNAVerification.sol`, ERC-4337 `SmartAccountFactory` + `Paymaster` in OpenZeppelin `TimelockController`.

Podrobnosti: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md)

## Načrt razvoja

V teku: pripravljanje spletne aplikacije na produkcijsko uporabo. Načrtovano: on-chain register laboratorijev in certifikacija testov, prilagodnik pravega ponudnika pošte za prejemanje laboratorijskih poročil, on-chain preverjene atestacije v profilih, posodobitev vestinga žetonov za alocacije ustanoviteljev/razvijalcev, zagotavljanje DEX likvidnosti (trenutno blokirano — zahteva uvedbe žetonov na glavno omrežje). Večomrežna širitev (Arbitrum, Avalanche in druga omrežja EVM) sledi po utrditvi testnega omrežja.

Celoten seznam: [docs/ROADMAP.md](docs/ROADMAP.md).

## Začetek (razvijalci)

Zahteve: **Node.js 20+** in npm 10.x.

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

## Prispevanje

Prispevki so dobrodošli — koda, poročila o napakah, predlogi funkcij in drugi predlogi. Pred začetkom preberite [CONTRIBUTING.md](CONTRIBUTING.md) in naš [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Podprite projekt

Če vam je EVOLVE v pomoč, lahko podprite razvoj z donacijo — podrobnosti v [DONATE.md](DONATE.md). Raje imate spletno stran? Uporabite večjezično stran za donacije (34 jezikov): **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**.

**Prodaje žetonov ni in je ne bo.** V EVOLVE ni mogoče „investirati“; donacije so darila za podporo odprtokodnemu razvoju in dajalcu ne dajejo pravice do žetonov, deležev, donosov ali kakršnih koli finančnih zahtevkov.

## Repozitoriji (zrcala)

| Zrcalo   | URL                                        |
| -------- | ------------------------------------------ |
| GitHub   | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg | https://codeberg.org/limitafternoon/Evolve |
| GitLab   | https://gitlab.com/evolve-group3/evolve    |

## Dokumentacija

- [Kaj in zakaj](docs/WHAT-AND-WHY.md) — problem, vizija, ključne vrednote
- [Kako deluje](docs/HOW-IT-WORKS.md) — uporabniški tokovi, korak za korakom
- [Arhitektura](docs/ARCHITECTURE.md) — monorepo, paketi, tokovi podatkov
- [Tokenomika](docs/TOKENOMICS.md) — model žetona in porazdelitev ponudbe
- [Načrt razvoja](docs/ROADMAP.md) — mejniki in trenutni status
- [FAQ](docs/FAQ.md) — pogosta vprašanja
- [Vodnik po denarnicah](docs/WALLETS.md) — kako ustvariti denarnice in pridobiti naslove za donacije

## Licenca

Licencirano pod [MIT License](LICENSE).

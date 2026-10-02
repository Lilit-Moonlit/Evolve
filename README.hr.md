[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)

# EVOLVE

**Upoznavanje, začeće i provjera zdravlja — privatnost prema zadanim postavkama, provjera tamo gdje je važno.**

EVOLVE je open-source, decentralizirana platforma za provjerljive intimne veze: upoznavanje, začeće i anonimnu STD/DNA kompatibilnost. Prijavljujete se vlastitim kripto novčanikom (Sign-In with Ethereum) — bez telefonskog broja, bez e-pošte, bez KYC — a pristup računu možete obnoviti putem on-chain DNA obveze. Zdravstveni podaci ostaju vaši: rezultati testova parsiraju se automatski, pojedinačni statusi patogena **nikad** se nikome ne prikazuju, a uparivanje se oslanja samo na anonimne verdikte kompatibilnosti (Safe / Compatible / Caution / Risk). Chat radi peer-to-peer putem libp2p i Nostr (s HTTP fallbackom za praktičnost), a aplikacija dolazi s laganim javnim fasadama „Safety Mode“ i samostalnim Companion Modeom za ocjenu rezultata STD testova.

> **Status: rana alfa.** EVOLVE se aktivno razvija i nije gotov proizvod.
> Pametni ugovori deployani su **samo na Ethereum Sepolia testnetu**.
> **Nema deploya na mainnet, DEX-a, likvidnosti ni javne prodaje tokena** — i ništa od toga ne obećavamo.
> Značajke se mogu u svakom trenutku mijenjati ili prestati raditi. Ništa ovdje nije financijski savjet ni investicijska ponuda.

## Što i zašto

Tradicijske platforme za upoznavanje traže da im predate telefonski broj, e-poštu, fotografije i intimne zdravstvene detalje u središnju bazu podataka. EVOLVE polazi od suprotnog polazišta: privatnost prema zadanim postavkama, samostalno čuvanje (self-custody) i bez središnje točke pogreške. Ključne vrijednosti:

- **Privatnost prema zadanim postavkama** — zdravstveni podaci se nikad ne otkrivaju; samo anonimni verdikti.
- **Otpornost na banove** — poruke prvo P2P, decentralizirana pohrana (IPFS / Arweave), višemrežni dizajn, bez hardkodiranih domena.
- **Self-custody identitet** — vaš novčanik je vaša prijava; obnova putem DNK umjesto e-pošte/telefona.
- **Bez KYC-a** — za korištenje platforme nisu potrebni osobna iskaznica, telefon ni e-pošta.

Cijelo obrazloženje: [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md).

## Ključne značajke

### Identitet i privatnost

- **Prijava novčanikom SIWE** (MetaMask i drugi EVM novčanici) — cenzuri otporan sigurnosni izlaz.
- **Obnova računa putem DNK** — rezultat DNK testa se hashira (SHA-256, on-chain obveza kao `bytes32`) i može obnoviti pristup bez telefona i e-pošte.
- **Apstrakcija računa (ERC-4337)** — pametni računi i paymaster za onboarding bez gasa; SIWE ostaje uvijek dostupan.

### Anonimna zdravstvena kompatibilnost

- Upload rezultata STD testova kao običan tekst ili PDF (ekstrakcija tekstualnog sloja s OCR fallbackom za skenirane stranice).
- Parser prepoznaje 8 patogena: HIV-1/2, sifilis, klamidija, gonoreja, HSV-1, HSV-2, hepatitis B, hepatitis C (formati izvješća na engleskom, ukrajinskom i ruskom).
- **Pojedinačni status patogena nikad se ne prikazuje drugim korisnicima.** Profili pokazuju samo anonimni verdikt: **Safe / Compatible / Caution / Risk**.
- On-chain zapisi DNK provjere (`DNAVerification.sol`) pokreću tokove obnove i provjere.

### Profili, pretraga i komunikacija

- Filteri pretrage: „Što tražite“ (upoznavanje / začeće / poliandrijsko začeće / STD testiranje), „Koga tražite“ (muškarci, žene, parovi), kaskadni odabiri država → grad, „može doći u vašu državu” s popisima po državama, boja kože, preferencija testiranja, samo STD-kompatibilni.
- Čarobnjak za onboarding: dob (može se sakriti), jezici, bio, fotografija.
- **Privatnost fotografija**: fotografije su prema zadanim postavkama zamagljene; vlasnik dodjeljuje 15-sekundne ili trajne uvide — proaktivno ili na zahtjev. Gledanje je besplatno.
- **P2P chat** putem libp2p (gossipsub) + Nostr, s fallbackom na HTTP API.

### Načini začeća

- **Način 2 — Pregnancy Bond**: žena stvara bond, muškarac stakuje EVOLVE (≥ 100 u trenutnoj testnet verziji), oboje potvrđuju; nakon potvrđene trudnoće i očinstva stake prelazi ženi.
- **Način 3 — Cryptic Choice**: žena otvara 48-satnu sesiju, muškarci se pridružuju stakingom; ona bira oca — njegov stake se vraća, a kod ostalih se iznos dijeli: 90 % njoj / 10 % odabranom ocu.

### Laboratoriji i provjera

- **Tok partnerskih laboratorija**: laboratoriji se registriraju kao partneri, provjeravaju pacijente putem QR koda i podudaranja lica te prilažu STD izvješća (PDF/tekst s OCR ekstrakcijom).
- **Companion Mode**: samostalni tok za ocjenu rezultata STD testova bez registracije na platformi za upoznavanje.
- **Safety Mode** (`VITE_PRODUCT_MODE=safety`): ograničena javna fasada (STD status, javne poveznice profila, provjere kompatibilnosti) koja nastavlja raditi čak i ako se značajke upoznavanja ili začeća ograniče u nekoj jurisdikciji ili trgovini aplikacijama.

### Token EVOLVE (samo testnet)

- ERC-20, maksimalna ponuda 8.000.000.000 EVOLVE, administratorske radnje zaštićene su 48-satnim TimelockControllerom.
- **Ekonomija emoji poklona**: poklon košta 1 EVOLVE, koji se dijeli razmjerno među postojeće vlasnike poklona — trajni model prihoda za držače; pokloni su prenosivi.
- **EvolveFund**: muški staking (min 15 EVOLVE, zaključavanje na 30 dana) koji se računa u težinu glasa u governanceu; žene koriste saldo novčanika.
- **Nagrade za provjeru**: 1 EVOLVE provjerenom korisniku i 1 EVOLVE laboratoriju koji je potvrdio pri STD/DNA provjeri (plus testni faucet s ograničenjem).
- Težina glasa u governanceu kombinira rekurzivnu reputaciju (8 glasova, dubina 3), udio djece/očinstva te stavljene ili držane EVOLVE.
- Integracija **LayerZero OFT** za buduće multichain prijenose EVOLVE (ovisnosti su na mjestu; izvan Sepolie ništa nije deployano).

### Platforma

- Web aplikacija (instalabilna kao PWA) i mobilna aplikacija na Expo/React Native.
- Sučelje prevedeno na **34 jezika**.
- Višemrežna spremnost: 18 konfiguracija EVM mreža (Arbitrum i Avalanche su planirane primarne L2 — **još nisu deployane**).

## Arhitektura i tehnološki stack

Monorepo upravljan s npm workspaces + Turborepo:

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

Ključni pametni ugovori: `EVOLVE.sol` (ERC-20), `ProfileNFT.sol` (ERC-721), `TrustScore.sol`, `Voting.sol`, `Evolve2Earn.sol` (emoji pokloni + nagrade), `Governance.sol`, `BondManager.sol` (načini 2 i 3), `EvolveFund.sol`, `VerificationRegistry.sol`, `DNAVerification.sol`, ERC-4337 `SmartAccountFactory` + `Paymaster` te OpenZeppelin `TimelockController`.

Detalji: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md)

## Roadmapa

U tijeku: priprema web aplikacije za produkciju. Planirano: on-chain registar laboratorija i certifikacija testova, adapter pravog pružatelja usluge e-pošte za prijam laboratorijskih izvješća, on-chain provjerene atestacije u profilima, ažuriranje vestinga tokena za alokacije osnivača/razvojnih programera, osiguranje DEX likvidnosti (trenutno blokirano — zahtijeva deploy tokena na mainnet). Višemrežno širenje (Arbitrum, Avalanche i druge EVM mreže) slijedi nakon učvršćivanja testneta.

Cijeli popis: [docs/ROADMAP.md](docs/ROADMAP.md).

## Početak rada (razvojni programeri)

Zahtjevi: **Node.js 20+** i npm 10.x.

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

## Doprinošenje

Doprinosi su dobrodošli — kod, prijave grešaka, prijedlozi značajki i drugi prijedlozi. Prije početka pročitajte [CONTRIBUTING.md](CONTRIBUTING.md) i naš [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Podržite projekt

Ako vam je EVOLVE koristan, možete podržati razvoj donacijom — detalji su u [DONATE.md](DONATE.md). Preferirate web stranicu? Koristite višejezičnu stranicu za donacije (34 jezika): **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**.

**Prodaje tokena nema i neće je biti.** U EVOLVE se ne može „investirati”; donacije su pokloni za podršku open-source razvoju i ne daju donatoru pravo na tokene, udjele, prinose niti bilo kakav financijski zahtjev.

## Repozitoriji (mirrori)

| Mirror   | URL                                        |
| -------- | ------------------------------------------ |
| GitHub   | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg | https://codeberg.org/limitafternoon/Evolve |
| GitLab   | https://gitlab.com/evolve-group3/evolve    |

## Dokumentacija

- [Što i zašto](docs/WHAT-AND-WHY.md) — problem, vizija, ključne vrijednosti
- [Kako radi](docs/HOW-IT-WORKS.md) — korisnički tokovi, korak po korak
- [Arhitektura](docs/ARCHITECTURE.md) — monorepo, paketi, tokovi podataka
- [Tokenomika](docs/TOKENOMICS.md) — model tokena i raspodjela ponude
- [Roadmapa](docs/ROADMAP.md) — miljokazi i trenutni status
- [FAQ](docs/FAQ.md) — česta pitanja
- [Vodič za novčanike](docs/WALLETS.md) — kako kreirati novčanike i dobiti adrese za donacije

## Licenca

Licencirano pod [MIT License](LICENSE).

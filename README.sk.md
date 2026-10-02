[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)

# EVOLVE

**Zoznamka, počatie a overenie zdravia — súkromie predvolene, overenie tam, kde na tom záleží.**

EVOLVE je open-source, decentralizovaná platforma overiteľných intimných spojení: zoznamovanie, počatie a anonymná STD/DNA kompatibilita. Prihlasujete sa vlastnou krypto peňaženkou (Sign-In with Ethereum) — bez telefónneho čísla, bez e-mailu, bez KYC — a prístup k účtu môžete obnoviť prostredníctvom on-chain DNA záväzku. Zdravotné údaje zostávajú vaše: výsledky testov sa parsujú automaticky, jednotlivé stavy patogénov sa **nikdy** nikomu nezobrazujú a párovanie sa spolieha len na anonymné verdikty kompatibility (Safe / Compatible / Caution / Risk). Chat beží peer-to-peer cez libp2p a Nostr (s HTTP fallbackom pre pohodlie) a aplikácia obsahuje odľahčenú verejnú fasádu „Safety Mode“ a samostatný Companion Mode na vyhodnotenie výsledkov STD testov.

> **Stav: raná alfa.** EVOLVE sa aktívne vyvíja a nie je dokončeným produktom.
> Smart kontrakty sú nasadené **len na testovacej sieti Ethereum Sepolia**.
> **Nie je tu žiadne nasadenie na mainnete, žiadny DEX, žiadna likvidita ani verejný predaj tokenov** — a nič z toho nesľubujeme.
> Funkcie sa môžu kedykoľvek zmeniť alebo pokaziť. Nič tu nie je finančné poradenstvo ani investičná ponuka.

## Čo a prečo

Tradičné zoznamovacie platformy po vás chcú odovzdať telefónne číslo, e-mail, fotky a intimné zdravotné detaily do centrálnej databázy. EVOLVE vychádza z opačného predpokladu: súkromie predvolene, vlastná správa (self-custody) a žiadny centrálny bod zlyhania. Kľúčové hodnoty:

- **Súkromie predvolene** — zdravotné údaje sa nikdy nezverejňujú; len anonymné verdikty.
- **Odolnosť voči banom** — komunikácia na prvom mieste P2P, decentralizované úložisko (IPFS / Arweave), viacsieťový návrh, žiadne natvrdo zapísané domény.
- **Self-custody identita** — vaša peňaženka je váš login; obnova cez DNA namiesto e-mailu/telefónu.
- **Žiadna KYC brána** — na používanie platformy nie je vyžadovaný občiansky preukaz, telefón ani e-mail.

Celé odôvodnenie: [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md).

## Kľúčové funkcie

### Identita a súkromie

- **Prihlásenie peňaženkou SIWE** (MetaMask a ďalšie EVM peňaženky) — cenzúre odolná záchranná cesta.
- **Obnova účtu cez DNA** — výsledok DNA testu sa hašuje (SHA-256, on-chain záväzok ako `bytes32`) a môže obnoviť prístup bez telefónu a e-mailu.
- **Abstrakcia účtu (ERC-4337)** — smart účty a paymaster pre onboarding bez poplatkov za gas; SIWE zostáva vždy k dispozícii.

### Anonymná zdravotná kompatibilita

- Nahranie výsledkov STD testov ako obyčajný text alebo PDF (extrakcia textovej vrstvy s OCR fallbackom pre skenované stránky).
- Parser rozpoznáva 8 patogénov: HIV-1/2, syfilis, chlamýdie, kvapavka, HSV-1, HSV-2, hepatitída B, hepatitída C (formáty správ v angličtine, ukrajinčine a ruštine).
- **Jednotlivý stav patogénov sa nikdy nezobrazuje ostatným používateľom.** Profily ukazujú len anonymný verdikt: **Safe / Compatible / Caution / Risk**.
- On-chain záznamy overenia DNA (`DNAVerification.sol`) poháňajú toky obnovy a overovania.

### Profily, vyhľadávanie a komunikácia

- Vyhľadávacie filtre: „Čo hľadáte“ (zoznamka / počatie / poliandrické počatie / STD testovanie), „Koho hľadáte“ (muži, ženy, páry), kaskádové výbery krajina → mesto, „môže prísť do vašej krajiny“ so zoznamami pre jednotlivé krajiny, farba pleti, preferencia testovania, len STD-kompatibilní.
- Sprievodca onboardingom: vek (možno skryť), jazyky, bio, fotka.
- **Súkromie fotiek**: fotky sú predvolene rozostrené; vlastník udeľuje 15-sekundové alebo trvalé zobrazenia — proaktívne alebo na žiadosť. Prezeranie je bezplatné.
- **P2P chat** cez libp2p (gossipsub) + Nostr, s fallbackom na HTTP API.

### Režimy počatia

- **Režim 2 — Pregnancy Bond**: žena vytvorí bond, muž stakuje EVOLVE (≥ 100 v aktuálnom testnetovom builde), obaja potvrdia; po potvrdenom tehotenstve a otcovstve prechádza stake na ženu.
- **Režim 3 — Cryptic Choice**: žena otvorí 48-hodinovú reláciu, muži sa pripájajú stakingom; ona vyberie otca — jeho stake sa vracia, u ostatných sa čiastka delí: 90 % jej / 10 % vybranému otcovi.

### Laboratóriá a overovanie

- **Tok laboratórií-partnerov**: laboratóriá sa registrujú ako partneri, overujú pacientov cez QR kód a rozpoznávanie tváre a prikladajú STD správy (PDF/text s OCR extrakciou).
- **Companion Mode**: samostatný tok na vyhodnotenie výsledkov STD testov bez registrácie na zoznamovacej platforme.
- **Safety Mode** (`VITE_PRODUCT_MODE=safety`): obmedzená verejná fasáda (STD stav, verejné odkazy profilov, kontroly kompatibility), ktorá funguje aj vtedy, keď budú zoznamovacie alebo počatkové funkcie obmedzené v nejakej jurisdikcii alebo app store.

### Token EVOLVE (len testnet)

- ERC-20, maximálna ponuka 8 000 000 000 EVOLVE, administratívne akcie chránené 48-hodinovým TimelockController.
- **Ekonomika emoji darčekov**: darček stojí 1 EVOLVE, ktorý sa delí pomerne medzi existujúcich vlastníkov darčekov — trvalý príjmový model pre držiteľov; darčeky sú prenositeľné.
- **EvolveFund**: mužský staking (min 15 EVOLVE, 30-dňové uzamknutie), ktorý sa počíta do váhy hlasu v governance; ženy používajú zostatok peňaženky.
- **Odmeny za overenie**: 1 EVOLVE overenému používateľovi a 1 EVOLVE potvrdzujúcemu laboratóriu pri STD/DNA overení (plus testovací faucet s limitom).
- Váha hlasu v governance kombinuje rekurzívnu reputáciu (8 hlasov, hĺbka 3), podiel detí/otcovstva a nastakované alebo držané EVOLVE.
- Integrácia **LayerZero OFT** pre budúce multichain prevody EVOLVE (závislosti sú pripravené; mimo Sepolie zatiaľ nič nasadené).

### Platforma

- Webová aplikácia (inštalovateľná ako PWA) a mobilná aplikácia Expo/React Native.
- Rozhranie preložené do **34 jazykov**.
- Viacsieťová pripravenosť: 18 konfigurácií EVM sietí (Arbitrum a Avalanche sú plánované primárne L2 — **ešte nie sú nasadené**).

## Architektúra a technologický stack

Monorepo spravované cez npm workspaces + Turborepo:

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

Kľúčové smart kontrakty: `EVOLVE.sol` (ERC-20), `ProfileNFT.sol` (ERC-721), `TrustScore.sol`, `Voting.sol`, `Evolve2Earn.sol` (emoji darčeky + odmeny), `Governance.sol`, `BondManager.sol` (režimy 2 a 3), `EvolveFund.sol`, `VerificationRegistry.sol`, `DNAVerification.sol`, ERC-4337 `SmartAccountFactory` + `Paymaster` a OpenZeppelin `TimelockController`.

Podrobnosti: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md)

## Roadmapa

Prebieha: pripravovanie webovej aplikácie na produkciu. Plánované: on-chain register laboratórií a certifikácia testov, adaptér reálneho poštového poskytovateľa pre príjem laboratórnych správ, on-chain overené atestácie v profiloch, aktualizácia vestingu tokenov pre alokácie zakladateľov/vývojárov, zabezpečenie DEX likvidity (momentálne zablokované — vyžaduje nasadenie tokenov na mainnet). Viacsieťová expanzia (Arbitrum, Avalanche a ďalšie EVM siete) príde po spevnení testnetu.

Celý zoznam: [docs/ROADMAP.md](docs/ROADMAP.md).

## Ako začať (vývojári)

Požiadavky: **Node.js 20+** a npm 10.x.

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

## Prispievanie

Príspevky sú vítané — kód, hlásenia chýb, návrhy funkcií a ďalšie nápady. Pred začatím si prečítajte [CONTRIBUTING.md](CONTRIBUTING.md) a náš [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Podporte projekt

Ak vám EVOLVE príde užitočný, môžete podporiť vývoj darom — detaily v [DONATE.md](DONATE.md). Uprednostňujete webovú stránku? Použite viacjazyčnú stránku darov (34 jazykov): **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**.

**Žiadny predaj tokenov nie je a nebude.** Do EVOLVE nemožno „investovať“; dary sú darčeky na podporu open-source vývoja a nedávajú darcovi nárok na tokeny, podiely, výnosy ani akékoľvek finančné nároky.

## Repozitáre (mirrory)

| Mirror   | URL                                        |
| -------- | ------------------------------------------ |
| GitHub   | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg | https://codeberg.org/limitafternoon/Evolve |
| GitLab   | https://gitlab.com/evolve-group3/evolve    |

## Dokumentácia

- [Čo a prečo](docs/WHAT-AND-WHY.md) — problém, vízia, kľúčové hodnoty
- [Ako to funguje](docs/HOW-IT-WORKS.md) — používateľské toky, krok za krokom
- [Architektúra](docs/ARCHITECTURE.md) — monorepo, balíky, toky údajov
- [Tokenomika](docs/TOKENOMICS.md) — model tokenu a rozdelenie ponuky
- [Roadmapa](docs/ROADMAP.md) — míľniky a aktuálny stav
- [FAQ](docs/FAQ.md) — časté otázky
- [Sprievodca peňaženkami](docs/WALLETS.md) — ako si vytvoriť peňaženky a získať adresy pre dary

## Licencia

Licencované pod [MIT License](LICENSE).

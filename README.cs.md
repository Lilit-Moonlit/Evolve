[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)

# EVOLVE

**Seznamka, početí a ověření zdraví — soukromí ve výchozím nastavení, ověření tam, kde na tom záleží.**

EVOLVE je open-source, decentralizovaná platforma pro ověřitelná intimní spojení: seznamování, početí a anonymní STD/DNA kompatibilitu. Přihlašujete se vlastní kryptopeněženkou (Sign-In with Ethereum) — bez telefonního čísla, bez e-mailu, bez KYC — a přístup k účtu můžete obnovit pomocí on-chain DNA závazku. Zdravotní data zůstávají vaše: výsledky laboratorních testů se parsují automaticky, jednotlivé statusy patogenů se **nikdy** nikomu nezobrazují a párování se spoléhá pouze na anonymní verdikty kompatibility (Safe / Compatible / Caution / Risk). Chat běží peer-to-peer přes libp2p a Nostr (s HTTP fallbackem pro pohodlí) a aplikace obsahuje odlehčenou veřejnou fasádu „Safety Mode“ a samostatný Companion Mode pro vyhodnocení výsledků STD testů.

> **Stav: raná alfa.** EVOLVE je aktivně vyvíjen a není hotovým produktem.
> Chytré kontrakty jsou nasazeny **pouze na testovací síti Ethereum Sepolia**.
> **Není tu žádné nasazení na mainnetu, žádný DEX, žádná likvidita ani veřejný prodej tokenů** — a nic z toho neslibujeme.
> Funkce se mohou kdykoli změnit nebo rozbít. Nic zde není finančním poradenstvím ani investiční nabídkou.

## Co a proč

Tradiční seznamovací platformy po vás chtějí odevzdat telefonní číslo, e-mail, fotky a intimní zdravotní detaily do centrální databáze. EVOLVE vychází z opačného předpokladu: soukromí ve výchozím nastavení, vlastní správa (self-custody) a žádný centrální bod selhání. Klíčové hodnoty:

- **Soukromí ve výchozím nastavení** — zdravotní data nejsou nikdy odhalena; pouze anonymní verdikty.
- **Odolnost vůči banům** — prvořadá P2P komunikace, decentralizované úložiště (IPFS / Arweave), vícesíťový návrh, žádné natvrdo zapsané domény.
- **Self-custody identita** — vaše peněženka je váš login; obnova přes DNA místo e-mailu/telefonu.
- **Žádná KYC brána** — k používání platformy není vyžadován občanský průkaz, telefon ani e-mail.

Celé zdůvodnění: [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md).

## Klíčové funkce

### Identita a soukromí

- **Přihlášení peněženkou SIWE** (MetaMask a další EVM peněženky) — cenzuře odolná záchranná cesta.
- **Obnova účtu přes DNA** — výsledek DNA testu se hašuje (SHA-256, on-chain závazek jako `bytes32`) a může obnovit přístup bez telefonu a e-mailu.
- **Abstrakce účtu (ERC-4337)** — chytré účty a paymaster pro onboarding bez poplatků za gas; SIWE zůstává vždy k dispozici.

### Anonymní zdravotní kompatibilita

- Nahrávání výsledků STD testů jako prostý text nebo PDF (extrakce textové vrstvy s OCR fallbackem pro skenované stránky).
- Parser rozpozná 8 patogenů: HIV-1/2, syfilis, chlamydie, kapavka, HSV-1, HSV-2, hepatitida B, hepatitida C (formáty zpráv v angličtině, ukrajinštině a ruštině).
- **Jednotlivý status patogenů se nikdy nezobrazuje ostatním uživatelům.** Profily ukazují pouze anonymní verdikt: **Safe / Compatible / Caution / Risk**.
- On-chain záznamy ověření DNA (`DNAVerification.sol`) pohánějí toky obnovy a ověřování.

### Profily, vyhledávání a komunikace

- Vyhledávací filtry: „Co hledáte“ (seznamka / početí / polyandrické početí / STD testování), „Koho hledáte“ (muži, ženy, páry), kaskádové výběry země → město, „může přijet do vaší země“ se seznamy pro jednotlivé země, barva pleti, preference testování, pouze STD-kompatibilní.
- Průvodce onboardingu: věk (lze skrýt), jazyky, bio, fotka.
- **Soukromí fotek**: fotky jsou ve výchozím nastavení rozostřené; vlastník uděluje 15sekundová nebo trvalá zobrazení — proaktivně nebo na žádost. Prohlížení je zdarma.
- **P2P chat** přes libp2p (gossipsub) + Nostr, s fallbackem na HTTP API.

### Režimy početí

- **Režim 2 — Pregnancy Bond**: žena vytvoří bond, muž stakuje EVOLVE (≥ 100 v aktuálním testnetovém buildu), oba potvrdí; po potvrzeném těhotenství a otcovství přechází stake na ženu.
- **Režim 3 — Cryptic Choice**: žena otevře 48hodinovou relaci, muži se připojují stakeováním; ona vybere otce — jeho stake se vrací, u ostatních se částka dělí: 90 % jí / 10 % vybranému otci.

### Laboratoře a ověřování

- **Tok laboratoří-partnerů**: laboratoře se registrují jako partneři, ověřují pacienty přes QR kód a rozpoznávání obličeje a přikládají STD zprávy (PDF/text s OCR extrakcí).
- **Companion Mode**: samostatný tok pro vyhodnocení výsledků STD testů bez registrace na seznamovací platformě.
- **Safety Mode** (`VITE_PRODUCT_MODE=safety`): omezená veřejná fasáda (STD status, veřejné odkazy profilů, kontroly kompatibility), která funguje i tehdy, když budou seznamovací funkce nebo funkce početí omezeny v některé jurisdikci nebo app store.

### Token EVOLVE (pouze testnet)

- ERC-20, maximální nabídka 8 000 000 000 EVOLVE, administrativní akce chráněny 48hodinovým TimelockController.
- **Ekonomika emoji dárků**: dárek stojí 1 EVOLVE, který se dělí poměrně mezi existující vlastníky dárků — perpetuální příjmový model pro držitele; dárky jsou převoditelné.
- **EvolveFund**: mužský staking (min 15 EVOLVE, 30denní uzamčení), který se počítá do váhy hlasu v governance; ženy používají zůstatek peněženky.
- **Odměny za ověření**: 1 EVOLVE ověřenému uživateli a 1 EVOLVE potvrzující laboratoři při STD/DNA ověření (plus testovací faucet s limitem).
- Váha hlasu v governance kombinuje rekurzivní reputaci (8 hlasů, hloubka 3), podíl dětí/otcovství a nastakované nebo držené EVOLVE.
- Integrace **LayerZero OFT** pro budoucí multichain převody EVOLVE (závislosti jsou připraveny; mimo Sepolii zatím nic nasazeno).

### Platforma

- Webová aplikace (instalovatelná jako PWA) a mobilní aplikace Expo/React Native.
- Rozhraní přeloženo do **34 jazyků**.
- Vícesíťová připravenost: 18 konfigurací EVM sítí (Arbitrum a Avalanche jsou plánované primární L2 — **ještě nejsou nasazeny**).

## Architektura a technologický stack

Monorepo spravované přes npm workspaces + Turborepo:

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

Klíčové chytré kontrakty: `EVOLVE.sol` (ERC-20), `ProfileNFT.sol` (ERC-721), `TrustScore.sol`, `Voting.sol`, `Evolve2Earn.sol` (emoji dárky + odměny), `Governance.sol`, `BondManager.sol` (režimy 2 a 3), `EvolveFund.sol`, `VerificationRegistry.sol`, `DNAVerification.sol`, ERC-4337 `SmartAccountFactory` + `Paymaster` a OpenZeppelin `TimelockController`.

Podrobnosti: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md)

## Roadmapa

Probíhá: příprava webové aplikace na produkci. Plánováno: on-chain registr laboratoří a certifikace testů, adaptér skutečného poštovního poskytovatele pro příjem laboratorních zpráv, on-chain ověřené atestace v profilech, aktualizace vestingu tokenů pro alokace zakladatelů/vývojářů, zajištění DEX likvidity (momentálně zablokováno — vyžaduje nasazení tokenů na mainnet). Vícesíťová expanze (Arbitrum, Avalanche a další EVM sítě) přijde po zpevnění testnetu.

Celý seznam: [docs/ROADMAP.md](docs/ROADMAP.md).

## Začínáme (vývojáři)

Požadavky: **Node.js 20+** a npm 10.x.

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

## Přispívání

Příspěvky jsou vítány — kód, hlášení chyb, návrhy funkcí a další nápady. Než začnete, přečtěte si [CONTRIBUTING.md](CONTRIBUTING.md) a náš [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Podpořte projekt

Pokud vám EVOLVE přijde užitečný, můžete podpořit vývoj darem — detaily v [DONATE.md](DONATE.md). Preferujete webovou stránku? Použijte vícejazyčnou stránku darů (34 jazyků): **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**.

**Žádný prodej tokenů není a nebude.** Do EVOLVE nelze „investovat“; dary jsou dárky na podporu open-source vývoje a nedávají dárci nárok na tokeny, podíly, výnosy ani jakékoli finanční nároky.

## Repozitáře (mirrory)

| Mirror   | URL                                        |
| -------- | ------------------------------------------ |
| GitHub   | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg | https://codeberg.org/limitafternoon/Evolve |
| GitLab   | https://gitlab.com/evolve-group3/evolve    |

## Dokumentace

- [Co a proč](docs/WHAT-AND-WHY.md) — problém, vize, klíčové hodnoty
- [Jak to funguje](docs/HOW-IT-WORKS.md) — uživatelské toky, krok za krokem
- [Architektura](docs/ARCHITECTURE.md) — monorepo, balíčky, toky dat
- [Tokenomika](docs/TOKENOMICS.md) — model tokenu a rozdělení nabídky
- [Roadmapa](docs/ROADMAP.md) — milníky a aktuální stav
- [FAQ](docs/FAQ.md) — časté dotazy
- [Průvodce peněženkami](docs/WALLETS.md) — jak si vytvořit peněženky a získat adresy pro dary

## Licence

Licencováno pod [MIT License](LICENSE).

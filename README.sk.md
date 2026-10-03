[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)

# EVOLVE

**Zoznamovanie, počatie a overené zdravie — súkromie v predvolenom nastavení, dôvera tam, kde na nej záleží.**

EVOLVE je open-source, decentralizovaná platforma pre ľudí, ktorí majú dosť odovzdávania svojho telefónneho čísla, svojej tváre a svojich najintímnejších zdravotných údajov do cudzej databázy. Prihlasujete sa vlastnou krypto peňaženkou — bez telefónu, bez e-mailu, bez KYC — a účet si môžete vrátiť prostredníctvom on-chain záväzku DNA. Vaše zdravotné údaje zostávajú vaše: výsledky testov sa spracovávajú automaticky, stavy jednotlivých patogénov sa **nikdy** nikomu nezobrazujú a párovanie sa spolieha výhradne na anonymné verdikty kompatibility (Safe / Compatible / Caution / Risk). Chat beží peer-to-peer cez libp2p a Nostr, s HTTP fallbackom pre pohodlie.

> **Status — platforma dnes funguje; mainnet a DEX sú na rade.**
> Zoznamovanie, počatie, overovanie zdravia, laboratórny flow, P2P chat, token EVOLVE aj governance bežia. Ešte pred nami: **nasadenie na mainnet a DEX likvidita**, plus **plánovaný verejný predaj** (pozri [Token EVOLVE](#token-evolve-len-testovacia-sieť)).
> Smart kontrakty sú nasadené **len na testovacej sieti Ethereum Sepolia**. Nič tu nie je finančné poradenstvo ani investičná ponuka.

> **Považujete EVOLVE za užitočné? Podporte vývoj — každý dar ide na kód, laboratórne partnerstvá, hosting a preklady → [DONATE.md](DONATE.md).**

## Nie je čoho sa báť

EVOLVE je postavené okolo otázok, ktoré si ľudia skutočne kladú, kým takejto platforme dôverujú.

| Obava                                         | Čo s tým EVOLVE už dnes robí                                                                                                                                          |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| „Moje zdravotné údaje uniknú."                | Výsledky jednotlivých patogénov sa **nikdy** nikomu nezobrazujú — len anonymný verdikt: Safe / Compatible / Caution / Risk.                                           |
| „Moje fotky niekde skončia."                  | Fotky sú predvolene rozmazané. Vlastník udeľuje **15-sekundové** alebo **trvalé** zobrazenie — na žiadosť alebo proaktívne. Prezeranie je bezplatné.                  |
| „Budem musieť odovzdať doklad alebo telefón." | Prihlásenie peňaženkou (SIWE). Žiadny telefón, žiadny e-mail, žiadne KYC. Obnova účtu funguje cez on-chain záväzok DNA.                                               |
| „On alebo ona klame o svojom zdraví."         | Výsledky sú **laboratórne overené** (QR + porovnanie tváre) a testy páru sa odoberajú **pri stretnutí** — na čerstvých STD výsledkoch záleží, DNA nestarne.           |
| „Nebude mi niekto brať peniaze a zmizne?"     | Počatie beží na reálnej, rizikovej stávke: vklad muža sa pohnie, len keď je otcovstvo **potvrdené**; inak sa mu jednoducho vráti.                                     |
| „Nie je token pump-and-dump?"                 | Dnes žiadny predaj neprebieha; kód je otvorený (MIT); neobehujúca rezerva má byť uzamknutá v **nevyprázdňovateľnom trezore**, z ktorého nemôže vybrať ani zakladateľ. |
| „Nedá sa platforma vypnúť alebo zablokovať?"  | Predovšetkým peer-to-peer komunikácia, decentralizované úložisko (IPFS / Arweave), 18 konfigurácií EVM sietí a žiadna natvrdo zapísaná doména.                        |

## Čo a prečo

Tradičné zoznamovacie aplikácie po vás chcú vymeniť telefónne číslo, e-mail, fotky a intimné zdravotné detaily za centrálnu databázu — a potom tej databáze dôverovať navždy. EVOLVE vychádza z opačného predpokladu: **súkromie predvolene, vlastnícka seba-správa (self-custody) a žiadny jediný bod zlyhania**.

- **Súkromie predvolene** — zdravotné údaje sa nikdy nezverejňujú; len anonymné verdikty.
- **Odolnosť voči banom** — predovšetkým P2P komunikácia, decentralizované úložisko, multi-network dizajn, žiadne natvrdo zapísané domény.
- **Self-custodiálna identita** — vaša peňaženka je váš login; obnova založená na DNA namiesto e-mailu alebo telefónu.
- **Žiadna KYC brána** — na používanie platformy nie je potrebný občiansky preukaz, telefón ani e-mail.

Celé odôvodnenie si prečítajte v [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md).

## Zdravie, ktorému môžete skutočne dôverovať

- Nahrajte STD test ako obyčajný text alebo PDF (extrakcia textovej vrstvy, s OCR fallbackom pre skeny).
- Parser pozná 8 patogénov: HIV-1/2, syfilis, chlamýdie, kvapavka, HSV-1, HSV-2, hepatitída B, hepatitída C — v anglických, ukrajinských a ruských formátoch správ.
- **Stav jednotlivých patogénov sa nikdy nezobrazuje ostatným používateľom.** Profily ukazujú výhradne anonymný verdikt: **Safe / Compatible / Caution / Risk**.
- On-chain DNA záznamy (`DNAVerification.sol`) poháňajú obnovu a overovanie.

### Partnerské laboratóriá — dôkazy, nie sľuby

Vojdite do partnerského laboratória a ukážte svoj QR kód. Laboratórium ho naskenuje, potvrdí vašu totožnosť **porovnaním tváre** (aby váš výsledok nemohol vyzdvihnúť nikto iný) a priloží STD správu — PDF, sken alebo text, aj s chatrným OCR. Výsledok podpisuje skutočné laboratórium, nie vy, takže ostatní vidia **overený fakt** namiesto vášho slova. A každé potvrdené overenie platí **1 EVOLVE pacientovi a 1 EVOLVE laboratóriu** — obe strany majú dôvod byť čestné. Jednotlivé patogény sa stále nikomu nezobrazujú.

## Hľadanie niekoho

- Vyhľadávacie filtre: „Čo hľadáte" (zoznamovanie / počatie / polyandrické počatie / STD testovanie), „Koho hľadáte" (muži, ženy, páry), kaskádové výbery krajina → mesto, „môže prísť do vašej krajiny" so zoznamami pre jednotlivé krajiny, farba pleti, preferencia testovania, iba STD-kompatibilní.
- Sprievodca onboardingom: vek (skryteľný), jazyky, bio, fotka.
- **P2P chat** cez libp2p (gossipsub) + Nostr, s HTTP API fallbackom.

## Počatie

Dve cesty, ako naplánovať dieťa — a obe stoja na tej istej myšlienke: skutočný úmysel sa ukazuje reálnym stakom v EVOLVE, nikdy sľubmi. Záväzok muža žije v jeho EvolveFund vklade (od 15 EVOLVE, uzamknutom najmenej na 30 dní) a žena si môže nastaviť vlastný minimálny vklad pre mužov, ktorí sa k nej dostanú.

**Počatie.** Žena vedie: pozve konkrétneho muža a vymenuje ho v bonde. On potrebuje aktívny EvolveFund vklad; keď obaja potvrdia, zamkne sa a odpočet začne. Tehotenstvo sa hlási medzi 14. a 30. dňom po potvrdení a STD a DNA testy páru sa odoberajú pri samotnom stretnutí — na čerstvých STD výsledkoch záleží, DNA nestarne. Akonáhle je otcovstvo potvrdené, vklad muža prechádza na ženu; ak potvrdené nie je, vklad sa mu jednoducho vráti. Nič nemení majiteľa, kým nie sú fakty rozhodnuté.

**Polyandrické počatie.** Voľba patrí jej — a zostáva súkromná. Otvorí session, ktorá beží 48 hodín — bez vlastného vkladu (len pre reputáciu si ho môže pridať, ak chce). Muži s aktívnym vkladom sa môžu pripojiť — až 50 — a potvrdiť, čím sa zamkne ich stak. Štrnásť dní po uzavretí session je vybraný otec. Dostane svoj vklad späť plus odmenu z poolu: dvojnásobok svojho vkladu a 1 EVOLVE za každého ďalšieho účastníka. Nevybraní muži strácajú svoj stak — 90 % žene, 10 % vybranému otcovi. Ona neriskuje nič a môže len získať; muži dávajú svoj stak za právo byť vybraní.

## Token EVOLVE (len testovacia sieť)

- ERC-20, maximálna ponuka **8,000,000,000 EVOLVE**. Admin akcie stráži 48-hodinový `TimelockController`.
- **Plánované rozdelenie ponuky** — navrhnuté tak, aby takmer celá ponuka pracovala pre používateľov, nie pre insiderov:

| Účel                                                   |        EVOLVE |
| ------------------------------------------------------ | ------------: |
| Zakladatelia a tím (plat / odmena)                     |    25,000,000 |
| DEX rezerva (budúcnosť)                                |     4,000,000 |
| Verejný predaj (plánovaný)                             |     5,000,000 |
| Rezerva odmien — laboratóriá, pacienti, matky, otcovia | 7,966,000,000 |

- **Plánovaný verejný predaj** — 5,000,000 EVOLVE predávaných aplikáciou za **$0.8 za kus**, platených v akomkoľvek tokene, ktorý aplikácia podporuje; výťažok financuje vývoj. _(Plánované — zatiaľ nie je spustené.)_
- **Trustless emisia (plánovaná)** — rezerva odmien ~7,966,000,000 má byť uzamknutá v nevyprázdňovateľnom `RewardVault`: uvoľňovaná len postupne cez odmeny pre laboratóriá, pacientov, matky a otcov, pričom zmeny pravidiel vyžadujú hlasovanie governance. Nemôže z neho vybrať ani zakladateľ. Dizajn: [docs/REWARD-VAULT-PLAN.md](docs/REWARD-VAULT-PLAN.md).
- **Ekonomika emoji darčekov** — darček stojí 1 EVOLVE, delený proporcionálne medzi existujúcich vlastníkov darčekov; večný model príjmov a darčeky sú prenositeľné.
- **EvolveFund** — mužský staking (min. 15 EVOLVE, 30-dňový zámok), ktorý sa ráta do váhy governance; ženy používajú zostatok peňaženky.
- **Odmeny za overenie** — 1 EVOLVE overenému používateľovi a 1 EVOLVE potvrdzujúcemu laboratóriu za každé STD/DNA overenie (plus faucet s limitom).
- **Governance** — váha hlasu kombinuje rekurzívnu reputáciu (8 hlasov, hĺbka 3), podiel detí/otcovstva a stakované alebo držané EVOLVE.
- Integrácia **LayerZero OFT** pre budúce multichain prevody EVOLVE (závislosti pripravené; mimo Sepolie zatiaľ nič nasadené).

## Podpora projektu

EVOLVE je nezávislé a open-source. Ak je pre vás užitočné, môžete podporiť vývoj darom — každý príspevok ide na kód, laboratórne partnerstvá, hosting a preklady.

- **Detaily darov (EVM, Monero a ďalšie):** [DONATE.md](DONATE.md)
- **Viacjazyčná stránka darov (34 jazykov):** **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**

Verejný predaj tokenov je v pláne, dnes však **nie je** spustený. Dary sú darčeky podporujúce open-source vývoj a nedávajú žiadny nárok na tokeny, podiely, výnosy ani zisk. Prosím, dávajte len to, čo môžete stratiť.

## Architektúra a technológie

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

Kľúčové smart kontrakty: `EVOLVE.sol` (ERC-20), `ProfileNFT.sol` (ERC-721), `TrustScore.sol`, `Voting.sol`, `Evolve2Earn.sol` (emoji darčeky + odmeny), `Governance.sol`, `BondManager.sol` (počatie a polyandrické počatie), `EvolveFund.sol`, `VerificationRegistry.sol`, `DNAVerification.sol`, ERC-4337 `SmartAccountFactory` + `Paymaster` a OpenZeppelin `TimelockController`.

Detaily: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md)

## Roadmapa

Prebieha: produkčná pripravenosť webovej aplikácie. V pláne: on-chain register laboratórií a certifikácia testov, skutočný adapter poskytovateľa pošty pre prijímanie laboratórnych správ, on-chain overené atestácie v profiloch, **trustless RewardVault** s emisiou riadenou governance ([dizajn](docs/REWARD-VAULT-PLAN.md)), **verejný predaj tokenov**, aktualizácia vestingu pre alokáciu zakladateľov a poskytovanie DEX likvidity (momentálne blokované — vyžaduje nasadenie tokenov na mainnete). Multi-network expanzia (Arbitrum, Avalanche a ďalšie EVM siete) nasleduje po spevnení testovacej siete.

Celý zoznam: [docs/ROADMAP.md](docs/ROADMAP.md).

## Prvé kroky (vývojári)

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

Príspevky sú vítané — kód, hlásenia chýb, návrhy funkcií a proposal. Skôr než začnete, prečítajte si prosím [CONTRIBUTING.md](CONTRIBUTING.md) a náš [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Repozytáre (mirrory)

| Mirror   | URL                                        |
| -------- | ------------------------------------------ |
| GitHub   | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg | https://codeberg.org/limitafternoon/Evolve |
| GitLab   | https://gitlab.com/evolve-group3/evolve    |

## Dokumentácia

- [Čo a prečo](docs/WHAT-AND-WHY.md) — problém, vízia, kľúčové hodnoty
- [Ako to funguje](docs/HOW-IT-WORKS.md) — používateľské flow, krok za krokom
- [Architektúra](docs/ARCHITECTURE.md) — monorepo, balíky, toky údajov
- [Tokenomika](docs/TOKENOMICS.md) — model tokenu a rozdelenie ponuky
- [Plán RewardVault](docs/REWARD-VAULT-PLAN.md) — trustless emisia (plánovaná)
- [Roadmapa](docs/ROADMAP.md) — míľniky a aktuálny stav
- [FAQ](docs/FAQ.md) — časté otázky
- [Sprievodca peňaženkami](docs/WALLETS.md) — ako vytvoriť peňaženky a získať adresy pre dary

## Licencia

Licencované pod [licenciou MIT](LICENSE).

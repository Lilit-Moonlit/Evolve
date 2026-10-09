[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)
<!-- evolve-readme-sync: 3796750887b0bd65 -->

# EVOLVE

**Zoznamovanie, počatie a overené zdravie — súkromie predovšetkým, dôvera tam, kde na nej záleží.**

EVOLVE je open-source, decentralizovaná platforma pre ľudí, ktorí majú dosť odovzdávania svojho telefónneho čísla, svojej tváre a svojich najintímnejších zdravotných údajov do databázy niekoho iného. Prihlasujete sa vlastnou kryptopeňaženkou — bez telefónu, bez e-mailu, bez KYC — a svoj účet si môžete obnoviť prostredníctvom on-chain DNA záväzku. Vaše zdravotné údaje zostávajú vaše: výsledky testov sa spracovávajú automaticky, stavy jednotlivých patogénov sa **nikdy** nikomu nezobrazujú a párovanie sa opiera výlučne o anonymné verdikty kompatibility (Safe / Compatible / Caution / Risk). Chat beží peer-to-peer cez libp2p a Nostr, s HTTP fallbackom pre pohodlie. Darčeky a prevody smerujú k plnej dôvernosti: darčeky so súkromným odosielateľom už dnes fungujú a na roadmape sú štítovaná peňaženka Railgun a zero-knowledge prototyp Aztec (pozri [Súkromie a dôverné transakcie](#súkromie-a-dôverné-transakcie)).

> **Stav — demo režim, v aktívnom vývoji.**
> Zoznamovanie, počatie, overovanie zdravia, laboratórny proces, P2P chat, token EVOLVE aj governance sú implementované a bežia v **lokálnom deme** — aplikácia **zatiaľ nie je verejne nasadená**. Pred nami: **nasadenie na mainnet a DEX likvidita**, plus **plánovaný verejný predaj** (pozri [Token EVOLVE](#token-evolve-len-testovacia-sieť)).
> Smart kontrakty sú nasadené **len na testovacej sieti Ethereum Sepolia**. Nič tu nie je finančné poradenstvo ani investičná ponuka.

> **Považujete EVOLVE za užitočný? Podporte vývoj — každý dar ide na kód, laboratórne partnerstvá, hosting a preklady → [DONATE.md](DONATE.md).**

## Niet čoho sa báť

EVOLVE bol postavený okolo otázok, ktoré si ľudia skutočne kladú, kým dôverujú takejto platforme.

| Obava                                          | Čo s tým EVOLVE už dnes robí                                                                                                                                                                            |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| „Moje zdravotné údaje uniknú.“                 | Jednotlivé výsledky patogénov sa **nikdy** nikomu nezobrazujú — iba anonymný verdikt: Safe / Compatible / Caution / Risk.                                                                               |
| „Moje fotografie skončia niekde inde.“         | Fotografie sú predvolene rozostené. Vlastník udeľuje **15-sekundové** alebo **trvalé** zobrazenie — na žiadosť alebo proaktívne. Prezeranie je bezplatné.                                               |
| „Budem musieť odovzdať preukaz alebo telefón.“ | Prihlásenie peňaženkou (SIWE). Žiadny telefón, žiadny e-mail, žiadne KYC. Obnova funguje prostredníctvom on-chain DNA záväzku.                                                                          |
| „On alebo ona klamú, že je zdravý/á.“          | Výsledky sú **laboratórne overené** (QR + porovnanie tváre) a testy páru sa vykonávajú **priamo na stretnutí** — na čerstvých STD výsledkoch záleží, DNA nestárne.                                      |
| „Niekto mi vezme peniaze a zmizne?“            | Počatie beží na reálnom, vystavenom vklade: mužov depozit sa presunie, až keď je otcovstvo **potvrdené**; inak sa mu jednoducho vráti.                                                                  |
| „Nie je token pump-and-dump?“                  | Kód je otvorený (MIT); takmer celá emisia je vyhradená pre odmeny používateľov a neobehovaná rezerva má byť podľa plánu uzamknutá v **nevyberateľnom trezore**, z ktorého nemôže vybrať ani zakladateľ. |
| „Môžu platformu vypnúť alebo zakázať?“         | Peer-to-peer správy na prvom mieste, decentralizované úložisko (IPFS / Arweave), 18 EVM konfigurácií sietí a žiadna natvrdo zapísaná doména.                                                            |

## Čo a prečo

Tradičné zoznamovacie aplikácie vás žiadajú vymeniť telefónne číslo, e-mail, fotografie a intímne zdravotné detaily za centrálnu databázu — a potom tejto databáze dôverovať navždy. EVOLVE vychádza z opačného predpokladu: **súkromie predovšetkým, držba aktív vo vlastných rukách a žiadny jediný bod zlyhania**.

- **Súkromie predovšetkým** — zdravotné údaje sa nikdy nezverejňujú; iba anonymné verdikty.
- **Odolnosť voči zákazom** — P2P správy na prvom mieste, decentralizované úložisko, viacsieťový dizajn, žiadne natvrdo zapísané domény.
- **Identita vo vlastnej réžii** — vaša peňaženka je vaše prihlásenie; obnova na základe DNA namiesto e-mailu alebo telefónu.
- **Žiadna KYC brána** — na používanie platformy nie je potrebný štátny preukaz, telefón ani e-mail.

Kompletné zdôvodnenie si prečítajte v [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md).

## Zdravie, ktorému sa dá skutočne dôverovať

- Nahrajte STD test ako surový text alebo PDF (extrakcia textovej vrstvy, s OCR fallbackom pre skeny).
- Parser pozná 8 patogénov: HIV-1/2, syfilis, chlamýdie, kvapavka, HSV-1, HSV-2, hepatitída B, hepatitída C — v anglickom, ukrajinskom a ruskom formáte správ.
- **Stav jednotlivých patogénov sa ostatným používateľom nikdy nezobrazuje.** Profily vždy ukazujú iba anonymný verdikt: **Safe / Compatible / Caution / Risk**.
- On-chain DNA záznamy (`DNAVerification.sol`) poháňajú obnovu a overovanie.

### Partnerské laboratóriá — dôkazy, nie sľuby

Vojdite do partnerského laboratória a ukážte svoj QR kód. Laboratórium ho naskenuje, potvrdí vašu totožnosť **porovnaním tváre** (takže váš výsledok nemôže vyzdvihnúť nikto iný) a priloží STD správu — PDF, sken alebo text, aj slabý OCR. Výsledok podpisuje skutočné laboratórium, nie vy, takže ostatní vidia **overený fakt** namiesto vášho slova. A každé potvrdené overenie vypláca **1 EVOLVE pacientovi a 1 EVOLVE laboratóriu** — obe strany tak majú dôvod byť čestné. Jednotlivé patogény sa stále nikomu nezobrazujú.

## Nájsť niekoho

- Vyhľadávacie filtre: „Čo hľadáte“ (zoznamovanie / počatie / polyandrické počatie / STD testovanie), „Koho hľadáte“ (muži, ženy, páry), kaskádové výbery krajina → mesto, „môže pricestovať do vašej krajiny“ so zoznamami pre jednotlivé krajiny, farba pleti, preferencia testovania, iba STD-kompatibilní.
- Sprievodca úvodom: vek (možno skryť), jazyky, bio, fotografia.
- **P2P chat** cez libp2p (gossipsub) + Nostr, s HTTP API fallbackom.

## Počatie

Dva spôsoby, ako naplánovať dieťa — a oba spočívajú na tej istej myšlienke: skutočný úmysel sa preukazuje reálnym vkladom v EVOLVE, nikdy sľubmi. Mužov záväzok žije v jeho EvolveFund depozite (od 15 EVOLVE, uzamknutom na minimálne 30 dní) a žena si môže stanoviť vlastný minimálny vklad pre mužov, ktorí sa k nej dostanú.

**Počatie.** Vedie žena: pozve konkrétneho muža a vymenuje ho v záväzku. On potrebuje aktívny EvolveFund depozit; keď potvrdia obaja, depozit sa uzamkne a rozbehne sa odpočet. Tehotenstvo sa hlási medzi 14. a 30. dňom po potvrdení a STD a DNA testy páru sa vykonávajú priamo na stretnutí — na čerstvých STD výsledkoch záleží, DNA nestárne. Keď je otcovstvo potvrdené, mužov depozit prechádza na ženu; ak potvrdené nie je, depozit sa mu jednoducho uvoľní späť. Nič neprechádza z rúk do rúk, kým sa fakty nevyjasnia.

**Polyandrické počatie.** Výber patrí jej a zostáva súkromný. Otvorí sedenie, ktoré trvá 48 hodín — bez vlastného vkladu (pridať ho môže len pre reputáciu, ak chce). Muži s aktívnym depozitom sa môžu pripojiť — maximálne 50 — a potvrdiť, čím sa ich vklad uzamkne. Štrnásť dní po uzavretí sedenia sa vyberie otec. Dostane svoj depozit späť plus odmenu z poolu: dvojnásobok svojho vkladu a 1 EVOLVE za každého ďalšieho účastníka. Muži, ktorí vybraní nie sú, prichádzajú o svoj vklad — 90 % ide žene, 10 % vybranému otcovi. Ona neriskuje nič a môže len získať; muži stavajú svoj vklad na právo byť vybraní.

## Súkromie a dôverné transakcie

Súkromie je predvolené — a EVOLVE buduje cestu k plne dôverným on-chain prevodom.

- **Súkromné darčeky** — pošlite ružu 🌹 alebo kaktus 🌵 (1 EVOLVE) a vyberte si, kto môže vidieť, že ste to boli vy: _verejne_, _anonymne pre všetkých okrem príjemcu_ alebo _plne anonymne_. V anonymných režimoch cestuje darček ako jednorazový voucher, ktorý si príjemca nárokuje vlastnou peňaženkou, takže odosielateľ sa na blockchaine nikdy nezobrazí. (Anonymita odosielateľa je dnes len bežnej úrovne: financujúca transakcia sa dá spárovať podľa času a sumy.)
- **Štítovaná peňaženka Railgun** — súkromná peňaženka za feature flagom (`VITE_RAILGUN_ENABLED`, predvolene vypnutá), ktorá skrýva sumy a adresy pomocou Railgunovho ostrého zero-knowledge poolu. Toto je cesta k skutočnej anonymite odosielateľa.
- **Prototyp Aztec** — rovnaká logika súkromných prevodov a súkromných záväzkov, vyjadrená ako zero-knowledge Noir obvody a držaná za explicitnou bránou, kým Aztec nebude pripravený do produkcie. Pozri [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md).
- **Model dvoch peňaženiek** — verejná stakingová peňaženka sa zúčastňuje na governance; súkromná štítovaná peňaženka je zámerne **vylúčená** z váhy hlasovania, čím súkromie a hlasovacia sila zostávajú oddelené.

Detaily: [docs/RAILGUN-INTEGRATION.md](docs/RAILGUN-INTEGRATION.md) · [docs/SHIELDED-STAKES-DESIGN.md](docs/SHIELDED-STAKES-DESIGN.md) · [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md).

## Token EVOLVE (len testovacia sieť)

- ERC-20, maximálna emisia **8,000,000,000 EVOLVE**. Admin akcie chráni 48-hodinový `TimelockController`.
- **Plánované rozdelenie emisie** — navrhnuté tak, aby takmer celá emisia pracovala pre používateľov, nie pre insiderov:

| Účel                                                   |        EVOLVE |
| ------------------------------------------------------ | ------------: |
| Zakladatelia a tím (plat / odmena)                     |    25,000,000 |
| DEX rezerva (budúcnosť)                                |     4,000,000 |
| Verejný predaj (plánovaný)                             |     5,000,000 |
| Rezerva odmien — laboratóriá, pacienti, matky, otcovia | 7,966,000,000 |

- **Plánovaný verejný predaj** — 5,000,000 EVOLVE predáva aplikácia za **$0.8 za kus**, platiť možno akýmkoľvek tokenom, ktorý aplikácia podporuje; výnosy financujú vývoj. _(Plánované — ešte nie je spustené.)_
- **Trustless emisia (plánovaná)** — ~7,966,000,000 rezerva odmien má byť uzamknutá v nevyberateľnom `RewardVault`: uvoľní sa len postupne, prostredníctvom odmien pre laboratóriá, pacientov, matky a otcov, a zmena pravidiel vyžaduje hlasovanie governance. Nemôže z neho vybrať ani zakladateľ. Dizajn: [docs/REWARD-VAULT-PLAN.md](docs/REWARD-VAULT-PLAN.md).
- **Ekonomika emoji darčekov** — darček stojí 1 EVOLVE a rozdeľuje sa proporcionálne medzi existujúcich vlastníkov darčekov; perpetuálny príjmový model, darčeky sú prenosné.
- **EvolveFund** — mužský staking (min 15 EVOLVE, 30-dňové uzamknutie), ktorý sa započítava do váhy governance; ženy používajú zostatok na svojej peňaženke.
- **Overovacie odmeny** — 1 EVOLVE overovanému používateľovi a 1 EVOLVE potvrdzujúcemu laboratóriu za každé STD/DNA overenie (plus faucet s obmedzenou frekvenciou).
- **Governance** — váha hlasu kombinuje rekurzívnu reputáciu (8 hlasov, hĺbka 3), podiel detí/otcovstva a stakované či držané EVOLVE.
- Integrácia **LayerZero OFT** pre budúce multichain prevody EVOLVE (závislosti sú na mieste; mimo Sepolie zatiaľ nič nasadené).

## Podporte projekt

EVOLVE je nezávislý a open-source. Ak je vám užitočný, môžete podporiť vývoj darom — každý príspevok ide na kód, laboratórne partnerstvá, hosting a preklady.

- **Detaily darov (EVM, Monero a ďalšie):** [DONATE.md](DONATE.md)
- **Viacjazyčná stránka darov (34 jazykov):** **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**

Verejný predaj tokenu je **plánovaný** — 5,000,000 EVOLVE, predávať ich bude aplikácia (pozri [Token EVOLVE](#token-evolve-len-testovacia-sieť)). Dary sú dary, ktoré podporujú open-source vývoj, a nezakladajú žiadny nárok na tokeny, podiely, výnosy ani zisk. Prispejte len tým, o čo môžete prísť.

## Architektúra a technológický stack

Monorepo spravované pomocou npm workspaces + Turborepo:

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

Prebieha: pripravenosť webovej aplikácie na produkciu. Plánované: on-chain register laboratórií a certifikácia testov, skutočný adapter poštového poskytovateľa pre prijímanie laboratórnych správ, on-chain overené atestácie na profiloch, **trustless RewardVault** s emisiou riadenou governance ([dizajn](docs/REWARD-VAULT-PLAN.md)), **verejný predaj tokenu**, aktualizácia vestingu tokenov pre alokáciu zakladateľov a poskytovanie DEX likvidity (momentálne blokované — vyžaduje nasadenie tokenov na mainnet). Na strane súkromia sú darčeky so súkromným odosielateľom hotové, kým štítovaná peňaženka Railgun a migrácia súkromných záväzkov Aztec zostávajú za kontrolami v [docs/ROADMAP.md](docs/ROADMAP.md) a [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md). Expanzia do viacerých sietí (Arbitrum, Avalanche a ďalšie EVM reťazce) nasleduje po stabilizácii testovacej siete.

Kompletný zoznam: [docs/ROADMAP.md](docs/ROADMAP.md).

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

Príspevky sú vítané — kód, hlásenia chýb, návrhy funkcií a proposal. Pred začatím si prosím prečítajte [CONTRIBUTING.md](CONTRIBUTING.md) a náš [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Repozitáre (zrkadlá)

| Zrkadlo  | URL                                        |
| -------- | ------------------------------------------ |
| GitHub   | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg | https://codeberg.org/limitafternoon/Evolve |
| GitLab   | https://gitlab.com/evolve-group3/evolve    |

## Dokumentácia

- [Čo a prečo](docs/WHAT-AND-WHY.md) — problém, vízia, základné hodnoty
- [Ako to funguje](docs/HOW-IT-WORKS.md) — používateľské toky, krok za krokom
- [Architektúra](docs/ARCHITECTURE.md) — monorepo, balíky, dátové toky
- [Tokenomika](docs/TOKENOMICS.md) — model tokenu a rozdelenie emisie
- [Plán RewardVault](docs/REWARD-VAULT-PLAN.md) — trustless emisia (plánovaná)
- [Integrácia Railgun](docs/RAILGUN-INTEGRATION.md) — prieskum integrácie štítovanej peňaženky
- [Štítované staky](docs/SHIELDED-STAKES-DESIGN.md) — súkromné vklady pre počatie (dizajn)
- [Prototyp Aztec](docs/AZTEC-PROTOTYPE.md) — ZK súkromné prevody a záväzky (výskum)
- [Roadmapa](docs/ROADMAP.md) — míľniky a aktuálny stav
- [FAQ](docs/FAQ.md) — často kladené otázky
- [Sprievodca peňaženkami](docs/WALLETS.md) — ako si vytvoriť peňaženky a získať adresy pre dary

## Licencia

Licencované pod [licenciou MIT](LICENSE).

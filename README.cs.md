[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)
<!-- evolve-readme-sync: 3796750887b0bd65 -->

# EVOLVE

**Seznámení, početí a ověřené zdraví — soukromí ve výchozím nastavení, důvěra tam, kde na ní záleží.**

EVOLVE je open-source, decentralizovaná platforma pro lidi, kteří mají dost předávání svého telefonního čísla, své tváře a svých nejintimnějších zdravotních dat do databáze někoho jiného. Přihlašujete se vlastní krypto peněženkou — bez telefonu, bez e-mailu, bez KYC — a účet můžete získat zpět díky on-chain závazku DNA. Vaše zdravotní data zůstávají vaše: výsledky testů se zpracovávají automaticky, stavy jednotlivých patogenů se **nikdy** nikomu nezobrazují a párování stojí pouze na anonymních verdiktech kompatibility (Safe / Compatible / Caution / Risk). Chat běží peer-to-peer přes libp2p a Nostr, s HTTP fallbackem pro pohodlí. Dárky a převody směřují k plné důvěrnosti: dárky se soukromým odesílatelem už dnes fungují a na roadmapě je štítovaná peněženka Railgun a zero-knowledge prototyp Aztec (viz [Soukromí a důvěrné transakce](#soukromí-a-důvěrné-transakce)).

> **Status — demo režim, v aktivním vývoji.**
> Seznámení, početí, ověřování zdraví, laboratorní flow, P2P chat, token EVOLVE i governance jsou implementované a běží v **lokálním demu** — aplikace **ještě není veřejně nasazená**. Co nás čeká: **nasazení na mainnet a DEX likvidita**, plus **plánovaný veřejný prodej** (viz [Token EVOLVE](#token-evolve-pouze-testovací-síť)).
> Smart kontrakty jsou nasazeny **pouze na testovací síti Ethereum Sepolia**. Nic zde není finanční poradenství ani investiční nabídkou.

> **Připadá vám EVOLVE užitečné? Podpořte vývoj — každý dar jde na kód, laboratorní partnerství, hosting a překlady → [DONATE.md](DONATE.md).**

## Není čeho se bát

EVOLVE je postaveno kolem otázek, které si lidé skutečně kladou, než takové platformě důvěřují.

| Obava                                        | Co s tím EVOLVE už dnes dělá                                                                                                                                                                 |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| „Moje zdravotní data uniknou."               | Výsledky jednotlivých patogenů se **nikdy** nikomu nezobrazují — pouze anonymní verdikt: Safe / Compatible / Caution / Risk.                                                                 |
| „Moje fotky někde skončí."                   | Fotky jsou ve výchozím nastavení rozostřené. Vlastník uděluje **15sekundový** nebo **trvalý** náhled — na žádost nebo proaktivně. Prohlížení je zdarma.                                      |
| „Budu muset odevzdat doklad nebo telefon."   | Přihlášení peněženkou (SIWE). Žádný telefon, žádný e-mail, žádné KYC. Obnova účtu funguje přes on-chain závazek DNA.                                                                         |
| „On nebo ona lže o svém zdraví."             | Výsledky jsou **laboratorně ověřené** (QR + porovnání obličeje) a testy páru se odebírají **při setkání** — na čerstvých STD výsledcích záleží, DNA nestárne.                                |
| „Nevezme mi někdo peníze a nezmizí?"         | Početí běží na skutečném vkladu vystaveném riziku: vklad muže se pohne jen tehdy, když je otcovství **potvrzeno**; jinak se mu jednoduše vrací.                                              |
| „Není token pump-and-dump?"                  | Kód je otevřený (MIT); téměř celá emise je rezervována pro odměny uživatelů a neobíhající rezerva má být uzamčena v **nevyprázdnitelném trezoru**, ze kterého nemůže vybírat ani zakladatel. |
| „Nedá se platforma vypnout nebo zablokovat?" | Především peer-to-peer komunikace, decentralizované úložiště (IPFS / Arweave), 18 konfigurací EVM sítí a žádná natvrdo zapsaná doména.                                                       |

## Co a proč

Tradiční seznamovací aplikace po vás chtějí vyměnit telefonní číslo, e-mail, fotky a intimní zdravotní detaily za centrální databázi — a pak té databázi věřit navěky. EVOLVE vychází z opačného předpokladu: **soukromí ve výchozím nastavení, sebe-správa (self-custody) a žádný jediný bod selhání**.

- **Soukromí ve výchozím nastavení** — zdravotní data se nikdy nezveřejňují; pouze anonymní verdikty.
- **Odolnost vůči banům** — především P2P komunikace, decentralizované úložiště, multi-network design, žádné natvrdo zapsané domény.
- **Sebe-kustodiální identita** — vaše peněženka je váš login; obnova založená na DNA místo e-mailu nebo telefonu.
- **Žádná KYC brána** — k používání platformy není potřeba občanský průkaz, telefon ani e-mail.

Celé odůvodnění si přečtěte v [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md).

## Zdraví, kterému můžete skutečně věřit

- Nahrajte STD test jako prostý text nebo PDF (extrakce textové vrstvy, s OCR fallbackem pro skeny).
- Parser zná 8 patogenů: HIV-1/2, syfilis, chlamydie, kapavka, HSV-1, HSV-2, hepatitida B, hepatitida C — v anglických, ukrajinských a ruských formátech zpráv.
- **Stav jednotlivých patogenů se nikdy nezobrazuje ostatním uživatelům.** Profily ukazují pouze anonymní verdikt: **Safe / Compatible / Caution / Risk**.
- On-chain DNA záznamy (`DNAVerification.sol`) pohánějí obnovu a ověřování.

### Partnerské laboratoře — důkazy, ne sliby

Vejděte do partnerské laboratoře a ukažte svůj QR kód. Laboratoř ho naskenuje, potvrdí vaši totožnost **porovnáním obličeje** (aby váš výsledek nemohl vyzvednout nikdo jiný) a připojí STD zprávu — PDF, sken nebo text, i s chatrným OCR. Výsledek podepisuje skutečná laboratoř, ne vy, takže ostatní vidí **ověřený fakt** místo vašeho slova. A každé potvrzené ověření platí **1 EVOLVE pacientovi a 1 EVOLVE laboratoři** — obě strany mají důvod být poctivé. Jednotlivé patogeny se stále nikomu nezobrazují.

## Hledání někoho

- Vyhledávací filtry: „Co hledáte" (seznámení / početí / polyandrické početí / STD testování), „Koho hledáte" (muži, ženy, páry), kaskádové výběry země → město, „může přijet do vaší země" se seznamy pro jednotlivé země, barva pleti, preference testování, pouze STD-kompatibilní.
- Průvodce onboardingem: věk (skrytelný), jazyky, bio, fotka.
- **P2P chat** přes libp2p (gossipsub) + Nostr, s HTTP API fallbackem.

## Početí

Dvě cesty, jak naplánovat dítě — a obě stojí na stejné myšlence: skutečný úmysl se ukazuje skutečným vkladem v EVOLVE, nikdy sliby. Závazek muže žije v jeho EvolveFund vkladu (od 15 EVOLVE, uzamčeném nejméně na 30 dní) a žena si může nastavit vlastní minimální vklad pro muže, kteří se k ní dostanou.

**Početí.** Žena má vedení: pozve konkrétního muže a uvede ho ve vazbě (bondu). On potřebuje aktivní EvolveFund vklad; když oba potvrdí, vklad se zamkne a odpočítávání začne. Těhotenství se hlásí mezi 14. a 30. dnem po potvrzení a STD a DNA testy páru se odebírají přímo při setkání — na čerstvých STD výsledcích záleží, DNA nestárne. Jakmile je otcovství potvrzeno, vklad muže přechází na ženu; pokud potvrzen není, vklad se mu jednoduše uvolní zpět. Nic nemění majitele, dokud nejsou fakta jasná.

**Polyandrické početí.** Volba patří jí a zůstává soukromá. Otevře relaci, která běží 48 hodin — bez vlastního vkladu (jeden si může přidat jen pro reputaci, chce-li). Muži s aktivním vkladem se mohou připojit — až 50 — a potvrdit, čímž se jejich vklad zamkne. Čtrnáct dní po uzavření relace je vybrán otec. Ten dostane svůj vklad zpět plus odměnu z poolu: dvojnásobek svého vkladu a 1 EVOLVE za každého dalšího účastníka. Nevybraní muži přicházejí o svůj vklad — 90 % jde ženě, 10 % vybranému otci. Ona neriskuje nic a může jen získat; muži dávají svůj vklad za právo být vybráni.

## Soukromí a důvěrné transakce

Soukromí je výchozí stav — a EVOLVE buduje cestu k plně důvěrným on-chain převodům.

- **Soukromé dárky** — pošlete růži 🌹 nebo kaktus 🌵 (1 EVOLVE) a vyberte si, kdo uvidí, že jste to byli vy: _veřejně_, _anonymně pro všechny kromě příjemce_ nebo _plně anonymně_. V anonymních režimech putuje dárek jako jednorázový voucher, který si příjemce nárokuje vlastní peněženkou, takže se odesílatel nikdy neobjeví on-chain. (Anonymita odesílatele je dnes spíš „běžného rázu": financující transakci lze spárovat podle času a částky.)
- **Štítovaná peněženka Railgun** — soukromá peněženka řízená feature flagem (`VITE_RAILGUN_ENABLED`, ve výchozím nastavení vypnutá), která skrývá částky i adresy pomocí živého zero-knowledge poolu Railgun. To je cesta ke skutečné anonymitě odesílatele.
- **Prototyp Aztec** — tatáž logika soukromých převodů a soukromých vazeb, vyjádřená jako zero-knowledge Noir obvody a držená za explicitní branou, dokud Aztec nebude připravený na produkci. Viz [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md).
- **Model dvou peněženek** — veřejná stake peněženka se účastní governance; privátní štítovaná peněženka je záměrně **vyloučena** z váhy hlasů, takže soukromí a hlasovací moc zůstávají oddělené.

Detaily: [docs/RAILGUN-INTEGRATION.md](docs/RAILGUN-INTEGRATION.md) · [docs/SHIELDED-STAKES-DESIGN.md](docs/SHIELDED-STAKES-DESIGN.md) · [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md).

## Token EVOLVE (pouze testovací síť)

- ERC-20, maximální emise **8 000 000 000 EVOLVE**. Admin akce hlídá 48hodinový `TimelockController`.
- **Plánované rozdělení emise** — navržené tak, aby téměř celá emise pracovala pro uživatele, ne pro zasvěcence:

| Účel                                                   |        EVOLVE |
| ------------------------------------------------------ | ------------: |
| Zakladatelé a tým (plat / odměna)                      |    25 000 000 |
| DEX rezerva (budoucnost)                               |     4 000 000 |
| Veřejný prodej (plánovaný)                             |     5 000 000 |
| Odměnová rezerva — laboratoře, pacienti, matky, otcové | 7 966 000 000 |

- **Plánovaný veřejný prodej** — 5 000 000 EVOLVE prodávaných aplikací po **0,8 $ za kus**, s platbou v jakémkoli tokenu, který aplikace podporuje; výtěžek jde na vývoj. _(Plánované — ještě neprobíhá.)_
- **Trustless emise (plánovaná)** — cca 7 966 000 000 tokenů v odměnové rezervě má být uzamčeno v nevyprázdnitelném `RewardVault`: uvolňují se jen postupně skrze odměny pro laboratoře, pacienty, matky a otce a změna pravidel vyžaduje hlasování governance. Nemůže z něj vybírat ani zakladatel. Design: [docs/REWARD-VAULT-PLAN.md](docs/REWARD-VAULT-PLAN.md).
- **Ekonomika emoji darů** — dárek stojí 1 EVOLVE, který se dělí poměrně mezi stávající vlastníky darů; perpetuční model příjmů, a dárky jsou převoditelné.
- **EvolveFund** — mužský staking (min 15 EVOLVE, zámek na 30 dní), který se počítá do váhy hlasů; ženy používají zůstatek své peněženky.
- **Odměny za ověření** — 1 EVOLVE ověřenému uživateli a 1 EVOLVE potvrzující laboratoři za každé STD/DNA ověření (plus faucet s omezenou rychlostí).
- **Governance** — váha hlasu kombinuje rekurzivní reputaci (8 hlasů, hloubka 3), podíl dětí/otcovství a staked nebo držené EVOLVE.
- **Integrace LayerZero OFT** pro budoucí multichain převody EVOLVE (závislosti připraveny; mimo Sepolii zatím nic nasazeno).

## Podpořte projekt

EVOLVE je nezávislé a open-source. Pokud je vám užitečné, můžete podpořit vývoj darem — každý příspěvek jde na kód, laboratorní partnerství, hosting a překlady.

- **Detaily darování (EVM, Monero a další):** [DONATE.md](DONATE.md)
- **Mnohojazyčná stránka pro dary (34 jazyky):** **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**

Veřejný prodej tokenů je **plánovaný** — 5 000 000 EVOLVE, prodávaných aplikací (viz [Token EVOLVE](#token-evolve-pouze-testovací-síť)). Dary jsou dárky podporující open-source vývoj a nezakládají žádný nárok na tokeny, podíly, výnosy ani zisk. Přispívejte jen tím, o co můžete přijít.

## Architektura a technický stack

Monorepo spravované pomocí npm workspaces + Turborepo:

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

Klíčové smart kontrakty: `EVOLVE.sol` (ERC-20), `ProfileNFT.sol` (ERC-721), `TrustScore.sol`, `Voting.sol`, `Evolve2Earn.sol` (emoji dárky + odměny), `Governance.sol`, `BondManager.sol` (početí a polyandrické početí), `EvolveFund.sol`, `VerificationRegistry.sol`, `DNAVerification.sol`, ERC-4337 `SmartAccountFactory` + `Paymaster` a OpenZeppelin `TimelockController`.

Detaily: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md)

## Roadmap

V průběhu: připravenost webové aplikace na produkci. Plánováno: on-chain registr laboratoří a certifikace testů, skutečný adaptér poštovního poskytovatele pro příjem laboratorních zpráv, on-chain ověřené atestace na profilech, **trustless RewardVault** s emisí řízenou governance ([design](docs/REWARD-VAULT-PLAN.md)), **veřejný prodej tokenů**, aktualizace vestingování tokenů pro alokaci zakladatelů a poskytování DEX likvidity (momentálně blokováno — vyžaduje nasazení tokenů na mainnet). Na straně soukromí jsou dárky se soukromým odesílatelem hotové, zatímco štítovaná peněženka Railgun a migrace soukromých vazeb Aztec zůstávají za kontrolami v [docs/ROADMAP.md](docs/ROADMAP.md) a [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md). Rozšíření do více sítí (Arbitrum, Avalanche a další EVM sítě) následuje po zpevnění testovací sítě.

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

## Jak přispět

Příspěvky jsou vítány — kód, hlášení chyb, návrhy funkcí a proposal. Před začátkem si prosím přečtěte [CONTRIBUTING.md](CONTRIBUTING.md) a náš [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Repozitáře (zrcadla)

| Zrcadlo  | URL                                        |
| -------- | ------------------------------------------ |
| GitHub   | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg | https://codeberg.org/limitafternoon/Evolve |
| GitLab   | https://gitlab.com/evolve-group3/evolve    |

## Dokumentace

- [Co a proč](docs/WHAT-AND-WHY.md) — problém, vize, základní hodnoty
- [Jak to funguje](docs/HOW-IT-WORKS.md) — uživatelské toky, krok za krokem
- [Architektura](docs/ARCHITECTURE.md) — monorepo, balíčky, toky dat
- [Tokenomika](docs/TOKENOMICS.md) — model tokenu a rozdělení emise
- [Plán RewardVault](docs/REWARD-VAULT-PLAN.md) — trustless emise (plánovaná)
- [Integrace Railgun](docs/RAILGUN-INTEGRATION.md) — průzkum integrace štítované peněženky
- [Štítované staky](docs/SHIELDED-STAKES-DESIGN.md) — soukromé vklady pro početí (design)
- [Prototyp Aztec](docs/AZTEC-PROTOTYPE.md) — ZK soukromé převody a vazby (výzkum)
- [Roadmapa](docs/ROADMAP.md) — milníky a aktuální stav
- [FAQ](docs/FAQ.md) — často kladené otázky
- [Průvodce peněženkami](docs/WALLETS.md) — jak si vytvořit peněženky a získat adresy pro dary

## Licence

Licencováno pod [licencí MIT](LICENSE).

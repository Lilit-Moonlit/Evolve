[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)

# EVOLVE

**Dejting, befruktning och verifierad hälsa — privat som standard, tillit där det spelar roll.**

EVOLVE är en decentraliserad plattform med öppen källkod för människor som är trötta på att lämna sitt telefonnummer, sitt ansikte och sina mest intimaste hälsodata till någon annans databas. Du loggar in med din egen kryptoplånbok — ingen telefon, ingen e-post, inget KYC — och du kan få tillbaka ditt konto via ett DNA-åtagande on-chain. Dina hälsodata förblir dina: testresultat tolkas automatiskt, enskilda patogenstatus visas **aldrig** för någon, och matchning bygger endast på anonyma kompatibilitetsutlåtanden (Safe / Compatible / Caution / Risk). Chatt sker peer-to-peer över libp2p och Nostr, med en HTTP-fallback för bekvämlighet.

> **Status — plattformen fungerar redan idag; mainnet och DEX är nästa steg.**
> Dejting, befruktning, hälsöverifiering, labbflödet, P2P-chatt, EVOLVE-token och styrning är alla igång. Fortfarande på väg: en **mainnet-distribution och DEX-likviditet**, samt en **planerad offentlig försäljning** (se [EVOLVE-token](#evolve-token-endast-testnet)).
> Smarta kontrakt är distribuerade **endast på Ethereum Sepolia testnet**. Inget här är finansiell rådgivning eller ett investeringserbjudande.

> **Tycker du EVOLVE är användbar? Stöd utvecklingen — varje donation går till kod, labbpartnerskap, hosting och översättning → [DONATE.md](DONATE.md).**

## Inget att frukta

EVOLVE byggdes kring de frågor människor faktiskt ställer innan de litar på en plattform som denna.

| Oro                                            | Vad EVOLVE redan gör åt det                                                                                                                                                  |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ”Mina hälsodata kommer att läcka."             | Enskilda patogenresultat visas **aldrig** för någon — endast ett anonymt utlåtande: Safe / Compatible / Caution / Risk.                                                      |
| ”Mina foton hamnar någonstans."                | Foton är suddiga som standard. Ägaren beviljar en **15-sekunders** eller **permanent** visning — på begäran eller proaktivt. Att titta är gratis.                            |
| ”Jag måste lämna ID eller telefon."            | Plånbokslogin (SIWE). Ingen telefon, ingen e-post, inget KYC. Återställning sker via ett DNA-åtagande on-chain.                                                              |
| ”Han eller hon ljuger om att vara frisk."      | Resultaten är **labbverifierade** (QR + ansiktsmatchning), och parets tester tas **vid själva mötet** — färska STD-resultat spelar roll, DNA åldras inte.                    |
| ”Kommer någon ta mina pengar och försvinna?"   | Befruktning vilar på en verklig, risktagande insats: en mans insats flyttas endast när faderskapet är **bekräftat**; annars returneras den enkelt till honom.                |
| ”Är tokenen ett pump-and-dump?"                | Ingen försäljning är live idag; koden är öppen (MIT); reserven utanför cirkulation planeras låsas i ett **valv som inte kan tömmas**, som inte ens grundaren kan ta ut från. |
| ”Kan plattformen stängas ner eller förbjudas?" | Peer-to-peer-meddelanden först, decentraliserad lagring (IPFS / Arweave), 18 EVM-nätverkskonfigurationer och ingen hårdkodad domän.                                          |

## Vad & varför

Traditionella dejtingappar ber dig byta ditt telefonnummer, din e-post, dina foton och intima hälsoinformation mot en central databas — och sedan lita på den databasen för alltid. EVOLVE utgår från motsatt förutsättning: **integritet som standard, självförvaring (self-custody) och ingen enskild felpunkt**.

- **Integritet som standard** — hälsodata exponeras aldrig; endast anonyma utlåtanden.
- **Motståndskraft mot förbud** — P2P-först-meddelanden, decentraliserad lagring, flernätverksdesign, inga hårdkodade domäner.
- **Självförvarad identitet** — din plånbok är din inloggning; DNA-baserad återställning istället för e-post eller telefon.
- **Ingen KYC-grind** — ingen myndighetslegitimation, telefon eller e-post krävs för att använda plattformen.

Läs hela motiveringen i [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md).

## Hälsa du faktiskt kan lita på

- Ladda upp ett STD-test som råtext eller PDF (textlagersextraktion, med OCR-fallback för skanningar).
- Parsern känner till 8 patogener: HIV-1/2, syfilis, klamydia, gonorré, HSV-1, HSV-2, hepatit B, hepatit C — i engelska, ukrainska och ryska rapportformat.
- **Enskild patogenstatus visas aldrig för andra användare.** Profiler visar endast det anonyma utlåtandet: **Safe / Compatible / Caution / Risk**.
- On-chain DNA-register (`DNAVerification.sol`) driver återställning och verifiering.

### Partnerlaboratorier — bevis, inte löften

Kliv in i ett partnerlabb och visa din QR-kod. Labbet skannar den, bekräftar din identitet med **ansiktsmatchning** (så att ingen annan kan hämta ditt resultat) och bifogar STD-rapporten — PDF, skanning eller text, även med dålig OCR. Resultatet signeras av ett riktigt laboratorium, inte av dig, så andra ser ett **verifierat faktum** istället för ditt ord. Och varje bekräftad verifiering betalar **1 EVOLVE till patienten och 1 EVOLVE till laboratoriet** — båda sidor har ett skäl att vara ärliga. Enskilda patogener visas fortfarande aldrig för någon.

## Hitta någon

- Sökfilter: ”Vad söker du” (dejting / befruktning / polyandrisk befruktning / STD-testning), ”Vem söker du” (män, kvinnor, par), kaskadval land → stad, ”kan resa till ditt land” med listor per land, hudfärg, testpreferens, endast STD-kompatibla.
- Onboarding-guide: ålder (kan döljas), språk, bio, foto.
- **P2P-chatt** över libp2p (gossipsub) + Nostr, med ett HTTP-API som fallback.

## Befruktning

Två sätt att planera ett barn — och båda vilar på samma idé: verklig avsikt visas med en verklig insats i EVOLVE — aldrig med löften. En mans åtagande lever i hans EvolveFund-insats (från 15 EVOLVE, låst i minst 30 dagar), och en kvinna kan sätta sin egen minimiinsats för männen som når henne.

**Befruktning.** Kvinnan leder: hon bjuder in en specifik man och namnger honom i en bond. Han behöver en aktiv EvolveFund-insats; när båda bekräftar låses den och nedräkningen börjar. Graviditet rapporteras mellan 14 och 30 dagar efter bekräftelsen, och parets STD- och DNA-tester tas vid själva mötet — färska STD-resultat spelar roll, DNA åldras inte. När faderskapet är bekräftat går mannens insats till kvinnan; om det inte bekräftas återlämnas insatsen enkelt till honom. Inget byter ägare innan fakta är klarlagda.

**Polyandrisk befruktning.** Valet tillhör henne — och förblir privat. Hon öppnar en session som pågår i 48 timmar — utan egen insats (hon kan lägga till en endast för ryktets skull, om hon vill). Män med aktiv insats kan gå med — upp till 50 — och bekräfta, vilket låser deras satsning. Fjorton dagar efter att sessionen stängs väljs fadern. Han får tillbaka sin insats plus en belöning från poolen: dubbla hans insats och 1 EVOLVE för varje annan deltagare. Männen som inte väljs förlorar sin satsning — 90% till kvinnan, 10% till den valde fadern. Hon riskerar inget och kan bara vinna; männen sätter sin satsning bakom rätten att bli vald.

## EVOLVE-token (endast testnet)

- ERC-20, maxtillgång **8,000,000,000 EVOLVE**. Adminåtgärder begränsas av en 48-timmars `TimelockController`.
- **Planerad tillgångsallokering** — designad för att sätta nästan hela tillgången i arbete för användarna, inte för insidare:

| Syfte                                             |        EVOLVE |
| ------------------------------------------------- | ------------: |
| Grundare och team (lön / belöning)                |    25,000,000 |
| DEX-reserv (framtida)                             |     4,000,000 |
| Offentlig försäljning (planerad)                  |     5,000,000 |
| Belönningsreserv — labb, patienter, mödrar, fäder | 7,966,000,000 |

- **Planerad offentlig försäljning** — 5,000,000 EVOLVE sålda av appen till **$0.8 styck**, betalbara i vilken token som helst som appen stöder; intäkterna finansierar utvecklingen. _(Planerad — inte live än.)_
- **Trustless-emission (planerad)** — belönningsreserven på ~7,966,000,000 ska låsas i ett `RewardVault` som inte kan tömmas: det frigörs endast gradvis genom belöningar till labb, patienter, mödrar och fäder, och regeländringar kräver en governance-omröstning. Inte ens grundaren kan ta ut från det. Design: [docs/REWARD-VAULT-PLAN.md](docs/REWARD-VAULT-PLAN.md).
- **Emojipresentekonomi** — en present kostar 1 EVOLVE, fördelas proportionellt bland befintliga presentägare; en evig intäktsmodell, och presenter är överförbara.
- **EvolveFund** — manlig staking (min. 15 EVOLVE, 30-dagars lås) som räknas in i styrningsvikten; kvinnor använder sin plånbokssaldo.
- **Verifieringsbelöningar** — 1 EVOLVE till den verifierade användaren och 1 EVOLVE till det bekräftande labbet per STD/DNA-verifiering (plus en hastighetsbegränsad faucet).
- **Styrning** — röstvikt kombinerar rekursivt rykte (8 röster, djup 3), andel barn/faderskap samt stakade eller hållna EVOLVE.
- **LayerZero OFT**-integration för framtida multichain-överföringar av EVOLVE (beroenden på plats; inget distribuerat utanför Sepolia än).

## Stöd projektet

EVOLVE är oberoende och har öppen källkod. Om den är användbar för dig kan du stödja utvecklingen med en donation — varje bidrag går till kod, labbpartnerskap, hosting och översättning.

- **Donationsdetaljer (EVM, Monero med mera):** [DONATE.md](DONATE.md)
- **Flerspråkig donationssida (34 språk):** **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**

En offentlig tokenförsäljning står på roadmapen men är **inte** live idag. Donationer är gåvor som stödjer utveckling med öppen källkod och ger ingen rätt till tokens, ägarandelar, avkastning eller vinst. Ge endast det du har råd att förlora.

## Arkitektur & teknikstack

Monorepo hanterad med npm workspaces + Turborepo:

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

Nyckelkontrakt: `EVOLVE.sol` (ERC-20), `ProfileNFT.sol` (ERC-721), `TrustScore.sol`, `Voting.sol`, `Evolve2Earn.sol` (emojipresenter + belöningar), `Governance.sol`, `BondManager.sol` (befruktning och polyandrisk befruktning), `EvolveFund.sol`, `VerificationRegistry.sol`, `DNAVerification.sol`, ERC-4337 `SmartAccountFactory` + `Paymaster` samt en OpenZeppelin-`TimelockController`.

Detaljer: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md)

## Roadmap

Pågår: produktionsberedskap för webbappen. Planerat: on-chain labbregister och testcertifiering, en riktig adapter för e-postleverantör för mottagning av labbrapporter, verifierade attesteringar on-chain på profiler, **trustless RewardVault** med styrningsstyrd emission ([design](docs/REWARD-VAULT-PLAN.md)), den **offentliga tokenförsäljningen**, uppdatering av token-vesting för grundarallokeringen samt DEX-likviditetsförsörjning (för närvarande blockerat — det kräver mainnet-distributioner av token). Flernätverksutbyggnad (Arbitrum, Avalanche och andra EVM-kedjor) följer efter testnet-härdning.

Fullständig lista: [docs/ROADMAP.md](docs/ROADMAP.md).

## Kom igång (utvecklare)

Krav: **Node.js 20+** och npm 10.x.

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

## Bidra

Bidrag är välkomna — kod, felrapporter, funktionsförslag och förslag. Läs [CONTRIBUTING.md](CONTRIBUTING.md) och vår [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) innan du börjar.

## Repositorier (speglingar)

| Spegling | URL                                        |
| -------- | ------------------------------------------ |
| GitHub   | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg | https://codeberg.org/limitafternoon/Evolve |
| GitLab   | https://gitlab.com/evolve-group3/evolve    |

## Dokumentation

- [Vad & varför](docs/WHAT-AND-WHY.md) — problem, vision, kärnvärden
- [Hur det fungerar](docs/HOW-IT-WORKS.md) — användarflöden, steg för steg
- [Arkitektur](docs/ARCHITECTURE.md) — monorepo, paket, dataflöden
- [Tokenomics](docs/TOKENOMICS.md) — tokenmodell och tillgångsfördelning
- [RewardVault-planen](docs/REWARD-VAULT-PLAN.md) — trustless-emission (planerad)
- [Roadmap](docs/ROADMAP.md) — milstolpar och aktuell status
- [FAQ](docs/FAQ.md) — vanliga frågor
- [Plånboksguide](docs/WALLETS.md) — hur man skapar plånböcker och får donationsadresser

## Licens

Licensierad under [MIT-licensen](LICENSE).

[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)
<!-- evolve-readme-sync: 3796750887b0bd65 -->

# EVOLVE

**Dejting, befruktning och verifierad hälsa — privat som standard, pålitligt där det verkligen spelar roll.**

EVOLVE är en decentraliserad plattform med öppen källkod för människor som är trötta på att lämna ifrån sig sitt telefonnummer, sitt ansikte och sina allra känsligaste hälsodata till någon annans databas. Du loggar in med din egen kryptoplånbok — ingen telefon, ingen e-post, ingen KYC — och du kan få tillbaka ditt konto via ett on-chain DNA-åtagande. Dina hälsodata förblir dina: testresultat tolkas automatiskt, enskilda patogeners status visas **aldrig** för någon, och matchningen vilar endast på anonyma kompatibilitetsutlåtanden (Safe / Compatible / Caution / Risk). Chatt sker peer-to-peer över libp2p och Nostr, med ett HTTP-fallback för bekvämlighetens skull. Gåvor och överföringar är på väg mot fullständig konfidentialitet: gåvor med skyddad avsändare finns redan idag, och en skyddad Railgun-plånbok samt en nollkunskapsprototyp på Aztec står på roadmapen (se [Privatliv & konfidentiella transaktioner](#privatliv--konfidentiella-transaktioner)).

> **Status — demoläge, under aktiv utveckling.**
> Dejting, befruktning, hälsoverifiering, labbflödet, P2P-chatt, EVOLVE-token och styrningen är alla implementerade och körs i en **lokal demo** — appen är **ännu inte publikt distribuerad**. Det som återstår: en **mainnet-distribution och DEX-likviditet**, plus en **planerad offentlig försäljning** (se [EVOLVE-token](#evolve-token-endast-testnet)).
> De smarta kontrakten är distribuerade **endast på Ethereum Sepolia testnet**. Inget här är finansiell rådgivning eller ett investeringserbjudande.

> **Hittar du EVOLVE användbart? Stöd utvecklingen — varje donation går till kod, labbpartnerskap, hosting och översättning → [DONATE.md](DONATE.md).**

## Ingenting att frukta

EVOLVE byggdes kring de frågor människor faktiskt ställer sig innan de litar på en plattform av det här slaget.

| Oro                                              | Vad EVOLVE redan gör åt saken                                                                                                                                                                                               |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| "Mina hälsodata kommer att läcka."               | Enskilda patogenresultat visas **aldrig** för någon — endast ett anonymt utlåtande: Safe / Compatible / Caution / Risk.                                                                                                     |
| "Mina foton kan hamna var som helst."            | Foton visas suddiga som standard. Ägaren beviljar en **15-sekunders** eller **permanent** visning — på begäran eller proaktivt. Att titta är gratis.                                                                        |
| "Jag måste lämna över min ID eller telefon."     | Inloggning med plånbok (SIWE). Ingen telefon, ingen e-post, ingen KYC. Återställning sker via ett on-chain DNA-åtagande.                                                                                                    |
| "Han eller hon ljuger om att vara frisk."        | Resultaten är **labbverifierade** (QR + ansiktsmatchning), och parets tester tas **vid själva mötet** — färska STD-resultat spelar roll, DNA åldras inte.                                                                   |
| "Kommer någon att ta mina pengar och försvinna?" | Befruktningen vilar på en verklig insats med verklig risk: en mans insättning flyttas endast när faderskapet är **bekräftat**; annars returneras den helt enkelt till honom.                                                |
| "Är token en pump-and-dump?"                     | Koden är öppen (MIT); nästan hela utbudet är reserverat för belöningar till användare, och reserven som inte hunnit cirkulera planeras låsas i ett **valv som inte kan tömmas** — inte ens grundaren kan göra uttag ur det. |
| "Kan plattformen stängas av eller förbjudas?"    | Peer-to-peer-meddelanden i första hand, decentraliserad lagring (IPFS / Arweave), 18 EVM-nätverkskonfigurationer och ingen hårdkodad domän.                                                                                 |

## Vad & varför

Traditionella dejtingappar ber dig byta ditt telefonnummer, din e-post, dina foton och intima hälsouppgifter mot en plats i en central databas — och sedan att lita på den databasen för alltid. EVOLVE utgår från den motsatta premissen: **privatliv som standard, self-custody och ingen enskild felkälla**.

- **Privatliv som standard** — hälsodata exponeras aldrig; endast anonyma utlåtanden.
- **Motståndskraft mot avstängning** — meddelanden P2P-först, decentraliserad lagring, design för flera nätverk, inga hårdkodade domäner.
- **Identitet i egen förvaring** — din plånbok är din inloggning; DNA-baserad återställning i stället för e-post eller telefon.
- **Ingen KYC-grind** — ingen legitimation, telefon eller e-post krävs för att använda plattformen.

Läs hela motiveringen i [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md).

## Hälsa du faktiskt kan lita på

- Ladda upp ett STD-test som råtext eller PDF (utvinning ur textlagret, med OCR-fallback för skanningar).
- Tolken känner igen 8 patogener: HIV-1/2, syfilis, klamydia, gonorré, HSV-1, HSV-2, hepatit B, hepatit C — i engelska, ukrainska och ryska rapportformat.
- **Enskilda patogeners status visas aldrig för andra användare.** Profiler visar endast det anonyma utlåtandet: **Safe / Compatible / Caution / Risk**.
- On-chain-DNA-register (`DNAVerification.sol`) driver återställning och verifiering.

### Partnerlabb — bevis, inte löften

Kliv in på ett partnerlabb och visa din QR-kod. Labbet skannar den, bekräftar din identitet med **ansiktsmatchning** (så att ingen annan kan hämta ditt resultat) och bifogar STD-rapporten — PDF, skanning eller text, även en dålig OCR. Resultatet signeras av ett riktigt laboratorium, inte av dig, så andra ser ett **verifierat faktum** i stället för ditt ord. Och varje bekräftad verifiering betalar ut **1 EVOLVE till patienten och 1 EVOLVE till labbet** — båda sidor har ett incitament att vara ärliga. Enskilda patogener visas fortfarande aldrig för någon.

## Att hitta någon

- Sökfilter: "Vad söker du" (dejting / befruktning / polyandrisk befruktning / STD-testning), "Vem söker du" (män, kvinnor, par), kaskadval för land → stad, "kan resa till ditt land" med listor per land, hudfärg, testpreferens, endast STD-kompatibla.
- Onboarding-guide: ålder (kan döljas), språk, presentation, foto.
- **P2P-chatt** över libp2p (gossipsub) + Nostr, med ett HTTP-API som fallback.

## Befruktning

Två sätt att planera ett barn, och båda vilar på samma idé: verklig avsikt visas med en verklig insats i EVOLVE — aldrig med löften. En mans åtagande lever i hans EvolveFund-insättning (från 15 EVOLVE, låst i minst 30 dagar), och en kvinna kan sätta sin egen minimiinsättning för de män som når fram till henne.

**Befruktning.** Kvinnan leder: hon bjuder in en bestämd man och namnger honom i en bond. Han behöver en aktiv EvolveFund-insättning; när båda bekräftar låses den och nedräkningen börjar. Graviditet rapporteras mellan 14 och 30 dagar efter bekräftelsen, och parets STD- och DNA-tester tas vid själva mötet — färska STD-resultat spelar roll, DNA åldras inte. När faderskapet har bekräftats går mannens insättning till kvinnan; om det inte bekräftas släpps insättningen helt enkelt tillbaka till honom. Inget byter ägare innan sakläget är fastslaget.

**Polyandrisk befruktning.** Valet är hennes, och det förblir privat. Hon öppnar en session som pågår i 48 timmar — utan egen insättning (hon kan lägga till en endast för ryktets skull, om hon vill). Män med en aktiv insättning kan gå med — upp till 50 — och bekräfta, vilket låser deras insats. Fjorton dagar efter att sessionen stängts väljs fadern. Han får tillbaka sin insättning plus en belöning från poolen: dubbelt så mycket som sin insättning och 1 EVOLVE för varje övrig deltagare. Männen som inte blir valda förlorar sin insats — 90 % går till kvinnan och 10 % till den utvalde fadern. Hon riskerar ingenting och kan bara vinna; männen sätter sin insats på rätten att bli valda.

## Privatliv & konfidentiella transaktioner

Privatliv är utgångsläget — och EVOLVE bygger en roadmap mot fullt konfidentiella on-chain-transaktioner.

- **Privata gåvor** — skicka en ros 🌹 eller en kaktus 🌵 (1 EVOLVE) och välj vem som ska kunna se att det var du: _publikt_, _anonymt för alla utom mottagaren_ eller _helt anonymt_. I de anonyma lägena reser gåvan som en engångs-voucher som mottagaren löser in med sin egen plånbok, så att avsändaren aldrig syns på kedjan. (Avsändaranonymiteten är idag av vardagsklass: finansieringstransaktionen kan kopplas samman via tidpunkt och belopp.)
- **Skyddad Railgun-plånbok** — en funktionsflaggad privat plånbok (`VITE_RAILGUN_ENABLED`, av som standard) som döljer belopp och adresser med Railguns nollkunskaps-pool i drift. Detta är vägen till verklig avsändaranonymitet.
- **Aztec-prototyp** — samma logik för privata överföringar och privata bond, uttryckt som nollkunskapskretsar i Noir och hålls bakom en explicit grind tills Aztec är produktionsklart. Se [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md).
- **Modell med två plånböcker** — en publik insatsplånbok deltar i styrningen; en privat skyddad plånbok är medvetet **exkluderad** från styrningsvikten, vilket håller privatliv och röststyrka åtskilda.

Detaljer: [docs/RAILGUN-INTEGRATION.md](docs/RAILGUN-INTEGRATION.md) · [docs/SHIELDED-STAKES-DESIGN.md](docs/SHIELDED-STAKES-DESIGN.md) · [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md).

## EVOLVE-token (endast testnet)

- ERC-20, maximalt utbud **8,000,000,000 EVOLVE**. Adminåtgärder styrs av en `TimelockController` på 48 timmar.
- **Planerad utbudsfördelning** — utformad för att sätta nästan hela utbudet i arbete för användarna, inte för insiders:

| Syfte                                            |        EVOLVE |
| ------------------------------------------------ | ------------: |
| Grundare och team (lön / belöning)               |    25,000,000 |
| DEX-reserv (framtida)                            |     4,000,000 |
| Publik försäljning (planerad)                    |     5,000,000 |
| Belöningsreserv — labb, patienter, mödrar, fäder | 7,966,000,000 |

- **Planerad offentlig försäljning** — 5,000,000 EVOLVE sålda av appen till **$0.8 styck**, betalning sker med vilken token som helst som appen stöder; intäkterna finansierar utvecklingen. _(Planerad — inte igång än.)_
- **Trustless-emission (planerad)** — belöningsreserven på ~7,966,000,000 ska låsas i en icke-tömbar `RewardVault`: den släpps endast ut gradvis genom belöningar till labb, patienter, mödrar och fäder, och regeländringar kräver omröstning i styrningen. Inte ens grundaren kan ta ut den. Design: [docs/REWARD-VAULT-PLAN.md](docs/REWARD-VAULT-PLAN.md).
- **Emoji-gåvoekonomi** — en gåva kostar 1 EVOLVE och fördelas proportionellt bland befintliga gåvoägare; en evig intäktsmodell, och gåvor går att överföra.
- **EvolveFund** — manlig staking (minst 15 EVOLVE, 30 dagars lås) som räknas in i styrningsvikten; kvinnor använder sitt plånbokssaldo.
- **Verifieringsbelöningar** — 1 EVOLVE till den verifierade användaren och 1 EVOLVE till det bekräftande labbet per STD/DNA-verifiering (plus en hastighetsbegränsad faucet).
- **Styrning** — röstvikten kombinerar rekursivt anseende (8 röster, djup 3), andelen barn/faderskap samt insatta eller innestående EVOLVE.
- **LayerZero OFT**-integration för framtida EVOLVE-överföringar över flera kedjor (beroenden på plats; ingenting distribuerat bortom Sepolia ännu).

## Stöd projektet

EVOLVE är oberoende och byggs med öppen källkod. Om det är användbart för dig kan du stödja utvecklingen med en donation — varje bidrag går till kod, labbpartnerskap, hosting och översättning.

- **Donationsuppgifter (EVM, Monero med mera):** [DONATE.md](DONATE.md)
- **Flerspråkig donationssida (34 språk):** **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**

En offentlig tokenförsäljning är **planerad** — 5,000,000 EVOLVE, sålda av appen (se [EVOLVE-token](#evolve-token-endast-testnet)). Donationer är gåvor som stödjer utveckling av öppen källkod och ger ingen rätt till tokens, ägandeandelar, avkastning eller vinst. Ge bara det du har råd att förlora.

## Arkitektur & teknikstack

Monorepo som hanteras med npm workspaces + Turborepo:

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

Viktiga smarta kontrakt: `EVOLVE.sol` (ERC-20), `ProfileNFT.sol` (ERC-721), `TrustScore.sol`, `Voting.sol`, `Evolve2Earn.sol` (emoji-gåvor + belöningar), `Governance.sol`, `BondManager.sol` (befruktning och polyandrisk befruktning), `EvolveFund.sol`, `VerificationRegistry.sol`, `DNAVerification.sol`, ERC-4337 `SmartAccountFactory` + `Paymaster` samt en OpenZeppelin `TimelockController`.

Detaljer: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md)

## Roadmap

Pågår: produktionsberedskap för webbappen. Planerat: ett on-chain-labbregister och testcertifiering, en riktig adapter för e-postleverantör för mottagning av labbrapporter, verifierade on-chain-attesteringar på profiler, den **trustless RewardVault** med emissionsregler via styrning ([design](docs/REWARD-VAULT-PLAN.md)), den **offentliga tokenförsäljningen**, uppdatering av token-vestingen för grundarallokeringen samt tillhandahållande av DEX-likviditet (för tillfället blockerat — det kräver token-distributioner på mainnet). På integritetssidan är gåvor med privat avsändare klara, medan den skyddade Railgun-plånboken och Aztec-migreringen av privata bond ligger bakom kontrollerna i [docs/ROADMAP.md](docs/ROADMAP.md) och [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md). Utbyggnad till flera nätverk (Arbitrum, Avalanche och andra EVM-kedjor) följer efter att testnätet härdats.

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

Bidrag är välkomna — kod, felrapporter, förslag på funktioner och andra idéer. Läs [CONTRIBUTING.md](CONTRIBUTING.md) och vår [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) innan du sätter igång.

## Repositorier (speglingar)

| Spegel   | URL                                        |
| -------- | ------------------------------------------ |
| GitHub   | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg | https://codeberg.org/limitafternoon/Evolve |
| GitLab   | https://gitlab.com/evolve-group3/evolve    |

## Dokumentation

- [Vad & varför](docs/WHAT-AND-WHY.md) — problem, vision, kärnvärden
- [Så fungerar det](docs/HOW-IT-WORKS.md) — användarflöden, steg för steg
- [Arkitektur](docs/ARCHITECTURE.md) — monorepo, paket, dataflöden
- [Tokenomics](docs/TOKENOMICS.md) — tokenmodell och utbudsfördelning
- [RewardVault-planen](docs/REWARD-VAULT-PLAN.md) — trustless-emission (planerad)
- [Railgun-integration](docs/RAILGUN-INTEGRATION.md) — integrationsstudie av skyddad plånbok
- [Skyddade insatser](docs/SHIELDED-STAKES-DESIGN.md) — privata befruktningsinsatser (design)
- [Aztec-prototypen](docs/AZTEC-PROTOTYPE.md) — ZK privata överföringar & bond (forskning)
- [Roadmap](docs/ROADMAP.md) — milstolpar och aktuell status
- [FAQ](docs/FAQ.md) — vanliga frågor
- [Plånboksguide](docs/WALLETS.md) — hur man skapar plånböcker och hittar donationsadresser

## Licens

Licensierad under [MIT-licensen](LICENSE).

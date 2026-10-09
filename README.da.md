[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)
<!-- evolve-readme-sync: 3796750887b0bd65 -->

# EVOLVE

**Dating, undfangelse og verificeret sundhed — privat som udgangspunkt, tillid dér, hvor det betyder noget.**

EVOLVE er en decentraliseret open source-platform til mennesker, der er trætte af at overlevere deres telefonnummer, deres ansigt og deres mest intime sundhedsdata til en fremmed database. Du logger ind med din egen kryptowallet — ingen telefon, ingen e-mail, ingen KYC — og du kan få din konto tilbage via en on-chain DNA-forpligtelse. Dine sundhedsdata forbliver dine: testresultater parses automatisk, individuel patogenstatus vises **aldrig** for nogen, og matching bygger udelukkende på anonyme kompatibilitetsvurderinger (Sikker / Kompatibel / Forsigtig / Risiko). Chat kører peer-to-peer over libp2p og Nostr, med en HTTP-fallback for bekvemmelighedens skyld. Gaver og overførsler er på vej mod fuld fortrolighed: afsender-private gaver virker i dag, og en skjult Railgun-wallet samt en Aztec zero-knowledge-prototype står på køreplanen (se [Privatliv & fortrolige transaktioner](#privacy--confidential-transactions)).

> **Status — demotilstand, under aktiv udvikling.**
> Dating, undfangelse, sundhedsverifikation, laboratorieflowet, P2P-chat, EVOLVE-tokenet og governance er alle implementeret og kører i en **lokal demo** — appen er **endnu ikke offentligt udrullet**. Stadig på vejen: en **mainnet-udrulning og DEX-likviditet** samt et **planlagt offentligt salg** (se [EVOLVE-tokenet](#the-evolve-token-testnet-only)).
> Smart contracts er udrullet **kun på Ethereum Sepolia-testnettet**. Intet her er finansiel rådgivning eller et investeringstilbud.

> **Synes du, EVOLVE er nyttigt? Støt udviklingen — hver donation går til kode, laboratoriepartnerskaber, hosting og oversættelse → [DONATE.md](DONATE.md).**

## Intet at frygte

EVOLVE er bygget omkring de spørgsmål, folk faktisk stiller, før de stoler på en platform som denne.

| Bekymringen                                         | Hvad EVOLVE allerede gør ved det                                                                                                                                                                                     |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| »Mine sundhedsdata lækker.«                         | Individuelle patogenresultater vises **aldrig** for nogen — kun en anonym vurdering: Sikker / Kompatibel / Forsigtig / Risiko.                                                                                       |
| »Mine fotos havner et eller andet sted.«            | Fotos er slørede som standard. Ejeren giver en **15-sekunders** eller **permanent** visning — på anmodning eller proaktivt. Det er gratis at se.                                                                     |
| »Jeg bliver nødt til at aflevere ID eller telefon.« | Wallet-login (SIWE). Ingen telefon, ingen e-mail, ingen KYC. Genoprettelse sker via en on-chain DNA-forpligtelse.                                                                                                    |
| »Han eller hun lyver om at være rask.«              | Resultaterne er **laboratorieverificerede** (QR + ansigtsgenkendelse), og parrets tests tages **ved selve mødet** — nylige STD-resultater betyder noget, DNA aldrer ikke.                                            |
| »Løber nogen med mine penge?«                       | Undfangelse kører på en reel, risikobærende indsats: en mands indskud flytter sig først, når faderskabet er **bekræftet**; ellers bliver det blot returneret til ham.                                                |
| »Er tokenet pump-and-dump?«                         | Koden er åben (MIT); næsten hele forsyningen er reserveret til brugerbelønninger, og den ikke-cirkulerede reserve planlægges låst i en **vault, der ikke kan tømmes**, som ikke engang grundlæggeren kan trække fra. |
| »Kan platformen lukkes ned eller forbydes?«         | Peer-to-peer-beskeder først, decentraliseret lagring (IPFS / Arweave), 18 EVM-netværkskonfigurationer og intet hårdkodet domæne.                                                                                     |

## Hvad & hvorfor

Traditionelle datingapps beder dig bytte dit telefonnummer, din e-mail, dine fotos og intime sundhedsoplysninger til en central database — og derefter stole på den database for altid. EVOLVE tager udgangspunkt i det modsatte princip: **privatliv som udgangspunkt, self-custody og intet enkelt fejlpunkt**.

- **Privatliv som udgangspunkt** — sundhedsdata eksponeres aldrig; kun anonyme vurderinger.
- **Modstandsdygtighed over for nedlukning** — P2P-beskeder først og fremmest, decentraliseret lagring, multinetværksdesign, ingen hårdkodede domæner.
- **Selvforvaltet identitet** — din wallet er dit login; DNA-baseret genoprettelse i stedet for e-mail eller telefon.
- **Ingen KYC-barriere** — hverken officielt ID, telefon eller e-mail kræves for at bruge platformen.

Læs hele begrundelsen i [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md).

## Sundhed du reelt kan stole på

- Upload en STD-test som rå tekst eller PDF (udtrækning af tekstlag, med OCR-fallback ved scanninger).
- Parseren kender 8 patogener: HIV-1/2, syfilis, klamydia, gonorré, HSV-1, HSV-2, hepatitis B, hepatitis C — i engelske, ukrainske og russiske rapportformater.
- **Individuel patogenstatus vises aldrig for andre brugere.** Profiler viser altid kun den anonyme vurdering: **Sikker / Kompatibel / Forsigtig / Risiko**.
- On-chain DNA-registre (`DNAVerification.sol`) driver genoprettelse og verifikation.

### Partnerlaboratorier — beviser, ikke løfter

Gå ind i et partnerlaboratorium og vis din QR-kode. Laboratoriet scanner den, bekræfter din identitet med **ansigtsgenkendelse** (så ingen andre kan afhente dit resultat) og vedhæfter STD-rapporten — PDF, scanning eller tekst, selv en dårlig OCR. Resultatet underskrives af et rigtigt laboratorium, ikke af dig, så andre ser en **verificeret kendsgerning** i stedet for dit ord. Og hver bekræftet verifikation udbetaler **1 EVOLVE til patienten og 1 EVOLVE til laboratoriet** — begge sider har en grund til at være ærlige. Individuelle patogener vises stadig aldrig for nogen.

## At finde nogen

- Søgefiltre: »Hvad søger du« (dating / undfangelse / polyandrisk undfangelse / STD-test), »Hvem søger du« (mænd, kvinder, par), kaskaderende valg af land → by, »kan rejse til dit land« med lister pr. land, hudfarve, testpræference, kun STD-kompatible.
- Onboarding-wizard: alder (kan skjules), sprog, bio, foto.
- **P2P-chat** over libp2p (gossipsub) + Nostr, med HTTP-API som fallback.

## Undfangelse

To måder at planlægge et barn på — begge hviler på samme idé: reel hensigt vises med en reel indsats i EVOLVE, aldrig med løfter. En mands engagement ligger i hans EvolveFund-indskud (fra 15 EVOLVE, låst i mindst 30 dage), og en kvinde kan selv sætte minimumsindskuddet for de mænd, der når frem til hende.

**Undfangelse.** Kvinden fører: hun inviterer en bestemt mand og udpeger ham i en bond. Han skal have et aktivt EvolveFund-indskud; når begge bekræfter, låses det, og nedtællingen starter. Graviditet rapporteres mellem 14 og 30 dage efter bekræftelsen, og parrets STD- og DNA-tests tages ved selve mødet — nylige STD-resultater betyder noget, DNA aldrer ikke. Når faderskabet er bekræftet, går mandens indskud til kvinden; hvis det ikke bekræftes, frigives indskuddet blot tilbage til ham. Intet skifter hænder, før fakta er på plads.

**Polyandrisk undfangelse.** Valget tilhører hende og forbliver privat. Hun åbner en session, der kører i 48 timer — uden eget indskud (ønsker hun det, kan hun tilføje ét alene for omdømmets skyld). Mænd med et aktivt indskud kan deltage — op til 50 — og bekræfte, hvilket låser deres indsats. Fjorten dage efter sessionen lukker, vælges faderen. Han får sit indskud tilbage plus en belønning fra puljen: det dobbelte af sit indskud samt 1 EVOLVE for hver anden deltager. De mænd, der ikke vælges, mister deres indsats — 90 % går til kvinden, 10 % til den valgte fader. Hun risikerer ingenting og kan kun vinde; mændene sætter deres indsats bag retten til at blive valgt.

## Privatliv & fortrolige transaktioner

Privatliv er udgangspunktet — og EVOLVE bygger en køreplan mod fuldt fortrolige on-chain-overførsler.

- **Private gaver** — send en rose 🌹 eller en kaktus 🌵 (1 EVOLVE) og vælg, hvem der kan se, at det var dig: _offentligt_, _anonymt over for alle undtagen modtageren_ eller _fuldt anonymt_. I de anonyme tilstande rejser gaven som en engangs-voucher, som modtageren indløser med sin egen wallet, så afsenderen aldrig dukker op on-chain. (Afsenderanonymitet er i dag af hverdagskarakter: finansieringstransaktionen kan sammenkædes via tidspunkt og beløb.)
- **Skjult Railgun-wallet** — en privat wallet bag et feature-flag (`VITE_RAILGUN_ENABLED`, som standard slået fra), der skjuler beløb og adresser ved hjælp af Railguns aktive zero-knowledge-pool. Dette er vejen til ægte afsenderanonymitet.
- **Aztec-prototype** — samme logik for private overførsler og private bond, udtrykt som zero-knowledge Noir-kredsløb og holdt bag en eksplicit gate, indtil Aztec er produktionsklar. Se [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md).
- **To-wallet-model** — en offentlig stake-wallet deltager i governance; en privat, skjult wallet er bevidst **udelukket** fra governance-vægten, så privatliv og stemmekraft holdes adskilt.

Detaljer: [docs/RAILGUN-INTEGRATION.md](docs/RAILGUN-INTEGRATION.md) · [docs/SHIELDED-STAKES-DESIGN.md](docs/SHIELDED-STAKES-DESIGN.md) · [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md).

## EVOLVE-tokenet (kun testnet)

- ERC-20, maksimal forsyning **8,000,000,000 EVOLVE**. Adminhandlinger styres af en 48-timers `TimelockController`.
- **Planlagt forsyningsfordeling** — designet til at sætte næsten hele forsyningen i arbejde for brugerne, ikke for indsidere:

| Formål                                                    |        EVOLVE |
| --------------------------------------------------------- | ------------: |
| Grundlæggere og team (løn / belønning)                    |    25,000,000 |
| DEX-reserve (fremtidig)                                   |     4,000,000 |
| Offentligt salg (planlagt)                                |     5,000,000 |
| Belønningsreserve — laboratorier, patienter, mødre, fædre | 7,966,000,000 |

- **Planlagt offentligt salg** — 5,000,000 EVOLVE solgt af appen til **0,8 USD pr. stk.**, som kan betales med enhver token, appen understøtter; overskuddet finansierer udviklingen. _(Planlagt — ikke live endnu.)_
- **Trustless-emission (planlagt)** — belønningsreserven på ~7,966,000,000 skal låses i en `RewardVault`, der ikke kan tømmes: den frigives kun gradvist gennem belønninger til laboratorier, patienter, mødre og fædre, og regelændringer kræver en governance-afstemning. Ikke engang grundlæggeren kan hæve den. Design: [docs/REWARD-VAULT-PLAN.md](docs/REWARD-VAULT-PLAN.md).
- **Emoji-gaveøkonomi** — en gave koster 1 EVOLVE og fordeles forholdsmæssigt mellem eksisterende gaveejere; en evig indtægtsmodel, og gaver kan overdrages.
- **EvolveFund** — staking for mænd (min. 15 EVOLVE, 30 dages lås), der tæller med i governance-vægten; kvinder bruger deres wallet-saldo.
- **Verifikationsbelønninger** — 1 EVOLVE til den verificerede bruger og 1 EVOLVE til det bekræftende laboratorium pr. STD/DNA-verifikation (plus en faucet med hastighedsbegrænsning).
- **Governance** — stemmevægten kombinerer rekursiv omdømme (8 stemmer, dybde 3), andelen af børn/faderskab samt stakede eller holdte EVOLVE.
- **LayerZero OFT**-integration til fremtidige multichain EVOLVE-overførsler (afhængighederne er på plads; intet udrullet ud over Sepolia endnu).

## Støt projektet

EVOLVE er uafhængigt og open source. Hvis det er nyttigt for dig, kan du støtte udviklingen med en donation — hvert bidrag går til kode, laboratoriepartnerskaber, hosting og oversættelse.

- **Donationsdetaljer (EVM, Monero m.m.):** [DONATE.md](DONATE.md)
- **Flersproget donationsside (34 sprog):** **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**

Et offentligt tokensalg er **planlagt** — 5,000,000 EVOLVE, solgt af appen (se [EVOLVE-tokenet](#the-evolve-token-testnet-only)). Donationer er gaver, der støtter open source-udvikling, og giver ingen ret til tokens, ejerskab, afkast eller profit. Giv kun det, du har råd til at miste.

## Arkitektur & teknologistak

Monorepo styret med npm workspaces + Turborepo:

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

Vigtigste smart contracts: `EVOLVE.sol` (ERC-20), `ProfileNFT.sol` (ERC-721), `TrustScore.sol`, `Voting.sol`, `Evolve2Earn.sol` (emoji-gaver + belønninger), `Governance.sol`, `BondManager.sol` (undfangelse og polyandrisk undfangelse), `EvolveFund.sol`, `VerificationRegistry.sol`, `DNAVerification.sol`, ERC-4337 `SmartAccountFactory` + `Paymaster` samt en OpenZeppelin `TimelockController`.

Detaljer: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md)

## Køreplan

I gang: at gøre webappen produktionsklar. Planlagt: on-chain laboratorieregister og testcertificering, en rigtig adapter til mailudbydere til indhentning af laboratorierapporter, on-chain-verificerede attester på profiler, den **trustless RewardVault** med governance-styret emission ([design](docs/REWARD-VAULT-PLAN.md)), det **offentlige tokensalg**, opdatering af token-vesting for grundlæggerallokeringen samt DEX-likviditetsforsyning (i øjeblikket blokeret — det kræver mainnet-udrulninger af tokenet). På privatlivssiden er afsender-private gaver færdige, mens den skjulte Railgun-wallet og Aztec-migreringen af private bond forbliver holdt bag tjekkene i [docs/ROADMAP.md](docs/ROADMAP.md) og [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md). Multinetværksudvidelse (Arbitrum, Avalanche og andre EVM-kæder) følger, efter at testnettet er hærdet.

Fuld liste: [docs/ROADMAP.md](docs/ROADMAP.md).

## Kom godt i gang (udviklere)

Krav: **Node.js 20+** og npm 10.x.

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

## Bidrag

Bidrag er velkomne — kode, fejlrapporter, funktionsforslag og forslag. Læs venligst [CONTRIBUTING.md](CONTRIBUTING.md) og vores [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md), før du går i gang.

## Repositorier (spejle)

| Spejl    | URL                                        |
| -------- | ------------------------------------------ |
| GitHub   | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg | https://codeberg.org/limitafternoon/Evolve |
| GitLab   | https://gitlab.com/evolve-group3/evolve    |

## Dokumentation

- [Hvad & hvorfor](docs/WHAT-AND-WHY.md) — problem, vision, kerneværdier
- [Sådan virker det](docs/HOW-IT-WORKS.md) — brugerflows, trin for trin
- [Arkitektur](docs/ARCHITECTURE.md) — monorepo, pakker, datastrømme
- [Tokenomics](docs/TOKENOMICS.md) — tokenmodel og forsyningsfordeling
- [RewardVault-planen](docs/REWARD-VAULT-PLAN.md) — trustless-emission (planlagt)
- [Railgun-integration](docs/RAILGUN-INTEGRATION.md) — integrationseksperiment med skjult wallet
- [Skjulte indskud](docs/SHIELDED-STAKES-DESIGN.md) — private indskud til undfangelse (design)
- [Aztec-prototype](docs/AZTEC-PROTOTYPE.md) — ZK-private overførsler & bond (forskning)
- [Køreplan](docs/ROADMAP.md) — milepæle og aktuel status
- [FAQ](docs/FAQ.md) — ofte stillede spørgsmål
- [Wallet-guide](docs/WALLETS.md) — sådan opretter du wallets og finder donationsadresser

## Licens

Licenseret under [MIT-licensen](LICENSE).

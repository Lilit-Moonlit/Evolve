[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)

# EVOLVE

**Dating, undfangelse og verificeret sundhed — privat som standard, tillid der, hvor det betyder noget.**

EVOLVE er en open source, decentraliseret platform til mennesker, der er trætte af at give deres telefonnummer, deres ansigt og deres mest intime sundhedsdata til en andens database. Du logger ind med din egen krypto-wallet — uden telefon, uden e-mail, uden KYC — og du kan få din konto tilbage via en on-chain DNA-forpligtelse. Dine sundhedsdata forbliver dine: testresultater analyseres automatisk, individuelle patogenstatusser vises **aldrig** for nogen, og matching bygger udelukkende på anonyme kompatibilitetskendelser (Safe / Compatible / Caution / Risk). Chatten kører peer-to-peer over libp2p og Nostr med en HTTP-fallback for bekvemmelighed.

> **Status — platformen virker allerede i dag; mainnet og DEX er de næste skridt.**
> Dating, undfangelse, sundhedsverifikation, laboratorieflowet, P2P-chat, EVOLVE-tokenet og governance kører alle. Stadig på vej: en **mainnet-udrulning og DEX-likviditet** samt et **planlagt offentligt salg** (se [EVOLVE-tokenet](#evolve-tokenet-kun-testnet)).
> Smart contracts er udrullet **kun på Ethereum Sepolia-testnet**. Intet her er finansiel rådgivning eller et investeringstilbud.

> **Finder du EVOLVE nyttig? Støt udviklingen — hver donation går til kode, laboratoriepartnerskaber, hosting og oversættelse → [DONATE.md](DONATE.md).**

## Intet at frygte

EVOLVE er bygget omkring de spørgsmål, folk faktisk stiller, før de stoler på en platform som denne.

| Bekymringen                                         | Hvad EVOLVE allerede gør ved den                                                                                                                                             |
| --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| „Mine sundhedsdata vil lække."                      | Individuelle patogenresultater vises **aldrig** for nogen — kun en anonym kendelse: Safe / Compatible / Caution / Risk.                                                      |
| „Mine fotos ender et sted."                         | Fotos er slørede som standard. Ejeren giver en **15-sekunders** eller **permanent** visning — på anmodning eller proaktivt. At se er gratis.                                 |
| „Jeg bliver nødt til at aflevere ID eller telefon." | Wallet-login (SIWE). Ingen telefon, ingen e-mail, ingen KYC. Genoprettelse sker via en on-chain DNA-forpligtelse.                                                            |
| „Han eller hun lyver om at være sund."              | Resultaterne er **laboratorieverificerede** (QR + ansigtsgenkendelse), og parrets test tages **ved selve mødet** — nylige STD-resultater tæller, DNA ældes ikke.             |
| „Tager nogen mine penge og forsvinder?"             | Undfangelse hviler på en reel, risikobetinget indsats: en mands indskud bevæger sig kun, når faderskabet er **bekræftet**; ellers bliver det simpelthen returneret til ham.  |
| „Er tokenen et pump-and-dump?"                      | Ingen salg er live i dag; koden er åben (MIT); den ikke-cirkulerende reserve planlægges låst i en **boks, der ikke kan tømmes**, som ikke engang grundlæggeren kan hæve fra. |
| „Kan platformen lukkes ned eller forbydes?"         | Peer-to-peer-beskeder først, decentraliseret lagring (IPFS / Arweave), 18 EVM-netværkskonfigurationer og ingen hardcodet domæne.                                             |

## Hvad & hvorfor

Traditionelle datingapps beder dig bytte dit telefonnummer, din e-mail, dine fotos og intime sundhedsdetaljer til en central database — og så stole på den database for evigt. EVOLVE starter fra den modsatte præmis: **privatliv som standard, selvforvaltning (self-custody) og intet enkelt fejlpunkt**.

- **Privatliv som standard** — sundhedsdata eksponeres aldrig; kun anonyme kendelser.
- **Modstandskraft mod forbud** — P2P-først-beskeder, decentraliseret lagring, multinetværksdesign, ingen hardcodede domæner.
- **Selvforvaltet identitet** — din wallet er dit login; DNA-baseret genoprettelse i stedet for e-mail eller telefon.
- **Ingen KYC-barriere** — intet officielt ID, telefon eller e-mail kræves for at bruge platformen.

Læs den fulde begrundelse i [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md).

## Sundhed du faktisk kan stole på

- Upload en STD-test som rå tekst eller PDF (tekstlag-udtrækning, med OCR-fallback til scanninger).
- Parseren kender 8 patogener: HIV-1/2, syfilis, klamydia, gonorré, HSV-1, HSV-2, hepatitis B, hepatitis C — i engelske, ukrainske og russiske rapportformater.
- **Individuel patogenstatus vises aldrig for andre brugere.** Profiler viser kun nogensinde den anonyme kendelse: **Safe / Compatible / Caution / Risk**.
- On-chain DNA-poster (`DNAVerification.sol`) driver genoprettelse og verifikation.

### Partnerlaboratorier — beviser, ikke løfter

Gå ind i et partnerlaboratorium og vis din QR-kode. Laboratoriet scanner den, bekræfter din identitet med **ansigtsgenkendelse** (så ingen andre kan afhente dit resultat) og vedhæfter STD-rapporten — PDF, scanning eller tekst, selv med dårlig OCR. Resultatet er signeret af et rigtigt laboratorium, ikke af dig, så andre ser en **verificeret kendsgerning** i stedet for dit ord. Og hver bekræftede verifikation udbetaler **1 EVOLVE til patienten og 1 EVOLVE til laboratoriet** — begge sider har en grund til at være ærlige. Individuelle patogener vises stadig aldrig for nogen.

## At finde nogen

- Søgefilter: „Hvad søger du" (dating / undfangelse / polyandrisk undfangelse / STD-test), „Hvem søger du" (mænd, kvinder, par), kaskaderende land → by-valg, „kan rejse til dit land" med lister pr. land, hudfarve, testpræference, kun STD-kompatible.
- Onboarding-guide: alder (kan skjules), sprog, bio, foto.
- **P2P-chat** over libp2p (gossipsub) + Nostr, med en HTTP-API-fallback.

## Undfangelse

To måder at planlægge et barn på — og begge hviler på samme idé: reel hensigt vises med en reel indsats i EVOLVE — aldrig med løfter. En mands engagement lever i hans EvolveFund-indskud (fra 15 EVOLVE, låst i mindst 30 dage), og en kvinde kan sætte sit eget minimumsindskud for de mænd, der når hende.

**Undfangelse.** Kvinden fører: hun inviterer en bestemt mand og nævner ham i en bond. Han skal have et aktivt EvolveFund-indskud; når begge bekræfter, låses det, og nedtællingen begynder. Graviditet rapporteres mellem 14 og 30 dage efter bekræftelsen, og parrets STD- og DNA-test tages ved selve mødet — nylige STD-resultater tæller, DNA ældes ikke. Når faderskabet er bekræftet, går mandens indskud til kvinden; hvis det ikke bekræftes, bliver indskuddet simpelthen frigivet til ham. Intet skifter hænder, før fakta er på plads.

**Polyandrisk undfangelse.** Valget tilhører hende — og forbliver privat. Hun åbner en session, der kører i 48 timer — uden eget indskud (hun kan kun tilføje et for omdømmets skyld, hvis hun ønsker det). Mænd med et aktivt indskud kan deltage — op til 50 — og bekræfte, hvilket låser deres indsats. Fjorten dage efter sessionen lukker, vælges faderen. Han får sit indskud tilbage plus en belønning fra puljen: det dobbelte af sit indskud og 1 EVOLVE for hver anden deltager. De mænd, der ikke vælges, mister deres indsats — 90% til kvinden, 10% til den valgte far. Hun risikerer intet og kan kun vinde; mændene sætter deres indsats ind bag retten til at blive valgt.

## EVOLVE-tokenet (kun testnet)

- ERC-20, maksimal forsyning **8,000,000,000 EVOLVE**. Admin-handlinger er begrænset af en 48-timers `TimelockController`.
- **Planlagt forsyningsallokering** — designet til at sætte næsten hele forsyningen til arbejde for brugerne, ikke for insidere:

| Formål                                                    |        EVOLVE |
| --------------------------------------------------------- | ------------: |
| Grundlæggere og team (løn / belønning)                    |    25,000,000 |
| DEX-reserve (fremtidig)                                   |     4,000,000 |
| Offentligt salg (planlagt)                                |     5,000,000 |
| Belønningsreserve — laboratorier, patienter, mødre, fædre | 7,966,000,000 |

- **Planlagt offentligt salg** — 5,000,000 EVOLVE solgt af appen til **$0.8 stykket**, betalbart i enhver token, som appen understøtter; overskuddet finansierer udviklingen. _(Planlagt — ikke live endnu.)_
- **Trustless-emission (planlagt)** — belønningsreserven på ~7,966,000,000 skal låses i en `RewardVault`, der ikke kan tømmes: den frigives kun gradvist gennem belønninger til laboratorier, patienter, mødre og fædre, og regelændringer kræver en governance-afstemning. Ikke engang grundlæggeren kan hæve fra den. Design: [docs/REWARD-VAULT-PLAN.md](docs/REWARD-VAULT-PLAN.md).
- **Emoji-gaveøkonomi** — en gave koster 1 EVOLVE, fordeles forholdsmæssigt mellem eksisterende gaveejere; en permanent indtægtsmodel, og gaver kan overdrages.
- **EvolveFund** — mandlig staking (min. 15 EVOLVE, 30-dages lås), der tæller med i governance-vægten; kvinder bruger deres wallet-saldo.
- **Verifikationsbelønninger** — 1 EVOLVE til den verificerede bruger og 1 EVOLVE til det bekræftende laboratorium pr. STD/DNA-verifikation (plus en hastighedsbegrænset faucet).
- **Governance** — stemmevægten kombinerer rekursiv omdømme (8 stemmer, dybde 3), andel af børn/faderskab samt stakede eller holdte EVOLVE.
- **LayerZero OFT**-integration til fremtidige multichain EVOLVE-overførsler (afhængigheder på plads; intet udrullet ud over Sepolia endnu).

## Støt projektet

EVOLVE er uafhængig og open source. Hvis den er nyttig for dig, kan du støtte udviklingen med en donation — hvert bidrag går til kode, laboratoriepartnerskaber, hosting og oversættelse.

- **Donationsdetaljer (EVM, Monero og mere):** [DONATE.md](DONATE.md)
- **Flersproget donationsside (34 sprog):** **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**

Et offentligt tokensalg står på roadmappen, men er **ikke** live i dag. Donationer er gaver, der understøtter open source-udvikling og giver ingen krav på tokens, ejerandele, afkast eller profit. Giv kun det, du har råd til at miste.

## Arkitektur & Tech Stack

Monorepo administreret med npm workspaces + Turborepo:

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

Vigtigste smart contracts: `EVOLVE.sol` (ERC-20), `ProfileNFT.sol` (ERC-721), `TrustScore.sol`, `Voting.sol`, `Evolve2Earn.sol` (emoji-gaver + belønninger), `Governance.sol`, `BondManager.sol` (undfangelse og polyandrisk undfangelse), `EvolveFund.sol`, `VerificationRegistry.sol`, `DNAVerification.sol`, ERC-4337 `SmartAccountFactory` + `Paymaster` samt en OpenZeppelin-`TimelockController`.

Detaljer: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md)

## Roadmap

I gang: produktionsmodenhed i webappen. Planlagt: on-chain laboratorieregister og testcertificering, en rigtig mailudbyder-adapter til modtagelse af laboratorierapporter, on-chain verificerede attester på profiler, den **trustless RewardVault** med governance-styret emission ([design](docs/REWARD-VAULT-PLAN.md)), det **offentlige tokensalg**, en opdatering af token-vesting for grundlæggerallokeringen samt DEX-likviditetsforsyning (i øjeblikket blokeret — det kræver mainnet-udrulninger af tokenen). Multinetværksudvidelse (Arbitrum, Avalanche og andre EVM-kæder) følger efter testnet-hærdning.

Fuld liste: [docs/ROADMAP.md](docs/ROADMAP.md).

## Kom i gang (udviklere)

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

Bidrag er velkomne — kode, fejlrapporter, funktionsforslag og forslag. Læs venligst [CONTRIBUTING.md](CONTRIBUTING.md) og vores [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md), før du begynder.

## Repositorier (mirrors)

| Mirror   | URL                                        |
| -------- | ------------------------------------------ |
| GitHub   | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg | https://codeberg.org/limitafternoon/Evolve |
| GitLab   | https://gitlab.com/evolve-group3/evolve    |

## Dokumentation

- [Hvad & hvorfor](docs/WHAT-AND-WHY.md) — problem, vision, kerneværdier
- [Sådan virker det](docs/HOW-IT-WORKS.md) — brugerflows, trin for trin
- [Arkitektur](docs/ARCHITECTURE.md) — monorepo, pakker, datastrømme
- [Tokenomics](docs/TOKENOMICS.md) — tokenmodel og forsyningsfordeling
- [RewardVault-planen](docs/REWARD-VAULT-PLAN.md) — trustless emission (planlagt)
- [Roadmap](docs/ROADMAP.md) — milepæle og aktuel status
- [FAQ](docs/FAQ.md) — ofte stillede spørgsmål
- [Wallet-guide](docs/WALLETS.md) — hvordan man opretter wallets og får donationsadresser

## Licens

Udgivet under [MIT-licensen](LICENSE).

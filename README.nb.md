[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)

# EVOLVE

**Dating, unnfangelse og verifisert helse — privat som standard, tillit der det teller.**

EVOLVE er en desentralisert plattform med åpen kildekode for folk som er ferdige med å overlevere telefonnummeret sitt, ansiktet sitt og sine mest intime helsedata til andres databaser. Du logger inn med din egen kryptolommebok — ingen telefon, ingen e-post, ingen KYC — og du kan få kontoen din tilbake gjennom en DNA-forpliktelse på blokkjeden. Helsedataene dine forblir dine: testresultater tolkes automatisk, individuelle patogenstatuser vises **aldri** for noen, og matching bygger utelukkende på anonyme kompatibilitetsvurderinger (Safe / Compatible / Caution / Risk). Chatten kjører peer-to-peer over libp2p og Nostr, med en HTTP-fallback for enkelhets skyld.

> **Status — plattformen fungerer i dag; mainnet og DEX er de neste stegene.**
> Dating, unnfangelse, helseverifisering, laboratorieflyten, P2P-chat, EVOLVE-tokenet og styringen er alle i drift. Fortsatt gjenstår: en **mainnet-utrulling og DEX-likviditet**, samt et **planlagt offentlig salg** (se [EVOLVE-tokenet](#evolve-tokenet-kun-testnett)).
> Smartkontraktene er utrullet **kun på Ethereum Sepolia testnett**. Ingenting her er finansiell rådgivning eller et investeringstilbud.

> **Synes du EVOLVE er nyttig? Støtt utviklingen — hver donasjon går til kode, laboratoriepartnerskap, hosting og oversettelse → [DONATE.md](DONATE.md).**

## Ingenting å frykte

EVOLVE ble bygget rundt spørsmålene folk faktisk stiller før de begynner å stole på en slik plattform.

| Bekymringen                                | Hva EVOLVE allerede gjør med den                                                                                                                                                |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| «Helsedataene mine vil lekke.»             | Individuelle patogenresultater vises **aldri** for noen — kun en anonym vurdering: Safe / Compatible / Caution / Risk.                                                          |
| «Bildene mine havner et sted.»             | Bilder er uskarpe som standard. Eieren gir en **15-sekunders** eller **permanent** visning — på forespørsel eller proaktivt. Å se er gratis.                                    |
| «Jeg må oppgi legitimasjon eller telefon.» | Innlogging med lommebok (SIWE). Ingen telefon, ingen e-post, ingen KYC. Gjenoppretting skjer gjennom en DNA-forpliktelse på blokkjeden.                                         |
| «Han eller hun lyver om å være frisk.»     | Resultatene er **laboratorieverifiserte** (QR + ansiktsgjenkjenning), og parets tester tas **under selve møtet** — ferske STD-resultater teller, DNA eldes ikke.                |
| «Tar noen pengene mine og forsvinner?»     | Unnfangelsen bygger på en reell, risikoutsatt innsats: en manns innskudd beveger seg bare når farskapet er **bekreftet**; ellers returneres det ganske enkelt til ham.          |
| «Er tokenet et pump-and-dump?»             | Ingen salg er aktivt i dag; koden er åpen (MIT); den ikke-sirkulerte reserven planlegges låst i et **hvelv som ikke kan tømmes**, som ikke en gang grunnleggeren kan ta ut fra. |
| «Kan plattformen stenges eller blokkeres?» | Peer-to-peer-meldinger først, desentralisert lagring (IPFS / Arweave), 18 EVM-nettverkskonfigurasjoner og ingen hardkodet domene.                                               |

## Hva & hvorfor

Tradisjonelle dating-apper ber deg bytte telefonnummeret, e-posten, bildene og intime helsedetaljer mot en sentral database — og deretter stole på den databasen for alltid. EVOLVE starter fra det motsatte utgangspunktet: **privat som standard, egenforvaltning og intet enkelt feilpunkt**.

- **Privat som standard** — helsedata eksponeres aldri; kun anonyme vurderinger.
- **Motstandskraft mot stenging** — P2P-meldinger først, desentralisert lagring, flernettverksdesign, ingen hardkodede domener.
- **Egenforvaltet identitet** — lommeboken din er innloggingen din; DNA-basert gjenoppretting i stedet for e-post eller telefon.
- **Ingen KYC-port** — ingen offentlig ID, telefon eller e-post kreves for å bruke plattformen.

Les hele begrunnelsen i [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md).

## Helse du faktisk kan stole på

- Last opp en STD-test som ren tekst eller PDF (uttrekk av tekstlag, med OCR-fallback for skanninger).
- Parseren kjenner 8 patogener: HIV-1/2, syfilis, klamydia, gonoré, HSV-1, HSV-2, hepatitt B, hepatitt C — i engelske, ukrainske og russiske rapportformater.
- **Individuell patogenstatus vises aldri for andre brukere.** Profiler viser alltid bare den anonyme vurderingen: **Safe / Compatible / Caution / Risk**.
- DNA-registreringer på blokkjeden (`DNAVerification.sol`) muliggjør gjenoppretting og verifisering.

### Partnerlaboratorier — bevis, ikke løfter

Gå inn til et partnerlaboratorium og vis QR-koden din. Laboratoriet skanner den, bekrefter identiteten din med **ansiktssammenligning** (slik at ingen andre kan hente resultatet ditt) og legger ved STD-rapporten — PDF, skanning eller tekst, selv med dårlig OCR. Resultatet signeres av et ekte laboratorium, ikke av deg, slik at andre ser et **verifisert faktum** i stedet for ditt ord. Og hver bekreftede verifisering utbetaler **1 EVOLVE til pasienten og 1 EVOLVE til laboratoriet** — begge sider har en grunn til å være ærlige. Individuelle patogener vises fortsatt aldri for noen.

## Finne noen

- Søkefiltre: «Hva søker du» (dating / unnfangelse / polyandrisk unnfangelse / STD-testing), «Hvem søker du» (menn, kvinner, par), kaskaderende valg land → by, «kan reise til landet ditt» med lister per land, hudfarge, testpreferanse, kun STD-kompatible.
- Onboarding-veiviser: alder (kan skjules), språk, bio, bilde.
- **P2P-chat** over libp2p (gossipsub) + Nostr, med HTTP-API-fallback.

## Unnfangelse

To måter å planlegge et barn på, og begge bygger på samme idé: ekte intensjon vises med en reell innsats i EVOLVE — aldri med løfter. En manns forpliktelse ligger i hans EvolveFund-innskudd (fra 15 EVOLVE, låst i minst 30 dager), og en kvinne kan sette sitt eget minimumsinnskudd for mennene som når frem til henne.

**Unnfangelse.** Kvinnen leder: hun inviterer en bestemt mann og nevner ham i en obligasjon. Han trenger et aktivt EvolveFund-innskudd; når begge bekrefter, låses det og nedtellingen starter. Svangerskap rapporteres mellom 14 og 30 dager etter bekreftelsen, og parets STD- og DNA-tester tas under selve møtet — ferske STD-resultater teller, DNA eldes ikke. Når farskapet er bekreftet, går mannens innskudd til kvinnen; hvis det ikke bekreftes, frigjøres innskuddet ganske enkelt tilbake til ham. Ingenting skifter eier før fakta er på plass.

**Polyandrisk unnfangelse.** Valget tilhører henne, og forblir privat. Hun åpner en økt som varer i 48 timer — uten eget innskudd (kun for omdømmets skyld kan hun legge til et, hvis hun ønsker det). Menn med aktivt innskudd kan bli med — opptil 50 — og bekrefte, noe som låser innsatsen deres. Fjorten dager etter at økten lukkes, velges faren. Han får innskuddet sitt tilbake pluss en belønning fra puljen: dobbelt så mye som innskuddet og 1 EVOLVE for hver annen deltaker. Mennene som ikke velges, taper innsatsen sin — 90 % til kvinnen, 10 % til den valgte faren. Hun risikerer ingenting og kan bare vinne; mennene setter innsatsen sin bak retten til å bli valgt.

## EVOLVE-tokenet (kun testnett)

- ERC-20, maksimalt tilbud **8,000,000,000 EVOLVE**. Adminhandlinger styres av en 48-timers `TimelockController`.
- **Planlagt fordeling av tilbudet** — designet for å sette nesten hele tilbudet i arbeid for brukerne, ikke for innsidere:

| Formål                                                    |        EVOLVE |
| --------------------------------------------------------- | ------------: |
| Grunnleggere og team (lønn / belønning)                   |    25,000,000 |
| DEX-reserve (fremtid)                                     |     4,000,000 |
| Offentlig salg (planlagt)                                 |     5,000,000 |
| Belønningsreserve — laboratorier, pasienter, mødre, fedre | 7,966,000,000 |

- **Planlagt offentlig salg** — 5,000,000 EVOLVE selges av appen til **$0.8 per stykk**, betalbart i enhver token appen støtter; inntektene finansierer utviklingen. _(Planlagt — ikke live ennå.)_
- **Trustless-emisjon (planlagt)** — belønningsreserven på ~7,966,000,000 skal låses i en `RewardVault` som ikke kan tømmes: den frigis bare gradvis gjennom belønninger til laboratorier, pasienter, mødre og fedre, og regelendringer krever en avstemming i styringen. Ikke en gang grunnleggeren kan ta ut fra den. Design: [docs/REWARD-VAULT-PLAN.md](docs/REWARD-VAULT-PLAN.md).
- **Emoji-gaveøkonomi** — en gave koster 1 EVOLVE, som fordeles proporsjonalt mellom eksisterende gaveeiere; en evigvarende inntektsmodell, og gaver er overførbare.
- **EvolveFund** — mannsstaking (min. 15 EVOLVE, 30-dagers lås) som teller i styringsvekten; kvinner bruker lommeboksaldoen sin.
- **Verifiseringsbelønninger** — 1 EVOLVE til den verifiserte brukeren og 1 EVOLVE til det bekreftende laboratoriet per STD-/DNA-verifisering (pluss en ratebegrenset kran (faucet)).
- **Styring** — stemmevekten kombinerer rekursivt omdømme (8 stemmer, dybde 3), andel barn/farskap, samt stakede eller holdte EVOLVE.
- **LayerZero OFT**-integrasjon for fremtidige flerkjedede EVOLVE-overføringer (avhengigheter på plass; ingenting er utrullet utenfor Sepolia ennå).

## Støtt prosjektet

EVOLVE er uavhengig og har åpen kildekode. Hvis det er nyttig for deg, kan du støtte utviklingen med en donasjon — hvert bidrag går til kode, laboratoriepartnerskap, hosting og oversettelse.

- **Donasjonsdetaljer (EVM, Monero og mer):** [DONATE.md](DONATE.md)
- **Flerspråklig donasjonsside (34 språk):** **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**

Et offentlig tokensalg står på veikartet, men er **ikke** live i dag. Donasjoner er gaver som støtter utvikling av åpen kildekode og gir ingen rett til tokens, egenkapital, avkastning eller fortjeneste. Gi bare det du har råd til å miste.

## Arkitektur & teknologistabel

Monorepo administrert med npm workspaces + Turborepo:

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

Viktige smartkontrakter: `EVOLVE.sol` (ERC-20), `ProfileNFT.sol` (ERC-721), `TrustScore.sol`, `Voting.sol`, `Evolve2Earn.sol` (emoji-gaver + belønninger), `Governance.sol`, `BondManager.sol` (unnfangelse og polyandrisk unnfangelse), `EvolveFund.sol`, `VerificationRegistry.sol`, `DNAVerification.sol`, ERC-4337 `SmartAccountFactory` + `Paymaster`, samt en OpenZeppelin-`TimelockController`.

Detaljer: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md)

## Veikart

Under arbeid: produksjonsklarhet for webappen. Planlagt: laboratorieregister på blokkjeden og testsertifisering, en ekte adapter for e-postleverandør for mottak av laboratorierapporter, verifiserte attestasjoner på blokkjeden i profiler, den **trustless RewardVault** med styringsstyrt emisjon ([design](docs/REWARD-VAULT-PLAN.md)), det **offentlige tokensalget**, oppdatering av token-vesting for grunnleggerallokeringen, samt tilrettelegging av DEX-likviditet (for øyeblikket blokkert — det krever tokenutrullinger på mainnet). Flernettverksutvidelse (Arbitrum, Avalanche og andre EVM-kjeder) følger etter at testnettet er herdet.

Full liste: [docs/ROADMAP.md](docs/ROADMAP.md).

## Kom i gang (utviklere)

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

## Bidra

Bidrag er velkomne — kode, feilrapporter, funksjonsforslag og forslag. Les [CONTRIBUTING.md](CONTRIBUTING.md) og vår [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) før du starter.

## Repositorier (speil)

| Speil    | URL                                        |
| -------- | ------------------------------------------ |
| GitHub   | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg | https://codeberg.org/limitafternoon/Evolve |
| GitLab   | https://gitlab.com/evolve-group3/evolve    |

## Dokumentasjon

- [Hva & hvorfor](docs/WHAT-AND-WHY.md) — problem, visjon, kjerneverdier
- [Slik fungerer det](docs/HOW-IT-WORKS.md) — brukerflyter, steg for steg
- [Arkitektur](docs/ARCHITECTURE.md) — monorepo, pakker, dataflyter
- [Tokenomics](docs/TOKENOMICS.md) — tokenmodell og fordeling av tilbudet
- [RewardVault-planen](docs/REWARD-VAULT-PLAN.md) — trustless-emisjon (planlagt)
- [Veikart](docs/ROADMAP.md) — milepæler og nåværende status
- [FAQ](docs/FAQ.md) — ofte stilte spørsmål
- [Lommebokguide](docs/WALLETS.md) — hvordan du oppretter lommebøker og får donasjonsadresser

## Lisens

Lisensiert under [MIT-lisensen](LICENSE).

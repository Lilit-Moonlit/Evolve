[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)
<!-- evolve-readme-sync: 3796750887b0bd65 -->

# EVOLVE

**Dating, unnfangelse og verifisert helse — privat som standard, tillit der det teller.**

EVOLVE er en desentralisert plattform med åpen kildekode for folk som er ferdige med å overlevere telefonnummeret sitt, ansiktet sitt og sine mest intime helsedata til andres databaser. Du logger inn med din egen kryptolommebok — ingen telefon, ingen e-post, ingen KYC — og du kan få kontoen din tilbake gjennom en DNA-forpliktelse på blokkjeden. Helsedataene dine forblir dine: testresultater tolkes automatisk, individuelle patogenstatuser vises **aldri** for noen, og matching bygger utelukkende på anonyme kompatibilitetsvurderinger (Safe / Compatible / Caution / Risk). Chatten kjører peer-to-peer over libp2p og Nostr, med en HTTP-fallback for enkelhets skyld. Gaver og overføringer er på vei mot full konfidensialitet: avsender-private gaver finnes allerede i dag, og en skjermet Railgun-lommebok og en Aztec zero-knowledge-prototype står på veikartet (se [Personvern og konfidensielle transaksjoner](#personvern-og-konfidensielle-transaksjoner)).

> **Status — demomodus, under aktiv utvikling.**
> Dating, unnfangelse, helseverifisering, laboratorieflyten, P2P-chat, EVOLVE-tokenet og styringen er implementert og kjører i en **lokal demo** — appen er **ikke offentlig utrullet ennå**. Det som gjenstår: **utrulling på hovednettet og DEX-likviditet**, samt et **planlagt offentlig salg** (se [EVOLVE-tokenet](#evolve-tokenet-kun-testnett)).
> Smartkontraktene er utrullet **kun på Ethereum Sepolia testnett**. Ingenting her er finansiell rådgivning eller et investeringstilbud.

> **Synes du EVOLVE er nyttig? Støtt utviklingen — hver donasjon går til kode, laboratoriepartnerskap, hosting og oversettelse → [DONATE.md](DONATE.md).**

## Ingenting å frykte

EVOLVE ble bygget rundt spørsmålene folk faktisk stiller før de begynner å stole på en slik plattform.

| Bekymringen                                   | Hva EVOLVE allerede gjør med den                                                                                                                                                                                                   |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| «Helsedataene mine vil lekke.»                | Individuelle patogenresultater vises **aldri** for noen — kun en anonym vurdering: Safe / Compatible / Caution / Risk.                                                                                                             |
| «Bildene mine havner et sted.»                | Bilder sløres som standard. Eieren gir en **15-sekunders** eller **permanent** visning — på forespørsel eller proaktivt. Å se er gratis.                                                                                           |
| «Jeg må utlevere legitimasjon eller telefon.» | Innlogging med lommebok (SIWE). Ingen telefon, ingen e-post, ingen KYC. Gjenoppretting skjer gjennom en DNA-forpliktelse på blokkjeden.                                                                                            |
| «Han eller hun lyver om å være frisk.»        | Resultatene er **laboratorieverifiserte** (QR + ansiktsgjenkjenning), og parets tester tas **under selve møtet** — ferske STD-resultater teller, DNA eldes ikke.                                                                   |
| «Tar noen pengene mine og forsvinner?»        | Unnfangelsen bygger på en reell, risikoutsatt innsats: en manns innskudd beveger seg bare når farskapet er **bekreftet**; ellers returneres det ganske enkelt til ham.                                                             |
| «Er tokenet et pump-and-dump?»                | Koden er åpen (MIT); nesten hele mengden er reservert til brukerbelønninger, og reserven som ikke er satt i sirkulasjon, skal etter planen låses i et **hvelv som ikke kan tømmes** — som ikke engang grunnleggeren kan ta ut fra. |
| «Kan plattformen stenges eller blokkeres?»    | Peer-to-peer-meldinger først, desentralisert lagring (IPFS / Arweave), 18 EVM-nettverkskonfigurasjoner og ingen hardkodet domene.                                                                                                  |

## Hva & hvorfor

Tradisjonelle dating-apper ber deg bytte telefonnummeret, e-posten, bildene og de intime helsedetaljene dine mot en sentral database — og deretter stole på den databasen for alltid. EVOLVE starter fra det motsatte utgangspunktet: **personvern som standard, egenforvaltning og intet enkelt feilpunkt**.

- **Personvern som standard** — helsedata eksponeres aldri; kun anonyme vurderinger.
- **Motstandskraft mot stenging** — P2P-først-meldinger, desentralisert lagring, flernettverksdesign, ingen hardkodede domener.
- **Selvforvaltet identitet** — lommeboken din er innloggingen din; DNA-basert gjenoppretting i stedet for e-post eller telefon.
- **Ingen KYC-port** — ingen offentlig ID, telefon eller e-post kreves for å bruke plattformen.

Les hele begrunnelsen i [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md).

## Helse du faktisk kan stole på

- Last opp en STD-test som ren tekst eller PDF (uttrekk fra tekstlaget, med OCR-fallback for skanninger).
- Parseren kjenner 8 patogener: HIV-1/2, syfilis, klamydia, gonoré, HSV-1, HSV-2, hepatitt B, hepatitt C — i engelske, ukrainske og russiske rapportformater.
- **Individuell patogenstatus vises aldri for andre brukere.** Profilene viser bare den anonyme vurderingen: **Safe / Compatible / Caution / Risk**.
- DNA-register på blokkjeden (`DNAVerification.sol`) driver gjenoppretting og verifisering.

### Partnerlaboratorier — bevis, ikke løfter

Gå inn i et partnerlaboratorium og vis QR-koden din. Laboratoriet skanner den, bekrefter identiteten din med **ansiktsgjenkjenning** (slik at ingen andre kan hente resultatet ditt) og legger ved STD-rapporten — PDF, skanning eller tekst, selv en dårlig OCR. Resultatet signeres av et ekte laboratorium, ikke av deg, slik at andre ser et **verifisert faktum** i stedet for bare ditt ord. Og hver bekreftede verifisering utbetaler **1 EVOLVE til pasienten og 1 EVOLVE til laboratoriet** — begge parter har en grunn til å være ærlige. Individuelle patogener vises fortsatt aldri for noen.

## Å finne noen

- Søkefiltre: «Hva søker du» (dating / unnfangelse / polyandrisk unnfangelse / STD-testing), «Hvem søker du» (menn, kvinner, par), kaskaderende valg for land → by, «kan reise til landet ditt» med lister per land, hudfarge, testpreferanse, kun STD-kompatible.
- Introduksjonsveiviser: alder (kan skjules), språk, bio, bilde.
- **P2P-chat** over libp2p (gossipsub) + Nostr, med HTTP-API som fallback.

## Unnfangelse

To måter å planlegge et barn på, og begge hviler på samme idé: ekte intensjon vises med en ekte innsats i EVOLVE — aldri med løfter. En manns forpliktelse ligger i EvolveFund-innskuddet hans (fra 15 EVOLVE, låst i minst 30 dager), og en kvinne kan selv angi minimumsinnskudd for mennene som når frem til henne.

**Unnfangelse.** Kvinnen leder: hun inviterer en bestemt mann og navngir ham i et bånd. Han må ha et aktivt EvolveFund-innskudd; når begge bekrefter, låses det og nedtellingen starter. Svangerskap meldes mellom 14 og 30 dager etter bekreftelsen, og parets STD- og DNA-tester tas under selve møtet — ferske STD-resultater teller, DNA eldes ikke. Når farskapet er bekreftet, går mannens innskudd til kvinnen; hvis det ikke bekreftes, frigjøres innskuddet rett og slett tilbake til ham. Ingenting skifter eier før fakta er avklart.

**Polyandrisk unnfangelse.** Valget tilhører henne, og det forblir privat. Hun åpner en økt som varer i 48 timer — uten eget innskudd (ønsker hun det, kan hun legge inn ett kun for omdømmets skyld). Menn med aktivt innskudd kan melde seg på — opptil 50 — og bekrefte, noe som låser innsatsen deres. Fjorten dager etter at økten lukkes, velges faren. Han får innskuddet sitt tilbake pluss en belønning fra puljen: dobbelt så mye som innskuddet og 1 EVOLVE for hver av de andre deltakerne. Mennene som ikke blir valgt, mister innsatsen — 90 % går til kvinnen og 10 % til den utvalgte faren. Hun risikerer ingenting og kan bare vinne; mennene setter innsatsen sin på spill for retten til å bli valgt.

## Personvern og konfidensielle transaksjoner

Personvern er standarden — og EVOLVE bygger et veikart mot fullt konfidensielle overføringer på blokkjeden.

- **Private gaver** — send en rose 🌹 eller en kaktus 🌵 (1 EVOLVE) og velg hvem som kan se at det var deg: _offentlig_, _anonym overfor alle unntatt mottakeren_ eller _helt anonym_. I de anonyme modusene sendes gaven som en engangskupong som mottakeren innløser med sin egen lommebok, slik at avsenderen aldri dukker opp på blokkjeden. (Avsenderanonymiteten i dag holder bare mot en tilfeldig observatør: finansieringstransaksjonen kan kobles sammen ut fra tid og beløp.)
- **Skjermet Railgun-lommebok** — en privat lommebok bak en funksjonsbryter (`VITE_RAILGUN_ENABLED`, av som standard) som skjuler beløp og adresser ved hjelp av Railguns aktive zero-knowledge-pool. Dette er veien til ekte avsenderanonymitet.
- **Aztec-prototype** — samme logikk for private overføringer og private bånd, uttrykt som zero-knowledge Noir-kretser og holdt bak en eksplisitt sperre til Aztec er produksjonsklar. Se [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md).
- **To-lommeboksmodellen** — en offentlig innsatslommebok deltar i styringen; en privat skjermet lommebok er bevisst **ekskludert** fra styringsvekten, slik at personvern og stemmemakt holdes adskilt.

Detaljer: [docs/RAILGUN-INTEGRATION.md](docs/RAILGUN-INTEGRATION.md) · [docs/SHIELDED-STAKES-DESIGN.md](docs/SHIELDED-STAKES-DESIGN.md) · [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md).

## EVOLVE-tokenet (kun testnett)

- ERC-20, maksimal mengde **8,000,000,000 EVOLVE**. Administrative handlinger styres av en `TimelockController` med 48 timers forsinkelse.
- **Planlagt fordeling av mengden** — laget for å sette nesten hele mengden i arbeid for brukerne, ikke for insiderne:

| Formål                                           |        EVOLVE |
| ------------------------------------------------ | ------------: |
| Grunnleggere og team (lønn / belønning)          |    25,000,000 |
| DEX-reserve (fremtidig)                          |     4,000,000 |
| Offentlig salg (planlagt)                        |     5,000,000 |
| Belønningsreserve — lab, pasienter, mødre, fedre | 7,966,000,000 |

- **Planlagt offentlig salg** — 5,000,000 EVOLVE solgt av appen til **$0.8 per stykk**, betalbart med enhver token appen støtter; inntektene finansierer utviklingen. _(Planlagt — ikke lansert ennå.)_
- **Trustless emisjon (planlagt)** — belønningsreserven på ~7,966,000,000 skal låses i et `RewardVault` som ikke kan tømmes: den frigjøres bare gradvis gjennom belønninger til laboratorier, pasienter, mødre og fedre, og regelendringer krever en avstemming i styringen. Ikke engang grunnleggeren kan ta ut midlene. Design: [docs/REWARD-VAULT-PLAN.md](docs/REWARD-VAULT-PLAN.md).
- **Emoji-gaveøkonomi** — en gave koster 1 EVOLVE og fordeles proporsjonalt blant eksisterende gaveeiere; en evigvarende inntektsmodell, og gavene er overførbare.
- **EvolveFund** — staking for menn (min 15 EVOLVE, 30 dagers lås) som teller i styringsvekten; kvinner bruker saldoen i lommeboken sin.
- **Verifiseringsbelønninger** — 1 EVOLVE til den verifiserte brukeren og 1 EVOLVE til det bekreftende laboratoriet per STD/DNA-verifisering (i tillegg en ratebegrenset faucet).
- **Styring** — stemmevekten kombinerer rekursivt omdømme (8 stemmer, dybde 3), andel barn/farskap samt EVOLVE som er staket eller holdes.
- **LayerZero OFT**-integrasjon for fremtidige EVOLVE-overføringer på tvers av kjeder (avhengighetene er på plass; ingenting er utrullet utover Sepolia ennå).

## Støtt prosjektet

EVOLVE er uavhengig og basert på åpen kildekode. Hvis det er nyttig for deg, kan du støtte utviklingen med en donasjon — hvert bidrag går til kode, laboratoriepartnerskap, hosting og oversettelse.

- **Donasjonsdetaljer (EVM, Monero med mer):** [DONATE.md](DONATE.md)
- **Flerspråklig donasjonsside (34 språk):** **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**

Et offentlig tokensalg er **planlagt** — 5,000,000 EVOLVE, solgt av appen (se [EVOLVE-tokenet](#evolve-tokenet-kun-testnett)). Donasjoner er gaver som støtter utvikling av åpen kildekode, og gir ingen rett til tokens, eierandeler, avkastning eller fortjeneste. Gi bare det du har råd til å miste.

## Arkitektur og teknologistabel

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

Viktige smartkontrakter: `EVOLVE.sol` (ERC-20), `ProfileNFT.sol` (ERC-721), `TrustScore.sol`, `Voting.sol`, `Evolve2Earn.sol` (emoji-gaver + belønninger), `Governance.sol`, `BondManager.sol` (unnfangelse og polyandrisk unnfangelse), `EvolveFund.sol`, `VerificationRegistry.sol`, `DNAVerification.sol`, ERC-4337 `SmartAccountFactory` + `Paymaster` samt en OpenZeppelin `TimelockController`.

Detaljer: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md)

## Veikart

Under arbeid: produksjonsberedskap i webappen. Planlagt: laboratorieregister og testsertifisering på blokkjeden, en ekte adapter for e-postleverandører for mottak av laboratorierapporter, verifiserte attestasjoner på blokkjeden på profilene, **trustless RewardVault** med emisjon styrt av styringen ([design](docs/REWARD-VAULT-PLAN.md)), **det offentlige tokensalget**, oppdatert token-vesting for grunnleggerallokeringen og forsyning av DEX-likviditet (foreløpig blokkert — det krever tokenutrullinger på hovednettet). På personvernsiden er avsender-private gaver ferdigstilt, mens den skjermede Railgun-lommeboken og migreringen av private Aztec-bånd forblir bak sperrene som kontrolleres i [docs/ROADMAP.md](docs/ROADMAP.md) og [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md). Utvidelse til flere nettverk (Arbitrum, Avalanche og andre EVM-kjeder) følger etter at testnettet er herdet.

Fullstendig liste: [docs/ROADMAP.md](docs/ROADMAP.md).

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

Bidrag er velkomne — kode, feilrapporter, funksjonsforslag og forslag. Vennligst les [CONTRIBUTING.md](CONTRIBUTING.md) og vår [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) før du begynner.

## Kodelager (speil)

| Speil    | URL                                        |
| -------- | ------------------------------------------ |
| GitHub   | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg | https://codeberg.org/limitafternoon/Evolve |
| GitLab   | https://gitlab.com/evolve-group3/evolve    |

## Dokumentasjon

- [Hva og hvorfor](docs/WHAT-AND-WHY.md) — problem, visjon, kjerneverdier
- [Slik fungerer det](docs/HOW-IT-WORKS.md) — brukerflyt, steg for steg
- [Arkitektur](docs/ARCHITECTURE.md) — monorepo, pakker, dataflyt
- [Tokenomics](docs/TOKENOMICS.md) — tokenmodell og fordeling av mengden
- [RewardVault-planen](docs/REWARD-VAULT-PLAN.md) — trustless emisjon (planlagt)
- [Railgun-integrasjon](docs/RAILGUN-INTEGRATION.md) — integrasjonsstudie for skjermet lommebok
- [Skjermede innskudd](docs/SHIELDED-STAKES-DESIGN.md) — private innskudd for unnfangelse (design)
- [Aztec-prototype](docs/AZTEC-PROTOTYPE.md) — ZK private overføringer og bånd (forskning)
- [Veikart](docs/ROADMAP.md) — milepæler og nåværende status
- [FAQ](docs/FAQ.md) — ofte stilte spørsmål
- [Lommebokguide](docs/WALLETS.md) — hvordan du oppretter lommebøker og finner donasjonsadresser

## Lisens

Utgitt under [MIT-lisensen](LICENSE).

[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)

# EVOLVE

**Dating, unnfangelse og helseverifikasjon — privat som standard, verifisert der det betyr noe.**

EVOLVE er en åpen kildekode-basert, desentralisert plattform for verifiserbare intime forbindelser: dating, unnfangelse og anonym STD/DNA-kompatibilitet. Du logger inn med din egen krypto-lommebok (Sign-In with Ethereum) — intet telefonnummer, ingen e-post, ingen KYC — og du kan gjenopprette kontoen din gjennom en DNA-forpliktelse på kjeden. Helsedataene dine forblir dine: labresultater tolkes automatisk, status for enkelte patogener vises **aldri** for noen, og matching bygger utelukkende på anonyme kompatibilitetsvurderinger (Safe / Compatible / Caution / Risk). Chatten kjører peer-to-peer over libp2p og Nostr, med en HTTP-fallback for enkelhetens skyld, og appen leveres med en lettvektig offentlig «Safety Mode»-fasade samt en frittstående Companion Mode for evaluering av STD-testresultater.

> **Status: tidlig alfa.** EVOLVE er under aktiv utvikling og er ikke et ferdig produkt.
> Smarte kontrakter er distribuert **kun på Ethereum Sepolia-testnettet**.
> Det finnes **ingen mainnet-distribusjon, ingen DEX, ingen likviditet og intet offentlig tokensalg** — og ingenting av dette er lovet.
> Funksjoner kan endres eller gå i stykker når som helst. Ingenting her er finansiell rådgivning eller et investeringstilbud.

## Hva & hvorfor

Tradisjonelle datingplattformer ber deg om å overlevere telefonnummeret ditt, e-posten din, bilder og intime helsedetaljer til en sentral database. EVOLVE tar utgangspunkt i det motsatte: personvern som standard, selvforvaltning (self-custody) og intet sentralt feilpunkt. Kjeneverdier:

- **Personvern som standard** — helsedata eksponeres aldri; kun anonyme vurderinger.
- **Motstandskraft mot utestenging** — P2P-først-meldinger, desentralisert lagring (IPFS / Arweave), flernettverksdesign, ingen hardkodede domener.
- **Self-custodial identitet** — lommeboken din er innloggingen din; DNA-basert gjenoppretting i stedet for e-post/telefon.
- **Ingen KYC-port** — hverken offentlig ID, telefon eller e-post kreves for å bruke plattformen.

Les hele begrunnelsen i [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md) (på engelsk).

## Nøkkelfunksjoner

### Identitet & personvern

- **SIWE-innlogging med lommebok** (MetaMask og andre EVM-lommebøker) — nødutgangen som motstår sensur.
- **DNA-gjenoppretting av konto** — DNA-testresultatet ditt hashas (SHA-256, forpliktet på kjeden som `bytes32`) og kan gjenopprette tilgangen uten telefon eller e-post.
- **Account Abstraction (ERC-4337)** — smarte kontoer og en paymaster for gassløs onboarding; SIWE forblir alltid tilgjengelig.

### Anonym helsekompatibilitet

- Last opp STD-testresultater som rå tekst eller PDF (tekstlaguttrekk med OCR-fallback for skannede sider).
- Parseren gjenkjenner 8 patogener: HIV-1/2, syfilis, klamydia, gonoré, HSV-1, HSV-2, hepatitt B, hepatitt C (engelske, ukrainske og russiske rapportformater).
- **Status for enkelte patogener vises aldri for andre brukere.** Profiler viser kun en anonym vurdering: **Safe / Compatible / Caution / Risk**.
- DNA-verifiseringsoppføringer på kjeden (`DNAVerification.sol`) driver gjenopprettings- og verifiseringsflyter.

### Profiler, søk & kommunikasjon

- Søkefiltre: «Hva søker du» (dating / unnfangelse / polyandrisk unnfangelse / STD-testing), «Hvem søker du» (menn, kvinner, par), kaskaderende land → by-valg, «kan reise til landet ditt» med lister per land, hudfarge, testpreferanse, kun STD-kompatible.
- Onboarding-veiviser: alder (kan skjules), språk, bio, bilde.
- **Bilde-personvern**: bilder er uskarpe som standard; eieren gir 15-sekunders eller permanente visninger — proaktivt eller på forespørsel. Det er gratis å se.
- **P2P-chat** over libp2p (gossipsub) + Nostr, med et HTTP-API-fallback.

### Unnfangelsesmoduser

- **Modus 2 — Pregnancy Bond**: en kvinne oppretter en bond, en mann staker EVOLVE (≥ 100 i den nåværende testnet-builden), begge bekrefter; etter en bekreftet graviditet og fastslått farskap overføres staken til kvinnen.
- **Modus 3 — Cryptic Choice**: en kvinne åpner en 48-timers økt, menn blir med ved å stake; hun velger faren — hans stake returneres, de øvrige: 90 % til henne / 10 % til den valgte faren.

### Laboratorier & verifikasjon

- **Partnerflyt for laboratorier**: laboratorier registrerer seg som partnere, verifiserer pasienter via QR-kode og ansiktsgjenkjenning og legger ved STD-rapporter (PDF/tekst med OCR-uttrekk).
- **Companion Mode**: frittstående flyt for å evaluere STD-testresultater uten å bli med på datingplattformen.
- **Safety Mode** (`VITE_PRODUCT_MODE=safety`): en begrenset offentlig fasade (STD-status, offentlige profillenker, kompatibilitetskontroller) som fortsatt fungerer selv om dating-/unnfangelsesfunksjoner blir begrenset i en jurisdiksjon eller en appbutikk.

### EVOLVE-token (kun testnet)

- ERC-20, maksimal mengde 8 000 000 000 EVOLVE, administratorhandlinger styres av en 48-timers TimelockController.
- **Emoji-gaveøkonomi**: en gave koster 1 EVOLVE, som fordeles proporsjonalt mellom eksisterende gaveeiere — en evig inntektsmodell for innehavere; gaver er overdragbare.
- **EvolveFund**: mannlige stakes (min. 15 EVOLVE, 30 dagers lås) som teller med i governance-vekten; kvinner bruker lommeboksaldoen sin.
- **Verifiseringsbelønninger**: 1 EVOLVE til den verifiserte brukeren og 1 EVOLVE til det bekreftende laboratoriet ved STD/DNA-verifisering (pluss en ratebegrenset test-faucet).
- Governance-stemmevekten kombinerer rekursivt omdømme (8 stemmer, dybde 3), andelen barn/farskap samt stakede eller holdte EVOLVE.
- **LayerZero-OFT**-integrasjon for fremtidige flernettverksoverføringer av EVOLVE (avhengigheter på plass; ingenting distribuert utenfor Sepolia ennå).

### Plattform

- Webapp (PWA-installerbar) og mobilapp bygget i Expo/React Native.
- Grensesnittet er oversatt til **34 språk**.
- Flernettverksklar: 18 EVM-nettverkskonfigurasjoner (Arbitrum og Avalanche er de planlagte primære L2-nettverkene — **ikke distribuert ennå**).

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

Viktige smarte kontrakter: `EVOLVE.sol` (ERC-20), `ProfileNFT.sol` (ERC-721), `TrustScore.sol`, `Voting.sol`, `Evolve2Earn.sol` (emoji-gaver + belønninger), `Governance.sol`, `BondManager.sol` (modus 2 & 3), `EvolveFund.sol`, `VerificationRegistry.sol`, `DNAVerification.sol`, ERC-4337 `SmartAccountFactory` + `Paymaster` samt en OpenZeppelin-`TimelockController`.

Detaljer: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md) (på engelsk).

## Roadmap

Pågår: produksjonsberedskap for webappen. Planlagt: laboratorieregister og testsertifisering på kjeden, en ekte adapter for e-postleverandør for mottak av labrapporter, verifiserte attester på kjeden på profiler, oppdatering av token-vesting for grunnlegger-/utvikler-allokeringer, DEX-likviditetsforsyning (for øyeblikket blokkert — krever mainnet-distribusjoner av tokenen). Flernettverksutvidelse (Arbitrum, Avalanche og andre EVM-kjeder) følger etter herding på testnettet.

Fullstendig liste: [docs/ROADMAP.md](docs/ROADMAP.md) (på engelsk).

## Kom i gang (utviklere)

Krav: **Node.js 20+** og npm 10.x.

```bash
# Klone og installere alle workspaces
git clone https://github.com/Lilit-Moonlit/Evolve.git
cd Evolve
npm install

# Webapp (Vite-utviklingsserver på http://localhost:3000)
cd apps/web
npm run dev
npm test                # vitest-suite

# Smarte kontrakter
cd packages/contracts
npm run compile         # hardhat compile
npm test                # hardhat-testsuite
npm run deploy:local    # distribuer alle kontrakter til et in-process Hardhat-nettverk
```

## Bidra

Bidrag er velkomne — kode, feilrapporter, funksjonsforslag og forslag. Les [CONTRIBUTING.md](CONTRIBUTING.md) og vår [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) før du begynner.

## Støtt prosjektet

Hvis du synes EVOLVE er nyttig, kan du støtte utviklingen med en donasjon — detaljer i [DONATE.md](DONATE.md). Foretrekker du en nettside? Bruk den flerspråklige donasjonssiden (34 språk): **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**.

**Det finnes ingen tokensalg, og det kommer aldri til å bli noe.** Man kan ikke «investere» i EVOLVE-tokens; donasjoner er gaver for å støtte utvikling med åpen kildekode og gir giveren ingen rett til tokens, egenkapital, avkastning eller noe økonomisk krav.

## Repositories (speil)

| Speil    | URL                                        |
| -------- | ------------------------------------------ |
| GitHub   | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg | https://codeberg.org/limitafternoon/Evolve |
| GitLab   | https://gitlab.com/evolve-group3/evolve    |

## Dokumentasjon

- [Hva & hvorfor](docs/WHAT-AND-WHY.md) — problem, visjon, kjeneverdier (engelsk)
- [Slik fungerer det](docs/HOW-IT-WORKS.md) — brukerflyter, trinn for trinn (engelsk)
- [Arkitektur](docs/ARCHITECTURE.md) — monorepo, pakker, dataflyter (engelsk)
- [Tokenomics](docs/TOKENOMICS.md) — tokenmodell og fordeling av mengden (engelsk)
- [Roadmap](docs/ROADMAP.md) — milepæler og nåværende status (engelsk)
- [FAQ](docs/FAQ.md) — ofte stilte spørsmål (engelsk)
- [Lommebokguide](docs/WALLETS.md) — hvordan man oppretter lommebøker og får donasjonsadresser (engelsk)

## Lisens

Lisensiert under [MIT-lisensen](LICENSE).

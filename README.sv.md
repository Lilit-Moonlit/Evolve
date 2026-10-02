[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)

# EVOLVE

**Dejting, befruktning och hälsoverifiering — privat som standard, verifierat där det spelar roll.**

EVOLVE är en plattform med öppen källkod, decentraliserad, för verifierbara intima relationer: dejting, befruktning och anonym STD/DNA-kompatibilitet. Du loggar in med din egen krypto-plånbok (Sign-In with Ethereum) — inget telefonnummer, ingen e-post, ingen KYC — och du kan återställa ditt konto via ett on-chain DNA-åtagande. Hälsodata förblir din: labresultat tolkas automatiskt, status för enskilda patogener visas **aldrig** för någon, och matchning bygger enbart på anonyma kompatibilitetsutlåtanden (Safe / Compatible / Caution / Risk). Chatten körs peer-to-peer över libp2p och Nostr, med ett HTTP-fallback för bekvämlighetens skull, och appen levereras med en lättviktig offentlig ”Safety Mode”-fasad samt ett fristående Companion Mode för utvärdering av STD-testresultat.

> **Status: tidig alfa.** EVOLVE är under aktiv utveckling och är inte en färdig produkt.
> Smarta kontrakt är driftsatta **endast på Ethereum Sepolia-testnet**.
> Det finns **ingen mainnet-distribution, ingen DEX, ingen likviditet och ingen offentlig tokenförsäljning** — och inget sådant utlovas.
> Funktioner kan ändras eller gå sönder när som helst. Inget här är finansiell rådgivning eller ett investeringserbjudande.

## Vad & varför

Traditionella dejtingplattformar ber dig lämna över ditt telefonnummer, din e-post, foton och intima hälsouppgifter till en central databas. EVOLVE utgår från det motsatta antagandet: integritet som standard, självförvaring (self-custody) och ingen central felpunkt. Kärnvärden:

- **Integritet som standard** — hälsodata exponeras aldrig; endast anonyma utlåtanden.
- **Motståndskraft mot förbud** — P2P-först-meddelanden, decentraliserad lagring (IPFS / Arweave), flernätverksdesign, inga hårdkodade domäner.
- **Self-custodial identitet** — din plånbok är din inloggning; DNA-baserad återställning i stället för e-post/telefon.
- **Ingen KYC-grind** — ingen myndighetslegitimation, telefon eller e-post krävs för att använda plattformen.

Läs hela motiveringen i [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md) (på engelska).

## Nyckelfunktioner

### Identitet & integritet

- **SIWE-inloggning med plånbok** (MetaMask och andra EVM-plånböcker) — den censurresistenta nödutgången.
- **DNA-kontoåterställning** — ditt DNA-testresultat hashas (SHA-256, registrerat on-chain som `bytes32`) och kan återställa åtkomsten utan telefon eller e-post.
- **Account Abstraction (ERC-4337)** — smarta konton och en paymaster för gaslös onboarding; SIWE förblir alltid tillgängligt.

### Anonym hälsokompatibilitet

- Ladda upp STD-testresultat som rå text eller PDF (textlagsextraktion med OCR-fallback för skannade sidor).
- Parsern känner igen 8 patogener: HIV-1/2, syfilis, klamydia, gonorré, HSV-1, HSV-2, hepatit B, hepatit C (engelska, ukrainska och ryska rapportformat).
- **Status för enskilda patogener visas aldrig för andra användare.** Profiler visar endast ett anonymt utlåtande: **Safe / Compatible / Caution / Risk**.
- DNA-verifieringsposter på kedjan (`DNAVerification.sol`) driver återställnings- och verifieringsflöden.

### Profiler, sökning & kommunikation

- Sökfilter: ”Vad söker du” (dejting / befruktning / polyandrisk befruktning / STD-testning), ”Vem söker du” (män, kvinnor, par), kaskaderande land → stad-val, ”kan resa till ditt land” med landspecifika listor, hudfärg, testpreferens, endast STD-kompatibla.
- Onboarding-guide: ålder (kan döljas), språk, bio, foto.
- **Fotointegritet**: foton är suddiga som standard; ägaren beviljar 15-sekunders eller permanenta visningar — proaktivt eller på begäran. Att titta är gratis.
- **P2P-chatt** över libp2p (gossipsub) + Nostr, med ett HTTP-API-fallback.

### Befruktningslägen

- **Läge 2 — Pregnancy Bond**: en kvinna skapar en bond, en man stakar EVOLVE (≥ 100 i den nuvarande testnet-builden), båda bekräftar; efter en bekräftad graviditet och fastställt faderskap överförs staken till kvinnan.
- **Läge 3 — Cryptic Choice**: en kvinna öppnar en 48-timmarssession, män går med genom att staka; hon väljer fadern — hans stake återbetalas, de övriga: 90 % till henne / 10 % till den valde fadern.

### Laboratorier & verifiering

- **Partnerflöde för laboratorier**: laboratorier registrerar sig som partner, verifierar patienter via QR-kod och ansiktsmatchning och bifogar STD-rapporter (PDF/text med OCR-extraktion).
- **Companion Mode**: fristående flöde för att utvärdera STD-testresultat utan att gå med på dejtingplattformen.
- **Safety Mode** (`VITE_PRODUCT_MODE=safety`): en begränsad offentlig fasad (STD-status, offentliga profillänkar, kompatibilitetskontroller) som fortsätter fungera även om dejting-/befruktningsfunktioner begränsas i en jurisdiktion eller en appbutik.

### EVOLVE-token (endast testnet)

- ERC-20, maximal tillgång 8 000 000 000 EVOLVE, administratörsåtgärder styrs av en 48-timmars TimelockController.
- **Emoji-presentekonomi**: en present kostar 1 EVOLVE, som fördelas proportionellt bland befintliga presentägare — en evig intäktsmodell för innehavare; presenter är överförbara.
- **EvolveFund**: manlig staking (min. 15 EVOLVE, 30 dagars lås) som räknas in i governance-vikten; kvinnor använder sin plånbokssaldo.
- **Verifieringsbelöningar**: 1 EVOLVE till den verifierade användaren och 1 EVOLVE till det bekräftande laboratoriet vid STD/DNA-verifiering (plus en hastighetsbegränsad test-faucet).
- Governance-röstvikten kombinerar rekursivt anseende (8 röster, djup 3), andelen barn/faderskap samt stakade eller hållna EVOLVE.
- **LayerZero-OFT**-integration för framtida flernätverksöverföringar av EVOLVE (beroenden på plats; inget driftsatt utanför Sepolia ännu).

### Plattform

- Webbapp (PWA-installationsbar) och mobilapp byggd i Expo/React Native.
- Gränssnittet är översatt till **34 språk**.
- Flernätverksklar: 18 EVM-nätverkskonfigurationer (Arbitrum och Avalanche är de planerade primära L2-nätverken — **ännu inte driftsatta**).

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

Viktiga smarta kontrakt: `EVOLVE.sol` (ERC-20), `ProfileNFT.sol` (ERC-721), `TrustScore.sol`, `Voting.sol`, `Evolve2Earn.sol` (emoji-presenter + belöningar), `Governance.sol`, `BondManager.sol` (lägena 2 & 3), `EvolveFund.sol`, `VerificationRegistry.sol`, `DNAVerification.sol`, ERC-4337 `SmartAccountFactory` + `Paymaster` samt en OpenZeppelin-`TimelockController`.

Detaljer: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md) (på engelska).

## Roadmap

Pågående: produktionsberedskap för webbappen. Planerat: laboratorieregister och testcertifiering på kedjan, en riktig adapter för e-postleverantör för mottagning av labrapporter, verifierade intyg på kedjan på profiler, uppdatering av token-vesting för grundar-/utvecklar-allokeringar, DEX-likviditetsförsörjning (för närvarande blockerat — kräver mainnet-distributioner av tokenen). Flernätverksutvidgning (Arbitrum, Avalanche och andra EVM-kedjor) följer efter härdningen på testnet.

Fullständig lista: [docs/ROADMAP.md](docs/ROADMAP.md) (på engelska).

## Kom igång (utvecklare)

Krav: **Node.js 20+** och npm 10.x.

```bash
# Klona och installera alla workspaces
git clone https://github.com/Lilit-Moonlit/Evolve.git
cd Evolve
npm install

# Webbapp (Vite-utvecklingsserver på http://localhost:3000)
cd apps/web
npm run dev
npm test                # vitest-suite

# Smarta kontrakt
cd packages/contracts
npm run compile         # hardhat compile
npm test                # hardhat-testsvit
npm run deploy:local    # distribuera alla kontrakt till ett in-process Hardhat-nätverk
```

## Bidra

Bidrag är välkomna — kod, felrapporter, funktionsförslag och förslag. Läs [CONTRIBUTING.md](CONTRIBUTING.md) och vår [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) innan du börjar.

## Stöd projektet

Om du tycker att EVOLVE är användbart kan du stödja utvecklingen med en donation — detaljer i [DONATE.md](DONATE.md). Föredrar du en webbsida? Använd den flerspråkiga donationssidan (34 språk): **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**.

**Det finns ingen tokenförsäljning och det kommer aldrig att bli någon.** Man kan inte ”investera” i EVOLVE-tokens; donationer är gåvor för att stödja utveckling med öppen källkod och ger donatorn ingen rätt till tokens, eget kapital, avkastning eller något ekonomiskt anspråk.

## Repositories (speglingar)

| Spegling | URL                                        |
| -------- | ------------------------------------------ |
| GitHub   | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg | https://codeberg.org/limitafternoon/Evolve |
| GitLab   | https://gitlab.com/evolve-group3/evolve    |

## Dokumentation

- [Vad & varför](docs/WHAT-AND-WHY.md) — problem, vision, kärnvärden (engelska)
- [Så fungerar det](docs/HOW-IT-WORKS.md) — användarflöden, steg för steg (engelska)
- [Arkitektur](docs/ARCHITECTURE.md) — monorepo, paket, dataflöden (engelska)
- [Tokenomics](docs/TOKENOMICS.md) — tokenmodell och fördelning av tillgången (engelska)
- [Roadmap](docs/ROADMAP.md) — milstolpar och aktuell status (engelska)
- [FAQ](docs/FAQ.md) — vanliga frågor (engelska)
- [Plånboksguide](docs/WALLETS.md) — hur man skapar plånböcker och får donationsadresser (engelska)

## Licens

Licensierad under [MIT-licensen](LICENSE).

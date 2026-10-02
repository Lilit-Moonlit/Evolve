[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)

# EVOLVE

**Iepazīšanās, apaugļošanās un veselības verifikācija — privāts pēc noklusējuma, verificēts tur, kur tas ir svarīgi.**

EVOLVE ir atvērtā koda, decentralizēta platforma verificējamiem intīmiem sakariem: iepazīšanās, apaugļošanās un anonīma STS/DNS saderība. Jūs pierakstāties ar savu kripto maku (Sign-In with Ethereum) — bez telefona numura, bez e-pasta, bez KYC — un varat atjaunot savu kontu, izmantojot ķēdē esošu DNS saistījumu. Veselības dati paliek jūsu īpašumā: laboratoriju rezultātus apstrādā automātiski, atsevišķu patogēnu statusus **nekad** nevienam nerāda, un saderības meklēšana balstās tikai uz anonīmiem saderības spriedumiem (Safe / Compatible / Caution / Risk). Sarunas notiek P2P režīmā caur libp2p un Nostr, ērtībai piedāvājot HTTP atbalsta variantu; lietotnē ir arī viegls publiskais "Safety Mode" fasādes režīms un atsevišķs Companion Mode STS testu rezultātu izvērtēšanai.

> **Statuss: agrīnas stadijas alfa.** EVOLVE tiek aktīvi izstrādāts un nav pabeigts produkts.
> Viedie līgumi ir izvietoti **tikai Ethereum Sepolia testnetā**.
> **Nav pamattīkla izvietojuma, nav DEX, nav likviditātes un nav publiskas tokenu pārdošanas** — un nekas no tā nav solīts.
> Funkcionalitāte jebkurā laikā var mainīties vai salūzt. Nekas šeit nav finanšu padoms vai investīciju piedāvājums.

## Kas & kāpēc

Tradicionālas iepazīšanās platformas prasa nodot savu telefona numuru, e-pastu, fotogrāfijas un intīmos veselības datus centrālai datubāzei. EVOLVE iziet no pretēja priekšnoteikuma: privātums pēc noklusējuma, pašpārvalde (self-custody) un nav centrāla avārijas punkta. Pamata vērtības:

- **Privātums pēc noklusējuma** — veselības dati nekad netiek atklāti; tikai anonīmi spriedumi.
- **Noturība pret aizliegumiem** — P2P prioritāra ziņapmaiņa, decentralizēta glabāšana (IPFS / Arweave), vairāku tīklu dizains, nekādu stingri ierakstītu domēnu.
- **Pašpārvaldīta identitāte** — jūsu maks ir jūsu pieteikšanās; DNS balstīta atjaunošana e-pasta/telefona vietā.
- **Nav KYC šķēršļa** — platformas izmantošanai nav nepieciešama valsts ID, telefons vai e-pasts.

Lasiet pilno pamatojumu [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md) (angliski).

## Galvenās funkcijas

### Identitāte un privātums

- **Pierakstīšanās ar maku caur SIWE** (MetaMask un citas EVM maki) — cenzūras izturīgs ārkārtas ceļš.
- **Konta atjaunošana ar DNS** — no jūsu DNS testa rezultāta tiek aprēķināts hašs (SHA-256, ķēdē iesniegts kā `bytes32`), un tas var atjaunot piekļuvi bez telefona vai e-pasta.
- **Account Abstraction (ERC-4337)** — viedie konti un paymaster bezmaksas (gasless) sākšanai; SIWE vienmēr paliek pieejams.

### Anonīma veselības saderība

- Augšupielādējiet STS testu rezultātus kā tekstu vai PDF (tekstslāņa izvilkšana, skenētām lapām OCR atbalsta variants).
- Parsētājs atpazīst 8 patogēnus: HIV-1/2, sifiliss, hlamīdijas, gonoreja, HSV-1, HSV-2, B hepatīts, C hepatīts (angļu, ukraiņu un krievu atskaišu formāti).
- **Atsevišķu patogēnu statuss citiem lietotājiem nekad netiek rādīts.** Profili rāda tikai anonīmu spriedumu: **Safe / Compatible / Caution / Risk**.
- Ķēdē esošie DNS verifikācijas ieraksti (`DNAVerification.sol`) nodrošina atjaunošanas un verifikācijas plūsmas.

### Profili, meklēšana un saziņa

- Meklēšanas filtri: "Ko jūs meklējat" (iepazīšanās / apaugļošanās / poliandriskā apaugļošanās / STS testēšana), "Kādu jūs meklējat" (vīrieši, sievietes, pāri), kaskādes valsts → pilsēta izvēles, "var ierasties jūsu valstī" ar valstu sarakstiem, ādas krāsa, testēšanas preference, tikai STS saderīgie.
- Ievadvednis: vecums (noslēpjams), valodas, apraksts, foto.
- **Foto privātums**: foto pēc noklusējuma ir izpludināti; īpašnieks piešķir 15 sekunžu vai pastāvīgas skatīšanās atļaujas — pats no sevis vai pēc pieprasījuma. Skatīšanās ir bezmaksas.
- **P2P sarunas** caur libp2p (gossipsub) + Nostr, ar HTTP API atbalsta variantu.

### Apaugļošanās režīmi

- **2. režīms — Pregnancy Bond**: sieviete izveido saistījumu, vīrietis ieliek EVOLVE likmē (≥ 100 pašreizējā testneta versijā), abi apstiprina; pēc apstiprinātas grūtniecības un tēvības likme pāriet sievietei.
- **3. režīms — Cryptic Choice**: sieviete atver 48 stundu sesiju, vīrieši pievienojas liekot likmes; viņa izvēlas tēvu — viņa likme tiek atgriezta, pārējie sadala: 90 % viņai / 10 % izvēlētajam tēvam.

### Laboratorijas un verifikācija

- **Laboratoriju partneru plūsma**: laboratorijas reģistrējas kā partneri, verificē pacientus ar QR kodu un sejas atbilstību un pievieno STS atskaites (PDF/teksts ar OCR izvilkšanu).
- **Companion Mode**: atsevišķa plūsma STS testu rezultātu izvērtēšanai bez pievienošanās iepazīšanās platformai.
- **Safety Mode** (`VITE_PRODUCT_MODE=safety`): ierobežota publiska fasāde (STS statuss, publiskas profila saites, saderības pārbaudes), kas turpina darboties pat tad, ja iepazīšanās/apaugļošanās funkcijas tiek ierobežotas kādā jurisdikcijā vai lietotņu veikalā.

### EVOLVE tokens (tikai testnetā)

- ERC-20, maksimālais daudzums 8 000 000 000 EVOLVE, administratora darbības aizsargā 48 stundu TimelockController.
- **Emocijzīmju dāvanu ekonomika**: dāvana maksā 1 EVOLVE, kas tiek sadalīts proporcionāli esošajiem dāvanu īpašniekiem — pastāvīgs ienākumu modelis turētājiem; dāvanas ir pārceļamas.
- **EvolveFund**: vīriešu staking (vismaz 15 EVOLVE, 30 dienu noslēgšana), kas tiek ieskaitīts pārvaldes svarā; sievietes izmanto sava maka atlikumu.
- **Verifikācijas atalgas**: 1 EVOLVE verificētam lietotājam un 1 EVOLVE apstiprinošai laboratorijai par STS/DNS verifikāciju (plus ierobežota apjoma testkrāns).
- Pārvaldes balsojuma svars apvieno rekursīvu reputāciju (8 balsis, dziļums 3), bērnu/tēvības daļu un stakingā liktos vai turētos EVOLVE.
- **LayerZero OFT** integrācija nākamajiem vairāku ķēžu EVOLVE pārvedumiem (atkarības sagatavotas; aiz Sepolijas vēl nekas nav izvietots).

### Platforma

- Tīmekļa lietotne (instalējama kā PWA) un Expo/React Native mobilā lietotne.
- Saskarne iztulkota **34 valodās**.
- Gatavība vairākiem tīkliem: 18 EVM tīklu konfigurāciju (Arbitrum un Avalanche ir plānotie primārie L2 — **vēl nav izvietoti**).

## Arhitektūra un tehnoloģiju steks

Monorepo, ko pārvalda ar npm workspaces + Turborepo:

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

Galvenie viedie līgumi: `EVOLVE.sol` (ERC-20), `ProfileNFT.sol` (ERC-721), `TrustScore.sol`, `Voting.sol`, `Evolve2Earn.sol` (emocijzīmju dāvanas + atalgas), `Governance.sol`, `BondManager.sol` (2. un 3. režīms), `EvolveFund.sol`, `VerificationRegistry.sol`, `DNAVerification.sol`, ERC-4337 `SmartAccountFactory` + `Paymaster`, kā arī OpenZeppelin `TimelockController`.

Detaļas: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md) (angliski).

## Ceļa karte

Notiek: tīmekļa lietotnes ražošanas gatavība. Plānots: ķēdē esošs laboratoriju reģistrs un testu sertificēšana, īsts pasta pakalpojumu sniedzēja adapters laboratorijas atskaišu saņemšanai, ķēdē verificēti apstiprinājumi profilos, tokenu vestingo atjauninājums dibinātāju/izstrādātāju alokācijām, DEX likviditātes nodrošināšana (pašlaik bloķēta — nepieciešami tokenu izvietojumi pamattīklā). Vairāku tīklu paplašināšanās (Arbitrum, Avalanche un citas EVM ķēdes) sekos pēc testneta nostiprināšanas.

Pilns saraksts: [docs/ROADMAP.md](docs/ROADMAP.md) (angliski).

## Sākšana (izstrādātājiem)

Prasības: **Node.js 20+** un npm 10.x.

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

## Piedalīšanās

Ieguldījumi ir laipni gaidīti — kods, kļūdu ziņojumi, funkcionalitātes priekšlikumi un priekšlikumi. Pirms sākšanas izlasiet [CONTRIBUTING.md](CONTRIBUTING.md) un mūsu [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Atbalstiet projektu

Ja EVOLVE šķiet noderīgs, varat atbalstīt izstrādi ar ziedojumu — detaļas [DONATE.md](DONATE.md). Vēlaties tīmekļa lapu? Izmantojiet daudzvalodu ziedojumu lapu (34 valodās): **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**.

**Tokenu pārdošanas nav un nebūs.** EVOLVE tokenos "investēt" nevar; ziedojumi ir dāvanas atvērtā koda izstrādes atbalstam un nesniedz ziedotājam tiesības uz tokeniem, kapitālu, atdevi vai jebkādām finansiālām prasībām.

## Repozitoriji (spoguļi)

| Spogulis | URL                                        |
| -------- | ------------------------------------------ |
| GitHub   | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg | https://codeberg.org/limitafternoon/Evolve |
| GitLab   | https://gitlab.com/evolve-group3/evolve    |

## Dokumentācija

- [Kas & kāpēc](docs/WHAT-AND-WHY.md) — problēma, vīzija, pamata vērtības (angliski)
- [Kā tas darbojas](docs/HOW-IT-WORKS.md) — lietotāju plūsmas soli pa solim (angliski)
- [Arhitektūra](docs/ARCHITECTURE.md) — monorepo, pakotnes, datu plūsmas (angliski)
- [Tokenomika](docs/TOKENOMICS.md) — tokena modelis un piedāvājuma sadale (angliski)
- [Ceļa karte](docs/ROADMAP.md) — atskaites punkti un pašreizējais statuss (angliski)
- [BUJ](docs/FAQ.md) — bieži uzdotie jautājumi (angliski)
- [Maku rokasgrāmata](docs/WALLETS.md) — kā izveidot makus un saņemt ziedojumu adreses (angliski)

## Licence

Licencēts saskaņā ar [MIT licenci](LICENSE).

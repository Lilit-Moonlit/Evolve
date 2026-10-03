[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)

# EVOLVE

**Iepazīšanās, ieņemšana un pārbaudīta veselība — privāti pēc noklusējuma, uzticami tur, kur tas ir svarīgi.**

EVOLVE ir atvērtā pirmkoda, decentralizēta platforma cilvēkiem, kuriem ir apnicis nodot savu tālruņa numuru, savu seju un savus visintīmākos veselības datus kāda cita datubāzē. Jūs piesakāties ar savu kripto maku — bez tālruņa, bez e-pasta, bez KYC — un varat atgūt savu kontu, izmantojot ķēdē esošu DNS saistību. Jūsu veselības dati paliek jūsu: testu rezultāti tiek apstrādāti automātiski, atsevišķu patogēnu statusi **nekad** netiek parādīti nevienam, un saskaņošana balstās tikai uz anonīmiem saderības spriedumiem (Droši / Saderīgi / Uzmanību / Risks). Tērzēšana darbojas vienādranga režīmā (peer-to-peer) caur libp2p un Nostr, ar HTTP rezerves variantu ērtībai.

> **Statuss — platforma darbojas jau tagad; galvenais tīkls (mainnet) un DEX ir nākamie.**
> Iepazīšanās, ieņemšana, veselības pārbaude, laboratorijas plūsma, P2P tērzēšana, EVOLVE marķieris un pārvaldība jau darbojas. Priekšā vēl: **galvenā tīkla izvietošana un DEX likviditāte**, kā arī **plānota publiskā pārdošana** (sk. [EVOLVE marķieris](#the-evolve-token-testnet-only)).
> Viedie līgumi ir izvietoti **tikai Ethereum Sepolia testa tīklā**. Nekas šeit nav finanšu padoms vai ieguldījumu piedāvājums.

> **EVOLVE noder? Atbalstiet izstrādi — katrs ziedojums iet uz kodu, laboratoriju partnerībām, hostingu un tulkojumiem → [DONATE.md](DONATE.md).**

## Nav no kā baidīties

EVOLVE tika veidots ap jautājumiem, ko cilvēki patiešām uzdod, pirms uzticas šādai platformai.

| Bažas                                    | Ko EVOLVE jau dara lietas labā                                                                                                                                                       |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| "Mani veselības dati noplūdīs."          | Atsevišķu patogēnu rezultāti **nekad** netiek parādīti nevienam — tikai anonīms spriedums: Droši / Saderīgi / Uzmanību / Risks.                                                      |
| "Mani foto nonāks kaut kur citur."       | Fotoattēli pēc noklusējuma ir aizmigloti. Īpašnieks piešķir **15 sekunžu** vai **pastāvīgu** skatījumu — pēc pieprasījuma vai proaktīvi. Skatīšanās ir bez maksas.                   |
| "Man būs jānodod ID vai tālrunis."       | Pieteikšanās ar maku (SIWE). Bez tālruņa, bez e-pasta, bez KYC. Atgūšana darbojas, izmantojot ķēdē esošu DNS saistību.                                                               |
| "Viņš vai viņa melo par veselību."       | Rezultātus **pārbauda laboratorija** (QR + sejas sakritība), un pāra testi tiek veikti **tikšanās laikā** — svarīgi ir svaigi STS rezultāti, DNS nenoveco.                           |
| "Vai kāds paņems manu naudu un pazudīs?" | Ieņemšana balstās uz reālu, riskam pakļautu likmi: vīrieša depozīts pārvietojas tikai tad, kad paternitāte ir **apstiprināta**; pretējā gadījumā tas vienkārši tiek atgriezts viņam. |
| "Vai marķieris nav pump-and-dump?"       | Šodien nav aktīvas pārdošanas; kods ir atvērts (MIT); neapgrozībā esošo rezervi plānots ieslēgt **neizsūknējamā glabātavā**, no kuras nevar izņemt pat dibinātājs.                   |
| "Vai platformu var slēgt vai aizliegt?"  | Pirmkārt vienādranga ziņojumapmaiņa, decentralizēta glabāšana (IPFS / Arweave), 18 EVM tīklu konfigurācijas un bez iekodēta domēna.                                                  |

## Kas un kāpēc

Tradicionālās iepazīšanās lietotnes lūdz jums apmainīt savu tālruņa numuru, e-pastu, fotoattēlus un intīmās veselības detaļas pret centrālu datubāzi — un pēc tam uzticēties šai datubāzei mūžīgi. EVOLVE sāk no pretējā pieņēmuma: **privātums pēc noklusējuma, pašglabāšana (self-custody) un bez viena kļūmes punkta**.

- **Privātums pēc noklusējuma** — veselības dati nekad netiek atklāti; tikai anonīmi spriedumi.
- **Noturība pret aizliegumiem** — P2P ziņojumapmaiņa vispirms, decentralizēta glabāšana, vairāku tīklu dizains, bez iekodētiem domēniem.
- **Pašglabāta identitāte** — jūsu maks ir jūsu pieteikšanās; atgūšana, izmantojot DNS, nevis e-pastu vai tālruni.
- **Bez KYC barjeras** — platformas lietošanai nav nepieciešams valsts ID, tālrunis vai e-pasts.

Pilns pamatojums: [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md).

## Veselība, kurai patiešām var uzticēties

- Augšupielādējiet STS testu kā neapstrādātu tekstu vai PDF (teksta slāņa ekstrakcija, ar OCR rezerves variantu skenējumiem).
- Parsētājs pazīst 8 patogēnus: HIV-1/2, sifiliss, hlamīdijas, gonoreja, HSV-1, HSV-2, B un C hepatīts — angļu, ukraiņu un krievu ziņojumu formātos.
- **Atsevišķa patogēna statuss nekad netiek parādīts citiem lietotājiem.** Profili vienmēr parāda tikai anonīmo spriedumu: **Droši / Saderīgi / Uzmanību / Risks**.
- Ķēdē esošie DNS ieraksti (`DNAVerification.sol`) nodrošina atgūšanu un pārbaudi.

### Partnerlaboratorijas — pierādījums, nevis solījumi

Ienāciet partnerlaboratorijā un parādiet savu QR kodu. Laboratorija to noskenē, apstiprina jūsu identitāti ar **sejas sakritību** (lai neviens cits nevarētu saņemt jūsu rezultātu) un pievieno STS ziņojumu — PDF, skenējumu vai tekstu, pat ar vāju OCR. Rezultātu paraksta īsta laboratorija, nevis jūs, tāpēc citi redz **pārbaudītu faktu**, nevis jūsu vārdus. Un katra apstiprināta pārbaude maksā **1 EVOLVE pacientam un 1 EVOLVE laboratorijai** — abām pusēm ir iemesls būt godīgām. Atsevišķie patogēni joprojām netiek parādīti nevienam.

## Kāda atrašana

- Meklēšanas filtri: "Ko jūs meklējat" (iepazīšanās / ieņemšana / poliandriska ieņemšana / STS testēšana), "Kuru jūs meklējat" (vīrieši, sievietes, pāri), kaskādes valsts → pilsēta izvēles, "var ierasties jūsu valstī" ar valstu sarakstiem, ādas krāsa, testēšanas izvēle, tikai STS saderīgi.
- Ievadapmācības vednis: vecums (slēpjams), valodas, bio, fotoattēls.
- **P2P tērzēšana** caur libp2p (gossipsub) + Nostr, ar HTTP API rezerves variantu.

## Ieņemšana

Divi veidi, kā plānot bērnu, un abi balstās uz vienu ideju: patiesu nodomu parāda ar reālu likmi EVOLVE — nekad ar solījumiem. Vīrieša saistības dzīvo viņa EvolveFund depozītā (no 15 EVOLVE, ieslēgts vismaz uz 30 dienām), un sieviete var noteikt savu minimālo depozītu vīriešiem, kuri nonāk pie viņas.

**Ieņemšana.** Sieviete vada: viņa uzaicina konkrētu vīrieti un nosauc viņu saistībā. Viņam nepieciešams aktīvs EvolveFund depozīts; kad abi apstiprina, tas tiek ieslēgts un sākas atskaitīšana. Grūtniecība tiek paziņota no 14 līdz 30 dienām pēc apstiprināšanas, un pāra STS un DNS testi tiek veikti pašā tikšanās reizē — svarīgi ir svaigi STS rezultāti, DNS nenoveco. Kad paternitāte ir apstiprināta, vīrieša depozīts pāriet sievietei; ja tā nav apstiprināta, depozīts vienkārši tiek atgriezts viņam. Nekas nemaina īpašnieku, kamēr fakti nav noskaidroti.

**Poliandriska ieņemšana.** Izvēle pieder viņai un paliek privāta. Viņa atver sesiju, kas ilgst 48 stundas — bez sava depozīta (viņa var pievienot vienu tikai reputācijai, ja vēlas). Vīrieši ar aktīvu depozītu var pievienoties — līdz 50 — un apstiprināt, kas ieslēdz viņu likmi. Četrpadsmit dienas pēc sesijas beigām tiek izvēlēts tēvs. Viņš saņem savu depozītu atpakaļ plus atlīdzību no fonda: divkāršu depozītu un 1 EVOLVE par katru citu dalībnieku. Vīrieši, kuri netiek izvēlēti, zaudē savu likmi — 90% sievietei, 10% izvēlētajam tēvam. Viņa neko neriskē un var tikai iegūt; vīrieši liek savu likmi aiz tiesībām tikt izvēlētiem.

## EVOLVE marķieris (tikai testa tīkls)

- ERC-20, maksimālā emisija **8,000,000,000 EVOLVE**. Administratora darbības ir ierobežotas ar 48 stundu `TimelockController`.
- **Plānotais emisijas sadalījums** — veidots tā, lai gandrīz visa emisija strādātu lietotājiem, nevis iekšējiem cilvēkiem:

| Mērķis                                                    |        EVOLVE |
| --------------------------------------------------------- | ------------: |
| Dibinātāji un komanda (alga / atlīdzība)                  |    25,000,000 |
| DEX rezerve (nākotnei)                                    |     4,000,000 |
| Publiskā pārdošana (plānota)                              |     5,000,000 |
| Atlīdzības rezerve — laboratorijas, pacienti, mātes, tēvi | 7,966,000,000 |

- **Plānotā publiskā pārdošana** — 5,000,000 EVOLVE, ko pārdod lietotne par **$0.8 katru**, maksājot jebkurā lietotnes atbalstītā marķierī; ieņēmumi finansē izstrādi. _(Plānota — vēl nav aktīva.)_
- **Bezuzticības emisija (plānota)** — ~7,966,000,000 atlīdzības rezerve tiks ieslēgta neizsūknējamā `RewardVault`: tā tiek atbrīvota tikai pakāpeniski, izmantojot laboratoriju, pacientu, māšu un tēvu atlīdzības, un noteikumu maiņa prasa pārvaldības balsojumu. Pat dibinātājs to nevar izņemt. Dizains: [docs/REWARD-VAULT-PLAN.md](docs/REWARD-VAULT-PLAN.md).
- **Emocijzīmju dāvanu ekonomika** — dāvana maksā 1 EVOLVE, kas proporcionāli tiek sadalīts starp esošajiem dāvanu īpašniekiem; mūžīgs ieņēmumu modelis, un dāvanas ir nododamas.
- **EvolveFund** — vīriešu likme (min 15 EVOLVE, 30 dienu ieslēgums), kas tiek ieskaitīta pārvaldības svarā; sievietes izmanto sava maka atlikumu.
- **Pārbaudes atlīdzības** — 1 EVOLVE pārbaudītajam lietotājam un 1 EVOLVE apstiprinošajai laboratorijai par katru STS/DNS pārbaudi (plus ierobežota ātruma krāns).
- **Pārvaldība** — balss svars apvieno rekursīvo reputāciju (8 balsis, dziļums 3), bērnu/tēva daļu un likto vai turēto EVOLVE.
- **LayerZero OFT** integrācija nākotnes multichain EVOLVE pārskaitījumiem (atkarības ir vietā; aiz Sepolia vēl nekas nav izvietots).

## Atbalstiet projektu

EVOLVE ir neatkarīgs un atvērtā pirmkoda. Ja tas jums noder, varat atbalstīt izstrādi ar ziedojumu — katrs ieguldījums iet uz kodu, laboratoriju partnerībām, hostingu un tulkojumiem.

- **Ziedojumu informācija (EVM, Monero un citi):** [DONATE.md](DONATE.md)
- **Daudzvalodu ziedojumu lapa (34 valodas):** **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**

Publiskā marķieru pārdošana ir ceļa kartē, bet **šodien** tā nav aktīva. Ziedojumi ir dāvanas, kas atbalsta atvērtā pirmkoda izstrādi, un nedod tiesības uz marķieriem, kapitāldaļām, ienākumiem vai peļņu. Lūdzu, ziedojiet tikai to, ko varat atļauties zaudēt.

## Arhitektūra un tehnoloģiju steks

Monorepo, kas pārvaldīts ar npm workspaces + Turborepo:

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

Galvenie viedie līgumi: `EVOLVE.sol` (ERC-20), `ProfileNFT.sol` (ERC-721), `TrustScore.sol`, `Voting.sol`, `Evolve2Earn.sol` (emocijzīmju dāvanas + atlīdzības), `Governance.sol`, `BondManager.sol` (ieņemšana un poliandriska ieņemšana), `EvolveFund.sol`, `VerificationRegistry.sol`, `DNAVerification.sol`, ERC-4337 `SmartAccountFactory` + `Paymaster`, un OpenZeppelin `TimelockController`.

Detaļas: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md)

## Ceļa karte

Darbā: tīmekļa lietotnes gatavība ražošanai. Plānots: ķēdē esošs laboratoriju reģistrs un testu sertifikācija, īsts pasta pakalpojumu adapteris laboratoriju ziņojumu saņemšanai, ķēdē pārbaudītas atestācijas profilos, **bezuzticības RewardVault** ar pārvaldības kontrolētu emisiju ([dizains](docs/REWARD-VAULT-PLAN.md)), **publiskā marķieru pārdošana**, marķieru vestinga atjauninājums dibinātāja sadalījumam un DEX likviditātes nodrošināšana (šobrīd bloķēta — nepieciešamas galvenā tīkla marķieru izvietošanas). Vairāku tīklu paplašināšanās (Arbitrum, Avalanche un citi EVM tīkli) seko pēc testa tīkla nostiprināšanas.

Pilns saraksts: [docs/ROADMAP.md](docs/ROADMAP.md).

## Darba sākšana (izstrādātājiem)

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

## Līdzdalība

Līdzdalība ir apsveicama — kods, kļūdu ziņojumi, funkciju ieteikumi un priekšlikumi. Lūdzu, izlasiet [CONTRIBUTING.md](CONTRIBUTING.md) un mūsu [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md), pirms sākat.

## Krātuves (spoguļi)

| Spogulis | URL                                        |
| -------- | ------------------------------------------ |
| GitHub   | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg | https://codeberg.org/limitafternoon/Evolve |
| GitLab   | https://gitlab.com/evolve-group3/evolve    |

## Dokumentācija

- [Kas un kāpēc](docs/WHAT-AND-WHY.md) — problēma, vīzija, pamatvērtības
- [Kā tas darbojas](docs/HOW-IT-WORKS.md) — lietotāja plūsmas, soli pa solim
- [Arhitektūra](docs/ARCHITECTURE.md) — monorepo, pakotnes, datu plūsmas
- [Tokenomika](docs/TOKENOMICS.md) — marķiera modelis un emisijas sadalījums
- [RewardVault plāns](docs/REWARD-VAULT-PLAN.md) — bezuzticības emisija (plānota)
- [Ceļa karte](docs/ROADMAP.md) — atskaites punkti un pašreizējais statuss
- [BUJ](docs/FAQ.md) — bieži uzdotie jautājumi
- [Maka ceļvedis](docs/WALLETS.md) — kā izveidot maku un iegūt ziedojumu adreses

## Licence

Licencēts saskaņā ar [MIT licenci](LICENSE).

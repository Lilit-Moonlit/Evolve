[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)
<!-- evolve-readme-sync: 3796750887b0bd65 -->

# EVOLVE

**Iepazīšanās, ieņemšana un pārbaudīta veselība — privāti pēc noklusējuma, uzticami tur, kur tas ir svarīgi.**

EVOLVE ir atvērtā pirmkoda, decentralizēta platforma cilvēkiem, kuriem ir apnicis nodot savu tālruņa numuru, savu seju un savus visintīmākos veselības datus kāda cita datubāzē. Jūs piesakāties ar savu kripto maku — bez tālruņa, bez e-pasta, bez KYC — un varat atgūt savu kontu, izmantojot ķēdē esošu DNS saistību. Jūsu veselības dati paliek jūsu: testu rezultāti tiek apstrādāti automātiski, atsevišķu patogēnu statusi **nekad** netiek parādīti nevienam, un saskaņošana balstās tikai uz anonīmiem saderības spriedumiem (Safe / Compatible / Caution / Risk). Tērzēšana darbojas vienādranga režīmā (peer-to-peer) caur libp2p un Nostr, ar HTTP rezerves variantu ērtībai. Dāvanas un pārskaitījumi virzās uz pilnīgu konfidencialitāti: privātas dāvanas jau darbojas, bet priekšā — aizsargāts Railgun maks un Aztec nulles zināšanu prototips (sk. [Privātums un konfidenciāli darījumi](#privātums--konfidenciāli-darījumi)).

> **Statuss — demo režīms, aktīva izstrāde.**
> Iepazīšanās, ieņemšana, veselības pārbaude, laboratorijas plūsma, P2P tērzēšana, EVOLVE marķieris un pārvaldība ir ieviesti un darbojas **vietējā demo** — lietotne **vēl nav publiski izvietota**. Priekšā vēl: **galvenā tīkla izvietošana un DEX likviditāte**, kā arī **plānota publiskā pārdošana** (sk. [EVOLVE marķieris](#evolve-marķieris-tikai-testtīkls)).
> Viedie līgumi ir izvietoti **tikai Ethereum Sepolia testa tīklā**. Nekas šeit nav finanšu padoms vai ieguldījumu piedāvājums.

> **EVOLVE jums noder? Atbalstiet izstrādi — katrs ziedojums iet kodam, laboratoriju partnerībām, mitināšanai un tulkojumiem → [DONATE.md](DONATE.md).**

## Nav ko baidīties

EVOLVE tika veidota ap jautājumiem, ko cilvēki patiešām uzdod pirms uzticēšanās šādai platformai.

| Bažas                                    | Ko EVOLVE jau dara lietas labā                                                                                                                                                                |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| «Mani veselības dati noplūdīs.»          | Atsevišķu patogēnu rezultāti **nekad** netiek parādīti nevienam — tikai anonīms spriedums: Safe / Compatible / Caution / Risk.                                                                |
| «Manas fotogrāfijas kaut kur nonāks.»    | Fotogrāfijas pēc noklusējuma ir izplūdušas. Īpašnieks piešķir **15 sekunžu** vai **pastāvīgu** skatu — pēc pieprasījuma vai proaktīvi. Skatīšana ir bezmaksas.                                |
| «Man nāksies atdot pasi vai tālruni.»    | Pieteikšanās ar maku (SIWE). Bez tālruņa, bez e-pasta, bez KYC. Atkopšana darbojas caur ķēdē esošu DNS saistību.                                                                              |
| «Viņš vai viņa melo par veselību.»       | Rezultātus **verificē laboratorija** (QR + sejas sakritība), un pāra testi tiek veikti **tikšanās laikā** — svaigi STS rezultāti ir svarīgi, DNS nenoveco.                                    |
| «Vai kāds paņems manu naudu un pazudīs?» | Ieņemšana notiek uz reāla, riskēta depozīta: vīrieša depozīts kustas tikai tad, kad paternitāte ir **apstiprināta**; pretējā gadījumā tas vienkārši tiek atgriezts viņam.                     |
| «Vai marķieris ir pump-and-dump?»        | Kods ir atvērts (MIT); gandrīz visa emisija ir rezervēta lietotāju apbalvojumiem, un necirkulējošo rezervi plānots ieslēgt **neiztukšojamā glabātuvē**, no kuras nevar izņemt pat dibinātājs. |
| «Vai platformu var slēgt vai aizliegt?»  | Vispirms P2P ziņojumi, decentralizēta glabātuve (IPFS / Arweave), 18 EVM tīklu konfigurācijas un nekāda iekodēta domēna.                                                                      |

## Kas un kāpēc

Tradicionālās iepazīšanās lietotnes lūdz apmainīt jūsu tālruņa numuru, e-pastu, fotogrāfijas un intīmās veselības detaļas pret centralizētu datubāzi — un pēc tam uzticēties šai datubāzei mūžīgi. EVOLVE sāk no pretējā pieņēmuma: **privātums pēc noklusējuma, pašglabāšana (self-custody) un neviena vienota atteices punkta**.

- **Privātums pēc noklusējuma** — veselības dati nekad netiek atklāti; tikai anonīmi spriedumi.
- **Izturība pret aizliegumiem** — vispirms P2P ziņojumi, decentralizēta glabātuve, vairāku tīklu arhitektūra, bez iekodētiem domēniem.
- **Pašglabāta identitāte** — jūsu maks ir jūsu pieteikšanās; atkopšana caur DNS e-pasta vai tālruņa vietā.
- **Bez KYC barjeras** — platformas lietošanai nav vajadzīgs dokuments, tālrunis vai e-pasts.

Pilnu pamatojumu lasiet: [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md).

## Veselība, kurai patiešām varat uzticēties

- Augšupielādējiet STS testu kā vienkāršu tekstu vai PDF (teksta slāņa izvilkšana, ar OCR rezerves variantu skenētiem attēliem).
- Parsētājs atpazīst 8 patogēnus: HIV-1/2, sifilisu, hlamīdiju, gonoreju, HSV-1, HSV-2, B hepatītu, C hepatītu — angļu, ukraiņu un krievu atskaišu formātos.
- **Atsevišķu patogēnu statuss nekad netiek rādīts citiem lietotājiem.** Profilos redzams tikai anonīms spriedums: **Safe / Compatible / Caution / Risk**.
- Ķēdē esošie DNS ieraksti (`DNAVerification.sol`) nodrošina atkopšanu un verificēšanu.

### Partneru laboratorijas — pierādījums, nevis solījums

Ienāciet partneru laboratorijā un parādiet savu QR kodu. Laboratorija to noskenē, apstiprina jūsu identitāti ar **sejas sakritību** (lai neviens cits nevarētu paņemt jūsu rezultātu) un pievieno STS atskaiti — PDF, skenējumu vai tekstu, pat sliktu OCR. Rezultātu paraksta īsta laboratorija, nevis jūs pats, tāpēc citi redz **verificētu faktu**, nevis jūsu vārdus. Un par katru apstiprinātu verifikāciju tiek samaksāts **pacientam 1 EVOLVE un laboratorijai 1 EVOLVE** — abām pusēm ir iemesls būt godīgām. Atsevišķi patogēni joprojām netiek rādīti nevienam.

## Kāda meklēšana

- Meklēšanas filtri: «Ko jūs meklējat» (iepazīšanās / ieņemšana / poliandrā ieņemšana / STS testi), «Ko jūs meklējat» (vīrieši, sievietes, pāri), pakāpeniski valsts → pilsētas atlasītāji, «var ierasties jūsu valstī» ar valstu sarakstiem, ādas krāsa, testēšanas preference, tikai STS saderīgie.
- Ievada vednis: vecums (paslēpjams), valodas, bio, fotogrāfija.
- **P2P tērzēšana** caur libp2p (gossipsub) + Nostr, ar HTTP API rezerves variantu.

## Ieņemšana

Divi veidi, kā plānot bērnu, un abi balstās uz vienu ideju: patiess nodoms tiek parādīts ar reālu EVOLVE depozītu — nekad ar solījumiem. Vīrieša apņemšanās dzīvo viņa EvolveFund depozītā (no 15 EVOLVE, ieslēgtā vismaz 30 dienas), un sieviete var noteikt savu minimālo depozītu vīriešiem, kas viņu sasniedz.

**Ieņemšana.** Vada sieviete: viņa uzaicina konkrētu vīrieti un nosauc viņu saistībā. Viņam vajag aktīvu EvolveFund depozītu; kad abi apstiprina, tas tiek ieslēgts un sākas atskaite. Grūtniecība tiek ziņota 14–30 dienas pēc apstiprināšanas, un pāra STS un DNS testi tiek veikti pašā tikšanās reizē — svaigi STS rezultāti ir svarīgi, DNS nenoveco. Kad paternitāte apstiprināta, vīrieša depozīts pāriet sievietei; ja nav apstiprināta, depozīts vienkārši tiek atgriezts viņam. Nekas nemaina īpašnieku, kamēr fakti nav noskaidroti.

**Poliandrā ieņemšana.** Izvēle pieder viņai un paliek privāta. Viņa atver sesiju, kas ilgst 48 stundas — bez sava depozīta (viņa var pievienot vienu tikai reputācijai, ja vēlas). Vīrieši ar aktīvu depozītu var pievienoties — līdz 50 — un apstiprināt, kas ieslēdz viņu depozītu. Četrpadsmit dienas pēc sesijas slēgšanas tiek izvēlēts tēvs. Viņš atgūst savu depozītu un vēl saņem atlīdzību no fonda: divkāršu depozītu un 1 EVOLVE par katru citu dalībnieku. Neizvēlētie vīrieši zaudē savu depozītu — 90% sievietei, 10% izvēlētajam tēvam. Viņa neko neriskē un var tikai iegūt; vīrieši liek savu depozītu aiz tiesībām tikt izvēlētiem.

## Privātums un konfidenciāli darījumi

Privātums ir noklusējums — un EVOLVE veido ceļu uz pilnīgi konfidenciāliem ķēdes pārskaitījumiem.

- **Privātas dāvanas** — nosūtiet rozi 🌹 vai kaktusu 🌵 (1 EVOLVE) un izvēlieties, kurš var redzēt, ka tas bijāt jūs: _publiski_, _anonīmi visiem, izņemot saņēmēju_ vai _pilnīgi anonīmi_. Anonīmajos režīmos dāvana ceļo kā vienreizējs vaučeris, ko saņēmējs izpērk ar savu maku, tāpēc sūtītājs nekad neparādās ķēdē. (Sūtītāja anonimitāte šodien ir sadzīves līmeņa: finansēšanas darījumu var saistīt pēc laika un summas.)
- **Aizsargāts Railgun maks** — privāts maks aiz funkcijas karodziņa (`VITE_RAILGUN_ENABLED`, pēc noklusējuma izslēgts), kas slēpj summas un adreses caur Railgun dzīvo nulles zināšanu baseinu. Tas ir ceļš uz patiesu sūtītāja anonimitāti.
- **Aztec prototips** — tā pati privāto pārskaitījumu un privāto saistību loģika, izteikta Noir nulles zināšanu shēmās un turēta aiz skaidras barjeras, līdz Aztec būs gatavs ražošanai. Sk. [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md).
- **Divu maku modelis** — publisks depozīta maks piedalās pārvaldībā; privāts aizsargāts maks apzināti **izslēgts** no balss svara, nošķirot privātumu un balsošanas spēku.

Sīkāk: [docs/RAILGUN-INTEGRATION.md](docs/RAILGUN-INTEGRATION.md) · [docs/SHIELDED-STAKES-DESIGN.md](docs/SHIELDED-STAKES-DESIGN.md) · [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md).

## EVOLVE marķieris (tikai testtīkls)

- ERC-20, maksimālā emisija **8 000 000 000 EVOLVE**. Admin darbības sargā 48 stundu `TimelockController`.
- **Plānotais emisijas sadalījums** — veidots tā, lai gandrīz visa emisija strādātu lietotājiem, nevis iekšējiem cilvēkiem:

| Mērķis                                                     |        EVOLVE |
| ---------------------------------------------------------- | ------------: |
| Dibinātāji un komanda (alga / apbalvojums)                 |    25 000 000 |
| DEX rezerve (nākotne)                                      |     4 000 000 |
| Publiskā pārdošana (plānota)                               |     5 000 000 |
| Apbalvojumu rezerve — laboratorijas, pacienti, mātes, tēvi | 7 966 000 000 |

- **Plānota publiskā pārdošana** — 5 000 000 EVOLVE, ko pārdod lietotne par **$0.8 gabalā**, maksājot ar jebkuru lietotnes atbalstītu marķieri; ieņēmumi finansē izstrādi. _(Plānots — vēl nav palaists.)_
- **Trustless emisija (plānota)** — apbalvojumu rezervi ~7 966 000 000 plānots ieslēgt neiztukšojamā `RewardVault`: tā tiek atbrīvota tikai pakāpeniski caur laboratoriju, pacientu, māšu un tēvu apbalvojumiem, un noteikumu maiņa prasa pārvaldības balsojumu. Izņemt to nevar pat dibinātājs. Dizains: [docs/REWARD-VAULT-PLAN.md](docs/REWARD-VAULT-PLAN.md).
- **Emociju dāvanu ekonomika** — dāvana maksā 1 EVOLVE, ko proporcionāli sadala starp esošo dāvanu īpašniekiem; mūžīgs ieņēmumu modelis, un dāvanas ir nododamas.
- **EvolveFund** — vīriešu steikings (min 15 EVOLVE, 30 dienu ieslēgums), kas ieskaitās pārvaldības svarā; sievietes izmanto maka atlikumu.
- **Verifikācijas apbalvojumi** — 1 EVOLVE verificētajam lietotājam un 1 EVOLVE apstiprinājušajai laboratorijai par STS/DNS verifikāciju (plus ātruma ierobežots krāns).
- **Pārvaldība** — balss svars apvieno rekursīvu reputāciju (8 balsis, dziļums 3), bērnu/tēvijas daļu un steikotos vai turētos EVOLVE.
- **LayerZero OFT** integrācija nākotnes vairāku tīklu EVOLVE pārskaitījumiem (atkarības sagatavotas; pagaidām nekas ārpus Sepolia nav izvietots).

## Atbalstiet projektu

EVOLVE ir neatkarīga un atvērtā pirmkoda. Ja tā jums ir noderīga, varat atbalstīt izstrādi ar ziedojumu — katrs ieguldījums iet kodam, laboratoriju partnerībām, mitināšanai un tulkojumiem.

- **Ziedojumu rekvizīti (EVM, Monero un citi):** [DONATE.md](DONATE.md)
- **Daudzvalodu ziedojumu lapa (34 valodas):** **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**

Publiskā marķieru pārdošana ir **plānota** — 5 000 000 EVOLVE, ko pārdod lietotne (sk. [EVOLVE marķieris](#evolve-marķieris-tikai-testtīkls)). Ziedojumi ir dāvanas, kas atbalsta atvērtā pirmkoda izstrādi un nedod nekādas tiesības uz marķieriem, kapitālu, peļņu vai atdevi. Lūdzu, ziedojiet tikai to, ko varat atļauties zaudēt.

## Arhitektūra un tehnoloģiju steks

Monorepo, pārvaldīts ar npm workspaces + Turborepo:

```
apps/
  web/          # Vite + React + TypeScript (galvenā tīmekļa lietotne, i18next, Prisma)
  mobile/       # Expo + React Native
packages/
  config/       # Funkciju karodziņi un dinamiska attālināta konfigurācija
  contracts/    # Solidity 0.8.24, Hardhat, Ignition, OpenZeppelin, LayerZero
  core/         # Kopīgi tipi, utilītas, middleware, web3
  matching/     # Saskaņošanas algoritmi, filtri, ranžēšana
  p2p/          # libp2p (gossipsub) + Nostr tīklošana
  storage/      # IPFS, Arweave, Lit Protocol
docs/           # Arhitektūra, tokenomika, ceļvedis, BUJ
```

Galvenie viedie līgumi: `EVOLVE.sol` (ERC-20), `ProfileNFT.sol` (ERC-721), `TrustScore.sol`, `Voting.sol`, `Evolve2Earn.sol` (emociju dāvanas + apbalvojumi), `Governance.sol`, `BondManager.sol` (ieņemšana un poliandrā ieņemšana), `EvolveFund.sol`, `VerificationRegistry.sol`, `DNAVerification.sol`, ERC-4337 `SmartAccountFactory` + `Paymaster` un OpenZeppelin `TimelockController`.

Sīkāk: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md)

## Ceļvedis

Notiek: tīmekļa lietotnes sagatavošana ražošanai. Plānots: ķēdē esošs laboratoriju reģistrs un testu sertifikācija, īsts pasta pakalpojumu adapteris laboratoriju atskaišu saņemšanai, ķēdē verificētas apliecināšanas profilos, **trustless `RewardVault`** ar balsošanas vadītu emisiju ([dizains](docs/REWARD-VAULT-PLAN.md)), **publiskā marķieru pārdošana**, marķieru vesting atjauninājums dibinātāju alokācijai un DEX likviditātes nodrošināšana (šobrīd bloķēta — nepieciešama galvenā tīkla marķieru izvietošana). Privātuma frontē privātas dāvanas ir pabeigtas, savukārt aizsargātais Railgun maks un Aztec privāto saistību migrācija paliek aiz pārbaudēm [docs/ROADMAP.md](docs/ROADMAP.md) un [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md). Vairāku tīklu paplašināšana (Arbitrum, Avalanche un citi EVM tīkli) seko pēc testa tīkla nostiprināšanas.

Pilns saraksts: [docs/ROADMAP.md](docs/ROADMAP.md).

## Darba sākšana (izstrādātājiem)

Prasības: **Node.js 20+** un npm 10.x.

```bash
# Klonējiet un instalējiet visas workspace
git clone https://github.com/Lilit-Moonlit/Evolve.git
cd Evolve
npm install

# Tīmekļa lietotne (Vite izstrādes serveris http://localhost:3000)
cd apps/web
npm run dev
npm test                # vitest testu komplekts

# Viedie līgumi
cd packages/contracts
npm run compile         # hardhat compile
npm test                # hardhat testu komplekts
npm run deploy:local    # izvietot visus līgumus procesā esošā Hardhat tīklā
```

## Ieguldījums

Ieguldījumi ir laipni gaidīti — kods, kļūdu ziņojumi, funkciju ieteikumi un idejas. Pirms sākšanas, lūdzu, izlasiet [CONTRIBUTING.md](CONTRIBUTING.md) un mūsu [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Repozitoriji (spoguļi)

| Spogulis | URL                                        |
| -------- | ------------------------------------------ |
| GitHub   | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg | https://codeberg.org/limitafternoon/Evolve |
| GitLab   | https://gitlab.com/evolve-group3/evolve    |

## Dokumentācija

- [Kas un kāpēc](docs/WHAT-AND-WHY.md) — problēma, vīzija, pamatvērtības
- [Kā tas darbojas](docs/HOW-IT-WORKS.md) — lietotāju plūsmas, soli pa solim
- [Arhitektūra](docs/ARCHITECTURE.md) — monorepo, pakotnes, datu plūsmas
- [Tokenomika](docs/TOKENOMICS.md) — marķiera modelis un emisijas sadalījums
- [RewardVault plāns](docs/REWARD-VAULT-PLAN.md) — trustless emisija (plānota)
- [Railgun integrācija](docs/RAILGUN-INTEGRATION.md) — aizsargāta maka integrācijas spike
- [Aizsargāti depozīti](docs/SHIELDED-STAKES-DESIGN.md) — privātas ieņemšanas depozīti (dizains)
- [Aztec prototips](docs/AZTEC-PROTOTYPE.md) — ZK privāti pārskaitījumi un saistības (pētījums)
- [Ceļvedis](docs/ROADMAP.md) — atskaites punkti un pašreizējais statuss
- [BUJ](docs/FAQ.md) — biežāk uzdotie jautājumi
- [Maka ceļvedis](docs/WALLETS.md) — kā izveidot makus un iegūt ziedojumu adreses

## Licence

Licencēts saskaņā ar [MIT License](LICENSE).

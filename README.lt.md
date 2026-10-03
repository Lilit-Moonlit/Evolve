[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)

# EVOLVE

**Pažintys, samprata ir patikrinta sveikata — privatu pagal numatytuosius nustatymus, patikima ten, kur tai svarbu.**

EVOLVE yra atvirojo kodo, decentralizuota platforma žmonėms, kurie pavargo atidavinėti savo telefono numerį, veidą ir pačius intymiausius sveikatos duomenis svetimai duomenų bazei. Prisijungiate savo kriptovaliutų pinigine — be telefono, be el. pašto, be KYC — ir savo paskyrą galite atgauti per blokčiaine įrašytą DNR įsipareigojimą. Jūsų sveikatos duomenys lieka jūsų: testų rezultatai analizuojami automatiškai, atskirų patogenų būsenos **niekada** nerodomos niekam, o suderinamumo paieška remiasi tik anoniminiais suderinamumo verdiktais (Safe / Compatible / Caution / Risk). Pokalbiai vyksta lygiaverčiu (peer-to-peer) ryšiu per libp2p ir Nostr, patogumui paliekant HTTP atsarginį variantą.

> **Būsena — platforma veikia jau šiandien; pagrindinis tinklas ir DEX yra toliau.**
> Pažintys, samprata, sveikatos patikra, laboratorijos procesas, P2P pokalbiai, EVOLVE žetonas ir valdymas — visi veikia. Dar priešakyje: **pagrindinio tinklo įdiegimas ir DEX likvidumas**, taip pat **planuojamas viešas pardavimas** (žr. [EVOLVE žetonas](#evolve-žetonas-tik-testinis-tinklas)).
> Išmaniosios sutartys įdiegtos **tik Ethereum Sepolia testiniame tinkle**. Niekas čia nėra finansinis patarimas ar investicijų pasiūlymas.

> **Manote, kad EVOLVE naudinga? Palaikykite kūrimą — kiekviena auka skiriama kodui, laboratorijų partnerystėms, prieglobai ir vertimams → [DONATE.md](DONATE.md).**

## Nėra ko bijoti

EVOLVE buvo sukurta pagal klausimus, kuriuos žmonės iš tikrųjų užduoda prieš pradėdami pasitikėti tokia platforma.

| Rūpestis                                      | Ką EVOLVE jau dabar dėl to daro                                                                                                                                                               |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| „Mano sveikatos duomenys nutekės."            | Atskirų patogenų rezultatai **niekada** nerodomi niekam — tik anonimiškas verdiktas: Safe / Compatible / Caution / Risk.                                                                      |
| „Mano nuotraukos kažkur atsiras."             | Nuotraukos pagal numatytuosius nustatymus yra suliejamos. Savininkas suteikia **15 sekundžių** arba **nuolatinį** peržiūrėjimą — pagal pageidavimą arba savo iniciatyva. Peržiūrėti nemokama. |
| „Teks atiduoti dokumentą ar telefoną."        | Prisijungimas pinigine (SIWE). Jokio telefono, jokio el. pašto, jokio KYC. Atkūrimas veikia per blokčiaine įrašytą DNR įsipareigojimą.                                                        |
| „Jis ar ji meluoja, kad yra sveikas."         | Rezultatai yra **patikrinti laboratorijoje** (QR + veido atitikimas), o poros testai atliekami **pačio susitikimo metu** — švieži STD rezultatai svarbūs, o DNR sensta.                       |
| „Ar kas nors nepaims mano pinigų ir nedings?" | Samprata vyksta su tikra rizikuojama statymo suma: vyro indėlis juda tik tada, kai tėvystė **patvirtinta**; kitu atveju jis tiesiog grąžinamas jam.                                           |
| „Ar žetonas yra pump-and-dump?"               | Šiandien joks pardavimas nevyksta; kodas atviras (MIT); ne cirkuliuojanti atsarga planuojama užrakinti **nenušluojamame seife**, iš kurio negali išimti net įkūrėjas.                         |
| „Ar platformą galima išjungti ar uždrausti?"  | Pirmiausia lygiaverčiai pokalbiai, decentralizuotas saugojimas (IPFS / Arweave), 18 EVM tinklo konfigūracijų ir jokios nekintamai įrašytos domenų.                                            |

## Kas ir kodėl

Tradicinės pažinčių programos prašo apsikeisti telefono numeriu, el. paštu, nuotraukomis ir intymiais sveikatos duomenimis į centralizuotą duomenų bazę — o tada amžinai ja pasitikėti. EVOLVE prasideda nuo priešingos prielaidos: **privatumas pagal numatytuosius nustatymus, savarankiškas valdymas ir jokio atskiro gedimo taško**.

- **Privatumas pagal numatytuosius nustatymus** — sveikatos duomenys niekada neatskleidžiami; tik anonimiški verdiktai.
- **Atsparumas draudimams** — pirmiausia P2P pokalbiai, decentralizuotas saugojimas, kelių tinklų dizainas, jokių nekintamai įrašytų domenų.
- **Savarankiškai valdoma tapatybė** — jūsų piniginė yra jūsų prisijungimas; DNR pagrįstas atkūrimas vietoj el. pašto ar telefono.
- **Jokio KYC barjero** — platformos naudojimui nereikia valstybinio ID, telefono ar el. pašto.

Visą pagrindimą skaitykite [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md).

## Sveikata, kuria iš tikrųjų galima pasitikėti

- Įkelkite STD testą kaip grynąjį tekstą ar PDF (teksto sluoksnio ištraukimas, su OCR atsargine galimybe skenavimams).
- Analizatorius pažįsta 8 patogenus: ŽIV-1/2, sifilis, chlamidijos, gonorėja, HSV-1, HSV-2, B hepatitas, C hepatitas — anglų, ukrainiečių ir rusų ataskaitų formatais.
- **Atskirų patogenų būsena kitiems vartotojams niekada nerodoma.** Profiliai rodo tik anonimišką verdiktą: **Safe / Compatible / Caution / Risk**.
- Blokčiaine įrašyti DNR įrašai (`DNAVerification.sol`) įgalina atkūrimą ir patikrinimą.

### Partnerių laboratorijos — įrodymai, o ne pažadai

Užeikite į partnerių laboratoriją ir parodykite savo QR kodą. Laboratorija jį nuskaito, patvirtina jūsų tapatybę **veido atitikimu** (kad niekas kitas negalėtų pasiimti jūsų rezultato) ir prideda STD ataskaitą — PDF, skenavimas ar tekstas, net su prastu OCR. Rezultatą pasirašo tikra laboratorija, o ne jūs, todėl kiti mato **patikrintą faktą**, o ne jūsų žodį. Ir kiekvienas patvirtintas patikrinimas atlygina **1 EVOLVE pacientui ir 1 EVOLVE laboratorijai** — abi pusės turi priežastį būti sąžiningos. Atskiri patogenai vis tiek niekada nerodomi niekam.

## Kaip ką nors rasti

- Paieškos filtrai: „Ko ieškote" (pažintys / samprata / poliandrinė samprata / STD testavimas), „Kuo ieškote" (vyrai, moterys, poros), kaskadiniai šalis → miestas pasirinkimai, „gali atvykti į jūsų šalį" su šalių sąrašais, odos spalva, testavimo pageidavimas, tik STD suderinami.
- Registracijos vedlys: amžius (galima slėpti), kalbos, aprašymas, nuotrauka.
- **P2P pokalbiai** per libp2p (gossipsub) + Nostr, su HTTP API atsargine galimybe.

## Samprata

Du būdai planuoti vaiką, ir abu remiasi ta pačia idėja: tikras ketinimas parodomas tikra EVOLVE statymo suma — niekada pažadais. Vyrio įsipareigojimas gyvena jo EvolveFund indėlyje (nuo 15 EVOLVE, užrakinta mažiausiai 30 dienų), o moteris gali nustatyti savo minimalų indėlį vyrams, kurie ją pasiekia.

**Samprata.** Moteris veda: ji kviečia konkretų vyrą ir įvardija jį obligacijoje. Jam reikia aktyvaus EvolveFund indėlio; kai abu patvirtina, jis užrakinamas ir prasideda atskaita. Apie nėštumą pranešama nuo 14 iki 30 dienų po patvirtinimo, o poros STD ir DNR testai atliekami pačio susitikimo metu — švieži STD rezultatai svarbūs, o DNR sensta. Kai tėvystė patvirtinta, vyro indėlis pereina moteriai; jei nepatvirtinta, indėlis tiesiog grąžinamas jam. Niekas nekeičia savininko, kol faktai neišaiškinti.

**Poliandrinė samprata.** Pasirinkimas priklauso jai ir lieka privatus. Ji atidaro sesiją, kuri trunka 48 valandas — be savo indėlio (tik dėl reputacijos ji gali pridėti vieną, jei nori). Vyrai su aktyviu indėliu gali prisijungti — iki 50 — ir patvirtinti, o tai užrakina jų statymo sumą. Keturiolika dienų po sesijos uždarymo išrenkamas tėvas. Jis atgauna savo indėlį plius atlygį iš fondo: dvigubą savo indėlį ir 1 EVOLVE už kiekvieną kitą dalyvį. Nepasirinkti vyrai praranda savo statymo sumą — 90 % moteriai, 10 % išrinktam tėvui. Ji nerizikuoja niekuo ir gali tik laimėti; vyrai stato savo sumą už teisę būti išrinkti.

## EVOLVE žetonas (tik testinis tinklas)

- ERC-20, maksimali apyvarta **8,000,000,000 EVOLVE**. Administratoriaus veiksmus riboja 48 valandų `TimelockController`.
- **Planuojamas apyvartos paskirstymas** — sukurtas taip, kad beveik visa apyvarta dirbtų vartotojams, o ne turintiems vidinės informacijos:

| Tikslas                                                    |        EVOLVE |
| ---------------------------------------------------------- | ------------: |
| Įkūrėjai ir komanda (atlyginimas / atlygis)                |    25,000,000 |
| DEX atsarga (ateityje)                                     |     4,000,000 |
| Viešas pardavimas (planuojamas)                            |     5,000,000 |
| Atlygių atsarga — laboratorijos, pacientai, motinos, tėvai | 7,966,000,000 |

- **Planuojamas viešas pardavimas** — 5,000,000 EVOLVE parduoda programa po **$0.8 už vienetą**, mokama bet kuria programos palaikoma valiuta; pajamos finansuoja kūrimą. _(Planuojama — dar nevykdoma.)_
- **Be pasitikėjimo grindžiama emisija (planuojama)** — ~7,966,000,000 atlygių atsarga bus užrakinta nenušluojamame `RewardVault`: ji išleidžiama tik palaipsniui per laboratorijų, pacientų, motinų ir tėvų atlygius, o taisyklių keitimas reikalauja valdymo balsavimo. Net įkūrėjas negali iš jos išimti. Dizainas: [docs/REWARD-VAULT-PLAN.md](docs/REWARD-VAULT-PLAN.md).
- **Emoji dovanų ekonomika** — dovana kainuoja 1 EVOLVE, paskirstoma proporcingai esamiems dovanų savininkams; nesibaigiantis pajamų modelis, o dovanos yra perkeliamos.
- **EvolveFund** — vyrų steikinas (min. 15 EVOLVE, 30 dienų užrakinimas), įskaitomas į valdymo svorį; moterys naudoja savo piniginės likutį.
- **Patikrinimo atlygiai** — 1 EVOLVE patikrintam vartotojui ir 1 EVOLVE patvirtinančiai laboratorijai už kiekvieną STD/DNR patikrinimą (plius dažnį ribojantis čiaupas).
- **Valdymas** — balso svoris jungia rekursinę reputaciją (8 balsai, gylis 3), vaikų/tėvystės dalį bei užstatytus ar laikomus EVOLVE.
- **LayerZero OFT** integracija būsimiems daugelio blokčiainių EVOLVE perkėlimams (priklausomybės paruoštos; už Sepolia ribų dar nieko neįdiegta).

## Palaikykite projektą

EVOLVE yra nepriklausomas ir atvirojo kodo. Jei jis jums naudingas, galite palaikyti kūrimą auka — kiekvienas indėlis skiriamas kodui, laboratorijų partnerystėms, prieglobai ir vertimams.

- **Aukos informacija (EVM, Monero ir kt.):** [DONATE.md](DONATE.md)
- **Daugiakalbis aukojimo puslapis (34 kalbos):** **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**

Viešas žetonų pardavimas yra plane, bet šiandien **nevyksta**. Aukos yra dovanos, palaikančios atvirojo kodo kūrimą, ir nesuteikia jokių teisių į žetonus, kapitalą, grąžą ar pelną. Paaukokite tik tai, ką galite sau leisti prarasti.

## Architektūra ir technologijos

Monorepo, valdoma su npm workspaces + Turborepo:

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

Pagrindinės išmaniosios sutartys: `EVOLVE.sol` (ERC-20), `ProfileNFT.sol` (ERC-721), `TrustScore.sol`, `Voting.sol`, `Evolve2Earn.sol` (emoji dovanos + atlygiai), `Governance.sol`, `BondManager.sol` (samprata ir poliandrinė samprata), `EvolveFund.sol`, `VerificationRegistry.sol`, `DNAVerification.sol`, ERC-4337 `SmartAccountFactory` + `Paymaster` ir OpenZeppelin `TimelockController`.

Išsamiau: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md)

## Veiksmų planas

Vykdoma: žiniatinklio programos gamybinis parengimas. Planuojama: blokčiainės laboratorijų registras ir testų sertifikavimas, tikras pašto teikėjo adapteris laboratorijų ataskaitoms gauti, blokčiainėje patikrinti liudijimai profiliuose, **be pasitikėjimo grindžiamas RewardVault** su valdymo kontroliuojama emisija ([dizainas](docs/REWARD-VAULT-PLAN.md)), **viešas žetonų pardavimas**, žetonų vestingo atnaujinimas įkūrėjų alokacijai ir DEX likvidumo tiekimas (šiuo metu blokuojama — tam reikia žetonų įdiegimo pagrindiniuose tinkluose). Kelių tinklų plėtra (Arbitrum, Avalanche ir kitos EVM blokčiainės) seks po testinio tinklo sukietinimo.

Visas sąrašas: [docs/ROADMAP.md](docs/ROADMAP.md).

## Pradžia (kūrėjams)

Reikalavimai: **Node.js 20+** ir npm 10.x.

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

## Prisidėjimas

Indėliai laukiami — kodas, klaidų ataskaitos, funkcijų pasiūlymai ir pasiūlymai. Prieš pradėdami perskaitykite [CONTRIBUTING.md](CONTRIBUTING.md) ir mūsų [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Saugyklos (veidrodiniai)

| Veidrodis | URL                                        |
| --------- | ------------------------------------------ |
| GitHub    | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg  | https://codeberg.org/limitafternoon/Evolve |
| GitLab    | https://gitlab.com/evolve-group3/evolve    |

## Dokumentacija

- [Kas ir kodėl](docs/WHAT-AND-WHY.md) — problema, vizija, pagrindinės vertybės
- [Kaip tai veikia](docs/HOW-IT-WORKS.md) — vartotojų srautai, žingsnis po žingsnio
- [Architektūra](docs/ARCHITECTURE.md) — monorepo, paketai, duomenų srautai
- [Tokenomika](docs/TOKENOMICS.md) — žetonų modelis ir apyvartos paskirstymas
- [RewardVault planas](docs/REWARD-VAULT-PLAN.md) — be pasitikėjimo grindžiama emisija (planuojama)
- [Veiksmų planas](docs/ROADMAP.md) — etapai ir dabartinė būsena
- [DUK](docs/FAQ.md) — dažnai užduodami klausimai
- [Piniginės gidas](docs/WALLETS.md) — kaip sukurti pinigines ir gauti aukojimo adresus

## Licencija

Licencijuota pagal [MIT licenciją](LICENSE).

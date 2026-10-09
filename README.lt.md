[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)
<!-- evolve-readme-sync: 3796750887b0bd65 -->

# EVOLVE

**Pažintys, samprata ir patikrinta sveikata — privatu pagal numatytuosius nustatymus, patikima ten, kur tai svarbu.**

EVOLVE yra atvirojo kodo, decentralizuota platforma žmonėms, kurie pavargo atidavinėti savo telefono numerį, veidą ir pačius intymiausius sveikatos duomenis svetimai duomenų bazei. Prisijungiate savo kriptovaliutų pinigine — be telefono, be el. pašto, be KYC — ir savo paskyrą galite atgauti per blokčiaine įrašytą DNR įsipareigojimą. Jūsų sveikatos duomenys lieka jūsų: testų rezultatai analizuojami automatiškai, atskirų patogenų būsenos **niekada** nerodomos niekam, o suderinamumo paieška remiasi tik anoniminiais suderinamumo verdiktais (Safe / Compatible / Caution / Risk). Pokalbiai vyksta lygiaverčiu (peer-to-peer) ryšiu per libp2p ir Nostr, patogumui paliekant HTTP atsarginį variantą. Dovanos ir pervedimai juda link visiško konfidencialumo: privačios dovanos jau veikia, o priekyje — apsaugota Railgun piniginė ir Aztec nulinio žinojimo prototipas (žr. [Privatumas ir konfidencialios operacijos](#privatumas--konfidencialios-operacijos)).

> **Būsena — demonstracinis režimas, aktyvi plėtra.**
> Pažintys, samprata, sveikatos patikra, laboratorijos procesas, P2P pokalbiai, EVOLVE žetonas ir valdymas — visi įgyvendinti ir veikia **vietinėje demonstracijoje** — programa **dar nėra viešai įdiegta**. Dar priekyje: **pagrindinio tinklo įdiegimas ir DEX likvidumas**, taip pat **planuojamas viešas pardavimas** (žr. [EVOLVE žetonas](#evolve-žetonas-tik-testinis-tinklas)).
> Išmaniosios sutartys įdiegtos **tik Ethereum Sepolia testiniame tinkle**. Niekas čia nėra finansinis patarimas ar investicijų pasiūlymas.

> **EVOLVE jums naudingas? Palaikykite plėtrą — kiekviena auka skiriama kodui, partnerystei su laboratorijomis, prieglobai ir vertimams → [DONATE.md](DONATE.md).**

## Nėra ko bijoti

EVOLVE buvo kuriama aplink klausimus, kuriuos žmonės iš tikrųjų užduoda prieš pasitikėdami tokia platforma.

| Būgštavimas                                   | Ką EVOLVE jau daro dėl to                                                                                                                                                                             |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| «Mano sveikatos duomenys nutekės.»            | Atskirų patogenų rezultatai **niekada** niekam nerodomi — tik anoniminis verdiktas: Safe / Compatible / Caution / Risk.                                                                               |
| «Mano nuotraukos kažkur atsidurs.»            | Nuotraukos pagal numatytuosius nustatymus sulietos. Savininkas suteikia **15 sekundžių** arba **nuolatinį** peržiūros leidimą — pagal prašymą arba iniciatyviai. Peržiūra nemokama.                   |
| «Teks atiduoti asmens dokumentą ar telefoną.» | Prisijungimas pinigine (SIWE). Be telefono, be el. pašto, be KYC. Atkūrimas veikia per blokčiaine įrašytą DNR įsipareigojimą.                                                                         |
| «Jis arba ji meluoja apie sveikatą.»          | Rezultatus **patvirtina laboratorija** (QR + veido sutapatinimas), o poros testai atliekami **susitikimo metu** — neseni LPL rezultatai svarbūs, DNR nesensta.                                        |
| «Ar kas nors paims mano pinigus ir dings?»    | Samprata vyksta ant realaus, rizikuojamo indėlio: vyro indėlis juda tik tada, kai tėvystė **patvirtinta**; kitu atveju jis tiesiog grąžinamas jam.                                                    |
| «Ar žetonas yra pump-and-dump?»               | Kodas atviras (MIT); beveik visa emisija rezervuota naudotojų apdovanojimams, o necirkuliuojantį rezervą planuojama užrakinti **neištuštinamame saugykloje**, iš kurios negali išsiimti net įkūrėjas. |
| «Ar platformą galima uždaryti ar užblokuoti?» | Pirmiausia P2P žinutės, decentralizuota saugykla (IPFS / Arweave), 18 EVM tinklų konfigūracijų ir jokio užkoduoto domeno.                                                                             |

## Kas ir kodėl

Tradicinės pažinčių programos prašo iškeisti savo telefono numerį, el. paštą, nuotraukas ir intymias sveikatos detales į centralizuotą duomenų bazę — o paskui amžinai ja pasitikėti. EVOLVE pradeda nuo priešingos prielaidos: **privatumas pagal numatytuosius nustatymus, savarankiškas laikymas (self-custody) ir jokio vieno gedimo taško**.

- **Privatumas pagal numatytuosius nustatymus** — sveikatos duomenys niekada neatskleidžiami; tik anoniminiai verdiktai.
- **Atsparumas blokavimui** — pirmiausia P2P žinutės, decentralizuota saugykla, kelių tinklų architektūra, be užkoduotų domenų.
- **Savarankiškai laikoma tapatybė** — jūsų piniginė yra jūsų prisijungimas; atkūrimas per DNR vietoj el. pašto ar telefono.
- **Be KYC barjero** — platformai naudoti nereikia valstybinio dokumento, telefono ar el. pašto.

Visą pagrindimą skaitykite: [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md).

## Sveikata, kuria tikrai galite pasitikėti

- Įkelkite LPL testą kaip paprastą tekstą arba PDF (teksto sluoksnio ištraukimas, su OCR atsarginiu variantu skenuotiems vaizdams).
- Analizatorius atpažįsta 8 patogenus: ŽIV-1/2, sifilį, chlamidiją, gonorėją, HSV-1, HSV-2, hepatitą B, hepatitą C — anglų, ukrainiečių ir rusų ataskaitų formatais.
- **Atskirų patogenų būsena niekada nerodoma kitiems naudotojams.** Profiliuose rodomas tik anoniminis verdiktas: **Safe / Compatible / Caution / Risk**.
- Blokčiaine įrašyti DNR įrašai (`DNAVerification.sol`) užtikrina atkūrimą ir patikrą.

### Partnerių laboratorijos — įrodymas, o ne pažadas

Užeikite į partnerių laboratoriją ir parodykite savo QR kodą. Laboratorija jį nuskaito, patvirtina jūsų tapatybę **veido sutapatinimu** (kad niekas kitas negalėtų pasiimti jūsų rezultato) ir prideda LPL ataskaitą — PDF, skeną ar tekstą, net ir prastą OCR. Rezultatą pasirašo tikra laboratorija, o ne jūs patys, todėl kiti mato **patvirtintą faktą**, o ne jūsų žodžius. Ir už kiekvieną patvirtintą patikrą sumokama **pacientui 1 EVOLVE ir laboratorijai 1 EVOLVE** — abi pusės turi priežastį būti sąžiningos. Atskiri patogenai vis tiek niekam nerodomi.

## Kažko paieška

- Paieškos filtrai: «Ko ieškote» (pažintys / samprata / poliandrinė samprata / LPL testai), «Ko ieškote» (vyrai, moterys, poros), pakopiniai šalies → miesto pasirinkimai, «gali atvykti į jūsų šalį» su šalių sąrašais, odos spalva, testavimo preferencija, tik LPL suderinami.
- Įvadinis vedlys: amžius (galima paslėpti), kalbos, biografija, nuotrauka.
- **P2P pokalbiai** per libp2p (gossipsub) + Nostr, su HTTP API atsarginiu variantu.

## Samprata

Du būdai planuoti vaiką, ir abu remiasi ta pačia idėja: tikras ketinimas parodomas realiu EVOLVE indėliu — niekada pažadais. Vyro įsipareigojimas gyvena jo EvolveFund indėlyje (nuo 15 EVOLVE, užrakintame mažiausiai 30 dienų), o moteris gali nustatyti savo minimalų indėlį ją pasiekiantiems vyrams.

**Samprata.** Veda moteris: ji pakviečia konkretų vyrą ir įvardija jį ryšyje. Jam reikia aktyvaus EvolveFund indėlio; kai abu patvirtina, jis užrakinamas ir prasideda atgalinis skaičiavimas. Nėštumas pranešamas praėjus 14–30 dienų po patvirtinimo, o poros LPL ir DNR testai atliekami pačiame susitikime — neseni LPL rezultatai svarbūs, DNR nesensta. Kai tėvystė patvirtinama, vyro indėlis pereina moteriai; jei nepatvirtinama, indėlis tiesiog grąžinamas jam. Niekas nekeičia savininko, kol faktai nenustatyti.

**Poliandrinė samprata.** Pasirinkimas priklauso jai ir lieka privatus. Ji atidaro sesiją, trunkančią 48 valandas — be savo indėlio (gali pridėti vieną tik dėl reputacijos, jei nori). Vyrai su aktyviu indėliu gali prisijungti — iki 50 — ir patvirtinti, o tai užrakina jų indėlį. Praėjus keturiolikai dienų po sesijos uždarymo, išrenkamas tėvas. Jis atgauna savo indėlį ir dar gauna atlygį iš fondo: dvigubą savo indėlį ir 1 EVOLVE už kiekvieną kitą dalyvį. Neišrinkti vyrai praranda savo indėlį — 90% moteriai, 10% išrinktam tėvui. Ji niekuo nerizikuoja ir gali tik laimėti; vyrai stato savo indėlį už teisę būti išrinkti.

## Privatumas ir konfidencialios operacijos

Privatumas yra numatytasis — ir EVOLVE kuria kelią link visiškai konfidencialių blokčiainės pervedimų.

- **Privačios dovanos** — atsiųskite rožę 🌹 arba kaktusą 🌵 (1 EVOLVE) ir pasirinkite, kas gali matyti, kad tai buvote jūs: _viešai_, _anonimiškai visiems, išskyrus gavėją_ arba _visiškai anonimiškai_. Anoniminiais režimais dovana keliauja kaip vienkartinis kuponas, kurį gavėjas išsipirko savo pinigine, todėl siuntėjas niekada nepasirodo blokčiainėje. (Siuntėjo anonimiškumas šiandien yra kasdienio lygio: finansavimo operaciją galima susieti pagal laiką ir sumą.)
- **Apsaugota Railgun piniginė** — privati piniginė už funkcijos vėliavėlės (`VITE_RAILGUN_ENABLED`, pagal numatytuosius nustatymus išjungta), slepianti sumas ir adresus per Railgun gyvą nulinio žinojimo baseiną. Tai kelias į tikrą siuntėjo anonimiškumą.
- **Aztec prototipas** — ta pati privačių pervedimų ir privačių ryšių logika, išreikšta Noir nulinio žinojimo grandinėmis ir laikoma už aiškaus barjero, kol Aztec bus paruoštas gamybai. Žr. [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md).
- **Dviejų piniginių modelis** — vieša indėlio piniginė dalyvauja valdyme; privati apsaugota piniginė sąmoningai **pašalinta** iš balsų svorio, atskiriant privatumą ir balsavimo galią.

Išsamiau: [docs/RAILGUN-INTEGRATION.md](docs/RAILGUN-INTEGRATION.md) · [docs/SHIELDED-STAKES-DESIGN.md](docs/SHIELDED-STAKES-DESIGN.md) · [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md).

## EVOLVE žetonas (tik testinis tinklas)

- ERC-20, maksimali emisija **8 000 000 000 EVOLVE**. Administratoriaus veiksmai saugomi 48 valandų `TimelockController`.
- **Planuojamas emisijos paskirstymas** — sukurtas taip, kad beveik visa emisija dirbtų naudotojams, o ne vidiniams asmenims:

| Paskirtis                                                        |        EVOLVE |
| ---------------------------------------------------------------- | ------------: |
| Įkūrėjai ir komanda (atlyginimas / apdovanojimas)                |    25 000 000 |
| DEX rezervas (ateityje)                                          |     4 000 000 |
| Viešas pardavimas (planuojamas)                                  |     5 000 000 |
| Apdovanojimų rezervas — laboratorijos, pacientai, motinos, tėvai | 7 966 000 000 |

- **Planuojamas viešas pardavimas** — 5 000 000 EVOLVE, parduodama programos po **$0.8 už vienetą**, atsiskaitant bet kokiu programos palaikomu žetonu; pajamos finansuoja plėtrą. _(Planuojama — dar nepradėta.)_
- **Trustless emisija (planuojama)** — apdovanojimų rezervą ~7 966 000 000 planuojama užrakinti neištuštinamame `RewardVault`: jis išleidžiamas tik palaipsniui per laboratorijų, pacientų, motinų ir tėvų apdovanojimus, o taisyklių keitimas reikalauja valdymo balsavimo. Išsiimti jo negali net įkūrėjas. Dizainas: [docs/REWARD-VAULT-PLAN.md](docs/REWARD-VAULT-PLAN.md).
- **Emoji dovanų ekonomika** — dovana kainuoja 1 EVOLVE, paskirstomą proporcingai tarp esamų dovanų savininkų; neterminuotas pajamų modelis, o dovanas galima perleisti.
- **EvolveFund** — vyrų staking (min 15 EVOLVE, 30 dienų užraktas), įskaitomas į valdymo svorį; moterys naudoja piniginės balansą.
- **Patikros apdovanojimai** — 1 EVOLVE patikrintam naudotojui ir 1 EVOLVE patvirtinusiai laboratorijai už LPL/DNR patikrą (plius ribojamo greičio čiaupas).
- **Valdymas** — balsų svoris jungia rekursinę reputaciją (8 balsai, gylis 3), vaikų/tėvystės dalį ir įkeistus arba laikomus EVOLVE.
- **LayerZero OFT** integracija būsimiems kelių tinklų EVOLVE pervedimams (priklausomybės parengtos; iki šiol niekur, išskyrus Sepolia, neįdiegta).

## Palaikykite projektą

EVOLVE yra nepriklausoma ir atvirojo kodo. Jei ji jums naudinga, galite paremti plėtrą auka — kiekvienas indėlis skiriamas kodui, partnerystei su laboratorijomis, prieglobai ir vertimams.

- **Aukų rekvizitai (EVM, Monero ir kt.):** [DONATE.md](DONATE.md)
- **Daugiakalbis aukų puslapis (34 kalbos):** **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**

Viešas žetonų pardavimas yra **planuojamas** — 5 000 000 EVOLVE, parduodama programos (žr. [EVOLVE žetonas](#evolve-žetonas-tik-testinis-tinklas)). Aukos yra dovanos, remiančios atvirojo kodo plėtrą ir nesuteikiančios jokių teisių į žetonus, akcijas, grąžą ar pelną. Prašome aukoti tik tiek, kiek galite sau leisti prarasti.

## Architektūra ir technologijų krūva

Monorepo, valdoma npm workspaces + Turborepo:

```
apps/
  web/          # Vite + React + TypeScript (pagrindinė žiniatinklio programa, i18next, Prisma)
  mobile/       # Expo + React Native
packages/
  config/       # Funkcijų vėliavėlės ir dinaminė nuotolinė konfigūracija
  contracts/    # Solidity 0.8.24, Hardhat, Ignition, OpenZeppelin, LayerZero
  core/         # Bendri tipai, įrankiai, middleware, web3
  matching/     # Suderinamumo algoritmai, filtrai, reitingavimas
  p2p/          # libp2p (gossipsub) + Nostr tinklas
  storage/      # IPFS, Arweave, Lit Protocol
docs/           # Architektūra, žetonų ekonomika, veiksmų planas, DUK
```

Pagrindinės išmaniosios sutartys: `EVOLVE.sol` (ERC-20), `ProfileNFT.sol` (ERC-721), `TrustScore.sol`, `Voting.sol`, `Evolve2Earn.sol` (emoji dovanos + apdovanojimai), `Governance.sol`, `BondManager.sol` (samprata ir poliandrinė samprata), `EvolveFund.sol`, `VerificationRegistry.sol`, `DNAVerification.sol`, ERC-4337 `SmartAccountFactory` + `Paymaster` ir OpenZeppelin `TimelockController`.

Išsamiau: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md)

## Veiksmų planas

Vykdoma: žiniatinklio programos paruošimas gamybai. Planuojama: blokčiainės laboratorijų registras ir testų sertifikavimas, tikras el. pašto tiekėjo adapteris laboratorijų ataskaitoms gauti, blokčiaine patvirtinti liudijimai profiliuose, **trustless `RewardVault`** su balsavimu valdoma emisija ([dizainas](docs/REWARD-VAULT-PLAN.md)), **viešas žetonų pardavimas**, žetonų vesting atnaujinimas įkūrėjų alokacijai ir DEX likvidumo užtikrinimas (šiuo metu blokuojama — reikia pagrindinio tinklo žetonų įdiegimų). Privatumo fronte privačios dovanos baigtos, o apsaugota Railgun piniginė ir Aztec privačių ryšių migracija lieka už patikrų [docs/ROADMAP.md](docs/ROADMAP.md) ir [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md). Kelių tinklų plėtra (Arbitrum, Avalanche ir kiti EVM tinklai) vyks po testinio tinklo sustiprinimo.

Visas sąrašas: [docs/ROADMAP.md](docs/ROADMAP.md).

## Pradžia (kūrėjams)

Reikalavimai: **Node.js 20+** ir npm 10.x.

```bash
# Klonuokite ir įdiekite visas workspace
git clone https://github.com/Lilit-Moonlit/Evolve.git
cd Evolve
npm install

# Žiniatinklio programa (Vite kūrimo serveris http://localhost:3000)
cd apps/web
npm run dev
npm test                # vitest testų rinkinys

# Išmaniosios sutartys
cd packages/contracts
npm run compile         # hardhat compile
npm test                # hardhat testų rinkinys
npm run deploy:local    # įdiekite visas sutartis procese veikiančiame Hardhat tinkle
```

## Prisidėjimas

Indėliai laukiami — kodas, klaidų pranešimai, funkcijų pasiūlymai ir idėjos. Prieš pradėdami perskaitykite [CONTRIBUTING.md](CONTRIBUTING.md) ir mūsų [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Saugyklos (veidrodžiai)

| Veidrodis | URL                                        |
| --------- | ------------------------------------------ |
| GitHub    | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg  | https://codeberg.org/limitafternoon/Evolve |
| GitLab    | https://gitlab.com/evolve-group3/evolve    |

## Dokumentacija

- [Kas ir kodėl](docs/WHAT-AND-WHY.md) — problema, vizija, pagrindinės vertybės
- [Kaip tai veikia](docs/HOW-IT-WORKS.md) — naudotojų srautai, žingsnis po žingsnio
- [Architektūra](docs/ARCHITECTURE.md) — monorepo, paketai, duomenų srautai
- [Žetonų ekonomika](docs/TOKENOMICS.md) — žetono modelis ir emisijos paskirstymas
- [RewardVault planas](docs/REWARD-VAULT-PLAN.md) — trustless emisija (planuojama)
- [Railgun integracija](docs/RAILGUN-INTEGRATION.md) — apsaugotos piniginės integracijos spike
- [Apsaugoti indėliai](docs/SHIELDED-STAKES-DESIGN.md) — privačios sampratos indėliai (dizainas)
- [Aztec prototipas](docs/AZTEC-PROTOTYPE.md) — ZK privatūs pervedimai ir ryšiai (tyrimas)
- [Veiksmų planas](docs/ROADMAP.md) — etapai ir dabartinė būsena
- [DUK](docs/FAQ.md) — dažniausiai užduodami klausimai
- [Piniginės vadovas](docs/WALLETS.md) — kaip susikurti pinigines ir gauti aukų adresus

## Licencija

Licencijuota pagal [MIT License](LICENSE).

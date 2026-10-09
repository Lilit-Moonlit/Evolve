[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)
<!-- evolve-readme-sync: 3796750887b0bd65 -->

# EVOLVE

**Deittailu, hedelmöitys ja vahvistettu terveys — yksityisyys oletuksena, luottamus siellä, missä sillä on merkitystä.**

EVOLVE on avoimen lähdekoodin hajautettu alusta ihmisille, jotka ovat kyllästyneet luovuttamaan puhelinnumeroaan, kasvojaan ja intiimeimpiä terveystietojaan muiden tietokantoihin. Kirjaudut sisään omalla kryptolompakollasi — ei puhelinta, ei sähköpostia, ei KYC:tä — ja saat tilisi takaisin lohkoketjuun tallennetun DNA-sitoumuksen avulla. Terveystietosi pysyvät omistuksessasi: testitulokset jäsennetään automaattisesti, yksittäisten taudinaiheuttajien tiloja **ei näytetä koskaan** kenellekään, ja yhteensopivuus perustuu ainoastaan anonyymeihin arvioihin (Safe / Compatible / Caution / Risk). Chat toimii vertaisverkossa libp2p:n ja Nostrin välityksellä, ja HTTP-varareitti on mukavuutta varten. Lahjat ja siirrot ovat menossa kohti täyttä luottamuksellisuutta: lahjat, joissa lähettäjä pysyy yksityisenä, ovat jo käytössä, ja tiekartalla ovat Railgun-suojattu lompakko sekä Aztecin zero-knowledge-prototyyppi (katso [Yksityisyys ja luottamukselliset transaktiot](#yksityisyys-ja-luottamukselliset-transaktiot)).

> **Tila — demotila, aktiivisen kehityksen alla.**
> Deittailu, hedelmöitys, terveystietojen varmennus, laboratorioprosessi, P2P-chat, EVOLVE-token ja hallinto ovat kaikki toteutettu ja toimivat **paikallisessa demossa** — sovellusta **ei ole vielä julkaistu julkisesti**. Edessä ovat yhä: **mainnet-käyttöönotto ja DEX-likviditeetti** sekä **suunniteltu julkinen myynti** (katso [EVOLVE-token](#evolve-token-vain-testiverkko)).
> Älysopimukset on otettu käyttöön **ainoastaan Ethereumin Sepolia-testiverkossa**. Mikään täällä esitetystä ei ole sijoitusneuvontaa tai sijoitustarjous.

> **Onko EVOLVE:stä sinulle hyötyä? Tue kehitystä — jokainen lahjoitus menee koodiin, laboratoriokumppanuuksiin, ylläpitoon ja käännöksiin → [DONATE.md](DONATE.md).**

## Ei pelättävää

EVOLVE rakennettiin niiden kysymysten ympärille, joita ihmiset todella esittävät ennen tällaiseen alustaan luottamista.

| Huoli                                                     | Mitä EVOLVE jo tekee asialle                                                                                                                                                                                   |
| --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ”Terveystietoni vuotavat ulos.”                           | Yksittäisten taudinaiheuttajien tuloksia **ei näytetä koskaan** kenellekään — vain anonyymi arvio: Safe / Compatible / Caution / Risk.                                                                         |
| ”Valokuvani päätyvät jonnekin.”                           | Kuvat ovat oletuksena sumennettuja. Omistaja myöntää **15 sekunnin** tai **pysyvän** katseluoikeuden — pyynnöstä tai omasta aloitteesta. Katselu on ilmaista.                                                  |
| ”Joudun luovuttamaan henkilötodistukseni tai puhelimeni.” | Lompakkokirjautuminen (SIWE). Ei puhelinta, ei sähköpostia, ei KYC:tä. Palautus toimii lohkoketjuun tallennetun DNA-sitoumuksen kautta.                                                                        |
| ”Hän valehtelee olevansa terve.”                          | Tulokset ovat **laboratorion varmentamia** (QR + kasvojenvastaavuus), ja parin testit tehdään **itse tapaamisessa** — tuoreilla STD-tuloksilla on väliä, DNA ei vanhene.                                       |
| ”Viekö joku rahani ja katoaa?”                            | Hedelmöitys toimii todellisella, riskille asetetulla panoksella: miehen talletus liikkuu vain, kun isyys on **vahvistettu**; muussa tapauksessa se yksinkertaisesti palautetaan hänelle.                       |
| ”Onko token pump-and-dump?”                               | Koodi on avointa (MIT); lähes koko emissio on varattu käyttäjien palkinnoille, ja liikkeeseen laskematon varanto on tarkoitus lukita **tyhjentämättömään holviin**, josta ei edes perustaja voi nostaa varoja. |
| ”Voiko alustan sulkea tai kieltää?”                       | Vertaisviestintä ensin, hajautettu tallennus (IPFS / Arweave), 18 EVM-verkkomääritystä eikä kovakoodattua domain-nimeä.                                                                                        |

## Mikä ja miksi

Perinteiset deittisovellukset pyytävät sinua vaihtamaan puhelinnumerosi, sähköpostisi, kuvasi ja intiimit terveystietosi keskitettyyn tietokantaan — ja luottamaan siihen tietokantaan ikuisesti. EVOLVE lähtee vastakkaisesta oletuksesta: **yksityisyys oletuksena, itsehallinta (self-custody) eikä yhtään yksittäistä vikapistettä**.

- **Yksityisyys oletuksena** — terveystietoja ei koskaan paljasteta; vain anonyymit arviot.
- **Vastustuskyky kielloille** — P2P-ensisijainen viestintä, hajautettu tallennus, moniverkkorakenne, ei kovakoodattuja domain-nimiä.
- **Omassa hallussa oleva identiteetti** — lompakkosi on kirjautumistunnuksesi; DNA-pohjainen tilin palautus sähköpostin tai puhelimen sijaan.
- **Ei KYC-velvollisuutta** — alustan käyttöön ei tarvita viranomaisten myöntämää henkilötodistusta, puhelinta tai sähköpostia.

Lue koko perustelu: [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md).

## Terveys, johon voi oikeasti luottaa

- Lataa STD-testitulos raakatekstinä tai PDF:nä (tekstikerroksen poiminta, OCR-varareitti skannauksille).
- Jäsennin tuntee 8 taudinaiheuttajaa: HIV-1/2, kuppa, klamydia, tippuri, HSV-1, HSV-2, B-hepatiitti ja C-hepatiitti — englannin-, ukrainan- ja venäjänkielisissä raporttimuodoissa.
- **Yksittäisen taudinaiheuttajan tilaa ei näytetä koskaan muille käyttäjille.** Profiileissa näkyy vain anonyymi arvio: **Safe / Compatible / Caution / Risk**.
- Lohkoketjun DNA-tietueet (`DNAVerification.sol`) mahdollistavat palautuksen ja varmennuksen.

### Kumppanilaboratoriot — todisteita, ei lupauksia

Käy kumppanilaboratoriossa ja näytä QR-koodisi. Laboratorio skannaa sen, vahvistaa henkilöllisyytesi **kasvojenvastaavuudella** (jottei kukaan muu voi noutaa tulostasi) ja liittää STD-raportin — PDF, skannaus tai teksti, vaikka huonosti OCR-luettuna. Tuloksen allekirjoittaa oikea laboratorio, et sinä itse, joten muut näkevät **varmennetun faktan** sanojesi sijaan. Ja jokaisesta vahvistetusta varmennuksesta maksetaan **1 EVOLVE potilaalle ja 1 EVOLVE laboratoriolle** — molemmilla osapuolilla on syy pysyä rehellisinä. Yksittäisiä taudinaiheuttajia ei silti näytetä koskaan kenellekään.

## Toisen löytäminen

- Hakusuodattimet: ”Mitä etsit” (deittailu / hedelmöitys / polyandrinen hedelmöitys / STD-testaus), ”Ketä etsit” (miehet, naiset, parit), porrastetut maa → kaupunki -valinnat, ”voi saapua maahasi” maaakohtaisine luetteloineen, ihonväri, testauksen mieltymys, vain STD-yhteensopivat.
- Perehdytysvelho: ikä (piilotettavissa), kielet, esittelyteksti, valokuva.
- **P2P-chat** libp2p:n (gossipsub) + Nostrin kautta, HTTP API -varareitti mukana.

## Hedelmöitys

Kaksi tapaa suunnitella lapsi, ja molemmat nojaavat samaan ajatukseen: todellinen aie osoitetaan todellisella EVOLVE-panoksella — ei koskaan lupauksilla. Miehen sitoumus elää hänen EvolveFund-talletuksessaan (alkaen 15 EVOLVE:sta, lukittuna vähintään 30 päiväksi), ja nainen voi asettaa oman vähimmäistalletuksen vaatimuksen miehille, jotka hänen luokseen yltävät.

**Hedelmöitys.** Nainen johtaa: hän kutsuu tietyn miehen ja nimeää tämän sidokseen. Miehellä on oltava aktiivinen EvolveFund-talletus; kun molemmat vahvistavat, talletus lukitaan ja lähtölaskenta käynnistyy. Raskaudesta ilmoitetaan 14–30 päivän kuluessa vahvistuksesta, ja parin STD- ja DNA-testit tehdään itse tapaamisessa — tuoreilla STD-tuloksilla on väliä, DNA ei vanhene. Kun isyys on vahvistettu, miehen talletus siirtyy naiselle; jos isyyttä ei vahvisteta, talletus palautetaan hänelle yksinkertaisesti takaisin. Mikään ei vaihda käsiä, ennen kuin faktat on selvitetty.

**Polyandrinen hedelmöitys.** Valinta kuuluu naiselle ja pysyy yksityisenä. Hän avaa istunnon, joka kestää 48 tuntia — ilman omaa talletusta (halutessaan hän voi tehdä sellaisen ainoastaan maineen vuoksi). Miehet, joilla on aktiivinen talletus, voivat liittyä — enintään 50 — ja vahvistaa osallistumisensa, mikä lukitsee heidän panoksensa. 14 päivää istunnon päättymisen jälkeen isä valitaan. Hän saa talletuksensa takaisin sekä palkinnon poolista: kaksi kertaa talletuksensa ja 1 EVOLVE jokaiselta muulta osallistujalta. Valitsematta jääneet miehet menettävät panoksensa — 90 % naiselle, 10 % valitulle isälle. Nainen ei riskkaa mitään ja voi vain voittaa; miehet asettavat panoksensa oikeudesta tulla valituksi.

## Yksityisyys ja luottamukselliset transaktiot

Yksityisyys on oletus — ja EVOLVE rakentaa tiekarttaa kohti täysin luottamuksellisia lohkoketjusiirtoja.

- **Yksityiset lahjat** — lähetä ruusu 🌹 tai kaktus 🌵 (1 EVOLVE) ja valitse, kuka näkee, että lähettäjä olit sinä: _julkisesti_, _anonyymisti kaikille paitsi vastaanottajalle_ tai _täysin anonyymisti_. Anonyymeissä tiloissa lahja kulkee kertakäyttöisenä voucherina, jonka vastaanottaja lunastaa omalla lompakollaan, joten lähettäjä ei koskaan näy lohkoketjussa. (Lähettäjän anonymiteetti on tänään arkista: rahoitustransaktio voidaan yhdistää ajan ja summan perusteella.)
- **Railgun-suojattu lompakko** — ominaisuuslipun taakse sijoitettu yksityislompakko (`VITE_RAILGUN_ENABLED`, oletuksena pois päältä), joka piilottaa summat ja osoitteet Railgunin toimivan zero-knowledge-poolin avulla. Tämä on tie todelliseen lähettäjän anonymiteettiin.
- **Aztec-prototyyppi** — sama yksityissiirto- ja yksityissidontalogiikka ilmaistuna zero-knowledge-Noir-piireinä ja pidettynä erillisen portin takana, kunnes Aztec on tuotantovalmis. Katso [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md).
- **Kahden lompakon malli** — julkinen panoslompakko osallistuu hallintoon; yksityinen suojattu lompakko on tarkoituksella **suljettu pois** äänestyspainosta, jolloin yksityisyys ja äänivalta pysyvät erillään.

Yksityiskohdat: [docs/RAILGUN-INTEGRATION.md](docs/RAILGUN-INTEGRATION.md) · [docs/SHIELDED-STAKES-DESIGN.md](docs/SHIELDED-STAKES-DESIGN.md) · [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md).

## EVOLVE-token (vain testiverkko)

- ERC-20, enimmäisemissio **8 000 000 000 EVOLVE**. Ylläpitotoimet on suojattu 48 tunnin `TimelockController`-viiveellä.
- **Suunniteltu emissiojako** — suunniteltu panemaan lähes koko emissio töihin käyttäjien hyväksi, eikä sisäpiirin:

| Tarkoitus                                             |        EVOLVE |
| ----------------------------------------------------- | ------------: |
| Perustajat ja tiimi (palkka / palkinto)               |    25 000 000 |
| DEX-varanto (tulevaisuudessa)                         |     4 000 000 |
| Julkinen myynti (suunniteltu)                         |     5 000 000 |
| Palkintovaranto — laboratoriot, potilaat, äidit, isät | 7 966 000 000 |

- **Suunniteltu julkinen myynti** — 5 000 000 EVOLVE, joita sovellus myy hintaan **$0.8 kappaleelta**, maksettavissa millä tahansa sovelluksen tukemalla tokenilla; tuotot rahoittavat kehitystä. _(Suunniteltu — ei vielä käynnissä.)_
- **Trustless-emissio (suunniteltu)** — noin 7 966 000 000 EVOLVE:n palkintovaranto on tarkoitus lukita tyhjentämättömään `RewardVault`-holviin: se vapautuu ainoastaan vähitellen laboratorio-, potilas-, äiti- ja isäpalkintojen kautta, ja sääntömuutokset vaativat hallintoäänestyksen. Ei edes perustaja voi nostaa siitä varoja. Suunnitelma: [docs/REWARD-VAULT-PLAN.md](docs/REWARD-VAULT-PLAN.md).
- **Emojilahjatalous** — lahja maksaa 1 EVOLVE, joka jaetaan suhteellisesti nykyisten lahjojen omistajien kesken; loputon tulomalli, ja lahjat ovat siirrettävissä.
- **EvolveFund** — miesten staking (vähintään 15 EVOLVE, 30 päivän lukitus), joka lasketaan mukaan hallinnon äänestyspainoon; naiset käyttävät lompakkosaldoaan.
- **Varmennuspalkinnot** — 1 EVOLVE varmennetulle käyttäjälle ja 1 EVOLVE varmentaneelle laboratoriolle jokaista STD-/DNA-varmennusta kohden (sekä nopeusrajoitettu faucet).
- **Hallinto** — äänen paino yhdistää rekursiivisen maineen (8 ääntä, syvyys 3), lasten- ja isyysosuuden sekä stakatut tai hallussa pidetyt EVOLVE:t.
- **LayerZero OFT** -integraatio tulevia moniketjuisia EVOLVE-siirtoja varten (riippuvuudet ovat valmiina; Sepolian ulkopuolella ei ole vielä mitään käyttöönotettuna).

## Tue projektia

EVOLVE on riippumaton ja avointa lähdekoodia. Jos se on sinulle hyödyllinen, voit tukea kehitystä lahjoituksella — jokainen panos menee koodiin, laboratoriokumppanuuksiin, ylläpitoon ja käännöksiin.

- **Lahjoitustiedot (EVM, Monero ja muut):** [DONATE.md](DONATE.md)
- **Monikielinen lahjoitussivu (34 kieltä):** **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**

Julkinen token-myynti on **suunnitteilla** — 5 000 000 EVOLVE, joita sovellus myy (katso [EVOLVE-token](#evolve-token-vain-testiverkko)). Lahjoitukset ovat avoimen lähdekoodin kehittämistä tukevia lahjoja, eivätkä ne anna oikeutta tokeneihin, omistusosuuteen, tuottoihin tai voittoon. Lahjoita vain niin paljon kuin sinulla on varaa menettää.

## Arkkitehtuuri ja teknologiapino

Monorepo, jota hallitaan npm workspaces- ja Turborepo-työkaluilla:

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

Tärkeimmät älysopimukset: `EVOLVE.sol` (ERC-20), `ProfileNFT.sol` (ERC-721), `TrustScore.sol`, `Voting.sol`, `Evolve2Earn.sol` (emojilahjat + palkinnot), `Governance.sol`, `BondManager.sol` (hedelmöitys ja polyandrinen hedelmöitys), `EvolveFund.sol`, `VerificationRegistry.sol`, `DNAVerification.sol`, ERC-4337 `SmartAccountFactory` + `Paymaster` sekä OpenZeppelinen `TimelockController`.

Yksityiskohdat: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md)

## Tiekartta

Käynnissä: web-sovelluksen tuotantovalmius. Suunniteltu: lohkoketjupohjainen laboratoriorekisteri ja testien sertifiointi, oikean sähköpostipalvelun sovitin laboratorioraporttien vastaanottoon, lohkoketjussa varmennetut attestaatiot profiileissa, **trustless `RewardVault`** hallinnon ohjaamalla emissiolla ([suunnitelma](docs/REWARD-VAULT-PLAN.md)), **julkinen token-myynti**, perustaja-allokaation vesting-päivitys sekä DEX-likviditeetin käyttöönotto (tällä hetkellä estynyt — se edellyttää token-julkaisuja pääverkkoon). Yksityisyyden puolella lähettäjän yksityisyyden suojaavat lahjat ovat valmiit, kun taas Railgun-suojattu lompakko ja Aztecin yksityissidontamigraatio pysyvät vielä tarkistusporttien takana (katso [docs/ROADMAP.md](docs/ROADMAP.md) ja [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md)). Moniverkkolaajennus (Arbitrum, Avalanche ja muut EVM-ketjut) seuraa testiverkon vakauttamisen jälkeen.

Koko luettelo: [docs/ROADMAP.md](docs/ROADMAP.md).

## Aloittaminen (kehittäjille)

Vaatimukset: **Node.js 20+** ja npm 10.x.

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

## Osallistuminen

Panokset ovat tervetulleita — koodi, virheraportit, ominaisuusehdotukset ja aloitteet. Lue [CONTRIBUTING.md](CONTRIBUTING.md) ja [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) ennen kuin aloitat.

## Repositoriot (peilit)

| Peili    | URL                                        |
| -------- | ------------------------------------------ |
| GitHub   | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg | https://codeberg.org/limitafternoon/Evolve |
| GitLab   | https://gitlab.com/evolve-group3/evolve    |

## Dokumentaatio

- [Mikä ja miksi](docs/WHAT-AND-WHY.md) — ongelma, visio, ydinarvot
- [Miten se toimii](docs/HOW-IT-WORKS.md) — käyttäjän toimintopolut vaihe vaiheelta
- [Arkkitehtuuri](docs/ARCHITECTURE.md) — monorepo, paketit, datavirrat
- [Tokenomiikka](docs/TOKENOMICS.md) — token-malli ja emissiojako
- [RewardVault-suunnitelma](docs/REWARD-VAULT-PLAN.md) — trustless-emissio (suunniteltu)
- [Railgun-integraatio](docs/RAILGUN-INTEGRATION.md) — suojatun lompakon integraatiokokeilu
- [Suojatut panokset](docs/SHIELDED-STAKES-DESIGN.md) — yksityiset hedelmöityspanokset (suunnittelu)
- [Aztec-prototyyppi](docs/AZTEC-PROTOTYPE.md) — ZK-yksityissiirrot ja -sidokset (tutkimus)
- [Tiekartta](docs/ROADMAP.md) — virstanpylväät ja nykytila
- [FAQ](docs/FAQ.md) — usein kysytyt kysymykset
- [Lompakko-opas](docs/WALLETS.md) — miten luodaan lompakoita ja saadaan lahjoitusosoitteet

## Lisenssi

Lisensoitu [MIT-lisenssillä](LICENSE).

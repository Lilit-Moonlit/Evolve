[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)

# EVOLVE

**Deittailu, hedelmöitys ja varmennettu terveys — yksityinen oletuksena, luottettava siellä, missä sillä on merkitystä.**

EVOLVE on avoimen lähdekoodin hajautettu alusta ihmisille, jotka ovat kylläistyneet luovuttamaan puhelinnumeronsa, kasvonsa ja arkaluontoisimmat terveystietonsa jonkun muun tietokantaan. Kirjaudut sisään omalla kryptolompakollasi — ei puhelinta, ei sähköpostia, ei KYC:tä — ja saat tilisi takaisin lohkoketjuun sidotun DNA-sitoumuksen avulla. Terveystietosi pysyvät omasiasi: testitulokset jäsennetään automaattisesti, yksittäisten taudinaiheuttajien tiloja **ei näytetä koskaan** kenellekään, ja yhteensovittaminen nojaa vain anonyymeihin yhteensopivuustuomioihin (Safe / Compatible / Caution / Risk). Chat toimii vertaisverkossa libp2p:n ja Nostrin välityksellä, HTTP-vararatkaisu on olemassa mukavuuden vuoksi.

> **Tila — alusta toimii jo tänään; pääverkko ja DEX ovat seuraavaksi.**
> Deittailu, hedelmöitys, terveysvarmennus, laboratoriovaihe, P2P-chat, EVOLVE-token ja hallinto ovat kaikki käynnissä. Edessä on vielä: **päöverkon käyttöönotto ja DEX-likviditeetti** sekä **suunniteltu julkinen myynti** (katso [EVOLVE-token](#evolve-token-vain-testiverkko)).
> Älysopimukset on otettu käyttöön **vain Ethereum Sepolia -testiverkossa**. Mikään täällä ei ole sijoitusneuvontaa tai sijoitustarjous.

> **Löydätkö EVOLVE:n hyödylliseksi? Tue kehitystä — jokainen lahjoitus menee koodiin, laboratoriokumppanuuksiin, ylläpitoon ja käännöksiin → [DONATE.md](DONATE.md).**

## Ei pelättävää

EVOLVE rakennettiin niiden kysymysten ympärille, jotka ihmiset todella esittävät ennen kuin alkavat luottaa tällaiseen alustaan.

| Huoli                                                   | Mitä EVOLVE jo tekee asialle                                                                                                                                                      |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| "Terveystietoni vuotavat."                              | Yksittäisiä taudinaiheuttajatuloksia **ei näytetä koskaan** kenellekään — vain anonyymi tuomio: Safe / Compatible / Caution / Risk.                                               |
| "Kuvasi päätyvät jonnekin."                             | Kuvat ovat oletuksena sumennettuja. Omistaja myöntää **15 sekunnin** tai **pysyvän** katseluoikeuden — pyynnöstä tai omasta aloitteesta. Katselu on ilmaista.                     |
| "Joudun luovuttamaan henkilötodistuksen tai puhelimen." | Lompakkokirjautuminen (SIWE). Ei puhelinta, ei sähköpostia, ei KYC:tä. Palautus toimii lohkoketjun DNA-sitoumuksen kautta.                                                        |
| "Hän valehtelee olevansa terve."                        | Tulokset ovat **laboratoriovahvistettuja** (QR + kasvojenvastaavuus), ja parin testit otetaan **itse tapaamisessa** — tuoreet STD-tulokset merkitsevät, DNA ei vanhene.           |
| "Vieköö joku rahani ja katoaa?"                         | Hedelmöitys toimii todellisella riskipanoksella: miehen talletus liikkuu vasta, kun isyys on **vahvistettu**; muuten se yksinkertaisesti palautetaan hänelle.                     |
| "Onko token pump-and-dump?"                             | Myyntiä ei ole käynnissä tänään; koodi on avointa (MIT); liikkeeseen laskematon varaus on tarkoitus lukita **tyhjennyskelvottomaan holviin**, josta ei edes perustaja voi nostaa. |
| "Voiko alustan sammuttaa tai estää?"                    | Vertaisviestintä ensin, hajautettu tallennus (IPFS / Arweave), 18 EVM-verkkomääritystä eikä kovakoodattua verkkotunnusta.                                                         |

## Mikä & miksi

Perinteiset deittisovellukset pyytävät sinua vaihtamaan puhelinnumerosi, sähköpostiosoitteesi, kuvasi ja arkaluontoiset terveystietosi keskitettyyn tietokantaan — ja luottamaan siihen tietokantaan ikuisesti. EVOLVE lähtee vastakkaisesta lähtökohdasta: **yksityisyys oletuksena, itsehallinta ilman välittäjää ja ei yhtään kriittistä vikapistettä**.

- **Yksityisyys oletuksena** — terveystietoja ei koskaan paljasteta; vain anonyymit tuomiot.
- **Estokestävyys** — vertaisviestintä ensin, hajautettu tallennus, moniverkkosuunnittelu, ei kovakoodattuja verkkotunnuksia.
- **Itse hallittava identiteetti** — lompakkosi on kirjautumisesi; DNA-pohjainen palautus sähköpostin tai puhelimen sijaan.
- **Ei KYC-porttia** — alustan käyttöön ei vaadita viranomaistunnistusta, puhelinta tai sähköpostia.

Lue koko perustelu tiedostosta [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md).

## Terveys, johon voi todella luottaa

- Lataa STD-testi raakatekstinä tai PDF:nä (tekstikerroksen poiminta, OCR-vararatkaisu skannauksille).
- Jäsennin tuntee 8 taudinaiheuttajaa: HIV-1/2, kuppaa, klamydia, tippuria, HSV-1, HSV-2, B-hepatiitti, C-hepatiitti — englanninkielisissä, ukrainankielisissä ja venäjänkielisissä raporttimuodoissa.
- **Yksittäisen taudinaiheuttajan tilaa ei koskaan näytetä muille käyttäjille.** Profiilit näyttävät vain anonyymin tuomion: **Safe / Compatible / Caution / Risk**.
- Lohkoketjun DNA-tietueet (`DNAVerification.sol`) mahdollistavat palautuksen ja varmennuksen.

### Kumppanilaboratoriot — todisteita, ei lupauksia

Kävele kumppanilaboratorioon ja näytä QR-koodisi. Laboratorio skannaa sen, vahvistaa henkilöllisyytesi **kasvojenvastaavuudella** (jotta kukaan muu ei voi noutaa tulostasi) ja liittää STD-raportin — PDF, skannaus tai teksti, jopa huonolla OCR:lla. Tuloksen allekirjoittaa oikea laboratorio, et sinä, joten muut näkevät **varmennetun faktan** sanasi sijaan. Ja jokainen vahvistettu varmennus maksaa **1 EVOLVE potilaalle ja 1 EVOLVE laboratoriolle** — molemmilla osapuolilla on syy olla rehellisiä. Yksittäisiä taudinaiheuttajia ei siltikään koskaan näytetä kenellekään.

## Jonkun löytäminen

- Hakusuodattimet: "Mitä etsit" (deittailu / hedelmöitys / moniaviohedelmöitys / STD-testaus), "Ketä etsit" (miehet, naiset, parit), porrautuvat maa → kaupunki -valinnat, "voi matkustaa maahasi" maakohtaisine luetteloineen, ihonväri, testausmieltymys, vain STD-yhteensopivat.
- Perehdytysvelho: ikä (piilotettavissa), kielet, kuvaus, kuva.
- **P2P-chat** libp2p:n (gossipsub) + Nostrin välityksellä, HTTP-API-vararatkaisun kera.

## Hedelmöitys

Kaksi tapaa suunnitella lasta, ja molemmat nojaavat samaan ajatukseen: todellinen tarkoitus osoitetaan todellisella EVOLVE-panoksella — ei koskaan lupauksilla. Miehen sitoumus elää hänen EvolveFund-talletuksessaan (alkaen 15 EVOLVE, lukittuna vähintään 30 päiväksi), ja nainen voi asettaa oman vähimmäistalletuksensa niille miehille, jotka tavoittavat hänet.

**Hedelmöitys.** Nainen johtaa: hän kutsuu tietyn miehen ja nimeää tämän sidokseen. Mies tarvitsee aktiivisen EvolveFund-talletuksen; kun molemmat vahvistavat, se lukitaan ja lähtölaskenta alkaa. Raskaudesta ilmoitetaan 14–30 päivää vahvistuksen jälkeen, ja parin STD- ja DNA-testit otetaan itse tapaamisessa — tuoreet STD-tulokset merkitsevät, DNA ei vanhene. Kun isyys on vahvistettu, miehen talletus siirtyy naiselle; jos sitä ei vahvisteta, talletus yksinkertaisesti vapautetaan takaisin hänelle. Mikään ei vaihda omistajaa ennen kuin faktat ovat selvillä.

**Moniaviohedelmöitys.** Valinta kuuluu hänelle ja pysyy yksityisenä. Hän avaa istunnon, joka kestää 48 tuntia — ilman omaa talletusta (vain maineen vuoksi hän voi lisätä sellaisen, jos haluaa). Aktiivisen talletuksen omaavat miehet voivat liittyä — enintään 50 — ja vahvistaa, mikä lukitsee heidän panoksensa. Neljätoista päivää istunnon päättymisen jälkeen isä valitaan. Hän saa talletuksensa takaisin plus palkinnon poolista: kaksinkertaisen talletuksensa ja 1 EVOLVE jokaiselta muulta osallistujalta. Valitsemattomat miehet menettävät panoksensa — 90 % naiselle, 10 % valitulle isälle. Hän ei riskkaa mitään ja voi vain voittaa; miehet asettavat panoksensa oikeuden taakse tulla valituksi.

## EVOLVE-token (vain testiverkko)

- ERC-20, enimmäistarjonta **8,000,000,000 EVOLVE**. Ylläpitotoimet rajataan 48 tunnin `TimelockController`-lukolla.
- **Suunniteltu tarjontajako** — suunniteltu panemaan lähes koko tarjonta töihin käyttäjien hyväksi, eikä sisäpiirin:

| Tarkoitus                                            |        EVOLVE |
| ---------------------------------------------------- | ------------: |
| Perustajat ja tiimi (palkka / palkinto)              |    25,000,000 |
| DEX-varaus (tulevaisuus)                             |     4,000,000 |
| Julkinen myynti (suunniteltu)                        |     5,000,000 |
| Palkintovaraus — laboratoriot, potilaat, äidit, isät | 7,966,000,000 |

- **Suunniteltu julkinen myynti** — 5,000,000 EVOLVE sovellus myy hintaan **$0.8 kappaleelta**, maksettavana millä tahansa sovelluksen tukemalla tokenilla; tuotot rahoittavat kehitystä. _(Suunniteltu — ei vielä käynnissä.)_
- **Luottamukseton emissio (suunniteltu)** — noin 7,966,000,000 EVOLVE:n palkintovaraus lukitaan tyhjennyskelvottomaan `RewardVault`-holviin: se vapautuu vain vähitellen laboratorio-, potilas-, äiti- ja isäpalkintoina, ja sääntömuutokset vaativat hallintoäänestyksen. Ei edes perustaja voi nostaa siitä. Suunnitelma: [docs/REWARD-VAULT-PLAN.md](docs/REWARD-VAULT-PLAN.md).
- **Emojilahjatalous** — lahja maksaa 1 EVOLVE, joka jaetaan suhteellisesti olemassa olevien lahjanomistajien kesken; loputon tulomalli, ja lahjat ovat siirrettäviä.
- **EvolveFund** — miesten staking (väh. 15 EVOLVE, 30 päivän lukitus), joka lasketaan hallintopainoon; naiset käyttävät lompakkosaldoaan.
- **Vahvistuspalkinnot** — 1 EVOLVE vahvistetulle käyttäjälle ja 1 EVOLVE vahvistavalle laboratoriolle per STD-/DNA-varmennus (sekä käytön mukaan rajoitettu hana).
- **Hallinto** — äänipaino yhdistää rekursiivisen maineen (8 ääntä, syvyys 3), lapsi-/isyysosuuden sekä stakatut tai pidetyt EVOLVE:t.
- **LayerZero OFT** -integraatio tulevaisuuden moniketjuisiin EVOLVE-siirtoihin (riippuvuudet valmiina; Sepolian ulkopuolella ei ole vielä otettu mitään käyttöön).

## Tue projektia

EVOLVE on riippumaton ja avoimen lähdekoodin projekti. Jos se on sinulle hyödyllinen, voit tukea kehitystä lahjoituksella — jokainen panos menee koodiin, laboratoriokumppanuuksiin, ylläpitoon ja käännöksiin.

- **Lahjoitustiedot (EVM, Monero ja muut):** [DONATE.md](DONATE.md)
- **Monikielinen lahjoitussivu (34 kieltä):** **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**

Julkinen tokenmyynti on tiekartalla, mutta se **ei** ole käynnissä tänään. Lahjoitukset ovat lahjoja, jotka tukevat avoimen lähdekoodin kehitystä eivätkä anna oikeutta tokeneihin, omistusosuuksiin, tuottoihin tai voittoon. Anna vain sitä, minkä sinulla on varaa menettää.

## Arkkitehtuuri & teknologiapino

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

Keskeiset älysopimukset: `EVOLVE.sol` (ERC-20), `ProfileNFT.sol` (ERC-721), `TrustScore.sol`, `Voting.sol`, `Evolve2Earn.sol` (emojilahjat + palkinnot), `Governance.sol`, `BondManager.sol` (hedelmöitys ja moniaviohedelmöitys), `EvolveFund.sol`, `VerificationRegistry.sol`, `DNAVerification.sol`, ERC-4337 `SmartAccountFactory` + `Paymaster` sekä OpenZeppelinin `TimelockController`.

Yksityiskohdat: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md)

## Tiekartta

Työn alla: verkkosovelluksen tuotantovalmius. Suunnitteilla: lohkoketjussa oleva laboratoriorekisteri ja testisentifiointi, oikea sähköpostipalvelun sovitin laboratioraporttien vastaanottoon, lohkoketjuvarmennetut todistukset profiileissa, **luottamukseton RewardVault** hallinnon ohjaamalla emissiolla ([suunnitelma](docs/REWARD-VAULT-PLAN.md)), **julkinen tokenmyynti**, token-vesting-päivitys perustajaosuudelle sekä DEX-likviditeetin tarjoaminen (tällä hetkellä estynyt — se vaatii tokenien käyttöönotot pääverkoissa). Moniverkkolaajennus (Arbitrum, Avalanche ja muut EVM-ketjut) seuraa testiverkon kovettamisen jälkeen.

Koko luettelo: [docs/ROADMAP.md](docs/ROADMAP.md).

## Aloittaminen (kehittäjät)

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

Panokset ovat tervetulleita — koodi, virheraportit, ominaisuusehdotukset ja esitykset. Lue [CONTRIBUTING.md](CONTRIBUTING.md) ja [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) ennen kuin aloitat.

## Repot (peilikopiot)

| Peili    | URL                                        |
| -------- | ------------------------------------------ |
| GitHub   | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg | https://codeberg.org/limitafternoon/Evolve |
| GitLab   | https://gitlab.com/evolve-group3/evolve    |

## Dokumentaatio

- [Mikä & miksi](docs/WHAT-AND-WHY.md) — ongelma, visio, ydinarvot
- [Miten se toimii](docs/HOW-IT-WORKS.md) — käyttäjävirrat, vaihe vaiheelta
- [Arkkitehtuuri](docs/ARCHITECTURE.md) — monorepo, paketit, datavirrat
- [Tokenomics](docs/TOKENOMICS.md) — tokenmalli ja tarjontajako
- [RewardVault-suunnitelma](docs/REWARD-VAULT-PLAN.md) — luottamukseton emissio (suunniteltu)
- [Tiekartta](docs/ROADMAP.md) — virstanpylväät ja nykytila
- [UKK](docs/FAQ.md) — usein kysytyt kysymykset
- [Lompakko-opas](docs/WALLETS.md) — miten luot lompakoita ja saat lahjoitusosoitteita

## Lisenssi

Lisensoitu [MIT-lisenssillä](LICENSE).

[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)

# EVOLVE

**Deittailu, hedelmöitys ja terveystodentaminen — yksityinen oletuksena, todennettu siellä, missä se merkitsee.**

EVOLVE on avoimen lähdekoodin hajautettu alusta varmistettuja läheisiä yhteyksiä varten: deittailu, hedelmöitys ja anonyymi sukupuolitauti-/DNA-yhteensopivuus. Kirjaudut sisään omalla kryptolompakollasi (Sign-In with Ethereum) — ei puhelinnumeroa, ei sähköpostia, ei KYC:tä — ja voit palauttaa tilisi ketjuun sidotun DNA-sitoumuksen avulla. Terveystiedot pysyvät sinun: laboratoriotulokset jäsennetään automaattisesti, yksittäisten taudinaiheuttajien statuksia **ei näytetä koskaan** kenellekään, ja yhteensovittaminen perustuu vain anonyymeihin yhteensopivuusarvioihin (Safe / Compatible / Caution / Risk). Chat toimii vertaisverkossa libp2p:n ja Nostrin kautta, ja HTTP-vararatkaisu on olemassa mukavuuden vuoksi; sovelluksessa on lisäksi kevyt julkinen "Safety Mode" -julkisivu sekä itsenäinen Companion Mode sukupuolitautitestien arviointiin.

> **Tila: varhaisen vaiheen alfa.** EVOLVE on aktiivisen kehityksen alla eikä ole valmis tuote.
> Älysopimukset on otettu käyttöön **vain Ethereum Sepolia -testiverkossa**.
> **Ei pääverkon käyttöönottoa, ei DEX:ää, ei likviditeettiä eikä julkista token-myyntiä** — eikä mitään näistä ole luvattu.
> Ominaisuudet voivat muuttua tai rikkoutua milloin tahansa. Mikään tässä ei ole taloudellinen neuvo tai sijoitustarjous.

## Mitä & miksi

Perinteiset deittailualustat pyytävät sinua luovuttamaan puhelinnumerosi, sähköpostiosoitteesi, kuvasi ja intiimit terveystietosi keskitettyyn tietokantaan. EVOLVE lähtee liikkeelle päinvastaisesta oletuksesta: yksityisyys oletuksena, itsehallinta (self-custody) eikä mitään keskitettyä vikapistettä. Ydinarvot:

- **Yksityisyys oletuksena** — terveystietoja ei koskaan paljasteta; vain anonyymejä arvioita.
- **Kieltämisen kestävyys** — P2P-ensisijainen viestintä, hajautettu tallennus (IPFS / Arweave), moniverkkoinen suunnittelu, ei kovakoodattuja verkkotunnuksia.
- **Itse hallittava identiteetti** — lompakkosi on kirjautumistunnuksesi; DNA-pohjainen palautus sähköpostin/puhelimen sijaan.
- **Ei KYC-porttia** — alustan käyttöön ei vaadita viranomaistunnistetta, puhelinta tai sähköpostia.

Koko perustelu: [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md) (englanniksi).

## Tärkeimmät ominaisuudet

### Identiteetti & yksityisyys

- **SIWE-lompakkokirjautuminen** (MetaMask ja muut EVM-lompakot) — sensuurinkestävä varareitti.
- **DNA-tilinpalautus** — DNA-testituloksestasi lasketaan tiiviste (SHA-256, sidotaan ketjuun `bytes32`-muodossa), ja se voi palauttaa pääsyn ilman puhelinta tai sähköpostia.
- **Account Abstraction (ERC-4337)** — älytilit ja paymaster gaasittomaan onboardingiin; SIWE pysyy aina käytettävissä.

### Anonyymi terveysyhteensopivuus

- Lataa sukupuolitautitestien tulokset raakatekstinä tai PDF:nä (tekstikerroksen poiminta; skannatuille sivuille OCR-vararatkaisu).
- Jäsentä tunnistaa 8 taudinaiheuttajaa: HIV-1/2, kuppa, klamydia, tippuri, HSV-1, HSV-2, B-hepatiitti, C-hepatiitti (englannin-, ukrainan- ja venäjänkieliset raporttimuodot).
- **Yksittäisen taudinaiheuttajan statusta ei koskaan näytetä muille käyttäjille.** Profiileissa näkyy vain anonyymi arvio: **Safe / Compatible / Caution / Risk**.
- Ketjuun tallennetut DNA-varmennustiedot (`DNAVerification.sol`) mahdollistavat palautus- ja varmennusprosessit.

### Profiilit, haku & viestintä

- Hakusuodattimet: "Mitä etsit" (deittailu / hedelmöitys / polyandrinen hedelmöitys / sukupuolitautitestaus), "Ketä etsit" (miehet, naiset, parit), porrastetut maa → kaupunki -valinnat, "voi saapua maahasi" maa kerrallaan -listoineen, ihonväri, testausmieltymys, vain sukupuolitautiyhteensopivat.
- Onboarding-velho: ikä (piilotettavissa), kielet, kuvaus, valokuva.
- **Valokuvien yksityisyys**: valokuvat ovat oletuksena sumennettuja; omistaja myöntää 15 sekunnin tai pysyviä katseluoikeuksia joko omasta aloitteestaan tai pyynnöstä. Katselu on maksutonta.
- **P2P-chat** libp2p:n (gossipsub) + Nostrin kautta, HTTP-API-varalla.

### Hedelmöitystilat

- **Tila 2 — Pregnancy Bond**: nainen luo bondin, mies panostaa EVOLVEa (≥ 100 nykyisessä testiverkkoversiossa), molemmat vahvistavat; vahvistetun raskauden ja isyyden jälkeen panos siirtyy naiselle.
- **Tila 3 — Cryptic Choice**: nainen avaa 48 tunnin istunnon, miehet liittyvät panostamalla; hän valitsee isän — tämän panos palautetaan, loput jakavat: 90 % hänelle / 10 % valitulle isälle.

### Laboratoriot & varmentaminen

- **Laboratoriokumppanivirta**: laboratoriot rekisteröityvät kumppaneiksi, varmentavat potilaat QR-koodilla ja kasvontunnistuksella sekä liittävät sukupuolitautiraportteja (PDF/teksti OCR-poiminnalla).
- **Companion Mode**: itsenäinen virta sukupuolitautitestitulosten arviointiin ilman deittailualustalle liittymistä.
- **Safety Mode** (`VITE_PRODUCT_MODE=safety`): rajoitettu julkinen julkisivu (sukupuolitauditilanne, julkiset profiililinkit, yhteensopivuustarkistukset), joka jatkaa toimintaansa silloinkin, kun deittailu-/hedelmöitysominaisuudet rajoitetaan jossakin lainkäyttöalueella tai sovelluskaupassa.

### EVOLVE-token (vain testiverkossa)

- ERC-20, enimmäismäärä 8 000 000 000 EVOLVE, ylläpitotoimet 48 tunnin TimelockControllerin takana.
- **Emoji-lahjatalous**: lahja maksaa 1 EVOLVE, joka jaetaan suhteellisesti olemassa olevien lahjojen omistajille — pysyvä tulomalli haltijoille; lahjat ovat siirrettävissä.
- **EvolveFund**: miesten stakkaus (vähintään 15 EVOLVE, 30 päivän lukitus), joka lasketaan mukaan hallinnon äänipainoon; naiset käyttävät lompakkosaldoaan.
- **Varmennuspalkkiot**: 1 EVOLVE varmennetulle käyttäjälle ja 1 EVOLVE varmentaneelle laboratoriolle sukupuolitauti-/DNA-varmennuksesta (sekä määrärajoitettu testihana).
- Hallinnon äänipaino yhdistää rekursiivisen maineen (8 ääntä, syvyys 3), lasten/isyyksien osuuden sekä stakatun tai pidetyn EVOLVEn.
- **LayerZero OFT** -integraatio tulevia moniketjuisia EVOLVE-siirtoja varten (riippuvuudet valmiina; Sepolian ulkopuolella ei vielä mitään käyttöönottoa).

### Alusta

- Webbisovellus (PWA-asennettavissa) ja Expo/React Native -mobiilisovellus.
- Käyttöliittymä käännetty **34 kielelle**.
- Moniverkkovalmis: 18 EVM-verkon määritystä (Arbitrum ja Avalanche ovat suunnitellut ensisijaiset L2-verkot — **ei vielä otettu käyttöön**).

## Arkkitehtuuri & teknologiapino

Monorepo, jota hallitaan npm workspaces + Turborepo -työkaluilla:

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

Tärkeimmät älysopimukset: `EVOLVE.sol` (ERC-20), `ProfileNFT.sol` (ERC-721), `TrustScore.sol`, `Voting.sol`, `Evolve2Earn.sol` (emoji-lahjat + palkkiot), `Governance.sol`, `BondManager.sol` (tilat 2 & 3), `EvolveFund.sol`, `VerificationRegistry.sol`, `DNAVerification.sol`, ERC-4337 `SmartAccountFactory` + `Paymaster` sekä OpenZeppelinin `TimelockController`.

Yksityiskohdat: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md) (englanniksi).

## Tiekartta

Työn alla: webbisovelluksen tuotantovalmius. Suunnitteilla: ketjussa toimiva laboratoriorekisteri ja testisertifiointi, oikean sähköpostipalvelun sovitin laboratorioraporttien vastaanottoon, ketjuun varmennetut todistukset profiileissa, token-vestingin päivitys perustajien/kehittäjien allokointeihin, DEX-likviditeetin tarjoaminen (tällä hetkellä estynyt — vaatii tokenien pääverkkokäyttöönotot). Moniverkkolaajennus (Arbitrum, Avalanche ja muut EVM-ketjut) tulee testiverkon kovettamisen jälkeen.

Täydellinen luettelo: [docs/ROADMAP.md](docs/ROADMAP.md) (englanniksi).

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

Panos on tervetullut — koodi, virheraportit, ominaisuusehdotukset ja proposalit. Lue ennen aloitusta [CONTRIBUTING.md](CONTRIBUTING.md) ja meidän [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Tue projektia

Jos EVOLVE osoittautuu hyödylliseksi, voit tukea kehitystä lahjoituksella — yksityiskohdat tiedostossa [DONATE.md](DONATE.md). Haluatko mieluummin verkkosivun? Käytä monikielistä lahjoitussivua (34 kieltä): **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**.

**Token-myyntiä ei ole eikä sitä tule.** EVOLVE-tokeneihin ei voi "sijoittaa"; lahjoitukset ovat lahjoja avoimen lähdekoodin kehityksen tukemiseksi, eivätkä ne oikeuta lahjoittajia tokeneihin, osuuteen, tuottoihin tai mihinkään taloudelliseen vaatimukseen.

## Repositoriot (peilit)

| Peili    | URL                                        |
| -------- | ------------------------------------------ |
| GitHub   | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg | https://codeberg.org/limitafternoon/Evolve |
| GitLab   | https://gitlab.com/evolve-group3/evolve    |

## Dokumentaatio

- [Mitä & miksi](docs/WHAT-AND-WHY.md) — ongelma, visio, ydinarvot (englanniksi)
- [Näin se toimii](docs/HOW-IT-WORKS.md) — käyttäjäprosessit vaihe vaiheelta (englanniksi)
- [Arkkitehtuuri](docs/ARCHITECTURE.md) — monorepo, paketit, tietovirrat (englanniksi)
- [Tokenomics](docs/TOKENOMICS.md) — token-malli ja tarjonnan jakauma (englanniksi)
- [Tiekartta](docs/ROADMAP.md) — virstanpylväät ja nykytila (englanniksi)
- [UKK](docs/FAQ.md) — usein kysytyt kysymykset (englanniksi)
- [Lompakko-opas](docs/WALLETS.md) — miten luoda lompakkoja ja saada lahjoitusosoitteita (englanniksi)

## Lisenssi

Lisensoitu [MIT-lisenssillä](LICENSE).

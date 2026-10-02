[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)

# EVOLVE

**Stefnumót, getnaður og heilsustaðfesting — persónuvernd sjálfgefin, staðfest þar sem skiptir máli.**

EVOLVE er opinn, dreifður vettvangur fyrir staðfestanlegar náin tengsl: stefnumót, getnaður og nafnlaus STD/DNA-samhæfni. Þú skráir þig inn með eigin krypto-veski (Sign-In with Ethereum) — ekkert símanúmer, enginn tölvupóstur, engin KYC — og þú getur endurheimt reikninginn þinn með DNA-skuldbindingu á keðju. Heilsugögn eru áfram þínar: rannsóknarniðurstöður eru þáttaðar sjálfvirkt, staða stakra sýkla er **aldrei** sýnd neinum, og samsvar byggir aðeins á nafnlausum samhæfnisdómum (Safe / Compatible / Caution / Risk). Spjallið keyrir jafnað á milli (peer-to-peer) yfir libp2p og Nostr, með HTTP-vararútgáfu til þæginda, og forritið kemur með létta opinbera „Safety Mode“-framhlið og sjálfstæðan Companion Mode til að meta STD-prófanir.

> **Staða: alfa-stig í upphafi.** EVOLVE er í virkri þróun og er ekki fullunnin vara.
> Snjallsamningar eru settir upp **aðeins á Ethereum Sepolia-prófunarnetinu**.
> Það er **engin uppsetning á aðalneti (mainnet), enginn DEX, ekkert lausafé og engin opinber sölu tákns** — og ekkert slíkt er lofað.
> Eiginleikar geta breyst eða brotnað hvenær sem er. Ekkert hér er fjármálaráðgjöf eða fjárfestingartilboð.

## Hvað & hvers vegna

Hefðbundnu stefnumótssvæðin biðja þig að afhenda símanúmer, tölvupóst, ljósmyndir og nákvæmar heilsuupplýsingar til miðlægrar gagnagrunns. EVOLVE byrjar á öfugu forsendunum: persónuvernd sjálfgefin, eigin varsla (self-custody) og enginn miðlægur bilunarstaður. Kjarnagildi:

- **Persónuvernd sjálfgefin** — heilsugögn eru aldrei gerðar opinberar; aðeins nafnlausir dómar.
- **Viðnám gegn bönnum** — P2P-fyrst skilaboð, dreifð geymsla (IPFS / Arweave), margnets-hönnun, engin fastkóðuð lén.
- **Sjálfvöruð auðkenni** — veskið þitt er innskráningin þín; DNA-byggð endurheimt í stað tölvupósts/síma.
- **Engin KYC-hurð** — hvorki skilríki, sími né tölvupóstur er nauðsynlegur til að nota vettvanginn.

Lestu öllu röksemdafærsluna í [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md) (á ensku).

## Lykileiginleikar

### Auðkenni & persónuvernd

- **SIWE-veskisinnskráning** (MetaMask og önnur EVM-veski) — flótinn leiðin gegn ritskoðun.
- **DNA-endurheimt reiknings** — DNA-prófaúrfall þitt er tætt með hass (SHA-256, skuldbundið á keðju sem `bytes32`) og getur endurheimt aðganginn án síma eða tölvupósts.
- **Account Abstraction (ERC-4337)** — snjallreikningar og paymaster fyrir gaslausa nýskráningu; SIWE er alltaf tiltækt.

### Nafnlaus heilsusamhæfni

- Hlaðið upp STD-prófaúrföllum sem hráu texta eða PDF (textaútdráttur með OCR-vararútgáfu fyrir skannaðar síður).
- Þáttarinn þekkir 8 sýkla: HIV-1/2, syfílis, klamydíu, gonnóreu, HSV-1, HSV-2, lifrarbólgu B (hepatitis B), lifrarbólgu C (hepatitis C) (ensk, úkraínsk og rússnesk skýrslusnið).
- **Staða stakra sýkla er aldrei sýnd öðrum notendum.** Prófílar sýna aðeins nafnlausan dóm: **Safe / Compatible / Caution / Risk**.
- DNA-staðfestingarfærslur á keðju (`DNAVerification.sol`) knýja endurheimtar- og staðfestingarferla.

### Prófílar, leit & samskipti

- Leitarsíur: „Hvað leitarðu að“ (stefnumót / getnaður / kvenfjölkvænn getnaður / STD-prófanir), „Hverjum leitarðu að“ (karlar, konur, pör), fellandi land → borg-val, „getur komið til landsins þíns“ með listum fyrir hvert land, húðlit, val um prófþátttöku, aðeins STD-samhæft.
- Nýskráningarleiðbeiningar: aldur (má falast), tungumál, kynningartexti, ljósmynd.
- **Ljósmynda persónuvernd**: ljósmyndir eru óskýrar sjálfgefið; eigandinn veitir 15 sekúndna eða varanlega sýn — af eigin frumkvæði eða á beiðni. Að skoða er ókeypis.
- **P2P-spjall** yfir libp2p (gossipsub) + Nostr, með HTTP-API-vararútgáfu.

### Getnaðarhamir

- **Hamur 2 — Pregnancy Bond**: kona stofnar bond, karlmaður setur EVOLVE í veðsetningu (≥ 100 í núverandi prófunarútgáfu), bæði staðfesta; eftir staðfesta þungun og feðravísni fer veðsetningin til konunnar.
- **Hamur 3 — Cryptic Choice**: kona opnar 48 klukkustunda setu, karlar taka þátt með veðsetningu; hún velur föðurinn — veðsetning hans er endurgreidd, hinir skipta: 90 % til hennar / 10 % til valda föður.

### Rannsóknarstofur & staðfesting

- **Félagsferill rannsóknarstofa**: rannsóknarstofur skrá sig sem félaga, staðfesta sjúklinga með QR-kóða og andlitsjöfnun og hengja STD-skýrslur við (PDF/texti með OCR-útdráttur).
- **Companion Mode**: sjálfstæður ferill til að meta STD-prófaúrföll án þess að ganga í stefnumótarsvæðið.
- **Safety Mode** (`VITE_PRODUCT_MODE=safety`): takmörkuð opinber framhlið (STD staða, opinberar prófílatenglar, samhæfnisathuganir) sem helst virk jafnvel þótt stefnumóts-/getnaðareiginleikar séu takmarkaðir í lögsögu eða forritabúð.

### EVOLVE-tákn (aðeins prófunarnet)

- ERC-20, hámarksframboð 8 000 000 000 EVOLVE, stjórnandaaðgerðir fara í gegnum 48 klukkustunda TimelockController.
- **Emoji-gjafahagkerfi**: gjöf kostar 1 EVOLVE, sem skiptist hlutfallslega milli núverandi gjafaeigenda — varanlegt tekjulíkan fyrir handhafa; gjafir eru færanlegar.
- **EvolveFund**: karlmannleg veðsetning (min. 15 EVOLVE, 30 daga lás) sem telst með í stjórnunarþunga; konur nota veskisjöfnuð sinn.
- **Staðfestingarlaun**: 1 EVOLVE til staðfests notanda og 1 EVOLVE til staðfestandi rannsóknarstofu við STD/DNA-staðfestingu (auk takmörkuðs prófunarkrana (faucet)).
- Stjórnunarþungi sameinar endurkvæmt orðspor (8 atkvæði, dýpt 3), hlutfall barna/feðravísni og veðsett eða haldið EVOLVE.
- **LayerZero-OFT**-samþætting fyrir framtíðarmargnets EVOLVE-yfirfærslur (kerfiskröfur á sínum stað; ekkert uppsett utan Sepolia ennþá).

### Vettvangur

- Vefforrit (PWA-uppsetjanlegt) og smásímaforrit byggt í Expo/React Native.
- Viðmót þýtt í **34 tungumálum**.
- Margnets-tilbúið: 18 EVM-netstillingar (Arbitrum og Avalanche eru áætluð aðal-L2-netin — **ekki uppsett ennþá**).

## Skipulag & tækni

Einn geymslustaður (monorepo) stýrt með npm workspaces + Turborepo:

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

Aðalsnjallsamningar: `EVOLVE.sol` (ERC-20), `ProfileNFT.sol` (ERC-721), `TrustScore.sol`, `Voting.sol`, `Evolve2Earn.sol` (emoji-gjafir + verðlaun), `Governance.sol`, `BondManager.sol` (hamir 2 & 3), `EvolveFund.sol`, `VerificationRegistry.sol`, `DNAVerification.sol`, ERC-4337 `SmartAccountFactory` + `Paymaster` og OpenZeppelin-`TimelockController`.

Nánar: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md) (á ensku).

## Roadmap

Í vinnslu: fullkomnun vefforritsins fyrir framleiðslu. Áætlað: rannsóknarstofaskrá og prófavottorð á keðju, raunverulegur tölvupóstþjónustuaðila fyrir móttöku rannsóknarskýrslna, staðfest vottorð á keðju á prófílum, uppfærsla á táknvestingu fyrir stofnenda-/þróendaeign, DEX-lausafjárútbúgging (nú stöðvuð — krefst aðalnetsuppsetningar táknsins). Margnetsútvíkkun (Arbitrum, Avalanche og aðrar EVM-keðjur) fylgir eftir herðingu á prófunarnetinu.

Fullur listi: [docs/ROADMAP.md](docs/ROADMAP.md) (á ensku).

## Komast í gang (þróendur)

Kröfur: **Node.js 20+** og npm 10.x.

```bash
# Klóna og setja upp öll workspaces
git clone https://github.com/Lilit-Moonlit/Evolve.git
cd Evolve
npm install

# Vefforrit (Vite-þróunarvefþjónn á http://localhost:3000)
cd apps/web
npm run dev
npm test                # vitest-safn

# Snjallsamningar
cd packages/contracts
npm run compile         # hardhat compile
npm test                # hardhat-prófunarsafn
npm run deploy:local    # setja alla samninga upp á in-process Hardhat-net
```

## Þátttaka

Framlög eru velkomin — kóði, villuskýrslur, tillögur að eiginleikum og tillögur að breytingum. Lestu [CONTRIBUTING.md](CONTRIBUTING.md) og [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) okkar áður en þú byrjar.

## Styðja verkefnið

Ef þér finnst EVOLVE gagnlegt geturðu stutt þróunina með framlagi — upplýsingar í [DONATE.md](DONATE.md). Kjósið frekar vefsíðu? Notaðu málföðruðu framlagssíðuna (34 tungumál): **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**.

**Það er engin sölu tákns og verður aldrei.** Ekki er hægt að „fjárfesta“ í EVOLVE-táknum; framlög eru gjafir til að styðja þróun opins hugbúnaðar og veita gjafanda enga réttindi til tákns, eiginfjár, ávöxtunar eða nokkurra fjármálakrafna.

## Kóðasöfn (spegild)

| Spegill  | URL                                        |
| -------- | ------------------------------------------ |
| GitHub   | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg | https://codeberg.org/limitafternoon/Evolve |
| GitLab   | https://gitlab.com/evolve-group3/evolve    |

## Skjölun

- [Hvað & hvers vegna](docs/WHAT-AND-WHY.md) — vandamál, sýn, kjarnagildi (enska)
- [Hvernig það virkar](docs/HOW-IT-WORKS.md) — notendaferlar, skref fyrir skref (enska)
- [Skipulag](docs/ARCHITECTURE.md) — monorepo, pakkar, gagnaflæði (enska)
- [Tokenomics](docs/TOKENOMICS.md) — táknlíkan og úthlutun framboðs (enska)
- [Roadmap](docs/ROADMAP.md) — tímamót og núverandi staða (enska)
- [FAQ](docs/FAQ.md) — algengar spurningar (enska)
- [Veskishandbók](docs/WALLETS.md) — hvernig stofnað er veski og hvernig fást framlagsvistir (enska)

## Notkunarleyfi

Gefið út undir [MIT-notkunarleyfinu](LICENSE).

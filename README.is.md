[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)

# EVOLVE

**Stefnumót, getnaður og sannað heilsufar — persónuvernd að sjálfgefnu, traust þar sem máli skiptir.**

EVOLVE er opinn og dreifður vettvangur fyrir fólk sem er búið að láta símanúmer sitt, andlit sitt og mostu einkalífsheilbrigðisgögn sín fara í gagnagrunn annarra. Þú skráir þig inn með eigin kryptoveski — enginn sími, enginn tölvupóstur, engin KYC — og þú getur fengið reikninginn þinn aftur með DNA-skuldbindingu á blokkkeðju. Heilbrigðisgögnin þín verða áfram þín: prófniðurstöður eru þáttaðar sjálfvirkt, stöður einstakra sýkla eru **aldrei** sýndar neinum, og samsvörun byggir aðeins á nafnlausum samhæfnisdómum (Safe / Compatible / Caution / Risk). Spjallið keyrir jafningja til jafningja (peer-to-peer) yfir libp2p og Nostr, með HTTP-varasíðu þæginda sakar.

> **Staða — vettvangurinn virkar í dag; aðalnet (mainnet) og DEX eru næst.**
> Stefnumót, getnaður, heilbrigðissannprófun, rannsóknarstofuferlið, P2P-spjall, EVOLVE-táknið og stjórn eru öll í gangi. Enn þá vantar: **uppsetningu á aðalneti og DEX-miðlægni**, auk **skipulagðs opinbers sölu** (sjá [EVOLVE-táknið](#evolve-táknmyntin-aðeins-prófunarnet)).
> Samningarnir eru settir upp **aðeins á Ethereum Sepolia prófunarnetinu**. Ekkert hér er fjármálaráðgjöf eða fjárfestingartilboð.

> **Finndu EVOLVE gagnlegt? Styddu þróunina — hvert framlag fer í kóða, samstarf við rannsóknarstofur, hýsingu og þýðingu → [DONATE.md](DONATE.md).**

## Ekkert að óttast

EVOLVE var byggt í kringum þau spurningar sem fólk spyr í raun áður en það byrjar að treysta slíkum vettvangi.

| Áhyggjuna                                              | Það sem EVOLVE gerir þegar við henni                                                                                                                                          |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| „Heilbrigðisgögnin mín leka."                          | Niðurstöður einstakra sýkla eru **aldrei** sýndar neinum — aðeins nafnlaus dómgildurdómur: Safe / Compatible / Caution / Risk.                                                |
| „Myndirnar mínar enda einhvers staðar."                | Myndir eru óskýrar að sjálfgefnu. Eigandinn veitir **15 sekúndna** eða **varanlega** sýn — fyrirspurn eða frumkvæði. Að skoða er ókeypis.                                     |
| „Ég þarf að afhenda skilríki eða síma."                | Innskráning með veski (SIWE). Enginn sími, enginn tölvupóstur, engin KYC. Endurheimt fer fram með DNA-skuldbindingu á blokkkeðju.                                             |
| „Hann eða hún lygur um að vera heilbrigð/ur."          | Niðurstöður eru **rannsóknarstofusannaðar** (QR + andlitsjöfnun), og próf parinu eru tekin **við sjálft fundinn** — nýlegar STD-niðurstöður skipta máli, DNA eldist ekki.     |
| „Tekur einhver peningana mína og hvarfst?"             | Getnaðurinn byggir á raunverulegri, áhættusettinni veðsetningu: innborgun karlmanns hreyfist aðeins þegar feðravídd er **sönnuð**; annars er hún einfaldlega skilað til hans. |
| „Er táknið pump-and-dump?"                             | Engin sala er í gangi í dag; kóðinn er opinn (MIT); óbrúkaða varasjóðnum er ætlað að vera læstur í **óþurrandi hvelfingu** sem ekki einu sinni stofnandinn getur tekið úr.    |
| „Getur vettvangurnum verið lagður niður eða bannaður?" | Jafningjaskilaboð fyrst, dreifð geymsla (IPFS / Arweave), 18 EVM-netstillingar og engin harðkóðuð lén.                                                                        |

## Hvað & hvers vegna

Hefðbundnar stefnumótssmáforrit biðja þig að skipta á símanúmeri, tölvupósti, myndum og nákvæmum heilsuupplýsingum gegn miðlægum gagnagrunni — og treysta svo honum að eilífu. EVOLVE byrjar á gagnstæðu forsendunum: **persónuvernd að sjálfgefnu, eigin varðveisla og ekkert stakt bilunarpunktur**.

- **Persónuvernd að sjálfgefnu** — heilsugögnum er aldrei haldið upp á; aðeins nafnlausir dómar.
- **Viðnám gegn bönnum** — jafningjaskilaboð fyrst, dreifð geymsla, margnetahönnun, engin harðkóðuð lén.
- **Sjálfvarðveitt auðkenni** — veskið þitt er innskráningin þín; DNA-byggð endurheimt í stað tölvupósts eða síma.
- **Engin KYC-hurð** — engin ríkisauðkenni, sími eða tölvupóstur nauðsynlegur til að nota vettvanginn.

Lestu öll röksemdafærsluna í [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md).

## Heilsufar sem þú getur í raun treyst

- Hladdu upp STD-prófi sem hrám texta eða PDF (þáttun textalags, með OCR-varasíðu fyrir skönnun).
- Þáttarinn þekkir 8 sýkla: HIV-1/2, syfils, klamydíu, gonnórru, HSV-1, HSV-2, lifrarbólgu B, lifrarbólgu C — á ensku, úkraínsku og rússnesku skýrslusniði.
- **Staða einstakra sýkla er aldrei sýnd öðrum notendum.** Síður sýna aðeins nafnlausa dóminn: **Safe / Compatible / Caution / Risk**.
- DNA-færslur á blokkkeðju (`DNAVerification.sol`) knýja endurheimt og sannprófun.

### Samstarfsrannsóknarstofur — sönnun, ekki fyrirheit

Gakktu inn í samstarfsrannsóknarstofu og sýndu QR-kóðann þinn. Stofan skannar hann, staðfestir auðkenni þitt með **andlitsjöfnun** (svo að enginn annar geti sótt niðurstöðu þína) og hengir STD-skýrlsuna við — PDF, skönnun eða texta, jafnvel með slæmri OCR. Niðurstaðan er undirrituð af alvöru rannsóknarstofu, ekki af þér, svo aðrir sjá **sannaða staðreynd** í stað orða þinna. Og hver staðfest sannprófun greiðir **1 EVOLVE til sjúklingsins og 1 EVOLVE til rannsóknarstofunnar** — báðir aðilar hafa ástæðu til að vera heiðarlegir. Einstakir sýklar eru samt aldrei sýndir neinum.

## Að finna einhvern

- Leitarsíur: „Hvað ert þú að leita að" (stefnumót / getnaður / fjölkarlsgetnaður / STD-prófun), „Hverjum ert þú að leita að" (karlar, konur, par), fallval ríki → borg, „getur komið í landið þitt" með listum fyrir hvert land, húðlit, prófunarstilling, aðeins STD-samhæft.
- Kynningarálfur: aldur (hægt að fela), tungumál, æviágrip, mynd.
- **P2P-spjall** yfir libp2p (gossipsub) + Nostr, með HTTP-API varasíðu.

## Getnaður

Tvær leiðir til að skipuleggja barn, og hvort tveggja byggir á sömu hugmynd: raunverulegur hugur er sýndur með raunverulegri veðsetningu í EVOLVE — aldrei með fyrirheitum. Skuldbinding karlmanns lifir í EvolveFund-innborgun hans (frá 15 EVOLVE, læst í að minnsta kosti 30 daga), og kona getur sett eigin lágmarksinnborgun fyrir karlmenn sem ná til hennar.

**Getnaður.** Konan leiðir: hún býður ákveðnum karlmanni og nefnir hann í skuldaviðkvæði. Hann þarf virka EvolveFund-innborgun; þegar bæði staðfesta er hún læst og niðurtalningin byrjar. Meðganga er tilkynnt 14 til 30 dögum eftir staðfestingu, og STD- og DNA-próf parinu eru tekin við sjálft fundinn — nýlegar STD-niðurstöður skipta máli, DNA eldist ekki. Þegar feðravídd er sönnuð fer innborgun karlmanns til konunnar; ef hún er ekki sönnuð er innborgunin einfaldlega leyst til baka til hans. Ekkert skiptir um hönd fyrr en staðreyndir eru ljósar.

**Fjölkarlsgetnaður.** Valið tilheyrir henni og helst nafnlaust. Hún opnar setu sem stendur í 48 klukkustundir — án eigin innborgunar (aðeins vegna orðspors má hún bæta við einni, ef hún vill). Karlmenn með virka innborgun geta gengið í — allt að 50 — og staðfest, sem læsir veðsetningu þeirra. Fjórtán dögum eftir að setan lokast er faðirinn valinn. Hann fær innborgun sína aftur auk verðlauna úr safninu: tvöfalt innborgunina sína og 1 EVOLVE fyrir hvern annan þátttakanda. Karlmennirnir sem ekki eru valdir missa veðsetningu sína — 90 % til konunnar, 10 % til valda föður. Hún á enga áhættu og getur aðeins unnið; karlmennirnir setja veðsetningu sína á bak við réttinn til að vera valdir.

## EVOLVE-táknmyntin (aðeins prófunarnet)

- ERC-20, hámarksframboð **8,000,000,000 EVOLVE**. Stjórnendaaðgerðir eru læstar af 48 klukkustunda `TimelockController`.
- **Skipulögð úthlutun framboðs** — hönnuð til að setja næstum allt framboðið í vinnu fyrir notendur, ekki fyrir innvingaða:

| Tilgangur                                                    |        EVOLVE |
| ------------------------------------------------------------ | ------------: |
| Stofnendur og teymi (laun / verðlaun)                        |    25,000,000 |
| DEX-varasjóður (framtíð)                                     |     4,000,000 |
| Opinber sala (skipulögð)                                     |     5,000,000 |
| Verðlaunasjóður — rannsóknarstofur, sjúklingar, mæður, feður | 7,966,000,000 |

- **Skipulöguð opinber sala** — 5,000,000 EVOLVE eru seld af smáforritinu á **$0.8 stykk**, greiðanlegt í hvaða táknmynd sem smáforritið styður; tekjur fjármagna þróunina. _(Skipulagt — ekki komið live.)_
- **Trustless-lausun (skipulögð)** — verðlaunasjóðurinn ~7,966,000,000 á að vera læstur í óþurrandi `RewardVault`: aðeins lausað hægt og rólega í gegnum verðlaun til rannsóknarstofna, sjúklinga, mæðra og feðra, og breytingar á reglum krefjast kosningar í stjórn. Ekki einu sinni stofnandinn getur tekið úr honum. Hönnun: [docs/REWARD-VAULT-PLAN.md](docs/REWARD-VAULT-PLAN.md).
- **Emoji-gjafahagkerfi** — gjöf kostar 1 EVOLVE, skipt hlutfallslega milli núverandi gjafaeigenda; endalaust tekjulíkan, og gjafir eru færanlegar.
- **EvolveFund** — karlveðsetning (min. 15 EVOLVE, 30 daga læsing) sem telst í stjórnarþunga; konur nota veskisjöfnuð sinn.
- **Sannprófunarverðlaun** — 1 EVOLVE til staðfests notanda og 1 EVOLVE til staðfestandi stofu fyrir hverja STD-/DNA-sannprófun (auk takmarkaðs krana (faucet)).
- **Stjórn** — atkvæðaþungi sameinar endurtekið orðspor (8 atkvæði, dýpt 3), hlutdeild barna/feðravíddar, og veðsett eða haldið EVOLVE.
- **LayerZero OFT** samþætting fyrir framtíðarmargkeðju EVOLVE-yfirfærslur (kerfiskröfur á stað; ekkert uppsett fyrir utan Sepolia ennþá).

## Styðja verkefnið

EVOLVE er sjálfstætt og með opinn kóða. Ef það er gagnlegt fyrir þig geturðu stutt þróunina með framlagi — hvert framlag fer í kóða, samstarf við rannsóknarstofur, hýsingu og þýðingu.

- **Nánar um framlög (EVM, Monero og fleira):** [DONATE.md](DONATE.md)
- **Fjöltyngd framlagssíða (34 tungumál):** **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**

Opinber táknmyndasala er á vegvísinn en er **ekki** í gangi í dag. Framlög eru gjafir sem styðja opinn hugbúnaðarþróun og veita enga kröfu á táknmyndir, eignarhlut, ávöxtun eða hagnað. Gefðu aðeins það sem þú getur leyft þér að missa.

## Uppbygging & tækni

Eitt geymslusvæði (monorepo) stjórnað með npm workspaces + Turborepo:

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

Lykilsamningarnir: `EVOLVE.sol` (ERC-20), `ProfileNFT.sol` (ERC-721), `TrustScore.sol`, `Voting.sol`, `Evolve2Earn.sol` (emoji-gjafir + verðlaun), `Governance.sol`, `BondManager.sol` (getnaður og fjölkarlsgetnaður), `EvolveFund.sol`, `VerificationRegistry.sol`, `DNAVerification.sol`, ERC-4337 `SmartAccountFactory` + `Paymaster`, og OpenZeppelin `TimelockController`.

Nánar: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md)

## Vegvísir

Í vinnslu: framleiðsluþrek vefsmáforritsins. Skipulagt: blokkkeðjuskrá rannsóknarstofna og vottun prófa, alvöru póstveituþjónusta fyrir móttöku rannsóknarstofuskýrslna, staðfestar vottanir á blokkkeðju í síðum, **trustless RewardVault** með stjórnstýrðri losun ([hönnun](docs/REWARD-VAULT-PLAN.md)), **opinber táknmyndasala**, uppfærsla á táknmyndavestingu fyrir stofnendaúthlutun, og DEX-miðlægniveiting (nú lokað — hún krefst aðalnetuppsetningar táknmyndarinnar). Margnetaviðbót (Arbitrum, Avalanche og aðrar EVM-keðjur) kemur eftir að prófunarnetið er hermt.

Fullur listi: [docs/ROADMAP.md](docs/ROADMAP.md).

## Byrja (hönnuðir)

Kröfur: **Node.js 20+** og npm 10.x.

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

## Þátttaka

Þátttaka er velkomin — kóði, villuskýrslur, tillögur að eiginleikum og uppástungur. Lestu [CONTRIBUTING.md](CONTRIBUTING.md) og [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) okkar áður en þú byrjar.

## Geymslur (spegill)

| Spegill  | URL                                        |
| -------- | ------------------------------------------ |
| GitHub   | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg | https://codeberg.org/limitafternoon/Evolve |
| GitLab   | https://gitlab.com/evolve-group3/evolve    |

## Skjöl

- [Hvað & hvers vegna](docs/WHAT-AND-WHY.md) — vandamál, sýn, kjargildi
- [Hvernig það virkar](docs/HOW-IT-WORKS.md) — notendaferli, skref fyrir skref
- [Uppbygging](docs/ARCHITECTURE.md) — monorepo, pakkar, gagnaflæði
- [Tokenomics](docs/TOKENOMICS.md) — táknmyndlíkan og úthlutun framboðs
- [RewardVault-áætlun](docs/REWARD-VAULT-PLAN.md) — trustless losun (skipulögð)
- [Vegvísir](docs/ROADMAP.md) — áfangar og núverandi staða
- [FAQ](docs/FAQ.md) — algengar spurningar
- [Veskishandbók](docs/WALLETS.md) — hvernig á að búa til vaski og fá framlagsföng

## Leyfi

Leyft samkvæmt [MIT-leyfinu](LICENSE).

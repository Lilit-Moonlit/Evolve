[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)
<!-- evolve-readme-sync: 3796750887b0bd65 -->

# EVOLVE

**Stefnumót, getnaður og sannreynd heilsa — persónuvernd að sjálfgefnu, traust þar sem mest skiptir máli.**

EVOLVE er opinn, dreifður vettvangur fyrir fólk sem er búið að þreyta á að afhenda símanúmerið sitt, andlitið og einkasömustu heilsugögn sín í gagnagrunn annarra. Þú skráir þig inn með eigin rafmyntaveski — enginn sími, enginn tölvupóstur, ekkert KYC — og þú getur endurheimt aðganginn þinn með DNA-skuldbindingu á blokkkeðjunni. Heilsugögnin þín eru áfram þín: prófniðurstöður eru þáttaðar sjálfkrafa, staða einstakra sýkla er **aldrei** sýnd neinum og pörun byggist aðeins á nafnlausum samhæfnisdómum (Safe / Compatible / Caution / Risk). Spjall keyrir jafningjakennt yfir libp2p og Nostr, með HTTP-varasíðu til þæginda. Gjafir og yfirfærslur stefna að fullkomnum trúnaði: gjafir með falinn sendanda eru komnar í notkun í dag, og skýjað Railgun-veski ásamt núllþekkingarfrumgerð frá Aztec eru á vegvísinni (sjá [Persónuvernd og trúnaðarviðskipti](#persónuvernd-og-trúnaðarviðskipti)).

> **Staða — kynningarhamur (demo), í virkri þróun.**
> Stefnumót, getnaður, heilbrigðissannvottun, rannsóknarstofuferlið, P2P-spjall, EVOLVE-táknið og stjórnkerfið eru öll útfærð og keyra í **staðværum kynningarham** — forritið er **ekki ennþá uppsett opinberlega**. Enn á eftir: **uppsetning á aðalneti og DEX-miðlægni**, auk **áætlaðrar opinberar sölu** (sjá [EVOLVE-táknið](#evolve-táknið-aðeins-prófunarnet)).
> Samningarnir (smart contracts) eru settir upp **aðeins á Ethereum Sepolia-prófunarnetinu**. Ekkert hér er fjármálaráðgjöf eða fjárfestingartilboð.

> **Nýtir þér EVOLVE? Styddu þróunina — hvert framlag fer í kóða, samstarf við rannsóknarstofur, hýsingu og þýðingar → [DONATE.md](DONATE.md).**

## Ekkert að óttast

EVOLVE var byggt í kringum þær spurningar sem fólk spyr í raun og veru áður en það treystir slíkum vettvangi.

| Áhyggjan                                          | Það sem EVOLVE gerir nú þegar við henni                                                                                                                                                                                        |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| „Heilsugögnin mín leki út."                       | Niðurstöður einstakra sýkla eru **aldrei** sýndar neinum — aðeins nafnlaus dómur: Safe / Compatible / Caution / Risk.                                                                                                          |
| „Myndirnar mínar endi einhvers staðar."           | Myndir eru gerðar óskýrar (blur) sjálfgefið. Eigandinn veitir **15 sekúndna** eða **varanlega** sýn — um er beðið eða af eigin frumkvæði. Að skoða er ókeypis.                                                                 |
| „Ég verð að afhenda skilríki eða síma."           | Innskráning með veski (SIWE). Enginn sími, enginn tölvupóstur, ekkert KYC. Endurheimt virkar í gegnum DNA-skuldbindingu á keðjunni.                                                                                            |
| „Hann eða hún er að ljúga um að vera heilbrigð."  | Niðurstöður eru **sannprófaðar í rannsóknarstofu** (QR + andlitsjöfnun) og próf parsins eru tekin **á fundinum sjálfum** — nýlegar STD-niðurstöður skipta máli, DNA eldist ekki.                                               |
| „Tekur einhver peningana mína og hvarfli?"        | Getnaður byggir á raunverulegri, áhættusettri veðsetningu: innborgun karlmanns hreyfist aðeins þegar feðgni er **staðfest**; annars er hún einfaldlega skilað til hans.                                                        |
| „Er táknið pump-and-dump?"                        | Kóðinn er opinn (MIT); nánast allt framboðið er frátekið til verðlauna fyrir notendur, og varasjóðnum sem ekki er komið í umferð er ætlað að læsast í **ótæmanlegu þjóðhólfi** sem ekki einu sinni stofnandinn getur tekið úr. |
| „Getur vettvangurinn verið lokaður eða bannaður?" | Jafningjaspjall fyrst, dreifð geymsla (IPFS / Arweave), 18 EVM-netuppsetningar og engin harðkóðuð lén.                                                                                                                         |

## Hvað og af hverju

Venjuleg stefnumótaforrit biðja þig um að skipta á símanúmeri, tölvupósti, myndum og náinnum heilsuupplýsingum gegn aðalgagnagrunni — og svo að treysta þeim gagnagrunni að eilífu. EVOLVE byrjar á öfugu inntaki: **persónuvernd að sjálfgefnu, eigin varðveisla gilda og enginn einn bilunarpunktur**.

- **Persónuvernd að sjálfgefnu** — heilsugögn eru aldrei gefnar út; aðeins nafnlausir dómar.
- **Mótþró gegn bönnum** — P2P-fyrst spjall, dreifð geymsla, margnetshönnun, engin harðkóðuð lén.
- **Eiginvarðveitt auðkenni** — veskið þitt er innskráningin þín; DNA-endurheimt í stað tölvupósts eða síma.
- **Ekkert KYC-hlið** — engin ríkisskilríki, sími né tölvupóstur nauðsynlegur til að nota vettvanginn.

Lestu öll rökin í [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md).

## Heilsa sem þú getur treyst í raun og veru

- Hlaðið inn STD-prófi sem hrám texta eða PDF (útdráttur textalags, með OCR-varasíðu fyrir skönnun).
- Þáttarinn þekkir 8 sýkla: HIV-1/2, syfils, klamydíu, gonorea, HSV-1, HSV-2, lifrarbólgu B og lifrarbólgu C — á ensku, úkraínsku og rússnesku skýrslusniði.
- **Staða einstakra sýkla er aldrei sýnd öðrum notendum.** Prófílar sýna aðeins nafnlausann dóm: **Safe / Compatible / Caution / Risk**.
- DNA-færslur á keðjunni (`DNAVerification.sol`) knýja endurheimtu og sannvottun.

### Samstarfsrannsóknarstofur — sönnun, ekki fyrirheit

Gakktu inn í samstarfsrannsóknarstofu og sýndu QR-kóðann þinn. Rannsóknarstofan skannar hann, staðfestir auðkenni þín með **andlitsjöfnun** (svo aðrir geta ekki sótt niðurstöðuna þína) og hengir STD-skýrsluna við — PDF, skanna eða texta, jafnvel slæmt OCR. Niðurstaðan er undirrituð af alvöru rannsóknarstofu, ekki af þér, svo aðrir sjá **sannreynda staðreynd** í stað orða þinna. Og hver staðfest sannvottun greiðir **1 EVOLVE til sjúklingsins og 1 EVOLVE til rannsóknarstofunnar** — báðir aðilar hafa ástæðu til að vera heiðarlegir. Stakir sýklar eru áfram aldrei sýndir neinum.

## Að finna einhvern

- Leitarsíur: „Hvað ertu að leita að" (stefnumót / getnaður / fjölkarlgetnaður / STD-prófun), „Hverjum ertu að leita að" (karlar, konur, pör), keðjuð land → borg veldi, „getur komið til lands þíns" með landalistum, húðlit, prófunarstilling, aðeins STD-samhæft.
- Kynningarferli (wizard): aldur (hægt að fela), tungumál, stutt eiginlýsing, mynd.
- **P2P-spjall** yfir libp2p (gossipsub) + Nostr, með HTTP API-varasíðu.

## Getnaður

Tvær leiðir til að skipuleggja barnseign, og hvíla báðar á sömu hugmynd: raunverulegur ásetningur er sýndur fram á með raunverulegu veði í EVOLVE — aldrei með fyrirheitum. Ábyrgð karlmanns býr í EvolveFund-innborgun hans (frá 15 EVOLVE, læst í að minnsta kosti 30 daga), og kona getur sett eigin lágmarksinborgun fyrir þá karlmenn sem ná til hennar.

**Getnaður.** Konan stjórnar: hún býður tilteknum karlmanni og nefnir hann í bandi. Hann þarf virka EvolveFund-innborgun; þegar bæði staðfesta er hún læst og niðurtalningin byrjar. Þungun er tilkynnt milli 14 og 30 daga eftir staðfestingu, og STD- og DNA-próf parsins eru tekin á fundinum sjálfum — nýlegar STD-niðurstöður skipta máli, DNA eldist ekki. Þegar feðgni er staðfest fer innborgun karlmannsins til konunnar; ef hún er ekki staðfest er innborgunin einfaldlega leyst til baka til hans. Ekkert skiptir um hendur fyrr en staðreyndunum hefur verið komið á skýrt.

**Fjölkarlgetnaður.** Valið er á hennar höndum, og helst í einkahaldi. Hún opnar setu sem stendur í 48 klukkustundir — án eigin innborgunar (hún má aðeins bæta við slíkri til mannorðs, ef hún vill). Karlmenn með virkri innborgun mega ganga í setuna — allt að 50 — og staðfesta, sem læsir veðinu þeirra. Fjórtán dögum eftir að setunni er lokað er faðirinn valinn. Hann fær innborgun sína aftur auk verðlauna úr verðlaunasjóðnum: tvöfaldri innborgun sinni og 1 EVOLVE fyrir hvern annan þátttakanda. Karlmennirnir sem ekki eru valdir missa veðið sitt — 90% fara til konunnar, 10% til þess föður sem valinn var. Hún á enga áhættu og getur aðeins hlotið; karlmennirnir setja veðið sitt að baki réttinum til að vera valdir.

## Persónuvernd og trúnaðarviðskipti

Persónuvernd er sjálfgefin — og EVOLVE er að móta vegvísi að fullkomnum trúnaði við yfirfærslur á keðjunni.

- **Einkagjafir** — sendu rós 🌹 eða kaktus 🌵 (1 EVOLVE) og veldu hver getur séð að þú girst: _opinbert_, _nafnlaust gagnvart öllum nema viðtakandanum_ eða _fullkomnlega nafnlaust_. Í nafnlausu hamunum fer gjöfin sem eins-nota kvittun sem viðtakandinn leysir inn með eigin veski, svo sendandinn birtist aldrei á keðjunni. (Nafnleysi sendanda er í dag aðeins hversdagslegt: hægt er að tengja fjármögnunarfærsluna saman eftir tíma og upphæð.)
- **Skýjað Railgun-veski** — einkaveski undir eiginleikaflaggi (`VITE_RAILGUN_ENABLED`, slökkt að sjálfgefnu) sem felur upphæðir og vistföng með lifandi núllþekkingarsafni Railgun. Þetta er leiðin að sönnu nafnleysi sendanda.
- **Aztec-frumgerð** — sama rökfræði einkayfirfærslna og einkabanda, sett fram sem núllþekkingar Noir-rásir og haldið bak við skýrt opnunarskilyrði þar til Aztec er framleiðsluviðbúið. Sjá [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md).
- **Tveggja-veskja líkan** — opið veðveski tekur þátt í stjórnkerfinu; einkaskýjað veski er meðvitað **undanskilið** stjórnarþunga og heldur þar með persónuvernd og kosningavaldi aðskildu.

Nánar: [docs/RAILGUN-INTEGRATION.md](docs/RAILGUN-INTEGRATION.md) · [docs/SHIELDED-STAKES-DESIGN.md](docs/SHIELDED-STAKES-DESIGN.md) · [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md).

## EVOLVE-táknið (aðeins prófunarnet)

- ERC-20, hámarksframboð **8,000,000,000 EVOLVE**. Stjórnendaaðgerðir eru háðar 48 klukkustunda `TimelockController`.
- **Áætluð úthlutun framboðs** — hönnuð til að setja nánast allt framboðið í vinnu fyrir notendur, ekki fyrir innherja:

| Tilgangur                                                    |        EVOLVE |
| ------------------------------------------------------------ | ------------: |
| Stofnendur og teymi (laun / verðlaun)                        |    25,000,000 |
| DEX-varasjóður (framtíð)                                     |     4,000,000 |
| Opinber sala (áætluð)                                        |     5,000,000 |
| Verðlaunasjóður — rannsóknarstofur, sjúklingar, mæður, feður | 7,966,000,000 |

- **Áætluð opinber sala** — 5,000,000 EVOLVE seld af forritinu á **0,8 USD stykkið**, greinanlegt í hvaða tákn sem forritið styður; hagnaðurinn fer í þróun. _(Áætlun — ekki komið í gang ennþá.)_
- **Traustlaus losun (áætluð)** — u.þ.b. 7,966,000,000 verðlaunaforðinn á að læsast í ótæmanlegan `RewardVault`: aðeins losað hægt og rólega í gegnum verðlaun til rannsóknarstofna, sjúklinga, mæðra og feðra, og breytingar á reglum krefjast stjórnaratkvæðagreiðslu. Ekki einu sinni getur stofnandinn tekið úr honum. Hönnun: [docs/REWARD-VAULT-PLAN.md](docs/REWARD-VAULT-PLAN.md).
- **Emoji-gjafahagkerfi** — gjöf kostar 1 EVOLVE, skipt hlutfallslega milli núverandi gjafaeigenda; varanlegt tekjulíkan, og gjafir eru færanlegar.
- **EvolveFund** — veðsetning karlmanna (lágmark 15 EVOLVE, 30 daga læsing) sem telst með í stjórnarþunga; konur nota veskisjöfnuð sinn.
- **Sannvottunarverðlaun** — 1 EVOLVE til sannvottaðs notanda og 1 EVOLVE til staðfestandi rannsóknarstofu fyrir hverja STD/DNA-sannvottun (auk hraðatakmarkaðs krana).
- **Stjórn** — atkvæðaþungi sameinar endurkvæmt mannorð (8 atkvæði, dýpt 3), hlutfall barna/feðrna og veðsett eða haldið EVOLVE.
- **LayerZero OFT**-samþætting fyrir framtíðar fjölkeðju-yfirfærslur EVOLVE (kerfiskröfur komnar á sinn stað; ekkert uppsett handan Sepolia ennþá).

## Styðja verkefnið

EVOLVE er sjálfstætt og opinn hugbúnaður. Ef það nýtist þér getur þú stytt þróunina með framlagi — hvert framlag fer í kóða, rannsóknarstofusamstarf, hýsingu og þýðingar.

- **Nánar um framlög (EVM, Monero og fleira):** [DONATE.md](DONATE.md)
- **Fjöltyngd framlagssíða (34 tungumál):** **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**

Opinber táknsala er **áætluð** — 5,000,000 EVOLVE, seld af forritinu (sjá [EVOLVE-táknið](#evolve-táknið-aðeins-prófunarnet)). Framlög eru gjafir sem styðja þróun opinns hugbúnaðar og veita enga kröfu á tákn, eignarhlut, ávöxtun eða gróða. Gefðu aðeins það sem þú ræður við að tapa.

## Uppbygging og tækni

Mónorepo stýrt með npm workspaces + Turborepo:

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

Aðalsamningarnir: `EVOLVE.sol` (ERC-20), `ProfileNFT.sol` (ERC-721), `TrustScore.sol`, `Voting.sol`, `Evolve2Earn.sol` (emoji-gjafir + verðlaun), `Governance.sol`, `BondManager.sol` (getnaður og fjölkarlgetnaður), `EvolveFund.sol`, `VerificationRegistry.sol`, `DNAVerification.sol`, ERC-4337 `SmartAccountFactory` + `Paymaster`, og OpenZeppelin `TimelockController`.

Nánar: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md)

## Vegvísir

Í gangi: að gera vefforritið framleiðsluviðbúið. Áætlað: rannsóknarstofaskrá og prófavottun á keðju, raunverulegt viðmót fyrir tölvupóstþjónustu við móttöku rannsóknarstofuskýrslna, sannvottuð vottorð á prófílum á keðju, **traustlaust RewardVault** með stjórnvarðri losun ([hönnun](docs/REWARD-VAULT-PLAN.md)), **opinber táknsala**, uppfærsla á vesting fyrir úthlutun stofnenda og DEX-miðlægniveiting (nú stöðvuð — krefst tákn-uppsetninga á aðalneti). Á persónuverndarsviðinu eru einkagjafir með falnum sendanda kláraðar, en skýjaða Railgun-veskið og flutningur Aztec-einkabanda helst á bak við athuganir í [docs/ROADMAP.md](docs/ROADMAP.md) og [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md). Margnetsútvíkkun (Arbitrum, Avalanche og aðrar EVM-keðjur) kemur eftir herðingu prófunarnetsins.

Fullur listi: [docs/ROADMAP.md](docs/ROADMAP.md).

## Til að byrja (þróunaraðilar)

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

Framlög eru velkomin — kóði, villuskýrslur, tillögur að eiginleikum og máltillögur. Lestu [CONTRIBUTING.md](CONTRIBUTING.md) og [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) okkar áður en þú byrjar.

## Hugbúnaðarsöfn (spegillar)

| Spegill  | URL                                        |
| -------- | ------------------------------------------ |
| GitHub   | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg | https://codeberg.org/limitafternoon/Evolve |
| GitLab   | https://gitlab.com/evolve-group3/evolve    |

## Skjölun

- [Hvað og af hverju](docs/WHAT-AND-WHY.md) — vandamál, sýn, kjargildi
- [Hvernig það virkar](docs/HOW-IT-WORKS.md) — notendaferli, skref fyrir skref
- [Uppbygging](docs/ARCHITECTURE.md) — mónorepo, pakkar, gagnaflæði
- [Táknfræði](docs/TOKENOMICS.md) — táknlíkan og úthlutun framboðs
- [RewardVault-áætlun](docs/REWARD-VAULT-PLAN.md) — traustlaus losun (áætluð)
- [Railgun-samþætting](docs/RAILGUN-INTEGRATION.md) — samþættingarprófun skýjaðs veskis
- [Skýjaðar veðsetningar](docs/SHIELDED-STAKES-DESIGN.md) — einkaveðsetningar getnaðar (hönnun)
- [Aztec-frumgerð](docs/AZTEC-PROTOTYPE.md) — ZK-einkayfirfærslur og bönd (rannsókn)
- [Vegvísir](docs/ROADMAP.md) — áföng og núverandi staða
- [Algengar spurningar](docs/FAQ.md) — tíðar spurningar
- [Veskishandbók](docs/WALLETS.md) — hvernig á að búa til veski og fá framlagsvistföng

## Leyfi

Gefið út undir [MIT-notkunarleyfinu](LICENSE).

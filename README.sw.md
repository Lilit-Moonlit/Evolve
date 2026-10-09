[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)
<!-- evolve-readme-sync: 3796750887b0bd65 -->

# EVOLVE

**Uchumba, utungaji mimba na afya iliyothibitishwa — faragha kwa chaguo-msingi, uaminifu pale unapohitajika.**

EVOLVE ni jukwaa la wazi na la ugatuzi kwa watu waliochoka kutoa nambari yao ya simu, sura yao na data zao nyeti zaidi za afya kwenye hifadhidata ya mtu mwingine. Unaingia kwa kutumia pochi yako ya sarafu — bila simu, bila barua pepe, bila KYC — na unaweza kupata tena akaunti yako kupitia ahadi ya DNA iliyo kwenye mnyororo. Data zako za afya zinabaki kuwa zako: matokeo ya vipimo huchanganuliwa kiotomatiki, hali ya kila kimelea **haiwahi** kuonyeshwa kwa yeyote, na ulinganishaji hutegemea tu maamuzi ya utangamano yasiyo na utambulisho (Salama / Inafaa / Tahadhari / Hatari). Mazungumzo hufanya kazi kwa rika-kwa-rika kupitia libp2p na Nostr, na njia mbadala ya HTTP kwa urahisi. Zawadi na malipo yanasonga mbele kuelekea usiri kamili: zawadi za faragha tayari ziko hai, na mbele kuna pochi iliyokingwa ya Railgun na mfano wa Aztec wa uthibitisho wa sifuri-ujuzi (ona [Faragha na miamala ya siri](#faragha--miamala-ya-siri)).

> **Hali — hali ya onyesho, katika maendeleo hai.**
> Uchumba, utungaji mimba, uthibitisho wa afya, mtiririko wa maabara, mazungumzo ya P2P, sarafu ya EVOLVE na utawala vyote vimetekelezwa na vinafanya kazi katika **onyesho la ndani** — programu **bado haijachapishwa kwa umma**. Bado mbele: **upelekaji wa mainnet na ukwasi wa DEX**, pamoja na **uuzaji wa umma uliopangwa** (ona [Sarafu ya EVOLVE](#sarafu-ya-evolve-testnet-tu)).
> Mikataba mizuri imetekelezwa **kwenye mtandao wa majaribio wa Ethereum Sepolia tu**. Hakuna kitu hapa ambacho ni ushauri wa kifedha au ofa ya uwekezaji.

> **EVOLVE ina manufaa kwako? Saidia maendeleo — kila mchango unaenda kwa msimbo, ushirikiano wa maabara, uandikishaji na utafsiri → [DONATE.md](DONATE.md).**

## Hakuna cha kuogopa

EVOLVE ilijengwa kuzunguka maswali ambayo watu huuliza kabla ya kuamini jukwaa kama hili.

| Wasiwasi                                            | Kile EVOLVE tayari hufanya kulihusu                                                                                                                                                                  |
| --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| "Data zangu za afya zitavuja."                      | Matokeo ya kila kimelea **haiwahi** kuonyeshwa kwa mtu yeyote — tu uamuzi usio na utambulisho: Salama / Inafaa / Tahadhari / Hatari.                                                                 |
| "Picha zangu zitaishia mahali fulani."              | Picha zimetiwa ukungu kwa chaguo-msingi. Mmiliki hutoa mwonekano wa **sekunde 15** au **wa kudumu** — kwa ombi au kwa hiari. Kuona ni bure.                                                          |
| "Nitalazimika kutoa kitambulisho au simu yangu."    | Kuingia kwa pochi (SIWE). Hakuna simu, hakuna barua pepe, hakuna KYC. Urejeshaji hufanya kazi kupitia ahadi ya DNA iliyo kwenye mnyororo.                                                            |
| "Yeye anadanganya kuhusu afya yake."                | Matokeo **yanathibitishwa na maabara** (QR + ulinganishaji wa uso), na vipimo vya wanandoa hufanywa **kwenye mkutano** — matokeo mapya ya magonjwa ya zinaa ni muhimu, DNA haizeeki.                 |
| "Je, mtu atachukua pesa zangu na kutoweka?"         | Utungaji mimba hufanya kazi kwa dau halisi: amana ya mwanamume inasonga tu wakati ubaba **umethibitishwa**; vinginevyo inarudishwa kwake tu.                                                         |
| "Je, sarafu ni pump-and-dump?"                      | Msimbo ni wazi (MIT); karibu ugavi wote umehifadhiwa kwa zawadi za watumiaji, na hifadhi isiyozunguka imepangwa kufungiwa kwenye **hazina isiyoweza kutolewa** ambayo hata mwanzilishi hawezi kutoa. |
| "Je, jukwaa linaweza kufungwa au kupigwa marufuku?" | Ujumbe wa rika-kwa-rika kwanza, uhifadhi wa ugatuzi (IPFS / Arweave), mipangilio 18 ya mitandao ya EVM na hakuna kikoa kilichowekwa kwa msimbo.                                                      |

## Nini na Kwa nini

Programu za uchumba za jadi zinakuuliza ubadilishe nambari yako ya simu, barua pepe, picha na maelezo nyeti ya afya kwa hifadhidata kuu — kisha uiamini hifadhidata hiyo milele. EVOLVE inaanza kutoka dhana kinyume: **faragha kwa chaguo-msingi, uhifadhi binafsi na kutokuwepo kwa sehemu moja ya kushindwa**.

- **Faragha kwa chaguo-msingi** — data za afya hazifichuliwi kamwe; tu maamuzi yasiyo na utambulisho.
- **Upinzani dhidi ya marufuku** — ujumbe wa P2P kwanza, uhifadhi wa ugatuzi, muundo wa mitandao mingi, bila vikoa vilivyowekwa.
- **Utambulisho wa kujihifadhi** — pochi yako ndio kuingia kwako; urejeshaji kwa DNA badala ya barua pepe au simu.
- **Hakuna kizuizi cha KYC** — hakuna kitambulisho, simu au barua pepe inayohitajika kutumia jukwaa.

Soma hoja kamili katika [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md).

## Afya unayoweza kuiamini kweli

- Pakia kipimo cha magonjwa ya zinaa kama maandishi au PDF (uchimbaji wa safu ya maandishi, na njia mbadala ya OCR kwa skani).
- Kichanganuzi kinajua vimelea 8: HIV-1/2, Kaswende, Klamidia, Kisonono, HSV-1, HSV-2, Homa ya Ini B, Homa ya Ini C — katika miundo ya ripoti ya Kiingereza, Kiukreni na Kirusi.
- **Hali ya kila kimelea haionyeshwi kamwe kwa watumiaji wengine.** Wasifu huonyesha tu uamuzi usio na utambulisho: **Salama / Inafaa / Tahadhari / Hatari**.
- Rekodi za DNA kwenye mnyororo (`DNAVerification.sol`) huwezesha urejeshaji na uthibitisho.

### Maabara washirika — uthibitisho, si ahadi

Ingia kwenye maabara mshirika na uonyeshe msimbo wako wa QR. Maabara huuchanganua, huthibitisha utambulisho wako kwa **ulinganishaji wa uso** (ili mtu mwingine asiweze kuchukua matokeo yako) na huambatisha ripoti ya magonjwa ya zinaa — PDF, skani au maandishi, hata OCR duni. Matokeo hutiwa sahihi na maabara halisi, si na wewe, kwa hivyo wengine wanaona **ukweli uliothibitishwa** badala ya maneno yako. Na kila uthibitisho uliothibitishwa hulipa **1 EVOLVE kwa mgonjwa na 1 EVOLVE kwa maabara** — pande zote mbili zina sababu ya kuwa waaminifu. Vimelea vya kibinafsi bado havionyeshwi kwa yeyote.

## Kutafuta mtu

- Vichujio vya utafutaji: "Unatafuta nini" (uchumba / utungaji mimba / utungaji mimba wa wanaume wengi / vipimo vya magonjwa ya zinaa), "Unatafuta nani" (wanaume, wanawake, wanandoa), uteuzi wa kuteleza wa nchi → mji, "anaweza kusafiri kwenda nchi yako" na orodha za nchi, rangi ya ngozi, upendeleo wa kupima, wale tu wanaolingana na magonjwa ya zinaa.
- Mchawi wa kuanza: umri (unaoweza kufichwa), lugha, wasifu, picha.
- **Mazungumzo ya P2P** kupitia libp2p (gossipsub) + Nostr, na njia mbadala ya API ya HTTP.

## Utungaji mimba

Njia mbili za kupanga mtoto, na zote zinategemea wazo moja: nia halisi inaonyeshwa kwa dau halisi la EVOLVE — kamwe kwa ahadi. Ahadi ya mwanamume iko kwenye amana yake ya EvolveFund (kutoka EVOLVE 15, iliyofungwa kwa angalau siku 30), na mwanamke anaweza kuweka amana yake ya chini kwa wanaume wanaomfikia.

**Utungaji mimba.** Mwanamke anaongoza: anaalika mwanamume maalum na kumtaja katika dhamana. Anahitaji amana hai ya EvolveFund; wakati wote wawili wanathibitisha, inafungwa na hesabu inaanza. Ujauzito unaripotiwa kati ya siku 14 na 30 baada ya uthibitisho, na vipimo vya magonjwa ya zinaa na DNA vya wanandoa hufanywa kwenye mkutano wenyewe — matokeo mapya ya magonjwa ya zinaa ni muhimu, DNA haizeeki. Mara tu ubaba unapothibitishwa, amana ya mwanamume inapita kwa mwanamke; ikiwa haijathibitishwa, amana inarudishwa tu kwake. Hakuna kinachobadilisha mikono hadi ukweli utakapothibitishwa.

**Utungaji mimba wa wanaume wengi.** Chaguo ni lake, na linabaki kuwa la siri. Anafungua kikao cha saa 48 — bila amana yake mwenyewe (anaweza kuongeza moja kwa sifa tu, akitaka). Wanaume walio na amana hai wanaweza kujiunga — hadi 50 — na kuthibitisha, jambo linalofunga dau lao. Siku kumi na nne baada ya kikao kufungwa, baba huchaguliwa. Anarudishiwa amana yake pamoja na zawadi kutoka kwa mkusanyiko: mara mbili ya amana yake na 1 EVOLVE kwa kila mshiriki mwingine. Wanaume wasiochaguliwa hupoteza dau lao — 90% kwa mwanamke, 10% kwa baba aliyechaguliwa. Yeye hahatarishi chochote na anaweza kushinda tu; wanaume huweka dau lao nyuma ya haki ya kuchaguliwa.

## Faragha na miamala ya siri

Faragha ndiyo chaguo-msingi — na EVOLVE inajenga ramani ya barabara kuelekea malipo ya siri kabisa kwenye mnyororo.

- **Zawadi za faragha** — tuma waridi 🌹 au kakti 🌵 (1 EVOLVE) na uchague nani anaweza kuona kwamba ni wewe: _hadharani_, _bila utambulisho kwa wote isipokuwa mpokeaji_ au _bila utambulisho kabisa_. Katika hali zisizo na utambulisho, zawadi husafiri kama vocha ya matumizi moja ambayo mpokeaji huitwaa kwa pochi yake mwenyewe, hivyo mtumaji haonekani kamwe kwenye mnyororo. (Kutokujulikana kwa mtumaji leo ni kwa kiwango cha kawaida: muamala wa ufadhili unaweza kuunganishwa kwa wakati na kiasi.)
- **Pochi iliyokingwa ya Railgun** — pochi ya faragha nyuma ya bendera ya kipengele (`VITE_RAILGUN_ENABLED`, imezimwa kwa chaguo-msingi) inayoficha viwango na anwani kupitia dimbwi hai la uthibitisho wa sifuri-ujuzi la Railgun. Hii ndiyo njia ya kutokujulikana kwa kweli kwa mtumaji.
- **Mfano wa Aztec** — mantiki ileile ya malipo ya siri na dhamana ya siri, iliyoonyeshwa kama sakiti za Noir za uthibitisho wa sifuri-ujuzi na kuwekwa nyuma ya kizingiti dhahiri hadi Aztec iwe tayari kwa uzalishaji. Ona [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md).
- **Mfano wa pochi mbili** — pochi ya umma ya dau inashiriki katika utawala; pochi ya siri iliyokingwa **imetengwa kimakusudi** kutoka kwa uzito wa kura, kuweka faragha na nguvu ya kura tofauti.

Maelezo: [docs/RAILGUN-INTEGRATION.md](docs/RAILGUN-INTEGRATION.md) · [docs/SHIELDED-STAKES-DESIGN.md](docs/SHIELDED-STAKES-DESIGN.md) · [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md).

## Sarafu ya EVOLVE (testnet tu)

- ERC-20, ugavi wa juu **8 000 000 000 EVOLVE**. Vitendo vya msimamizi vimefungwa na `TimelockController` ya saa 48.
- **Ugawaji uliopangwa** — umebuniwa kuweka karibu ugavi wote kufanya kazi kwa watumiaji, si kwa watu wa ndani:

| Kusudi                                            |        EVOLVE |
| ------------------------------------------------- | ------------: |
| Waanzilishi na timu (mshahara / zawadi)           |    25 000 000 |
| Hifadhi ya DEX (baadaye)                          |     4 000 000 |
| Uuzaji wa umma (uliopangwa)                       |     5 000 000 |
| Hifadhi ya zawadi — maabara, wagonjwa, mama, baba | 7 966 000 000 |

- **Uuzaji wa umma uliopangwa** — 5 000 000 EVOLVE zinazouzwa na programu kwa **$0.8 kila moja**, zinazolipwa kwa sarafu yoyote inayoungwa mkono na programu; mapato yanafadhili maendeleo. _(Imepangwa — bado haijaanza.)_
- **Utoaji bila uaminifu (uliopangwa)** — hifadhi ya zawadi ya ~7 966 000 000 imepangwa kufungiwa kwenye `RewardVault` isiyoweza kutolewa: inatolewa tu taratibu kupitia zawadi za maabara, mgonjwa, mama na baba, na mabadiliko ya sheria yanahitaji kura ya utawala. Hata mwanzilishi hawezi kuitoa. Muundo: [docs/REWARD-VAULT-PLAN.md](docs/REWARD-VAULT-PLAN.md).
- **Uchumi wa zawadi za emoji** — zawadi inagharimu 1 EVOLVE, ikigawanywa kwa uwiano kati ya wamiliki wa zawadi zilizopo; muundo wa mapato wa kudumu, na zawadi zinaweza kuhamishwa.
- **EvolveFund** — uwekezaji wa kiume (chini 15 EVOLVE, kufungwa kwa siku 30) unaohesabiwa kwa uzito wa utawala; wanawake hutumia salio la pochi.
- **Zawadi za uthibitisho** — 1 EVOLVE kwa mtumiaji aliyethibitishwa na 1 EVOLVE kwa maabara iliyothibitisha kwa uthibitisho wa magonjwa ya zinaa/DNA (pamoja na bomba lenye kikomo cha kiwango).
- **Utawala** — uzito wa kura unachanganya sifa ya kujirudia (kura 8, kina 3), sehemu ya watoto/ubaba na EVOLVE zilizowekwa au kushikiliwa.
- Ujumuishaji wa **LayerZero OFT** kwa malipo ya baadaye ya EVOLVE ya minyororo mingi (utegemezi uko tayari; hakuna kilichotekelezwa zaidi ya Sepolia bado).

## Saidia mradi

EVOLVE ni huru na ya wazi. Ikiwa ina manufaa kwako, unaweza kusaidia maendeleo kwa mchango — kila mchango unaenda kwa msimbo, ushirikiano wa maabara, uandikishaji na utafsiri.

- **Maelezo ya mchango (EVM, Monero na zaidi):** [DONATE.md](DONATE.md)
- **Ukurasa wa mchango wa lugha nyingi (lugha 34):** **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**

Uuzaji wa umma wa sarafu **umepangwa** — 5 000 000 EVOLVE, zinazouzwa na programu (ona [Sarafu ya EVOLVE](#sarafu-ya-evolve-testnet-tu)). Michango ni zawadi zinazosaidia maendeleo ya wazi na hazitoi madai ya sarafu, hisa, mapato au faida. Tafadhali toa tu kile unachoweza kumudu kupoteza.

## Usanifu na Stack ya Teknolojia

Monorepo inayosimamiwa na npm workspaces + Turborepo:

```
apps/
  web/          # Vite + React + TypeScript (programu kuu ya wavuti, i18next, Prisma)
  mobile/       # Expo + React Native
packages/
  config/       # Bendera za vipengele na usanidi wa mbali unaobadilika
  contracts/    # Solidity 0.8.24, Hardhat, Ignition, OpenZeppelin, LayerZero
  core/         # Aina zilizoshirikiwa, huduma, middleware, web3
  matching/     # Algoriti za ulinganishaji, vichujio, uorodheshaji
  p2p/          # Mitandao ya libp2p (gossipsub) + Nostr
  storage/      # IPFS, Arweave, Lit Protocol
docs/           # Usanifu, tokenomics, ramani ya barabara, FAQ
```

Mikataba muhimu: `EVOLVE.sol` (ERC-20), `ProfileNFT.sol` (ERC-721), `TrustScore.sol`, `Voting.sol`, `Evolve2Earn.sol` (zawadi za emoji + zawadi), `Governance.sol`, `BondManager.sol` (utungaji mimba na utungaji mimba wa wanaume wengi), `EvolveFund.sol`, `VerificationRegistry.sol`, `DNAVerification.sol`, ERC-4337 `SmartAccountFactory` + `Paymaster`, na `TimelockController` wa OpenZeppelin.

Maelezo: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md)

## Ramani ya barabara

Katika maendeleo: utayari wa uzalishaji wa programu ya wavuti. Imepangwa: rejista ya maabara kwenye mnyororo na uthibitishaji wa vipimo, adapta halisi ya mtoa barua pepe kwa upokeaji wa ripoti za maabara, uthibitisho uliothibitishwa kwenye mnyororo kwenye wasifu, **`RewardVault` isiyo na uaminifu** yenye utoaji unaotawaliwa na kura ([muundo](docs/REWARD-VAULT-PLAN.md)), **uuzaji wa umma wa sarafu**, sasisho la vesting la sarafu kwa mgao wa waanzilishi, na utoaji wa ukwasi wa DEX (kwa sasa umefungwa — unahitaji upelekaji wa sarafu kwenye mainnet). Upande wa faragha, zawadi za faragha zimekamilika, wakati pochi iliyokingwa ya Railgun na uhamiaji wa dhamana ya siri ya Aztec zimebaki nyuma ya ukaguzi katika [docs/ROADMAP.md](docs/ROADMAP.md) na [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md). Upanuzi wa mitandao mingi (Arbitrum, Avalanche na minyororo mingine ya EVM) unafuata baada ya uimarishaji wa testnet.

Orodha kamili: [docs/ROADMAP.md](docs/ROADMAP.md).

## Kuanza (Wasanidi)

Mahitaji: **Node.js 20+** na npm 10.x.

```bash
# Clone na usakinishe workspaces zote
git clone https://github.com/Lilit-Moonlit/Evolve.git
cd Evolve
npm install

# Programu ya wavuti (seva ya dev ya Vite kwenye http://localhost:3000)
cd apps/web
npm run dev
npm test                # suite ya vitest

# Mikataba mizuri
cd packages/contracts
npm run compile         # hardhat compile
npm test                # suite ya majaribio ya hardhat
npm run deploy:local    # peleka mikataba yote kwenye mtandao wa Hardhat ndani ya mchakato
```

## Kuchangia

Michango inakaribishwa — msimbo, ripoti za hitilafu, mapendekezo ya vipengele na mawazo. Tafadhali soma [CONTRIBUTING.md](CONTRIBUTING.md) na [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) kabla ya kuanza.

## Hazina (Vioo)

| Kioo     | URL                                        |
| -------- | ------------------------------------------ |
| GitHub   | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg | https://codeberg.org/limitafternoon/Evolve |
| GitLab   | https://gitlab.com/evolve-group3/evolve    |

## Nyaraka

- [Nini na Kwa nini](docs/WHAT-AND-WHY.md) — tatizo, maono, maadili ya msingi
- [Jinsi inavyofanya kazi](docs/HOW-IT-WORKS.md) — mitiririko ya watumiaji, hatua kwa hatua
- [Usanifu](docs/ARCHITECTURE.md) — monorepo, vifurushi, mitiririko ya data
- [Tokenomics](docs/TOKENOMICS.md) — muundo wa sarafu na ugawaji wa ugavi
- [Mpango wa RewardVault](docs/REWARD-VAULT-PLAN.md) — utoaji bila uaminifu (uliopangwa)
- [Ujumuishaji wa Railgun](docs/RAILGUN-INTEGRATION.md) — spike ya ujumuishaji wa pochi iliyokingwa
- [Dau zilizokingwa](docs/SHIELDED-STAKES-DESIGN.md) — dau za utungaji mimba za faragha (muundo)
- [Mfano wa Aztec](docs/AZTEC-PROTOTYPE.md) — malipo ya siri ya ZK na dhamana (utafiti)
- [Ramani ya barabara](docs/ROADMAP.md) — hatua na hali ya sasa
- [FAQ](docs/FAQ.md) — maswali yanayoulizwa mara kwa mara
- [Mwongozo wa pochi](docs/WALLETS.md) — jinsi ya kuunda pochi na kupata anwani za mchango

## Leseni

Imepewa leseni chini ya [MIT License](LICENSE).

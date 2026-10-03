[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)

# EVOLVE

**Urafiki, kuzazi na afya iliyothibitishwa — faragha kwa chaguo-msingi, uaminifu pale penye umuhimu.**

EVOLVE ni jukwaa la chanzo-wazi na la ugatuzi lililoundwa kwa watu ambao wachoka kuwasilisha namba yao ya simu, sura yao na taarifa zao nyeti zaidi za kiafya kwenye hifadhidata ya mtu mwingine. Unakingia kwa kutumia mkoba wako mwenyewe wa sarafu — bila simu, bila barua pepe, bila KYC — na unaweza kupata akaunti yako tena kupitia ahadi ya DNA iliyoko kwenye mnyororo. Taarifa zako za kiafya zinabaki zako: matokeo ya vipimo vinachambuliwa kiotomatiki, hali ya kila kiini-cha-magonjwa **haiwahi** kuonyeshwa kwa mtu yeyote, na utafananishaji unategemea tu maamuzi ya utangamanifu yasiyo na majina (Salama / Inafaa / Tahadhari / Hatari). Mazungumzo hufanya kwa muundo wa rika-kwa-rika kupitia libp2p na Nostr, ukiwa na njia mbadala ya HTTP kwa urahisi.

> **Hali — jukwaa linafanya kazi leo; mtandao mkuu na DEX ndiyo hatua inayofuata.**
> Urafiki, kuzazi, uthibitisho wa afya, mtiririko wa maabara, mazungumzo ya P2P, sarafu ya EVOLVE na utawala vyote vinafanya kazi. Zinazosalia mbele: **utekelezaji kwenye mtandao mkuu na umajini wa DEX**, pamoja na **mauzo ya umma yaliyopangwa** (ona [Sarafu ya EVOLVE](#the-evolve-token-testnet-only)).
> Mikataba mingi imetekelezwa kwenye **mtandao wa majaribio wa Ethereum Sepolia tu**. Hakuna chochote hapa ambacho ni ushauri wa kifedha au ofa ya uwekezaji.

> **EVOLVE inakupa faida? Mkvelope uendelezaji — kila mchango huenda kwa msimbo, ushirikiano wa maabara, upangishaji na utafsiri → [DONATE.md](DONATE.md).**

## Hakuna la kuogopa

EVOLVE iliundwa kuzunguka maswali ambayo watu huuliza kweli kabla ya kuamini jukwaa kama hili.

| Wasiwasi                                         | EVOLVE tayari inachofanya kuhusu hilo                                                                                                                                                       |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| "Taarifa zangu za kiafya zitavuja."              | Matokeo ya kila kiini-cha-magonjwa **hayawahi** kuonyeshwa kwa mtu yeyote — mwamuzi usio na majina tu: Salama / Inafaa / Tahadhari / Hatari.                                                |
| "Picha zangu zitaishia mahali."                  | Picha huwa zimefungwa kwa chaguo-msingi. Mmiliki hutoa ruhusa ya kutazama kwa **sekunde 15** au **ya kudumu** — kwa ombi au kwa hiari yake. Kutazama ni bure.                               |
| "Nitakaulazimisha kunamba kitambulisho au simu." | Kuingia kwa mkoba (SIWE). Hakuna simu, hakuna barua pepe, hakuna KYC. Kurejesha akaunti hufanya kwa ahadi ya DNA iliyoko kwenye mnyororo.                                                   |
| "Yeye anadanganya kuhusu kuwa na afya njema."    | Matokeo yame**thibitishwa na maabara** (QR + ulinganishaji wa uso), na vipimo vya wanandoa huchukuliwa **kwenye mkutano wenyewe** — matokeo ya karibuni ya ITPU ndiyo muhimu, DNA haizeezi. |
| "Je, mtu atachukua pesa zangu na kutoweka?"      | Kuzazi kunaendeshwa na dhamana halisi yenye hatari: amana ya mwanaume inasogea tu pale ubaba unapo**thibitishwa**; la sivyo inarudishwa kwake tu.                                           |
| "Je, sarafu hii ni mpango wa kufufua na kuuza?"  | Hakuna mauzo yanayoendelea leo; msimbo ni wazi (MIT); akiba isiyozungukwa imepangwa kufungwa kwenye **ghala lisiloweza kudrainiwa** ambalo hata mwanzilishi hawezi kutoa.                   |
| "Je, jukwaa linaweza kufungwa au kuzuiwa?"       | Ujumbe wa rika-kwa-rika kwanza, hifadhi iliyogatuliwa (IPFS / Arweave), mipangilio 18 ya mitandao ya EVM, na hakuna kikoa kilichowekwa kwa nguvu kwenye msimbo.                             |

## Nini na Kwa nini

Programu za kawaida za urafiki huuliza ubadilishe namba yako ya simu, barua pepe, picha na maelezo nyeti ya kiafya kwa hifadhidata ya kati — kisha uiamini hiyo hifadhidata milele. EVOLVE huanza kutoka dhana ya kinyume: **faragha kwa chaguo-msingi, umiliki-binafsi, na hakuna hatua moja ya kushindwa**.

- **Faragha kwa chaguo-msingi** — taarifa za kiafya hazifichuliwi kamwe; maamuzi yasiyo na majina tu.
- **Ustahimilivu wa marufuku** — ujumbe wa P2P kwanza, hifadhi iliyogatuliwa, muundo wa mitandao mingi, hakuna vikoa vilivyowekwa kwa nguvu.
- **Kitambulisho chenye umiliki-binafsi** — mkoba wako ni kuingia kwako; kurejesha kwa DNA badala ya barua pepe au simu.
- **Hakuna lango la KYC** — hakuna kitambulisho cha serikali, simu au barua pepe inayohitajika kutumia jukwaa.

Soma sababu kamili katika [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md).

## Afya unayoweza kuiamini kwelikweli

- Pakia kipimo cha ITPU kama maandishi ghafi au PDF (utoaji wa tabaka-la-maandishi, ukiwa na njia mbadala ya OCR kwa skani).
- Kichambuzi kinajua viini-cha-magonjwa 8: HIV-1/2, Kaswende, Klamidia, Kisonono, HSV-1, HSV-2, Homa ya Manjano B, Homa ya Manjano C — katika fomati za ripoti za Kiingereza, Kiukreni na Kirusi.
- **Hali ya kila kiini-cha-magonjwa haiwahi kuonyeshwa kwa watumiaji wengine.** Wasifu huonyesha mwamuzi usio na majina tu: **Salama / Inafaa / Tahadhari / Hatari**.
- Rekodi za DNA zilizoko kwenye mnyororo (`DNAVerification.sol`) zinawezesha kurejesha na kuthibitisha.

### Maabara washirika — uthibitisho, si ahadi

Ingia kwenye maabara shirika na uonyeshe msimbo wako wa QR. Maabara huusoma, inathibitisha utambulisho wako kwa **ulinganishaji wa uso** (ili mtu mwingine asiweze kuchukua matokeo yako) na huambatanisha ripoti ya ITPU — PDF, skani au maandishi, hata yenye OCR mbaya. Matokeo yanasainiwa na maabara halisi, si wewe, hivyo wengine wanaona **ukweli uthibitishwa** badala ya neno lako. Na kila uthibitisho uliothibitishwa hulipa **EVOLVE 1 kwa mgonjwa na EVOLVE 1 kwa maabara** — pande zote mbili zina sababu ya kuwa mwaminifu. Viini-cha-magonjwa bado haiwahi kuonyeshwa kwa mtu yeyote.

## Kutafuta mtu

- Vichujio vya utafutaji: "Unatafuta nini" (urafiki / kuzazi / kuzazi ya wake-wawili-au-zaidi / kupima ITPU), "Unatafuta nani" (wanaume, wanawake, wanandoa), uteuzi unaoendelea nchi → mji, "anaweza kusafiri kwenda nchi yako" kwa orodha za kila nchi, rangi ya ngozi, mapendeleo ya kupima, ITPU-tangamanifu-tu.
- Kizuizi cha utangulizi: umri (unaweza kufichwa), lugha, wasifu wa kibinafsi, picha.
- **Mazungumzo ya P2P** kupitia libp2p (gossipsub) + Nostr, ukiwa na njia mbadala ya API ya HTTP.

## Kuzazi

Njia mbili za kupanga mtoto, na zote mbili zinategemea wazo moja: nia halisi inaonyeshwa kwa dhamana halisi ya EVOLVE — kamwe kwa ahadi. Ahadi ya mwanaume inakaa kwenye amana yake ya EvolveFund (kuanzia EVOLVE 15, imefungwa kwa siku 30 au zaidi), na mwanamke anaweza kuweka kiwango chake cha chini cha amana kwa wanaume wanaomfikia.

**Kuzazi.** Mwanamke anayeongoza: anamwalika mwanaume mahususi na kumtaja ndani ya dhamana. Anahitaji amana hai ya EvolveFund; wanapothibitisha wote wawili, inafungwa na hesabu ya nyuma inaanza. Ujauzito unaripotiwa kati ya siku 14 na 30 baada ya uthibitisho, na vipimo vya ITPU na DNA vya wanandoa huchukuliwa kwenye mkutano wenyewe — matokeo ya karibuni ya ITPU ndiyo muhimu, DNA haizeezi. Ubaba unapothibitishwa, amana ya mwanaume inamwenda mwanamke; isipothibitishwa, amana inaachiliwa huru kwake tu. Hakuna kinachobadilishana mikono hadi ukweli utulizwe.

**Kuzazi ya wake-wawili-au-zaidi.** Chaguo ni lake, na linabaki la faragha. Anafungua kipindi kinachodumu kwa saa 48 — bila amana yake mwenyewe (anaweza kuongeza moja kwa sifa tu, kama atapenda). Wanaume wenye amana hai wanaweza kujiunga — hadi 50 — na kuthibitisha, jambo linalofunga dhamana zao. Siku kumi na nne baada ya kipindi kufungwa, baba huchaguliwa. Anapata amana yake tena pamoja na tuzo kutoka kwenye dimba: mara mbili ya amana yake na EVOLVE 1 kwa kila mshiriki mwingine. Wanaume wasiochaguliwa hunyimaswa dhamana zao — 90% kwa mwanamke, 10% kwa baba aliyechaguliwa. Yeye hahatarishi chochote na anaweza kupata tu; wanaume huweka dhamana yao nyuma ya haki ya kuchaguliwa.

## Sarafu ya EVOLVE (mtandao wa majaribio tu)

- ERC-20, kikomo cha juu cha usambazaji **EVOLVE 8,000,000,000**. Vitendo vya utawala vinazuiliwa na `TimelockController` ya saa 48.
- **Mgawanyo uliopangwa wa usambazaji** — umeundwa kuweka karibu usambazaji wote kufanya kazi kwa watumiaji, si kwa wafadhili wa ndani:

| Kusudi                                                    |        EVOLVE |
| --------------------------------------------------------- | ------------: |
| Waanzilishi na timu (mshahara / tuzo)                     |    25,000,000 |
| Akiba ya DEX (baadaye)                                    |     4,000,000 |
| Mauzo ya umma (yaliyopangwa)                              |     5,000,000 |
| Akiba ya tuzo — maabara, wagonjwa, akina mama, akina baba | 7,966,000,000 |

- **Mauzo ya umma yaliyopangwa** — EVOLVE 5,000,000 zinauzwa na programu kwa **$0.8 kila moja**, zinazolipwa kwa sarafu yoyote inayoungwa mkono na programu; mapato hufadhili uendelezaji. _(Yaliyopangwa — hayajaanza.)_
- **Utoaji usio na udhamini (umiupangwa)** — akiba ya tuzo ya ~7,966,000,000 inapangwa kufungwa kwenye `RewardVault` isiyoweza kudrainiwa: inatoa polepole tu kupitia tuzo za maabara, wagonjwa, akina mama na akina baba, huku mabadiliko ya sheria yakihitaji kura za utawala. Hata mwanzilishi hawezi kuitoa. Muundo: [docs/REWARD-VAULT-PLAN.md](docs/REWARD-VAULT-PLAN.md).
- **Uchumi wa zawadi za emoji** — zawadi inagharimu EVOLVE 1, inagawanywa kwa uwiano kwa wamiliki wapo wa zawadi; ni mfano wa mapato ya milele, na zawadi zinaweza kuhamishwa.
- **EvolveFund** — wekaji dhamana la kiume (kiwango cha chini EVOLVE 15, kufungwa siku 30) linalohesabiwa kwenye uzito wa utawala; wanawake hutumia salio lao la mkoba.
- **Tuzo za uthibitisho** — EVOLVE 1 kwa mtumiaji aliyeuthibitishwa na EVOLVE 1 kwa maabara ithibitishayo kwa kila uthibitisho wa ITPU/DNA (pamoja na bomba la maji lenye kikomo cha matumizi).
- **Utawala** — uzito wa kura unachanganya sifa ya kurudiarudi (kura 8, kina 3), uwiano wa watoto/ubaba, na EVOLVE zilizowekwa au zinazoshikiliwa.
- **Unganishaji wa LayerZero OFT** kwa uhamisho wa baadaye wa EVOLVE kwenye minyororo mingi (untegemezi umewekwa; hakuna kilichotekelezwa zaidi ya Sepolia bado).

## Mkvelope mradi

EVOLVE ni huru na wa chanzo-wazi. Ikiwa ni ya manufaa kwako, unaweza kuunga mkono uendelezaji kwa mchango — kila mchango huenda kwa msimbo, ushirikiano na maabara, upangishaji na utafsiri.

- **Maelezo ya mchango (EVM, Monero na mengine):** [DONATE.md](DONATE.md)
- **Ukurasa wa michango wenye lugha nyingi (lugha 34):** **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**

Mauzo ya umma ya sarafu yako kwenye ramani ya njia lakini **hayako** hai leo. Michango ni zawadi zinazounga mkono uendelezaji wa chanzo-wazi na hazitoi madai ya sarafu, hisa, mapato au faida. Tafadhali toa tu unachoweza kumudu kupoteza.

## Muundo na Seti ya Teknolojia

Monorepo inayosimamiwa kwa npm workspaces + Turborepo:

```
apps/
  web/          # Vite + React + TypeScript (programu kuu ya wavuti, i18next, Prisma)
  mobile/       # Expo + React Native
packages/
  config/       # Alama za vipengele & usanidi wa mbali unaobadilika
  contracts/    # Solidity 0.8.24, Hardhat, Ignition, OpenZeppelin, LayerZero
  core/         # Aina, huduma, middleware, web3 zinazoshirikiwa
  matching/     # Algorithms za utafananishaji, vichujio, kupanga
  p2p/          # mtandao wa libp2p (gossipsub) + Nostr
  storage/      # IPFS, Arweave, Itifaki ya Lit
docs/           # Muundo, tokenomics, ramani ya njia, MASWALI
```

Mikataba mingi mikuu: `EVOLVE.sol` (ERC-20), `ProfileNFT.sol` (ERC-721), `TrustScore.sol`, `Voting.sol`, `Evolve2Earn.sol` (zawadi za emoji + tuzo), `Governance.sol`, `BondManager.sol` (kuzazi na kuzazi ya wake-wawili-au-zaidi), `EvolveFund.sol`, `VerificationRegistry.sol`, `DNAVerification.sol`, ERC-4337 `SmartAccountFactory` + `Paymaster`, na `TimelockController` ya OpenZeppelin.

Maelezo: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md)

## Ramani ya Njia

Inaendelea: utayari wa uzalishaji wa programu ya wavuti. Imepangwa: rejista ya maabara kwenye mnyororo na uthibitisho wa vipimo, kibanzi halisi cha mtoa-huduma wa barua pepe kwa kupokea ripoti za maabara, uthibitisho halali kwenye mnyororo kwenye wasifu, **RewardVault isiyokuwa na udhamini** yenye utoaji unaolindwa na utawala ([muundo](docs/REWARD-VAULT-PLAN.md)), **mauzo ya umma ya sarafu**, sasisho la kuweka sarafu akibani kwa mgawanyo wa mwanzilishi, na kutoa umajini wa DEX (kwa sasa kumezuiwa — kunahitaji utekelezaji wa sarafu kwenye mtandao mkuu). Upanuzi wa mitandao mingi (Arbitrum, Avalanche na minyororo mingine ya EVM) hufuata baada ya kuimarisha mtandao wa majaribio.

Orodha kamili: [docs/ROADMAP.md](docs/ROADMAP.md).

## Kuanza (Wasanidi-programu)

Mahitaji: **Node.js 20+** na npm 10.x.

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

## Kuchangia

Mchango unakaribishwa — msimbo, ripoti za hitilafu, mapendekezo ya vipengele na mapendekezo. Tafadhali soma [CONTRIBUTING.md](CONTRIBUTING.md) na [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) yako kabla ya kuanza.

## Hifadhi (Mirrors)

| Mirror   | URL                                        |
| -------- | ------------------------------------------ |
| GitHub   | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg | https://codeberg.org/limitafternoon/Evolve |
| GitLab   | https://gitlab.com/evolve-group3/evolve    |

## Nyaraka

- [Nini na Kwa nini](docs/WHAT-AND-WHY.md) — tatizo, dhana, thamani za msingi
- [Inafanyaje Kazi](docs/HOW-IT-WORKS.md) — mtiririko wa mtumiaji, hatua kwa hatua
- [Muundo](docs/ARCHITECTURE.md) — monorepo, furushi, mitiririko ya data
- [Tokenomics](docs/TOKENOMICS.md) — mfano wa sarafu na mgawanyo wa usambazaji
- [Mpango wa RewardVault](docs/REWARD-VAULT-PLAN.md) — utoaji usio na udhamini (umiupangwa)
- [Ramani ya Njia](docs/ROADMAP.md) — hatua kuu na hali ya sasa
- [MASWALI](docs/FAQ.md) — maswali yanayoulizwa mara kwa mara
- [Mwongozo wa mkoba](docs/WALLETS.md) — jinsi ya kuunda mikoba na kupata anwani za michango

## Leseni

Imeidhinishwa chini ya [Leseni ya MIT](LICENSE).

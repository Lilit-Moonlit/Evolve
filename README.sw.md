[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)

# EVOLVE

**Kutafuta wapenzi, kupata mimba na uthibitisho wa afya — faragha kwa msingi, imethibitishwa pale ambapo ina umuhimu.**

EVOLVE ni jukwaa la chanzo wazi (open-source) na la teguzi (decentralized) kwa uhusiano wa karibu unaoweza kuthibitishwa: kutafuta wapenzi, kupata mimba, na uoiano wa STD/DNA usio na majina. Unajiandikisha kwa mkoba wako mwenyewe wa sarafu za kidijitali (Sign-In with Ethereum) — hakuna namba ya simu, hakuna barua pepe, hakuna KYC — nawe unaweza kurejesha akaunti yako kupitia ahadi (commitment) ya DNA iliyowekwa kwenye mnyororo (on-chain). Data za afya zinabaki za kwako: matokeo ya maabara huchambuliwa kiotomatiki, hali za vimelea binafsi **kamwe** hazioneshwi kwa mtu yeyote, na ulinganishaji unategemea tu maamuzi ya uoiano yasiyo na majina (Safe / Compatible / Caution / Risk). Mazungumzo hufanya kwa muundo wa rika-kwa-rika (peer-to-peer) kupitia libp2p na Nostr, ikiwa na njia mbadala ya HTTP kwa urahisi, na programu inakuja na "Safety Mode" ya umma nyepesi pamoja na Hali ya Msaidizi (Companion Mode) inayojitegemea kwa tathmini ya matokeo ya vipimo vya STD.

> **Hali: alfa ya hatua ya mwanzo.** EVOLVE ipo katika ukuzaji endelevu na si bidhaa iliyokamilika.
> Mikataba mahiri imepangwa **kwenye mtandao wa majaribio wa Ethereum Sepolia tu**.
> **Hakuna upangaji kwenye mainnet, hakuna DEX, hakuna akiba ya mtaji (liquidity), na hakuna mauzo ya umma ya tokeni** — wala hakuna linaloahidiwa.
> Vipengele vinaweza kubadilika au kuharibika wakati wowote. Hakuna chochote hapa ni ushauri wa kifedha au ofa ya uwekezaji.

## Nini na Kwa Nini

Majukwaa ya kawaida ya kutafuta wapenzi yanakuomba ukabidhi namba yako ya simu, barua pepe, picha na maelezo ya kina ya afya ya karibu kwenye hifadhidata kuu moja. EVOLVE huanza kutoka dhana ya kinyume: faragha kwa msingi, kujishikilia mwenyewe (self-custody), na hakuna sehemu kuu ya kushindwa. Thamani za msingi:

- **Faragha kwa msingi** — data za afya kamwe hazifichuliwi; maamuzi yasiyo na majina tu.
- **Uvumilivu wa marufuku (ban resistance)** — ujumbe kwa P2P kwanza, hifadhi ya teguzi (IPFS / Arweave), muundo wa mitandao mingi, hakuna kikoa kilichowekwa kwa nguvu kwenye msimbo.
- **Utambulisho wa kujishikilia** — mkoba wako ndio kuingia kwako; kurejesha kwa DNA badala ya barua pepe/simu.
- **Hakuna lango la KYC** — hakuna kitambulisho cha serikali, simu au barua pepe inayohitajika kutumia jukwaa.

Soma sababu kamili katika [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md) (kwa Kiingereza).

## Vipengele Muhimu

### Utambulisho na Faragha

- **Kuingia kwa mkoba kwa SIWE** (MetaMask na mikoba mingine ya EVM) — njia ya kutoroka inayoepuka udhibiti.
- **Kurejesha akaunti kwa DNA** — matokeo yako ya kipimo cha DNA hufanywa hash (SHA-256, imewekwa kwenye mnyororo kama `bytes32`) nawe inaweza kurejesha ufikiaji bila simu au barua pepe.
- **Account Abstraction (ERC-4337)** — akaunti mahiri na paymaster kwa kujiunga bila gharama ya gesi; SIWE daima inabaki ipatikane.

### Uoiano wa Afya Usio na Majina

- Pakia matokeo ya vipimo vya STD kama maandishi wazi au PDF (utoaji wa tabaka la maandishi kwa OCR kama njia mbadala kwa kurasa zilizoskanwa).
- Kichanganuzi hutambua vimelea 8: HIV-1/2, Kaswende, Klamidia, Kisonono, HSV-1, HSV-2, Hepatitis B, Hepatitis C (umbizo la ripoti kwa Kiingereza, Kiukreni na Kirusi).
- **Hali ya kila kimelea kamwe haioneshwi kwa watumiaji wengine.** Wasifu unaonyesha tu uamuzi usio na jina: **Safe / Compatible / Caution / Risk**.
- Rekodi za uthibitisho wa DNA zilizowekwa kwenye mnyororo (`DNAVerification.sol`) zinawezesha mitiririko ya kurejesha na kuthibitisha.

### Wasifu, Utafutaji na Mawasiliano

- Vichujio vya utafutaji: "Unatafuta nini" (kutafuta wapenzi / kupata mimba / kupata mimba kwa wanandoa wengi / kupima STD), "Unatafuta nani" (wanaume, wanawake, wanandoa), uteuzi unaoendelea nchi → mji, "anaweza kusafiri kwenda nchi yako" kwa orodha za kila nchi, rangi ya ngozi, mapendeleo ya kupima, wenye uoiano wa STD tu.
- Kielelezo cha kuanza (onboarding): umri (inaweza kufichwa), lugha, wasifu wa kibinafsi, picha.
- **Faragha ya picha**: picha zinaonekana kwa ukungu kwa msingi; mmiliki hutoa ruhusa ya kutazama ya sekunde 15 au ya kudumu, kwa hiari yake au kwa ombi. Kutazama ni bure.
- **Mazungumzo ya P2P** kupitia libp2p (gossipsub) + Nostr, ikiwa na njia mbadala ya HTTP API.

### Hali za Kupata Mimba

- **Hali ya 2 — Pregnancy Bond**: mwanamke anaunda bond, mwanaume anaweka EVOLVE kama dhamana (≥ 100 kwenye toleo la sasa la mtandao wa majaribio), wote wanathibitisha; baada ya mimba iliyothibitishwa na ubaba, dhamana inahamishiwa kwa mwanamke.
- **Hali ya 3 — Cryptic Choice**: mwanamke anafungua kipindi cha saa 24 mbili (saa 48), wanaume wanajiunga kwa kuweka dhamana; yeye anachagua baba — dhamana yake inarudishwa, wengine hugawanywa 90% kwake / 10% kwa baba aliyechaguliwa.

### Maabara na Uthibitisho

- **Mtiririko wa washirika wa maabara**: maabara hujisajili kama washirika, huthibitisha wagonjwa kwa msimbo wa QR na ulinganifu wa uso, na huambatanisha ripoti za STD (PDF/maandishi kwa utoaji wa OCR).
- **Hali ya Msaidizi (Companion Mode)**: mtiririko unaojitegemea wa kutathmini matokeo ya vipimo vya STD bila kujiunga na jukwaa la kutafuta wapenzi.
- **Safety Mode** (`VITE_PRODUCT_MODE=safety`): fasadi ya umma iliyo na mipaka (hali ya STD, viungo vya wasifu vya umma, ukaguzi wa uoiano) inayoendelea kufanya kazi hata kama vipengele vya kutafuta wapenzi/kupata mimba vikizuiliwa katika eneo la sheria au duka la programu.

### Tokeni ya EVOLVE (mtandao wa majaribio tu)

- ERC-20, kikomo cha juu zaidi cha usambazaji ni EVOLVE 8,000,000,000, vitendo vya msimamizi vimewekewa TimelockController ya muda wa saa 48.
- **Uchumi wa zawadi za emoji**: zawadi inagharimu EVOLVE 1, ambayo hugawanywa kwa uwiano kati ya wamiliki wa zawadi waliopo — mfano wa mapato wa milele kwa watumiaji; zawadi zinaweza kuhamishwa.
- **EvolveFund**: kuweka dhamana kwa wanaume (angalau EVOLVE 15, kufungwa kwa siku 30) kunaingia kwenye uzito wa utawala; wanawake wanatumia salio lao la mkoba.
- **Tuzo za uthibitisho**: EVOLVE 1 kwa mtumiaji aliyeuthibitishwa na EVOLVE 1 kwa maabara ithibitishayo baada ya uthibitisho wa STD/DNA (pamoja na bomba la majaribio lenye kikomo cha kiwango).
- Uzito wa kura ya utawala unachanganya sifa ya kurudia-rudia (kura 8, kina 3), uwiano wa watoto/ubaba, na EVOLVE iliyowekwa ama iliyoshikiliwa.
- **Uunganishaji wa LayerZero OFT** kwa uhamisho wa baadaye wa EVOLVE kwenye minyororo mingi (utegemezi upo; hakuna chochote kimepangwa zaidi ya Sepolia kwa sasa).

### Jukwaa

- Programu ya wavuti (inaweza kusanikishwa kama PWA) na programu ya simu ya Expo/React Native.
- Kiolesura kimetafsiriwa kwa **lugha 34**.
- Tayari kwa mitandao mingi: mazingira ya mitandao 18 ya EVM (Arbitrum na Avalanche ndizo L2 kuu zilizopangwa — **bado hazijapangwa**).

## Muundo na Seti ya Teknolojia

Monorepo inayosimamiwa kwa npm workspaces + Turborepo:

```
apps/
  web/          # Vite + React + TypeScript (programu kuu ya wavuti, i18next, Prisma)
  mobile/       # Expo + React Native
packages/
  config/       # Bendera za vipengele & usanidi wa mbali unaobadilika
  contracts/    # Solidity 0.8.24, Hardhat, Ignition, OpenZeppelin, LayerZero
  core/         # Aina za pamoja, huduma za matumizi, middleware, web3
  matching/     # Algorithm za ulinganishaji, vichujio, kupanga
  p2p/          # libp2p (gossipsub) + mtandao wa Nostr
  storage/      # IPFS, Arweave, Lit Protocol
docs/           # Muundo, tokenomics, ramani ya njia, FAQ
```

Mikataba mahiri muhimu: `EVOLVE.sol` (ERC-20), `ProfileNFT.sol` (ERC-721), `TrustScore.sol`, `Voting.sol`, `Evolve2Earn.sol` (zawadi za emoji + tuzo), `Governance.sol`, `BondManager.sol` (Hali 2 na 3), `EvolveFund.sol`, `VerificationRegistry.sol`, `DNAVerification.sol`, ERC-4337 `SmartAccountFactory` + `Paymaster`, na `TimelockController` ya OpenZeppelin.

Maelezo: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md) (kwa Kiingereza).

## Ramani ya Njia

Inaendelea: utayari wa uzalishaji wa programu ya wavuti. Imepangwa: daftari la maabara kwenye mnyororo na uthibitisho wa vipimo, kiunganishi halisi cha mtoa huduma wa barua pepe kwa upokeaji wa ripoti za maabara, uthibitisho thabiti kwenye mnyororo kwenye wasifu, sasisho la vesting ya tokeni kwa mgawanyo wa waanzilishi/watengenezaji, na kuweka akiba ya mtaji ya DEX (kumezuiwa kwa sasa — inahitaji upangaji wa tokeni kwenye mainnet). Upanuzi wa mitandao mingi (Arbitrum, Avalanche na minyororo mingine ya EVM) unafuata baada ya kuimarika kwa mtandao wa majaribio.

Orodha kamili: [docs/ROADMAP.md](docs/ROADMAP.md) (kwa Kiingereza).

## Kuanza (Watengenezaji)

Mahitaji: **Node.js 20+** na npm 10.x.

```bash
# Nakili na usakinishe workspace zote
git clone https://github.com/Lilit-Moonlit/Evolve.git
cd Evolve
npm install

# Programu ya wavuti (seva ya dev ya Vite kwenye http://localhost:3000)
cd apps/web
npm run dev
npm test                # seti ya vitest

# Mikataba mahiri
cd packages/contracts
npm run compile         # hardhat compile
npm test                # seti ya majaribio ya hardhat
npm run deploy:local    # weka mikataba yote kwenye mtandao wa Hardhat ndani ya mchakato
```

## Kuchangia

Mchango unakaribishwa — msimbo, ripoti za hitilafu, mapendekezo ya vipengele na mapendekezo. Tafadhali soma [CONTRIBUTING.md](CONTRIBUTING.md) na [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) yetu kabla ya kuanza.

## Kuunga Mkono Mradi

Ukikuta EVOLVE ni muhimu kwako, unaweza kuunga mkono ukuzaji kwa mchango wa fedha — maelezo katika [DONATE.md](DONATE.md). Unapenda ukurasa wa wavuti? Tumia ukurasa wa michango wa lugha nyingi (lugha 34): **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**.

**Hakuna mauzo ya tokeni na hakuna yatakayokuwepo.** Hauwezi "kuwekeza" kwenye tokeni za EVOLVE; michango ni zawadi za kuunga mkono ukuzaji wa chanzo wazi na haimpati mchangiaji haki ya tokeni, hisa, faida au dai lolote la kifedha.

## Hazina (Nakala)

| Nakala   | URL                                        |
| -------- | ------------------------------------------ |
| GitHub   | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg | https://codeberg.org/limitafternoon/Evolve |
| GitLab   | https://gitlab.com/evolve-group3/evolve    |

## Nyaraka

- [Nini na Kwa Nini](docs/WHAT-AND-WHY.md) — tatizo, dhima, thamani za msingi (kwa Kiingereza)
- [Inavyofanya Kazi](docs/HOW-IT-WORKS.md) — mitiririko ya mtumiaji, hatua kwa hatua (kwa Kiingereza)
- [Muundo](docs/ARCHITECTURE.md) — monorepo, furushi, mitiririko ya data (kwa Kiingereza)
- [Tokenomics](docs/TOKENOMICS.md) — mfano wa tokeni na usambazaji wa akiba (kwa Kiingereza)
- [Ramani ya Njia](docs/ROADMAP.md) — maeneo muhimu na hali ya sasa (kwa Kiingereza)
- [Maswali Yanayoulizwa Mara kwa Mara](docs/FAQ.md) — maswali ya kawaida (kwa Kiingereza)
- [Mwongozo wa Mkoba](docs/WALLETS.md) — jinsi ya kuunda mikoba na kupata anwani za michango (kwa Kiingereza)

## Leseni

Imeidhinishwa chini ya [Leseni ya MIT](LICENSE).

[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)
<!-- evolve-readme-sync: 3796750887b0bd65 -->

# EVOLVE

**Pag-iibigan, paglilihi, at beripikadong kalusugan — pribado bilang default, mapagkakatiwalaan kung saan mahalaga.**

Ang EVOLVE ay isang open-source at desentralisadong platform para sa mga taong sawang-sawa nang ipinagbibigay ang kanilang numero ng telepono, ang kanilang mukha, at ang pinakamaselang datos ng kanilang kalusugan sa database ng ibang tao. Naglala-login ka gamit ang sarili mong crypto wallet — walang telepono, walang email, walang KYC — at mababawi mo ang iyong account sa pamamagitan ng isang on-chain DNA commitment. Nasa iyo mananatili ang iyong datos ng kalusugan: awtomatikong pinoproseso ang mga resulta ng pagsusuri, ang indibidwal na status ng bawat pathogen ay **hindi kailanman** ipinapakita kaninuman, at ang pagtutugma ay nakasalalay lamang sa mga anonymous na hatol ng pagkakatugma (Safe / Compatible / Caution / Risk). Tumatakbo nang peer-to-peer ang chat sa ibabaw ng libp2p at Nostr, na may HTTP fallback para sa kaginhawaan. Ang mga regalo at paglilipat ng pondo ay patungo na sa ganap na kumpidensyalidad: buhay na ngayon ang mga sender-private na regalo, kasama ang Railgun shielded wallet at Aztec zero-knowledge prototype sa roadmap (tingnan ang [Privacy & kumpidensyal na mga transaksyon](#privacy--confidential-transactions)).

> **Estado — demo mode, kasalukuyang aktibong binubuo.**
> Ang pag-iibigan, paglilihi, beripikasyon ng kalusugan, daloy ng laboratoryo, P2P chat, ang EVOLVE token at ang governance — lahat ng ito ay ipinatutupad at tumatakbo sa isang **local demo** — ang app ay **hindi pa pampublikong naide-deploy**. Nasa unahan pa: **mainnet deployment at DEX liquidity**, pati na rin ang **planong pampublikong pagbebenta** (tingnan ang [Ang EVOLVE token](#the-evolve-token-testnet-only)).
> Ang mga smart contract ay naka-deploy lamang sa **Ethereum Sepolia testnet**. Walang anuman dito ang maituturing na payo sa pananalapi o alok na pamumuhunan.

> **Nakatulong ba sa iyo ang EVOLVE? Suportahan ang development — ang bawat donasyon ay napupunta sa code, mga partnership sa laboratoryo, hosting at pagsasalin → [DONATE.md](DONATE.md).**

## Walang dapat ikatakot

Ang EVOLVE ay binuo ayon sa mga tanong na talagang itinatanong ng mga tao bago pagkatiwalaan ang isang platform na katulad nito.

| Ang pangamba                                    | Ang ginagawa na ng EVOLVE tungkol dito                                                                                                                                                                                                   |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| "Malle-leak ang datos ng kalusugan ko."         | Ang indibidwal na resulta ng bawat pathogen ay **hindi kailanman** ipinapakita kaninuman — anonymous na hatol lamang: Safe / Compatible / Caution / Risk.                                                                                |
| "Mapupunta ang mga litrato ko kahit saan."      | Naka-blur ang mga litrato bilang default. Ang may-ari ang nagbibigay ng **15-segundo** o **permanente** na pagtingin — kapag may kahilingan o kusang-loob. Libre ang pagtingin.                                                          |
| "Kailangan kong ibigay ang ID o telepono ko."   | Wallet login (SIWE). Walang telepono, walang email, walang KYC. Gumagana ang pagbawi ng account sa pamamagitan ng on-chain DNA commitment.                                                                                               |
| "Nagsisinungaling siya na malinis siya."        | **Nabe-beripika ng laboratoryo** ang mga resulta (QR + face match), at ang mga pagsusuri ng magkapareha ay isinasagawa **sa mismong pagkikita** — mahalaga ang mga kamakailang resulta ng STD, ang DNA naman ay hindi tumatanda.         |
| "Kukuhanin ba ng iba ang pera ko at maglalaho?" | Ang paglilihi ay tumatakbo sa totoo at nasa-panganib na stake: gumagalaw lamang ang deposito ng lalaki kapag **kumpirmado na** ang pagiging ama; kung hindi, ibinabalik lamang ito sa kanya.                                             |
| "Pump-and-dump ba ang token na ito?"            | Bukas ang code (MIT); halos ang buong supply ay nakalaan para sa mga gantimpala ng mga gumagamit, at ang hindi pa umiikot na reserba ay planong ikandado sa isang **non-drainable vault** na hindi maaaring kunan kahit ng tagapagtatag. |
| "Maaari bang isara o ipagbawal ang platform?"   | Peer-to-peer muna ang pagmemensahe, desentralisadong storage (IPFS / Arweave), 18 EVM network config, at walang hardcoded na domain.                                                                                                     |

## Ano at Bakit

Ang mga tradisyonal na dating app ay hinihiling na ipagpalit mo ang iyong numero ng telepono, email, mga litrato at maselang mga detalye ng kalusugan para sa isang sentral na database — at pagkatapos ay ipagkatiwala mo iyon magpakailanman. Ang EVOLVE ay nagsisimula sa kabaligtaran na premisa: **pribado bilang default, self-custody, at walang iisang punto ng pagkabigo**.

- **Pribado bilang default** — ang datos ng kalusugan ay hindi kailanman inilalantad; anonymous na mga hatol lamang.
- **Pagtutol sa pagbabawal** — P2P-muna na pagmemensahe, desentralisadong storage, multi-network na disenyo, walang mga hardcoded na domain.
- **Self-custodial na pagkakakilanlan** — ang iyong wallet ang iyong login; pagbawi ng account na batay sa DNA sa halip na email o telepono.
- **Walang KYC na hadlang** — walang government ID, telepono o email na kailangan para magamit ang platform.

Basahin ang buong paliwanag sa [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md).

## Kalusugan na maaari talagang pagkatiwalaan

- I-upload ang STD test bilang raw na teksto o PDF (ekstraksyon ng text-layer, na may OCR fallback para sa mga scan).
- Kilala ng parser ang 8 na pathogen: HIV-1/2, Syphilis, Chlamydia, Gonorrhea, HSV-1, HSV-2, Hepatitis B, Hepatitis C — sa mga format ng ulat na Ingles, Ukrainian at Russian.
- **Ang indibidwal na status ng pathogen ay hindi kailanman ipinapakita sa ibang mga gumagamit.** Walang ibang ipinapakita ang mga profile kundi ang anonymous na hatol: **Safe / Compatible / Caution / Risk**.
- Ang mga on-chain DNA record (`DNAVerification.sol`) ang nagpapakilos ng pagbawi ng account at beripikasyon.

### Mga partner na laboratoryo — patunay, hindi pangako

Pumasok sa isang partner na laboratoryo at ipakita ang iyong QR code. I-scan ito ng laboratoryo, kinukumpirma ang iyong pagkakakilanlan gamit ang **face matching** (upang walang ibang makakakuha ng iyong resulta) at ini-attach ang STD report — PDF, scan o teksto, kahit mahinang OCR. Pinipirmahan ng tunay na laboratoryo — hindi mo sarili — ang resulta, kaya ang iba ay nakakakita ng **beripikadong katunayan** sa halip na iyong salita. At ang bawat kumpirmadong beripikasyon ay nagbabayad ng **1 EVOLVE sa pasyente at 1 EVOLVE sa laboratoryo** — may dahilang maging tapat ang magkabilang panig. Ang indibidwal na mga pathogen ay nananatiling hindi ipinapakita kaninuman.

## Paghahanap ng makakasama

- Mga filter sa paghahanap: "Ano ang hinahanap mo" (pag-iibigan / paglilihi / polyandrous na paglilihi / STD testing), "Sino ang hinahanap mo" (mga lalaki, mga babae, mga magkapareha), sunud-sunod na pagpili ng bansa → lungsod, "kaya kong dumating sa iyong bansa" na may listahan kada bansa, kulay ng balat, kagustuhan sa testing, STD-compatible lamang.
- Onboarding wizard: edad (maaaring itago), mga wika, bio, litrato.
- **P2P chat** sa libp2p (gossipsub) + Nostr, na may HTTP API fallback.

## Paglilihi

Dalawang paraan ng pagpaplano ng anak, at pareho silang nakasalalay sa iisang ideya: ang tunay na intensyon ay ipinapakita ng tunay na stake sa EVOLVE — hindi kailanman ng mga pangako. Nananahan ang komitment ng lalaki sa kanyang deposito sa EvolveFund (mula 15 EVOLVE, nakakandado nang hindi bababa sa 30 araw), at maaaring itakda ng babae ang sarili niyang minimum na deposito para sa mga lalaking nakararating sa kanya.

**Paglilihi.** Ang babae ang namumuno: iniimbitahan niya ang isang partikular na lalaki at pinangangalanan siya sa isang bond. Kailangan ng lalaki ng aktibong deposito sa EvolveFund; kapag nagkumpirma na ang dalawa, nakakandado ito at nagsisimula na ang pagbibilang. Iniuulat ang pagbubuntis sa pagitan ng 14 at 30 araw pagkatapos ng kumpirmasyon, at ang mga pagsusuri sa STD at DNA ng magkapareha ay isinasagawa sa mismong pagkikita — mahalaga ang mga kamakailang resulta ng STD, ang DNA naman ay hindi tumatanda. Kapag nakumpirma na ang pagiging ama, lumilipat ang deposito ng lalaki sa babae; kung hindi ito nakumpirma, ibinabalik lamang ito sa kanya. Walang anumang lumilipat hangga't hindi nalalutas ang mga katunayan.

**Polyandrous na paglilihi.** Sa kanya ang pagpili, at nananatiling pribado iyon. Binubuksan niya ang isang session na tumatakbo nang 48 oras — nang walang sarili niyang deposito (maaari siyang magdagdag lamang para sa reputasyon, kung nais niya). Ang mga lalaking may aktibong deposito ay maaaring sumali — hanggang 50 — at kumumpirma, na nagkakandado sa kanilang stake. Labing-apat na araw pagkatapos magsara ang session, napipili ang ama. Nababalik sa kanya ang kanyang deposito dagdag ang gantimpala mula sa pool: dalawang beses ng kanyang deposito at 1 EVOLVE para sa bawat ibang kalahok. Ang mga lalaking hindi napipili ay nawawalan ng kanilang stake — 90% pumupunta sa babae, 10% sa napiling ama. Walang iniaalis na panganib ang babae at maaari lamang siyang makinabang; ang mga lalaki ay inilalagay ang kanilang stake sa likod ng karapatang mapili.

## Privacy & kumpidensyal na mga transaksyon

Ang privacy ang default — at bumubuo ang EVOLVE ng isang roadmap patungo sa ganap na kumpidensyal na mga on-chain na paglilipat.

- **Mga pribadong regalo** — magpadala ng rosas 🌹 o kaktus 🌵 (1 EVOLVE) at piliin kung sino ang makakaalam na ikaw ang nagpadala: _pampubliko_, _anonymous sa lahat maliban sa tatanggap_, o _ganap na anonymous_. Sa mga anonymous na mode, naglalakbay ang regalo bilang isang gamit-isang-beses na voucher na kinukuha ng tatanggap gamit ang sarili niyang wallet, kaya hindi kailanman lumilitaw on-chain ang nagpadala. (Casual-grade lamang ang anonymity ng nagpadala ngayon: maaaring i-correlate ang funding transaction batay sa oras at halaga.)
- **Railgun shielded wallet** — isang feature-flagged na pribadong wallet (`VITE_RAILGUN_ENABLED`, naka-off bilang default) na nagtatago ng mga halaga at address gamit ang live na zero-knowledge pool ng Railgun. Ito ang daan patungo sa tunay na anonymity ng nagpadala.
- **Aztec prototype** — ang parehong lohika ng pribadong paglilipat at pribadong bond, inihahayag bilang mga zero-knowledge na Noir circuit at pinapanatili sa likod ng tahasang gate hanggang maging production-ready ang Aztec. Tingnan ang [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md).
- **Modelo ng dalawang wallet** — lumalahok ang pampublikong stake-wallet sa governance; ang pribadong shielded wallet ay sadyang **hindi isinama** sa timbang ng governance, upang magkahiwalay ang privacy at ang kapangyarihan sa pagboto.

Mga detalye: [docs/RAILGUN-INTEGRATION.md](docs/RAILGUN-INTEGRATION.md) · [docs/SHIELDED-STAKES-DESIGN.md](docs/SHIELDED-STAKES-DESIGN.md) · [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md).

## Ang EVOLVE token (testnet lamang)

- ERC-20, pinakamataas na supply na **8,000,000,000 EVOLVE**. Ang mga aksyon ng admin ay nasa likod ng 48-oras na `TimelockController`.
- **Planong alokasyon ng supply** — dinisenyo upang maglingkod ang halos buong supply para sa mga gumagamit, hindi para sa mga insider:

| Layunin                                              |        EVOLVE |
| ---------------------------------------------------- | ------------: |
| Mga tagapagtatag at koponan (suweldo / gantimpala)   |    25,000,000 |
| DEX reserve (hinaharap)                              |     4,000,000 |
| Pampublikong pagbebenta (plano)                      |     5,000,000 |
| Reward reserve — mga laboratoryo, pasyente, ina, ama | 7,966,000,000 |

- **Planong pampublikong pagbebenta** — 5,000,000 EVOLVE na ibebenta ng app sa **$0.8 bawat isa**, mababayaran sa alinmang token na sinusuportahan ng app; ang mga kikita ay pondo para sa development. _(Plano — hindi pa ito buhay.)_
- **Trustless emission (plano)** — ang ~7,966,000,000 na reward reserve ay ilalagay sa isang non-drainable na `RewardVault`: inilalabas lamang nang unti-unti sa pamamagitan ng mga gantimpala para sa laboratoryo, pasyente, ina at ama, at ang anumang pagbabago sa mga patakaran ay nangangailangan ng boto sa governance. Kahit ang tagapagtatag ay hindi makakakuha mula rito. Disenyo: [docs/REWARD-VAULT-PLAN.md](docs/REWARD-VAULT-PLAN.md).
- **Ekonomiya ng emoji gift** — nagkakahalaga ng 1 EVOLVE ang isang regalo, hinahati nang proporsyonal sa mga kasalukuyang may-ari ng mga regalo; isang perpetual na modelo ng kita, at naililipat ang mga regalo.
- **EvolveFund** — staking ng mga lalaki (min 15 EVOLVE, 30-araw na lock) na kasama sa timbang ng governance; gumagamit ang mga babae ng kanilang wallet balance.
- **Mga gantimpala sa beripikasyon** — 1 EVOLVE sa nabe-beripikang gumagamit at 1 EVOLVE sa kumumpirmang laboratoryo kada beripikasyon ng STD/DNA (pati ang isang rate-limited na faucet).
- **Governance** — pinagsasama ng timbang ng boto ang recursive na reputasyon (8 boto, depth 3), bahagi sa mga anak/pagiging ama, at naka-stake o hawak na EVOLVE.
- **Integrasyon ng LayerZero OFT** para sa mga susunod na multichain na paglilipat ng EVOLVE (naka-install na ang mga dependency; wala pang naide-deploy lampas sa Sepolia).

## Suportahan ang proyekto

Malaya at open-source ang EVOLVE. Kung nakatutulong ito sa iyo, maaari mong suportahan ang development sa pamamagitan ng donasyon — ang bawat kontribusyon ay napupunta sa code, mga partnership sa laboratoryo, hosting at pagsasalin.

- **Mga detalye ng donasyon (EVM, Monero at marami pa):** [DONATE.md](DONATE.md)
- **Pahina ng donasyon sa maraming wika (34 na wika):** **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**

**Plano** ang isang pampublikong pagbebenta ng token — 5,000,000 EVOLVE, na ibebenta ng app (tingnan ang [Ang EVOLVE token](#the-evolve-token-testnet-only)). Ang mga donasyon ay mga kaloob na sumusuporta sa open-source na development at hindi nagbibigay ng anumang karapatan sa mga token, equity, kita o tubo. Mangyaring magbigay lamang ng kaya mong mawalan.

## Arkitektura at Tech Stack

Monorepo na pinamamahalaan ng npm workspaces + Turborepo:

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

Mga pangunahing smart contract: `EVOLVE.sol` (ERC-20), `ProfileNFT.sol` (ERC-721), `TrustScore.sol`, `Voting.sol`, `Evolve2Earn.sol` (mga emoji gift + mga gantimpala), `Governance.sol`, `BondManager.sol` (paglilihi at polyandrous na paglilihi), `EvolveFund.sol`, `VerificationRegistry.sol`, `DNAVerification.sol`, ERC-4337 `SmartAccountFactory` + `Paymaster`, at isang OpenZeppelin `TimelockController`.

Mga detalye: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md)

## Roadmap

Isinasagawa ngayon: ang paghahanda ng web app para sa production. Mga plano: on-chain na registry ng laboratoryo at sertipikasyon ng pagsusuri, isang tunay na mail-provider adapter para sa pagtanggap ng mga ulat mula sa laboratoryo, mga on-chain na beripikadong atestasyon sa mga profile, ang **trustless na RewardVault** na may governance-gated na emission ([disenyo](docs/REWARD-VAULT-PLAN.md)), ang **pampublikong pagbebenta ng token**, pag-update ng token vesting para sa alokasyon ng mga tagapagtatag, at pag-provision ng DEX liquidity (kasalukuyang nakaharang — nangangailangan ito ng mga mainnet na deployment ng token). Sa bahagi ng privacy, tapos na ang mga sender-private na regalo, habang nananatiling naka-gate sa likod ng mga pagsusuri sa [docs/ROADMAP.md](docs/ROADMAP.md) at [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md) ang Railgun shielded wallet at ang Aztec private-bond migration. Susunod ang paglawig sa maraming network (Arbitrum, Avalanche at iba pang EVM chain) pagkatapos mapatibay ang testnet.

Buong listahan: [docs/ROADMAP.md](docs/ROADMAP.md).

## Pagsisimula (mga Developer)

Mga kinakailangan: **Node.js 20+** at npm 10.x.

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

## Pag-aambag

Malugod na tinatanggap ang mga kontribusyon — code, mga ulat ng bug, mga mungkahi sa feature at mga proposal. Mangyaring basahin ang [CONTRIBUTING.md](CONTRIBUTING.md) at ang aming [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) bago ka magsimula.

## Mga Repositoryo (mga Kopya)

| Kopya (mirror) | URL                                        |
| -------------- | ------------------------------------------ |
| GitHub         | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg       | https://codeberg.org/limitafternoon/Evolve |
| GitLab         | https://gitlab.com/evolve-group3/evolve    |

## Dokumentasyon

- [Ano at Bakit](docs/WHAT-AND-WHY.md) — problema, bisyon, mga pangunahing halaga
- [Paano Ito Gumagana](docs/HOW-IT-WORKS.md) — mga daloy ng gumagamit, hakbang-hakbang
- [Arkitektura](docs/ARCHITECTURE.md) — monorepo, mga package, mga daloy ng datos
- [Tokenomics](docs/TOKENOMICS.md) — modelo ng token at distribusyon ng supply
- [Plano ng RewardVault](docs/REWARD-VAULT-PLAN.md) — trustless na emission (plano)
- [Integrasyon ng Railgun](docs/RAILGUN-INTEGRATION.md) — pagsubok sa integrasyon ng shielded wallet
- [Mga naka-shield na stake](docs/SHIELDED-STAKES-DESIGN.md) — mga pribadong stake sa paglilihi (disenyo)
- [Prototype ng Aztec](docs/AZTEC-PROTOTYPE.md) — mga ZK na pribadong paglilipat at bond (pananaliksik)
- [Roadmap](docs/ROADMAP.md) — mga milestone at kasalukuyang kalagayan
- [FAQ](docs/FAQ.md) — mga madalas itanong
- [Gabay sa Wallet](docs/WALLETS.md) — kung paano gumawa ng mga wallet at kumuha ng mga address para sa donasyon

## Lisensya

Nakalisensya sa ilalim ng [MIT License](LICENSE).

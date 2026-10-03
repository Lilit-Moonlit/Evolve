[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)

# EVOLVE

**Paghahanap ng kapareha, pagpaplano ng pagbubuntis at beripikadong kalusugan — pribado bilang default, pinagkakatiwalaan kung saan mahalaga.**

Ang EVOLVE ay isang open-source at desentralisadong plataporma para sa mga taong pagod nang ibigay ang kanilang numero ng telepono, ang kanilang mukha at ang pinakapribadong datos ng kanilang kalusugan sa database ng iba. Nagla-log-in ka gamit ang sarili mong crypto wallet — walang telepono, walang email, walang KYC — at maaari mong mabawi ang iyong account sa pamamagitan ng on-chain na DNA commitment. Ang datos ng iyong kalusugan ay nananatili sa iyo: awtomatikong sinusuri ang mga resulta ng test, ang indibidwal na status ng bawat pathogen ay **hindi kailanman** ipinapakita kahit kanino, at ang pagtutugma ay nakasalalay lamang sa anonimong verdict ng compatibility (Safe / Compatible / Caution / Risk). Ang chat ay tumatakbo nang peer-to-peer sa ibabaw ng libp2p at Nostr, na may HTTP fallback para sa kaginhawaan.

> **Status — gumagana na ngayon ang plataporma; ang mainnet at DEX ang susunod.**
> Ang paghahanap ng kapareha, pagbubuntis, beripikasyon ng kalusugan, daloy ng laboratoryo, P2P chat, ang EVOLVE token at governance ay lahat gumagana. Nasa unahan pa: **mainnet deployment at DEX liquidity**, bukod sa **nakaplanong public sale** (tingnan ang [Ang EVOLVE token](#the-evolve-token-testnet-only)).
> Ang mga smart contract ay naka-deploy **sa Ethereum Sepolia testnet lamang**. Walang anumang nandito na financial advice o alok ng pamumuhunan.

> **Nakatulong ba sa iyo ang EVOLVE? Suportahan ang development — ang bawat donasyon ay pumupunta sa code, partnership sa laboratoryo, hosting at pagsasalin → [DONATE.md](DONATE.md).**

## Walang dapat ikatakot

Ang EVOLVE ay binuo batay sa mga tanong na aktwal na itinatanong ng mga tao bago pagkatiwalaan ang isang plataporma na tulad nito.

| Ang pag-aalala                                  | Ang ginagawa na ng EVOLVE tungkol dito                                                                                                                                                                    |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| "Magleleak ang datos ko ng kalusugan."          | Ang indibidwal na resulta ng bawat pathogen ay **hindi kailanman** ipinapakita kahit kanino — anonimong verdict lamang: Safe / Compatible / Caution / Risk.                                               |
| "Mapupunta ang mga litrato ko kahit saan."      | Blurred bilang default ang mga litrato. Ang may-ari ay nagbibigay ng **15-segundo** o **permanente** na pagtingin — kapag may humingi o kusang-loob. Libre ang pagtingin.                                 |
| "Kailangan kong ibigay ang ID o telepono ko."   | Wallet login (SIWE). Walang telepono, walang email, walang KYC. Gumagana ang recovery sa pamamagitan ng on-chain na DNA commitment.                                                                       |
| "Nagsisinungaling siya na malusog siya."        | Ang mga resulta ay **beripikado ng laboratoryo** (QR + face match), at pinagtatakpan ng magkasintahan ang tests **sa mismong pagkikita** — mahalaga ang kamakailang STD resulta, hindi tumatanda ang DNA. |
| "Kukuhanin ba ng iba ang pera ko at maglalaho?" | Ang pagbubuntis ay batay sa tunay na stake na may panganib: gagalaw lamang ang deposito ng lalaki kapag **nakumpirma** ang pagiging ama; kung hindi, ipinapabalik lang ito sa kanya.                      |
| "Ba ito ay pump-and-dump?"                      | Walang live na sale ngayon; bukas ang code (MIT); ang hindi pa paikot-ikot na reserve ay nakaplanong ikandado sa isang **hindi madadrain na vault** na kahit ang founder ay hindi makakuha.               |
| "Maaari bang isara o ipagbawal ang plataporma?" | Peer-to-peer messaging muna, desentralisadong storage (IPFS / Arweave), 18 na EVM network config, at walang hardcoded na domain.                                                                          |

## Ano at Bakit

Ang mga tradisyonal na dating app ay hinihiling na ipagpalit mo ang iyong numero ng telepono, email, litrato at pribadong datos ng kalusugan para sa isang sentral na database — at pagkatapos ay pagtiwalaan ang database na iyon magpakailanman. Ang EVOLVE ay nagsisimula sa kabaligtarang premisa: **pribado bilang default, self-custody, at walang iisang punto ng pagkabigo**.

- **Pribado bilang default** — hindi kailanman inilalantad ang datos ng kalusugan; anonimong verdict lamang.
- **Pagtutol sa pagbibigay-bawal** — P2P-munang messaging, desentralisadong storage, multi-network na disenyo, walang hardcoded na domain.
- **Self-custodial na pagkakakilanlan** — ang wallet mo ang login mo; recovery batay sa DNA sa halip na email o telepono.
- **Walang KYC gate** — walang kinakailangang government ID, telepono o email para gamitin ang plataporma.

Basahin ang buong paliwanag sa [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md).

## Kalusugan na maaari mong pagkatiwalaan

- I-upload ang STD test bilang raw text o PDF (text-layer extraction, na may OCR fallback para sa mga scan).
- Kilala ng parser ang 8 na pathogen: HIV-1/2, Syphilis, Chlamydia, Gonorrhea, HSV-1, HSV-2, Hepatitis B, Hepatitis C — sa format ng ulat sa Ingles, Ukrainian at Russian.
- **Ang indibidwal na status ng pathogen ay hindi kailanman ipinapakita sa ibang user.** Ang mga profile ay nagpapakita lamang ng anonimong verdict: **Safe / Compatible / Caution / Risk**.
- Ang mga on-chain na DNA record (`DNAVerification.sol`) ang nagpapagana ng recovery at beripikasyon.

### Mga kapatid na laboratoryo — patunay, hindi pangako

Pumasok sa isang partner na laboratoryo at ipakita ang iyong QR code. I-scan ito ng laboratoryo, beripikahin ang iyong pagkakakilanlan gamit ang **face matching** (upang walang ibang makakuha ng iyong resulta) at i-attach ang STD report — PDF, scan o text, kahit mahinang OCR. Ang resulta ay pinipirmahan ng tunay na laboratoryo, hindi mo ikaw, kaya nakikita ng iba ang isang **beripikadong katunayan** sa halip na ang salita mo. At ang bawat kumpirmadong beripikasyon ay nagbabayad ng **1 EVOLVE sa pasyente at 1 EVOLVE sa laboratoryo** — may dahilan ang magkabilang panig na maging tapat. Ang indibidwal na pathogen ay patuloy na hindi ipinapakita kahit kanino.

## Paghahanap ng isang tao

- Mga filter sa paghahanap: "Ano ang hinahanap mo" (dating / pagbubuntis / polyandrous na pagbubuntis / STD testing), "Sino ang hinahanap mo" (mga lalaki, mga babae, mga mag-asawa), cascading na country → city selects, "kayang pumunta sa bansa mo" na may listahan bawat bansa, kulay ng balat, kagustuhan sa testing, STD-compatible-lamang.
- Onboarding wizard: edad (maaaring itago), mga wika, bio, litrato.
- **P2P chat** sa ibabaw ng libp2p (gossipsub) + Nostr, na may HTTP API fallback.

## Pagbubuntis

Dalawang paraan ng pagpaplano ng anak, at parehong nakabatay sa iisang ideya: ang tunay na intensyon ay ipinapakita sa tunay na stake sa EVOLVE — hindi kailanman sa pangako. Ang komitment ng lalaki ay nasa kanyang EvolveFund deposito (mula 15 EVOLVE, nakakandado nang hindi bababa sa 30 araw), at ang babae ay maaaring magtakda ng sarili niyang minimum na deposito para sa mga lalaking nakararating sa kanya.

**Pagbubuntis.** Ang babae ang namumuno: iniimbitahan niya ang isang partikular na lalaki at pinangalanan siya sa isang bond. Kailangan niya ng aktibong EvolveFund deposito; kapag nagkumpirma ang dalawa, ito ay nakakandado at nagsisimula na ang countdown. Iniuulat ang pagbubuntis sa pagitan ng 14 at 30 araw pagkatapos ng kumpirmasyon, at ang STD at DNA tests ng magkasintahan ay kinukuha sa mismong pagkikita — mahalaga ang kamakailang STD resulta, hindi tumatanda ang DNA. Kapag nakumpirma ang pagiging ama, ang deposito ng lalaki ay napupunta sa babae; kung hindi nakumpirma, ang deposito ay simple na lamang na ibinabalik sa kanya. Walang nabibigay hanggang sa malutas ang mga katunayan.

**Polyandrous na pagbubuntis.** Sa kanya ang pagpili, at nananatiling pribado. Binubuksan niya ang isang session na tumatakbo nang 48 oras — nang walang sarili niyang deposito (maaari siyang magdagdag lamang para sa reputasyon, kung nais niya). Ang mga lalaking may aktibong deposito ay maaaring sumali — hanggang 50 — at kumpirmahin, na nagkakandado ang kanilang stake. Labing-apat na araw pagkatapos magsara ang session, pinipili ang ama. Nababalik niya ang kanyang deposito bukod sa gantimpala mula sa pool: dalawang beses ng kanyang deposito at 1 EVOLVE para sa bawat ibang kalahok. Ang mga lalaking hindi napili ay nawawalan ng kanilang stake — 90% sa babae, 10% sa napiling ama. Wala siyang inaatasang panganib at maaari lamang siyang makinabang; ang mga lalaki ay inilalagay ang kanilang stake sa likod ng karapatang mapili.

## Ang EVOLVE token (testnet lamang)

- ERC-20, pinakamataas na supply na **8,000,000,000 EVOLVE**. Ang mga admin action ay hinihigpitan ng 48-oras na `TimelockController`.
- **Nakaplanong alokasyon ng supply** — dinisenyo upang gamitin ang halos buong supply para sa mga user, hindi para sa mga insider:

| Layunin                                              |        EVOLVE |
| ---------------------------------------------------- | ------------: |
| Mga founder at team (sweldo / gantimpala)            |    25,000,000 |
| DEX reserve (sa hinaharap)                           |     4,000,000 |
| Public sale (nakaplano)                              |     5,000,000 |
| Reward reserve — mga laboratoryo, pasyente, ina, ama | 7,966,000,000 |

- **Nakaplanong public sale** — 5,000,000 EVOLVE na ibinebenta ng app sa **$0.8 bawat isa**, mababayaran sa alinmang token na sinusuportahan ng app; ang kita ay pondo ng development. _(Nakaplano — hindi pa live.)_
- **Trustless emission (nakaplano)** — ang ~7,966,000,000 reward reserve ay nakaplanong ikandado sa isang hindi madadrain na `RewardVault`: inilalabas lamang nang dahan-dahan sa pamamagitan ng gantimpala sa laboratoryo, pasyente, ina at ama, at ang pagbabago ng mga patakaran ay nangangailangan ng boto ng governance. Kahit ang founder ay hindi makakakuha mula rito. Disenyo: [docs/REWARD-VAULT-PLAN.md](docs/REWARD-VAULT-PLAN.md).
- **Ekonomiya ng emoji gift** — ang isang gift ay nagkakahalaga ng 1 EVOLVE, hinahati proporsyonal sa mga umiiral na may-ari ng gift; isang permanente na modelo ng kita, at ang mga gift ay transferable.
- **EvolveFund** — stake ng lalaki (minimum 15 EVOLVE, 30-araw na lock) na binabatay sa timbang ng governance; ang mga babae ay gumagamit ng kanilang wallet balance.
- **Mga gantimpala sa beripikasyon** — 1 EVOLVE sa beripikadong user at 1 EVOLVE sa kumpirmadong laboratoryo bawat STD/DNA beripikasyon (kasama ang rate-limited na faucet).
- **Governance** — pinagsasama ang timbang ng boto mula sa recursive na reputasyon (8 boto, depth 3), bahagi ng mga anak/pagiging ama, at na-stake o hawak na EVOLVE.
- **LayerZero OFT** integration para sa susunod na multichain na paglilipat ng EVOLVE (naka-install na ang mga dependency; wala pang naka-deploy lampas sa Sepolia).

## Suportahan ang proyekto

Ang EVOLVE ay independiyente at open-source. Kung nakatulong ito sa iyo, maaari mong suportahan ang development sa pamamagitan ng donasyon — ang bawat kontribusyon ay pumupunta sa code, partnership sa laboratoryo, hosting at pagsasalin.

- **Mga detalye ng donasyon (EVM, Monero at iba pa):** [DONATE.md](DONATE.md)
- **Multilingual na pahina ng donasyon (34 na wika):** **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**

Ang public token sale ay nasa roadmap ngunit **hindi** ito live ngayon. Ang mga donasyon ay mga kaloob na sumusuporta sa open-source development at hindi nagbibigay ng karapatan sa token, equity, kita o tubo. Mangyaring magbigay lamang ng kaya mong mawala.

## Arkitektura at Tech Stack

Monorepo na pinamamahalaan ng npm workspaces + Turborepo:

```
apps/
  web/          # Vite + React + TypeScript (pangunahing web app, i18next, Prisma)
  mobile/       # Expo + React Native
packages/
  config/       # Feature flags & dynamic na remote configuration
  contracts/    # Solidity 0.8.24, Hardhat, Ignition, OpenZeppelin, LayerZero
  core/         # Shared na mga tipo, utility, middleware, web3
  matching/     # Mga algorithm ng pagtutugma, filter, ranking
  p2p/          # libp2p (gossipsub) + Nostr networking
  storage/      # IPFS, Arweave, Lit Protocol
docs/           # Arkitektura, tokenomics, roadmap, FAQ
```

Mga pangunahing smart contract: `EVOLVE.sol` (ERC-20), `ProfileNFT.sol` (ERC-721), `TrustScore.sol`, `Voting.sol`, `Evolve2Earn.sol` (mga emoji gift + gantimpala), `Governance.sol`, `BondManager.sol` (pagbubuntis at polyandrous na pagbubuntis), `EvolveFund.sol`, `VerificationRegistry.sol`, `DNAVerification.sol`, ERC-4337 `SmartAccountFactory` + `Paymaster`, at isang OpenZeppelin `TimelockController`.

Mga detalye: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md)

## Roadmap

Kasalukuyan: production-readiness ng web app. Nakaplano: on-chain na registry ng laboratoryo at sertipikasyon ng test, tunay na mail-provider adapter para sa pagtanggap ng ulat ng laboratoryo, on-chain na beripikadong attestation sa mga profile, ang **trustless RewardVault** na may governance-gated na emission ([disenyo](docs/REWARD-VAULT-PLAN.md)), ang **public token sale**, pag-update ng token vesting para sa alokasyon ng founder, at pagbibigay ng DEX liquidity (kasalukuyang naka-block — nangangailangan ng mainnet token deployment). Ang paglawig sa maraming network (Arbitrum, Avalanche at iba pang EVM chain) ay susunod pagkatapos mapalakas ang testnet.

Buong listahan: [docs/ROADMAP.md](docs/ROADMAP.md).

## Pagsisimula (Mga Developer)

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

## Pag-ambag

Ang mga kontribusyon ay malugod na tinatanggap — code, mga ulat ng bug, mga mungkahi sa feature at mga proposal. Mangyaring basahin ang [CONTRIBUTING.md](CONTRIBUTING.md) at ang aming [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) bago ka magsimula.

## Mga Repository (Mirrors)

| Mirror   | URL                                        |
| -------- | ------------------------------------------ |
| GitHub   | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg | https://codeberg.org/limitafternoon/Evolve |
| GitLab   | https://gitlab.com/evolve-group3/evolve    |

## Dokumentasyon

- [Ano at Bakit](docs/WHAT-AND-WHY.md) — problema, bisyon, mga pangunahing halaga
- [Paano Ito Gumagana](docs/HOW-IT-WORKS.md) — mga daloy ng user, hakbang-hakbang
- [Arkitektura](docs/ARCHITECTURE.md) — monorepo, mga package, mga daloy ng datos
- [Tokenomics](docs/TOKENOMICS.md) — modelo ng token at distribusyon ng supply
- [RewardVault plan](docs/REWARD-VAULT-PLAN.md) — trustless emission (nakaplano)
- [Roadmap](docs/ROADMAP.md) — mga milestone at kasalukuyang status
- [FAQ](docs/FAQ.md) — mga madalas itanong
- [Gabay sa wallet](docs/WALLETS.md) — kung paano gumawa ng mga wallet at kumuha ng mga address ng donasyon

## Lisensya

Nakalisensya sa ilalim ng [MIT License](LICENSE).

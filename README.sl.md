[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)

# EVOLVE

**Zmenkovanje, spočetje in preverjeno zdravje — zasebnost privzeto, zaupanje tam, kjer je pomembno.**

EVOLVE je odprtokodna, decentralizirana platforma za ljudi, ki so se naveličali izročanja svoje telefonske številke, svojega obraza in svojih najintimnejših zdravstvenih podatkov v tujo bazo podatkov. Prijavite se s svojo lastno kripto denarnico — brez telefona, brez e-pošte, brez KYC — svoj račun pa lahko pridobite nazaj prek zaveze DNK v verigi (on-chain). Vaši zdravstveni podatki ostanejo vaši: rezultati testov se razčlenijo samodejno, statusi posameznih patogenov se **nikoli** ne pokažejo nikomer, ujemanje pa temelji samo na anonimnih verdiktih združljivosti (Safe / Compatible / Caution / Risk). Klepet poteka peer-to-peer prek libp2p in Nostr, z HTTP rezervo za udobje.

> **Status — platforma deluje že danes; glavno omrežje in DEX sta naslednji korak.**
> Zmenkovanje, spočetje, preverjanje zdravja, laboratorijski potek, P2P klepet, žeton EVOLVE in upravljanje (governance) — vse to deluje. Pred nami še: **uvrstitev na glavno omrežje in likvidnost DEX** ter **načrtovana javna prodaja** (glejte [Žeton EVOLVE](#žeton-evolve-samo-testno-omrežje)).
> Pametne pogodbe so uvrščene **samo na testno omrežje Ethereum Sepolia**. Nič tu ni finančno svetovanje ali investicijska ponudba.

> **Vam je EVOLVE koristen? Podprite razvoj — vsak prispevek gre za kodo, laboratorijska partnerstva, gostovanje in prevode → [DONATE.md](DONATE.md).**

## Ničesar, česar bi se bali

EVOLVE je zgrajen okoli vprašanj, ki si jih ljudje dejansko postavijo, preden takšni platformi zaupajo.

| Skrb                                               | Kaj EVOLVE glede tega že danes stori                                                                                                                                                 |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| „Moji zdravstveni podatki bodo uhajali."           | Rezultati posameznih patogenov se **nikoli** ne pokažejo nikomer — le anonimen verdikt: Safe / Compatible / Caution / Risk.                                                          |
| „Moje fotografije bodo pristale nekje."            | Fotografije so privzeto zabrisane. Lastnik podeli **15-sekundni** ali **trajni** vpogled — na zahtevo ali proaktivno. Ogled je brezplačen.                                           |
| „Morali bom izročiti osebni dokument ali telefon." | Prijava z denarnico (SIWE). Brez telefona, brez e-pošte, brez KYC. Obnovitev deluje prek zaveze DNK on-chain.                                                                        |
| „On ali ona laže o zdravju."                       | Rezultati so **laboratorijsko preverjeni** (QR + primerjava obraza), testi para pa se odvzamejo **ob srečanju** — štejejo se sveži rezultati STD, DNK ne stari.                      |
| „Ali bo nekdo vzel moj denar in izginil?"          | Spočetje poteka na pravi, izpostavljeni vložek: moški depozit se premakne šele, ko je očetovstvo **potrjeno**; sicer se mu preprosto vrne.                                           |
| „Je žeton pump-and-dump?"                          | Danes nobena prodaja ni aktivna; koda je odprta (MIT); necirkulirajoča rezerva naj bi bila zaklenjena v **neizpraznjivem trezorju**, iz katerega ne more dvigniti niti ustanovitelj. |
| „Ali se platformo lahko izklopi ali prepove?"      | Predvsem peer-to-peer sporočanje, decentralizirana shramba (IPFS / Arweave), 18 konfiguracij omrežij EVM in brez pritrjene domene.                                                   |

## Kaj in zakaj

Tradicionalne aplikacije za zmenke od vas zahtevajo, da zamenjate telefonsko številko, e-pošto, fotografije in intimne zdravstvene podrobnosti za centralno bazo podatkov — in nato tej bazi zaupate za vedno. EVOLVE izhaja iz nasprotne premise: **zasebnost privzeto, lastniška skrb (self-custody) in brez ene same točke odpovedi**.

- **Zasebnost privzeto** — zdravstveni podatki se nikoli ne razkrivajo; le anonimni verdikti.
- **Odpornost na prepovedi** — predvsem P2P sporočanje, decentralizirana shramba, večomrežna zasnova, brez pritrjenih domen.
- **Self-custodial identiteta** — vaša denarnica je vaša prijava; obnovitev na podlagi DNK namesto e-pošte ali telefona.
- **Brez KYC pregrade** — za uporabo platforme ni potreben osebni dokument, telefon ali e-pošta.

Celotno utemeljitev preberite v [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md).

## Zdravje, ki mu lahko resnično zaupate

- Naložite STD test kot golo besedilo ali PDF (izvleček besedilne plasti, z OCR rezervo za skene).
- Razčlenjevalnik pozna 8 patogenov: HIV-1/2, sifilis, klamidija, gonoreja, HSV-1, HSV-2, hepatitis B, hepatitis C — v angleških, ukrajinskih in ruskih oblikah poročil.
- **Status posameznega patogena se nikoli ne prikaže drugim uporabnikom.** Profili pokažejo le anonimen verdikt: **Safe / Compatible / Caution / Risk**.
- Zapisi DNK on-chain (`DNAVerification.sol`) omogočajo obnovitev in preverjanje.

### Partnerski laboratoriji — dokazi, ne obljube

Vstopite v partnerski laboratorij in pokažite svojo kodo QR. Laboratorij jo optično prebere, potrdi vašo identiteto s **primerjavo obraza** (tako nihče drug ne more prevzeti vašega rezultata) in priloži poročilo STD — PDF, sken ali besedilo, celo s slabim OCR. Rezultat podpiše pravi laboratorij, ne vi, tako da drugi vidijo **preverjeno dejstvo** namesto vaše besede. In vsaka potrjena preveritev izplača **1 EVOLVE bolniku in 1 EVOLVE laboratoriju** — obe strani imata razlog, da sta iskreni. Posamezni patogeni se še vedno nikomur ne pokažejo.

## Iskanje nekoga

- Iskalni filtri: „Kaj iščete" (zmenkovanje / spočetje / poliandrično spočetje / testiranje STD), „Koga iščete" (moški, ženske, pari), kaskadna izbira država → mesto, „lahko pride v vašo državo" s seznami po državah, barva kože, prednost testiranja, samo STD-združljivi.
- Čarovnik za uvajanje: starost (možno skriti), jeziki, bio, fotografija.
- **P2P klepet** prek libp2p (gossipsub) + Nostr, z HTTP API rezervo.

## Spočetje

Dve poti za načrtovanje otroka — in obe temeljita na isti ideji: pravi namen se pokaže s pravim vložkom v EVOLVE — nikoli z obljubami. Zaveza moškega živi v njegovem depozitu EvolveFund (od 15 EVOLVE, zaklenjenem vsaj 30 dni), ženska pa si lahko nastavi svoj minimalni depozit za moške, ki pridejo do nje.

**Spočetje.** Ženska vodi: povabi določenega moškega in ga poimenuje v vez. Potrebuje aktiven depozit EvolveFund; ko oba potrdita, se zaklene in odštevanje se začne. Nosečnost se prijavi med 14. in 30. dnem po potrditvi, testova STD in DNK para pa se odvzame na samem srečanju — štejejo se sveži rezultati STD, DNK ne stari. Ko je očetovstvo potrjeno, moški depozit preide na žensko; če ni potrjen, se depozit preprosto vrne njemu. Nič ne zamenja lastnika, dokler dejstva niso razrešena.

**Poliandrično spočetje.** Izbora pripada njej — in ostane zasebna. Odpre sejo, ki teče 48 ur — brez lastnega depozita (za ugled si ga lahko doda, če želi). Moški z aktivnim depozitom se lahko pridružijo — do 50 — in potrdijo, s čimer se zaklene njihov vložek. Štirinajst dni po zaključku seje je izbran oče. Dobi svoj depozit nazaj plus nagrado iz sklada: dvakratnik svojega depozita in 1 EVOLVE za vsakega drugega udeleženca. Neizbrani moški izgubijo svoj vložek — 90 % ženski, 10 % izbranemu očetu. Ona ne tvega ničesar in lahko le pridobi; moški postavijo svoj vložek za pravico, da bodo izbrani.

## Žeton EVOLVE (samo testno omrežje)

- ERC-20, največja ponudba **8,000,000,000 EVOLVE**. Administrativna dejanja varuje 48-urni `TimelockController`.
- **Načrtovana razdelitev ponudbe** — zasnovana tako, da skoraj celotna ponudba dela za uporabnike, ne za insiderje:

| Namen                                                  |        EVOLVE |
| ------------------------------------------------------ | ------------: |
| Ustanovitelji in ekipa (plača / nagrada)               |    25,000,000 |
| Rezerva DEX (prihodnost)                               |     4,000,000 |
| Javna prodaja (načrtovana)                             |     5,000,000 |
| Rezerva nagrad — laboratoriji, bolniki, matere, očetje | 7,966,000,000 |

- **Načrtovana javna prodaja** — 5,000,000 EVOLVE, ki jih aplikacija prodaja po **$0.8 na kos**, plačljivo v katerem koli žetonu, ki ga aplikacija podpira; izkupiček financira razvoj. _(Načrtovano — še ni aktivno.)_
- **Trustless emisija (načrtovana)** — rezerva nagrad ~7,966,000,000 bo zaklenjena v neizpraznjivem `RewardVault`: sproščena le postopoma prek nagrad za laboratorije, bolnike, matere in očete, spremembe pravil pa zahtevajo glasovanje governance. Niti ustanovitelj ne more dvigniti. Načrt: [docs/REWARD-VAULT-PLAN.md](docs/REWARD-VAULT-PLAN.md).
- **Ekonomija daril z emoji** — darilo stane 1 EVOLVE, razdeljeno sorazmerno med obstoječe lastnike daril; večen prihodkovni model, darila pa so prenosljiva.
- **EvolveFund** — moški staking (min. 15 EVOLVE, 30-dnevna zaklenitev), ki se šteje v težo governance; ženske uporabljajo saldo denarnice.
- **Nagrade za preveritev** — 1 EVOLVE preverjenemu uporabniku in 1 EVOLVE potrjujočemu laboratoriju za vsako STD/DNK preveritev (plus faucet z omejitvijo).
- **Governance** — teža glasu združuje rekurzivni ugled (8 glasov, globina 3), delež otrok/očetovstva ter stakane ali držane EVOLVE.
- Integracija **LayerZero OFT** za prihodnje večverižne prenose EVOLVE (odvisnosti na mestu; onkraj Sepolije še ni nič uvrščeno).

## Podprite projekt

EVOLVE je neodvisna in odprtokodna. Če vam je koristna, lahko podprite razvoj z donacijo — vsak prispevek gre za kodo, laboratorijska partnerstva, gostovanje in prevode.

- **Podrobnosti donacij (EVM, Monero in več):** [DONATE.md](DONATE.md)
- **Večjezična donacijska stran (34 jezikov):** **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**

Javna prodaja žetonov je na načrtu, danes pa **ni** aktivna. Donacije so darila, ki podpirajo odprtokodni razvoj in ne dajejo nobene zahteve do žetonov, deležev, donosov ali dobička. Prosimo, dajte le toliko, kolikor lahko izgubite.

## Arhitektura in tehnološki sklad

Monorepo, upravljan z npm workspaces + Turborepo:

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

Ključne pametne pogodbe: `EVOLVE.sol` (ERC-20), `ProfileNFT.sol` (ERC-721), `TrustScore.sol`, `Voting.sol`, `Evolve2Earn.sol` (darila emoji + nagrade), `Governance.sol`, `BondManager.sol` (spočetje in poliandrično spočetje), `EvolveFund.sol`, `VerificationRegistry.sol`, `DNAVerification.sol`, ERC-4337 `SmartAccountFactory` + `Paymaster` ter OpenZeppelin `TimelockController`.

Podrobnosti: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md)

## Načrt razvoja

V teku: proizvodna pripravljenost spletne aplikacije. Načrtovano: on-chain register laboratorijev in certifikacija testov, pravi adapter ponudnika pošte za prejemanje laboratorijskih poročil, on-chain preverjene atestacije v profilih, **trustless RewardVault** z emisijo, ki jo nadzira governance ([načrt](docs/REWARD-VAULT-PLAN.md)), **javna prodaja žetonov**, posodobitev vestinga za alokacijo ustanoviteljev ter zagotavljanje likvidnosti DEX (trenutno blokirano — zahteva uvrstitev žetonov na glavno omrežje). Večomrežna širitev (Arbitrum, Avalanche in druga omrežja EVM) sledi po utrditvi testnega omrežja.

Celoten seznam: [docs/ROADMAP.md](docs/ROADMAP.md).

## Prvi koraki (razvijalci)

Zahteve: **Node.js 20+** in npm 10.x.

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

## Prispevanje

Prispevki so dobrodošli — koda, poročila o hroščih, predlogi funkcij in predlogi (proposals). Pred začetkom prosimo preberite [CONTRIBUTING.md](CONTRIBUTING.md) in naš [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Repozitoriji (zrcala)

| Zrcalo   | URL                                        |
| -------- | ------------------------------------------ |
| GitHub   | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg | https://codeberg.org/limitafternoon/Evolve |
| GitLab   | https://gitlab.com/evolve-group3/evolve    |

## Dokumentacija

- [Kaj in zakaj](docs/WHAT-AND-WHY.md) — problem, vizija, temeljne vrednote
- [Kako deluje](docs/HOW-IT-WORKS.md) — uporabniški tokovi, korak za korakom
- [Arhitektura](docs/ARCHITECTURE.md) — monorepo, paketi, tokovi podatkov
- [Tokenomika](docs/TOKENOMICS.md) — model žetona in razdelitev ponudbe
- [Načrt RewardVault](docs/REWARD-VAULT-PLAN.md) — trustless emisija (načrtovana)
- [Načrt razvoja](docs/ROADMAP.md) — mejniki in trenutno stanje
- [FAQ](docs/FAQ.md) — pogosto zastavljena vprašanja
- [Vodnik po denarnicah](docs/WALLETS.md) — kako ustvariti denarnice in pridobiti naslove za donacije

## Licenca

Licencirano pod [licenco MIT](LICENSE).

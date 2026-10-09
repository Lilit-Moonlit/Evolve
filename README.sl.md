[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)
<!-- evolve-readme-sync: 3796750887b0bd65 -->

# EVOLVE

**Zmenki, spočetje in preverjeno zdravje — privzeto zasebno, zaupanja vredno tam, kjer je najpomembneje.**

EVOLVE je odprtokodna, decentralizirana platforma za ljudi, ki nočejo več predajati svoje telefonske številke, svojega obraza in svojih najintimnejših zdravstvenih podatkov v zbirko podatkov nekoga drugega. Prijavite se s svojo lastno kripto denarnico — brez telefona, brez e-pošte, brez KYC — svoj račun pa si lahko povrnete prek zaveze DNA na verigi (on-chain). Vaši zdravstveni podatki ostanejo vaši: rezultati testov se razčlenijo samodejno, posameznih statusov patogenov **nikoli** ne vidi nihče, ujemanje pa temelji le na anonimnih presojah združljivosti (Safe / Compatible / Caution / Risk). Klepet poteka neposredno med vrstniki prek libp2p in Nostr, zaradi priročnosti pa je na voljo še HTTP nadomestna pot. Darila in prenosi ubirajo pot k popolni zaupnosti: darila z zasebnim pošiljateljem so danes že dejavna, na načrtu razvoja pa sta še zaščitena denarnica Railgun in prototip z ničelnim znanjem Aztec (glejte [Zasebnost in zaupne transakcije](#zasebnost-in-zaupne-transakcije)).

> **Status — demo način, v aktivnem razvoju.**
> Zmenki, spočetje, preverjanje zdravja, laboratorijski potek, klepet P2P, žeton EVOLVE in upravljanje so vsi implementirani in delujejo v **lokalnem demu** — aplikacija **še ni javno nameščena**. Pred nami še: **namestitev na glavno omrežje (mainnet) in likvidnost na DEX** ter **načrtovana javna prodaja** (glejte [Žeton EVOLVE](#žeton-evolve-samo-testno-omrežje)).
> Pametne pogodbe so nameščene **le na testnem omrežju Ethereum Sepolia**. Nič od tega ni finančni nasvet ali ponudba naložbe.

> **Vam je EVOLVE v pomoč? Podprite razvoj — vsaka donacija gre za kodo, partnerstva z laboratoriji, gostovanje in prevode → [DONATE.md](DONATE.md).**

## Česar se ni treba bati

EVOLVE je zgrajen okrog vprašanj, ki si jih ljudje dejansko zastavijo, preden zaupajo takšni platformi.

| Skrb                                              | Kaj EVOLVE v zvezi s tem že naredi                                                                                                                                                                                             |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| »Zatekli se bodo moji zdravstveni podatki.«       | Posameznih rezultatov patogenov **nikoli** ne pokaže nikomur — le anonimna presoja: Safe / Compatible / Caution / Risk.                                                                                                        |
| »Moje fotografije bodo pristale nekod drugje.«    | Fotografije so privzeto zabrisane. Lastnik odobri **15-sekundni** ali **trajni** ogled — na zahtevo ali samoiniciativno. Ogled je brezplačen.                                                                                  |
| »Zahtevali bodo moj osebni dokument ali telefon.« | Prijava z denarnico (SIWE). Brez telefona, brez e-pošte, brez KYC. Obnovitev računa deluje prek zaveze DNA na verigi.                                                                                                          |
| »Laže mi o svojem zdravju.«                       | Rezultate potrdi **laboratorij** (QR + primerjava obraza), testi para pa se opravijo **na samem srečanju** — nedavni rezultati testov na STD so odločilni, DNA ne stari.                                                       |
| »Ali mi bo nekdo vzel denar in izginil?«          | Spočetje teče na pravem, tveganem vložku: moški polog se premakne šele, ko je očetovstvo **potrjeno**; sicer mu preprosto vrnejo.                                                                                              |
| »Je žeton pump-and-dump?«                         | Koda je odprta (MIT); skoraj celotna zaloga je rezervirana za nagrade uporabnikom, zaloga, ki ni v obtoku, pa naj bi bila zaklenjena v **trezorju, ki ga ni mogoče izprazniti** — iz njega ne more dvigniti niti ustanovitelj. |
| »Ali lahko platformo izklopijo ali prepovejo?«    | Prednost ima neposredno sporočanje med vrstniki, decentralizirana shramba (IPFS / Arweave), 18 konfiguracij omrežij EVM in nobena vkodirana domena.                                                                            |

## Kaj in zakaj

Tradicionalne aplikacije za zmenke od vas zahtevajo, da svojo telefonsko številko, e-pošto, fotografije in intimne zdravstvene podrobnosti zamenjate za centralno zbirko podatkov — in nato tej zbirki zaupate za vedno. EVOLVE izhaja iz nasprotne predpostavke: **zasebnost privzeto, skrb nad sredstvi v lastnih rokah in brez ene same točke odpovedi**.

- **Zasebnost privzeto** — zdravstveni podatki nikoli niso izpostavljeni; le anonimne presoje.
- **Odpornost proti prepovedim** — najprej sporočanje P2P, decentralizirana shramba, večomrežna zasnova, brez vkodiranih domen.
- **Identiteta v lastni skrbi** — vaša denarnica je vaša prijava; obnovitev na podlagi DNA namesto e-pošte ali telefona.
- **Brez KYC ovire** — za uporabo platforme ni zahtevan osebni dokument, telefon niti e-pošta.

Celotno utemeljitev preberite v [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md).

## Zdravje, ki mu lahko resnično zaupate

- Naložite test na STD kot surovo besedilo ali PDF (izvleček besedilne plasti, z OCR nadomestno potjo za skenirane dokumente).
- Razčlenjevalnik pozna 8 patogenov: HIV-1/2, sifilis, klamidijo, gonorejo, HSV-1, HSV-2, hepatitis B, hepatitis C — v angleških, ukrajinskih in ruskih oblikah poročil.
- **Status posameznega patogena se drugim uporabnikom nikoli ne prikaže.** Profili prikažejo le anonimno presojo: **Safe / Compatible / Caution / Risk**.
- Zapisi DNA na verigi (`DNAVerification.sol`) omogočajo obnovitev in preverjanje.

### Partnerski laboratoriji — dokazi, ne obljube

Vstopite v partnerski laboratorij in pokažite svojo QR-kodo. Laboratorij jo skenira, potrdi vašo identiteto s **primerjavo obraza** (da vašega rezultata ne more prevzeti nihče drug) in pripne poročilo o testih na STD — PDF, sken ali besedilo, tudi slabega OCR. Rezultat podpiše pravi laboratorij, ne vi, zato drugi namesto vaše besede vidijo **preverjeno dejstvo**. Vsako potrjeno preverjanje izplača **1 EVOLVE bolniku in 1 EVOLVE laboratoriju** — obe strani imata razlog za poštenost. Posameznih patogenov še vedno nikomur ne pokažejo.

## Iskanje nekoga

- Iskalni filtri: »Kaj iščete« (zmenki / spočetje / poliandrično spočetje / testiranje na STD), »Koga iščete« (moški, ženske, pari), kaskadna izbira država → mesto, »lahko prispe v vašo državo« s seznami po državah, barva kože, želja glede testiranja, samo STD-združljivi.
- Čarovnik za prve nastavitve: starost (možno skriti), jeziki, bio, fotografija.
- **Klepet P2P** prek libp2p (gossipsub) + Nostr z nadomestno potjo HTTP API.

## Spočetje

Dva načina za načrtovanje otroka, oba pa počivata na isti ideji: pravi namen se pokaže s pravim vložkom v EVOLVE — nikoli z obljubami. Moškova zaveza živi v njegovem pologu v EvolveFund (od 15 EVOLVE, zaklenjen vsaj 30 dni), ženska pa lahko določi svoj najmanjši polog za moške, ki pridejo do nje.

**Spočetje.** Vodi ženska: povabi določenega moškega in ga poimenuje v vezavi. On potrebuje dejaven polog v EvolveFund; ko oba potrdita, se ta zaklene in začne odštevanje. Nosečnost se prijavi med 14. in 30. dnevom po potrditvi, testa para na STD in DNA pa se opravita na samem srečanju — nedavni rezultati testov na STD so odločilni, DNA ne stari. Ko je očetovstvo potrjeno, moški polog preide na žensko; če ni potrjeno, se polog preprosto sprosti in vrne njemu. Nič ne preide iz rok v roke, dokler se dejstva ne razjasnijo.

**Poliandrično spočetje.** Izbora pripada njej in ostaja zaseben. Odpre sejo, ki teče 48 ur — brez lastnega pologa (svojega lahko doda le zaradi ugleda, če želi). Moški z dejavnim pologom se lahko pridružijo — do 50 — in potrdijo, s čimer se njihovi vložki zaklenejo. Štirinajst dni po zaključku seje se izbere očeta. On prejme svoj polog nazaj ter nagrado iz sklada: dvakrat svojega pologa in 1 EVOLVE za vsakega drugega udeleženca. Moški, ki niso izbrani, izgubijo svoj vložek — 90 % ženski, 10 % izbranemu očetu. Ona ne tvega ničesar in lahko le pridobi; moški zastavijo svoj vložek za pravico, da so izbrani.

## Zasebnost in zaupne transakcije

Zasebnost je privzeta — EVOLVE pa gradi pot k popolnoma zaupnim prenosom na verigi.

- **Zasebna darila** — pošljite vrtnico 🌹 ali kaktus 🌵 (1 EVOLVE) in izberite, kdo lahko vidi, da ste bili vi: _javno_, _anonimno za vse razen prejemnika_ ali _popolnoma anonimno_. V anonimnih načinih darilo potuje kot enkratno uporabljiv vaucher, ki ga prejemnik unovči s svojo denarnico, zato se pošiljatelj nikoli ne pojavi na verigi. (Anonimnost pošiljatelja je danes le vsakdanje ravni: transakcijo financiranja je mogoče povezati po času in znesku.)
- **Zaščitena denarnica Railgun** — zasebna denarnica pod zastavico funkcije (`VITE_RAILGUN_ENABLED`, privzeto izklopljena), ki s pomočjo Railgunovega dejavno delujočega bazena z ničelnim znanjem skriva zneske in naslove. To je pot do prave anonimnosti pošiljatelja.
- **Prototip Aztec** — enaka logika zasebnih prenosov in zasebnih vezav, izražena kot vezja Noir z ničelnim znanjem in za izrecno ograjo, dokler Aztec ni pripravljen za produkcijsko uporabo. Glejte [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md).
- **Model dveh denarnic** — javna denarnica za vložke sodeluje v upravljanju; zasebna zaščitna denarnica je namenoma **izključena** iz uteži upravljanja, s čimer ostajata zasebnost in glasovalna moč ločeni.

Podrobnosti: [docs/RAILGUN-INTEGRATION.md](docs/RAILGUN-INTEGRATION.md) · [docs/SHIELDED-STAKES-DESIGN.md](docs/SHIELDED-STAKES-DESIGN.md) · [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md).

## Žeton EVOLVE (samo testno omrežje)

- ERC-20, največja zaloga **8,000,000,000 EVOLVE**. Skrbniška dejanja varuje 48-urni `TimelockController`.
- **Načrtovana razporeditev zaloge** — zasnovana tako, da skoraj celotna zaloga dela v prid uporabnikov, ne v prid insajderjev:

| Namen                                                  |        EVOLVE |
| ------------------------------------------------------ | ------------: |
| Ustanovitelji in ekipa (plača / nagrada)               |    25,000,000 |
| Rezerva za DEX (v prihodnje)                           |     4,000,000 |
| Javna prodaja (načrtovana)                             |     5,000,000 |
| Rezerva nagrad — laboratoriji, bolniki, matere, očetje | 7,966,000,000 |

- **Načrtovana javna prodaja** — 5,000,000 EVOLVE, ki jih aplikacija prodaja po **$0.8 za kos**, plačilo pa je mogoče v katerem koli žetonu, ki ga aplikacija podpira; izkupiček financira razvoj. _(Načrtovano — še ni dejavno.)_
- **Emisija brez potrebe po zaupanju (načrtovana)** — ~7,966,000,000 rezerve nagrad naj bi bilo zaklenjenih v neizpraznjivem `RewardVault`: sproščala se bo le postopoma prek nagrad laboratorijem, bolnikom, materam in očetom, spremembe pravil pa bodo zahtevale glasovanje v upravljanju. Ne more je dvigniti niti ustanovitelj. Načrt: [docs/REWARD-VAULT-PLAN.md](docs/REWARD-VAULT-PLAN.md).
- **Ekonomija daril emoji** — darilo stane 1 EVOLVE in se razdeli sorazmerno med obstoječe lastnike daril; model trajnih prihodkov, darila pa so prenosljiva.
- **EvolveFund** — vložki moških (najmanj 15 EVOLVE, 30-dnevna zaklenitev), ki se štejejo v utež upravljanja; ženske uporabljajo stanje na svoji denarnici.
- **Nagrade za preverjanje** — 1 EVOLVE preverjenemu uporabniku in 1 EVOLVE potrjujočemu laboratoriju za vsako preverjanje STD/DNA (plus pipa z omejitvijo pogostosti).
- **Upravljanje** — utež glasu združuje rekurzivni ugled (8 glasov, globina 3), delež otrok/očetovstva ter stavljene ali pridržane EVOLVE.
- Integracija **LayerZero OFT** za prihodnje večverižne prenose EVOLVE (odvisnosti so na mestu; izven testnega omrežja Sepolia še ni nič nameščeno).

## Podprite projekt

EVOLVE je neodvisen in odprtokoden. Če vam je koristen, lahko razvoj podprete z donacijo — vsak prispevek gre za kodo, partnerstva z laboratoriji, gostovanje in prevode.

- **Podrobnosti o donacijah (EVM, Monero in več):** [DONATE.md](DONATE.md)
- **Večjezična stran za donacije (34 jeziki):** **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**

Javna prodaja žetonov je **načrtovana** — 5,000,000 EVOLVE, ki jih bo prodajala aplikacija (glejte [Žeton EVOLVE](#žeton-evolve-samo-testno-omrežje)). Donacije so darila, ki podpirajo odprtokodni razvoj in ne dajejo nikakršne zahteve po žetonih, deležih, donosih ali dobičku. Prosimo, prispevajte le tisto, česar si lahko privoščite izgubiti.

## Arhitektura in tehnološki sklad

Monorepo, ki ga upravlja npm workspaces + Turborepo:

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

V teku: pripravljenost spletne aplikacije za produkcijo. Načrtovano: register laboratorijev na verigi in certificiranje preizkusov, pravi adapter ponudnika e-pošte za sprejem laboratorijskih poročil, overjena pričevanja na verigi na profilih, **RewardVault brez potrebe po zaupanju** z emisijo, ki jo nadzira upravljanje ([načrt](docs/REWARD-VAULT-PLAN.md)), **javna prodaja žetonov**, posodobitev vezave žetonov (vesting) za alokacijo ustanovitelja ter zagotavljanje likvidnosti za DEX (trenutno blokirano — zahteva namestitve žetonov na glavno omrežje). Na področju zasebnosti so darila z zasebnim pošiljateljem opravljena, zaščitna denarnica Railgun in selitev zasebnih vezav Aztec pa ostajata za ograjami preverjanj v [docs/ROADMAP.md](docs/ROADMAP.md) in [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md). Večomrežna širitev (Arbitrum, Avalanche in druge verige EVM) sledi po utrditvi testnega omrežja.

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

Prispevki so dobrodošli — koda, poročila o napakah, predlogi funkcij in predlogi. Pred začetkom prosimo preberite [CONTRIBUTING.md](CONTRIBUTING.md) in naš [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Repozitoriji (zrcala)

| Zrcalo   | URL                                        |
| -------- | ------------------------------------------ |
| GitHub   | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg | https://codeberg.org/limitafternoon/Evolve |
| GitLab   | https://gitlab.com/evolve-group3/evolve    |

## Dokumentacija

- [Kaj in zakaj](docs/WHAT-AND-WHY.md) — problem, vizija, temeljne vrednote
- [Kako deluje](docs/HOW-IT-WORKS.md) — uporabniški poteki, korak za korakom
- [Arhitektura](docs/ARCHITECTURE.md) — monorepo, paketi, tokovi podatkov
- [Tokenomika](docs/TOKENOMICS.md) — model žetona in razporeditev zaloge
- [Načrt RewardVault](docs/REWARD-VAULT-PLAN.md) — emisija brez potrebe po zaupanju (načrtovana)
- [Integracija Railgun](docs/RAILGUN-INTEGRATION.md) — preizkus integracije zaščitene denarnice
- [Zaščiteni vložki](docs/SHIELDED-STAKES-DESIGN.md) — zasebni vložki za spočetje (zasnova)
- [Prototip Aztec](docs/AZTEC-PROTOTYPE.md) — zasebni prenosi in vezave ZK (raziskava)
- [Načrt razvoja](docs/ROADMAP.md) — mejniki in trenutno stanje
- [Pogosta vprašanja](docs/FAQ.md) — pogosto zastavljena vprašanja
- [Vodnik po denarnicah](docs/WALLETS.md) — kako ustvariti denarnice in pridobiti naslove za donacije

## Licenca

Licencirano pod [licenco MIT](LICENSE).

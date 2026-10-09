[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)
<!-- evolve-readme-sync: 3796750887b0bd65 -->

# EVOLVE

**Upoznavanje, začeće i provjereno zdravlje — privatnost po zadanim postavkama, povjerenje tamo gdje je važno.**

EVOLVE je open-source, decentralizirana platforma za ljude kojima je dosta prepuštanja svog broja telefona, svog lica i svojih najintimnijih zdravstvenih podataka u tuđu bazu podataka. Prijavljujete se vlastitim kripto novčanikom — bez telefona, bez e-pošte, bez KYC-a — a račun možete vratiti putem on-chain obveze DNK. Vaši zdravstveni podaci ostaju vaši: rezultati testova se automatski raščlanjuju, statusi pojedinačnih patogena se **nikada** ne pokazuju nikome, a uparivanje se oslanja samo na anonimne verdikte kompatibilnosti (Safe / Compatible / Caution / Risk). Chat radi peer-to-peer preko libp2p i Nostr-a, s HTTP fallbackom za udobnost. Pokloni i prijenosi idu prema potpunoj povjerljivosti: pokloni privatni pošiljatelju su aktivni danas, a Railgun zaštićeni novčanik i Aztec prototip nultog znanja su na planu (vidi [Privatnost i povjerljive transakcije](#privatnost-i-povjerljive-transakcije)).

> **Status — demo način, u aktivnom razvoju.**
> Upoznavanje, začeće, provjera zdravlja, laboratorijski tijek, P2P chat, token EVOLVE i governance — sve je implementirano i radi u **lokalnom demo načinu** — aplikacija **još nije javno postavljena**. Još ispred nas: **postavljanje na mainnet i DEX likvidnost**, plus **planirana javna prodaja** (vidi [Token EVOLVE](#token-evolve-samo-testna-mreža)).
> Pametni ugovori su postavljeni **samo na Ethereum Sepolia testnet**. Ništa ovdje nije financijski savjet ni investicijska ponuda.

> **Smatrate li EVOLVE korisnim? Podržite razvoj — svaka donacija ide u kod, laboratorijska partnerstva, hosting i prijevode → [DONATE.MD](DONATE.MD).**

## Nema se čega bojati

EVOLVE je izgrađen oko pitanja koja ljudi stvarno postavljaju prije nego što takvoj platformi povjere svoje povjerenje.

| Briga                                            | Što EVOLVE već radi po tom pitanju                                                                                                                                                                           |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| „Moji zdravstveni podaci će iscuriti."           | Rezultati pojedinačnih patogena se **nikada** ne pokazuju nikome — samo anonimni verdikt: Safe / Compatible / Caution / Risk.                                                                                |
| „Moje fotografije će završiti negdje."           | Fotografije su zadano zamagljene. Vlasnik dodjeljuje **15-sekundni** ili **trajni** uvid — na zahtjev ili proaktivno. Pregledavanje je besplatno.                                                            |
| „Morat ću predati osobnu iskaznicu ili telefon." | Prijava novčanikom (SIWE). Bez telefona, bez e-pošte, bez KYC-a. Oporavak radi putem on-chain obveze DNK.                                                                                                    |
| „On ili ona laže o zdravlju."                    | Rezultati su **laboratorijski provjereni** (QR + usporedba lica), a testovi para se uzimaju **na samom sastanku** — svježi STD rezultati su bitni, DNK ne stari.                                             |
| „Hoće li mi netko uzeti novac i nestati?"        | Začeće radi na pravom, izloženom ulogu: muškarčev depozit mijenja vlasnika samo kada je očinstvo **potvrđeno**; inače mu se jednostavno vraća.                                                               |
| „Je li token pump-and-dump?"                     | Kod je otvoren (MIT); gotovo cijela ponuda rezervirana je za korisničke nagrade, a necirkulirajuća rezerva planira se zaključati u **trezor koji se ne može isprazniti** iz kojeg ne može podići ni osnivač. |
| „Može li platforma biti ugašena ili zabranjena?" | Prije svega peer-to-peer poruke, decentralizirana pohrana (IPFS / Arweave), 18 konfiguracija EVM mreža i bez hardcodirane domene.                                                                            |

## Što i zašto

Tradicionalne aplikacije za upoznavanje traže da zamijenite broj telefona, e-poštu, fotografije i intimne zdravstvene detalje za središnju bazu podataka — i da toj bazi onda vjerujete zauvijek. EVOLVE polazi od suprotne premise: **privatnost zadano, samostalno vlasništvo (self-custody) i bez jedne točke kvara**.

- **Privatnost zadano** — zdravstveni podaci se nikada ne otkrivaju; samo anonimni verdikti.
- **Otpornost na zabrane** — prije svega P2P poruke, decentralizirana pohrana, višemrežni dizajn, bez hardcodiranih domena.
- **Self-custodial identitet** — vaš novčanik je vaša prijava; oporavak temeljen na DNK umjesto e-pošte ili telefona.
- **Bez KYC prepreke** — za korištenje platforme nije potrebna osobna iskaznica, telefon ni e-pošta.

Potpuno obrazloženje pročitajte u [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md).

## Zdravlje kojem možete stvarno vjerovati

- Prenesite STD test kao običan tekst ili PDF (izdvajanje tekstualnog sloja, s OCR fallbackom za skenove).
- Parser poznaje 8 patogena: HIV-1/2, sifilis, klamidija, gonoreja, HSV-1, HSV-2, hepatitis B, hepatitis C — u engleskim, ukrajinskim i ruskim formatima izvještaja.
- **Status pojedinačnog patogena se nikada ne prikazuje drugim korisnicima.** Profili pokazuju samo anonimni verdikt: **Safe / Compatible / Caution / Risk**.
- On-chain DNK zapisi (`DNAVerification.sol`) pokreću oporavak i provjeru.

### Partnerski laboratoriji — dokazi, ne obećanja

Uđite u partnerski laboratorij i pokažite svoj QR kod. Laboratorij ga skenira, potvrđuje vaš identitet **usporedbom lica** (da nitko drugi ne može preuzeti vaš rezultat) i prilaže STD izvještaj — PDF, sken ili tekst, čak i sa slabim OCR. Rezultat potpisuje pravi laboratorij, a ne vi, pa drugi vide **provjerenu činjenicu** umjesto vaše riječi. A svaka potvrđena provjera plaća **1 EVOLVE pacijentu i 1 EVOLVE laboratoriju** — obje strane imaju razloga biti poštene. Pojedinačni patogeni se i dalje nikome ne pokazuju.

## Traženje nekoga

- Filteri pretraživanja: „Što tražite" (upoznavanje / začeće / poliandrično začeće / STD testiranje), „Koga tražite" (muškarci, žene, parovi), kaskadni odabiri država → grad, „može doći u vašu državu" s popisima po državama, boja kože, preferencija testiranja, samo STD-kompatibilni.
- Čarobnjak za onboarding: dob (može se sakriti), jezici, bio, fotografija.
- **P2P chat** preko libp2p (gossipsub) + Nostr, s HTTP API fallbackom.

## Začeće

Dva načina planiranja djeteta — i oba počivaju na istoj ideji: prava namjera se pokazuje pravim ulogom u EVOLVE — nikad obećanjima. Muškarčeva obveza živi u njegovom EvolveFund depozitu (od 15 EVOLVE, zaključanom najmanje 30 dana), a žena može postaviti svoj minimalni depozit za muškarce koji do nje dopru.

**Začeće.** Žena vodi: poziva određenog muškarca i imenuje ga u bondu. On treba aktivan EvolveFund depozit; kada oboje potvrde, zaključava se i počinje odbrojavanje. Trudnoća se prijavljuje između 14. i 30. dana nakon potvrde, a STD i DNK testovi para se uzimaju na samom sastanku — svježi STD rezultati su bitni, DNK ne stari. Kada je očinstvo potvrđeno, muškarčev depozit prelazi na ženu; ako nije potvrđeno, depozit mu se jednostavno vraća. Ništa ne mijenja vlasnika dok se činjenice ne riješe.

**Poliandrično začeće.** Izbor pripada njoj — i ostaje privatan. Otvara sesiju koja traje 48 sati — bez vlastitog depozita (može ga dodati samo za reputaciju, ako želi). Muškarci s aktivnim depozitom mogu se pridružiti — do 50 — i potvrditi, čime se zaključava njihov ulog. Četrnaest dana nakon zatvaranja sesije bira se otac. On dobiva svoj depozit natrag plus nagradu iz fonda: dvostruki svoj depozit i 1 EVOLVE za svakog drugog sudionika. Muškarci koji nisu odabrani gube svoj ulog — 90% ide ženi, 10% odabranom ocu. Ona ne riskira ništa i može samo dobiti; muškarci ulažu svoj ulog za pravo da budu odabrani.

## Privatnost i povjerljive transakcije

Privatnost je zadana — i EVOLVE gradi plan prema potpuno povjerljivim on-chain prijenosima.

- **Privatni pokloni** — pošaljite ružu 🌹 ili kaktus 🌵 (1 EVOLVE) i odaberite tko može vidjeti da ste to bili vi: _javno_, _anonimno svima osim primatelju_, ili _potpuno anonimno_. U anonimnim načinima poklon putuje kao jednokratni vaučer koji primatelj preuzima vlastitim novčanikom, tako da se pošiljatelj nikada ne pojavljuje on-chain. (Anonimnost pošiljatelja danas je povremene razine: transakcija financiranja može se korelirati po vremenu i iznosu.)
- **Railgun zaštićeni novčanik** — privatni novčanik s oznakom značajke (`VITE_RAILGUN_ENABLED`, zadano isključeno) koji skriva iznose i adrese koristeći Railgunov live zero-knowledge pool. Ovo je put do prave anonimnosti pošiljatelja.
- **Aztec prototip** — ista logika privatnog prijenosa i privatnog veza, izražena kao Noir krugovi nultog znanja i držana iza eksplicitne kapije dok Aztec ne bude spreman za proizvodnju. Vidi [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md).
- **Model s dva novčanika** — javni novčanik za ulog sudjeluje u upravljanju; privatni zaštićeni novčanik namjerno je **isključen** iz težine upravljanja, čime se privatnost i glasačka moć drže odvojenima.

Detalji: [docs/RAILGUN-INTEGRATION.md](docs/RAILGUN-INTEGRATION.md) · [docs/SHIELDED-STAKES-DESIGN.md](docs/SHIELDED-STAKES-DESIGN.md) · [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md).

## Token EVOLVE (samo testna mreža)

- ERC-20, maksimalna ponuda **8,000,000,000 EVOLVE**. Admin akcije čuva 48-satni `TimelockController`.
- **Planirana raspodjela ponude** — dizajnirana tako da gotovo cijela ponuda radi za korisnike, ne za insidere:

| Svrha                                                   |        EVOLVE |
| ------------------------------------------------------- | ------------: |
| Osnivači i tim (plaća / nagrada)                        |    25,000,000 |
| DEX rezerva (budućnost)                                 |     4,000,000 |
| Javna prodaja (planirana)                               |     5,000,000 |
| Rezerva nagrada — laboratoriji, pacijenti, majke, očevi | 7,966,000,000 |

- **Planirana javna prodaja** — 5,000,000 EVOLVE koje aplikacija prodaje po **$0.8 po komadu**, naplativo u bilo kojem tokenu koji aplikacija podržava; prihod financira razvoj. _(Planirano — još nije aktivno.)_
- **Trustless emisija (planirana)** — rezerva nagrada od ~7,966,000,000 bit će zaključana u ne-ispraznjivom `RewardVault`: pušta se samo postupno kroz nagrade za laboratorije, pacijente, majke i očeve, a promjene pravila zahtijevaju glasovanje u governance. Niti osnivač ne može podići. Dizajn: [docs/REWARD-VAULT-PLAN.md](docs/REWARD-VAULT-PLAN.md).
- **Ekonomija emoji poklona** — poklon košta 1 EVOLVE, dijeli se razmjerno među postojeće vlasnike poklona; trajni model prihoda, a pokloni su prenosivi.
- **EvolveFund** — muški staking (min. 15 EVOLVE, 30-dnevna zaključanost) koji se računa u težinu governance; žene koriste saldo novčanika.
- **Nagrade za provjeru** — 1 EVOLVE provjerenom korisniku i 1 EVOLVE potvrđujućem laboratoriju po svakoj STD/DNK provjeri (plus faucet s ograničenjem).
- **Governance** — težina glasa kombinira rekurzivnu reputaciju (8 glasova, dubina 3), udio djece/očinstva te stakane ili držane EVOLVE.
- Integracija **LayerZero OFT** za buduće multichain prijenose EVOLVE (ovisnosti na mjestu; izvan Sepolie još ništa nije postavljeno).

## Podržite projekt

EVOLVE je neovisan i open-source. Ako vam je koristan, možete podržati razvoj donacijom — svaki doprinos ide u kod, laboratorijska partnerstva, hosting i prijevode.

- **Detalji donacija (EVM, Monero i više):** [DONATE.MD](DONATE.MD)
- **Višejezična stranica za donacije (34 jezika):** **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**

Javna prodaja tokena je **planirana** — 5,000,000 EVOLVE, koje prodaje aplikacija (vidi [Token EVOLVE](#token-evolve-samo-testna-mreža)). Donacije su darovi koji podržavaju open-source razvoj i ne daju nikakvo pravo na tokene, udjele, prinose ili dobit. Molimo dajte samo onoliko koliko možete izgubiti.

## Arhitektura i tehnološki stack

Monorepo kojim se upravlja s npm workspaces + Turborepo:

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

Ključni pametni ugovori: `EVOLVE.sol` (ERC-20), `ProfileNFT.sol` (ERC-721), `TrustScore.sol`, `Voting.sol`, `Evolve2Earn.sol` (emoji pokloni + nagrade), `Governance.sol`, `BondManager.sol` (začeće i poliandrično začeće), `EvolveFund.sol`, `VerificationRegistry.sol`, `DNAVerification.sol`, ERC-4337 `SmartAccountFactory` + `Paymaster` te OpenZeppelin `TimelockController`.

Detalji: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md)

## Roadmap

U tijeku: produkcijska spremnost web aplikacije. Planirano: on-chain registar laboratorija i certifikacija testova, pravi adapter pružatelja pošte za prijem laboratorijskih izvještaja, on-chain potvrđene atestacije na profilima, **trustless RewardVault** s emisijom kontroliranom kroz governance ([dizajn](docs/REWARD-VAULT-PLAN.md)), **javna prodaja tokena**, ažuriranje vestinga za alokaciju osnivača te osiguravanje DEX likvidnosti (trenutno blokirano — zahtijeva postavljanje tokena na mainnet). S privatne strane, pokloni privatni pošiljatelju su gotovi, dok Railgun zaštićeni novčanik i Aztec migracija privatnog veza ostaju iza provjera u [docs/ROADMAP.md](docs/ROADMAP.md) i [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md). Višemrežno širenje (Arbitrum, Avalanche i druge EVM mreže) slijedi nakon učvršćivanja testneta.

Cijeli popis: [docs/ROADMAP.MD](docs/ROADMAP.MD).

## Prvi koraci (developeri)

Zahtjevi: **Node.js 20+** i npm 10.x.

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

## Doprinos

Doprinosi su dobrodošli — kod, prijave grešaka, prijedlozi značajki i proposal. Prije početka molimo pročitajte [CONTRIBUTING.MD](CONTRIBUTING.MD) i naš [CODE_OF_CONDUCT.MD](CODE_OF_CONDUCT.MD).

## Repozitoriji (mirror)

| Mirror   | URL                                        |
| -------- | ------------------------------------------ |
| GitHub   | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg | https://codeberg.org/limitafternoon/Evolve |
| GitLab   | https://gitlab.com/evolve-group3/evolve    |

## Dokumentacija

- [Što i zašto](docs/WHAT-AND-WHY.md) — problem, vizija, ključne vrijednosti
- [Kako radi](docs/HOW-IT-WORKS.md) — korisnički tijekovi, korak po korak
- [Arhitektura](docs/ARCHITECTURE.md) — monorepo, paketi, tijekovi podataka
- [Tokenomika](docs/TOKENOMICS.md) — model tokena i raspodjela ponude
- [Plan RewardVault](docs/REWARD-VAULT-PLAN.md) — trustless emisija (planirana)
- [Railgun integracija](docs/RAILGUN-INTEGRATION.md) — integracija zaštićenog novčanika
- [Zaštićeni ulozi](docs/SHIELDED-STAKES-DESIGN.md) — privatni ulozi za začeće (dizajn)
- [Aztec prototip](docs/AZTEC-PROTOTYPE.md) — ZK privatni prijenosi i veze (istraživanje)
- [Roadmapa](docs/ROADMAP.md) — miljokazi i trenutni status
- [FAQ](docs/FAQ.md) — često postavljana pitanja
- [Vodič za novčanike](docs/WALLETS.md) — kako kreirati novčanike i dobiti adrese za donacije

## Licenca

Licencirano pod [MIT licencom](LICENSE).

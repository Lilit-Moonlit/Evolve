[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)
<!-- evolve-readme-sync: 3796750887b0bd65 -->

# EVOLVE

**Dating, concepție și sănătate verificată — confidențialitate implicită, încredere acolo unde contează.**

EVOLVE este o platformă open-source și descentralizată, creată pentru oamenii care s-au săturat să-și predea numărul de telefon, chipul și cele mai intime date de sănătate bazei de date ale altcuiva. Te autentifici cu propriul portofel crypto — fără telefon, fără e-mail, fără KYC — și îți poți recupera contul printr-un angajament DNA on-chain. Datele tale de sănătate rămân ale tale: rezultatele testelor sunt analizate automat, statusul individual al patogenilor nu este arătat **niciodată** nimănui, iar potrivirea se bazează exclusiv pe verdicte anonime de compatibilitate (Safe / Compatible / Caution / Risk). Chat-ul rulează peer-to-peer prin libp2p și Nostr, cu un fallback HTTP pentru comoditate. Cadourile și transferurile se îndreaptă spre confidențialitate deplină: cadourile cu expeditor privat există deja azi, iar un portofel protejat Railgun și un prototip zero-knowledge Aztec sunt pe roadmap (vezi [Confidențialitate și tranzacții confidențiale](#confidențialitate-și-tranzacții-confidențiale)).

> **Status — mod demo, în dezvoltare activă.**
> Dating-ul, concepția, verificarea sănătății, fluxul de laborator, chat-ul P2P, token-ul EVOLVE și guvernanța sunt toate implementate și rulează într-un **demo local** — aplicația **nu este încă implementată public**. În continuare urmează: **implementare pe mainnet și lichiditate DEX**, plus o **vânzare publică planificată** (vezi [Tokenul EVOLVE](#tokenul-evolve-doar-testnet)).
> Contractele inteligente sunt implementate **doar pe testnet-ul Ethereum Sepolia**. Nimic de aici nu constituie consultanță financiară sau o ofertă de investiții.

> **Ți se pare EVOLVE util? Susține dezvoltarea — fiecare donație merge către cod, parteneriate cu laboratoare, hosting și traduceri → [DONATE.md](DONATE.md).**

## Nimic de temut

EVOLVE a fost construit în jurul întrebărilor pe care oamenii le pun cu adevărat înainte să aibă încredere într-o platformă ca aceasta.

| Îngrijorarea                                    | Ce face deja EVOLVE în această privință                                                                                                                                                                                                            |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| „Datele mele de sănătate vor ajunge undeva."    | Rezultatele individuale ale patogenilor nu sunt **niciodată** arătate nimănui — doar un verdict anonim: Safe / Compatible / Caution / Risk.                                                                                                        |
| „Fotografiile mele vor ajunge pe undeva."       | Fotografiile sunt estompate implicit. Proprietarul acordă o vizualizare de **15 secunde** sau **permanentă** — la cerere sau proactiv. Vizualizarea este gratuită.                                                                                 |
| „Va trebui să-mi predau actul sau telefonul."   | Autentificare cu portofelul (SIWE). Fără telefon, fără e-mail, fără KYC. Recuperarea funcționează printr-un angajament DNA on-chain.                                                                                                               |
| „El sau ea minte că este sănătos."              | Rezultatele sunt **verificate de laborator** (QR + potrivire facială), iar testele cuplului sunt făcute **la întâlnirea propriu-zisă** — contează rezultatele STD recente, DNA nu îmbătrânește.                                                    |
| „Îmi va lua cineva banii și va dispărea?"       | Concepția rulează pe o miză reală, asumată: depozitul bărbatului se mișcă doar când paternitatea este **confirmată**; altfel îi este pur și simplu returnat.                                                                                       |
| „Este token-ul un pump-and-dump?"               | Codul este deschis (MIT); aproape întreaga ofertă este rezervată recompenselor pentru utilizatori, iar rezerva necirculată urmează să fie blocată într-un **vault care nu poate fi golit**, din care nu poate retrage nimic nici măcar fondatorul. |
| „Poate platforma să fie închisă sau interzisă?" | Mesagerie peer-to-peer pe primul loc, stocare descentralizată (IPFS / Arweave), 18 configurații de rețele EVM și niciun domeniu hardcodat.                                                                                                         |

## Ce și de ce

Aplicațiile de dating tradiționale îți cer să schimbi numărul de telefon, e-mailul, fotografiile și detaliile intime de sănătate pe o bază de date centrală — și apoi să ai încredere în acea bază de date pentru totdeauna. EVOLVE pornește de la premisa opusă: **confidențialitate implicită, auto-custodie și niciun punct unic de eșec**.

- **Confidențialitate implicită** — datele de sănătate nu sunt niciodată expuse; doar verdicte anonime.
- **Rezistență la interdicții** — mesagerie P2P în primul rând, stocare descentralizată, design multi-rețea, fără domenii hardcodate.
- **Identitate în auto-custodie** — portofelul tău este autentificarea ta; recuperare pe bază de DNA în loc de e-mail sau telefon.
- **Fără poarta KYC** — nu se cere act de identitate, telefon sau e-mail pentru a folosi platforma.

Citește argumentația completă în [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md).

## Sănătate în care poți avea cu adevărat încredere

- Încarcă un test STD ca text simplu sau PDF (extragere din stratul de text, cu fallback OCR pentru scanări).
- Parser-ul cunoaște 8 patogeni: HIV-1/2, sifilisul, chlamydia, gonoreea, HSV-1, HSV-2, hepatita B, hepatita C — în formate de raport în engleză, ucraineană și rusă.
- **Statusul individual al patogenilor nu este niciodată afișat altor utilizatori.** Profilele arată doar verdictul anonim: **Safe / Compatible / Caution / Risk**.
- Înregistrările DNA on-chain (`DNAVerification.sol`) stau la baza recuperării și verificării.

### Laboratoare partenere — dovezi, nu promisiuni

Intri într-un laborator partener și îți arăți codul QR. Laboratorul îl scanează, îți confirmă identitatea prin **potrivire facială** (astfel încât nimeni altcineva nu îți poate ridica rezultatul) și atașează raportul STD — PDF, scanare sau text, chiar și un OCR slab. Rezultatul este semnat de un laborator real, nu de tine, deci ceilalți văd un **fapt verificat** în loc de cuvântul tău. Iar fiecare verificare confirmată plătește **1 EVOLVE pacientului și 1 EVOLVE laboratorului** — ambele părți au un motiv să fie corecte. Patogenii individuali nu sunt, în continuare, arătați nimănui.

## Găsirea cuiva

- Filtre de căutare: „Ce cauți" (dating / concepție / concepție poliandră / testare STD), „Pe cine cauți" (bărbați, femei, cupluri), selectoare în cascadă țară → oraș, „pot călători în țara ta" cu liste pe țări, culoarea pielii, preferința de testare, doar compatibili STD.
- Asistent de onboarding: vârstă (ascunsă opțional), limbi, bio, fotografie.
- **Chat P2P** prin libp2p (gossipsub) + Nostr, cu fallback pe API HTTP.

## Concepție

Două moduri de a planifica un copil, ambele pornind de la aceeași idee: intenția reală se arată printr-o miză reală în EVOLVE — niciodată prin promisiuni. Angajamentul unui bărbat stă în depozitul lui EvolveFund (de la 15 EVOLVE, blocat minimum 30 de zile), iar o femeie își poate stabili propriul depozit minim pentru bărbații care ajung la ea.

**Concepție.** Femeia conduce: invită un anumit bărbat și îl numește într-un bond. El are nevoie de un depozit EvolveFund activ; când ambii confirmă, depozitul se blochează și începe numărătoarea inversă. Sarcina se raportează între 14 și 30 de zile de la confirmare, iar testele STD și DNA ale cuplului se fac la întâlnirea propriu-zisă — contează rezultatele STD recente, DNA nu îmbătrânește. Odată ce paternitatea este confirmată, depozitul bărbatului trece la femeie; dacă nu este confirmată, depozitul îi este pur și simplu eliberat înapoi. Nimic nu își schimbă stăpânul până când faptele nu sunt stabilite.

**Concepție poliandră.** Alegerea îi aparține și rămâne privată. Ea deschide o sesiune care durează 48 de ore — fără un depozit propriu (poate adăuga unul doar pentru reputație, dacă dorește). Bărbații cu un depozit activ se pot alătura — până la 50 — și confirmă, ceea ce le blochează miza. La paisprezece zile după închiderea sesiunii, tatăl este ales. El își primește depozitul înapoi, plus o recompensă din pool: de două ori depozitul lui și 1 EVOLVE pentru fiecare dintre ceilalți participanți. Bărbații care nu sunt aleși își pierd miza — 90% către femeie, 10% către tatăl ales. Ea nu riscă nimic și poate doar câștiga; bărbații își pun miza în spatele dreptului de a fi aleși.

## Confidențialitate și tranzacții confidențiale

Confidențialitatea este implicită — iar EVOLVE își construiește drumul către transferuri on-chain complet confidențiale.

- **Cadouri private** — trimite o trandafiră 🌹 sau un cactus 🌵 (1 EVOLVE) și alege cine poate vedea că ai fost tu: _public_, _anonim pentru toți, în afară de destinatar_, sau _complet anonim_. În modurile anonime, cadoul călătorește ca un voucher de unică folosință pe care destinatarul îl revendică cu propriul portofel, astfel încât expeditorul nu apare niciodată on-chain. (Anonimatul expeditorului este azi de nivel casual: tranzacția de finanțare poate fi corelată după timp și sumă.)
- **Portofel protejat Railgun** — un portofel privat activat prin feature flag (`VITE_RAILGUN_ENABLED`, implicit oprit) care ascunde sumele și adresele folosind pool-ul zero-knowledge activ Railgun. Acesta este drumul către un anonimat real al expeditorului.
- **Prototip Aztec** — aceeași logică de transfer privat și de bond privat, exprimată ca circuite zero-knowledge Noir și păstrată în spatele unui gate explicit până când Aztec va fi gata de producție. Vezi [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md).
- **Model cu două portofele** — un portofel public de miză participă la guvernanță; un portofel privat protejat este în mod deliberat **exclus** din greutatea de guvernanță, menținând confidențialitatea și puterea de vot separate.

Detalii: [docs/RAILGUN-INTEGRATION.md](docs/RAILGUN-INTEGRATION.md) · [docs/SHIELDED-STAKES-DESIGN.md](docs/SHIELDED-STAKES-DESIGN.md) · [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md).

## Tokenul EVOLVE (doar testnet)

- ERC-20, oferta maximă **8.000.000.000 EVOLVE**. Acțiunile administrative sunt restricționate de un `TimelockController` de 48 de ore.
- **Alocare planificată a ofertei** — concepută astfel încât aproape întreaga ofertă să lucreze pentru utilizatori, nu pentru inițiați:

| Scop                                                      |        EVOLVE |
| --------------------------------------------------------- | ------------: |
| Fondatori și echipă (salariu / recompensă)                |    25.000.000 |
| Rezervă DEX (viitor)                                      |     4.000.000 |
| Vânzare publică (planificată)                             |     5.000.000 |
| Rezervă de recompense — laboratoare, pacienți, mame, tați | 7.966.000.000 |

- **Vânzare publică planificată** — 5.000.000 EVOLVE vânduți de aplicație la **$0.8 bucata**, platibili în orice token susținut de aplicație; încasările finanțează dezvoltarea. _(Planificat — încă nu este activ.)_
- **Emisiune trustless (planificată)** — rezerva de recompense de ~7.966.000.000 urmează să fie blocată într-un `RewardVault` care nu poate fi golit: eliberată doar treptat, prin recompense pentru laboratoare, pacienți, mame și tați, iar schimbările de reguli cer un vot de guvernanță. Nici măcar fondatorul nu o poate retrage. Design: [docs/REWARD-VAULT-PLAN.md](docs/REWARD-VAULT-PLAN.md).
- **Economia cadourilor emoji** — un cadou costă 1 EVOLVE, împărțit proporțional între proprietarii existenți de cadouri; un model de venituri perpetuu, iar cadourile sunt transferabile.
- **EvolveFund** — staking pentru bărbați (minim 15 EVOLVE, blocare pe 30 de zile) care contează în greutatea de guvernanță; femeile folosesc soldul portofelului.
- **Recompense de verificare** — 1 EVOLVE pentru utilizatorul verificat și 1 EVOLVE pentru laboratorul care confirmă, la fiecare verificare STD/DNA (plus un faucet cu limitare de rată).
- **Guvernanță** — greutatea votului combină reputația recursivă (8 voturi, adâncime 3), ponderea copiilor/paternității și EVOLVE-ul mizat sau deținut.
- Integrare **LayerZero OFT** pentru viitoarele transferuri EVOLVE multi-chain (dependențele sunt în loc; nimic implementat dincolo de Sepolia deocamdată).

## Susține proiectul

EVOLVE este independent și open-source. Dacă îți este util, poți susține dezvoltarea printr-o donație — fiecare contribuție merge către cod, parteneriate cu laboratoare, hosting și traduceri.

- **Detalii despre donații (EVM, Monero și altele):** [DONATE.md](DONATE.md)
- **Pagina de donații multilingvă (34 de limbi):** **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**

O vânzare publică de token-uri este **planificată** — 5.000.000 EVOLVE, vânduți de aplicație (vezi [Tokenul EVOLVE](#tokenul-evolve-doar-testnet)). Donațiile sunt daruri care susțin dezvoltarea open-source și nu conferă niciun drept asupra de token-uri, părți sociale, randamente sau profit. Te rugăm să donezi doar ceea ce îți permiți să pierzi.

## Arhitectură și stack tehnologic

Monorepo gestionat cu npm workspaces + Turborepo:

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

Contracte inteligente cheie: `EVOLVE.sol` (ERC-20), `ProfileNFT.sol` (ERC-721), `TrustScore.sol`, `Voting.sol`, `Evolve2Earn.sol` (cadouri emoji + recompense), `Governance.sol`, `BondManager.sol` (concepție și concepție poliandră), `EvolveFund.sol`, `VerificationRegistry.sol`, `DNAVerification.sol`, `SmartAccountFactory` + `Paymaster` ERC-4337 și un `TimelockController` OpenZeppelin.

Detalii: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md)

## Roadmap

În curs: pregătirea pentru producție a aplicației web. Planificat: registru de laboratoare on-chain și certificare a testelor, un adaptor real de furnizor de e-mail pentru ingestia rapoartelor de laborator, atestații verificate on-chain pe profiluri, **RewardVault trustless** cu emisiune controlată de guvernanță ([design](docs/REWARD-VAULT-PLAN.md)), **vânzarea publică de token-uri**, actualizarea vesting-ului pentru alocarea fondatorului și provisionarea de lichiditate DEX (momentan blocată — necesită implementări de token pe mainnet). În privința confidențialității, cadourile cu expeditor privat sunt finalizate, în timp ce portofelul protejat Railgun și migrarea bond-urilor private Aztec rămân în spatele verificărilor din [docs/ROADMAP.md](docs/ROADMAP.md) și [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md). Extinderea multi-rețea (Arbitrum, Avalanche și alte chain-uri EVM) urmează după consolidarea pe testnet.

Lista completă: [docs/ROADMAP.md](docs/ROADMAP.md).

## Primii pași (dezvoltatori)

Cerințe: **Node.js 20+** și npm 10.x.

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

## Contribuții

Contribuțiile sunt binevenite — cod, raportări de bug-uri, sugestii de funcționalități și propuneri. Te rugăm să citești [CONTRIBUTING.md](CONTRIBUTING.md) și [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) înainte de a începe.

## Repositorii (oglinzi)

| Oglindă  | URL                                        |
| -------- | ------------------------------------------ |
| GitHub   | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg | https://codeberg.org/limitafternoon/Evolve |
| GitLab   | https://gitlab.com/evolve-group3/evolve    |

## Documentație

- [Ce și de ce](docs/WHAT-AND-WHY.md) — problema, viziunea, valorile de bază
- [Cum funcționează](docs/HOW-IT-WORKS.md) — fluxurile utilizatorului, pas cu pas
- [Arhitectură](docs/ARCHITECTURE.md) — monorepo, pachete, fluxuri de date
- [Tokenomics](docs/TOKENOMICS.md) — modelul token-ului și distribuția ofertei
- [Planul RewardVault](docs/REWARD-VAULT-PLAN.md) — emisiune trustless (planificată)
- [Integrarea Railgun](docs/RAILGUN-INTEGRATION.md) — studiu de integrare a portofelului protejat
- [Mize protejate](docs/SHIELDED-STAKES-DESIGN.md) — mize private de concepție (design)
- [Prototipul Aztec](docs/AZTEC-PROTOTYPE.md) — transferuri și bond-uri private ZK (cercetare)
- [Roadmap](docs/ROADMAP.md) — etape și statusul curent
- [FAQ](docs/FAQ.md) — întrebări frecvente
- [Ghidul portofelelor](docs/WALLETS.md) — cum îți creezi portofele și cum obții adrese de donații

## Licență

Licențiat sub [licența MIT](LICENSE).

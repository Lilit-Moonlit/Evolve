[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)

# EVOLVE

**Întâlniri, concepție și sănătate verificată — privat implicit, de încredere acolo unde contează.**

EVOLVE este o platformă open-source, descentralizată, pentru oameni care s-au săturat să-și predea numărul de telefon, fața și cele mai intime date de sănătate bazei de date a altcuiva. Te autentifici cu propriul portofel cripto — fără telefon, fără email, fără KYC — și îți poți recupera contul printr-un angajament ADN on-chain. Datele tale de sănătate rămân ale tale: rezultatele testelor sunt analizate automat, stările individuale ale patogenilor nu sunt **niciodată** afișate nimănui, iar potrivirea se bazează doar pe verdicte anonime de compatibilitate (Sigur / Compatibil / Precauție / Risc). Chatul funcționează peer-to-peer prin libp2p și Nostr, cu o soluție de rezervă HTTP pentru comoditate.

> **Stare — platforma funcționează astăzi; mainnet și DEX sunt următoarele.**
> Întâlnirile, concepția, verificarea sănătății, fluxul de laborator, chatul P2P, tokenul EVOLVE și guvernanța funcționează toate. Urmează: **implementarea în mainnet și lichiditatea DEX**, plus o **vânzare publică planificată** (vezi [Tokenul EVOLVE](#the-evolve-token-testnet-only)).
> Contractele inteligente sunt implementate **doar în rețeaua de test Ethereum Sepolia**. Nimic de aici nu este sfat financiar sau ofertă de investiție.

> **Ți se pare util EVOLVE? Susține dezvoltarea — fiecare donație merge către cod, parteneriate cu laboratoare, găzduire și traduceri → [DONATE.md](DONATE.md).**

## Nu este nimic de temut

EVOLVE a fost construit în jurul întrebărilor pe care oamenii le pun de fapt înainte de a avea încredere într-o astfel de platformă.

| Neliniștea                                     | Ce face deja EVOLVE în privința asta                                                                                                                                                                |
| ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| "Datele mele de sănătate se vor scurge."       | Rezultatele individuale ale patogenilor nu sunt **niciodată** afișate nimănui — doar un verdict anonim: Sigur / Compatibil / Precauție / Risc.                                                      |
| "Fotografiile mele vor ajunge undeva."         | Fotografiile sunt estompate implicit. Proprietarul acordă o vizualizare de **15 secunde** sau **permanentă** — la cerere sau proactiv. Vizualizarea este gratuită.                                  |
| "Va trebui să predau buletinul sau telefonul." | Autentificare cu portofel (SIWE). Fără telefon, fără email, fără KYC. Recuperarea funcționează printr-un angajament ADN on-chain.                                                                   |
| "El sau ea minte că este sănătos."             | Rezultatele sunt **verificate de laborator** (QR + potrivire facială), iar testele cuplului sunt făcute **la întâlnire** — contează rezultatele ITS recente, ADN-ul nu îmbătrânește.                |
| "Va lua cineva banii mei și va dispărea?"      | Concepția se bazează pe un angajament real, cu risc: depozitul unui bărbat se mișcă doar când paternitatea este **confirmată**; altfel, pur și simplu i se returnează.                              |
| "Este tokenul un pump-and-dump?"               | Nu există nicio vânzare activă astăzi; codul este deschis (MIT); rezerva neintrată în circulație urmează să fie blocată într-un **seif negolibil** din care nici măcar fondatorul nu poate retrage. |
| "Poate fi platforma închisă sau interzisă?"    | Mesagerie peer-to-peer în primul rând, stocare descentralizată (IPFS / Arweave), 18 configurații de rețele EVM și fără domeniu codificat.                                                           |

## Ce și de ce

Aplicațiile de întâlniri tradiționale îți cer să-ți schimbi numărul de telefon, emailul, fotografiile și detaliile intime de sănătate pe o bază de date centrală — iar apoi să ai încredere în acea bază de date pentru totdeauna. EVOLVE pornește de la premisa opusă: **confidențialitate implicită, auto-custodie și niciun punct unic de eșec**.

- **Confidențialitate implicită** — datele de sănătate nu sunt niciodată expuse; doar verdicte anonime.
- **Rezistență la interzicere** — mesagerie P2P în primul rând, stocare descentralizată, design multi-rețea, fără domenii codificate.
- **Identitate auto-custodiată** — portofelul tău este autentificarea ta; recuperare bazată pe ADN în loc de email sau telefon.
- **Fără barieră KYC** — nu sunt necesare buletin, telefon sau email pentru a folosi platforma.

Citește rațiunea completă în [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md).

## Sănătate în care poți chiar să ai încredere

- Încarcă un test ITS ca text brut sau PDF (extragere a stratului de text, cu soluție de rezervă OCR pentru scanări).
- Parserul cunoaște 8 patogeni: HIV-1/2, sifilis, chlamydia, gonoree, HSV-1, HSV-2, hepatita B, hepatita C — în formate de raport în engleză, ucraineană și rusă.
- **Starea individuală a unui patogen nu este niciodată afișată altor utilizatori.** Profilurile arată doar verdictul anonim: **Sigur / Compatibil / Precauție / Risc**.
- Înregistrările ADN on-chain (`DNAVerification.sol`) alimentează recuperarea și verificarea.

### Laboratoare partenere — dovezi, nu promisiuni

Intră într-un laborator partener și arată codul QR. Laboratorul îl scanează, îți confirmă identitatea prin **potrivire facială** (astfel încât nimeni altcineva să nu-ți poată ridica rezultatul) și atașează raportul ITS — PDF, scanare sau text, chiar și cu OCR slab. Rezultatul este semnat de un laborator real, nu de tine, așa că ceilalți văd un **fapt verificat** în loc de cuvântul tău. Și fiecare verificare confirmată plătește **1 EVOLVE pacientului și 1 EVOLVE laboratorului** — ambele părți au un motiv să fie sincere. Patogenii individuali tot nu sunt afișați nimănui.

## Găsirea cuiva

- Filtre de căutare: "Ce cauți" (întâlniri / concepție / concepție poliandrică / testare ITS), "Pe cine cauți" (bărbați, femei, cupluri), selectoare în cascadă țară → oraș, "poate călători în țara ta" cu liste pe țări, culoarea pielii, preferință de testare, doar compatibile ITS.
- Asistent de onboarding: vârstă (ascundibilă), limbi, bio, fotografie.
- **Chat P2P** prin libp2p (gossipsub) + Nostr, cu o soluție de rezervă HTTP API.

## Concepție

Două moduri de a planifica un copil, ambele bazate pe aceeași idee: intenția reală este arătată printr-un angajament real în EVOLVE — niciodată prin promisiuni. Angajamentul unui bărbat trăiește în depozitul său EvolveFund (de la 15 EVOLVE, blocat cel puțin 30 de zile), iar o femeie poate stabili propriul minim pentru bărbații care ajung la ea.

**Concepție.** Femeia conduce: invită un anumit bărbat și îl numește într-o legătură. El are nevoie de un depozit EvolveFund activ; când amândoi confirmă, acesta este blocat și începe numărătoarea inversă. Sarcina este raportată între 14 și 30 de zile după confirmare, iar testele ITS și ADN ale cuplului sunt făcute chiar la întâlnire — contează rezultatele ITS recente, ADN-ul nu îmbătrânește. Odată ce paternitatea este confirmată, depozitul bărbatului trece la femeie; dacă nu este confirmată, depozitul este pur și simplu returnat lui. Nimic nu își schimbă proprietarul până când faptele nu sunt stabilite.

**Concepție poliandrică.** Alegerea îi aparține și rămâne privată. Ea deschide o sesiune care durează 48 de ore — fără depozit propriu (poate adăuga unul doar pentru reputație, dacă dorește). Bărbații cu un depozit activ se pot alătura — până la 50 — și pot confirma, ceea ce le blochează miza. La paisprezece zile după închiderea sesiunii, tatăl este ales. El își primește depozitul înapoi plus o recompensă din fond: dublul depozitului său și 1 EVOLVE pentru fiecare alt participant. Bărbații care nu sunt aleși își pierd miza — 90% la femeie, 10% la tatăl ales. Ea nu riscă nimic și poate doar câștiga; bărbații își pun miza în spatele dreptului de a fi aleși.

## Tokenul EVOLVE (doar rețeaua de test)

- ERC-20, ofertă maximă **8,000,000,000 EVOLVE**. Acțiunile de administrator sunt restricționate de un `TimelockController` de 48 de ore.
- **Alocare planificată a ofertei** — concepută astfel încât aproape întreaga ofertă să lucreze pentru utilizatori, nu pentru persoane din interior:

| Scop                                                      |        EVOLVE |
| --------------------------------------------------------- | ------------: |
| Fondatori și echipă (salariu / recompensă)                |    25,000,000 |
| Rezervă DEX (viitoare)                                    |     4,000,000 |
| Vânzare publică (planificată)                             |     5,000,000 |
| Rezervă de recompense — laboratoare, pacienți, mame, tați | 7,966,000,000 |

- **Vânzare publică planificată** — 5,000,000 EVOLVE vândute de aplicație la **$0.8 fiecare**, plătibile în orice token acceptat de aplicație; veniturile finanțează dezvoltarea. _(Planificată — încă nu este activă.)_
- **Emisiune fără încredere (planificată)** — rezerva de ~7,966,000,000 va fi blocată într-un `RewardVault` negolibil: eliberată doar treptat prin recompense pentru laboratoare, pacienți, mame și tați, iar schimbarea regulilor necesită un vot de guvernanță. Nici măcar fondatorul nu o poate retrage. Design: [docs/REWARD-VAULT-PLAN.md](docs/REWARD-VAULT-PLAN.md).
- **Economia cadourilor emoji** — un cadou costă 1 EVOLVE, împărțit proporțional între deținătorii existenți de cadouri; un model de venit perpetuu, iar cadourile sunt transferabile.
- **EvolveFund** — staking masculin (min 15 EVOLVE, blocare 30 de zile) care contează în greutatea de guvernanță; femeile folosesc soldul portofelului.
- **Recompense de verificare** — 1 EVOLVE utilizatorului verificat și 1 EVOLVE laboratorului care confirmă, per verificare ITS/ADN (plus un faucet cu rată limitată).
- **Guvernanță** — greutatea votului combină reputația recursivă (8 voturi, adâncime 3), cota de copii/paternitate și EVOLVE-ul mizat sau deținut.
- **LayerZero OFT** integrare pentru viitoare transferuri EVOLVE multichain (dependențele sunt la locul lor; nimic implementat dincolo de Sepolia încă).

## Susține proiectul

EVOLVE este independent și open-source. Dacă îți este util, poți susține dezvoltarea printr-o donație — fiecare contribuție merge către cod, parteneriate cu laboratoare, găzduire și traduceri.

- **Detalii donații (EVM, Monero și altele):** [DONATE.md](DONATE.md)
- **Pagina multilingvă de donații (34 de limbi):** **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**

O vânzare publică de tokenuri este în plan, dar **nu** este activă astăzi. Donațiile sunt cadouri care susțin dezvoltarea open-source și nu oferă drepturi asupra tokenurilor, capitalului, randamentelor sau profitului. Te rugăm să dai doar ceea ce îți permiți să pierzi.

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

Contracte inteligente cheie: `EVOLVE.sol` (ERC-20), `ProfileNFT.sol` (ERC-721), `TrustScore.sol`, `Voting.sol`, `Evolve2Earn.sol` (cadouri emoji + recompense), `Governance.sol`, `BondManager.sol` (concepție și concepție poliandrică), `EvolveFund.sol`, `VerificationRegistry.sol`, `DNAVerification.sol`, ERC-4337 `SmartAccountFactory` + `Paymaster`, și un `TimelockController` OpenZeppelin.

Detalii: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md)

## Foaie de parcurs

În curs: pregătirea aplicației web pentru producție. Planificat: registru de laboratoare on-chain și certificarea testelor, un adaptor real de furnizor de mail pentru ingestia rapoartelor de laborator, atestări verificate on-chain pe profiluri, **RewardVault fără încredere** cu emisiune controlată prin guvernanță ([design](docs/REWARD-VAULT-PLAN.md)), **vânzarea publică de tokenuri**, actualizarea vesting-ului pentru alocarea fondatorului și asigurarea lichidității DEX (în prezent blocată — necesită implementări de tokenuri în mainnet). Extinderea multi-rețea (Arbitrum, Avalanche și alte lanțuri EVM) urmează după consolidarea rețelei de test.

Lista completă: [docs/ROADMAP.md](docs/ROADMAP.md).

## Început (dezvoltatori)

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

Contribuțiile sunt binevenite — cod, rapoarte de erori, sugestii de funcții și propuneri. Te rugăm să citești [CONTRIBUTING.md](CONTRIBUTING.md) și [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) înainte de a începe.

## Depozite (oglinzi)

| Oglindă  | URL                                        |
| -------- | ------------------------------------------ |
| GitHub   | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg | https://codeberg.org/limitafternoon/Evolve |
| GitLab   | https://gitlab.com/evolve-group3/evolve    |

## Documentație

- [Ce și de ce](docs/WHAT-AND-WHY.md) — problemă, viziune, valori de bază
- [Cum funcționează](docs/HOW-IT-WORKS.md) — fluxuri de utilizator, pas cu pas
- [Arhitectură](docs/ARCHITECTURE.md) — monorepo, pachete, fluxuri de date
- [Tokenomics](docs/TOKENOMICS.md) — modelul tokenului și distribuția ofertei
- [Plan RewardVault](docs/REWARD-VAULT-PLAN.md) — emisiune fără încredere (planificată)
- [Foaie de parcurs](docs/ROADMAP.md) — etape și starea actuală
- [FAQ](docs/FAQ.md) — întrebări frecvente
- [Ghid portofel](docs/WALLETS.md) — cum să creezi portofele și să obții adrese de donație

## Licență

Licențiat sub [MIT License](LICENSE).

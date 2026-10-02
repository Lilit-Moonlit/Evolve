[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)

# EVOLVE

**Întâlniri, concepere și verificarea sănătății — confidențialitate implicită, verificare acolo unde contează.**

EVOLVE este o platformă open-source, descentralizată, pentru conexiuni intime verificabile: întâlniri, concepere și compatibilitate anonimă STD/ADN. Vă autentificați cu propriul portofel cripto (Sign-In with Ethereum) — fără număr de telefon, fără e-mail, fără KYC — iar accesul la cont îl puteți recupera printr-un angajament ADN on-chain. Datele despre sănătate rămân ale voastre: rezultatele analizelor sunt parsate automat, statuturile individuale ale patogenilor **nu sunt niciodată** afișate nimănui, iar potrivirea se bazează doar pe verdicturi anonime de compatibilitate (Safe / Compatible / Caution / Risk). Chat-ul funcționează peer-to-peer prin libp2p și Nostr (cu un fallback HTTP pentru comoditate), iar aplicația vine cu o fațadă publică ușoară „Safety Mode” și un Companion Mode separat pentru evaluarea rezultatelor testelor STD.

> **Stare: alfa timpurie.** EVOLVE este în dezvoltare activă și nu este un produs finalizat.
> Contractele smart sunt lansate **doar pe testnet-ul Ethereum Sepolia**.
> **Nu există lansare pe mainnet, DEX, lichiditate sau vânzare publică de tokenuri** — și niciuna dintre acestea nu este promisă.
> Funcționalitățile se pot schimba sau se pot strica oricând. Nimic de aici nu constituie consultanță financiară sau o ofertă de investiții.

## Ce și de ce

Platformele tradiționale de dating îți cer să predai numărul de telefon, e-mailul, fotografiile și detaliile intime despre sănătate unei baze de date centrale. EVOLVE pornește de la premisa opusă: confidențialitate implicită, auto-custodie (self-custody) și absența unui punct central de eșec. Valori fundamentale:

- **Confidențialitate implicită** — datele despre sănătate nu sunt niciodată expuse; doar verdicturi anonime.
- **Rezistență la ban** — mesagerie în primul rând P2P, stocare descentralizată (IPFS / Arweave), design multi-rețea, fără domenii hardcodate.
- **Identitate self-custody** — portofelul tău este autentificarea ta; recuperare prin ADN în loc de e-mail/telefon.
- **Fără poarta KYC** — pentru utilizarea platformei nu sunt necesare act de identitate, telefon sau e-mail.

Expunerea completă: [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md).

## Funcționalități cheie

### Identitate și confidențialitate

- **Autentificare cu portofel SIWE** (MetaMask și alte portofele EVM) — calea de scăpare rezistentă la cenzură.
- **Recuperarea contului prin ADN** — rezultatul testului ADN este hash-uit (SHA-256, angajament on-chain ca `bytes32`) și poate restabili accesul fără telefon și e-mail.
- **Abstracția contului (ERC-4337)** — conturi smart și un paymaster pentru onboarding fără gas; SIWE rămâne întotdeauna disponibil.

### Compatibilitate anonimă pe sănătate

- Încărcarea rezultatelor testelor STD ca text simplu sau PDF (extragerea stratului de text cu fallback OCR pentru pagini scanate).
- Parserul recunoaște 8 patogeni: HIV-1/2, sifilis, chlamydia, gonoree, HSV-1, HSV-2, hepatita B, hepatita C (formate de rapoarte în engleză, ucraineană și rusă).
- **Statutul individual al patogenilor nu este niciodată afișat altor utilizatori.** Profilele arată doar un verdict anonim: **Safe / Compatible / Caution / Risk**.
- Înregistrările de verificare ADN on-chain (`DNAVerification.sol`) alimentează fluxurile de recuperare și verificare.

### Profile, căutare și comunicare

- Filtre de căutare: „Ce cauți” (întâlniri / concepere / concepere poliandră / testare STD), „Pe cine cauți” (bărbați, femei, cupluri), selecții în cascadă țară → oraș, „poate veni în țara ta” cu liste per țară, culoarea pielii, preferința de testare, doar compatibili STD.
- Asistentul de onboarding: vârstă (poate fi ascunsă), limbi, bio, fotografie.
- **Confidențialitatea fotografiilor**: fotografiile sunt implicit neclare; proprietarul acordă vizionări de 15 secunde sau permanente — proactiv sau la cerere. Vizionarea este gratuită.
- **Chat P2P** prin libp2p (gossipsub) + Nostr, cu fallback pe HTTP API.

### Modurile de concepere

- **Modul 2 — Pregnancy Bond**: o femeie creează un bond, un bărbat plasează EVOLVE în staking (≥ 100 în versiunea actuală de testnet), ambii confirmă; după o sarcină și o paternitate confirmate, stake-ul se transferă femeii.
- **Modul 3 — Cryptic Choice**: o femeie deschide o sesiune de 48 de ore, bărbații se alătură prin staking; ea alege tatăl — stake-ul lui este returnat, iar la ceilalți suma se împarte: 90 % ei / 10 % tatălui ales.

### Laboratoare și verificare

- **Fluxul laboratoarelor-parteneri**: laboratoarele se înregistrează ca parteneri, verifică pacienții prin cod QR și potrivirea feței și atașează rapoarte STD (PDF/text cu extragere OCR).
- **Companion Mode**: flux separat pentru evaluarea rezultatelor testelor STD fără a se alătura platformei de dating.
- **Safety Mode** (`VITE_PRODUCT_MODE=safety`): o fațadă publică limitată (statut STD, linkuri publice de profil, verificări de compatibilitate) care continuă să funcționeze chiar dacă funcționalitățile de dating sau de concepere sunt restricționate într-o jurisdicție sau într-un magazin de aplicații.

### Tokenul EVOLVE (doar testnet)

- ERC-20, oferta maximă 8.000.000.000 EVOLVE, acțiunile de administrare fiind protejate de un TimelockController de 48 de ore.
- **Economia darurilor emoji**: un dar costă 1 EVOLVE, care se împarte proporțional între proprietarii existenți de daruri — un model de venit perpetuu pentru deținători; darurile sunt transferabile.
- **EvolveFund**: staking masculin (min 15 EVOLVE, blocare 30 de zile) care contează la ponderea votului de guvernanță; femeile folosesc soldul portofelului.
- **Recompense de verificare**: 1 EVOLVE pentru utilizatorul verificat și 1 EVOLVE pentru laboratorul confirmator la verificarea STD/ADN (plus un faucet de test cu limitare).
- Ponderea votului de guvernanță combină reputația recursivă (8 voturi, adâncime 3), ponderea copiilor/paternității și EVOLVE aflate în staking sau deținute.
- Integrarea **LayerZero OFT** pentru viitoarele transferuri multichain EVOLVE (dependențele sunt puse la punct; nimic nu este lansat dincolo de Sepolia).

### Platforma

- Aplicație web (instalabilă ca PWA) și aplicație mobilă Expo/React Native.
- Interfața este tradusă în **34 de limbi**.
- Pregătită pentru multi-rețea: 18 configurații de rețele EVM (Arbitrum și Avalanche sunt L2-urile primare planificate — **încă nu sunt lansate**).

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

Contractele smart cheie: `EVOLVE.sol` (ERC-20), `ProfileNFT.sol` (ERC-721), `TrustScore.sol`, `Voting.sol`, `Evolve2Earn.sol` (daruri emoji + recompense), `Governance.sol`, `BondManager.sol` (modurile 2 și 3), `EvolveFund.sol`, `VerificationRegistry.sol`, `DNAVerification.sol`, ERC-4337 `SmartAccountFactory` + `Paymaster` și un `TimelockController` OpenZeppelin.

Detalii: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md)

## Roadmap

În lucru: pregătirea aplicației web pentru producție. Planificat: registru de laboratoare on-chain și certificare a testelor, adaptor real de furnizor de e-mail pentru primirea rapoartelor de laborator, atestări verificate on-chain în profile, actualizarea vesting-ului tokenurilor pentru alocările fondatorilor/dezvoltatorilor, asigurarea lichidității DEX (momentan blocată — necesită lansări de tokenuri pe mainnet). Extinderea multi-rețea (Arbitrum, Avalanche și alte rețele EVM) urmează după consolidarea testnet-ului.

Lista completă: [docs/ROADMAP.md](docs/ROADMAP.md).

## Început (pentru dezvoltatori)

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

Contribuțiile sunt binevenite — cod, raportări de erori, sugestii de funcționalități și propuneri. Înainte de a începe, citește [CONTRIBUTING.md](CONTRIBUTING.md) și [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) al nostru.

## Sprijină proiectul

Dacă EVOLVE îți este util, poți sprijini dezvoltarea cu o donație — detalii în [DONATE.md](DONATE.md). Preferi o pagină web? Folosește pagina multilingvă de donații (34 de limbi): **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**.

**Nu există vânzare de tokenuri și nu va exista.** În EVOLVE nu se poate „investi”; donațiile sunt daruri pentru a sprijini dezvoltarea open-source și nu îi acordă donatorului dreptul la tokenuri, părți sociale, randamente sau orice pretenție financiară.

## Repositorii (mirrouri)

| Mirror   | URL                                        |
| -------- | ------------------------------------------ |
| GitHub   | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg | https://codeberg.org/limitafternoon/Evolve |
| GitLab   | https://gitlab.com/evolve-group3/evolve    |

## Documentație

- [Ce și de ce](docs/WHAT-AND-WHY.md) — problema, viziunea, valorile fundamentale
- [Cum funcționează](docs/HOW-IT-WORKS.md) — fluxuri de utilizator, pas cu pas
- [Arhitectură](docs/ARCHITECTURE.md) — monorepo, pachete, fluxuri de date
- [Tokenomică](docs/TOKENOMICS.md) — modelul tokenului și distribuția ofertei
- [Roadmap](docs/ROADMAP.md) — etape și starea curentă
- [FAQ](docs/FAQ.md) — întrebări frecvente
- [Ghidul portofelelor](docs/WALLETS.md) — cum să creezi portofele și să obții adrese de donație

## Licență

Licențiat sub [MIT License](LICENSE).

[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)

# EVOLVE

**Incontri, concezione e verifica sanitaria — privato per impostazione predefinita, verificato dove conta.**

EVOLVE è una piattaforma open-source e decentralizzata per connessioni intime verificabili: incontri, concezione e compatibilità anonima STD/DNA. Accedi con il tuo portafoglio crypto (Sign-In with Ethereum) — senza numero di telefono, senza e-mail, senza KYC — e puoi recuperare l'account tramite un impegno di DNA on-chain. I dati sanitari restano tuoi: i risultati di laboratorio vengono analizzati automaticamente, gli stati individuali dei patogeni **non vengono mai** mostrati a nessuno e il matching si basa solo su verdetti anonimi di compatibilità (Safe / Compatible / Caution / Risk). La chat funziona peer-to-peer tramite libp2p e Nostr, con un fallback HTTP per comodità, e l'app include una leggera facciata pubblica “Safety Mode” più una Modalità Companion autonoma per la valutazione dei risultati dei test STD.

> **Stato: alfa in fase iniziale.** EVOLVE è in sviluppo attivo e non è un prodotto finito.
> Gli smart contract sono distribuiti **solo sulla testnet Ethereum Sepolia**.
> **Non esiste distribuzione su mainnet, nessun DEX, nessuna liquidità e nessuna vendita pubblica di token** — e nulla di tutto ciò è promesso.
> Le funzionalità possono cambiare o rompersi in qualsiasi momento. Nulla qui è consulenza finanziaria o un'offerta di investimento.

## Cosa e perché

Le piattaforme di incontri tradizionali chiedono di consegnare numero di telefono, e-mail, foto e dettagli intimi sulla salute a un database centrale. EVOLVE parte dalla premessa opposta: privacy per impostazione predefinita, autocustodia e nessun punto centrale di guasto. Valori fondamentali:

- **Privacy per impostazione predefinita** — i dati sanitari non vengono mai esposti; solo verdetti anonimi.
- **Resistenza ai ban** — messaggistica P2P innanzitutto, archiviazione decentralizzata (IPFS / Arweave), progettazione multi-rete, nessun dominio hardcoded.
- **Identità autocustodita** — il tuo portafoglio è il tuo login; recupero basato sul DNA invece di e-mail/telefono.
- **Nessuna barriera KYC** — per usare la piattaforma non servono documenti d'identità, telefono né e-mail.

Leggi la motivazione completa in [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md) (in inglese).

## Funzionalità principali

### Identità e privacy

- **Accesso con portafoglio SIWE** (MetaMask e altri portafogli EVM) — la via di fuga resistente alla censura.
- **Recupero dell'account tramite DNA** — il risultato del tuo test del DNA viene hashato (SHA-256, impegnato on-chain come `bytes32`) e può ripristinare l'accesso senza telefono né e-mail.
- **Account Abstraction (ERC-4337)** — smart account e un paymaster per l'onboarding senza gas; SIWE resta sempre disponibile.

### Compatibilità sanitaria anonima

- Caricamento dei risultati dei test STD come testo semplice o PDF (estrazione del livello di testo con fallback OCR per le pagine scansionate).
- Il parser riconosce 8 patogeni: HIV-1/2, sifilide, clamidia, gonorrea, HSV-1, HSV-2, epatite B, epatite C (formati di referto in inglese, ucraino e russo).
- **Lo stato individuale dei patogeni non viene mai mostrato agli altri utenti.** I profili mostrano solo un verdetto anonimo: **Safe / Compatible / Caution / Risk**.
- I registri on-chain di verifica del DNA (`DNAVerification.sol`) alimentano i flussi di recupero e verifica.

### Profili, ricerca e comunicazione

- Filtri di ricerca: “Cosa cerchi” (incontri / concezione / concezione poliandrica / test STD), “Chi cerchi” (uomini, donne, coppie), selezioni a cascata paese → città, “può venire nel tuo paese” con elenchi per paese, colore della pelle, preferenza di test, solo compatibili per STD.
- Procedura guidata di onboarding: età (nascondibile), lingue, bio, foto.
- **Privacy delle foto**: le foto sono sfocate per impostazione predefinita; il proprietario concede visualizzazioni di 15 secondi o permanenti, su richiesta o proattivamente. Guardare è gratuito.
- **Chat P2P** tramite libp2p (gossipsub) + Nostr, con fallback su API HTTP.

### Modalità di concezione

- **Modalità 2 — Pregnancy Bond**: una donna crea un vincolo, un uomo mette in stake EVOLVE (≥ 100 nell'attuale build testnet), entrambi confermano; dopo una gravidanza e una paternità confermate, lo stake passa alla donna.
- **Modalità 3 — Cryptic Choice**: una donna apre una sessione di 48 ore, gli uomini entrano mettendo in stake; lei sceglie il padre — il suo stake viene restituito, gli altri si dividono: 90% a lei / 10% al padre scelto.

### Laboratori e verifica

- **Flusso dei laboratori partner**: i laboratori si registrano come partner, verificano i pazienti tramite QR code e riconoscimento facciale e allegano referti STD (PDF/testo con estrazione OCR).
- **Modalità Companion**: flusso autonomo per valutare i risultati dei test STD senza iscriversi alla piattaforma di incontri.
- **Modalità Safety** (`VITE_PRODUCT_MODE=safety`): una facciata pubblica limitata (stato STD, link pubblici del profilo, controlli di compatibilità) che continua a funzionare anche se le funzionalità di incontri/concezione vengono limitate in una giurisdizione o in un app store.

### Token EVOLVE (solo testnet)

- ERC-20, offerta massima di 8.000.000.000 EVOLVE, azioni amministrative vincolate a un TimelockController di 48 ore.
- **Economia dei regali emoji**: un regalo costa 1 EVOLVE, ripartito proporzionalmente tra i proprietari di regali esistenti — un modello di rendita perpetuo per i detentori; i regali sono trasferibili.
- **EvolveFund**: staking maschile (min 15 EVOLVE, blocco di 30 giorni) che conta nel peso di governance; le donne usano il saldo del portafoglio.
- **Ricompense di verifica**: 1 EVOLVE all'utente verificato e 1 EVOLVE al laboratorio che conferma, a ogni verifica STD/DNA (più un faucet di test a frequenza limitata).
- Il peso di voto in governance combina reputazione ricorsiva (8 voti, profondità 3), la quota di figli/paternità ed EVOLVE in stake o detenuti.
- Integrazione **LayerZero OFT** per futuri trasferimenti multichain di EVOLVE (dipendenze pronte; nulla ancora distribuito oltre Sepolia).

### Piattaforma

- App web (installabile come PWA) e app mobile Expo/React Native.
- Interfaccia tradotta in **34 lingue**.
- Pronta per il multi-rete: 18 configurazioni di rete EVM (Arbitrum e Avalanche sono le L2 primarie previste — **non ancora distribuite**).

## Architettura e stack tecnologico

Monorepo gestito con npm workspaces + Turborepo:

```
apps/
  web/          # Vite + React + TypeScript (app web principale, i18next, Prisma)
  mobile/       # Expo + React Native
packages/
  config/       # Feature flag e configurazione remota dinamica
  contracts/    # Solidity 0.8.24, Hardhat, Ignition, OpenZeppelin, LayerZero
  core/         # Tipi condivisi, utility, middleware, web3
  matching/     # Algoritmi di matching, filtri, ranking
  p2p/          # Networking libp2p (gossipsub) + Nostr
  storage/      # IPFS, Arweave, Lit Protocol
docs/           # Architettura, tokenomics, roadmap, FAQ
```

Smart contract principali: `EVOLVE.sol` (ERC-20), `ProfileNFT.sol` (ERC-721), `TrustScore.sol`, `Voting.sol`, `Evolve2Earn.sol` (regali emoji + ricompense), `Governance.sol`, `BondManager.sol` (modalità 2 e 3), `EvolveFund.sol`, `VerificationRegistry.sol`, `DNAVerification.sol`, `SmartAccountFactory` + `Paymaster` ERC-4337 e un `TimelockController` di OpenZeppelin.

Dettagli: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md) (in inglese).

## Roadmap

In corso: messa in produzione dell'app web. Previsto: registro dei laboratori on-chain e certificazione dei test, adapter reale di provider di posta per l'acquisizione dei referti di laboratorio, attestazioni verificate on-chain nei profili, aggiornamento del vesting dei token per le allocazioni di founder/sviluppatori, fornitura di liquidità sui DEX (attualmente bloccata — richiede distribuzioni del token su mainnet). L'espansione multi-rete (Arbitrum, Avalanche e altre chain EVM) seguirà dopo il consolidamento sulla testnet.

Elenco completo: [docs/ROADMAP.md](docs/ROADMAP.md) (in inglese).

## Per iniziare (sviluppatori)

Requisiti: **Node.js 20+** e npm 10.x.

```bash
# Clonare e installare tutti i workspace
git clone https://github.com/Lilit-Moonlit/Evolve.git
cd Evolve
npm install

# App web (server di sviluppo Vite su http://localhost:3000)
cd apps/web
npm run dev
npm test                # suite vitest

# Smart contract
cd packages/contracts
npm run compile         # hardhat compile
npm test                # suite di test hardhat
npm run deploy:local    # distribuire tutti i contratti su una rete Hardhat in-process
```

## Contribuire

I contributi sono benvenuti — codice, segnalazioni di bug, suggerimenti di funzionalità e proposte. Leggi [CONTRIBUTING.md](CONTRIBUTING.md) e il nostro [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) prima di iniziare.

## Sostenere il progetto

Se trovi utile EVOLVE, puoi sostenere lo sviluppo con una donazione — dettagli in [DONATE.md](DONATE.md). Preferisci una pagina web? Usa la pagina di donazione multilingue (34 lingue): **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**.

**Non c'è vendita di token e non ci sarà.** Non è possibile “investire” nei token EVOLVE; le donazioni sono regali a sostegno dello sviluppo open-source e non danno al donatore diritto a token, quote, rendimenti o alcuna pretesa finanziaria.

## Repository (mirror)

| Mirror   | URL                                        |
| -------- | ------------------------------------------ |
| GitHub   | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg | https://codeberg.org/limitafternoon/Evolve |
| GitLab   | https://gitlab.com/evolve-group3/evolve    |

## Documentazione

- [Cosa e perché](docs/WHAT-AND-WHY.md) — problema, visione, valori fondamentali (inglese)
- [Come funziona](docs/HOW-IT-WORKS.md) — flussi utente, passo per passo (inglese)
- [Architettura](docs/ARCHITECTURE.md) — monorepo, pacchetti, flussi di dati (inglese)
- [Tokenomics](docs/TOKENOMICS.md) — modello del token e distribuzione dell'offerta (inglese)
- [Roadmap](docs/ROADMAP.md) — traguardi e stato attuale (inglese)
- [FAQ](docs/FAQ.md) — domande frequenti (inglese)
- [Guida ai portafogli](docs/WALLETS.md) — come creare portafogli e ottenere indirizzi per le donazioni (inglese)

## Licenza

Rilasciato sotto la [Licenza MIT](LICENSE).

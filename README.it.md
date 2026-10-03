[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)

# EVOLVE

**Incontri, concepimento e salute verificata — privacy per impostazione predefinita, fiducia dove conta.**

EVOLVE è una piattaforma open-source e decentralizzata per persone che hanno smesso di consegnare il proprio numero di telefono, il proprio volto e i propri dati di salute più intimi al database di qualcun altro. Accedi con il tuo wallet crypto — senza telefono, senza email, senza KYC — e puoi recuperare l'account tramite un impegno DNA on-chain. I tuoi dati di salute restano tuoi: i risultati dei test vengono analizzati automaticamente, gli stati individuali dei patogeni non vengono **mai** mostrati a nessuno, e il matching si basa solo su verdetti anonimi di compatibilità (Safe / Compatible / Caution / Risk). La chat funziona peer-to-peer su libp2p e Nostr, con un fallback HTTP per comodità.

> **Stato — la piattaforma funziona oggi; mainnet e DEX sono i prossimi passi.**
> Incontri, concepimento, verifica della salute, il flusso di laboratorio, la chat P2P, il token EVOLVE e la governance sono tutti operativi. Davanti: un **deploy su mainnet e liquidità DEX**, più una **vendita pubblica prevista** (vedi [Il token EVOLVE](#il-token-evolve-solo-testnet)).
> Gli smart contract sono distribuiti **solo sulla testnet Ethereum Sepolia**. Nulla qui è consulenza finanziaria o un'offerta di investimento.

> **Trovi utile EVOLVE? Sostieni lo sviluppo — ogni donazione va a codice, partnership con i laboratori, hosting e traduzione → [DONATE.md](DONATE.md).**

## Niente da temere

EVOLVE è stato costruito attorno alle domande che le persone si pongono davvero prima di fidarsi di una piattaforma del genere.

| La preoccupazione                             | Cosa fa già EVOLVE in merito                                                                                                                                                                           |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| «I miei dati sanitari finiranno in giro.»     | I risultati individuali dei patogeni non vengono **mai** mostrati a nessuno — solo un verdetto anonimo: Safe / Compatible / Caution / Risk.                                                            |
| «Le mie foto finiranno da qualche parte.»     | Le foto sono sfocate per impostazione predefinita. Il proprietario concede una visualizzazione di **15 secondi** o **permanente** — su richiesta o proattivamente. Guardare è gratis.                  |
| «Dovrò consegnare documento o telefono.»      | Accesso con wallet (SIWE). Niente telefono, niente email, niente KYC. Il recupero avviene tramite un impegno DNA on-chain.                                                                             |
| «Lui o lei mente sulla propria salute.»       | I risultati sono **verificati da un laboratorio** (QR + riconoscimento facciale), e i test della coppia vengono fatti **all'incontro stesso** — contano i risultati MST recenti, il DNA non invecchia. |
| «Qualcuno prenderà i miei soldi e sparirà?»   | Il concepimento si basa su una posta realmente a rischio: il deposito di un uomo si muove solo quando la paternità è **confermata**; altrimenti gli viene semplicemente restituito.                    |
| «Il token è un pump-and-dump?»                | Oggi nessuna vendita è attiva; il codice è aperto (MIT); è prevista la chiusura della riserva non messa in circolazione in un **caveau non svuotabile** da cui non può prelevare nemmeno il fondatore. |
| «La piattaforma può essere chiusa o bannata?» | Messaggistica peer-to-peer prima di tutto, archiviazione decentralizzata (IPFS / Arweave), 18 configurazioni di reti EVM e nessun dominio cablato nel codice.                                          |

## Cosa e perché

Le app di incontri tradizionali ti chiedono di barattare numero di telefono, email, foto e dettagli intimi di salute con un database centrale — e poi di fidarti di quel database per sempre. EVOLVE parte dalla premessa opposta: **privacy per impostazione predefinita, autocustodia e nessun punto singolo di guasto**.

- **Privacy per impostazione predefinita** — i dati sanitari non vengono mai esposti; solo verdetti anonimi.
- **Resistenza ai ban** — messaggistica P2P prima di tutto, archiviazione decentralizzata, design multi-rete, nessun dominio cablato.
- **Identità autocustodita** — il tuo wallet è il tuo login; recupero basato sul DNA invece di email o telefono.
- **Nessun gate KYC** — nessun documento, telefono o email richiesto per usare la piattaforma.

Leggi la motivazione completa in [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md).

## Salute di cui fidarsi davvero

- Carica un test MST come testo grezzo o PDF (estrazione del livello di testo, con fallback OCR per le scansioni).
- Il parser conosce 8 patogeni: HIV-1/2, sifilide, clamidia, gonorrea, HSV-1, HSV-2, epatite B, epatite C — in formati di referto in inglese, ucraino e russo.
- **Lo stato individuale dei patogeni non viene mai mostrato agli altri utenti.** I profili mostrano solo il verdetto anonimo: **Safe / Compatible / Caution / Risk**.
- I record DNA on-chain (`DNAVerification.sol`) alimentano recupero e verifica.

### Laboratori partner — prove, non promesse

Entra in un laboratorio partner e mostra il tuo QR code. Il laboratorio lo scansiona, conferma la tua identità con il **riconoscimento facciale** (così nessun altro può ritirare il tuo risultato) e allega il referto MST — PDF, scansione o testo, anche con un OCR scarso. Il risultato è firmato da un laboratorio reale, non da te, quindi gli altri vedono un **fatto verificato** invece della tua parola. E ogni verifica confermata paga **1 EVOLVE al paziente e 1 EVOLVE al laboratorio** — entrambe le parti hanno un motivo per essere oneste. I patogeni individuali, comunque, non vengono mai mostrati a nessuno.

## Trovare qualcuno

- Filtri di ricerca: «Cosa cerchi» (incontri / concepimento / concepimento poliandrico / test MST), «Chi cerchi» (uomini, donne, coppie), selezioni a cascata paese → città, «può venire nel tuo paese» con elenchi per paese, colore della pelle, preferenza di test, solo compatibili MST.
- Procedura di onboarding: età (nascondibile), lingue, bio, foto.
- **Chat P2P** su libp2p (gossipsub) + Nostr, con fallback su API HTTP.

## Concepimento

Due modi per pianificare un figlio, e entrambi poggiano sulla stessa idea: l'intenzione vera si dimostra con una posta vera in EVOLVE — mai con promesse. L'impegno di un uomo vive nel suo deposito in EvolveFund (da 15 EVOLVE, bloccato per almeno 30 giorni), e una donna può fissare il proprio deposito minimo per gli uomini che la raggiungono.

**Concepimento.** Conduce la donna: invita un uomo specifico e lo nomina in un bond. A lui serve un deposito EvolveFund attivo; quando entrambi confermano, il deposito si blocca e parte il conto alla rovescia. La gravidanza viene dichiarata tra 14 e 30 giorni dalla conferma, e i test MST e DNA della coppia vengono fatti all'incontro stesso — contano i risultati MST recenti, il DNA non invecchia. Una volta confermata la paternità, il deposito dell'uomo passa alla donna; se non è confermata, il deposito gli viene semplicemente restituito. Nulla cambia di mano finché i fatti non sono accertati.

**Concepimento poliandrico.** La scelta spetta a lei, e resta privata. Apre una sessione della durata di 48 ore — senza deposito proprio (può aggiungerne uno solo per reputazione, se vuole). Gli uomini con un deposito attivo possono entrare — fino a 50 — e confermare, il che blocca la loro posta. Quattordici giorni dopo la chiusura della sessione viene scelto il padre. Riottiene il suo deposito più una ricompensa dal montepremi: il doppio del suo deposito e 1 EVOLVE per ogni altro partecipante. Gli uomini non scelti perdono la loro posta — il 90% alla donna, il 10% al padre scelto. Lei non rischia nulla e può solo guadagnare; gli uomini mettono la loro posta dietro il diritto di essere scelti.

## Il token EVOLVE (solo testnet)

- ERC-20, offerta massima **8,000,000,000 EVOLVE**. Le azioni amministrative sono vincolate da un `TimelockController` di 48 ore.
- **Ripartizione prevista dell'offerta** — pensata per mettere quasi tutta l'offerta al lavoro per gli utenti, non per gli insider:

| Finalità                                                |        EVOLVE |
| ------------------------------------------------------- | ------------: |
| Fondatori e team (stipendio / ricompensa)               |    25,000,000 |
| Riserva DEX (futuro)                                    |     4,000,000 |
| Vendita pubblica (prevista)                             |     5,000,000 |
| Riserva ricompense — laboratori, pazienti, madri, padri | 7,966,000,000 |

- **Vendita pubblica prevista** — 5,000,000 EVOLVE venduti dall'app a **$0.8 ciascuno**, pagabili con qualsiasi token supportato dall'app; il ricavato finanzia lo sviluppo. _(Previsto — non ancora attivo.)_
- **Emissione trustless (prevista)** — la riserva ricompense di ~7,966,000,000 è prevista in un `RewardVault` non svuotabile: rilasciata solo gradualmente tramite ricompense a laboratori, pazienti, madri e padri, con cambi delle regole che richiedono una votazione di governance. Non può prelevarla nemmeno il fondatore. Design: [docs/REWARD-VAULT-PLAN.md](docs/REWARD-VAULT-PLAN.md).
- **Economia dei regali emoji** — un regalo costa 1 EVOLVE, ripartito proporzionalmente tra i proprietari dei regali esistenti; un modello di reddito perpetuo, e i regali sono trasferibili.
- **EvolveFund** — staking maschile (min 15 EVOLVE, blocco di 30 giorni) che conta nel peso di governance; le donne usano il saldo del wallet.
- **Ricompense di verifica** — 1 EVOLVE all'utente verificato e 1 EVOLVE al laboratorio che conferma, per ogni verifica MST/DNA (più un faucet a frequenza limitata).
- **Governance** — il peso del voto combina reputazione ricorsiva (8 voti, profondità 3), quota di figli/paternità ed EVOLVE in staking o detenuti.
- Integrazione **LayerZero OFT** per i futuri trasferimenti multichain di EVOLVE (dipendenze pronte; nulla distribuito oltre Sepolia per ora).

## Sostieni il progetto

EVOLVE è indipendente e open-source. Se ti è utile, puoi sostenere lo sviluppo con una donazione — ogni contributo va a codice, partnership con i laboratori, hosting e traduzione.

- **Dettagli per le donazioni (EVM, Monero e altro):** [DONATE.md](DONATE.md)
- **Pagina donazioni multilingue (34 lingue):** **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**

Una vendita pubblica di token è in roadmap ma **non** è attiva oggi. Le donazioni sono regali che sostengono lo sviluppo open-source e non danno diritto a token, quote, rendimenti o profitti. Dona solo ciò che puoi permetterti di perdere.

## Architettura e stack tecnologico

Monorepo gestito con npm workspaces + Turborepo:

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

Principali smart contract: `EVOLVE.sol` (ERC-20), `ProfileNFT.sol` (ERC-721), `TrustScore.sol`, `Voting.sol`, `Evolve2Earn.sol` (regali emoji + ricompense), `Governance.sol`, `BondManager.sol` (concepimento e concepimento poliandrico), `EvolveFund.sol`, `VerificationRegistry.sol`, `DNAVerification.sol`, ERC-4337 `SmartAccountFactory` + `Paymaster`, e un `TimelockController` di OpenZeppelin.

Dettagli: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md)

## Roadmap

In corso: messa in produzione dell'app web. Previsto: registro on-chain dei laboratori e certificazione dei test, un vero adattatore di provider di posta per l'acquisizione dei referti, attestazioni verificate on-chain sui profili, il **RewardVault trustless** con emissione soggetta a governance ([design](docs/REWARD-VAULT-PLAN.md)), la **vendita pubblica di token**, l'aggiornamento del vesting per l'allocazione del fondatore e la fornitura di liquidità DEX (oggi bloccata — richiede deploy del token su mainnet). L'espansione multi-rete (Arbitrum, Avalanche e altre chain EVM) segue dopo il consolidamento sulla testnet.

Elenco completo: [docs/ROADMAP.md](docs/ROADMAP.md).

## Per iniziare (sviluppatori)

Requisiti: **Node.js 20+** e npm 10.x.

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

## Contribuire

I contributi sono benvenuti — codice, segnalazioni di bug, suggerimenti di funzionalità e proposte. Leggi [CONTRIBUTING.md](CONTRIBUTING.md) e il nostro [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) prima di iniziare.

## Repository (mirror)

| Mirror   | URL                                        |
| -------- | ------------------------------------------ |
| GitHub   | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg | https://codeberg.org/limitafternoon/Evolve |
| GitLab   | https://gitlab.com/evolve-group3/evolve    |

## Documentazione

- [Cosa e perché](docs/WHAT-AND-WHY.md) — problema, visione, valori fondamentali
- [Come funziona](docs/HOW-IT-WORKS.md) — flussi utente, passo per passo
- [Architettura](docs/ARCHITECTURE.md) — monorepo, package, flussi di dati
- [Tokenomics](docs/TOKENOMICS.md) — modello del token e distribuzione dell'offerta
- [Piano RewardVault](docs/REWARD-VAULT-PLAN.md) — emissione trustless (prevista)
- [Roadmap](docs/ROADMAP.md) — tappe e stato attuale
- [FAQ](docs/FAQ.md) — domande frequenti
- [Guida ai wallet](docs/WALLETS.md) — come creare wallet e ottenere indirizzi per le donazioni

## Licenza

Rilasciato sotto la [Licenza MIT](LICENSE).

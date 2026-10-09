[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)
<!-- evolve-readme-sync: 3796750887b0bd65 -->

# EVOLVE

**Incontri, concepimento e salute verificata — privato per impostazione predefinita, affidabile dove conta davvero.**

EVOLVE è una piattaforma open-source e decentralizzata pensata per chi ha smesso di consegnare il proprio numero di telefono, il proprio volto e i propri dati sanitari più intimi al database di qualcun altro. Si accede con il proprio wallet crypto — senza telefono, senza email, senza KYC — e si può recuperare l'account tramite un impegno DNA on-chain. I tuoi dati sanitari restano tuoi: i risultati dei test vengono analizzati automaticamente, lo stato individuale dei patogeni non viene **mai** mostrato a nessuno e il matching si basa solo su verdetti anonimi di compatibilità (Safe / Compatible / Caution / Risk). La chat funziona peer-to-peer su libp2p e Nostr, con un fallback HTTP per comodità. Regali e trasferimenti puntano verso la piena riservatezza: i regali con mittente privato sono già attivi oggi, mentre un wallet schermato Railgun e un prototipo zero-knowledge su Aztec sono in roadmap (vedi [Privacy e transazioni riservate](#privacy-e-transazioni-riservate)).

> **Stato — modalità demo, in fase di sviluppo attivo.**
> Incontri, concepimento, verifica sanitaria, il flusso di laboratorio, la chat P2P, il token EVOLVE e la governance sono tutti implementati e girano in una **demo locale** — l'app **non è ancora distribuita pubblicamente**. Ancora davanti: un **deploy su mainnet e liquidità DEX**, più una **vendita pubblica prevista** (vedi [Il token EVOLVE](#il-token-evolve-solo-testnet)).
> Gli smart contract sono distribuiti **solo sulla testnet Ethereum Sepolia**. Nulla qui è un consiglio finanziario o un'offerta di investimento.

> **Trovi utile EVOLVE? Sostieni lo sviluppo — ogni donazione va al codice, alle partnership con i laboratori, all'hosting e alla traduzione → [DONATE.md](DONATE.md).**

## Nulla da temere

EVOLVE è stato costruito attorno alle domande che le persone si pongono davvero prima di fidarsi di una piattaforma così.

| La preoccupazione                             | Cosa fa già EVOLVE al riguardo                                                                                                                                                                                              |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| "I miei dati sanitari verranno diffusi."      | I risultati individuali dei patogeni non vengono **mai** mostrati a nessuno — solo un verdetto anonimo: Safe / Compatible / Caution / Risk.                                                                                 |
| "Le mie foto finiranno da qualche parte."     | Le foto sono sfocate per impostazione predefinita. Il proprietario concede una visualizzazione di **15 secondi** o **permanente** — su richiesta o proattivamente. La visualizzazione è gratuita.                           |
| "Dovrò consegnare documento o telefono."      | Accesso tramite wallet (SIWE). Niente telefono, niente email, niente KYC. Il recupero funziona tramite un impegno DNA on-chain.                                                                                             |
| "Lui o lei mente sulla propria salute."       | I risultati sono **verificati dal laboratorio** (QR + riconoscimento facciale) e i test della coppia vengono eseguiti **all'incontro** — contano i risultati STD recenti, il DNA non invecchia.                             |
| "Qualcuno prenderà i miei soldi e sparirà?"   | Il concepimento si basa su una posta reale, a rischio: il deposito di un uomo si muove solo quando la paternità è **confermata**; altrimenti gli viene semplicemente restituito.                                            |
| "Il token è un pump-and-dump?"                | Il codice è aperto (MIT); quasi l'intera offerta è riservata alle ricompense degli utenti e la riserva non immessa in circolazione è prevista in un **vault non svuotabile** da cui non può prelevare nemmeno il fondatore. |
| "La piattaforma può essere chiusa o vietata?" | Prima la messaggistica peer-to-peer, storage decentralizzato (IPFS / Arweave), 18 configurazioni di rete EVM e nessun dominio hardcoded.                                                                                    |

## Cosa e Perché

Le app di incontri tradizionali ti chiedono di barattare numero di telefono, email, foto e dettagli intimi sulla salute con un database centrale — e poi di fidarti di quel database per sempre. EVOLVE parte dalla premessa opposta: **privacy per impostazione predefinita, autocustodia e nessun punto singolo di guasto**.

- **Privacy per impostazione predefinita** — i dati sanitari non vengono mai esposti; solo verdetti anonimi.
- **Resistenza ai divieti** — messaggistica P2P-first, storage decentralizzato, design multi-rete, nessun dominio hardcoded.
- **Identità in autocustodia** — il tuo wallet è il tuo accesso; recupero basato sul DNA invece che su email o telefono.
- **Nessun gate KYC** — nessun documento d'identità, telefono o email richiesto per usare la piattaforma.

Leggi la motivazione completa in [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md).

## Una salute di cui fidarsi davvero

- Carica un test STD come testo grezzo o PDF (estrazione dal livello testuale, con fallback OCR per le scansioni).
- Il parser riconosce 8 patogeni: HIV-1/2, sifilide, clamidia, gonorrea, HSV-1, HSV-2, epatite B, epatite C — nei formati di referto inglese, ucraino e russo.
- **Lo stato individuale dei patogeni non viene mai mostrato agli altri utenti.** I profili mostrano soltanto il verdetto anonimo: **Safe / Compatible / Caution / Risk**.
- I record DNA on-chain (`DNAVerification.sol`) alimentano recupero e verifica.

### Laboratori partner — prove, non promesse

Entra in un laboratorio partner e mostra il tuo codice QR. Il laboratorio lo scansiona, conferma la tua identità con il **riconoscimento facciale** (così nessun altro può ritirare il tuo risultato) e allega il referto STD — PDF, scansione o testo, anche con un OCR scadente. Il risultato è firmato da un laboratorio reale, non da te, quindi gli altri vedono un **fatto verificato** invece della tua parola. E ogni verifica confermata paga **1 EVOLVE al paziente e 1 EVOLVE al laboratorio** — entrambe le parti hanno un motivo per essere oneste. I singoli patogeni continuano a non essere mai mostrati a nessuno.

## Trovare qualcuno

- Filtri di ricerca: "Cosa cerchi" (incontri / concepimento / concepimento poliandrico / test STD), "Chi cerchi" (uomini, donne, coppie), menu a cascata paese → città, "posso arrivare al tuo paese" con elenchi per singolo paese, colore della pelle, preferenza di test, solo compatibilità STD.
- Procedura guidata di onboarding: età (nascondibile), lingue, bio, foto.
- **Chat P2P** su libp2p (gossipsub) + Nostr, con fallback su API HTTP.

## Concepimento

Due modi per pianificare un figlio, entrambi fondati sulla stessa idea: l'intenzione vera si dimostra con una posta reale in EVOLVE — mai con promesse. L'impegno di un uomo vive nel suo deposito su EvolveFund (da 15 EVOLVE, bloccato per almeno 30 giorni), e una donna può fissare il proprio deposito minimo per gli uomini che la raggiungono.

**Concepimento.** È la donna a condurre: invita un uomo specifico e lo indica in un bond. A lui serve un deposito attivo su EvolveFund; quando entrambi confermano, il deposito viene bloccato e parte il conto alla rovescia. La gravidanza viene dichiarata tra 14 e 30 giorni dalla conferma, e i test STD e DNA della coppia vengono eseguiti all'incontro stesso — contano i risultati STD recenti, il DNA non invecchia. Una volta confermata la paternità, il deposito dell'uomo passa alla donna; se non è confermata, il deposito viene semplicemente rilasciato a lui. Nulla cambia di mano finché i fatti non sono accertati.

**Concepimento poliandrico.** La scelta appartiene a lei, e resta privata. Apre una sessione della durata di 48 ore — senza un deposito proprio (può aggiungerne uno solo per reputazione, se vuole). Gli uomini con un deposito attivo possono partecipare — fino a 50 — e confermare, il che blocca la loro posta. Quattordici giorni dopo la chiusura della sessione viene scelto il padre. Lui riottiene il suo deposito più una ricompensa dal pool: il doppio del suo deposito e 1 EVOLVE per ogni altro partecipante. Gli uomini non scelti perdono la loro posta — il 90% alla donna, il 10% al padre scelto. Lei non rischia nulla e può solo guadagnare; gli uomini mettono la propria posta dietro il diritto di essere scelti.

## Privacy e transazioni riservate

La privacy è l'impostazione predefinita — ed EVOLVE sta costruendo una roadmap verso trasferimenti on-chain completamente riservati.

- **Regali privati** — invia una rosa 🌹 o un cactus 🌵 (1 EVOLVE) e scegli chi può vedere che sei stato tu: _pubblico_, _anonimo per tutti tranne il destinatario_ o _completamente anonimo_. Nelle modalità anonime il regalo viaggia come voucher monouso che il destinatario riscatta con il proprio wallet, così il mittente non appare mai on-chain. (L'anonimato del mittente oggi è di livello base: la transazione di finanziamento può essere correlata per orario e importo.)
- **Wallet schermato Railgun** — un wallet privato attivato tramite feature flag (`VITE_RAILGUN_ENABLED`, disattivato per impostazione predefinita) che nasconde importi e indirizzi usando il pool zero-knowledge live di Railgun. Questo è il percorso verso il vero anonimato del mittente.
- **Prototipo Aztec** — la stessa logica di trasferimento privato e di bond privato, espressa come circuiti Noir zero-knowledge e tenuta dietro un gate esplicito finché Aztec non sarà pronto per la produzione. Vedi [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md).
- **Modello a due wallet** — un wallet pubblico di partecipazione prende parte alla governance; un wallet privato schermato è deliberatamente **escluso** dal peso di governance, tenendo separati privacy e potere di voto.

Dettagli: [docs/RAILGUN-INTEGRATION.md](docs/RAILGUN-INTEGRATION.md) · [docs/SHIELDED-STAKES-DESIGN.md](docs/SHIELDED-STAKES-DESIGN.md) · [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md).

## Il token EVOLVE (solo testnet)

- ERC-20, offerta massima di **8,000,000,000 EVOLVE**. Le azioni amministrative sono soggette a un `TimelockController` di 48 ore.
- **Ripartizione prevista dell'offerta** — pensata per mettere al lavoro quasi tutta l'offerta a favore degli utenti, non degli insider:

| Scopo                                                   |        EVOLVE |
| ------------------------------------------------------- | ------------: |
| Fondatori e team (stipendio / ricompensa)               |    25,000,000 |
| Riserva DEX (futura)                                    |     4,000,000 |
| Vendita pubblica (prevista)                             |     5,000,000 |
| Riserva ricompense — laboratori, pazienti, madri, padri | 7,966,000,000 |

- **Vendita pubblica prevista** — 5,000,000 EVOLVE venduti dall'app a **$0.8 ciascuno**, pagabili in qualsiasi token supportato dall'app; i proventi finanziano lo sviluppo. _(Prevista — non ancora attiva.)_
- **Emissione trustless (prevista)** — la riserva di ricompense di ~7,966,000,000 EVOLVE sarà bloccata in un `RewardVault` non svuotabile: rilasciata solo gradualmente tramite ricompense a laboratori, pazienti, madri e padri, con le modifiche alle regole che richiedono una votazione di governance. Nemmeno il fondatore può prelevarla. Design: [docs/REWARD-VAULT-PLAN.md](docs/REWARD-VAULT-PLAN.md).
- **Economia dei regali emoji** — un regalo costa 1 EVOLVE, ripartito proporzionalmente tra i proprietari di regali esistenti; un modello di ricavi perpetuo, e i regali sono trasferibili.
- **EvolveFund** — staking maschile (minimo 15 EVOLVE, blocco di 30 giorni) che conta ai fini del peso di governance; le donne usano il saldo del proprio wallet.
- **Ricompense di verifica** — 1 EVOLVE all'utente verificato e 1 EVOLVE al laboratorio che conferma per ogni verifica STD/DNA (più un faucet a frequenza limitata).
- **Governance** — il peso del voto combina reputazione ricorsiva (8 voti, profondità 3), quota di figli/paternità ed EVOLVE in staking o detenuti.
- Integrazione **LayerZero OFT** per i futuri trasferimenti multichain di EVOLVE (dipendenze pronte; nulla ancora distribuito oltre Sepolia).

## Sostieni il progetto

EVOLVE è indipendente e open-source. Se ti è utile, puoi sostenere lo sviluppo con una donazione — ogni contributo va al codice, alle partnership con i laboratori, all'hosting e alla traduzione.

- **Dettagli sulle donazioni (EVM, Monero e altro):** [DONATE.md](DONATE.md)
- **Pagina di donazione multilingue (34 lingue):** **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**

Una vendita pubblica di token è **prevista** — 5,000,000 EVOLVE, venduti dall'app (vedi [Il token EVOLVE](#il-token-evolve-solo-testnet)). Le donazioni sono regali che sostengono lo sviluppo open-source e non danno diritto a token, quote, rendimenti o profitti. Dona solo ciò che puoi permetterti di perdere.

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

Smart contract principali: `EVOLVE.sol` (ERC-20), `ProfileNFT.sol` (ERC-721), `TrustScore.sol`, `Voting.sol`, `Evolve2Earn.sol` (regali emoji + ricompense), `Governance.sol`, `BondManager.sol` (concepimento e concepimento poliandrico), `EvolveFund.sol`, `VerificationRegistry.sol`, `DNAVerification.sol`, `SmartAccountFactory` + `Paymaster` ERC-4337 e un `TimelockController` di OpenZeppelin.

Dettagli: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md)

## Roadmap

In corso: la messa a punto dell'app web per la produzione. Previsto: registro dei laboratori on-chain e certificazione dei test, un vero adapter di provider mail per l'acquisizione dei referti di laboratorio, attestati verificati on-chain sui profili, il **RewardVault trustless** con emissione soggetta a governance ([design](docs/REWARD-VAULT-PLAN.md)), la **vendita pubblica di token**, l'aggiornamento del vesting dei token per l'allocazione dei fondatori e il provisioning di liquidità DEX (attualmente bloccato — richiede deploy del token su mainnet). Sul fronte privacy, i regali con mittente privato sono completati, mentre il wallet schermato Railgun e la migrazione dei bond privati su Aztec restano dietro i controlli descritti in [docs/ROADMAP.md](docs/ROADMAP.md) e [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md). L'espansione multi-rete (Arbitrum, Avalanche e altre chain EVM) seguirà dopo il consolidamento della testnet.

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

- [Cosa e Perché](docs/WHAT-AND-WHY.md) — problema, visione, valori fondamentali
- [Come funziona](docs/HOW-IT-WORKS.md) — flussi utente, passo per passo
- [Architettura](docs/ARCHITECTURE.md) — monorepo, package, flussi di dati
- [Tokenomics](docs/TOKENOMICS.md) — modello del token e distribuzione dell'offerta
- [Piano RewardVault](docs/REWARD-VAULT-PLAN.md) — emissione trustless (prevista)
- [Integrazione Railgun](docs/RAILGUN-INTEGRATION.md) — spike di integrazione del wallet schermato
- [Poste schermate](docs/SHIELDED-STAKES-DESIGN.md) — poste di concepimento private (design)
- [Prototipo Aztec](docs/AZTEC-PROTOTYPE.md) — trasferimenti e bond privati ZK (ricerca)
- [Roadmap](docs/ROADMAP.md) — traguardi e stato attuale
- [FAQ](docs/FAQ.md) — domande frequenti
- [Guida ai wallet](docs/WALLETS.md) — come creare wallet e ottenere gli indirizzi per le donazioni

## Licenza

Rilasciato nei termini della [Licenza MIT](LICENSE).

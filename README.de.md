[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)

# EVOLVE

**Dating, Empfängnis und Gesundheitsverifizierung — privat von Grund auf, verifiziert dort, wo es zählt.**

EVOLVE ist eine Open-Source-, dezentrale Plattform für verifizierbare intime Verbindungen: Dating, Empfängnis und anonyme STD/DNA-Kompatibilität. Du meldest dich mit deiner eigenen Krypto-Wallet an (Sign-In with Ethereum) — keine Telefonnummer, keine E-Mail, kein KYC — und kannst dein Konto über ein On-Chain-DNA-Commitment wiederherstellen. Gesundheitsdaten bleiben deine: Laborergebnisse werden automatisch ausgelesen, einzelne Pathogenstatus werden **niemals** irgendjemandem angezeigt, und das Matching stützt sich ausschließlich auf anonyme Kompatibilitätsurteile (Safe / Compatible / Caution / Risk). Der Chat läuft Peer-to-Peer über libp2p und Nostr, mit einem HTTP-Fallback zur Bequemlichkeit; zudem bringt die App eine schlanke öffentliche „Safety Mode“-Fassade sowie einen eigenständigen Companion Mode zur Auswertung von STD-Testergebnissen mit.

> **Status: frühe Alpha.** EVOLVE befindet sich in aktiver Entwicklung und ist kein fertiges Produkt.
> Smart Contracts sind **ausschließlich auf dem Ethereum-Sepolia-Testnet** deployed.
> Es gibt **kein Mainnet-Deployment, keinen DEX, keine Liquidität und keinen öffentlichen Tokenverkauf** — und nichts davon wird versprochen.
> Funktionen können sich jederzeit ändern oder brechen. Nichts hier ist Finanzberatung oder ein Investitionsangebot.

## Was & Warum

Herkömmliche Dating-Plattformen verlangen, dass du Telefonnummer, E-Mail, Fotos und intime Gesundheitsdetails an eine zentrale Datenbank übergibst. EVOLVE geht vom gegenteiligen Ansatz aus: Privatsphäre standardmäßig, Self-Custody und keine zentrale Fehlerquelle. Kernwerte:

- **Privatsphäre standardmäßig** — Gesundheitsdaten werden nie offengelegt; nur anonyme Urteile.
- **Ban-Resistenz** — P2P-first Messaging, dezentraler Speicher (IPFS / Arweave), Multi-Network-Design, keine hartcodierten Domains.
- **Self-Custodial-Identität** — deine Wallet ist dein Login; DNA-basierte Wiederherstellung statt E-Mail/Telefon.
- **Keine KYC-Hürde** — für die Nutzung der Plattform sind kein Ausweis, kein Telefon und keine E-Mail nötig.

Die vollständige Begründung findest du in [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md) (auf Englisch).

## Hauptfunktionen

### Identität & Privatsphäre

- **Wallet-Login per SIWE** (MetaMask und andere EVM-Wallets) — der zensurresistente Notausgang.
- **Kontowiederherstellung per DNA** — dein DNA-Testergebnis wird gehasht (SHA-256, on-chain als `bytes32` committet) und kann den Zugang ohne Telefon oder E-Mail wiederherstellen.
- **Account Abstraction (ERC-4337)** — Smart Accounts und ein Paymaster für gasloses Onboarding; SIWE bleibt immer verfügbar.

### Anonyme Gesundheitskompatibilität

- Upload von STD-Testergebnissen als Text oder PDF (Extraktion der Textebene mit OCR-Fallback für gescannte Seiten).
- Der Parser erkennt 8 Pathogene: HIV-1/2, Syphilis, Chlamydien, Gonorrhoe, HSV-1, HSV-2, Hepatitis B, Hepatitis C (Berichtsformate auf Englisch, Ukrainisch und Russisch).
- **Der einzelne Pathogenstatus wird anderen Nutzern niemals angezeigt.** Profile zeigen nur ein anonymes Urteil: **Safe / Compatible / Caution / Risk**.
- On-Chain-DNA-Verifizierungseinträge (`DNAVerification.sol`) bilden die Grundlage für Wiederherstellungs- und Verifizierungsabläufe.

### Profile, Suche & Kommunikation

- Suchfilter: „Was suchst du“ (Dating / Empfängnis / polyandre Empfängnis / STD-Tests), „Wen suchst du“ (Männer, Frauen, Paare), kaskadierende Land-→-Stadt-Auswahlen, „kann in dein Land reisen“ mit länderweisen Listen, Hautfarbe, Testpräferenz, nur STD-kompatible.
- Onboarding-Assistent: Alter (verbergbar), Sprachen, Bio, Foto.
- **Foto-Privatsphäre**: Fotos sind standardmäßig unscharf; der Eigentümer gewährt 15-sekündige oder dauerhafte Einblicke — auf Anfrage oder von sich aus. Das Ansehen ist kostenlos.
- **P2P-Chat** über libp2p (gossipsub) + Nostr, mit HTTP-API-Fallback.

### Empfängnismodi

- **Modus 2 — Pregnancy Bond**: Eine Frau erstellt einen Bond, ein Mann stakt EVOLVE (≥ 100 im aktuellen Testnet-Build), beide bestätigen; nach bestätigter Schwangerschaft und Vaterschaft geht der Stake an die Frau.
- **Modus 3 — Cryptic Choice**: Eine Frau eröffnet eine 48-stündige Session, Männer nehmen per Staking teil; sie wählt den Vater — sein Stake wird zurückgegeben, die übrigen teilen sich: 90 % an sie / 10 % an den gewählten Vater.

### Labore & Verifizierung

- **Partner-Flow für Labore**: Labore registrieren sich als Partner, verifizieren Patienten per QR-Code und Gesichtserkennung und hängen STD-Berichte an (PDF/Text mit OCR-Extraktion).
- **Companion Mode**: eigenständiger Ablauf zur Auswertung von STD-Testergebnissen ohne Anmeldung auf der Dating-Plattform.
- **Safety Mode** (`VITE_PRODUCT_MODE=safety`): eine begrenzte öffentliche Fassade (STD-Status, öffentliche Profil-Links, Kompatibilitätsprüfungen), die auch dann funktioniert, wenn Dating-/Empfängnisfunktionen in einer Rechtsordnung oder einem App-Store eingeschränkt werden.

### EVOLVE-Token (nur Testnet)

- ERC-20, Maximalmenge 8.000.000.000 EVOLVE, Admin-Aktionen an einen 48-stündigen TimelockController gebunden.
- **Emoji-Geschenkökonomie**: Ein Geschenk kostet 1 EVOLVE, das proportional unter den bestehenden Geschenkeigentümern aufgeteilt wird — ein unbefristetes Einnahmemodell für Halter; Geschenke sind übertragbar.
- **EvolveFund**: männliches Staking (mind. 15 EVOLVE, 30 Tage gesperrt), das in das Governance-Gewicht eingeht; Frauen nutzen ihren Wallet-Saldo.
- **Verifizierungsprämien**: 1 EVOLVE an den verifizierten Nutzer und 1 EVOLVE an das bestätigende Labor bei einer STD/DNA-Verifizierung (plus ein ratenlimitierter Test-Faucet).
- Das Governance-Stimmgewicht kombiniert rekursive Reputation (8 Stimmen, Tiefe 3), den Anteil an Kindern/Vaterschaften sowie gestakte oder gehaltene EVOLVE.
- **LayerZero-OFT**-Integration für künftige Multichain-Transfers von EVOLVE (Abhängigkeiten vorhanden; bislang außerhalb von Sepolia nichts deployt).

### Plattform

- Web-App (als PWA installierbar) und mobile App auf Expo/React Native.
- Oberfläche in **34 Sprachen** übersetzt.
- Multi-Network-fähig: 18 EVM-Netzwerkkonfigurationen (Arbitrum und Avalanche sind die geplanten primären L2s — **noch nicht deployt**).

## Architektur & Tech-Stack

Monorepo, verwaltet mit npm workspaces + Turborepo:

```
apps/
  web/          # Vite + React + TypeScript (Haupt-Web-App, i18next, Prisma)
  mobile/       # Expo + React Native
packages/
  config/       # Feature-Flags & dynamische Remote-Konfiguration
  contracts/    # Solidity 0.8.24, Hardhat, Ignition, OpenZeppelin, LayerZero
  core/         # Geteilte Typen, Utilities, Middleware, web3
  matching/     # Matching-Algorithmen, Filter, Ranking
  p2p/          # libp2p (gossipsub) + Nostr-Networking
  storage/      # IPFS, Arweave, Lit Protocol
docs/           # Architektur, Tokenomics, Roadmap, FAQ
```

Wichtige Smart Contracts: `EVOLVE.sol` (ERC-20), `ProfileNFT.sol` (ERC-721), `TrustScore.sol`, `Voting.sol`, `Evolve2Earn.sol` (Emoji-Geschenke + Prämien), `Governance.sol`, `BondManager.sol` (Modi 2 & 3), `EvolveFund.sol`, `VerificationRegistry.sol`, `DNAVerification.sol`, ERC-4337 `SmartAccountFactory` + `Paymaster` sowie ein OpenZeppelin-`TimelockController`.

Details: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md) (auf Englisch).

## Roadmap

In Arbeit: Produktionsreife der Web-App. Geplant: On-Chain-Laborregister und Testzertifizierung, echter Mail-Provider-Adapter für den Eingang von Laborberichten, On-Chain-verifizierte Attestierungen in Profilen, Update des Token-Vestings für Founder-/Entwickler-Allokationen, DEX-Liquiditätsausstattung (derzeit blockiert — erfordert Mainnet-Deployments des Tokens). Die Multi-Network-Erweiterung (Arbitrum, Avalanche und weitere EVM-Chains) folgt nach der Härtung im Testnet.

Vollständige Liste: [docs/ROADMAP.md](docs/ROADMAP.md) (auf Englisch).

## Erste Schritte (Entwickler)

Voraussetzungen: **Node.js 20+** und npm 10.x.

```bash
# Repository klonen und alle Workspaces installieren
git clone https://github.com/Lilit-Moonlit/Evolve.git
cd Evolve
npm install

# Web-App (Vite-Dev-Server auf http://localhost:3000)
cd apps/web
npm run dev
npm test                # vitest-Suite

# Smart Contracts
cd packages/contracts
npm run compile         # hardhat compile
npm test                # hardhat-Testsuite
npm run deploy:local    # alle Contracts in ein In-Process-Hardhat-Netz deployen
```

## Mitmachen

Beiträge sind willkommen — Code, Fehlerberichte, Funktionsvorschläge und Proposals. Lies vor dem Start [CONTRIBUTING.md](CONTRIBUTING.md) und unseren [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Das Projekt unterstützen

Wenn du EVOLVE nützlich findest, kannst du die Entwicklung mit einer Spende unterstützen — Details in [DONATE.md](DONATE.md). Lieber eine Webseite? Nutze die mehrsprachige Spendenseite (34 Sprachen): **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**.

**Es gibt keinen Tokenverkauf und es wird keinen geben.** In EVOLVE-Token kann man nicht „investieren“; Spenden sind Geschenke zur Unterstützung der Open-Source-Entwicklung und verleihen dem Spender keinen Anspruch auf Token, Eigenkapital, Renditen oder andere finanzielle Ansprüche.

## Repositories (Spiegel)

| Spiegel  | URL                                        |
| -------- | ------------------------------------------ |
| GitHub   | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg | https://codeberg.org/limitafternoon/Evolve |
| GitLab   | https://gitlab.com/evolve-group3/evolve    |

## Dokumentation

- [Was & Warum](docs/WHAT-AND-WHY.md) — Problem, Vision, Kernwerte (Englisch)
- [So funktioniert es](docs/HOW-IT-WORKS.md) — Nutzerabläufe, Schritt für Schritt (Englisch)
- [Architektur](docs/ARCHITECTURE.md) — Monorepo, Pakete, Datenflüsse (Englisch)
- [Tokenomics](docs/TOKENOMICS.md) — Tokenmodell und Verteilung des Angebots (Englisch)
- [Roadmap](docs/ROADMAP.md) — Meilensteine und aktueller Status (Englisch)
- [FAQ](docs/FAQ.md) — häufig gestellte Fragen (Englisch)
- [Wallet-Guide](docs/WALLETS.md) — Wallets anlegen und Spendenadressen erhalten (Englisch)

## Lizenz

Lizenziert unter der [MIT-Lizenz](LICENSE).

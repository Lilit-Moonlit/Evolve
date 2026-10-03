[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)

# EVOLVE

**Dating, Empfängnis und verifizierte Gesundheit — privat von Hause aus, Vertrauen dort, wo es zählt.**

EVOLVE ist eine open-source, dezentrale Plattform für Menschen, die es satt haben, ihre Telefonnummer, ihr Gesicht und ihre intimsten Gesundheitsdaten an die Datenbank von irgendjemandem sonst zu übergeben. Sie melden sich mit Ihrem eigenen Krypto-Wallet an — ohne Telefon, ohne E-Mail, ohne KYC — und Sie können Ihr Konto über ein On-Chain-DNA-Commitment zurückerhalten. Ihre Gesundheitsdaten bleiben Ihre: Testergebnisse werden automatisch geparst, individuelle Erregerstatus werden **niemals** irgendjemandem gezeigt, und das Matching stützt sich ausschließlich auf anonyme Kompatibilitätsurteile (Safe / Compatible / Caution / Risk). Der Chat läuft Peer-to-Peer über libp2p und Nostr, mit einem HTTP-Fallback zur Bequemlichkeit.

> **Status — die Plattform funktioniert heute; Mainnet und DEX sind die nächsten Schritte.**
> Dating, Empfängnis, Gesundheitsverifizierung, der Labor-Flow, P2P-Chat, der EVOLVE-Token und Governance laufen alle. Noch bevorstehend: ein **Mainnet-Deployment und DEX-Liquidität** sowie ein **geplanter öffentlicher Verkauf** (siehe [Der EVOLVE-Token](#der-evolve-token-nur-testnetz)).
> Die Smart Contracts sind **ausschließlich auf dem Ethereum-Sepolia-Testnet** deployt. Nichts hiervon ist eine Finanzberatung oder ein Investitionsangebot.

> **Finden Sie EVOLVE nützlich? Unterstützen Sie die Entwicklung — jede Spende fließt in Code, Labor-Partnerschaften, Hosting und Übersetzung → [DONATE.md](DONATE.md).**

## Nichts zu befürchten

EVOLVE wurde um die Fragen herum gebaut, die Menschen sich tatsächlich stellen, bevor sie einer solchen Plattform vertrauen.

| Die Sorge                                              | Was EVOLVE bereits dagegen unternimmt                                                                                                                                                                |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| „Meine Gesundheitsdaten werden leaken."                | Individuelle Erregerergebnisse werden **niemals** irgendjemandem gezeigt — nur ein anonymes Urteil: Safe / Compatible / Caution / Risk.                                                              |
| „Meine Fotos landen irgendwo."                         | Fotos sind standardmäßig unscharf. Der Eigentümer gewährt eine **15-sekündige** oder **permanente** Ansicht — auf Anfrage oder proaktiv. Das Ansehen ist kostenlos.                                  |
| „Ich muss Ausweis oder Telefon abgeben."               | Wallet-Login (SIWE). Kein Telefon, keine E-Mail, kein KYC. Die Wiederherstellung läuft über ein On-Chain-DNA-Commitment.                                                                             |
| „Er oder sie lügt über den Gesundheitszustand."        | Ergebnisse sind **laborverifiziert** (QR + Gesichtserkennung), und die Tests des Paares werden **beim Treffen selbst** abgenommen — frische STI-Ergebnisse zählen, DNA altert nicht.                 |
| „Nimmt jemand mein Geld und verschwindet?"             | Die Empfängnis läuft auf einen echten, gefährdeten Einsatz: Die Einlage eines Mannes bewegt sich nur, wenn die Vaterschaft **bestätigt** ist; andernfalls wird sie ihm einfach zurückgegeben.        |
| „Ist der Token ein Pump-and-Dump?"                     | Heute ist kein Verkauf live; der Code ist offen (MIT); die nicht in Umlauf gebrachte Reserve soll in einem **nicht leerbaren Vault** gesperrt werden, aus dem nicht einmal der Gründer abheben kann. |
| „Kann die Plattform abgeschaltet oder gebannt werden?" | Peer-to-Peer-Messaging zuerst, dezentraler Speicher (IPFS / Arweave), 18 EVM-Netzwerkkonfigurationen und keine fest codierte Domain.                                                                 |

## Was & Warum

Traditionelle Dating-Apps verlangen von Ihnen, Telefonnummer, E-Mail, Fotos und intime Gesundheitsdetails gegen eine zentrale Datenbank zu tauschen — und dieser Datenbank dann ewig zu vertrauen. EVOLVE beginnt mit der gegenteiligen Prämisse: **Privatsphäre standardmäßig, Self-Custody und kein Single Point of Failure**.

- **Privatsphäre standardmäßig** — Gesundheitsdaten werden nie offengelegt; nur anonyme Urteile.
- **Ban-Resistenz** — P2P-Messaging zuerst, dezentraler Speicher, Multi-Network-Design, keine fest codierten Domains.
- **Self-Custodial-Identität** — Ihr Wallet ist Ihr Login; DNA-basierte Wiederherstellung statt E-Mail oder Telefon.
- **Keine KYC-Hürde** — kein Lichtbildausweis, kein Telefon und keine E-Mail nötig, um die Plattform zu nutzen.

Die vollständige Begründung finden Sie in [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md).

## Gesundheit, der Sie wirklich vertrauen können

- Laden Sie einen STI-Test als Rohtext oder PDF hoch (Extraktion der Textebene, mit OCR-Fallback für Scans).
- Der Parser kennt 8 Erreger: HIV-1/2, Syphilis, Chlamydien, Gonorrhoe, HSV-1, HSV-2, Hepatitis B, Hepatitis C — in englischen, ukrainischen und russischen Berichtsformaten.
- **Der individuelle Erregerstatus wird anderen Nutzern niemals angezeigt.** Profile zeigen ausschließlich das anonyme Urteil: **Safe / Compatible / Caution / Risk**.
- On-Chain-DNA-Einträge (`DNAVerification.sol`) ermöglichen Wiederherstellung und Verifizierung.

### Partnerlabore — Beweise statt Versprechen

Betreten Sie ein Partnerlabor und zeigen Sie Ihren QR-Code. Das Labor scannt ihn, bestätigt Ihre Identität per **Gesichtsabgleich** (damit niemand sonst Ihr Ergebnis abholen kann) und hängt den STI-Bericht an — PDF, Scan oder Text, sogar mit schlechtem OCR. Das Ergebnis wird von einem echten Labor signiert, nicht von Ihnen selbst, sodass andere einen **verifizierten Fakt** sehen statt Ihres Wortes. Und jede bestätigte Verifizierung zahlt **1 EVOLVE an den Patienten und 1 EVOLVE an das Labor** — beide Seiten haben einen Grund, ehrlich zu sein. Individuelle Erreger werden auch dann niemals irgendjemandem gezeigt.

## Jemanden finden

- Suchfilter: „Was suchen Sie" (Dating / Empfängnis / polyandre Empfängnis / STI-Tests), „Wen suchen Sie" (Männer, Frauen, Paare), kaskadierende Auswahllisten Land → Stadt, „kann in Ihr Land reisen" mit länderweisen Listen, Hautfarbe, Testpräferenz, nur STI-kompatibel.
- Onboarding-Assistent: Alter (verbergbar), Sprachen, Bio, Foto.
- **P2P-Chat** über libp2p (gossipsub) + Nostr, mit HTTP-API-Fallback.

## Empfängnis

Zwei Wege, ein Kind zu planen — und beide beruhen auf derselben Idee: Wahre Absicht zeigt sich in einem echten Einsatz in EVOLVE, niemals in Versprechen. Das Engagement eines Mannes lebt in seiner EvolveFund-Einlage (ab 15 EVOLVE, mindestens 30 Tage gesperrt), und eine Frau kann ihre eigene Mindesteinlage für die Männer festlegen, die sie erreichen.

**Empfängnis.** Die Frau führt: Sie lädt einen bestimmten Mann ein und benennt ihn in einem Bond. Er benötigt eine aktive EvolveFund-Einlage; wenn beide bestätigen, wird sie gesperrt und der Countdown beginnt. Über eine Schwangerschaft wird 14 bis 30 Tage nach der Bestätigung gemeldet, und die STI- und DNA-Tests des Paares werden beim Treffen selbst abgenommen — frische STI-Ergebnisse zählen, DNA altert nicht. Sobald die Vaterschaft bestätigt ist, geht die Einlage des Mannes an die Frau; wird sie nicht bestätigt, wird die Einlage einfach an ihn zurückgegeben. Nichts wechselt den Besitzer, bevor die Fakten geklärt sind.

**Polyandre Empfängnis.** Die Wahl gehört ihr — und bleibt privat. Sie eröffnet eine Sitzung, die 48 Stunden läuft, ohne eigene Einlage (nur für die Reputation darf sie eine hinzufügen, wenn sie möchte). Männer mit aktiver Einlage dürfen beitreten — bis zu 50 — und bestätigen, wodurch ihr Einsatz gesperrt wird. Vierzehn Tage nach dem Sitzungsschluss wird der Vater gewählt. Er erhält seine Einlage zurück plus eine Belohnung aus dem Pool: das Doppelte seiner Einlage und 1 EVOLVE für jeden anderen Teilnehmer. Die nicht gewählten Männer verlieren ihren Einsatz — 90 % an die Frau, 10 % an den gewählten Vater. Sie riskiert nichts und kann nur gewinnen; die Männer stellen ihren Einsatz hinter das Recht, gewählt zu werden.

## Der EVOLVE-Token (nur Testnetz)

- ERC-20, Maximalangebot **8,000,000,000 EVOLVE**. Admin-Aktionen sind durch einen 48-stündigen `TimelockController` begrenzt.
- **Geplante Allokation des Angebots** — so ausgelegt, dass nahezu das gesamte Angebot für die Nutzer arbeitet, nicht für Insider:

| Zweck                                                |        EVOLVE |
| ---------------------------------------------------- | ------------: |
| Gründer und Team (Gehalt / Belohnung)                |    25,000,000 |
| DEX-Reserve (Zukunft)                                |     4,000,000 |
| Öffentlicher Verkauf (geplant)                       |     5,000,000 |
| Belohnungsreserve — Labore, Patienten, Mütter, Väter | 7,966,000,000 |

- **Geplanter öffentlicher Verkauf** — 5,000,000 EVOLVE werden von der App zu **$0.8 pro Stück** verkauft, zahlbar in jedem Token, den die App unterstützt; der Erlös finanziert die Entwicklung. _(Geplant — noch nicht live.)_
- **Trustless-Emission (geplant)** — die Belohnungsreserve von ~7,966,000,000 soll in einem nicht leerbaren `RewardVault` gesperrt werden: Er wird ausschließlich schrittweise über Belohnungen für Labore, Patienten, Mütter und Väter freigegeben, und Regeländerungen erfordern eine Governance-Abstimmung. Nicht einmal der Gründer kann ihn abheben. Design: [docs/REWARD-VAULT-PLAN.md](docs/REWARD-VAULT-PLAN.md).
- **Emoji-Geschenkökonomie** — ein Geschenk kostet 1 EVOLVE, das proportional unter den bestehenden Geschenkeigentümern aufgeteilt wird; ein zeitlich unbegrenztes Erlösmodell, und Geschenke sind übertragbar.
- **EvolveFund** — männliches Staking (min. 15 EVOLVE, 30-tägige Sperre), das in das Governance-Gewicht eingeht; Frauen nutzen ihren Wallet-Saldo.
- **Verifizierungsbelohnungen** — 1 EVOLVE an den verifizierten Nutzer und 1 EVOLVE an das bestätigende Labor pro STI-/DNA-Verifizierung (plus ein ratenbegrenzter Faucet).
- **Governance** — das Stimmgewicht kombiniert rekursive Reputation (8 Stimmen, Tiefe 3), den Anteil an Kindern/Vaterschaft sowie gestakte oder gehaltene EVOLVE.
- **LayerZero-OFT**-Integration für künftige Multichain-Transfers von EVOLVE (Abhängigkeiten vorhanden; bisher wurde nichts außerhalb von Sepolia deployt).

## Das Projekt unterstützen

EVOLVE ist unabhängig und open-source. Wenn es Ihnen nützlich ist, können Sie die Entwicklung mit einer Spende unterstützen — jeder Beitrag fließt in Code, Labor-Partnerschaften, Hosting und Übersetzung.

- **Spendendetails (EVM, Monero und mehr):** [DONATE.md](DONATE.md)
- **Mehrsprachige Spendenseite (34 Sprachen):** **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**

Ein öffentlicher Token-Verkauf steht auf der Roadmap, ist heute aber **nicht** live. Spenden sind Geschenke, die die open-source-Entwicklung unterstützen und keinerlei Anspruch auf Tokens, Anteile, Rendite oder Gewinn geben. Bitte spenden Sie nur, was Sie verlieren können.

## Architektur & Tech-Stack

Monorepo, verwaltet mit npm workspaces + Turborepo:

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

Die wichtigsten Smart Contracts: `EVOLVE.sol` (ERC-20), `ProfileNFT.sol` (ERC-721), `TrustScore.sol`, `Voting.sol`, `Evolve2Earn.sol` (Emoji-Geschenke + Belohnungen), `Governance.sol`, `BondManager.sol` (Empfängnis und polyandre Empfängnis), `EvolveFund.sol`, `VerificationRegistry.sol`, `DNAVerification.sol`, ERC-4337 `SmartAccountFactory` + `Paymaster` sowie ein OpenZeppelin-`TimelockController`.

Details: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md)

## Roadmap

In Arbeit: Produktionsreife der Web-App. Geplant: ein On-Chain-Laborregister und Testzertifizierung, ein echter Mail-Provider-Adapter für den Empfang von Laborberichten, On-Chain-verifizierte Attestierungen in Profilen, der **trustless RewardVault** mit governance-gesteuerter Emission ([Design](docs/REWARD-VAULT-PLAN.md)), der **öffentliche Token-Verkauf**, ein Vesting-Update für die Gründerallokation sowie die Bereitstellung von DEX-Liquidität (derzeit blockiert — sie erfordert Mainnet-Deployments des Tokens). Die Multi-Network-Erweiterung (Arbitrum, Avalanche und weitere EVM-Netzwerke) folgt nach der Härtung des Testnets.

Vollständige Liste: [docs/ROADMAP.md](docs/ROADMAP.md).

## Erste Schritte (Entwickler)

Voraussetzungen: **Node.js 20+** und npm 10.x.

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

## Mitwirken

Beiträge sind willkommen — Code, Bug-Reports, Funktionsvorschläge und Proposals. Bitte lesen Sie vor dem Start [CONTRIBUTING.md](CONTRIBUTING.md) und unseren [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Repositorien (Spiegel)

| Spiegel  | URL                                        |
| -------- | ------------------------------------------ |
| GitHub   | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg | https://codeberg.org/limitafternoon/Evolve |
| GitLab   | https://gitlab.com/evolve-group3/evolve    |

## Dokumentation

- [Was & Warum](docs/WHAT-AND-WHY.md) — Problem, Vision, Kernwerte
- [So funktioniert es](docs/HOW-IT-WORKS.md) — Nutzerflüsse, Schritt für Schritt
- [Architektur](docs/ARCHITECTURE.md) — Monorepo, Pakete, Datenflüsse
- [Tokenomics](docs/TOKENOMICS.md) — Tokenmodell und Angebotsverteilung
- [RewardVault-Plan](docs/REWARD-VAULT-PLAN.md) — Trustless-Emission (geplant)
- [Roadmap](docs/ROADMAP.md) — Meilensteine und aktueller Status
- [FAQ](docs/FAQ.md) — häufig gestellte Fragen
- [Wallet-Guide](docs/WALLETS.md) — wie man Wallets erstellt und Spendenadressen erhält

## Lizenz

Lizenziert unter der [MIT-Lizenz](LICENSE).

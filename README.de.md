[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)
<!-- evolve-readme-sync: 3796750887b0bd65 -->

# EVOLVE

**Dating, Empfängnis und verifizierte Gesundheit — standardmäßig privat, vertrauenswürdig dort, wo es zählt.**

EVOLVE ist eine Open-Source-Plattform, die dezentral für Menschen gebaut ist, die es satt haben, ihre Telefonnummer, ihr Gesicht und ihre intimsten Gesundheitsdaten an die Datenbank von jemand anderem zu übergeben. Sie melden sich mit Ihrem eigenen Krypto-Wallet an — ohne Telefon, ohne E-Mail, ohne KYC — und Sie können Ihr Konto über ein On-Chain-DNA-Commitment zurückerhalten. Ihre Gesundheitsdaten bleiben Ihre: Testergebnisse werden automatisch geparst, individuelle Erregerstatus werden **niemals** irgendjemandem gezeigt, und das Matching stützt sich ausschließlich auf anonyme Kompatibilitätsurteile (Safe / Compatible / Caution / Risk). Der Chat läuft Peer-to-Peer über libp2p und Nostr, mit einem HTTP-Fallback für den Komfort. Geschenke und Überweisungen bewegen sich auf vollständige Vertraulichkeit zu: private Geschenke sind bereits live, und auf der Roadmap stehen eine Railgun-Shielded-Wallet und ein Aztec-Zero-Knowledge-Prototyp (siehe [Privatsphäre & vertrauliche Transaktionen](#privatsphäre--vertrauliche-transaktionen)).

> **Status — Demo-Modus, in aktiver Entwicklung.**
> Dating, Empfängnis, Gesundheitsverifizierung, der Labor-Flow, P2P-Chat, der EVOLVE-Token und Governance sind alle implementiert und laufen in einer **lokalen Demo** — die App ist **noch nicht öffentlich bereitgestellt**. Noch ausstehend: ein **Mainnet-Deployment und DEX-Liquidität** sowie ein **geplanter öffentlicher Verkauf** (siehe [Der EVOLVE-Token](#der-evolve-token-nur-testnetz)).
> Die Smart Contracts sind **ausschließlich auf dem Ethereum-Sepolia-Testnet** bereitgestellt. Nichts hiervon ist eine Finanzberatung oder ein Investitionsangebot.

> **Finden Sie EVOLVE nützlich? Unterstützen Sie die Entwicklung — jede Spende fließt in Code, Labor-Partnerschaften, Hosting und Übersetzung → [DONATE.md](DONATE.md).**

## Nichts zu befürchten

EVOLVE wurde um die Fragen herum gebaut, die Menschen tatsächlich stellen, bevor sie einer solchen Plattform vertrauen.

| Die Sorge                                               | Was EVOLVE bereits dagegen tut                                                                                                                                                                                                                |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| „Meine Gesundheitsdaten werden durchsickern."           | Individuelle Erregerergebnisse werden **niemals** jemandem gezeigt — nur ein anonymes Urteil: Safe / Compatible / Caution / Risk.                                                                                                             |
| „Meine Fotos landen irgendwo."                          | Fotos sind standardmäßig unscharf. Der Besitzer gewährt eine **15-sekündige** oder **dauerhafte** Ansicht — auf Anfrage oder proaktiv. Die Ansicht ist kostenlos.                                                                             |
| „Ich muss meinen Ausweis oder mein Telefon hergeben."   | Wallet-Login (SIWE). Kein Telefon, keine E-Mail, kein KYC. Die Wiederherstellung erfolgt über ein On-Chain-DNA-Commitment.                                                                                                                    |
| „Er oder sie lügt über den Gesundheitszustand."         | Die Ergebnisse sind **laborverifiziert** (QR + Gesichtsabgleich), und die Tests des Paares werden **beim Treffen** gemacht — aktuelle STD-Ergebnisse zählen, DNA altert nicht.                                                                |
| „Nimmt jemand mein Geld und verschwindet?"              | Die Empfängnis läuft auf einem echten, riskierten Einsatz: Der Einsatz eines Mannes bewegt sich nur, wenn die Vaterschaft **bestätigt** ist; andernfalls wird er ihm einfach zurückgegeben.                                                   |
| „Ist der Token ein Pump-and-Dump?"                      | Der Code ist offen (MIT); fast die gesamte Menge ist für Nutzerbelohnungen reserviert, und die nicht im Umlauf befindliche Reserve soll in einem **nicht-abziehbaren Tresor** gesperrt werden, aus dem nicht einmal der Gründer abheben kann. |
| „Kann die Plattform abgeschaltet oder verboten werden?" | Peer-to-Peer-Messaging zuerst, dezentrale Speicherung (IPFS / Arweave), 18 EVM-Netzwerkkonfigurationen und keine fest codierte Domain.                                                                                                        |

## Was & Warum

Traditionelle Dating-Apps verlangen, dass Sie Ihre Telefonnummer, E-Mail, Fotos und intimen Gesundheitsdetails gegen eine zentrale Datenbank eintauschen — und dieser Datenbank dann für immer vertrauen. EVOLVE geht von der gegenteiligen Prämisse aus: **Privatsphäre standardmäßig, Self-Custody und kein Single Point of Failure**.

- **Privatsphäre standardmäßig** — Gesundheitsdaten werden nie offengelegt; nur anonyme Urteile.
- **Ban-Resistenz** — P2P-first Messaging, dezentrale Speicherung, Multi-Network-Design, keine fest codierten Domains.
- **Self-Custody-Identität** — Ihr Wallet ist Ihr Login; DNA-basierte Wiederherstellung statt E-Mail oder Telefon.
- **Keine KYC-Schranke** — keine staatliche ID, kein Telefon und keine E-Mail sind für die Nutzung der Plattform erforderlich.

Die vollständige Begründung: [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md).

## Gesundheit, der Sie wirklich vertrauen können

- Laden Sie einen STD-Test als Rohtext oder PDF hoch (Text-Ebenen-Extraktion, mit OCR-Fallback für Scans).
- Der Parser kennt 8 Erreger: HIV-1/2, Syphilis, Chlamydien, Gonorrhö, HSV-1, HSV-2, Hepatitis B, Hepatitis C — in englischen, ukrainischen und russischen Berichtsformaten.
- **Der individuelle Erregerstatus wird anderen Nutzern nie angezeigt.** Profile zeigen immer nur das anonyme Urteil: **Safe / Compatible / Caution / Risk**.
- On-Chain-DNA-Datensätze (`DNAVerification.sol`) ermöglichen Wiederherstellung und Verifizierung.

### Partnerlabore — Beweis, nicht Versprechen

Gehen Sie in ein Partnerlabor und zeigen Sie Ihren QR-Code. Das Labor scannt ihn, bestätigt Ihre Identität per **Gesichtsabgleich** (damit niemand anderes Ihr Ergebnis abholen kann) und fügt den STD-Bericht an — PDF, Scan oder Text, selbst bei schlechtem OCR. Das Ergebnis wird von einem echten Labor signiert, nicht von Ihnen, daher sehen andere einen **verifizierten Fakt** statt Ihrer Worte. Und jede bestätigte Verifizierung zahlt **1 EVOLVE an den Patienten und 1 EVOLVE an das Labor** — beide Seiten haben einen Grund, ehrlich zu sein. Einzelne Erreger werden dennoch niemandem gezeigt.

## Jemanden finden

- Suchfilter: „Wonach suchen Sie" (Dating / Empfängnis / polyandrische Empfängnis / STD-Tests), „Wen suchen Sie" (Männer, Frauen, Paare), kaskadierende Auswahl Land → Stadt, „kann in Ihr Land reisen" mit Länderlisten, Hautfarbe, Testpräferenz, nur STD-kompatibel.
- Onboarding-Assistent: Alter (ausblendbar), Sprachen, Bio, Foto.
- **P2P-Chat** über libp2p (gossipsub) + Nostr, mit einem HTTP-API-Fallback.

## Empfängnis

Zwei Wege, ein Kind zu planen, und beide beruhen auf derselben Idee: Echte Absicht zeigt sich durch einen echten EVOLVE-Einsatz — niemals durch Versprechen. Die Verpflichtung eines Mannes liegt in seinem EvolveFund-Einsatz (ab 15 EVOLVE, für mindestens 30 Tage gesperrt), und eine Frau kann ihren eigenen Mindesteinsatz für die Männer festlegen, die sie erreichen.

**Empfängnis.** Die Frau führt: Sie lädt einen bestimmten Mann ein und nennt ihn in einem Bond. Er benötigt einen aktiven EvolveFund-Einsatz; wenn beide bestätigen, wird dieser gesperrt und der Countdown startet. Die Schwangerschaft wird zwischen 14 und 30 Tagen nach der Bestätigung gemeldet, und die STD- und DNA-Tests des Paares werden beim Treffen selbst gemacht — aktuelle STD-Ergebnisse zählen, DNA altert nicht. Sobald die Vaterschaft bestätigt ist, geht der Einsatz des Mannes an die Frau über; falls nicht, wird der Einsatz einfach an ihn zurückgegeben. Nichts wechselt den Besitzer, bis die Fakten geklärt sind.

**Polyandrische Empfängnis.** Die Wahl gehört ihr und bleibt privat. Sie eröffnet eine Sitzung über 48 Stunden — ohne eigenen Einsatz (sie kann nur für Reputation einen hinzufügen, wenn sie möchte). Männer mit aktivem Einsatz können beitreten — bis zu 50 — und bestätigen, was ihren Einsatz sperrt. Vierzehn Tage nach Sitzungsende wird der Vater gewählt. Er erhält seinen Einsatz zurück plus eine Belohnung aus dem Pool: das Doppelte seines Einsatzes und 1 EVOLVE für jeden anderen Teilnehmer. Die nicht gewählten Männer verlieren ihren Einsatz — 90 % an die Frau, 10 % an den gewählten Vater. Sie riskiert nichts und kann nur gewinnen; die Männer setzen ihren Einsatz für das Recht, gewählt zu werden.

## Privatsphäre & vertrauliche Transaktionen

Privatsphäre ist der Standard — und EVOLVE baut eine Roadmap hin zu vollständig vertraulichen On-Chain-Überweisungen.

- **Private Geschenke** — senden Sie eine Rose 🌹 oder einen Kaktus 🌵 (1 EVOLVE) und wählen Sie, wer sehen kann, dass Sie es waren: _öffentlich_, _anonym für alle außer dem Empfänger_ oder _vollständig anonym_. In den anonymen Modi reist das Geschenk als Einmal-Voucher, den der Empfänger mit seinem eigenen Wallet einlöst, sodass der Absender nie auf der Chain erscheint. (Die Absender-Anonymität ist heute nur alltagsnah: Die Finanzierungstransaktion kann nach Zeit und Betrag korreliert werden.)
- **Railgun-Shielded-Wallet** — eine per Feature-Flag gesteuerte private Wallet (`VITE_RAILGUN_ENABLED`, standardmäßig aus), die Beträge und Adressen über den Live-Zero-Knowledge-Pool von Railgun verbirgt. Dies ist der Weg zu echter Absender-Anonymität.
- **Aztec-Prototyp** — dieselbe Logik für private Überweisungen und private Bonds, ausgedrückt als Zero-Knowledge-Noir-Schaltungen und hinter einer expliziten Hürde gehalten, bis Aztec produktionsreif ist. Siehe [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md).
- **Zwei-Wallet-Modell** — eine öffentliche Stake-Wallet nimmt an der Governance teil; eine private Shielded-Wallet ist bewusst von der **Stimmgewichtung ausgeschlossen**, sodass Privatsphäre und Stimmkraft getrennt bleiben.

Details: [docs/RAILGUN-INTEGRATION.md](docs/RAILGUN-INTEGRATION.md) · [docs/SHIELDED-STAKES-DESIGN.md](docs/SHIELDED-STAKES-DESIGN.md) · [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md).

## Der EVOLVE-Token (nur Testnetz)

- ERC-20, maximale Menge **8.000.000.000 EVOLVE**. Admin-Aktionen sind durch einen 48-Stunden-`TimelockController` abgesichert.
- **Geplante Verteilung** — darauf ausgelegt, fast die gesamte Menge für Nutzer arbeiten zu lassen, nicht für Insider:

| Zweck                                                |        EVOLVE |
| ---------------------------------------------------- | ------------: |
| Gründer und Team (Gehalt / Belohnung)                |    25.000.000 |
| DEX-Reserve (zukünftig)                              |     4.000.000 |
| Öffentlicher Verkauf (geplant)                       |     5.000.000 |
| Belohnungsreserve — Labore, Patienten, Mütter, Väter | 7.966.000.000 |

- **Geplanter öffentlicher Verkauf** — 5.000.000 EVOLVE, verkauft von der App zu **je 0,8 $**, zahlbar in jedem von der App unterstützten Token; die Erlöse finanzieren die Entwicklung. _(Geplant — noch nicht live.)_
- **Trustless-Emission (geplant)** — die Belohnungsreserve von ~7.966.000.000 soll in einem nicht-abziehbaren `RewardVault` gesperrt werden: Sie wird nur schrittweise über Labor-, Patienten-, Mutter- und Vater-Belohnungen freigegeben, und Regeländerungen erfordern eine Governance-Abstimmung. Nicht einmal der Gründer kann sie abheben. Design: [docs/REWARD-VAULT-PLAN.md](docs/REWARD-VAULT-PLAN.md).
- **Emoji-Geschenkökonomie** — ein Geschenk kostet 1 EVOLVE und wird proportional unter den bestehenden Geschenkbesitzern aufgeteilt; ein unbefristetes Umsatzmodell, und Geschenke sind übertragbar.
- **EvolveFund** — männliches Staking (mind. 15 EVOLVE, 30-Tage-Sperre), das in die Governance-Gewichtung einfließt; Frauen nutzen ihr Wallet-Guthaben.
- **Verifizierungsbelohnungen** — 1 EVOLVE an den verifizierten Nutzer und 1 EVOLVE an das bestätigende Labor pro STD/DNA-Verifizierung (plus ein ratenlimitierter Faucet).
- **Governance** — die Stimmgewichtung kombiniert rekursive Reputation (8 Stimmen, Tiefe 3), den Anteil an Kindern/Vaterschaft sowie gestakte oder gehaltene EVOLVE.
- **LayerZero-OFT**-Integration für zukünftige Multichain-EVOLVE-Überweisungen (Abhängigkeiten vorhanden; bislang nur auf Sepolia bereitgestellt).

## Unterstützen Sie das Projekt

EVOLVE ist unabhängig und quelloffen. Wenn es Ihnen nützlich ist, können Sie die Entwicklung mit einer Spende unterstützen — jeder Beitrag fließt in Code, Laborpartnerschaften, Hosting und Übersetzung.

- **Spendendetails (EVM, Monero und mehr):** [DONATE.md](DONATE.md)
- **Mehrsprachige Spendenseite (34 Sprachen):** **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**

Ein öffentlicher Token-Verkauf ist **geplant** — 5.000.000 EVOLVE, verkauft von der App (siehe [Der EVOLVE-Token](#der-evolve-token-nur-testnetz)). Spenden sind Geschenke, die die Open-Source-Entwicklung unterstützen und keinen Anspruch auf Token, Eigenkapital, Rendite oder Gewinn begründen. Bitte geben Sie nur, was Sie sich leisten können zu verlieren.

## Architektur & Tech-Stack

Monorepo, verwaltet mit npm workspaces + Turborepo:

```
apps/
  web/          # Vite + React + TypeScript (Haupt-Web-App, i18next, Prisma)
  mobile/       # Expo + React Native
packages/
  config/       # Feature-Flags & dynamische Remote-Konfiguration
  contracts/    # Solidity 0.8.24, Hardhat, Ignition, OpenZeppelin, LayerZero
  core/         # Gemeinsame Typen, Utilities, Middleware, Web3
  matching/     # Matching-Algorithmen, Filter, Ranking
  p2p/          # libp2p (gossipsub) + Nostr-Netzwerk
  storage/      # IPFS, Arweave, Lit Protocol
docs/           # Architektur, Tokenomics, Roadmap, FAQ
```

Wichtige Smart Contracts: `EVOLVE.sol` (ERC-20), `ProfileNFT.sol` (ERC-721), `TrustScore.sol`, `Voting.sol`, `Evolve2Earn.sol` (Emoji-Geschenke + Belohnungen), `Governance.sol`, `BondManager.sol` (Empfängnis und polyandrische Empfängnis), `EvolveFund.sol`, `VerificationRegistry.sol`, `DNAVerification.sol`, ERC-4337 `SmartAccountFactory` + `Paymaster` sowie ein OpenZeppelin-`TimelockController`.

Details: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md)

## Roadmap

In Arbeit: Produktionsreife der Web-App. Geplant: On-Chain-Laborregister und Testzertifizierung, ein echter Mail-Provider-Adapter für die Erfassung von Laborberichten, On-Chain-verifizierte Attestierungen auf Profilen, der **trustless `RewardVault`** mit Governance-gesteuerter Emission ([Design](docs/REWARD-VAULT-PLAN.md)), der **öffentliche Token-Verkauf**, ein Update des Token-Vestings für die Gründerallokation sowie DEX-Liquiditätsbereitstellung (derzeit blockiert — erfordert Mainnet-Token-Deployments). Auf der Privatsphäre-Seite sind private Geschenke fertig, während die Railgun-Shielded-Wallet und die Aztec-Private-Bond-Migration hinter den Prüfungen in [docs/ROADMAP.md](docs/ROADMAP.md) und [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md) bleiben. Die Multi-Network-Erweiterung (Arbitrum, Avalanche und andere EVM-Chains) folgt nach der Testnet-Härtung.

Vollständige Liste: [docs/ROADMAP.md](docs/ROADMAP.md).

## Erste Schritte (Entwickler)

Voraussetzungen: **Node.js 20+** und npm 10.x.

```bash
# Klonen und alle Workspaces installieren
git clone https://github.com/Lilit-Moonlit/Evolve.git
cd Evolve
npm install

# Web-App (Vite-Dev-Server unter http://localhost:3000)
cd apps/web
npm run dev
npm test                # vitest-Suite

# Smart Contracts
cd packages/contracts
npm run compile         # hardhat compile
npm test                # hardhat-Testsuite
npm run deploy:local    # alle Contracts in einem In-Process-Hardhat-Netzwerk bereitstellen
```

## Mitwirken

Beiträge sind willkommen — Code, Fehlerberichte, Funktionsvorschläge und Ideen. Bitte lesen Sie [CONTRIBUTING.md](CONTRIBUTING.md) und unseren [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md), bevor Sie beginnen.

## Repositories (Spiegel)

| Spiegel  | URL                                        |
| -------- | ------------------------------------------ |
| GitHub   | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg | https://codeberg.org/limitafternoon/Evolve |
| GitLab   | https://gitlab.com/evolve-group3/evolve    |

## Dokumentation

- [Was & Warum](docs/WHAT-AND-WHY.md) — Problem, Vision, Kernwerte
- [So funktioniert es](docs/HOW-IT-WORKS.md) — Nutzerflüsse, Schritt für Schritt
- [Architektur](docs/ARCHITECTURE.md) — Monorepo, Pakete, Datenflüsse
- [Tokenomics](docs/TOKENOMICS.md) — Tokenmodell und Verteilung
- [RewardVault-Plan](docs/REWARD-VAULT-PLAN.md) — Trustless-Emission (geplant)
- [Railgun-Integration](docs/RAILGUN-INTEGRATION.md) — Spike zur Shielded-Wallet-Integration
- [Shielded Stakes](docs/SHIELDED-STAKES-DESIGN.md) — private Empfängnis-Einsätze (Design)
- [Aztec-Prototyp](docs/AZTEC-PROTOTYPE.md) — ZK-private Überweisungen & Bonds (Forschung)
- [Roadmap](docs/ROADMAP.md) — Meilensteine und aktueller Stand
- [FAQ](docs/FAQ.md) — häufig gestellte Fragen
- [Wallet-Leitfaden](docs/WALLETS.md) — wie man Wallets erstellt und Spendenadressen erhält

## Lizenz

Lizenziert unter der [MIT License](LICENSE).

[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)

# EVOLVE

**Randki, poczęcie i weryfikacja zdrowia — prywatność domyślnie, weryfikacja tam, gdzie się liczy.**

EVOLVE to otwartoźródłowa, zdecentralizowana platforma weryfikowalnych intymnych znajomości: randki, poczęcie i anonimowa kompatybilność STD/DNA. Logujesz się własnym portfelem kryptowalutowym (Sign-In with Ethereum) — bez numeru telefonu, bez e-maila, bez KYC — a dostęp do konta możesz odzyskać dzięki on-chain zobowiązaniu DNA. Dane o zdrowiu pozostają Twoje: wyniki badań są parsowane automatycznie, indywidualne statusy patogenów **nigdy** nie są nikomu pokazywane, a dobieranie opiera się wyłącznie na anonimowych werdyktach kompatybilności (Safe / Compatible / Caution / Risk). Czat działa peer-to-peer przez libp2p i Nostr (z awaryjnym HTTP dla wygody), a aplikacja ma lekką publiczną fasadę „Safety Mode” oraz samodzielny Companion Mode do oceny wyników testów STD.

> **Status: wczesna alfa.** EVOLVE jest aktywnie rozwijany i nie jest gotowym produktem.
> Kontrakty inteligentne są wdrożone **wyłącznie w testowej sieci Ethereum Sepolia**.
> **Nie ma wdrożenia na mainnecie, DEX-a, płynności ani publicznej sprzedaży tokenów** — i niczego takiego nie obiecujemy.
> Funkcje mogą się w każdej chwili zmieniać lub psuć. Nic tutaj nie jest poradą finansową ani ofertą inwestycyjną.

## Co i dlaczego

Tradycyjne platformy randkowe wymagają oddania numeru telefonu, e-maila, zdjęć i intymnych szczegółów zdrowia do centralnej bazy danych. EVOLVE wychodzi z odwrotnego założenia: prywatność domyślnie, samodzielne przechowywanie (self-custody) i brak centralnego punktu awarii. Kluczowe wartości:

- **Prywatność domyślnie** — dane o zdrowiu nigdy nie są ujawniane; tylko anonimowe werdykty.
- **Odporność na bany** — komunikacja przede wszystkim P2P, zdecentralizowana pamięć (IPFS / Arweave), wielosieciowy projekt, bez zahardkodowanych domen.
- **Tożsamość self-custody** — Twój portfel to Twój login; odzyskiwanie przez DNA zamiast e-maila/telefonu.
- **Bez bramki KYC** — do korzystania z platformy nie są wymagane dokument tożsamości, telefon ani e-mail.

Pełne uzasadnienie: [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md).

## Najważniejsze funkcje

### Tożsamość i prywatność

- **Logowanie portfelem SIWE** (MetaMask i inne portfele EVM) — odporna na cenzurę ścieżka awaryjna.
- **Odzyskiwanie konta przez DNA** — wynik testu DNA jest haszowany (SHA-256, on-chain zobowiązanie jako `bytes32`) i może przywrócić dostęp bez telefonu i e-maila.
- **Abstrakcja konta (ERC-4337)** — inteligentne konta i paymaster do onboardingu bez opłat za gas; SIWE pozostaje zawsze dostępne.

### Anonimowa kompatybilność zdrowotna

- Przesyłanie wyników testów STD jako zwykły tekst lub PDF (ekstrakcja warstwy tekstowej z awaryjnym OCR dla stron skanowanych).
- Parser rozpoznaje 8 patogenów: HIV-1/2, kiła, chlamydioza, rzeżączka, HSV-1, HSV-2, wirusowe zapalenie wątroby typu B, wirusowe zapalenie wątroby typu C (formaty raportów w języku angielskim, ukraińskim i rosyjskim).
- **Indywidualny status patogenów nigdy nie jest wyświetlany innym użytkownikom.** Profile pokazują wyłącznie anonimowy werdykt: **Safe / Compatible / Caution / Risk**.
- Rejestry weryfikacji DNA on-chain (`DNAVerification.sol`) napędzają przepływy odzyskiwania i weryfikacji.

### Profile, wyszukiwanie i komunikacja

- Filtry wyszukiwania: „Czego szukasz” (randki / poczęcie / poczęcie poliandryczne / testy STD), „Kogo szukasz” (mężczyźni, kobiety, pary), kaskadowe wybory kraj → miasto, „może przyjechać do Twojego kraju” z listami dla poszczególnych krajów, kolor skóry, preferencja testowania, tylko kompatybilni STD.
- Kreator onboardingu: wiek (można ukryć), języki, bio, zdjęcie.
- **Prywatność zdjęć**: zdjęcia są domyślnie rozmyte; właściciel udziela 15-sekundowych lub trwałych podglądów — proaktywnie lub na prośbę. Oglądanie jest darmowe.
- **Czat P2P** przez libp2p (gossipsub) + Nostr, z awaryjnym HTTP API.

### Tryby poczęcia

- **Tryb 2 — Pregnancy Bond**: kobieta tworzy bond, mężczyzna stakuje EVOLVE (≥ 100 w obecnej wersji testnetowej), oboje potwierdzają; po potwierdzonej ciąży i ojcostwie stake przechodzi na kobietę.
- **Tryb 3 — Cryptic Choice**: kobieta otwiera 48-godzinną sesję, mężczyźni dołączają przez stake; ona wybiera ojca — jego stake jest zwracany, u pozostałych kwota dzieli się: 90% dla niej / 10% dla wybranego ojca.

### Laboratoria i weryfikacja

- **Przepływ laboratoriów-partnerów**: laboratoria rejestrują się jako partnerzy, weryfikują pacjentów przez kod QR i dopasowanie twarzy, dołączają raporty STD (PDF/tekst z ekstrakcją OCR).
- **Companion Mode**: samodzielny przepływ do oceny wyników testów STD bez dołączania do platformy randkowej.
- **Safety Mode** (`VITE_PRODUCT_MODE=safety`): ograniczona publiczna fasada (status STD, publiczne linki profili, sprawdzenia kompatybilności), która działa nawet wtedy, gdy funkcje randkowe/poczęciowe zostaną ograniczone w jakiejś jurysdykcji albo sklepie z aplikacjami.

### Token EVOLVE (tylko sieć testowa)

- ERC-20, maksymalna podaż 8 000 000 000 EVOLVE, akcje administracyjne chronione 48-godzinnym TimelockController.
- **Ekonomia prezentów emoji**: prezent kosztuje 1 EVOLVE, który dzieli się proporcjonalnie między istniejących właścicieli prezentów — bezterminowy model przychodowy dla posiadaczy; prezenty są zbywalne.
- **EvolveFund**: męski staking (min 15 EVOLVE, blokada 30 dni) liczący się do wagi głosu w governance; kobiety używają salda portfela.
- **Nagrody za weryfikację**: 1 EVOLVE dla zweryfikowanego użytkownika i 1 EVOLVE dla potwierdzającego laboratorium przy weryfikacji STD/DNA (plus limitowany testowy faucet).
- Waga głosu w governance łączy rekurencyjną reputację (8 głosów, głębokość 3), udział dzieci/ojcostwa oraz wystakowane lub po prostu trzymane EVOLVE.
- Integracja **LayerZero OFT** dla przyszłych wielołańcuchowych transferów EVOLVE (zależności gotowe; poza Sepolią nic jeszcze nie wdrożono).

### Platforma

- Aplikacja webowa (instalowalna jako PWA) i aplikacja mobilna Expo/React Native.
- Interfejs przetłumaczony na **34 języki**.
- Gotowość wielosieciowa: 18 konfiguracji sieci EVM (Arbitrum i Avalanche to planowane główne L2 — **jeszcze nie wdrożone**).

## Architektura i stack technologiczny

Monorepo zarządzane przez npm workspaces + Turborepo:

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

Kluczowe kontrakty inteligentne: `EVOLVE.sol` (ERC-20), `ProfileNFT.sol` (ERC-721), `TrustScore.sol`, `Voting.sol`, `Evolve2Earn.sol` (prezenty emoji + nagrody), `Governance.sol`, `BondManager.sol` (tryby 2 i 3), `EvolveFund.sol`, `VerificationRegistry.sol`, `DNAVerification.sol`, ERC-4337 `SmartAccountFactory` + `Paymaster` oraz `TimelockController` z OpenZeppelin.

Szczegóły: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md)

## Mapa drogowa

W toku: przygotowanie aplikacji webowej do produkcji. Planowane: on-chain rejestr laboratoriów i certyfikacja testów, adapter prawdziwego dostawcy poczty do pozyskiwania raportów laboratoryjnych, on-chain zweryfikowane atestacje w profilach, aktualizacja vestingu tokenów dla alokacji założycieli/programistów, zapewnienie płynności DEX (obecnie zablokowane — wymaga wdrożeń tokenu na mainnet). Ekspansja wielosieciowa (Arbitrum, Avalanche i inne sieci EVM) nastąpi po utwardzeniu sieci testowej.

Pełna lista: [docs/ROADMAP.md](docs/ROADMAP.md).

## Pierwsze kroki (dla programistów)

Wymagania: **Node.js 20+** i npm 10.x.

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

## Współpraca

Wkłady są mile widziane — kod, zgłoszenia błędów, propozycje funkcji i pomysły. Przed rozpoczęciem przeczytaj [CONTRIBUTING.md](CONTRIBUTING.md) oraz nasz [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Wesprzyj projekt

Jeśli EVOLVE jest dla Ciebie przydatny, możesz wesprzeć rozwój darowizną — szczegóły w [DONATE.md](DONATE.md). Wolisz stronę internetową? Skorzystaj z wielojęzycznej strony darowizn (34 języki): **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**.

**Sprzedaży tokenów nie ma i nie będzie.** W EVOLVE nie można „inwestować”; darowizny to prezenty na wsparcie rozwoju open-source i nie dają darczyńcy prawa do tokenów, udziałów, zwrotów ani jakichkolwiek roszczeń finansowych.

## Repozytoria (mirrory)

| Mirror   | URL                                        |
| -------- | ------------------------------------------ |
| GitHub   | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg | https://codeberg.org/limitafternoon/Evolve |
| GitLab   | https://gitlab.com/evolve-group3/evolve    |

## Dokumentacja

- [Co i dlaczego](docs/WHAT-AND-WHY.md) — problem, wizja, kluczowe wartości
- [Jak to działa](docs/HOW-IT-WORKS.md) — przepływy użytkownika, krok po kroku
- [Architektura](docs/ARCHITECTURE.md) — monorepo, pakiety, przepływy danych
- [Tokenomia](docs/TOKENOMICS.md) — model tokenu i rozkład podaży
- [Mapa drogowa](docs/ROADMAP.md) — kamienie milowe i aktualny status
- [FAQ](docs/FAQ.md) — częste pytania
- [Poradnik portfeli](docs/WALLETS.md) — jak założyć portfel i uzyskać adresy darowizn

## Licencja

Na licencji [MIT License](LICENSE).

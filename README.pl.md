[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)

# EVOLVE

**Randki, poczęcie dziecka i zweryfikowane zdrowie — prywatność domyślnie, zaufanie tam, gdzie naprawdę się liczy.**

EVOLVE to open-source'owa, zdecentralizowana platforma dla osób, które mają dość oddawania swojego numeru telefonu, swojej twarzy i swoich najbardziej intymnych danych zdrowotnych do bazy danych kogoś innego. Logujesz się własnym portfelem kryptowalutowym — bez telefonu, bez e-maila, bez KYC — a konto możesz odzyskać dzięki on-chain zobowiązaniu DNA. Twoje dane zdrowotne pozostają Twoje: wyniki testów są przetwarzane automatycznie, statusy poszczególnych patogenów **nigdy** nie są nikomu pokazywane, a dopasowanie opiera się wyłącznie na anonimowych werdyktach zgodności (Safe / Compatible / Caution / Risk). Czat działa peer-to-peer przez libp2p i Nostr, a dla wygody dostępny jest fallback HTTP.

> **Status — platforma działa już dziś; mainnet i DEX to kolejne kroki.**
> Randki, poczęcie, weryfikacja zdrowia, przepływ laboratoryjny, czat P2P, token EVOLVE i governance — wszystko to działa. Przed nami: **wdrożenie na mainnet i płynność DEX**, a także **planowana publiczna sprzedaż** (zob. [Token EVOLVE](#token-evolve-tylko-sieć-testowa)).
> Smart kontrakty są wdrożone **wyłącznie na testnecie Ethereum Sepolia**. Nic tutaj nie stanowi porady finansowej ani oferty inwestycyjnej.

> **Uważasz, że EVOLVE jest przydatne? Wesprzyj rozwój — każda darowizna trafia na kod, partnerstwa laboratoryjne, hosting i tłumaczenia → [DONATE.md](DONATE.md).**

## Nie ma się czego obawiać

EVOLVE powstało wokół pytań, które ludzie naprawdę zadają, zanim zaufają takiej platformie.

| Obawa                                                  | Co EVOLVE już dziś z tym robi                                                                                                                                                                       |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| „Moje dane zdrowotne wyciekną."                        | Statusy poszczególnych patogenów **nigdy** nie są nikomu pokazywane — tylko anonimowy werdykt: Safe / Compatible / Caution / Risk.                                                                  |
| „Moje zdjęcia gdzieś wylądują."                        | Zdjęcia są domyślnie rozmyte. Właściciel udziela wglądu **15-sekundowego** lub **stałego** — na prośbę lub z własnej inicjatywy. Wgląd jest bezpłatny.                                              |
| „Będę musiał oddać dowód lub telefon."                 | Logowanie portfelem (SIWE). Bez telefonu, bez e-maila, bez KYC. Odzyskiwanie konta działa przez on-chain zobowiązanie DNA.                                                                          |
| „On albo ona kłamie o stanie zdrowia."                 | Wyniki są **weryfikowane przez laboratorium** (QR + dopasowanie twarzy), a badania pary wykonywane są **podczas spotkania** — liczą się świeże wyniki STD, DNA się nie starzeje.                    |
| „Czy ktoś nie zabierze moich pieniędzy i nie zniknie?" | Poczęcie opiera się na realnym, obarczonym ryzykiem depozycie: depozyt mężczyzny zmienia właściciela dopiero, gdy ojcostwo zostanie **potwierdzone**; w przeciwnym razie po prostu wraca do niego.  |
| „Czy to token typu pump-and-dump?"                     | Dziś żadna sprzedaż nie jest aktywna; kod jest otwarty (MIT); niezobilizowana rezerwa ma zostać zablokowana w **sejfie, którego nie da się opróżnić** — nie może z niego wypłacić nawet założyciel. |
| „Czy platformę można zamknąć lub zablokować?"          | Komunikacja przede wszystkim peer-to-peer, zdecentralizowana pamięć masowa (IPFS / Arweave), 18 konfiguracji sieci EVM i brak zahardkodowanej domeny.                                               |

## Co i dlaczego

Tradycyjne aplikacje randkowe każą Ci wymienić numer telefonu, e-mail, zdjęcia i intymne szczegóły dotyczące zdrowia na dostęp do centralnej bazy danych — a potem ufać tej bazie w nieskończoność. EVOLVE wychodzi z przeciwnego założenia: **prywatność domyślnie, samodzielne przechowywanie (self-custody) i brak pojedynczego punktu awarii**.

- **Prywatność domyślnie** — dane zdrowotne nigdy nie są ujawniane; tylko anonimowe werdykty.
- **Odporność na bany** — komunikacja w pierwszej kolejności P2P, zdecentralizowana pamięć masowa, architektura wielosieciowa, brak zahardkodowanych domen.
- **Tożsamość self-custody** — Twój portfel to Twój login; odzyskiwanie oparte na DNA zamiast e-maila czy telefonu.
- **Brak bramki KYC** — do korzystania z platformy nie są wymagane dokument tożsamości, telefon ani e-mail.

Pełne uzasadnienie znajdziesz w [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md).

## Zdrowie, któremu naprawdę możesz zaufać

- Wgraj wynik testu STD jako zwykły tekst lub PDF (wyodrębnianie warstwy tekstowej, z fallbackiem OCR dla skanów).
- Parser zna 8 patogenów: HIV-1/2, kiła, chlamydie, rzeżączka, HSV-1, HSV-2, WZW typu B, WZW typu C — w formatach raportów anglojęzycznych, ukraińskich i rosyjskich.
- **Status poszczególnych patogenów nigdy nie jest wyświetlany innym użytkownikom.** Profile pokazują wyłącznie anonimowy werdykt: **Safe / Compatible / Caution / Risk**.
- Rekordy DNA w łańcuchu (`DNAVerification.sol`) umożliwiają odzyskiwanie i weryfikację.

### Laboratoria partnerskie — dowody zamiast obietnic

Wejdź do laboratorium partnerskiego i pokaż swój kod QR. Laboratorium skanuje go, potwierdza Twoją tożsamość przez **dopasowanie twarzy** (dzięki czemu nikt inny nie odbierze Twojego wyniku) i załącza raport STD — PDF, skan lub tekst, nawet ze słabym OCR. Wynik podpisuje prawdziwe laboratorium, a nie Ty, więc inni widzą **zweryfikowany fakt** zamiast Twojego słowa. A każda potwierdzona weryfikacja oznacza **1 EVOLVE dla pacjenta i 1 EVOLVE dla laboratorium** — obie strony mają powód, by postępować uczciwie. Poszczególne patogeny nadal nigdy nie są nikomu pokazywane.

## Szukanie kogoś

- Filtry wyszukiwania: „Czego szukasz" (randki / poczęcie / poczęcie poliandryczne / badania STD), „Kogo szukasz" (mężczyźni, kobiety, pary), kaskadowe wybory kraj → miasto, „może przyjechać do Twojego kraju" z listami dla poszczególnych krajów, kolor skóry, preferencje badań, tylko osoby zgodne pod względem STD.
- Kreator onboardingu: wiek (z możliwością ukrycia), języki, bio, zdjęcie.
- **Czat P2P** przez libp2p (gossipsub) + Nostr, z fallbackiem HTTP API.

## Poczęcie

Dwie drogi planowania dziecka — i obie opierają się na tej samej idei: prawdziwe intencje okazuje się realnym depozytem w EVOLVE, nigdy obietnicami. Deklaracja mężczyzny żyje w jego depozycie EvolveFund (od 15 EVOLVE, zablokowanym na co najmniej 30 dni), a kobieta może ustawić własny minimalny depozyt dla mężczyzn, którzy do niej trafią.

**Poczęcie.** Kobieta przewodzi: zaprasza konkretnego mężczyznę i wskazuje go w bondzie. On potrzebuje aktywnego depozytu EvolveFund; gdy oboje potwierdzą, zostaje on zablokowany i rusza odliczanie. O ciąży informuje się między 14. a 30. dniem po potwierdzeniu, a badania STD i DNA pary wykonywane są podczas samego spotkania — liczą się świeże wyniki STD, DNA się nie starzeje. Gdy ojcostwo zostanie potwierdzone, depozyt mężczyzny przechodzi na kobietę; jeśli nie zostanie potwierdzone, depozyt po prostu wraca do niego. Nic nie zmienia właściciela, dopóki fakty nie zostaną wyjaśnione.

**Poczęcie poliandryczne.** Wybór należy do niej — i pozostaje prywatny. Otwiera sesję trwającą 48 godzin — bez własnego depozytu (może go dodać wyłącznie dla reputacji, jeśli zechce). Mężczyźni z aktywnym depozytem mogą dołączyć — maksymalnie 50 — i potwierdzić, co blokuje ich udział. Czternaście dni po zamknięciu sesji wybierany jest ojciec. Odzyskuje on swój depozyt plus nagrodę z puli: dwukrotność swojego depozytu i 1 EVOLVE dla każdego pozostałego uczestnika. Mężczyźni, których nie wybrano, tracą swój udział — 90% trafia do kobiety, 10% do wybranego ojca. Ona nie ryzykuje niczego i może tylko zyskać; mężczyźni stawiają swój udział za prawo do bycia wybranym.

## Token EVOLVE (tylko sieć testowa)

- ERC-20, maksymalna podaż **8,000,000,000 EVOLVE**. Akcje administracyjne chroni 48-godzinny `TimelockController`.
- **Planowany podział podaży** — zaprojektowany tak, by niemal cała podaż pracowała na rzecz użytkowników, nie insiderów:

| Cel                                                    |        EVOLVE |
| ------------------------------------------------------ | ------------: |
| Założyciele i zespół (wynagrodzenie / nagroda)         |    25,000,000 |
| Rezerwa DEX (przyszłość)                               |     4,000,000 |
| Sprzedaż publiczna (planowana)                         |     5,000,000 |
| Rezerwa nagród — laboratoria, pacjenci, matki, ojcowie | 7,966,000,000 |

- **Planowana sprzedaż publiczna** — 5,000,000 EVOLVE sprzedawanych przez aplikację po **$0.8 za sztukę**, z możliwością zapłaty każdym tokenem obsługiwanym przez aplikację; przychód finansuje rozwój. _(Planowane — jeszcze nieaktywne.)_
- **Emisja trustless (planowana)** — rezerwa nagród ~7,966,000,000 ma zostać zablokowana w nienadającym się do opróżnienia `RewardVault`: uwalniana wyłącznie stopniowo, poprzez nagrody dla laboratoriów, pacjentów, matek i ojców, a zmiana zasad wymaga głosowania governance. Nie może z niej wypłacić nawet założyciel. Projekt: [docs/REWARD-VAULT-PLAN.md](docs/REWARD-VAULT-PLAN.md).
- **Ekonomia prezentów emoji** — prezent kosztuje 1 EVOLVE i dzielony jest proporcjonalnie między obecnych właścicieli prezentów; to wieczny model przychodowy, a prezenty są zbywalne.
- **EvolveFund** — męski staking (min. 15 EVOLVE, blokada 30 dni) liczony w wadze głosu governance; kobiety korzystają z salda portfela.
- **Nagrody za weryfikację** — 1 EVOLVE dla zweryfikowanego użytkownika i 1 EVOLVE dla potwierdzającego laboratorium za każdą weryfikację STD/DNA (plus faucet z limitem).
- **Governance** — waga głosu łączy reputację rekurencyjną (8 głosów, głębokość 3), udział w dzieciach/ojcostwie oraz EVOLVE postawione lub trzymane.
- Integracja **LayerZero OFT** dla przyszłych wielołańcuchowych transferów EVOLVE (zależności gotowe; poza Sepolią nic jeszcze nie wdrożono).

## Wsparcie projektu

EVOLVE jest niezależne i open-source. Jeśli jest dla Ciebie użyteczne, możesz wesprzeć rozwój darowizną — każdy wkład trafia na kod, partnerstwa laboratoryjne, hosting i tłumaczenia.

- **Szczegóły darowizn (EVM, Monero i więcej):** [DONATE.md](DONATE.md)
- **Wielojęzyczna strona darowizn (34 języki):** **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**

Publiczna sprzedaż tokenów jest w planach, ale dziś **nie** jest aktywna. Darowizny to prezenty wspierające rozwój open-source, które nie dają żadnych roszczeń do tokenów, udziałów, zwrotów ani zysku. Prosimy dawać tylko tyle, ile można stracić.

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

Kluczowe smart kontrakty: `EVOLVE.sol` (ERC-20), `ProfileNFT.sol` (ERC-721), `TrustScore.sol`, `Voting.sol`, `Evolve2Earn.sol` (prezenty emoji + nagrody), `Governance.sol`, `BondManager.sol` (poczęcie i poczęcie poliandryczne), `EvolveFund.sol`, `VerificationRegistry.sol`, `DNAVerification.sol`, ERC-4337 `SmartAccountFactory` + `Paymaster` oraz `TimelockController` z OpenZeppelin.

Szczegóły: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md)

## Roadmapa

W toku: produkcyjna gotowość aplikacji webowej. W planach: rejestr laboratoriów on-chain i certyfikacja testów, prawdziwy adapter dostawcy poczty do przyjmowania raportów laboratoryjnych, zweryfikowane atestacje on-chain w profilach, **trustless RewardVault** z emisją kontrolowaną przez governance ([projekt](docs/REWARD-VAULT-PLAN.md)), **publiczna sprzedaż tokenów**, aktualizacja vestingu dla alokacji założycieli oraz zapewnianie płynności na DEX (obecnie zablokowane — wymaga wdrożeń tokenów na mainnet). Ekspansja wielosieciowa (Arbitrum, Avalanche i inne sieci EVM) nastąpi po utwardzeniu testnetu.

Pełna lista: [docs/ROADMAP.md](docs/ROADMAP.md).

## Pierwsze kroki (deweloperzy)

Wymagania: **Node.js 20+** oraz npm 10.x.

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

Wkłady są mile widziane — kod, zgłoszenia błędów, propozycje funkcji i propozycje. Przed rozpoczęciem przeczytaj [CONTRIBUTING.md](CONTRIBUTING.md) oraz nasz [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

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
- [Tokenomia](docs/TOKENOMICS.md) — model tokenu i podział podaży
- [Plan RewardVault](docs/REWARD-VAULT-PLAN.md) — emisja trustless (planowana)
- [Roadmapa](docs/ROADMAP.md) — kamienie milowe i aktualny status
- [FAQ](docs/FAQ.md) — najczęściej zadawane pytania
- [Poradnik portfeli](docs/WALLETS.md) — jak tworzyć portfele i uzyskiwać adresy darowizn

## Licencja

Na warunkach [licencji MIT](LICENSE).

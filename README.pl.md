[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)
<!-- evolve-readme-sync: 3796750887b0bd65 -->

# EVOLVE

**Randkowanie, poczęcie i zweryfikowane zdrowie — prywatność domyślnie, zaufanie tam, gdzie naprawdę się liczy.**

EVOLVE to open-source'owa, zdecentralizowana platforma dla osób, które mają dość oddawania swojego numeru telefonu, swojej twarzy i najbardziej intymnych danych zdrowotnych do cudzej bazy danych. Logujesz się własnym portfelem kryptowalutowym — bez telefonu, bez e-maila, bez KYC — a konto możesz odzyskać dzięki on-chainowemu zobowiązaniu DNA. Twoje dane zdrowotne pozostają Twoje: wyniki badań są przetwarzane automatycznie, statusy poszczególnych patogenów **nigdy** nie są pokazywane nikomu, a dopasowanie opiera się wyłącznie na anonimowych werdyktach zgodności (Safe / Compatible / Caution / Risk). Czat działa w trybie peer-to-peer przez libp2p i Nostr, a dla wygody dostępny jest fallback HTTP. Prezenty i przelewy zmierzają ku pełnej poufności: prezenty z prywatnością nadawcy działają już dziś, a na mapie drogowej czekają ekranowany portfel Railgun i prototyp zero-knowledge na Aztec (zob. [Prywatność i poufne transakcje](#prywatność-i-poufne-transakcje)).

> **Status — tryb demo, aktywny rozwój.**
> Randkowanie, poczęcie, weryfikacja zdrowia, przepływ laboratoryjny, czat P2P, token EVOLVE i governance są zaimplementowane i działają w **lokalnym demo** — aplikacja **nie została jeszcze publicznie wdrożona**. Przed nami: **wdrożenie na mainnet i płynność na DEX** oraz **planowana publiczna sprzedaż** (zob. [Token EVOLVE](#token-evolve-tylko-sieć-testowa)).
> Smart kontrakty są wdrożone **wyłącznie na testnecie Ethereum Sepolia**. Nic tutaj nie stanowi porady finansowej ani oferty inwestycyjnej.

> **Uważasz, że EVOLVE się przydaje? Wesprzyj rozwój — każda darowizna trafia na kod, partnerstwa z laboratoriami, hosting i tłumaczenia → [DONATE.md](DONATE.md).**

## Nie ma się czego obawiać

EVOLVE powstało wokół pytań, które ludzie naprawdę zadają, zanim zaufają takiej platformie.

| Obawa                                                  | Co EVOLVE już dziś z tym robi                                                                                                                                                                                                     |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| „Moje dane zdrowotne wyciekną.”                        | Statusy poszczególnych patogenów **nigdy** nie są pokazywane nikomu — tylko anonimowy werdykt: Safe / Compatible / Caution / Risk.                                                                                                |
| „Moje zdjęcia gdzieś wylądują.”                        | Zdjęcia są domyślnie rozmyte. Właściciel udziela wglądu **na 15 sekund** lub **stałego** — na prośbę albo z własnej inicjatywy. Wgląd jest bezpłatny.                                                                             |
| „Będę musiał oddać dowód osobisty albo telefon.”       | Logowanie portfelem (SIWE). Bez telefonu, bez e-maila, bez KYC. Odzyskiwanie konta działa przez on-chainowe zobowiązanie DNA.                                                                                                     |
| „On albo ona kłamie na temat swojego zdrowia.”         | Wyniki są **weryfikowane przez laboratorium** (QR + dopasowanie twarzy), a badania pary wykonywane są **podczas samego spotkania** — liczą się świeże wyniki STD, DNA się nie starzeje.                                           |
| „Czy ktoś nie zabierze moich pieniędzy i nie zniknie?” | Poczęcie opiera się na realnym depozycie obarczonym ryzykiem: depozyt mężczyzny zmienia właściciela dopiero, gdy ojcostwo zostanie **potwierdzone**; w przeciwnym razie po prostu do niego wraca.                                 |
| „Czy to token typu pump-and-dump?”                     | Kod jest otwarty (MIT); niemal cała podaż jest zarezerwowana na nagrody dla użytkowników, a niezobilizowana rezerwa ma zostać zamknięta w **sejfie, którego nie da się opróżnić** — nie wypłaci z niego środków nawet założyciel. |
| „Czy platformę można zamknąć albo zablokować?”         | Komunikacja przede wszystkim peer-to-peer, zdecentralizowane przechowywanie danych (IPFS / Arweave), 18 konfiguracji sieci EVM i brak zahardkodowanej domeny.                                                                     |

## Co i dlaczego

Tradycyjne aplikacje randkowe każą wymienić numer telefonu, e-mail, zdjęcia i intymne szczegóły zdrowia na wpis do centralnej bazy danych — a potem ufać tej bazie już na zawsze. EVOLVE wychodzi z przeciwnego założenia: **prywatność domyślnie, samodzielna kontrola aktywów (self-custody) i brak pojedynczego punktu awarii**.

- **Prywatność domyślnie** — dane zdrowotne nigdy nie są ujawniane; tylko anonimowe werdykty.
- **Odporność na bany** — komunikacja P2P przede wszystkim, zdecentralizowane przechowywanie, architektura wielosieciowa, brak zahardkodowanych domen.
- **Tożsamość we własnych rękach** — Twoim loginem jest Twój portfel; odzyskiwanie konta przez DNA zamiast e-maila czy telefonu.
- **Bez bramki KYC** — do korzystania z platformy nie jest wymagany dokument tożsamości, telefon ani e-mail.

Pełne uzasadnienie znajdziesz w [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md).

## Zdrowie, któremu realnie można zaufać

- Wgraj wynik badania STD jako zwykły tekst lub PDF (wyodrębnianie warstwy tekstowej, z fallbackiem OCR dla skanów).
- Parser zna 8 patogenów: HIV-1/2, kiła, chlamydia, rzeżączka, HSV-1, HSV-2, wirusowe zapalenie wątroby typu B, wirusowe zapalenie wątroby typu C — w formatach raportów w języku angielskim, ukraińskim i rosyjskim.
- **Statusy poszczególnych patogenów nigdy nie są pokazywane innym użytkownikom.** Profile pokazują wyłącznie anonimowy werdykt: **Safe / Compatible / Caution / Risk**.
- On-chainowe rekordy DNA (`DNAVerification.sol`) napędzają odzyskiwanie konta i weryfikację.

### Laboratoria partnerskie — dowód, nie obietnice

Wejdź do laboratorium partnerskiego i pokaż swój kod QR. Laboratorium skanuje go, potwierdza Twoją tożsamość **dopasowaniem twarzy** (dzięki czemu nikt inny nie odbierze Twojego wyniku) i załącza raport STD — PDF, skan albo tekst, nawet ze słabym OCR. Wynik podpisuje prawdziwe laboratorium, a nie Ty, więc inni widzą **zweryfikowany fakt** zamiast Twojego słowa. A każda potwierdzona weryfikacja oznacza **1 EVOLVE dla pacjenta i 1 EVOLVE dla laboratorium** — obie strony mają powód, by postępować uczciwie. Poszczególne patogeny nadal nigdy nie są nikomu pokazywane.

## Szukanie kogoś

- Filtry wyszukiwania: „Czego szukasz” (randki / poczęcie / poczęcie poliandryczne / badania STD), „Kogo szukasz” (mężczyźni, kobiety, pary), kaskadowe selektory kraj → miasto, „może przyjechać do Twojego kraju” z listami dla poszczególnych krajów, kolor skóry, preferencje dotyczące badań, tylko osoby zgodne pod kątem STD.
- Kreator onboardingu: wiek (można ukryć), języki, bio, zdjęcie.
- **Czat P2P** przez libp2p (gossipsub) + Nostr, z fallbackiem na HTTP API.

## Poczęcie

Są dwie drogi, by zaplanować dziecko, i obie opierają się na tej samej idei: o prawdziwych zamiarach świadczy realny udział w EVOLVE — nigdy obietnice. Zobowiązanie mężczyzny żyje w jego depozycie w EvolveFund (od 15 EVOLVE, zablokowanym na co najmniej 30 dni), a kobieta może ustawić własny minimalny depozyt dla mężczyzn, którzy do niej dotrą.

**Poczęcie.** Kobieta prowadzi: zaprasza konkretnego mężczyznę i wskazuje go w bondzie. On musi mieć aktywny depozyt w EvolveFund; gdy oboje potwierdzą, depozyt jest blokowany i rusza odliczanie. Ciążę zgłasza się między 14. a 30. dniem po potwierdzeniu, a badania STD i DNA pary wykonywane są podczas samego spotkania — liczą się świeże wyniki STD, DNA się nie starzeje. Gdy ojcostwo zostanie potwierdzone, depozyt mężczyzny przechodzi na kobietę; jeśli nie — depozyt po prostu wraca do niego. Nic nie zmienia właściciela, dopóki fakty nie zostaną ustalone.

**Poczęcie poliandryczne.** Wybór należy do niej — i taki pozostaje. Otwiera sesję trwającą 48 godzin — bez własnego depozytu (jeśli chce, może go dodać wyłącznie dla reputacji). Mężczyźni z aktywnym depozytem mogą dołączyć — do 50 — i potwierdzić udział, co blokuje ich stawkę. Czternaście dni po zamknięciu sesji wybierany jest ojciec. Odzyskuje on swój depozyt plus nagrodę z puli: dwukrotność swojego depozytu i 1 EVOLVE za każdego pozostałego uczestnika. Niewybrani mężczyźni tracą swoją stawkę — 90% na rzecz kobiety, 10% na rzecz wybranego ojca. Ona nie ryzykuje niczego i może tylko zyskać; mężczyźni stawiają swój udział za prawo do bycia wybranym.

## Prywatność i poufne transakcje

Prywatność jest domyślna — a EVOLVE buduje mapę drogową ku w pełni poufnym transferom on-chain.

- **Prywatne prezenty** — wyślij różę 🌹 albo kaktusa 🌵 (1 EVOLVE) i wybierz, kto widzi, że to Ty: _publicznie_, _anonimowo dla wszystkich poza odbiorcą_ lub _w pełni anonimowo_. W trybach anonimowych prezent podróżuje jako jednorazowy voucher, który odbiorca realizuje własnym portfelem, więc nadawca nigdy nie pojawia się na łańcuchu. (Anonimowość nadawcy jest dziś na poziomie „zwykłego obserwatora”: transakcję finansującą można powiązać po czasie i kwocie.)
- **Ekranowany portfel Railgun** — prywatny portfel ukryty za flagą funkcji (`VITE_RAILGUN_ENABLED`, domyślnie wyłączony), który maskuje kwoty i adresy w działającej puli zero-knowledge Railguna. To droga do prawdziwej anonimowości nadawcy.
- **Prototyp Aztec** — ta sama logika prywatnych transferów i prywatnych bondów, wyrażona jako obwody Noir w zero-knowledge i trzymana za wyraźną bramką, dopóki Aztec nie będzie gotowy na produkcję. Zob. [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md).
- **Model dwóch portfeli** — publiczny portfel udziałowy uczestniczy w governance; prywatny portfel ekranowany jest celowo **wykluczony** z wagi głosu, dzięki czemu prywatność i siła głosu pozostają rozdzielone.

Szczegóły: [docs/RAILGUN-INTEGRATION.md](docs/RAILGUN-INTEGRATION.md) · [docs/SHIELDED-STAKES-DESIGN.md](docs/SHIELDED-STAKES-DESIGN.md) · [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md).

## Token EVOLVE (tylko sieć testowa)

- ERC-20, maksymalna podaż **8 000 000 000 EVOLVE**. Akcje administracyjne objęte 48-godzinnym `TimelockController`.
- **Planowany podział podaży** — zaprojektowany tak, by niemal cała podaż pracowała dla użytkowników, a nie dla insiderów:

| Przeznaczenie                                          |        EVOLVE |
| ------------------------------------------------------ | ------------: |
| Założyciele i zespół (pensja / nagroda)                |    25 000 000 |
| Rezerwa na DEX (przyszłość)                            |     4 000 000 |
| Publiczna sprzedaż (planowana)                         |     5 000 000 |
| Rezerwa nagród — laboratoria, pacjenci, matki, ojcowie | 7 966 000 000 |

- **Planowana publiczna sprzedaż** — 5 000 000 EVOLVE sprzedawanych przez aplikację po **$0.8 za sztukę**, z możliwością zapłaty dowolnym tokenem obsługiwanym przez aplikację; przychód finansuje rozwój. _(Planowane — jeszcze nie uruchomione.)_
- **Emisja trustless (planowana)** — rezerwa nagród ~7 966 000 000 ma zostać zamknięta w nieopróżnialnym `RewardVault`: uwalniana wyłącznie stopniowo, poprzez nagrody dla laboratoriów, pacjentów, matek i ojców, a zmiana reguł wymaga głosowania w governance. Nie wypłaci z niej środków nawet założyciel. Projekt: [docs/REWARD-VAULT-PLAN.md](docs/REWARD-VAULT-PLAN.md).
- **Ekonomia prezentów emoji** — prezent kosztuje 1 EVOLVE, rozdzielany proporcjonalnie między właścicieli istniejących prezentów; bezterminowy model przychodowy, a prezenty można przenosić.
- **EvolveFund** — męski staking (min. 15 EVOLVE, blokada na 30 dni) liczący się do wagi głosu w governance; kobiety korzystają ze salda portfela.
- **Nagrody za weryfikację** — 1 EVOLVE dla zweryfikowanego użytkownika i 1 EVOLVE dla potwierdzającego laboratorium za każdą weryfikację STD/DNA (plus faucet z limitem).
- **Governance** — waga głosu łączy rekursywną reputację (8 głosów, głębokość 3), udział w dzieciach/ojcostwie oraz EVOLVE wystawione lub trzymane na portfelu.
- Integracja **LayerZero OFT** dla przyszłych multichainowych transferów EVOLVE (zależności gotowe; poza Sepolią nic jeszcze nie wdrożono).

## Wesprzyj projekt

EVOLVE jest niezależne i open-source. Jeśli korzystasz z niego z pożytkiem, możesz wesprzeć rozwój darowizną — każdy wkład trafia na kod, partnerstwa z laboratoriami, hosting i tłumaczenia.

- **Szczegóły darowizn (EVM, Monero i inne):** [DONATE.md](DONATE.md)
- **Wielojęzyczna strona darowizn (34 języki):** **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**

Publiczna sprzedaż tokenów jest **planowana** — 5 000 000 EVOLVE, sprzedawanych przez aplikację (zob. [Token EVOLVE](#token-evolve-tylko-sieć-testowa)). Darowizny to prezenty wspierające rozwój open-source, które nie dają żadnych praw do tokenów, udziałów, zwrotu ani zysku. Prosimy przekazywać wyłącznie tyle, ile możesz stracić.

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

## Mapa drogowa

W toku: doprowadzenie aplikacji webowej do gotowości produkcyjnej. W planach: on-chainowy rejestr laboratoriów i certyfikacja badań, adapter prawdziwego dostawcy poczty do przyjmowania raportów laboratoryjnych, on-chainowe zweryfikowane atestacje w profilach, **trustless `RewardVault`** z emisją kontrolowaną przez governance ([projekt](docs/REWARD-VAULT-PLAN.md)), **publiczna sprzedaż tokenów**, aktualizacja vestingu dla alokacji założycielskiej oraz zapewnienie płynności na DEX (obecnie zablokowane — wymaga wdrożeń tokena na mainnecie). Po stronie prywatności prezenty z prywatnością nadawcy są gotowe, a ekranowany portfel Railgun i migracja prywatnych bondów Aztec pozostają za bramką testów opisaną w [docs/ROADMAP.md](docs/ROADMAP.md) i [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md). Ekspansja wielosieciowa (Arbitrum, Avalanche i inne sieci EVM) nastąpi po utwardzeniu na testnecie.

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

## Współtworzenie

Wkłady są mile widziane — kod, zgłoszenia błędów, propozycje funkcji i pomysły. Przed rozpoczęciem przeczytaj [CONTRIBUTING.md](CONTRIBUTING.md) oraz nasz [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Repozytoria (mirrory)

| Repozytorium | URL                                        |
| ------------ | ------------------------------------------ |
| GitHub       | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg     | https://codeberg.org/limitafternoon/Evolve |
| GitLab       | https://gitlab.com/evolve-group3/evolve    |

## Dokumentacja

- [Co i dlaczego](docs/WHAT-AND-WHY.md) — problem, wizja, kluczowe wartości
- [Jak to działa](docs/HOW-IT-WORKS.md) — przepływy użytkownika, krok po kroku
- [Architektura](docs/ARCHITECTURE.md) — monorepo, pakiety, przepływy danych
- [Tokenomia](docs/TOKENOMICS.md) — model tokena i podział podaży
- [Plan RewardVault](docs/REWARD-VAULT-PLAN.md) — emisja trustless (planowana)
- [Integracja Railgun](docs/RAILGUN-INTEGRATION.md) — prototypowa integracja ekranowanego portfela
- [Ekranowane stawki](docs/SHIELDED-STAKES-DESIGN.md) — prywatne stawki poczęciowe (projekt)
- [Prototyp Aztec](docs/AZTEC-PROTOTYPE.md) — prywatne transfery i bondy ZK (badania)
- [Mapa drogowa](docs/ROADMAP.md) — kamienie milowe i aktualny status
- [FAQ](docs/FAQ.md) — najczęściej zadawane pytania
- [Poradnik portfeli](docs/WALLETS.md) — jak założyć portfele i uzyskać adresy do darowizn

## Licencja

Na licencji [MIT License](LICENSE).

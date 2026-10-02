# EVOLVE — Відкладені рішення для запуску (Setup Decisions)

> **Навіщо цей файл:** тут зібрані рішення, які НЕ блокують поточну розробку,
> але будуть потрібні перед публічним запуском. Нічого не треба робити зараз —
> просто повернутись сюди, коли дійдемо до відповідної фази.
> Створено: 2026-10-01. Оновлювати при зміні рішень.

---

## 1. IPFS pin (Pinata) — копія `proposals.json` у децентралізованому сховищі

- **Статус:** ⏸ Відкладено. Pin зараз вимкнено (крок workflow «gated» на відсутність ключа).
- **Коли потрібно:** перед публічним запуском (Ban Resistance).
- **Що потрібно від власника:** безкоштовний акаунт Pinata → ключ `PINATA_JWT` → додати як GitHub Secret `PINATA_JWT`.
- **Рекомендоване рішення:** прямий залив файлу в Pinata (без CAR-провайдера), бо `ipshipyard/ipfs-deploy-action@v2` вимагає хоча б одне CAR-сховище (Storacha/Filebase), а Pinata таким не є.
- **Не використовувати:** web3.storage / Storacha (сервіс закритий).
- **Файли:** `.github/workflows/sync-proposals.yml` (кроки `Create IPFS CAR` / `Upload CAR to Pinata`).

## 2. Кількість DEX для ліквідності

- **Статус:** ⏸ Відкладено. Впливає лише на Phase 4 (DEX-ліквідність).
- **Коли потрібно:** Phase 4.
- **Нюанс:** у плані 5 «DEX», але **1inch — це агрегатор, не DEX** — він не потребує окремого пулу, лише автоматично підхоплює токен з інших DEX.
- **Реально пулів:** 4 (Uniswap V3 + SushiSwap на Arbitrum; Trader Joe/LFJ + Pangolin на Avalanche).
- **Рекомендоване рішення:** рахувати **4 DEX = 4 000 000 EVOLVE**; 1inch — як інтеграцію без окремих коштів.
- **Альтернатива:** зарезервувати 5 000 000 (як у плані) із запасом на 5-ту мережу.

## 3. Repo-координати та токени (CI secrets)

- **Статус:** ⏸ Відкладено. **GitHub уже працює** з автоматичним `GITHUB_TOKEN`.
- **Коли потрібно:** коли додаси дзеркала на Codeberg та/або GitLab.
- **Що вже стоїть за замовчуванням:** `GITHUB_REPO = Lilit-Moonlit/Evolve`.
- **Що потрібно буде:**
  - `CODEBERG_REPO` + `CODEBERG_TOKEN` (після створення репо на Codeberg);
  - `GITLAB_PROJECT` + `GITLAB_TOKEN` (після створення проєкту на GitLab).
- **Важливо:** якщо не задати — Codeberg/GitLab просто пропускаються з `WARN`, скрипт не падає.
- **Файли:** `.github/workflows/sync-proposals.yml` (env), `scripts/sync-proposals.mjs`.

## 4. `admin-chain.test.ts` — флейк (нестабільний тест)

- **Статус:** ⏸ Поза поточним обсягом. **Не пов'язаний з нашою роботою.**
- **Симптом:** таймаут 5с на `await import("../adminChain")` + «called 2 times».
- **Коли потрібно:** коли захочеш повністю «зелений» набір тестів.
- **Рекомендоване рішення:** підняти таймаут тесту або ізолювати; окрема задача.

---

## 5. Зеркалювання на Codeberg + GitLab (залив №3, част. 2)

- **Статус:** ⏳ Акаунти Codeberg/GitLab створені користувачем; **порожні репозиторії ще не створені**. GitHub-пуш **виконано** (`feat/mobile-mode2-mode3-i18n`, коміт `60fbfa7`).
- **Що потрібно від власника:** створити 2 ПОВНІСТЮ порожні репо (без README/license), потім надати URL.
- **Команди після цього:**
  ```bash
  git remote add codeberg https://codeberg.org/<user>/Evolve.git
  git remote add gitlab  https://gitlab.com/<user>/Evolve.git
  git push codeberg --all ; git push codeberg --tags
  git push gitlab  --all  ; git push gitlab  --tags
  ```
- **Авторизація:** git credential helper = `manager` (Git Credential Manager). Codeberg/GitLab при першому push можуть вимагати **access token** замість пароля (створити в налаштуваннях акаунта; scope: `write_repository` / `repo`).
- **Наслідок:** усі 3 платформи матимуть однакові гілки й історію (зеркало). Синхронізація — явним push у кожен remote (не автоматична).

## 6. Передумови ліквідності на Arbitrum/Avalanche (залив №2)

- **Статус:** 🔴 BLOCKED. `networks[42161/43114].deployed === false`; `liquidity-setup.json.tokenAddress` порожній; EVOLVE задеплоєний лише на Sepolia.
- **Що вже готово:** `hardhat.config.js` має мережі `arbitrum`/`avalanche`; `ignition-parameters.json` існує; `script/deploy-liquidity.mjs` (dry-run) + `script/configure-oft.mjs`.
- **Що потрібно для розблокування:**
  1. EVOLVE (OFT) задеплоїти на Arbitrum + Avalanche (потрібен гаманець з ETH/AVAX, `PRIVATE_KEY`, `ARBITRUM_RPC_URL`/`AVALANCHE_RPC_URL`).
  2. Перевірити/вказати правильний LayerZero EndpointV2 для кожної мережі (канонічний `0x1a44076050125825900e736c501f859c50fE728c`).
  3. Зовнішній аудит контрактів (hard gate перед mainnet).
  4. `ONEINCH_API_KEY` (server-side env).
  5. Заповнити `liquidity-setup.json.tokenAddress` адресами EVOLVE.
  6. Treasury Safe multisig (proposer/executor для TimelockController).
- **Виконати:** `npm run deploy:liquidity -- --execute` (після п.1–5).

## Нагадування для наступних сесій агентів

Перед запуском перевірити цей файл і оновити статуси. Пов'язаний Session State — `AGENTS.md` §24.

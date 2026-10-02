# How to get a crypto donation address (for the project owner)

[English](#english) | [Українська](#українська)

This guide explains how to create the wallets behind the addresses listed in [`DONATE.md`](../DONATE.md).

> **Golden rules**
>
> 1. Use a **dedicated wallet** for donations — never your main/hot wallet.
> 2. **Back up the seed phrase offline** (write it on paper, store it safely). **Never** share it, never type it into a website, never photograph it.
> 3. The **receive address is public and safe to share** — only the seed phrase and private keys must stay secret.
> 4. Verify the address you copy character-by-character before publishing it.
> 5. A hardware wallet is strongly recommended for meaningful amounts.

## Easiest path: one multi-chain wallet (covers most chains)

A single wallet app can give you addresses for almost all EVM chains plus BTC/LTC/DOGE/TRON/Solana:

- **Trust Wallet** (iOS/Android) or **Exodus** (desktop/mobile) — supports ETH, Arbitrum, Optimism, Base, Polygon, BSC, Avalanche, BTC, Solana, TRON, Litecoin, Dogecoin, TON (varies by version).

Steps (same pattern for every wallet below):

1. Install the app from the **official** source (App Store / Google Play / official website).
2. **Create a new wallet** (do not import an existing one if you want a clean donation wallet).
3. **Back up the recovery phrase** offline. Confirm the backup when asked.
4. Open the asset, tap **Receive**, and **copy the address**.

## Per-chain specifics

| Network                                                                           | Wallet app (examples)              | What you copy                                 |
| --------------------------------------------------------------------------------- | ---------------------------------- | --------------------------------------------- |
| **Ethereum + all EVM chains** (Arbitrum, Optimism, Base, Polygon, BSC, Avalanche) | MetaMask, Rabby, Trust Wallet      | One `0x…` address works on **all** EVM chains |
| **Bitcoin (BTC)**                                                                 | BlueWallet, Electrum, Trust Wallet | a `bc1…` (bech32) address                     |
| **Bitcoin Lightning**                                                             | Phoenix, Muun, Zeus                | a Lightning address like `you@wallet`         |
| **Solana (SOL)**                                                                  | Phantom, Solflare                  | a base58 address (no `0x`)                    |
| **TON**                                                                           | Tonkeeper                          | `EQ…` / `UQ…` address                         |
| **TRON (TRX / USDT-TRC20)**                                                       | TronLink, Trust Wallet             | a `T…` address                                |
| **Monero (XMR)**                                                                  | Cake Wallet, Feather, Monero GUI   | a `4…` address (best for donor privacy)       |
| **Litecoin (LTC)**                                                                | Litewallet, Trust Wallet           | `ltc1…` or `L…` address                       |
| **Dogecoin (DOGE)**                                                               | Dogecoin wallet, Trust Wallet      | a `D…` address                                |

> **EVM note:** the same `0x…` address is valid on Arbitrum, Optimism, Base, Polygon, BNB Smart Chain, and Avalanche — you do not need a separate wallet per EVM chain, only separate **balances**.

## After you have the addresses

1. Open `DONATE.md` and replace every `<YOUR_…>` placeholder with the matching address.
2. Tell the maintainer (or commit it yourself) — the addresses are public and safe to commit.
3. (Optional) create a QR code for each address and add it next to the address text.

---

## Українська

Ця інструкція пояснює, як створити гаманці для адрес з [`DONATE.md`](../DONATE.md).

> **Головні правила**
>
> 1. Використовуйте **окремий гаманець** лише для донатів — не основний.
> 2. **Збережіть seed-фразу офлайн** (на папері, у безпечному місці). **Ніколи** не діліться нею, не вводьте її на сайтах, не фотографуйте.
> 3. **Адресу для отримання можна публікувати** — таємними мають лишатися seed-фраза та приватні ключі.
> 4. Звіряйте адресу посимвольно перед публікацією.
> 5. Для значних сум — краще hardware-гаманець.

**Найпростіше:** один мульти-мережевий гаманець (**Trust Wallet** або **Exodus**) дає адреси одразу для EVM-мереж, а також BTC/LTC/DOGE/TRON/Solana.

**Кроки (для будь-якого гаманця):**

1. Встановіть застосунок лише з **офіційного** джерела.
2. **Створіть новий гаманець**.
3. **Збережіть seed-фразу офлайн**.
4. Відкрийте актив → **Receive (Отримати)** → **скопіюйте адресу**.

**Особливості мереж:**

- **Ethereum + усі EVM-мережі** (Arbitrum, Optimism, Base, Polygon, BSC, Avalanche) → одна адреса `0x…` працює всюди.
- **Bitcoin** → `bc1…`; **Lightning** → адреса виду `you@wallet`.
- **Solana** → base58 (без `0x`); **TON** → `EQ…`/`UQ…`; **TRON** → `T…`.
- **Monero** → `4…` (найкраще для приватності донатера); **Litecoin** → `ltc1…`; **Dogecoin** → `D…`.

**Потім:** відкрийте `DONATE.md` і замініть усі `<YOUR_…>` на свої адреси — їх безпечно комітити (це публічні адреси).

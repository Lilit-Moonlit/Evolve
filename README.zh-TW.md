[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)

# EVOLVE

**約會、受孕與健康驗證 — 預設隱私，在關鍵之處驗證。**

EVOLVE 是一個開源、去中心化的平台，用於可驗證的親密連結：約會、受孕，以及匿名的 STD/DNA 相容性。你使用自己的加密貨幣錢包登入（Sign-In with Ethereum）— 無需電話號碼、無需電子郵件、無需 KYC — 並可透過鏈上 DNA 承諾恢復帳戶。健康資料屬於你本人：檢驗結果會自動解析，個別病原體狀態**絕不**向任何人顯示，配對僅依賴匿名相容性判定（Safe / Compatible / Caution / Risk）。聊天透過 libp2p 與 Nostr 以點對點方式進行，並提供 HTTP 備援以提升便利性；應用程式還內建輕量化的「Safety Mode」公開外觀，以及用於評估 STD 檢測結果的獨立 Companion Mode。

> **狀態：早期 alpha 階段。** EVOLVE 正在積極開發中，並非成品。
> 智慧合約**僅部署於 Ethereum Sepolia 測試網**。
> **沒有主網部署、沒有 DEX、沒有流動性、也沒有公開代幣銷售** — 未來也不承諾任何一項。
> 功能可能隨時變更或損壞。本文件內容不構成財務建議或投資要約。

## 宗旨與理念

傳統約會平台要求你將電話號碼、電子郵件、照片與親密健康細節交給中央資料庫。EVOLVE 從相反的前提出發：預設隱私、自我託管、沒有中央故障點。核心價值：

- **預設隱私** — 健康資料永不曝光；僅提供匿名判定。
- **抗封鎖能力** — P2P 優先的訊息傳遞、去中心化儲存（IPFS / Arweave）、多網路設計、不硬編碼網域。
- **自我託管身分** — 你的錢包就是你的登入憑證；以 DNA 為基礎的恢復機制取代電子郵件/電話。
- **無 KYC 門檻** — 使用平台無需政府身分證件、電話或電子郵件。

完整論述請見 [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md)（英文）。

## 主要功能

### 身分與隱私

- **SIWE 錢包登入**（MetaMask 與其他 EVM 錢包）— 抗審查的緊急逃生口。
- **DNA 帳戶恢復** — 你的 DNA 檢測結果會被雜湊（SHA-256，以 `bytes32` 形式承諾上鏈），可在沒有電話或電子郵件的情況下恢復存取。
- **帳戶抽象（ERC-4337）** — 用於無 Gas 上手的智慧帳戶與 Paymaster；SIWE 永遠保持可用。

### 匿名健康相容性

- 以純文字或 PDF 上傳 STD 檢測結果（文字層抽取，掃描頁面備有 OCR 後備機制）。
- 解析器可辨識 8 種病原體：HIV-1/2、梅毒、披衣菌、淋病、HSV-1、HSV-2、B 型肝炎、C 型肝炎（支援英文、烏克蘭文與俄文報告格式）。
- **個別病原體狀態絕不顯示給其他使用者。** 個人檔案僅顯示匿名判定：**Safe / Compatible / Caution / Risk**。
- 鏈上 DNA 驗證記錄（`DNAVerification.sol`）支撐恢復與驗證流程。

### 個人檔案、搜尋與通訊

- 搜尋篩選器：「你想尋找什麼」（約會 / 受孕 / 多夫受孕 / STD 檢測）、「你想尋找誰」（男性、女性、伴侶）、國家 → 城市級聯選擇、附各國清單的「可以前往你的國家」、膚色、檢測偏好、僅顯示 STD 相容。
- 上線精靈：年齡（可隱藏）、語言、簡介、照片。
- **照片隱私**：照片預設模糊；擁有者可主動或應要求授予 15 秒或永久檢視權限。檢視免費。
- 透過 libp2p（gossipsub）+ Nostr 的 **P2P 聊天**，附 HTTP API 備援。

### 受孕模式

- **模式 2 — Pregnancy Bond**：女性建立連結契約，男性質押 EVOLVE（目前測試網版本為 ≥ 100），雙方確認；確認懷孕與父親身分後，質押轉移給女性。
- **模式 3 — Cryptic Choice**：女性開啟 48 小時階段，男性以質押加入；她選出父親 — 其質押退還，其餘人分配：90% 給她 / 10% 給獲選父親。

### 實驗室與驗證

- **實驗室合作夥伴流程**：實驗室註冊為合作夥伴，透過 QR 碼與臉部比對驗證患者，並附上 STD 報告（含 OCR 抽取的 PDF/文字）。
- **Companion Mode**：無需加入約會平台即可評估 STD 檢測結果的獨立流程。
- **Safety Mode**（`VITE_PRODUCT_MODE=safety`）：受限的公開外觀（STD 狀態、公開個人檔案連結、相容性檢查），即使約會/受孕功能在某司法管轄區或應用程式商店受到限制，仍能持續運作。

### EVOLVE 代幣（僅限測試網）

- ERC-20，最大供給量 8,000,000,000 EVOLVE，管理操作受 48 小時 TimelockController 保護。
- **表情符號禮物經濟**：一份禮物花費 1 EVOLVE，按比例分配給現有禮物擁有者 — 持有者的永久收益模型；禮物可轉讓。
- **EvolveFund**：男性質押（最低 15 EVOLVE，鎖定 30 天）計入治理權重；女性使用錢包餘額。
- **驗證獎勵**：STD/DNA 驗證後，1 EVOLVE 給受驗證使用者、1 EVOLVE 給確認實驗室（另有速率限制的測試水龍頭）。
- 治理投票權重結合遞迴聲譽（8 票、深度 3）、子女/父職份額，以及質押或持有的 EVOLVE。
- **LayerZero OFT** 整合，用於未來的 EVOLVE 多鏈轉移（相依套件已就位；Sepolia 之外尚未部署任何內容）。

### 平台

- 網頁應用程式（可安裝為 PWA）與 Expo/React Native 行動應用程式。
- 介面已翻譯成 **34 種語言**。
- 多網路就緒：18 個 EVM 網路設定（Arbitrum 與 Avalanche 是規劃中的主要 L2 — **尚未部署**）。

## 架構與技術棧

以 npm workspaces + Turborepo 管理的 Monorepo：

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

主要智慧合約：`EVOLVE.sol`（ERC-20）、`ProfileNFT.sol`（ERC-721）、`TrustScore.sol`、`Voting.sol`、`Evolve2Earn.sol`（表情符號禮物 + 獎勵）、`Governance.sol`、`BondManager.sol`（模式 2 與 3）、`EvolveFund.sol`、`VerificationRegistry.sol`、`DNAVerification.sol`、ERC-4337 `SmartAccountFactory` + `Paymaster`，以及 OpenZeppelin 的 `TimelockController`。

詳細資訊：[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md)（英文）

## 路線圖

進行中：網頁應用程式的生產就緒化。已規劃：鏈上實驗室註冊表與檢測認證、用於接收實驗室報告的真實郵件供應商配接器、個人檔案上的鏈上驗證證明、創辦人/開發者分配的代幣歸屬更新、DEX 流動性提供（目前受阻 — 需要主網代幣部署）。多網路擴展（Arbitrum、Avalanche 與其他 EVM 鏈）將在測試網強化後進行。

完整清單：[docs/ROADMAP.md](docs/ROADMAP.md)（英文）。

## 開始使用（開發者）

需求：**Node.js 20+** 與 npm 10.x。

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

## 貢獻

歡迎貢獻 — 程式碼、錯誤回報、功能建議與提案。開始前請先閱讀 [CONTRIBUTING.md](CONTRIBUTING.md) 與我們的 [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)。

## 支持本專案

如果你覺得 EVOLVE 有用，可以透過捐贈支持開發 — 詳情請見 [DONATE.md](DONATE.md)。偏好網頁嗎？請使用多語言捐贈頁面（34 種語言）：**https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**。

**沒有代幣銷售，以後也不會有。** EVOLVE 代幣無法被「投資」；捐贈是支持開源開發的贈與，不會讓捐贈者獲得代幣、股權、回報或任何財務請求權。

## 儲存庫（鏡像）

| 鏡像     | URL                                        |
| -------- | ------------------------------------------ |
| GitHub   | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg | https://codeberg.org/limitafternoon/Evolve |
| GitLab   | https://gitlab.com/evolve-group3/evolve    |

## 文件

- [宗旨與理念](docs/WHAT-AND-WHY.md) — 問題、願景、核心價值（英文）
- [運作方式](docs/HOW-IT-WORKS.md) — 使用者流程，逐步說明（英文）
- [架構](docs/ARCHITECTURE.md) — Monorepo、套件、資料流（英文）
- [代幣經濟學](docs/TOKENOMICS.md) — 代幣模型與供給分配（英文）
- [路線圖](docs/ROADMAP.md) — 里程碑與目前狀態（英文）
- [FAQ](docs/FAQ.md) — 常見問題（英文）
- [錢包指南](docs/WALLETS.md) — 如何建立錢包並取得捐贈地址（英文）

## 授權條款

採用 [MIT License](LICENSE) 授權。

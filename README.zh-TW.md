[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)
<!-- evolve-readme-sync: 3796750887b0bd65 -->

# EVOLVE

**約會、受孕與經認證的健康——預設私密，關鍵之處值得信賴。**

EVOLVE 是一個開源、去中心化的平台，服務於那些受夠了將自己的電話號碼、臉孔和最私密的健康資料交給他人資料庫的人。你用自己的加密錢包登入——無需電話、無需 email、無需 KYC——而且你可以透過鏈上 DNA 承諾找回帳號。你的健康資料仍屬於你：檢測結果會自動解析，個別病原體狀態**永遠不會**顯示給任何人，配對僅依賴匿名的相容性判定（Safe / Compatible / Caution / Risk）。聊天透過 libp2p 與 Nostr 以點對點方式運作，並以 HTTP 作為便利的備援。禮物與轉帳正朝完全保密邁進：私密禮物已經上線，而 Railgun 屏蔽錢包與 Aztec 零知識原型正在路線圖上（見[隱私與保密交易](#隱私--保密交易)）。

> **狀態——演示模式，積極開發中。**
> 約會、受孕、健康驗證、實驗室流程、P2P 聊天、EVOLVE 代幣與治理皆已實作，並在**本地演示**中運作——此應用**尚未公開部署**。前方仍有：**主網部署與 DEX 流動性**，以及**計畫中的公開發售**（見[EVOLVE 代幣](#evolve-代幣僅測試網)）。
> 智慧合約**僅部署在 Ethereum Sepolia 測試網**。此處任何內容皆非財務建議或投資要約。

> **覺得 EVOLVE 有用？支持開發——每筆捐款都用於程式碼、實驗室合作、託管與翻譯 → [DONATE.md](DONATE.md)。**

## 無需畏懼

EVOLVE 是圍繞人們在信任此類平台前實際會問的問題而建。

| 擔憂                             | EVOLVE 已針對它做的事                                                                                                           |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| 「我的健康資料會外洩。」         | 個別病原體結果**永遠不會**顯示給任何人——只有匿名判定：Safe / Compatible / Caution / Risk。                                      |
| 「我的照片會流落到某處。」       | 照片預設會模糊處理。擁有者授予 **15 秒**或**永久**查看權——依請求或主動提供。查看是免費的。                                      |
| 「我得交出證件或電話。」         | 錢包登入（SIWE）。無需電話、無需 email、無需 KYC。透過鏈上 DNA 承諾即可復原。                                                   |
| 「他或她對健康狀況說謊。」       | 結果由**實驗室驗證**（QR + 人臉比對），且伴侶的檢測在**見面時**進行——近期的 STD 結果才有意義，DNA 不會老化。                    |
| 「會不會有人拿了我的錢就消失？」 | 受孕建立在真實、有風險的質押上：男性的押金只在親子關係**確認**時才移動；否則就會直接退還給他。                                  |
| 「這個代幣是拉高出貨嗎？」       | 程式碼是開放的（MIT）；幾乎全部供應量都保留給使用者獎勵，而未流通的儲備計畫鎖在一個**不可掏空的保險庫**中，連創辦人都無法提取。 |
| 「平台會不會被關閉或封鎖？」     | 以點對點訊息優先、去中心化儲存（IPFS / Arweave）、18 種 EVM 網路設定，且無硬編碼網域。                                          |

## 是什麼 & 為什麼

傳統約會應用程式要求你以電話號碼、email、照片和私密健康細節來換取一個中心化資料庫——然後永遠信任該資料庫。EVOLVE 從相反的前提出發：**預設私密、自我託管，且無單一故障點**。

- **預設私密**——健康資料從不曝光；只有匿名判定。
- **抗封鎖**——以 P2P 訊息優先、去中心化儲存、多網路設計、無硬編碼網域。
- **自我託管身分**——你的錢包就是你的登入；以 DNA 復原取代 email 或電話。
- **無 KYC 門檻**——使用平台無需政府證件、電話或 email。

完整理念請見 [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md)。

## 你可以真正信賴的健康

- 以純文字或 PDF 上傳 STD 檢測（文字層萃取，掃描件有 OCR 備援）。
- 解析器辨識 8 種病原體：HIV-1/2、梅毒、披衣菌、淋病、HSV-1、HSV-2、B 型肝炎、C 型肝炎——支援英文、烏克蘭文與俄文報告格式。
- **個別病原體狀態絕不顯示給其他使用者。** 個人檔案只顯示匿名判定：**Safe / Compatible / Caution / Risk**。
- 鏈上 DNA 記錄（`DNAVerification.sol`）支援復原與驗證。

### 合作實驗室——證明，而非承諾

走進合作實驗室並出示你的 QR 碼。實驗室掃描它，以**人臉比對**確認你的身分（避免別人冒領你的結果），並附上 STD 報告——PDF、掃描或文字，即便 OCR 品質不佳。結果由真正的實驗室簽署，而非你本人，因此他人看到的是**已驗證的事實**，而非你的片面之詞。而且每次確認的驗證都會支付**病患 1 EVOLVE、實驗室 1 EVOLVE**——雙方都有誠實的理由。個別病原體仍不會顯示給任何人。

## 尋找某人

- 搜尋篩選：「你在找什麼」（約會 / 受孕 / 多夫受孕 / STD 檢測）、「你在找誰」（男性、女性、伴侶）、階層式國家 → 城市選單、「可前往你的國家」含各國清單、膚色、檢測偏好、僅 STD 相容者。
- 入門精靈：年齡（可隱藏）、語言、自介、照片。
- **P2P 聊天**透過 libp2p（gossipsub）+ Nostr，並有 HTTP API 備援。

## 受孕

規劃生育孩子的兩種方式，都建立在同一理念上：真正的意圖以真實的 EVOLVE 質押來展現——絕非靠承諾。男性的承諾體現在他的 EvolveFund 存款中（從 15 EVOLVE 起，至少鎖定 30 天），而女性可以為接近她的男性自行設定最低存款。

**受孕。** 由女性主導：她邀請一位特定男性，並在一個連結中指名他。他需要有活躍的 EvolveFund 存款；當雙方都確認時，它會被鎖定並開始倒數。懷孕在確認後的 14 到 30 天內回報，而伴侶的 STD 與 DNA 檢測在見面本身進行——近期的 STD 結果才有意義，DNA 不會老化。一旦親子關係確認，男性的存款轉給女性；若未確認，存款便直接退還給他。在事實確定之前，什麼都不會易手。

**多夫受孕。** 選擇權屬於她，且保持私密。她開啟一個為期 48 小時的場次——無需自己的存款（若願意，她可以僅為了聲譽而投入一筆）。有活躍存款的男性可以加入——最多 50 人——並確認，這會鎖定他們的質押。場次結束十四天後，父親被選出。他取回自己的存款，外加來自獎池的獎勵：其存款的兩倍，以及每位其他參與者 1 EVOLVE。未被選中的男性失去質押——90% 歸女性，10% 歸被選中的父親。她毫無風險且只可能獲益；男性則為被選中的權利押上質押。

## 隱私與保密交易

隱私是預設值——而 EVOLVE 正在建構一條通往鏈上完全保密轉帳的路線圖。

- **私密禮物**——送出一朵玫瑰 🌹 或一棵仙人掌 🌵（1 EVOLVE），並選擇誰能看到是你送的：_公開_、*對除收件者外的所有人匿名*或*完全匿名*。在匿名模式中，禮物以單次使用的憑證形式傳遞，由收件者用自己的錢包領取，因此寄件者永遠不會出現在鏈上。（目前寄件者的匿名性屬日常等級：資金交易仍可依時間與金額進行關聯。）
- **Railgun 屏蔽錢包**——一個受功能旗標控制的私密錢包（`VITE_RAILGUN_ENABLED`，預設關閉），透過 Railgun 上線中的零知識池隱藏金額與地址。這是通往真正寄件者匿名的途徑。
- **Aztec 原型**——同樣的私密轉帳與私密連結邏輯，以零知識 Noir 電路表達，並在 Aztec 達到可生產狀態前被明確門檻所阻擋。見 [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md)。
- **雙錢包模型**——公開的質押錢包參與治理；私密的屏蔽錢包被刻意**排除**在投票權重之外，使隱私與投票權力分離。

詳情：[docs/RAILGUN-INTEGRATION.md](docs/RAILGUN-INTEGRATION.md) · [docs/SHIELDED-STAKES-DESIGN.md](docs/SHIELDED-STAKES-DESIGN.md) · [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md)。

## EVOLVE 代幣（僅測試網）

- ERC-20，最大供應量 **8,000,000,000 EVOLVE**。管理動作由 48 小時的 `TimelockController` 把關。
- **計畫中的供應分配**——旨在讓幾乎全部供應量為使用者服務，而非內部人士：

| 用途                               |        EVOLVE |
| ---------------------------------- | ------------: |
| 創辦人與團隊（薪資 / 獎勵）        |    25,000,000 |
| DEX 儲備（未來）                   |     4,000,000 |
| 公開發售（計畫中）                 |     5,000,000 |
| 獎勵儲備——實驗室、病患、母親、父親 | 7,966,000,000 |

- **計畫中的公開發售**——5,000,000 EVOLVE 由應用程式以每個 **$0.8** 出售，可用應用程式支援的任何代幣支付；收益用於開發。_(計畫中——尚未上線。)_
- **無需信任的發行（計畫中）**——約 7,966,000,000 的獎勵儲備將鎖入不可掏空的 `RewardVault`：只能透過實驗室、病患、母親與父親獎勵逐步釋放，且規則變更須經治理投票。連創辦人都無法提取。設計：[docs/REWARD-VAULT-PLAN.md](docs/REWARD-VAULT-PLAN.md)。
- **表情符號禮物經濟**——一份禮物花費 1 EVOLVE，按比例分配給既有禮物持有者；一種永續的收入模式，且禮物可轉讓。
- **EvolveFund**——男性質押（最低 15 EVOLVE，30 天鎖定）計入治理權重；女性使用錢包餘額。
- **驗證獎勵**——每次 STD/DNA 驗證支付已驗證使用者 1 EVOLVE、確認實驗室 1 EVOLVE（另有速率限制的水龍頭）。
- **治理**——投票權重結合遞迴聲譽（8 票、深度 3）、子女／親子比例，以及已質押或持有的 EVOLVE。
- **LayerZero OFT** 整合，用於未來的多鏈 EVOLVE 轉帳（相依套件已就緒；目前僅 Sepolia 之外尚未部署任何內容）。

## 支持此專案

EVOLVE 獨立且開源。若它對你有用，你可以透過捐款支持開發——每筆貢獻都用於程式碼、實驗室合作、託管與翻譯。

- **捐款詳情（EVM、Monero 等）：** [DONATE.md](DONATE.md)
- **多語言捐款頁（34 種語言）：** **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**

代幣公開發售已**在計畫中**——5,000,000 EVOLVE，由應用程式出售（見 [EVOLVE 代幣](#evolve-代幣僅測試網)）。捐款是支持開源開發的禮物，不會賦予你對代幣、股權、回報或利潤的任何請求權。請只捐出你承受得起損失的部分。

## 架構與技術堆疊

以 npm workspaces + Turborepo 管理的 monorepo：

```
apps/
  web/          # Vite + React + TypeScript（主要 Web 應用，i18next，Prisma）
  mobile/       # Expo + React Native
packages/
  config/       # 功能旗標與動態遠端設定
  contracts/    # Solidity 0.8.24, Hardhat, Ignition, OpenZeppelin, LayerZero
  core/         # 共用型別、工具、中介層、web3
  matching/     # 配對演算法、篩選、排名
  p2p/          # libp2p (gossipsub) + Nostr 網路
  storage/      # IPFS, Arweave, Lit Protocol
docs/           # 架構、代幣經濟、路線圖、FAQ
```

關鍵智慧合約：`EVOLVE.sol`（ERC-20）、`ProfileNFT.sol`（ERC-721）、`TrustScore.sol`、`Voting.sol`、`Evolve2Earn.sol`（表情符號禮物 + 獎勵）、`Governance.sol`、`BondManager.sol`（受孕與多夫受孕）、`EvolveFund.sol`、`VerificationRegistry.sol`、`DNAVerification.sol`、ERC-4337 `SmartAccountFactory` + `Paymaster`，以及 OpenZeppelin 的 `TimelockController`。

詳情：[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md)

## 路線圖

進行中：Web 應用的生產就緒。計畫中：鏈上實驗室註冊與檢測認證、用於實驗室報告收錄的真實郵件供應商轉接器、個人檔案上的鏈上已驗證證明、**無需信任的 `RewardVault`** 與治理驅動的發行（[設計](docs/REWARD-VAULT-PLAN.md)）、**代幣公開發售**、創辦人配額的代幣歸屬更新，以及 DEX 流動性供應（目前受阻——需要主網代幣部署）。在隱私方面，私密禮物已完成，而 Railgun 屏蔽錢包與 Aztec 私密連結遷移仍停留在 [docs/ROADMAP.md](docs/ROADMAP.md) 與 [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md) 的檢查之後。多網路擴展（Arbitrum、Avalanche 及其他 EVM 鏈）在測試網加固之後進行。

完整清單：[docs/ROADMAP.md](docs/ROADMAP.md)。

## 開始使用（開發者）

需求：**Node.js 20+** 與 npm 10.x。

```bash
# 複製並安裝所有 workspace
git clone https://github.com/Lilit-Moonlit/Evolve.git
cd Evolve
npm install

# Web 應用（Vite 開發伺服器於 http://localhost:3000）
cd apps/web
npm run dev
npm test                # vitest 測試套件

# 智慧合約
cd packages/contracts
npm run compile         # hardhat compile
npm test                # hardhat 測試套件
npm run deploy:local    # 將所有合約部署到程序內 Hardhat 網路
```

## 貢獻

歡迎貢獻——程式碼、錯誤回報、功能建議與提案。開始前請閱讀 [CONTRIBUTING.md](CONTRIBUTING.md) 與我們的 [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)。

## 儲存庫（鏡像）

| 鏡像     | URL                                        |
| -------- | ------------------------------------------ |
| GitHub   | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg | https://codeberg.org/limitafternoon/Evolve |
| GitLab   | https://gitlab.com/evolve-group3/evolve    |

## 文件

- [是什麼 & 為什麼](docs/WHAT-AND-WHY.md) —— 問題、願景、核心價值
- [運作方式](docs/HOW-IT-WORKS.md) —— 使用者流程，逐步說明
- [架構](docs/ARCHITECTURE.md) —— monorepo、套件、資料流程
- [代幣經濟](docs/TOKENOMICS.md) —— 代幣模型與供應分配
- [RewardVault 計畫](docs/REWARD-VAULT-PLAN.md) —— 無需信任的發行（計畫中）
- [Railgun 整合](docs/RAILGUN-INTEGRATION.md) —— 屏蔽錢包整合 spike
- [屏蔽質押](docs/SHIELDED-STAKES-DESIGN.md) —— 私密受孕質押（設計）
- [Aztec 原型](docs/AZTEC-PROTOTYPE.md) —— ZK 私密轉帳與連結（研究）
- [路線圖](docs/ROADMAP.md) —— 里程碑與目前狀態
- [FAQ](docs/FAQ.md) —— 常見問題
- [錢包指南](docs/WALLETS.md) —— 如何建立錢包與取得捐款地址

## 授權

依 [MIT License](LICENSE) 授權。

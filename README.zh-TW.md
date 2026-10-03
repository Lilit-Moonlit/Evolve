[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)

# EVOLVE

**約會、生育與經過驗證的健康 — 預設保護隱私,在關鍵之處值得信賴。**

EVOLVE 是一個開源、去中心化的平台,為那些不願再把電話號碼、臉孔與最私密的健康資料交給他人資料庫的人而設。你使用自己的加密貨幣錢包登入 — 無需電話、無需電子郵件、無需 KYC — 並可透過鏈上 DNA 承諾找回帳號。你的健康資料始終屬於你:檢測結果會自動解析,個別病原體狀態**絕不會**向任何人顯示,配對只依賴匿名的相容性判定(Safe / Compatible / Caution / Risk)。聊天透過 libp2p 與 Nostr 以點對點方式進行,並提供 HTTP 備援以提升便利性。

> **狀態 — 平台今日即可運作;主網與 DEX 是下一步。**
> 約會、生育、健康驗證、實驗室流程、P2P 聊天、EVOLVE 代幣與治理機制皆已上線運作。接下來還有:**主網部署與 DEX 流動性**,以及**計畫中的公開銷售**(見 [EVOLVE 代幣](#evolve-代幣僅測試網))。
> 智慧合約**僅部署於 Ethereum Sepolia 測試網**。此處內容均不構成財務建議或投資要約。

> **覺得 EVOLVE 有用嗎?支持開發 — 每筆捐款都投入程式碼、實驗室合作、主機與翻譯 → [DONATE.md](DONATE.md)**

## 無需恐懼

EVOLVE 圍繞人們在信任這類平台之前真正會提出的疑問而打造。

| 疑慮                             | EVOLVE 已經採取的對策                                                                                                   |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| 「我的健康資料會外洩。」         | 個別病原體結果**絕不會**向任何人顯示 — 只顯示匿名判定:Safe / Compatible / Caution / Risk。                              |
| 「我的照片會被流傳到某處。」     | 照片預設模糊。擁有者可授予**15 秒**或**永久**檢視權 — 可應要求或主動授予。檢視完全免費。                                |
| 「我得交出身分證件或電話號碼。」 | 錢包登入(SIWE)。無電話、無電子郵件、無 KYC。帳號復原透過鏈上 DNA 承諾進行。                                             |
| 「對方在健康狀況上說謊。」       | 結果皆經**實驗室驗證**(QR + 臉部比對),且兩人的檢測是在**見面當下**進行 — 重點是近期的性病(STD)檢測結果,DNA 則不會過期。 |
| 「有人會捲走我的錢然後消失嗎?」  | 生育機制建立在真實且有風險的押金上:男性的存款只有在父職**經確認**後才會轉移;否則只會原樣退還給他。                      |
| 「這代幣是不是拉高出貨?」        | 目前沒有任何銷售進行;程式碼公開(MIT);未流通的儲備計畫鎖入**連創辦人都無法提取的非流失式金庫**。                         |
| 「平台會被關閉或封禁嗎?」        | 點對點訊息優先、去中心化儲存(IPFS / Arweave)、18 組 EVM 網路設定,且不綁定任何寫死在程式裡的網域。                       |

## 宗旨與理由

傳統交友應用要求你以電話號碼、電子郵件、照片與私密健康細節,換取一個中央資料庫 — 然後永遠信任那個資料庫。EVOLVE 從相反的前提出發:**預設隱私、自主保管、沒有單一故障點**。

- **預設隱私** — 健康資料絕不揭露;只有匿名判定。
- **抗封禁** — 點對點優先的訊息傳遞、去中心化儲存、多網路設計、不寫死網域。
- **自主保管身分** — 你的錢包就是你的登入方式;以 DNA 為基礎的復原取代電子郵件或電話。
- **無 KYC 門檻** — 使用平台無需政府身分證件、電話或電子郵件。

完整論述請見 [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md)。

## 真正能信賴的健康資訊

- 可將 STD 檢測結果以純文字或 PDF 上傳(文字層抽取,掃描件另備 OCR 備援)。
- 解析器可辨識 8 種病原體:HIV-1/2、梅毒、披衣菌、淋病、HSV-1、HSV-2、B 型肝炎、C 型肝炎 — 支援英文、烏克蘭文與俄文報告格式。
- **個別病原體狀態絕不會向其他使用者顯示。**個人檔案只會顯示匿名判定:**Safe / Compatible / Caution / Risk**。
- 鏈上 DNA 紀錄(`DNAVerification.sol`)支撐帳號復原與驗證。

### 合作實驗室 — 是證據,不是口號

走進合作實驗室並出示你的 QR 碼。實驗室掃描後以**臉部比對**確認你的身分(確保其他人無法代領你的結果),並附上 STD 報告 — PDF、掃描件或文字皆可,即使 OCR 品質不佳也行。結果由真正的實驗室簽署,而非由你自行提供,因此其他人看到的是**經驗證的事實**,而不是你的片面之詞。此外,每完成一次確認驗證,即支付 **1 EVOLVE 給受檢者、1 EVOLVE 給實驗室** — 雙方都有誠實以對的動機。個別病原體同樣絕不向任何人顯示。

## 尋找對象

- 搜尋篩選條件:「你想找什麼」(約會 / 生育 / 多夫制生育 / STD 檢測)、「你想找誰」(男性、女性、伴侶)、階層式的國家 → 城市選單、附各國清單的「可前往你的國家」、膚色、檢測偏好、僅顯示 STD 相容者。
- 新手引導精靈:年齡(可隱藏)、語言、自介、照片。
- 透過 libp2p(gossipsub)+ Nostr 的**點對點聊天**,並附 HTTP API 備援。

## 生育

計畫迎接孩子有兩種方式,兩者皆基於同一理念:真正的意願以 EVOLVE 中真實的押金來展現 — 絕非空口承諾。男方的承諾體現在他的 EvolveFund 存款(15 EVOLVE 起,鎖定至少 30 天),女方則可自行設定門檻,規定接觸她的男性須達到的最低存款。

**生育。** 由女方主導:她邀請特定男性,並在 bond 中指名對方。男方需要有效的 EvolveFund 存款;雙方確認後即鎖定並開始倒數。懷孕於確認後 14 至 30 天內回報,兩人的 STD 與 DNA 檢測則在見面當下進行 — 重點是近期的 STD 結果,DNA 不會過期。父職確認後,男方存款轉交女方;若未確認,存款即原路退還給他。事實底定之前,分文不動。

**多夫制生育。** 選擇權屬於她,且全程保密。她開啟一個為期 48 小時的階段 — 自己無需存款(若願意,可僅為聲譽添加)。持有有效存款的男性可加入 — 上限 50 人 — 並確認,其押金隨之鎖定。階段結束十四天後選出父親。他可取回存款,並獲得獎勵池的獎勵:存款的兩倍,外加其餘每位參與者各 1 EVOLVE。未獲選的男性則失去押金 — 90% 給女方,10% 給獲選的父親。她毫無風險、只有收益;男性則以押金換取被選中的權利。

## EVOLVE 代幣(僅測試網)

- ERC-20,最大供應量 **8,000,000,000 EVOLVE**。管理操作受 48 小時的 `TimelockController` 約束。
- **計畫中的供應分配** — 設計上讓幾乎全部供應為使用者服務,而非圖利內部人士:

| 用途                                |        EVOLVE |
| ----------------------------------- | ------------: |
| 創辦人與團隊(薪資 / 獎勵)           |    25,000,000 |
| DEX 儲備(未來)                      |     4,000,000 |
| 公開銷售(計畫中)                    |     5,000,000 |
| 獎勵儲備 — 實驗室、患者、母親、父親 | 7,966,000,000 |

- **計畫中的公開銷售** — 5,000,000 EVOLVE 由應用以**每枚 $0.8** 出售,可用應用程式支援的任何代幣支付;收益用於資助開發。_(計畫中 — 尚未開始。)_
- **去信任發行(計畫中)** — 約 7,966,000,000 的獎勵儲備將鎖入不可流失的 `RewardVault`:僅透過實驗室、患者、母親與父親獎勵逐步釋放,且規則變更須經治理投票。連創辦人都無法提取。設計:[docs/REWARD-VAULT-PLAN.md](docs/REWARD-VAULT-PLAN.md)。
- **表情符號禮物經濟** — 一份禮物花費 1 EVOLVE,按比例分給現有禮物持有者;是永續的收益模式,且禮物可轉讓。
- **EvolveFund** — 男性質押(最低 15 EVOLVE,鎖定 30 天),計入治理權重;女性則使用錢包餘額。
- **驗證獎勵** — 每次 STD/DNA 驗證,受驗證使用者與確認實驗室各獲得 1 EVOLVE(另附設有速率限制的水龍頭)。
- **治理** — 投票權重結合遞迴聲譽(8 票、深度 3)、子女/父職占比,以及質押或持有的 EVOLVE。
- 整合 **LayerZero OFT**,為未來 EVOLVE 跨鏈轉移做準備(相依套件已就位;尚未部署至 Sepolia 以外)。

## 支持本專案

EVOLVE 獨立且開源。如果它對你有幫助,你可以透過捐款支持開發 — 每筆捐款都投入程式碼、實驗室合作、主機與翻譯。

- **捐款詳情(EVM、Monero 等):** [DONATE.md](DONATE.md)
- **多語言捐款頁(34 種語言):** **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**

公開代幣銷售已列入路線圖,但目前**尚未**開始。捐款是支持開源開發的贈與,不賦予任何對代幣、股權、回報或收益的請求權。請只捐你承受得起損失的金額。

## 架構與技術棧

以 npm workspaces + Turborepo 管理的 monorepo:

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

主要智慧合約:`EVOLVE.sol`(ERC-20)、`ProfileNFT.sol`(ERC-721)、`TrustScore.sol`、`Voting.sol`、`Evolve2Earn.sol`(表情禮物 + 獎勵)、`Governance.sol`、`BondManager.sol`(生育與多夫制生育)、`EvolveFund.sol`、`VerificationRegistry.sol`、`DNAVerification.sol`、ERC-4337 `SmartAccountFactory` + `Paymaster`,以及 OpenZeppelin 的 `TimelockController`。

詳細資訊:[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md)

## 路線圖

進行中:網頁應用的正式版準備工作。計畫中:鏈上實驗室登記與檢測認證、用於接收實驗室報告的正式郵件供應商轉接器、個人檔案上的鏈上驗證證明、治理閘控發行的**去信任 RewardVault**([設計](docs/REWARD-VAULT-PLAN.md))、**公開代幣銷售**、創辦人配得的代幣歸屬更新,以及 DEX 流動性供應(目前受阻 — 需先在主網部署代幣)。多網路擴展(Arbitrum、Avalanche 與其他 EVM 鏈)將在測試網強化後展開。

完整清單:[docs/ROADMAP.md](docs/ROADMAP.md)。

## 開始上手(開發者)

環境需求:**Node.js 20+** 與 npm 10.x。

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

## 參與貢獻

歡迎各種貢獻 — 程式碼、錯誤回報、功能建議與提案。開始前請先閱讀 [CONTRIBUTING.md](CONTRIBUTING.md) 與我們的 [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)。

## 儲存庫(鏡像)

| 鏡像站   | URL                                        |
| -------- | ------------------------------------------ |
| GitHub   | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg | https://codeberg.org/limitafternoon/Evolve |
| GitLab   | https://gitlab.com/evolve-group3/evolve    |

## 文件

- [宗旨與理由](docs/WHAT-AND-WHY.md) — 問題、願景、核心價值
- [運作方式](docs/HOW-IT-WORKS.md) — 使用者流程,逐步說明
- [架構](docs/ARCHITECTURE.md) — monorepo、套件、資料流
- [代幣經濟](docs/TOKENOMICS.md) — 代幣模型與供應分配
- [RewardVault 計畫](docs/REWARD-VAULT-PLAN.md) — 去信任發行(計畫中)
- [路線圖](docs/ROADMAP.md) — 里程碑與現況
- [常見問題](docs/FAQ.md) — 常見問答
- [錢包指南](docs/WALLETS.md) — 如何建立錢包並取得捐款地址

## 授權條款

採用 [MIT License](LICENSE) 授權。

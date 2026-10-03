[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)

# EVOLVE

**デーティング・受胎・検証済みの健康情報 — プライバシーはデフォルトで、大切な場面で信頼できる。**

EVOLVE は、自分の電話番号、顔写真、最もプライベートな健康データを他人のデータベースに渡すことにうんざりした人のための、オープンソースの分散型プラットフォームです。自分の暗号資産ウォレットでサインインでき — 電話番号もメールも KYC も不要 — オンチェーンの DNA コミットメントを通じてアカウントを取り戻すこともできます。健康データはあなたのもののまま:検査結果は自動的に解析され、個々の病原体のステータスが誰かに表示されることは**決して**なく、マッチングは匿名の互換性判定(Safe / Compatible / Caution / Risk)のみに依存します。チャットは libp2p と Nostr 上でピアツーピアで実行され、利便性のための HTTP フォールバックも備えています。

> **ステータス — プラットフォームは今日すでに動作しています。次はメインネットと DEX です。**
> デーティング、受胎、健康検証、ラボフロー、P2P チャット、EVOLVE トークン、ガバナンスはすべて稼働中です。今後の予定:**メインネットデプロイと DEX 流動性**、そして**計画中のパブリックセール**(「[EVOLVE トークン](#evolveトークンテストネットのみ)」を参照)。
> スマートコントラクトは **Ethereum Sepolia テストネットのみ**にデプロイされています。ここに記載された内容は金融アドバイスでも投資勧誘でもありません。

> **EVOLVE が役に立つと思いましたか?開発を支援してください — すべての寄付はコード、ラボ提携、ホスティング、翻訳に使われます → [DONATE.md](DONATE.md)**

## 恐れるものは何もない

EVOLVE は、このようなプラットフォームを信頼する前に人々が実際に抱く疑問を中心に構築されました。

| 不安                                             | EVOLVE がすでに行っている対策                                                                                                                           |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 「私の健康データが漏洩するのでは。」             | 個々の病原体の結果は**決して**誰にも表示されません — 表示されるのは匿名の判定のみ:Safe / Compatible / Caution / Risk。                                  |
| 「私の写真がどこかに流出するのでは。」           | 写真はデフォルトでぼかされます。所有者が**15 秒**または**永続的**な閲覧を許可します — リクエストへの応答でも、自発的にも。閲覧は無料です。              |
| 「身分証や電話番号を渡す必要があるのでは。」     | ウォレットログイン(SIWE)。電話番号不要、メール不要、KYC 不要。復旧はオンチェーンの DNA コミットメントを通じて行われます。                               |
| 「相手が健康状態について嘘をついているのでは。」 | 結果は**ラボ検証済み**(QR + 顔照合)で、二人の検査は**対面の時点で**受けられます — 重要なのは直近の STD 検査結果であり、DNA は劣化しないためです。       |
| 「誰かが私のお金を持って姿を消すのでは。」       | 受胎は現実の、リスクを伴うステークの上で成り立ちます:男性のデポジットが動くのは父性が**確認された**ときだけで、それ以外の場合は単純に彼へ返還されます。 |
| 「このトークンはポンプ&ダンプでは。」            | 現在セールは行われておらず、コードは公開(MIT)で、未流通のリザーブは**創設者にも引き出せない流出不可能なボールト**にロックされる予定です。               |
| 「プラットフォームが停止や禁止を受けるのでは。」 | ピアツーピアメッセージングを最優先、分散型ストレージ(IPFS / Arweave)、18 種の EVM ネットワーク設定、ハードコードされたドメインなし。                    |

## 目的と理由

従来のマッチングアプリは、電話番号・メール・写真・親密な健康情報を中央データベースと引き換えに差し出すよう求め、その後そのデータベースを永遠に信頼し続けることを強います。EVOLVE は正反対の前提から出発します:**デフォルトでのプライバシー、セルフカストディ、単一障害点の不在**。

- **デフォルトでのプライバシー** — 健康データが公開されることは決してなく、示されるのは匿名の判定のみです。
- **BAN 耐性** — P2P 優先のメッセージング、分散型ストレージ、マルチネットワーク設計、ハードコードされたドメインなし。
- **セルフカストディ型のアイデンティティ** — あなたのウォレットがログイン。メールや電話の代わりに DNA ベースの復旧。
- **KYC ゲートなし** — プラットフォームの利用に政府発行の身分証、電話番号、メールは一切不要です。

詳細な背景は [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md) をお読みください。

## 本当に信頼できる健康情報

- STD 検査結果を生テキストまたは PDF でアップロードできます(テキスト層の抽出、スキャン用の OCR フォールバック付き)。
- パーサーは 8 種類の病原体を認識します:HIV-1/2、梅毒、クラミジア、淋病、HSV-1、HSV-2、B 型肝炎、C 型肝炎 — 英語・ウクライナ語・ロシア語の報告書形式に対応。
- **個々の病原体ステータスが他のユーザーに表示されることは決してありません。**プロフィールに表示されるのは匿名の判定のみです:**Safe / Compatible / Caution / Risk**。
- オンチェーンの DNA 記録(`DNAVerification.sol`)が復旧と検証を支えています。

### 提携ラボ — 約束ではなく証拠

提携ラボを訪れて QR コードを提示してください。ラボがそれをスキャンし、**顔照合**で本人確認を行い(他の誰もあなたの結果を受け取れないようにするため)、STD 報告書を添付します — PDF、スキャン、テキスト、さらには OCR 精度が低い場合でも対応します。結果はあなた自身ではなく実際のラボによって署名されるため、他の人が目にするのはあなたの言葉ではなく**検証済みの事実**です。さらに、確認済みの検証ごとに**患者へ 1 EVOLVE、ラボへ 1 EVOLVE** が支払われ、双方に正直である動機が生まれます。個々の病原体が誰かに表示されることも決してありません。

## 理想の相手を探す

- 検索フィルター:「何を探しているか」(デーティング / 受胎 / 一妻多夫的な受胎 / STD 検査)、「誰を探しているか」(男性、女性、カップル)、カスケード式の国 → 都市選択、国別リスト付きの「あなたの国へ渡航可能」、肌の色、検査の好み、STD 互換のみ。
- オンボーディングウィザード:年齢(非表示可能)、言語、自己紹介、写真。
- libp2p(gossipsub)+ Nostr 上の **P2P チャット**、HTTP API フォールバック付き。

## 受胎

子どもを計画する方法は 2 つあり、どちらも同じ考えに基づいています:本当の意思は、約束ではなく EVOLVE における現実のステークで示されます。男性のコミットメントは EvolveFund デポジット(15 EVOLVE 以上、最低 30 日間ロック)として存在し、女性は自分の元へ届く男性向けの最低デポジット額を自ら設定できます。

**受胎。** 主導権は女性にあります:特定の男性を招待し、ボンドに名前を記します。男性には有効な EvolveFund デポジットが必要で、双方が確認するとデポジットはロックされ、カウントダウンが始まります。妊娠は確認後 14〜30 日以内に報告され、二人の STD 検査と DNA 検査は対面の時点そのものを実施されます — 重要なのは直近の STD 検査結果であり、DNA は劣化しないためです。父性が確認されると男性のデポジットは女性へ移り、確認されなければデポジットは単純に彼へ返還されます。事実が確定するまで、お金は一切動きません。

**一妻多夫的な受胎。** 選択権は彼女にあり、そのまま非公開です。彼女は 48 時間実行されるセッションを開きます — 自身のデポジットなしで(望めば、評判を高めるためだけに追加することも可能)。有効なデポジットを持つ男性は参加でき — 上限 50 人 — 確認するとそのステークはロックされます。セッション終了から 14 日後、父親が選出されます。父親にはデポジットの返却に加えてプールからの報酬が支払われます:デポジットの 2 倍と、他の全参加者への 1 EVOLVE ずつ。選ばれなかった男性はステークを失います — 90% は女性へ、10% は選ばれた父親へ。彼女は何のリスクも負わず得るのみで、男性たちは選ばれる権利のためにステークを賭けます。

## EVOLVE トークン(テストネットのみ)

- ERC-20、最大供給量 **8,000,000,000 EVOLVE**。管理者操作は 48 時間の `TimelockController` によって制限されます。
- **計画中の供給配分** — 供給量のほぼすべてを内部関係者ではなくユーザーのために機能させるよう設計されています:

| 目的                                  |        EVOLVE |
| ------------------------------------- | ------------: |
| ファウンダーとチーム(給与 / 報酬)     |    25,000,000 |
| DEX リザーブ(将来)                    |     4,000,000 |
| パブリックセール(計画中)              |     5,000,000 |
| 報酬リザーブ — ラボ、患者、母親、父親 | 7,966,000,000 |

- **計画中のパブリックセール** — 5,000,000 EVOLVE をアプリが**1 枚 $0.8** で販売します。アプリが対応する任意のトークンで支払いが可能で、売上は開発の資金に充てられます。_(計画中 — まだ開始されていません。)_
- **トラストレスなエミッション(計画中)** — 約 7,966,000,000 の報酬リザーブは、流出不可能な `RewardVault` にロックされる予定です:ラボ・患者・母親・父親への報酬を通じてのみ徐々に解放され、ルールの変更にはガバナンス投票が必要です。創設者であっても引き出すことはできません。設計:[docs/REWARD-VAULT-PLAN.md](docs/REWARD-VAULT-PLAN.md)。
- **絵文字ギフトエコノミー** — ギフトは 1 EVOLVE で、既存のギフト所有者に比例配分されます。無期限の収益モデルであり、ギフトは譲渡可能です。
- **EvolveFund** — ガバナンス権重に算入される男性向けステーキング(最低 15 EVOLVE、30 日間ロック)。女性はウォレット残高を使用します。
- **検証報酬** — STD/DNA 検証ごとに、検証されたユーザーへ 1 EVOLVE、確認したラボへ 1 EVOLVE(加えてレート制限付きフォーセットあり)。
- **ガバナンス** — 投票権重は、再帰的レピュテーション(8 票、深さ 3)、子ども/父親の割合、ステークまたは保有された EVOLVE を組み合わせて決まります。
- 将来のマルチチェーン EVOLVE 転送に向けた **LayerZero OFT** 統合(依存関係は整備済み。Sepolia 以外へのデプロイはまだありません)。

## プロジェクトを支援する

EVOLVE は独立したオープンソースプロジェクトです。役に立つと思ったら、寄付によって開発を支援できます — すべての貢献はコード、ラボ提携、ホスティング、翻訳に使われます。

- **寄付の詳細(EVM、Monero など):** [DONATE.md](DONATE.md)
- **多言語寄付ページ(34 言語):** **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**

パブリックトークンセールはロードマップに含まれていますが、現時点では**稼働していません**。寄付はオープンソース開発を支える贈り物であり、トークン・持分・リターン・利益への請求権を与えるものではありません。失っても問題ない金額のみをご寄付ください。

## アーキテクチャと技術スタック

npm workspaces + Turborepo で管理されるモノレポです:

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

主なスマートコントラクト:`EVOLVE.sol`(ERC-20)、`ProfileNFT.sol`(ERC-721)、`TrustScore.sol`、`Voting.sol`、`Evolve2Earn.sol`(絵文字ギフト + 報酬)、`Governance.sol`、`BondManager.sol`(受胎と一妻多夫的な受胎)、`EvolveFund.sol`、`VerificationRegistry.sol`、`DNAVerification.sol`、ERC-4337 `SmartAccountFactory` + `Paymaster`、そして OpenZeppelin の `TimelockController`。

詳細:[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md)

## ロードマップ

進行中:ウェブアプリの本番環境への準備。計画中:オンチェーンのラボレジストリと検査認定、ラボ報告書取り込み用の実際のメールプロバイダーアダプター、プロフィール上のオンチェーン検証済みアテステーション、ガバナンス制御エミッション付き**トラストレス RewardVault**([設計](docs/REWARD-VAULT-PLAN.md))、**パブリックトークンセール**、ファウンダー配分のトークンベスティング更新、DEX 流動性の提供(現在ブロック中 — メインネットでのトークンデプロイが必要です)。マルチネットワーク展開(Arbitrum、Avalanche、その他の EVM チェーン)は、テストネットの安定化後に進められます。

完全なリスト:[docs/ROADMAP.md](docs/ROADMAP.md)。

## はじめに(開発者向け)

必要環境:**Node.js 20+** および npm 10.x。

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

## コントリビュート

コントリビューションを歓迎します — コード、バグ報告、機能提案、プロポーザル。開始する前に [CONTRIBUTING.md](CONTRIBUTING.md) と [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) をお読みください。

## リポジトリ(ミラー)

| ミラー   | URL                                        |
| -------- | ------------------------------------------ |
| GitHub   | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg | https://codeberg.org/limitafternoon/Evolve |
| GitLab   | https://gitlab.com/evolve-group3/evolve    |

## ドキュメント

- [目的と理由](docs/WHAT-AND-WHY.md) — 課題、ビジョン、コアバリュー
- [仕組み](docs/HOW-IT-WORKS.md) — ユーザーフロー、ステップごとの解説
- [アーキテクチャ](docs/ARCHITECTURE.md) — モノレポ、パッケージ、データフロー
- [トークノミクス](docs/TOKENOMICS.md) — トークンモデルと供給配分
- [RewardVault プラン](docs/REWARD-VAULT-PLAN.md) — トラストレスなエミッション(計画中)
- [ロードマップ](docs/ROADMAP.md) — マイルストーンと現状
- [FAQ](docs/FAQ.md) — よくある質問
- [ウォレットガイド](docs/WALLETS.md) — ウォレットの作成方法と寄付アドレスの取得方法

## ライセンス

[MIT License](LICENSE) の下でライセンスされています。

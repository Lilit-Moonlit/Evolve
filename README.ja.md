[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)
<!-- evolve-readme-sync: 3796750887b0bd65 -->

# EVOLVE

**出会い、子づくり、検証済みのヘルスケア —— プライバシーを標準に、本当に大切な場面で信頼できる。**

EVOLVEは、自分の電話番号、顔、最もデリケートな健康データを他人のデータベースに渡すことにうんざりした人のための、オープンソースで分散型のプラットフォームです。サインインは自分の暗号資産ウォレットで行います —— 電話もメールもKYCも不要 —— そしてオンチェーンのDNAコミットメントを使えばアカウントを取り戻せます。健康データはあなたのものであり続けます：検査結果は自動的にパースされ、個々の病原体ステータスが誰かに表示されることは**決して**なく、マッチングは匿名の互換性判定（Safe / Compatible / Caution / Risk）のみに基づいて行われます。チャットはlibp2pとNostrの上でP2Pにより動作し、利便性のためのHTTPフォールバックも用意されています。ギフトと送金は完全な機密性へと向かっています：送信者プライベートなギフトはすでに利用可能で、ロードマップにはRailgunのシールドウォレットとAztecのゼロ知識プロトタイプが控えています（[プライバシーと機密取引](#プライバシーと機密取引)を参照）。

> **ステータス —— デモモード、鋭意開発中。**
> デーティング、子づくり、健康検証、ラボフロー、P2Pチャット、EVOLVEトークン、ガバナンスはいずれも実装済みで、**ローカルデモ**として動作します —— アプリは**まだ一般にはデプロイされていません**。今後の予定：**メインネットデプロイとDEX流動性**、さらに**計画中のパブリックセール**（[EVOLVEトークン](#evolveトークンテストネットのみ)を参照）。
> スマートコントラクトは**Ethereum Sepoliaテストネットのみ**にデプロイされています。ここにある内容はいずれも金融助言でも投資勧誘でもありません。

> **EVOLVEが役に立つと思いましたか？開発を支援してください —— すべての寄付はコード、ラボとの提携、ホスティング、翻訳に使われます → [DONATE.md](DONATE.md)。**

## 恐れることは何もない

EVOLVEは、こうしたプラットフォームを信頼する前に人々が実際に抱く疑問を軸に設計されました。

| 心配ごと                                       | EVOLVEがすでに行っていること                                                                                                                                              |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 「健康データが漏れるのでは」                   | 個々の病原体の結果が誰かに表示されることは**決して**ありません —— 表示されるのは匿名の判定だけです：Safe / Compatible / Caution / Risk。                                  |
| 「写真がどこかに流れるのでは」                 | 写真はデフォルトでぼかされます。所有者が**15秒**または**永久**の閲覧を許可します —— リクエストへの応答でも、自発的にも。閲覧は無料です。                                  |
| 「身分証や電話番号を渡すことになるのでは」     | ウォレットログイン（SIWE）。電話もメールもKYCも不要。復旧はオンチェーンのDNAコミットメントで機能します。                                                                  |
| 「相手が健康状態について嘘をついているのでは」 | 結果は**ラボが検証**し（QR + 顔照合）、二人の検査は**対面のその場で**受けます —— STD結果の新しさは重要ですが、DNAは劣化しません。                                         |
| 「お金を持って逃げられるのでは」               | 子づくりは現実の、リスクを伴うステークの上で動きます：男性のデポジットが動くのは父性が**確認された**ときだけで、それ以外の場合は単に本人に返還されます。                  |
| 「このトークンはポンプ&ダンプなのでは」        | コードは公開されており（MIT）、供給のほぼ全体がユーザー報酬用に予約され、未流通のリザーブは創設者でさえ引き出せない**流出不可能なボールト**へのロックが計画されています。 |
| 「プラットフォームが閉鎖・禁止されるのでは」   | P2Pメッセージング第一、分散型ストレージ（IPFS / Arweave）、18のEVMネットワーク設定、ハードコードされたドメインなし。                                                      |

## 目的と理由

従来のデーティングアプリは、電話番号・メール・写真・親密な健康の詳細と引き換えに中央データベースへの登録を求め、その後そのデータベースを永遠に信頼し続けることを求めます。EVOLVEは正反対の前提から出発します：**プライバシーを標準に、セルフカストディ、単一障害点なし**。

- **プライバシーを標準に** —— 健康データは決して公開されず、示されるのは匿名の判定のみ。
- **BAN耐性** —— P2P第一のメッセージング、分散型ストレージ、マルチネットワーク設計、ハードコードされたドメインなし。
- **セルフカストディなアイデンティティ** —— あなたのウォレットがそのままログイン。メールや電話の代わりにDNAベースの復旧。
- **KYCゲートなし** —— プラットフォームの利用に公的身分証も電話もメールも不要。

詳しい経緯は[docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md)をご覧ください。

## 本当に信頼できるヘルスケア

- STD検査を生のテキストまたはPDFでアップロード（テキスト層の抽出、スキャン向けにはOCRフォールバック）。
- パーサーは8つの病原体を認識します：HIV-1/2、梅毒、クラミジア、淋病、HSV-1、HSV-2、B型肝炎、C型肝炎 —— 英語・ウクライナ語・ロシア語のレポート形式に対応。
- **個々の病原体ステータスが他のユーザーに表示されることは決してありません。** プロフィールに表示されるのは匿名の判定のみです：**Safe / Compatible / Caution / Risk**。
- オンチェーンのDNA記録（`DNAVerification.sol`）が復旧と検証を支えます。

### 提携ラボ —— 約束ではなく証拠

提携ラボを訪れて、QRコードを見せてください。ラボがそれをスキャンし、**顔照合**であなたの本人性を確認し（他の誰にもあなたの結果を受け取れないようにするため）、STDレポート —— PDF、スキャン、テキスト、読みにくいOCRであっても —— を添付します。結果に署名するのはあなたではなく現実のラボなので、他の人にはあなたの言葉の代わりに**検証済みの事実**が見えます。さらに、確認済みの検証ごとに**患者に1 EVOLVE、ラボに1 EVOLVE**が支払われ、両者に正直でいる動機が生まれます。個々の病原体は引き続き、誰にも表示されません。

## 相手を探す

- 検索フィルター：「何を探しているか」（デーティング / 子づくり / 一妻多夫の子づくり / STD検査）、「誰を探しているか」（男性、女性、カップル）、国 → 都市のカスケード式選択、国別リスト付きの「あなたの国に来られる」、肌の色、検査の希望、STD互換のみ。
- オンボーディングウィザード：年齢（非表示に可能）、言語、自己紹介、写真。
- libp2p（gossipsub）+ Nostr上の**P2Pチャット**、HTTP APIフォールバック付き。

## 子づくり

子どもを持つことを計画する方法は2つあり、どちらも同じ考えに基づいています：本気の意思は、約束ではなくEVOLVEの現実のステークで示されます。男性のコミットメントはEvolveFundのデポジット（15 EVOLVEから、最低30日間のロック）に宿り、女性は、自分のところに届く男性向けの最低デポジットを自分で設定できます。

**子づくり。** 主導権は女性にあります：特定の男性を招待し、ボンドで彼を指名します。男性には有効なEvolveFundデポジットが必要で、両者が確認するとデポジットはロックされ、カウントダウンが始まります。妊娠は確認後14〜30日の間に報告され、二人のSTD検査とDNA検査は対面のその場で受けられます —— STD結果の新しさは重要ですが、DNAは劣化しません。父性が確認されると男性のデポジットは女性に移り、確認されなければデポジットは単純に本人へ返還されます。事実が確定するまで、何も動きません。

**一妻多夫の子づくり。** 選択は彼女に属し、プライベートのままです。彼女は48時間続くセッションを開きます —— 自身のデポジットなしで（望む場合、評信用にのみ追加することはできます）。有効なデポジットを持つ男性は参加（最大50人）して確認でき、それでステークがロックされます。セッション終了から14日後、父親が選ばれます。父親にはデポジットの返還に加え、プールからの報酬が支払われます：デポジットの2倍と、他の参加者一人につき1 EVOLVE。選ばれなかった男性はステークを失います —— 90%は女性へ、10%は選ばれた父親へ。彼女は何もリスクせず、得るだけ。男性たちは、選ばれる権利のためにステークを賭けます。

## プライバシーと機密取引

プライバシーがデフォルトです —— そしてEVOLVEは、完全に機密性の高いオンチェーン送金に向けたロードマップを進めています。

- **プライベートギフト** —— バラ🌹またはサボテン🌵（1 EVOLVE）を送り、それがあなただと誰に見せるかを選べます：_パブリック_、_受取人以外の全員には匿名_、_完全に匿名_。匿名モードではギフトは使い捨てバウチャーとして届けられ、受取人が自分のウォレットで請求するため、送信者がオンチェーンに現れることはありません。（今日の送信者の匿名性はカジュアルグレードです：資金供与トランザクションは時刻と金額で関連付けられる可能性があります。）
- **Railgunシールドウォレット** —— フィーチャーフラグで制御されるプライベートウォレット（`VITE_RAILGUN_ENABLED`、デフォルトでオフ）で、Railgunの稼働中のゼロ知識プールを使って金額とアドレスを隠します。これが真の送信者匿名性への道です。
- **Aztecプロトタイプ** —— 同じプライベート送金・プライベートボンドのロジックを、ゼロ知識のNoirサーキットとして表現したもの。Aztecが本番利用可能になるまで、明示的なゲートの内側に保持されます。[docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md)をご覧ください。
- **2ウォレットモデル** —— パブリックなステークウォレットはガバナンスに参加し、プライベートなシールドウォレットは意図的にガバナンスの重みから**除外**されます。プライバシーと投票力を分けて保ちます。

詳細：[docs/RAILGUN-INTEGRATION.md](docs/RAILGUN-INTEGRATION.md) · [docs/SHIELDED-STAKES-DESIGN.md](docs/SHIELDED-STAKES-DESIGN.md) · [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md)。

## EVOLVEトークン（テストネットのみ）

- ERC-20、最大供給量**8,000,000,000 EVOLVE**。管理者操作は48時間の`TimelockController`でゲートされます。
- **供給配分（計画）** —— 供給のほぼ全体がインサイダーではなくユーザーのために機能するよう設計されています：

| 目的                                   |        EVOLVE |
| -------------------------------------- | ------------: |
| 創設者とチーム（給与 / 報酬）          |    25,000,000 |
| DEXリザーブ（将来）                    |     4,000,000 |
| パブリックセール（計画中）             |     5,000,000 |
| 報酬リザーブ —— ラボ、患者、母親、父親 | 7,966,000,000 |

- **パブリックセール（計画中）** —— 5,000,000 EVOLVEをアプリが**1枚$0.8**で販売します。アプリが対応する任意のトークンで支払え、収益は開発資金になります。_（計画中 —— まだ開始されていません。）_
- **トラストレスなエミッション（計画中）** —— 約7,966,000,000の報酬リザーブは、流出不可能な`RewardVault`にロックされる予定です：ラボ・患者・母親・父親への報酬を通じてのみ徐々にリリースされ、ルールの変更にはガバナンス投票が必要です。創設者でさえ引き出せません。設計：[docs/REWARD-VAULT-PLAN.md](docs/REWARD-VAULT-PLAN.md)。
- **絵文字ギフトエコノミー** —— ギフトは1 EVOLVEで、既存のギフト所有者へ比例配分されます。無期限の収益モデルで、ギフトは譲渡可能です。
- **EvolveFund** —— ガバナンスの重みに算入される男性用ステーキング（最低15 EVOLVE、30日間のロック）。女性はウォレット残高を使います。
- **検証報酬** —— STD/DNA検証ごとに、検証されたユーザーへ1 EVOLVE、確認したラボへ1 EVOLVE（レート制限付きフォーセットも別途あり）。
- **ガバナンス** —— 投票の重みは、再帰的レピュテーション（8票、深さ3）、子ども・父親シェア、ステーク済みまたは保有中のEVOLVEを組み合わせて決まります。
- 将来のマルチチェーンEVOLVE送金に向けた**LayerZero OFT**統合（依存関係は準備済み。Sepolia以外にはまだ何もデプロイされていません）。

## プロジェクトを支援する

EVOLVEは独立したオープンソースプロジェクトです。役に立つと思ったら、寄付で開発を支援できます —— すべての貢献はコード、ラボとの提携、ホスティング、翻訳に使われます。

- **寄付の詳細（EVM、Moneroなど）：** [DONATE.md](DONATE.md)
- **多言語寄付ページ（34言語）：** **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**

パブリックトークンセールは**計画中**です —— 5,000,000 EVOLVEをアプリが販売します（[EVOLVEトークン](#evolveトークンテストネットのみ)を参照）。寄付はオープンソース開発を支える贈り物であり、トークン・持分・リターン・利益への権利を与えるものではありません。失っても差し支えない範囲でご寄付ください。

## アーキテクチャと技術スタック

モノレポジトリはnpm workspaces + Turborepoで管理されています：

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

主要なスマートコントラクト：`EVOLVE.sol`（ERC-20）、`ProfileNFT.sol`（ERC-721）、`TrustScore.sol`、`Voting.sol`、`Evolve2Earn.sol`（絵文字ギフト + 報酬）、`Governance.sol`、`BondManager.sol`（子づくりと一妻多夫の子づくり）、`EvolveFund.sol`、`VerificationRegistry.sol`、`DNAVerification.sol`、ERC-4337 `SmartAccountFactory` + `Paymaster`、そしてOpenZeppelinの`TimelockController`。

詳細：[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md)

## ロードマップ

進行中：ウェブアプリの本番環境への対応。計画中：オンチェーンのラボレジストリと検査認定、ラボレポート取り込み用の実際のメールプロバイダーアダプター、プロフィール上のオンチェーン検証済みアテステーション、ガバナンスでゲートされたエミッションを持つ**トラストレスなRewardVault**（[設計](docs/REWARD-VAULT-PLAN.md)）、**パブリックトークンセール**、創設者配分のトークンベスティング更新、DEX流動性の供給（現在はブロック中 —— メインネットでのトークンデプロイが必要です）。プライバシーの面では送信者プライベートなギフトは完了しており、RailgunシールドウォレットとAztecプライベートボンドの移行は[docs/ROADMAP.md](docs/ROADMAP.md)と[docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md)のチェックの内側でゲートされたままです。マルチネットワーク展開（Arbitrum、AvalancheほかのEVMチェーン）は、テストネットの安定化後に続きます。

完全なリスト：[docs/ROADMAP.md](docs/ROADMAP.md)。

## 始め方（開発者向け）

必要環境：**Node.js 20+**とnpm 10.x。

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

コントリビュートを歓迎します —— コード、バグ報告、機能の提案、プロポーザル。始める前に[CONTRIBUTING.md](CONTRIBUTING.md)と[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)をお読きください。

## リポジトリ（ミラー）

| ミラー   | URL                                        |
| -------- | ------------------------------------------ |
| GitHub   | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg | https://codeberg.org/limitafternoon/Evolve |
| GitLab   | https://gitlab.com/evolve-group3/evolve    |

## ドキュメント

- [目的と理由](docs/WHAT-AND-WHY.md) —— 課題、ビジョン、コアバリュー
- [仕組み](docs/HOW-IT-WORKS.md) —— ユーザーフローをステップごとに
- [アーキテクチャ](docs/ARCHITECTURE.md) —— モノレポ、パッケージ、データフロー
- [トークノミクス](docs/TOKENOMICS.md) —— トークンモデルと供給配分
- [RewardVaultプラン](docs/REWARD-VAULT-PLAN.md) —— トラストレスなエミッション（計画中）
- [Railgun統合](docs/RAILGUN-INTEGRATION.md) —— シールドウォレット統合のスパイク
- [シールドステーク](docs/SHIELDED-STAKES-DESIGN.md) —— プライベートな子づくりステーク（設計）
- [Aztecプロトタイプ](docs/AZTEC-PROTOTYPE.md) —— ZKプライベート送金とボンド（研究）
- [ロードマップ](docs/ROADMAP.md) —— マイルストーンと現状
- [FAQ](docs/FAQ.md) —— よくある質問
- [ウォレットガイド](docs/WALLETS.md) —— ウォレットの作り方と寄付用アドレスの取得

## ライセンス

[MIT License](LICENSE)の下でライセンスされています。

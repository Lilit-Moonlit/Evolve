[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)

# EVOLVE

**デーティング・受胎・健康証明 — デフォルトでプライベート、重要なところだけ検証済み。**

EVOLVE は、検証可能な親密なつながりのためのオープンソースの分散型プラットフォームです。デーティング、受胎、そして匿名の STD/DNA 互換性を提供します。自分の暗号資産ウォレットでサインインし（Sign-In with Ethereum）— 電話番号もメールも KYC も不要 — オンチェーンの DNA コミットメントを通じてアカウントを復元できます。健康データはあなたのものです。検査結果は自動的に解析され、個々の病原体のステータスが誰かに表示されることは**決して**なく、マッチングは匿名の互換性判定（Safe / Compatible / Caution / Risk）のみに基づきます。チャットは libp2p と Nostr 上でピアツーピアで実行され、利便性のための HTTP フォールバックも備えています。さらに、軽量な「Safety Mode」パブリックファサードと、STD 検査結果を評価するためのスタンドアロンの Companion Mode を搭載しています。

> **ステータス：初期段階のアルファ版。** EVOLVE は活発に開発中であり、完成品ではありません。
> スマートコントラクトは **Ethereum Sepolia テストネットのみ**にデプロイされています。
> **メインネットへのデプロイ、DEX、流動性、公開トークンセールはいずれも存在せず**、今後も約束されることはありません。
> 機能はいつでも変更・破損する可能性があります。ここにある情報は金融アドバイスでも投資勧誘でもありません。

## 目的と背景

従来のデーティングプラットフォームは、電話番号、メール、写真、親密な健康情報を中央データベースに引き渡すことを求めます。EVOLVE は正反対の前提から出発します。デフォルトでのプライバシー、セルフカストディ、そして単一障害点の不存在です。中核となる価値観：

- **デフォルトでのプライバシー** — 健康データが公開されることはありません。表示されるのは匿名の判定のみです。
- **BAN 耐性** — P2P ファーストのメッセージング、分散型ストレージ（IPFS / Arweave）、マルチネットワーク設計、ハードコードされたドメインなし。
- **セルフカストディアルなアイデンティティ** — ウォレットがログイン手段。メール/電話の代わりに DNA ベースの復元。
- **KYC ゲートなし** — プラットフォームの利用に身分証明書、電話、メールは一切不要です。

詳細な理由は [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md)（英語）を参照してください。

## 主な機能

### アイデンティティとプライバシー

- **SIWE ウォレットログイン**（MetaMask およびその他の EVM ウォレット）— 検閲耐性のある緊急脱出口。
- **DNA アカウント復元** — DNA 検査結果がハッシュ化され（SHA-256、`bytes32` としてオンチェーンでコミット）、電話やメールなしでアクセスを復元できます。
- **アカウントアブストラクション（ERC-4337）** — ガスレス・オンボーディングのためのスマートアカウントとペイマスター。SIWE は常に利用可能です。

### 匿名の健康互換性

- STD 検査結果をテキストまたは PDF でアップロード（テキスト層の抽出、スキャンページ向けの OCR フォールバック付き）。
- パーサーは 8 つの病原体を認識します：HIV-1/2、梅毒、クラミジア、淋病、HSV-1、HSV-2、B 型肝炎、C 型肝炎（英語・ウクライナ語・ロシア語の報告書形式）。
- **個々の病原体ステータスが他のユーザーに表示されることは決してありません。** プロフィールには匿名の判定のみが表示されます：**Safe / Compatible / Caution / Risk**。
- オンチェーンの DNA 検証記録（`DNAVerification.sol`）が復元と検証の各フローを支えます。

### プロフィール、検索、コミュニケーション

- 検索フィルター：「何を探しているか」（デーティング / 受胎 / 多夫制の受胎 / STD 検査）、「誰を探しているか」（男性、女性、カップル）、国 → 都市のカスケード選択、国別リスト付きの「あなたの国に来られる」、肌の色、検査の好み、STD 互換のみ。
- オンボーディングウィザード：年齢（非表示可能）、言語、自己紹介、写真。
- **写真のプライバシー**：写真はデフォルトでぼかされます。所有者が 15 秒または永続的な閲覧を、自発的にまたはリクエストに応じて許可します。閲覧は無料です。
- libp2p（gossipsub）+ Nostr を使った **P2P チャット**。HTTP API フォールバック付き。

### 受胎モード

- **モード 2 — Pregnancy Bond**：女性がボンドを作成し、男性が EVOLVE をステークし（現在のテストネットビルドでは ≥ 100）、双方が確認します。妊娠と父性の確認後、ステークは女性に移転されます。
- **モード 3 — Cryptic Choice**：女性が 48 時間のセッションを開き、男性がステークして参加します。彼女が父親を選択 — 選ばれた人のステークは返還され、残りの参加者は 90% が彼女へ / 10% が選ばれた父親へ分配されます。

### 検査機関と検証

- **検査機関パートナーフロー**：検査機関はパートナーとして登録し、QR コードと顔照合で患者を検証し、STD レポート（OCR 抽出付きの PDF/テキスト）を添付します。
- **Companion Mode**：デーティングプラットフォームに登録せずに STD 検査結果を評価できるスタンドアロンのフロー。
- **Safety Mode**（`VITE_PRODUCT_MODE=safety`）：制限付きの公開ファサード（STD ステータス、公開プロフィールリンク、互換性チェック）。特定の法域やアプリストアでデーティング/受胎機能が制限されても動作し続けます。

### EVOLVE トークン（テストネットのみ）

- ERC-20、最大供給量 8,000,000,000 EVOLVE、管理者操作は 48 時間の TimelockController で保護されています。
- **絵文字ギフトエコノミー**：ギフトは 1 EVOLVE で購入でき、その 1 EVOLVE は既存のギフト所有者に比例分配されます — ホルダー向けの永続的な収益モデル。ギフトは譲渡可能です。
- **EvolveFund**：男性のステーキング（最低 15 EVOLVE、30 日間ロック）で、ガバナンスの重みに算入されます。女性はウォレット残高を使用します。
- **検証報酬**：STD/DNA 検証時に、検証されたユーザーに 1 EVOLVE、確認した検査機関に 1 EVOLVE が支払われます（加えて、回数制限付きのテストフォーセットあり）。
- ガバナンスの投票重みは、再帰的レピュテーション（8 票、深さ 3）、子供/父親シェア、ステークまたは保有されている EVOLVE を組み合わせて計算されます。
- 将来のマルチチェーン EVOLVE 転送に向けた **LayerZero OFT** 統合（依存関係は導入済み。Sepolia 以外にはまだ何もデプロイされていません）。

### プラットフォーム

- ウェブアプリ（PWA としてインストール可能）と Expo/React Native モバイルアプリ。
- インターフェースは **34 言語**に翻訳されています。
- マルチネットワーク対応：18 の EVM ネットワーク設定（Arbitrum と Avalanche が計画中の主要 L2 — **まだデプロイされていません**）。

## アーキテクチャと技術スタック

npm workspaces + Turborepo で管理されるモノレポ：

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

主要なスマートコントラクト：`EVOLVE.sol`（ERC-20）、`ProfileNFT.sol`（ERC-721）、`TrustScore.sol`、`Voting.sol`、`Evolve2Earn.sol`（絵文字ギフト + 報酬）、`Governance.sol`、`BondManager.sol`（モード 2 & 3）、`EvolveFund.sol`、`VerificationRegistry.sol`、`DNAVerification.sol`、ERC-4337 `SmartAccountFactory` + `Paymaster`、そして OpenZeppelin の `TimelockController`。

詳細：[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md)（英語）

## ロードマップ

進行中：ウェブアプリの本番運用への対応。計画中：オンチェーンの検査機関レジストリと検査認証、検査レポート取り込み用の実際のメールプロバイダーアダプター、プロフィール上のオンチェーン検証済みアテステーション、創設者/開発者割り当てのトークンベスティング更新、DEX 流動性の提供（現在はブロック中 — メインネットでのトークンデプロイが必要）。マルチネットワーク拡張（Arbitrum、Avalanche その他の EVM チェーン）は、テストネットの強化後に実施されます。

完全なリスト：[docs/ROADMAP.md](docs/ROADMAP.md)（英語）。

## はじめに（開発者向け）

必要要件：**Node.js 20+** および npm 10.x。

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

## コントリビューション

コントリビューションを歓迎します — コード、バグ報告、機能提案、プロポーザル。始める前に [CONTRIBUTING.md](CONTRIBUTING.md) と [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) をお読みください。

## プロジェクトを支援する

EVOLVE が役に立つと思ったら、寄付で開発を支援できます — 詳細は [DONATE.md](DONATE.md)。ウェブページをご希望ですか？多言語対応の寄付ページ（34 言語）をご利用ください：**https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**。

**トークンセールは存在せず、今後も行われることはありません。** EVOLVE トークンに「投資」することはできません。寄付はオープンソース開発を支援するための贈り物であり、寄付者にトークン、持分、リターン、その他いかなる金銭的請求権も与えるものではありません。

## リポジトリ（ミラー）

| ミラー   | URL                                        |
| -------- | ------------------------------------------ |
| GitHub   | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg | https://codeberg.org/limitafternoon/Evolve |
| GitLab   | https://gitlab.com/evolve-group3/evolve    |

## ドキュメント

- [目的と背景](docs/WHAT-AND-WHY.md) — 問題、ビジョン、中核となる価値観（英語）
- [仕組み](docs/HOW-IT-WORKS.md) — ユーザーフローをステップごとに解説（英語）
- [アーキテクチャ](docs/ARCHITECTURE.md) — モノレポ、パッケージ、データフロー（英語）
- [トークノミクス](docs/TOKENOMICS.md) — トークンモデルと供給分布（英語）
- [ロードマップ](docs/ROADMAP.md) — マイルストーンと現在のステータス（英語）
- [FAQ](docs/FAQ.md) — よくある質問（英語）
- [ウォレットガイド](docs/WALLETS.md) — ウォレットの作成方法と寄付用アドレスの取得（英語）

## ライセンス

[MIT License](LICENSE) の下でライセンスされています。

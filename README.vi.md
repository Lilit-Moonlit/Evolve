[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)

# EVOLVE

**Hẹn hò, thụ thai và sức khỏe đã xác minh — riêng tư theo mặc định, đáng tin ở nơi quan trọng.**

EVOLVE là một nền tảng mã nguồn mở, phi tập trung dành cho những người đã chán việc đưa số điện thoại, gương mặt và dữ liệu sức khỏe riêng tư nhất của mình vào cơ sở dữ liệu của người khác. Bạn đăng nhập bằng ví tiền mã hóa của chính mình — không cần điện thoại, không cần email, không cần KYC — và có thể khôi phục tài khoản thông qua cam kết DNA on-chain. Dữ liệu sức khỏe của bạn vẫn là của bạn: kết quả xét nghiệm được phân tích tự động, trạng thái từng mầm bệnh **không bao giờ** hiển thị với ai, và việc ghép đôi chỉ dựa trên các phán quyết ẩn danh (Safe / Compatible / Caution / Risk). Chat chạy ngang hàng qua libp2p và Nostr, kèm phương thức HTTP dự phòng để tiện lợi.

> **Trạng thái — nền tảng hoạt động ngay hôm nay; mainnet và DEX là bước tiếp theo.**
> Hẹn hò, thụ thai, xác minh sức khỏe, quy trình phòng xét nghiệm, chat P2P, token EVOLVE và quản trị đều đang vận hành. Còn phía trước: **triển khai mainnet và thanh khoản DEX**, cùng **đợt bán công khai theo kế hoạch** (xem [Token EVOLVE](#token-evolve-chỉ-trên-testnet)).
> Hợp đồng thông minh được triển khai **chỉ trên testnet Ethereum Sepolia**. Không có gì ở đây là tư vấn tài chính hay đề nghị đầu tư.

> **Thấy EVOLVE hữu ích? Hỗ trợ việc phát triển — mọi quyên góp đều dành cho mã nguồn, hợp tác phòng xét nghiệm, hosting và dịch thuật → [DONATE.md](DONATE.md)**

## Không có gì phải sợ

EVOLVE được xây dựng xoay quanh những câu hỏi mà người dùng thực sự đặt ra trước khi tin tưởng một nền tảng như thế này.

| Nỗi lo                                                | EVOLVE đã làm gì để giải quyết                                                                                                                                                                         |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| "Dữ liệu sức khỏe của tôi sẽ bị rò rỉ."               | Kết quả từng mầm bệnh **không bao giờ** được hiển thị với ai — chỉ có phán quyết ẩn danh: Safe / Compatible / Caution / Risk.                                                                          |
| "Ảnh của tôi sẽ bị phát tán đâu đó."                  | Ảnh được làm mờ theo mặc định. Chủ sở hữu cấp quyền xem **15 giây** hoặc **vĩnh viễn** — theo yêu cầu hoặc chủ động. Việc xem là miễn phí.                                                             |
| "Tôi sẽ phải nộp giấy tờ tùy thân hay số điện thoại." | Đăng nhập bằng ví (SIWE). Không điện thoại, không email, không KYC. Khôi phục tài khoản thông qua cam kết DNA on-chain.                                                                                |
| "Anh ấy hoặc cô ấy nói dối về tình trạng sức khỏe."   | Kết quả được **xác minh bởi phòng xét nghiệm** (QR + đối chiếu khuôn mặt), và các xét nghiệm của cặp đôi được thực hiện **tại buổi gặp** — kết quả STD gần đây mới quan trọng, DNA không bị "lão hóa". |
| "Liệu ai đó sẽ lấy tiền của tôi rồi biến mất?"        | Thụ thai dựa trên khoản cọc thật sự có rủi ro: tiền cọc của người đàn ông chỉ chuyển đi khi quyền cha **được xác nhận**; nếu không, nó đơn giản được hoàn lại cho anh ấy.                              |
| "Token này có phải trò chơi bơm tháo không?"          | Hiện chưa có đợt bán nào; mã nguồn mở (MIT); phần dự trữ chưa lưu hành theo kế hoạch sẽ bị khóa trong **vault không thể rút cạn** mà chính người sáng lập cũng không rút được.                         |
| "Nền tảng có thể bị đóng cửa hoặc cấm không?"         | Nhắn tin ngang hàng lên trước, lưu trữ phi tập trung (IPFS / Arweave), 18 cấu hình mạng EVM, và không tên miền bị cứng hóa trong mã nguồn.                                                             |

## Cái gì & Tại sao

Các ứng dụng hẹn hò truyền thống yêu cầu bạn đổi số điện thoại, email, ảnh và chi tiết sức khỏe riêng tư lấy một cơ sở dữ liệu trung tâm — rồi phải tin cơ sở dữ liệu đó mãi mãi. EVOLVE bắt đầu từ tiền đề ngược lại: **riêng tư theo mặc định, tự quản lý tài sản, và không có điểm lỗi duy nhất**.

- **Riêng tư theo mặc định** — dữ liệu sức khỏe không bao giờ bị lộ; chỉ có phán quyết ẩn danh.
- **Kháng lệnh cấm** — nhắn tin P2P lên trước, lưu trữ phi tập trung, thiết kế đa mạng, không tên miền cứng hóa.
- **Danh tính tự quản** — ví của bạn là cách đăng nhập; khôi phục dựa trên DNA thay vì email hay điện thoại.
- **Không cổng KYC** — không cần giấy tờ tùy thân chính phủ, điện thoại hay email để dùng nền tảng.

Đọc toàn bộ lý do tại [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md).

## Sức khỏe thực sự đáng tin

- Tải lên kết quả xét nghiệm STD dạng văn bản thuần hoặc PDF (trích xuất lớp văn bản, kèm OCR dự phòng cho bản quét).
- Bộ phân tích nhận biết 8 mầm bệnh: HIV-1/2, Giang mai, Chlamydia, Lậu, HSV-1, HSV-2, Viêm gan B, Viêm gan C — theo các định dạng báo cáo tiếng Anh, tiếng Ukraina và tiếng Nga.
- **Trạng thái từng mầm bệnh không bao giờ hiển thị với người dùng khác.** Hồ sơ chỉ hiển thị phán quyết ẩn danh: **Safe / Compatible / Caution / Risk**.
- Hồ sơ DNA on-chain (`DNAVerification.sol`) giúp khôi phục và xác minh.

### Phòng xét nghiệm đối tác — bằng chứng, không phải lời hứa

Hãy đến phòng xét nghiệm đối tác và xuất trình mã QR. Phòng xét nghiệm quét mã, xác nhận danh tính của bạn bằng **đối chiếu khuôn mặt** (để không ai khác nhận được kết quả của bạn) và đính kèm báo cáo STD — PDF, bản quét hoặc văn bản, kể cả OCR kém chất lượng. Kết quả được ký bởi một phòng xét nghiệm thật, không phải bởi bạn, nên người khác thấy một **sự thật đã xác minh** thay vì lời nói của bạn. Và mỗi lần xác minh thành công trả **1 EVOLVE cho bệnh nhân và 1 EVOLVE cho phòng xét nghiệm** — cả hai bên đều có lý do để trung thực. Từng mầm bệnh vẫn không bao giờ được hiển thị với ai.

## Tìm người phù hợp

- Bộ lọc tìm kiếm: "Bạn đang tìm gì" (hẹn hò / thụ thai / thụ thai đa phu / xét nghiệm STD), "Bạn đang tìm ai" (nam, nữ, cặp đôi), danh sách chọn quốc gia → thành phố dạng tầng, "có thể đến nước bạn" kèm danh sách từng nước, màu da, sở thích xét nghiệm, chỉ hiện người tương thích STD.
- Trình hướng dẫn ban đầu: tuổi (có thể ẩn), ngôn ngữ, tiểu sử, ảnh.
- **Chat P2P** qua libp2p (gossipsub) + Nostr, kèm phương án dự phòng HTTP API.

## Thụ thai

Hai cách lên kế hoạch sinh con, và cả hai đều dựa trên cùng một ý tưởng: ý định thật sự được thể hiện bằng khoản cọc thật trong EVOLVE — không bao giờ bằng lời hứa. Cam kết của người đàn ông nằm trong tiền cọc EvolveFund của anh ta (từ 15 EVOLVE, khóa ít nhất 30 ngày), còn người phụ nữ có thể tự đặt mức tiền cọc tối thiểu cho những người đàn ông tiếp cận mình.

**Thụ thai.** Người phụ nữ dẫn dắt: cô ấy mời một người đàn ông cụ thể và nêu tên anh ta trong một bond. Anh ta cần có tiền cọc EvolveFund đang hiệu lực; khi cả hai xác nhận, nó bị khóa và bộ đếm bắt đầu chạy. Thai kỳ được báo cáo trong vòng 14 đến 30 ngày sau xác nhận, và các xét nghiệm STD, DNA của cặp đôi được thực hiện ngay tại buổi gặp — kết quả STD gần đây mới quan trọng, DNA không bị lão hóa. Khi quyền cha được xác nhận, tiền cọc của người đàn ông chuyển sang người phụ nữ; nếu không xác nhận, tiền cọc đơn giản được hoàn lại cho anh ta. Chưa xác định được sự thật thì chưa có gì đổi chủ.

**Thụ thai đa phu.** Quyền lựa chọn thuộc về cô ấy, và giữ kín. Cô mở một phiên kéo dài 48 giờ — không cần tiền cọc của riêng mình (nếu muốn, cô có thể thêm chỉ để tăng danh tiếng). Những người đàn ông có tiền cọc hiệu lực có thể tham gia — tối đa 50 người — và xác nhận, điều này khóa khoản cọc của họ. Mười bốn ngày sau khi phiên đóng, người cha được chọn. Anh ta nhận lại tiền cọc cộng phần thưởng từ quỹ: gấp đôi tiền cọc của mình và 1 EVOLVE cho mỗi người tham gia còn lại. Những người đàn ông không được chọn mất khoản cọc — 90% cho người phụ nữ, 10% cho người cha được chọn. Cô ấy không rủi ro gì và chỉ có thể được; những người đàn ông đặt khoản cọc của mình sau quyền được chọn.

## Token EVOLVE (chỉ trên testnet)

- ERC-20, tổng cung tối đa **8,000,000,000 EVOLVE**. Các thao tác quản trị bị kiểm soát bởi `TimelockController` 48 giờ.
- **Phân bổ cung theo kế hoạch** — được thiết kế để gần như toàn bộ nguồn cung phục vụ người dùng, chứ không phải người trong cuộc:

| Mục đích                                                         |        EVOLVE |
| ---------------------------------------------------------------- | ------------: |
| Người sáng lập và đội ngũ (lương / thưởng)                       |    25,000,000 |
| Dự trữ DEX (tương lai)                                           |     4,000,000 |
| Bán công khai (theo kế hoạch)                                    |     5,000,000 |
| Dự trữ thưởng — phòng xét nghiệm, bệnh nhân, người mẹ, người cha | 7,966,000,000 |

- **Bán công khai theo kế hoạch** — 5,000,000 EVOLVE do ứng dụng bán với giá **$0.8 mỗi token**, thanh toán bằng bất kỳ token nào ứng dụng hỗ trợ; số thu dùng để tài trợ phát triển. _(Theo kế hoạch — chưa hoạt động.)_
- **Phát hành phi tín nhiệm (theo kế hoạch)** — khoản dự trữ thưởng ~7,966,000,000 sẽ bị khóa trong `RewardVault` không thể rút cạn: chỉ giải phóng dần dần qua các phần thưởng cho phòng xét nghiệm, bệnh nhân, người mẹ và người cha; thay đổi quy tắc phải qua bỏ phiếu quản trị. Chính người sáng lập cũng không thể rút. Thiết kế: [docs/REWARD-VAULT-PLAN.md](docs/REWARD-VAULT-PLAN.md).
- **Nền kinh tế quà tặng emoji** — một quà tặng giá 1 EVOLVE, chia theo tỷ lệ cho những người sở hữu quà tặng hiện có; mô hình doanh thu vĩnh viễn, và quà tặng có thể chuyển nhượng.
- **EvolveFund** — staking dành cho nam (tối thiểu 15 EVOLVE, khóa 30 ngày) được tính vào trọng số quản trị; phụ nữ dùng số dư ví.
- **Thưởng xác minh** — 1 EVOLVE cho người dùng được xác minh và 1 EVOLVE cho phòng xét nghiệm xác nhận trong mỗi lần xác minh STD/DNA (cộng một faucet có giới hạn tốc độ).
- **Quản trị** — trọng số phiếu kết hợp danh tiếng đệ quy (8 phiếu, độ sâu 3), tỷ lệ con cái/quyền cha, và EVOLVE đã stake hoặc đang nắm giữ.
- Tích hợp **LayerZero OFT** cho các chuyển EVOLVE đa chuỗi trong tương lai (các dependency đã sẵn sàng; chưa triển khai gì ngoài Sepolia).

## Ủng hộ dự án

EVOLVE độc lập và mã nguồn mở. Nếu nó hữu ích với bạn, bạn có thể ủng hộ việc phát triển bằng quyên góp — mọi đóng góp đều dành cho mã nguồn, hợp tác phòng xét nghiệm, hosting và dịch thuật.

- **Chi tiết ủng hộ (EVM, Monero và hơn thế):** [DONATE.md](DONATE.md)
- **Trang ủng hộ đa ngôn ngữ (34 ngôn ngữ):** **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**

Đợt bán token công khai nằm trong lộ trình nhưng hiện **chưa** hoạt động. Quyên góp là những món quà hỗ trợ phát triển mã nguồn mở và không tạo ra bất kỳ quyền nào với token, cổ phần, lợi nhuận hay hoàn vốn. Vui lòng chỉ đóng góp số tiền bạn đủ khả năng để mất.

## Kiến trúc & Stack công nghệ

Monorepo được quản lý bằng npm workspaces + Turborepo:

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

Các hợp đồng thông minh chính: `EVOLVE.sol` (ERC-20), `ProfileNFT.sol` (ERC-721), `TrustScore.sol`, `Voting.sol`, `Evolve2Earn.sol` (quà tặng emoji + thưởng), `Governance.sol`, `BondManager.sol` (thụ thai và thụ thai đa phu), `EvolveFund.sol`, `VerificationRegistry.sol`, `DNAVerification.sol`, ERC-4337 `SmartAccountFactory` + `Paymaster`, và `TimelockController` của OpenZeppelin.

Chi tiết: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md)

## Lộ trình

Đang tiến hành: hoàn thiện bản production của ứng dụng web. Theo kế hoạch: registry phòng xét nghiệm on-chain và chứng nhận xét nghiệm, adapter mail-provider thật cho việc nhận báo cáo xét nghiệm, chứng thực đã xác minh on-chain trên hồ sơ, **RewardVault phi tín nhiệm** với cơ chế phát hành kiểm soát bởi quản trị ([thiết kế](docs/REWARD-VAULT-PLAN.md)), **đợt bán token công khai**, cập nhật vesting token cho phần người sáng lập, và cung cấp thanh khoản DEX (hiện đang bị chặn — cần triển khai token trên mainnet). Mở rộng đa mạng (Arbitrum, Avalanche và các chuỗi EVM khác) sẽ theo sau khi testnet được củng cố.

Danh sách đầy đủ: [docs/ROADMAP.md](docs/ROADMAP.md).

## Bắt đầu (dành cho nhà phát triển)

Yêu cầu: **Node.js 20+** và npm 10.x.

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

## Đóng góp

Rất hoan nghênh đóng góp — mã nguồn, báo cáo lỗi, đề xuất tính năng và proposal. Vui lòng đọc [CONTRIBUTING.md](CONTRIBUTING.md) và [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) của chúng tôi trước khi bắt đầu.

## Kho mã (Mirror)

| Mirror   | URL                                        |
| -------- | ------------------------------------------ |
| GitHub   | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg | https://codeberg.org/limitafternoon/Evolve |
| GitLab   | https://gitlab.com/evolve-group3/evolve    |

## Tài liệu

- [Cái gì & Tại sao](docs/WHAT-AND-WHY.md) — vấn đề, tầm nhìn, giá trị cốt lõi
- [Cách hoạt động](docs/HOW-IT-WORKS.md) — luồng người dùng, từng bước
- [Kiến trúc](docs/ARCHITECTURE.md) — monorepo, packages, luồng dữ liệu
- [Tokenomics](docs/TOKENOMICS.md) — mô hình token và phân bổ nguồn cung
- [Kế hoạch RewardVault](docs/REWARD-VAULT-PLAN.md) — phát hành phi tín nhiệm (theo kế hoạch)
- [Lộ trình](docs/ROADMAP.md) — cột mốc và trạng thái hiện tại
- [FAQ](docs/FAQ.md) — câu hỏi thường gặp
- [Hướng dẫn ví](docs/WALLETS.md) — cách tạo ví và lấy địa chỉ ủng hộ

## Giấy phép

Được cấp phép theo [MIT License](LICENSE).

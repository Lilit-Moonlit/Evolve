[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)

# EVOLVE

**Hẹn hò, thụ thai và xác minh sức khỏe — riêng tư mặc định, xác minh ở nơi quan trọng.**

EVOLVE là một nền tảng mã nguồn mở, phi tập trung dành cho những kết nối thân mật có thể xác minh: hẹn hò, thụ thai và khả năng tương thích STD/DNA ẩn danh. Bạn đăng nhập bằng ví điện tử của riêng mình (Sign-In with Ethereum) — không cần số điện thoại, không cần email, không cần KYC — và có thể khôi phục tài khoản thông qua cam kết DNA trên chuỗi. Dữ liệu sức khỏe vẫn là của bạn: kết quả xét nghiệm được phân tích tự động, tình trạng từng mầm bệnh **không bao giờ** được hiển thị cho bất kỳ ai, và việc ghép đôi chỉ dựa trên các kết luận ẩn danh (Safe / Compatible / Caution / Risk). Trò chuyện chạy ngang hàng qua libp2p và Nostr, với HTTP dự phòng để thuận tiện; ứng dụng còn đi kèm giao diện công khai "Safety Mode" nhẹ nhàng cùng Chế độ Companion độc lập để đánh giá kết quả xét nghiệm STD.

> **Trạng thái: alpha giai đoạn đầu.** EVOLVE đang được phát triển tích cực và chưa phải là sản phẩm hoàn chỉnh.
> Hợp đồng thông minh chỉ được triển khai **trên mạng thử nghiệm Ethereum Sepolia**.
> **Không có triển khai mainnet, không có DEX, không có thanh khoản và không có đợt bán token công khai** — và không hứa hẹn điều gì trong số đó.
> Tính năng có thể thay đổi hoặc hỏng bất cứ lúc nào. Không có gì ở đây là lời khuyên tài chính hay đề nghị đầu tư.

## Mục đích & Lý do

Các nền tảng hẹn hò truyền thống yêu cầu bạn giao nộp số điện thoại, email, ảnh và chi tiết sức khỏe thân mật cho một cơ sở dữ liệu trung tâm. EVOLVE xuất phát từ tiền đề ngược lại: riêng tư mặc định, tự quản lý tài sản, không có điểm lỗi trung tâm. Giá trị cốt lõi:

- **Riêng tư mặc định** — dữ liệu sức khỏe không bao giờ bị lộ; chỉ có các kết luận ẩn danh.
- **Khả năng chống cấm chặn** — nhắn tin ưu tiên P2P, lưu trữ phi tập trung (IPFS / Arweave), thiết kế đa mạng, không cố định tên miền trong mã.
- **Danh tính tự quản** — ví của bạn là thông tin đăng nhập; khôi phục dựa trên DNA thay vì email/điện thoại.
- **Không rào cản KYC** — không cần giấy tờ tùy thân chính phủ, điện thoại hay email để sử dụng nền tảng.

Đọc toàn bộ lý lẽ trong [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md) (bản tiếng Anh).

## Tính năng chính

### Danh tính & Quyền riêng tư

- **Đăng nhập bằng ví SIWE** (MetaMask và các ví EVM khác) — lối thoát kháng kiểm duyệt.
- **Khôi phục tài khoản bằng DNA** — kết quả xét nghiệm DNA của bạn được băm (SHA-256, cam kết trên chuỗi dưới dạng `bytes32`) và có thể khôi phục quyền truy cập mà không cần điện thoại hay email.
- **Trừu tượng hóa tài khoản (ERC-4337)** — tài khoản thông minh và paymaster để làm quen nền tảng không tốn gas; SIWE luôn vẫn khả dụng.

### Khả năng tương thích sức khỏe ẩn danh

- Tải lên kết quả xét nghiệm STD dạng văn bản thô hoặc PDF (trích xuất lớp văn bản, có OCR dự phòng cho trang quét).
- Bộ phân tích nhận diện 8 mầm bệnh: HIV-1/2, giang mai, chlamydia, lậu, HSV-1, HSV-2, viêm gan B, viêm gan C (định dạng báo cáo tiếng Anh, tiếng Ukraina và tiếng Nga).
- **Tình trạng từng mầm bệnh không bao giờ hiển thị cho người dùng khác.** Hồ sơ chỉ hiển thị kết luận ẩn danh: **Safe / Compatible / Caution / Risk**.
- Các bản ghi xác minh DNA trên chuỗi (`DNAVerification.sol`) nuôi dưỡng các luồng khôi phục và xác minh.

### Hồ sơ, Tìm kiếm & Giao tiếp

- Bộ lọc tìm kiếm: "Bạn đang tìm gì" (hẹn hò / thụ thai / thụ thai đa phu / xét nghiệm STD), "Bạn đang tìm ai" (nam, nữ, cặp đôi), chọn quốc gia → thành phố dạng tầng, "có thể đến nước bạn" kèm danh sách theo từng nước, màu da, ưu tiên xét nghiệm, chỉ tương thích STD.
- Trình hướng dẫn ban đầu: tuổi (có thể ẩn), ngôn ngữ, tiểu sử, ảnh.
- **Quyền riêng tư ảnh**: ảnh được làm mờ mặc định; chủ sở hữu cấp quyền xem 15 giây hoặc vĩnh viễn, chủ động hoặc theo yêu cầu. Việc xem là miễn phí.
- **Trò chuyện P2P** qua libp2p (gossipsub) + Nostr, với API HTTP dự phòng.

### Các chế độ thụ thai

- **Chế độ 2 — Pregnancy Bond**: phụ nữ tạo bond, nam giới stake EVOLVE (≥ 100 trên bản dựng thử nghiệm hiện tại), cả hai xác nhận; sau khi xác nhận mang thai và cha đẻ, khoản stake chuyển cho người phụ nữ.
- **Chế độ 3 — Cryptic Choice**: phụ nữ mở phiên 48 giờ, nam giới tham gia bằng cách stake; cô chọn người cha — stake của anh ấy được hoàn lại, số còn lại chia: 90% cho cô / 10% cho người cha được chọn.

### Phòng xét nghiệm & Xác minh

- **Luồng đối tác phòng xét nghiệm**: phòng xét nghiệm đăng ký làm đối tác, xác minh bệnh nhân qua mã QR và khớp khuôn mặt, đính kèm báo cáo STD (PDF/văn bản có trích xuất OCR).
- **Chế độ Companion**: luồng độc lập để đánh giá kết quả xét nghiệm STD mà không cần tham gia nền tảng hẹn hò.
- **Chế độ Safety** (`VITE_PRODUCT_MODE=safety`): giao diện công khai giới hạn (trạng thái STD, liên kết hồ sơ công khai, kiểm tra tương thích) vẫn hoạt động ngay cả khi các tính năng hẹn hò/thụ thai bị hạn chế ở một khu vực pháp lý hoặc cửa hàng ứng dụng.

### Token EVOLVE (chỉ trên mạng thử nghiệm)

- ERC-20, tổng cung tối đa 8.000.000.000 EVOLVE, các hành động quản trị bị chặn bởi TimelockController 48 giờ.
- **Nền kinh tế quà tặng emoji**: một quà tặng có giá 1 EVOLVE, được chia tỷ lệ cho các chủ sở hữu quà tặng hiện có — mô hình doanh thu vĩnh viễn cho người nắm giữ; quà tặng có thể chuyển nhượng.
- **EvolveFund**: stake dành cho nam (tối thiểu 15 EVOLVE, khóa 30 ngày) được tính vào trọng số quản trị; nữ sử dụng số dư ví.
- **Phần thưởng xác minh**: 1 EVOLVE cho người dùng được xác minh và 1 EVOLVE cho phòng xét nghiệm xác nhận khi xác minh STD/DNA (cộng thêm vòi thử nghiệm có giới hạn tần suất).
- Trọng số phiếu bầu quản trị kết hợp danh tiếng đệ quy (8 phiếu, độ sâu 3), tỷ lệ con cái/cha đẻ, và EVOLVE đã stake hoặc nắm giữ.
- Tích hợp **LayerZero OFT** cho các giao dịch chuyển EVOLVE đa chuỗi trong tương lai (các phần phụ thuộc đã sẵn sàng; chưa triển khai gì ngoài Sepolia).

### Nền tảng

- Ứng dụng web (cài được dưới dạng PWA) và ứng dụng di động Expo/React Native.
- Giao diện được dịch sang **34 ngôn ngữ**.
- Sẵn sàng đa mạng: 18 cấu hình mạng EVM (Arbitrum và Avalanche là các L2 chính theo kế hoạch — **chưa triển khai**).

## Kiến trúc & Công nghệ

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

Các hợp đồng thông minh chính: `EVOLVE.sol` (ERC-20), `ProfileNFT.sol` (ERC-721), `TrustScore.sol`, `Voting.sol`, `Evolve2Earn.sol` (quà tặng emoji + phần thưởng), `Governance.sol`, `BondManager.sol` (Chế độ 2 & 3), `EvolveFund.sol`, `VerificationRegistry.sol`, `DNAVerification.sol`, ERC-4337 `SmartAccountFactory` + `Paymaster`, và một `TimelockController` của OpenZeppelin.

Chi tiết: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md) (bản tiếng Anh).

## Lộ trình

Đang tiến hành: hoàn thiện sẵn sàng sản xuất của ứng dụng web. Dự kiến: sổ đăng ký phòng xét nghiệm trên chuỗi và chứng nhận xét nghiệm, bộ chuyển đổi nhà cung cấp thư điện tử thực cho việc tiếp nhận báo cáo xét nghiệm, chứng thực đã xác minh trên chuỗi hiển thị trên hồ sơ, cập nhật vesting token cho phân bổ founder/nhà phát triển, cung cấp thanh khoản DEX (hiện bị chặn — cần triển khai token trên mainnet). Mở rộng đa mạng (Arbitrum, Avalanche và các chuỗi EVM khác) theo sau sau khi củng cố mạng thử nghiệm.

Danh sách đầy đủ: [docs/ROADMAP.md](docs/ROADMAP.md) (bản tiếng Anh).

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

Mọi đóng góp đều được chào đón — mã nguồn, báo cáo lỗi, đề xuất tính năng và đề xuất. Vui lòng đọc [CONTRIBUTING.md](CONTRIBUTING.md) và [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) của chúng tôi trước khi bắt đầu.

## Ủng hộ dự án

Nếu bạn thấy EVOLVE hữu ích, bạn có thể hỗ trợ việc phát triển bằng quyên góp — chi tiết trong [DONATE.md](DONATE.md). Thích trang web hơn? Hãy dùng trang quyên góp đa ngôn ngữ (34 ngôn ngữ): **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**.

**Không có đợt bán token nào và sẽ không bao giờ có.** Không thể "đầu tư" vào token EVOLVE; quyên góp là món quà hỗ trợ phát triển mã nguồn mở và không trao cho người quyên góp bất kỳ quyền nào đối với token, cổ phần, lợi nhuận hay bất kỳ yêu cầu tài chính nào.

## Kho lưu trữ (Bản sao)

| Bản sao  | URL                                        |
| -------- | ------------------------------------------ |
| GitHub   | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg | https://codeberg.org/limitafternoon/Evolve |
| GitLab   | https://gitlab.com/evolve-group3/evolve    |

## Tài liệu

- [Mục đích & Lý do](docs/WHAT-AND-WHY.md) — vấn đề, tầm nhìn, giá trị cốt lõi (tiếng Anh)
- [Cách hoạt động](docs/HOW-IT-WORKS.md) — luồng người dùng, từng bước (tiếng Anh)
- [Kiến trúc](docs/ARCHITECTURE.md) — monorepo, các gói, luồng dữ liệu (tiếng Anh)
- [Tokenomics](docs/TOKENOMICS.md) — mô hình token và phân bổ nguồn cung (tiếng Anh)
- [Lộ trình](docs/ROADMAP.md) — cột mốc và trạng thái hiện tại (tiếng Anh)
- [FAQ](docs/FAQ.md) — câu hỏi thường gặp (tiếng Anh)
- [Hướng dẫn ví](docs/WALLETS.md) — cách tạo ví và lấy địa chỉ quyên góp (tiếng Anh)

## Giấy phép

Được cấp phép theo [Giấy phép MIT](LICENSE).

[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)
<!-- evolve-readme-sync: 3796750887b0bd65 -->

# EVOLVE

**Hẹn hò, thụ thai và sức khỏe được xác minh — riêng tư theo mặc định, đáng tin ở nơi quan trọng.**

EVOLVE là một nền tảng phi tập trung mã nguồn mở dành cho những người đã chán việc giao số điện thoại, khuôn mặt và dữ liệu sức khỏe riêng tư nhất của mình cho cơ sở dữ liệu của người khác. Bạn đăng nhập bằng ví tiền mã hóa của chính mình — không điện thoại, không email, không KYC — và bạn có thể lấy lại tài khoản thông qua một cam kết DNA trên chuỗi. Dữ liệu sức khỏe của bạn vẫn là của bạn: kết quả xét nghiệm được phân tích tự động, trạng thái từng mầm bệnh **không bao giờ** được hiển thị cho bất kỳ ai, và việc ghép đôi chỉ dựa trên các phán quyết tương thích ẩn danh (Safe / Compatible / Caution / Risk). Trò chuyện chạy ngang hàng qua libp2p và Nostr, với phương án dự phòng HTTP để thuận tiện. Quà tặng và giao dịch đang tiến tới sự bảo mật hoàn toàn: quà tặng riêng tư đã hoạt động, cùng với ví bảo vệ Railgun và nguyên mẫu zero-knowledge Aztec trên lộ trình (xem [Quyền riêng tư và giao dịch bảo mật](#quyền-riêng-tư--giao-dịch-bảo-mật)).

> **Trạng thái — chế độ demo, đang phát triển tích cực.**
> Hẹn hò, thụ thai, xác minh sức khỏe, quy trình phòng xét nghiệm, trò chuyện P2P, token EVOLVE và quản trị đều đã được triển khai và chạy trong **bản demo cục bộ** — ứng dụng **chưa được triển khai công khai**. Vẫn còn ở phía trước: **triển khai mainnet và thanh khoản DEX**, cộng với **đợt bán công khai theo kế hoạch** (xem [Token EVOLVE](#token-evolve-chỉ-testnet)).
> Các hợp đồng thông minh chỉ được triển khai **trên mạng thử nghiệm Ethereum Sepolia**. Không có gì ở đây là lời khuyên tài chính hay đề nghị đầu tư.

> **Thấy EVOLVE hữu ích? Hỗ trợ phát triển — mỗi khoản quyên góp đều dành cho mã nguồn, quan hệ đối tác phòng xét nghiệm, lưu trữ và dịch thuật → [DONATE.md](DONATE.md).**

## Không có gì phải sợ

EVOLVE được xây dựng xoay quanh những câu hỏi mà mọi người thực sự đặt ra trước khi tin tưởng một nền tảng như thế này.

| Nỗi lo                                        | Điều EVOLVE đã làm để giải quyết                                                                                                                                                                                                 |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| «Dữ liệu sức khỏe của tôi sẽ bị rò rỉ.»       | Kết quả từng mầm bệnh **không bao giờ** được hiển thị cho ai — chỉ một phán quyết ẩn danh: Safe / Compatible / Caution / Risk.                                                                                                   |
| «Ảnh của tôi sẽ rơi vào đâu đó.»              | Ảnh được làm mờ theo mặc định. Chủ sở hữu cấp quyền xem **15 giây** hoặc **vĩnh viễn** — theo yêu cầu hoặc chủ động. Việc xem là miễn phí.                                                                                       |
| «Tôi sẽ phải nộp giấy tờ hoặc số điện thoại.» | Đăng nhập bằng ví (SIWE). Không điện thoại, không email, không KYC. Việc khôi phục hoạt động qua cam kết DNA trên chuỗi.                                                                                                         |
| «Anh ấy hoặc cô ấy nói dối về sức khỏe.»      | Kết quả được **xác minh bởi phòng xét nghiệm** (QR + đối chiếu khuôn mặt), và xét nghiệm của cặp đôi được thực hiện **tại buổi gặp** — kết quả STD gần đây mới quan trọng, DNA không lão hóa.                                    |
| «Ai đó sẽ lấy tiền của tôi rồi biến mất chứ?» | Việc thụ thai chạy trên một khoản đặt cược thực sự có rủi ro: tiền đặt cọc của người đàn ông chỉ chuyển đi khi quan hệ cha con được **xác nhận**; nếu không, nó được trả lại cho anh ấy.                                         |
| «Token có phải là pump-and-dump không?»       | Mã nguồn là mở (MIT); gần như toàn bộ nguồn cung được dành cho phần thưởng người dùng, và phần dự trữ chưa lưu hành được lên kế hoạch khóa trong một **kho bạc không thể rút cạn** mà ngay cả người sáng lập cũng không thể rút. |
| «Nền tảng có thể bị đóng cửa hoặc cấm không?» | Nhắn tin ngang hàng trước, lưu trữ phi tập trung (IPFS / Arweave), 18 cấu hình mạng EVM và không có tên miền cố định.                                                                                                            |

## Cái gì & Tại sao

Các ứng dụng hẹn hò truyền thống yêu cầu bạn đổi số điện thoại, email, ảnh và chi tiết sức khỏe riêng tư lấy một cơ sở dữ liệu trung tâm — rồi tin tưởng cơ sở dữ liệu đó mãi mãi. EVOLVE bắt đầu từ tiền đề ngược lại: **riêng tư theo mặc định, tự lưu ký và không có điểm lỗi duy nhất**.

- **Riêng tư theo mặc định** — dữ liệu sức khỏe không bao giờ bị lộ; chỉ các phán quyết ẩn danh.
- **Chống cấm đoán** — nhắn tin P2P trước, lưu trữ phi tập trung, thiết kế đa mạng, không có tên miền cố định.
- **Danh tính tự lưu ký** — ví của bạn là thông tin đăng nhập; khôi phục bằng DNA thay vì email hay điện thoại.
- **Không rào cản KYC** — không yêu cầu giấy tờ, điện thoại hay email để dùng nền tảng.

Đọc lý do đầy đủ trong [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md).

## Sức khỏe bạn thực sự có thể tin tưởng

- Tải lên xét nghiệm STD dưới dạng văn bản thô hoặc PDF (trích xuất lớp văn bản, với phương án dự phòng OCR cho bản quét).
- Bộ phân tích nhận biết 8 mầm bệnh: HIV-1/2, Giang mai, Chlamydia, Lậu, HSV-1, HSV-2, Viêm gan B, Viêm gan C — trong các định dạng báo cáo tiếng Anh, tiếng Ukraina và tiếng Nga.
- **Trạng thái từng mầm bệnh không bao giờ được hiển thị cho người dùng khác.** Hồ sơ chỉ hiển thị phán quyết ẩn danh: **Safe / Compatible / Caution / Risk**.
- Bản ghi DNA trên chuỗi (`DNAVerification.sol`) hỗ trợ khôi phục và xác minh.

### Phòng xét nghiệm đối tác — bằng chứng, không phải lời hứa

Bước vào một phòng xét nghiệm đối tác và cho xem mã QR của bạn. Phòng xét nghiệm quét mã, xác nhận danh tính của bạn bằng **đối chiếu khuôn mặt** (để không ai khác có thể lấy kết quả của bạn) và đính kèm báo cáo STD — PDF, bản quét hoặc văn bản, kể cả OCR kém. Kết quả được ký bởi một phòng xét nghiệm thực sự, không phải bởi bạn, nên người khác thấy một **sự thật đã xác minh** thay vì lời nói của bạn. Và mỗi xác minh được xác nhận trả **1 EVOLVE cho bệnh nhân và 1 EVOLVE cho phòng xét nghiệm** — cả hai bên đều có lý do để trung thực. Các mầm bệnh riêng lẻ vẫn không bao giờ được hiển thị cho ai.

## Tìm một người

- Bộ lọc tìm kiếm: «Bạn đang tìm gì» (hẹn hò / thụ thai / thụ thai đa phu / xét nghiệm STD), «Bạn đang tìm ai» (nam, nữ, cặp đôi), chọn theo tầng quốc gia → thành phố, «có thể đến quốc gia của bạn» với danh sách theo quốc gia, màu da, ưu tiên xét nghiệm, chỉ những người tương thích STD.
- Trình hướng dẫn nhập môn: tuổi (có thể ẩn), ngôn ngữ, tiểu sử, ảnh.
- **Trò chuyện P2P** qua libp2p (gossipsub) + Nostr, với phương án dự phòng API HTTP.

## Thụ thai

Hai cách để lên kế hoạch sinh con, và cả hai đều dựa trên cùng một ý tưởng: ý định thực sự được thể hiện bằng một khoản đặt cược EVOLVE thực — không bao giờ bằng lời hứa. Cam kết của người đàn ông nằm trong khoản tiền gửi EvolveFund (từ 15 EVOLVE, khóa ít nhất 30 ngày), và người phụ nữ có thể tự đặt mức tiền gửi tối thiểu cho những người đàn ông tìm đến cô ấy.

**Thụ thai.** Người phụ nữ dẫn đầu: cô ấy mời một người đàn ông cụ thể và nêu tên anh ta trong một ràng buộc. Anh ta cần một khoản tiền gửi EvolveFund đang hoạt động; khi cả hai xác nhận, nó bị khóa và bắt đầu đếm ngược. Việc mang thai được báo cáo trong khoảng 14 đến 30 ngày sau khi xác nhận, và xét nghiệm STD cùng DNA của cặp đôi được thực hiện tại chính buổi gặp — kết quả STD gần đây mới quan trọng, DNA không lão hóa. Khi quan hệ cha con được xác nhận, tiền gửi của người đàn ông chuyển cho người phụ nữ; nếu không, tiền gửi chỉ được trả lại cho anh ta. Không có gì đổi chủ cho đến khi sự thật được xác lập.

**Thụ thai đa phu.** Sự lựa chọn thuộc về cô ấy và vẫn riêng tư. Cô ấy mở một phiên kéo dài 48 giờ — không có tiền gửi của riêng mình (cô ấy chỉ có thể thêm một khoản vì danh tiếng, nếu muốn). Những người đàn ông có tiền gửi đang hoạt động có thể tham gia — tối đa 50 — và xác nhận, điều này khóa tiền cược của họ. Mười bốn ngày sau khi phiên đóng lại, người cha được chọn. Anh ta nhận lại tiền gửi cộng với phần thưởng từ quỹ: gấp đôi tiền gửi và 1 EVOLVE cho mỗi người tham gia khác. Những người đàn ông không được chọn mất tiền cược — 90% cho người phụ nữ, 10% cho người cha được chọn. Cô ấy không mạo hiểm gì và chỉ có thể được lợi; những người đàn ông đặt tiền cược đằng sau quyền được chọn.

## Quyền riêng tư và giao dịch bảo mật

Quyền riêng tư là mặc định — và EVOLVE đang xây dựng lộ trình hướng tới các giao dịch trên chuỗi bảo mật hoàn toàn.

- **Quà tặng riêng tư** — gửi một bông hồng 🌹 hoặc cây xương rồng 🌵 (1 EVOLVE) và chọn ai có thể thấy đó là bạn: _công khai_, _ẩn danh với tất cả trừ người nhận_ hoặc _ẩn danh hoàn toàn_. Ở các chế độ ẩn danh, món quà di chuyển như một phiếu dùng một lần mà người nhận tự nhận bằng ví của mình, vì vậy người gửi không bao giờ xuất hiện trên chuỗi. (Tính ẩn danh của người gửi hiện nay ở mức thông thường: giao dịch tài trợ có thể bị đối chiếu theo thời gian và số tiền.)
- **Ví bảo vệ Railgun** — một ví riêng tư sau cờ tính năng (`VITE_RAILGUN_ENABLED`, tắt theo mặc định) che giấu số tiền và địa chỉ bằng pool zero-knowledge đang hoạt động của Railgun. Đây là con đường dẫn đến tính ẩn danh thực sự của người gửi.
- **Nguyên mẫu Aztec** — cùng logic chuyển khoản riêng tư và ràng buộc riêng tư, được biểu diễn dưới dạng mạch Noir zero-knowledge và giữ sau một ngưỡng rõ ràng cho đến khi Aztec sẵn sàng cho sản xuất. Xem [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md).
- **Mô hình hai ví** — ví công khai tham gia quản trị; ví riêng tư được bảo vệ được **loại trừ** có chủ ý khỏi trọng số phiếu bầu, giữ quyền riêng tư và quyền biểu quyết tách biệt.

Chi tiết: [docs/RAILGUN-INTEGRATION.md](docs/RAILGUN-INTEGRATION.md) · [docs/SHIELDED-STAKES-DESIGN.md](docs/SHIELDED-STAKES-DESIGN.md) · [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md).

## Token EVOLVE (chỉ testnet)

- ERC-20, nguồn cung tối đa **8 000 000 000 EVOLVE**. Các hành động quản trị được bảo vệ bởi `TimelockController` 48 giờ.
- **Phân bổ nguồn cung theo kế hoạch** — được thiết kế để đưa gần như toàn bộ nguồn cung phục vụ người dùng, không phải người trong cuộc:

| Mục đích                                             |        EVOLVE |
| ---------------------------------------------------- | ------------: |
| Người sáng lập và đội ngũ (lương / thưởng)           |    25 000 000 |
| Dự trữ DEX (tương lai)                               |     4 000 000 |
| Bán công khai (kế hoạch)                             |     5 000 000 |
| Dự trữ thưởng — phòng xét nghiệm, bệnh nhân, mẹ, cha | 7 966 000 000 |

- **Bán công khai theo kế hoạch** — 5 000 000 EVOLVE do ứng dụng bán với giá **$0.8 mỗi token**, thanh toán bằng bất kỳ token nào ứng dụng hỗ trợ; số tiền thu được tài trợ cho phát triển. _(Kế hoạch — chưa ra mắt.)_
- **Phát hành không cần tin cậy (kế hoạch)** — dự trữ thưởng ~7 966 000 000 sẽ được khóa trong `RewardVault` không thể rút cạn: chỉ được giải phóng dần qua các phần thưởng cho phòng xét nghiệm, bệnh nhân, mẹ và cha, với các thay đổi quy tắc cần biểu quyết quản trị. Ngay cả người sáng lập cũng không thể rút. Thiết kế: [docs/REWARD-VAULT-PLAN.md](docs/REWARD-VAULT-PLAN.md).
- **Kinh tế quà tặng emoji** — một món quà tốn 1 EVOLVE, được chia theo tỷ lệ giữa các chủ sở hữu quà hiện có; một mô hình doanh thu vĩnh viễn, và quà có thể chuyển nhượng.
- **EvolveFund** — staking nam (tối thiểu 15 EVOLVE, khóa 30 ngày) tính vào trọng số quản trị; phụ nữ dùng số dư ví.
- **Thưởng xác minh** — 1 EVOLVE cho người dùng đã xác minh và 1 EVOLVE cho phòng xét nghiệm xác nhận cho mỗi xác minh STD/DNA (cộng với một vòi giới hạn tốc độ).
- **Quản trị** — trọng số phiếu kết hợp danh tiếng đệ quy (8 phiếu, độ sâu 3), tỷ lệ con cái/quan hệ cha, và EVOLVE được stake hoặc nắm giữ.
- Tích hợp **LayerZero OFT** cho các chuyển EVOLVE đa chuỗi trong tương lai (phụ thuộc đã sẵn sàng; chưa triển khai gì ngoài Sepolia).

## Hỗ trợ dự án

EVOLVE độc lập và mã nguồn mở. Nếu nó hữu ích với bạn, bạn có thể hỗ trợ phát triển bằng một khoản quyên góp — mỗi đóng góp đều dành cho mã nguồn, quan hệ đối tác phòng xét nghiệm, lưu trữ và dịch thuật.

- **Chi tiết quyên góp (EVM, Monero và hơn thế):** [DONATE.md](DONATE.md)
- **Trang quyên góp đa ngôn ngữ (34 ngôn ngữ):** **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**

Một đợt bán token công khai đang được **lên kế hoạch** — 5 000 000 EVOLVE, do ứng dụng bán (xem [Token EVOLVE](#token-evolve-chỉ-testnet)). Các khoản quyên góp là quà tặng hỗ trợ phát triển mã nguồn mở và không mang lại quyền đối với token, cổ phần, lợi nhuận hay lợi tức. Xin chỉ cho đi những gì bạn có thể chấp nhận mất.

## Kiến trúc & Bộ công nghệ

Monorepo quản lý bằng npm workspaces + Turborepo:

```
apps/
  web/          # Vite + React + TypeScript (ứng dụng web chính, i18next, Prisma)
  mobile/       # Expo + React Native
packages/
  config/       # Cờ tính năng và cấu hình từ xa động
  contracts/    # Solidity 0.8.24, Hardhat, Ignition, OpenZeppelin, LayerZero
  core/         # Các kiểu dùng chung, tiện ích, middleware, web3
  matching/     # Thuật toán ghép đôi, bộ lọc, xếp hạng
  p2p/          # Mạng libp2p (gossipsub) + Nostr
  storage/      # IPFS, Arweave, Lit Protocol
docs/           # Kiến trúc, tokenomics, lộ trình, FAQ
```

Các hợp đồng thông minh chính: `EVOLVE.sol` (ERC-20), `ProfileNFT.sol` (ERC-721), `TrustScore.sol`, `Voting.sol`, `Evolve2Earn.sol` (quà emoji + thưởng), `Governance.sol`, `BondManager.sol` (thụ thai và thụ thai đa phu), `EvolveFund.sol`, `VerificationRegistry.sol`, `DNAVerification.sol`, ERC-4337 `SmartAccountFactory` + `Paymaster`, và `TimelockController` của OpenZeppelin.

Chi tiết: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md)

## Lộ trình

Đang tiến hành: chuẩn bị ứng dụng web cho sản xuất. Kế hoạch: sổ đăng ký phòng xét nghiệm trên chuỗi và chứng nhận xét nghiệm, một bộ điều hợp nhà cung cấp email thực để tiếp nhận báo cáo phòng xét nghiệm, các chứng thực đã xác minh trên chuỗi trên hồ sơ, **`RewardVault` không cần tin cậy** với phát hành do quản trị điều khiển ([thiết kế](docs/REWARD-VAULT-PLAN.md)), **bán token công khai**, cập nhật vesting token cho phân bổ người sáng lập, và cung cấp thanh khoản DEX (hiện bị chặn — cần triển khai token mainnet). Về mặt quyền riêng tư, quà tặng riêng tư đã xong, trong khi ví bảo vệ Railgun và việc di chuyển ràng buộc riêng tư Aztec vẫn nằm sau các kiểm tra trong [docs/ROADMAP.md](docs/ROADMAP.md) và [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md). Việc mở rộng đa mạng (Arbitrum, Avalanche và các chuỗi EVM khác) diễn ra sau khi củng cố testnet.

Danh sách đầy đủ: [docs/ROADMAP.md](docs/ROADMAP.md).

## Bắt đầu (Nhà phát triển)

Yêu cầu: **Node.js 20+** và npm 10.x.

```bash
# Clone và cài đặt tất cả workspace
git clone https://github.com/Lilit-Moonlit/Evolve.git
cd Evolve
npm install

# Ứng dụng web (máy chủ dev Vite tại http://localhost:3000)
cd apps/web
npm run dev
npm test                # bộ test vitest

# Hợp đồng thông minh
cd packages/contracts
npm run compile         # hardhat compile
npm test                # bộ test hardhat
npm run deploy:local    # triển khai tất cả hợp đồng vào mạng Hardhat trong tiến trình
```

## Đóng góp

Các đóng góp đều được hoan nghênh — mã nguồn, báo cáo lỗi, đề xuất tính năng và ý tưởng. Vui lòng đọc [CONTRIBUTING.md](CONTRIBUTING.md) và [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) trước khi bắt đầu.

## Kho lưu trữ (Bản sao)

| Bản sao  | URL                                        |
| -------- | ------------------------------------------ |
| GitHub   | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg | https://codeberg.org/limitafternoon/Evolve |
| GitLab   | https://gitlab.com/evolve-group3/evolve    |

## Tài liệu

- [Cái gì & Tại sao](docs/WHAT-AND-WHY.md) — vấn đề, tầm nhìn, giá trị cốt lõi
- [Cách nó hoạt động](docs/HOW-IT-WORKS.md) — luồng người dùng, từng bước
- [Kiến trúc](docs/ARCHITECTURE.md) — monorepo, gói, luồng dữ liệu
- [Tokenomics](docs/TOKENOMICS.md) — mô hình token và phân bổ nguồn cung
- [Kế hoạch RewardVault](docs/REWARD-VAULT-PLAN.md) — phát hành không cần tin cậy (kế hoạch)
- [Tích hợp Railgun](docs/RAILGUN-INTEGRATION.md) — spike tích hợp ví bảo vệ
- [Cọc được bảo vệ](docs/SHIELDED-STAKES-DESIGN.md) — cọc thụ thai riêng tư (thiết kế)
- [Nguyên mẫu Aztec](docs/AZTEC-PROTOTYPE.md) — chuyển khoản riêng tư ZK & ràng buộc (nghiên cứu)
- [Lộ trình](docs/ROADMAP.md) — các cột mốc và trạng thái hiện tại
- [FAQ](docs/FAQ.md) — câu hỏi thường gặp
- [Hướng dẫn ví](docs/WALLETS.md) — cách tạo ví và lấy địa chỉ quyên góp

## Giấy phép

Được cấp phép theo [MIT License](LICENSE).

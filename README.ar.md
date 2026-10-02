[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)

# EVOLVE

**المواعدة والإخصاب والتحقق الصحي — خصوصية افتراضية، وتحقق حيث يهم الأمر.**

EVOLVE منصة مفتوحة المصدر ولامركزية للروابط الحميمة القابلة للتحقق: المواعدة، والإخصاب، وتوافق الأمراض المنقولة جنسيًا/الحمض النووي (STD/DNA) بشكل مجهول. تسجّل الدخول بمحفظة العملات المشفرة الخاصة بك (Sign-In with Ethereum) — دون رقم هاتف، ودون بريد إلكتروني، ودون KYC — ويمكنك استعادة حسابك عبر التزام DNA على السلسلة. بياناتك الصحية تبقى لك: تُحلَّل نتائج المختبر تلقائيًا، ولا تُعرض حالات مسببات الأمراض الفردية لأي شخص **أبدًا**، ويعتمد المطابقة فقط على أحكام توافق مجهولة الهوية (Safe / Compatible / Caution / Risk). تعمل المحادثة من نظير إلى نظير عبر libp2p وNostr، مع بديل HTTP للراحة، ويأتي التطبيق مزودًا بواجهة «Safety Mode» عامة خفيفة الوزن بالإضافة إلى وضع Companion مستقل لتقييم نتائج اختبارات STD.

> **الحالة: نسخة ألفا مبكرة.** EVOLVE قيد التطوير النشط وليس منتجًا مكتملًا.
> العقود الذكية منشورة **فقط على شبكة Ethereum Sepolia الاختبارية**.
> **لا يوجد نشر على الشبكة الرئيسية، ولا DEX، ولا سيولة، ولا طرح عام للرموز** — ولا يُوعَد بأي من ذلك.
> قد تتغير الميزات أو تتعطل في أي وقت. لا شيء هنا يمثل نصيحة مالية أو عرض استثمار.

## ماذا ولماذا

تطلب منصات المواعدة التقليدية منك تسليم رقم هاتفك وبريدك الإلكتروني وصورك وتفاصيل صحتك الحميمة إلى قاعدة بيانات مركزية. ينطلق EVOLVE من الفرضية المعاكسة: الخصوصية افتراضيًا، والحفظ الذاتي، وعدم وجود نقطة فشل مركزية. القيم الأساسية:

- **الخصوصية افتراضيًا** — بيانات الصحة لا تُكشف أبدًا؛ فقط أحكام مجهولة الهوية.
- **مقاومة الحظر** — مراسلة P2P أولًا، وتخزين لامركزي (IPFS / Arweave)، وتصميم متعدد الشبكات، دون نطاقات مثبتة في الشيفرة.
- **هوية ذات حفظ ذاتي** — محفظتك هي تسجيل دخولك؛ استعادة قائمة على DNA بدلًا من البريد/الهاتف.
- **لا بوابة KYC** — لا حاجة إلى هوية حكومية أو هاتف أو بريد إلكتروني لاستخدام المنصة.

اقرأ المبررات الكاملة في [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md) (بالإنجليزية).

## الميزات الرئيسية

### الهوية والخصوصية

- **تسجيل الدخول بالمحفظة عبر SIWE** (MetaMask ومحافظ EVM الأخرى) — مخرج الطوارئ المقاوم للرقابة.
- **استعادة الحساب عبر DNA** — تُجزَّأ نتيجة اختبار DNA الخاص بك (SHA-256، ملزَمة على السلسلة كـ `bytes32`) ويمكنها استعادة الوصول دون هاتف أو بريد إلكتروني.
- **تجريد الحساب (ERC-4337)** — حسابات ذكية وpaymaster للانضمام دون رسوم غاز؛ يبقى SIWE متاحًا دائمًا.

### توافق صحي مجهول الهوية

- تحميل نتائج اختبارات STD كنص خام أو PDF (استخراج طبقة النص مع OCR احتياطي للصفحات الممسوحة ضوئيًا).
- يتعرّف المحلل على 8 مسببات للأمراض: HIV-1/2، الزهري، الكلاميديا، السيلان، HSV-1، HSV-2، التهاب الكبد B، التهاب الكبد C (تنسيقات تقارير بالإنجليزية والأوكرانية والروسية).
- **حالة مسببات الأمراض الفردية لا تُعرض للمستخدمين الآخرين أبدًا.** تعرض الملفات الشخصية فقط حكمًا مجهول الهوية: **Safe / Compatible / Caution / Risk**.
- سجلات التحقق من DNA على السلسلة (`DNAVerification.sol`) تشغّل تدفقات الاستعادة والتحقق.

### الملفات الشخصية والبحث والتواصل

- مرشحات البحث: «ماذا تبحث عنه» (مواعدة / إخصاب / إخصاب تعدد الأزواج / اختبار STD)، «من تبحث عنه» (رجال، نساء، أزواج)، اختيارات متتالية من الدولة ← المدينة، «يمكنه السفر إلى بلدك» مع قوائم لكل دولة، لون البشرة، تفضيل الاختبار، التوافق الجنسي فقط.
- معالج التهيئة الأولى: العمر (قابل للإخفاء)، اللغات، النبذة التعريفية، الصورة.
- **خصوصية الصور**: الصور ضبابية افتراضيًا؛ يمنح المالك مشاهدات مدتها 15 ثانية أو دائمة، بشكل استباقي أو عند الطلب. المشاهدة مجانية.
- **محادثة P2P** عبر libp2p (gossipsub) + Nostr، مع بديل HTTP API.

### أوضاع الإخصاب

- **الوضع 2 — Pregnancy Bond**: تنشئ امرأة سندًا (bond)، ويراهن رجل بـ EVOLVE (≥ 100 في بناء الاختبار الحالي)، ويؤكد الطرفان؛ بعد تأكيد الحمل والأبوة، ينتقل الرهان إلى المرأة.
- **الوضع 3 — Cryptic Choice**: تفتح امرأة جلسة مدتها 48 ساعة، وينضم الرجال بالرهان؛ تختار الأب — يُرد رهانه، ويقسم الباقون: 90% لها / 10% للأب المختار.

### المختبرات والتحقق

- **تدفق شراكة المختبرات**: تسجّل المختبرات كشركاء، وتتحقق من المرضى عبر رمز QR ومطابقة الوجه، وترفق تقارير STD (PDF/نص مع استخراج OCR).
- **وضع Companion**: تدفق مستقل لتقييم نتائج اختبارات STD دون الانضمام إلى منصة المواعدة.
- **وضع Safety** (`VITE_PRODUCT_MODE=safety`): واجهة عامة محدودة (حالة STD، روابط ملفات شخصية عامة، فحوصات توافق) تستمر في العمل حتى إذا قُيّدت ميزات المواعدة/الإخصاب في ولاية قضائية أو متجر تطبيقات.

### رمز EVOLVE (شبكة اختبارية فقط)

- ERC-20، أقصى عرض 8,000,000,000 EVOLVE، إجراءات الإدارة مقيدة بـ TimelockController مدته 48 ساعة.
- **اقتصاد هدايا الإيموجي**: تكلفة الهدية 1 EVOLVE تُقسم تناسبيًا بين مالكي الهدايا الحاليين — نموذج إيرادات دائم للحوافظ؛ الهدايا قابلة للتحويل.
- **EvolveFund**: رهان الرجال (15 EVOLVE كحد أدنى، قفل 30 يومًا) يُحتسب في وزن الحوكمة؛ النساء يستخدمن رصيد المحفظة.
- **مكافآت التحقق**: 1 EVOLVE للمستخدم المتحقق منه و1 EVOLVE للمختبر المؤكد عند التحقق من STD/DNA (بالإضافة إلى صنبور اختباري محدود المعدل).
- يجمع وزن التصويت في الحوكمة بين السمعة التكرارية (8 أصوات، عمق 3)، وحصة الأبناء/الأبوة، وEVOLVE المراهَن به أو المحتفَظ به.
- تكامل **LayerZero OFT** لعمليات نقل EVOLVE متعددة السلاسل مستقبلًا (التبعيات جاهزة؛ لم يُنشر شيء خارج Sepolia بعد).

### المنصة

- تطبيق ويب (قابل للتثبيت كـ PWA) وتطبيق جوال Expo/React Native.
- الواجهة مترجمة إلى **34 لغة**.
- جاهز لتعدد الشبكات: 18 تكوين شبكة EVM (Arbitrum وAvalanche هما شبكتا L2 الأساسيتان المخطط لهما — **غير منشورتين بعد**).

## البنية والمكدس التقني

مستودع أحادي (Monorepo) يُدار بـ npm workspaces + Turborepo:

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

العقود الذكية الرئيسية: `EVOLVE.sol` (ERC-20)، `ProfileNFT.sol` (ERC-721)، `TrustScore.sol`، `Voting.sol`، `Evolve2Earn.sol` (هدايا الإيموجي + المكافآت)، `Governance.sol`، `BondManager.sol` (الوضعان 2 و3)، `EvolveFund.sol`، `VerificationRegistry.sol`، `DNAVerification.sol`، ERC-4337 `SmartAccountFactory` + `Paymaster`، و`TimelockController` من OpenZeppelin.

التفاصيل: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md) (بالإنجليزية).

## خارطة الطريق

قيد التنفيذ: جاهزية تطبيق الويب للإنتاج. المخطط: سجل مختبرات على السلسلة واعتماد الاختبارات، ومحوّل مزود بريد حقيقي لاستقبال تقارير المختبر، وشهادات موثقة على السلسلة في الملفات الشخصية، وتحديث الاستحقاق التدريجي للرموز لمخصصات المؤسسين/المطورين، وتوفير سيولة DEX (محجوب حاليًا — يتطلب نشر الرمز على الشبكة الرئيسية). يأتي التوسع متعدد الشبكات (Arbitrum وAvalanche وسلاسل EVM الأخرى) بعد تعزيز الشبكة الاختبارية.

القائمة الكاملة: [docs/ROADMAP.md](docs/ROADMAP.md) (بالإنجليزية).

## البدء (للمطورين)

المتطلبات: **Node.js 20+** وnpm 10.x.

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

## المساهمة

المساهمات موضع ترحيب — الشيفرة، وتقارير الأخطاء، واقتراحات الميزات، والمقترحات. يرجى قراءة [CONTRIBUTING.md](CONTRIBUTING.md) و[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) قبل البدء.

## دعم المشروع

إذا وجدت EVOLVE مفيدًا، يمكنك دعم التطوير بتبرع — التفاصيل في [DONATE.md](DONATE.md). تفضل صفحة ويب؟ استخدم صفحة التبرع متعددة اللغات (34 لغة): **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**.

**لا يوجد طرح للرموز ولن يكون هناك أي طرح.** لا يمكن «الاستثمار» في رموز EVOLVE؛ التبرعات هدايا لدعم تطوير المصدر المفتوح ولا تمنح المتبرع أي حق في رموز أو حصص أو عوائد أو أي مطالبة مالية.

## المستودعات (نسخ متطابقة)

| النسخة المتطابقة | URL                                        |
| ---------------- | ------------------------------------------ |
| GitHub           | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg         | https://codeberg.org/limitafternoon/Evolve |
| GitLab           | https://gitlab.com/evolve-group3/evolve    |

## الوثائق

- [ماذا ولماذا](docs/WHAT-AND-WHY.md) — المشكلة، الرؤية، القيم الأساسية (بالإنجليزية)
- [كيف يعمل](docs/HOW-IT-WORKS.md) — تدفقات المستخدم، خطوة بخطوة (بالإنجليزية)
- [البنية](docs/ARCHITECTURE.md) — المستودع الأحادي، الحزم، تدفقات البيانات (بالإنجليزية)
- [اقتصاد الرموز](docs/TOKENOMICS.md) — نموذج الرمز وتوزيع العرض (بالإنجليزية)
- [خارطة الطريق](docs/ROADMAP.md) — المعالم والحالة الحالية (بالإنجليزية)
- [الأسئلة الشائعة](docs/FAQ.md) — أسئلة متكررة (بالإنجليزية)
- [دليل المحافظ](docs/WALLETS.md) — كيفية إنشاء المحافظ والحصول على عناوين التبرع (بالإنجليزية)

## الترخيص

مرخّص بموجب [رخصة MIT](LICENSE).

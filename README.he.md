[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)

# EVOLVE

**היכרויות, הפריה ואימות בריאותי — פרטיות כברירת מחדל, ואימות היכן שחשוב.**

EVOLVE היא פלטפורמת קוד פתוח מבוזרת לקשרים אינטימיים הניתנים לאימות: היכרויות, הפריה ותאימות STD/DNA אנונימית. נכנסים לחשבון עם ארנק הקריפטו שלכם (Sign-In with Ethereum) — בלי מספר טלפון, בלי דוא״ל, בלי KYC — וניתן לשחזר את החשבון באמצעות מחויבות DNA על השרשרת. נתוני הבריאות נשארים שלכם: תוצאות המעבדה מנותחות אוטומטית, מצבי הפתוגנים הבודדים **לעולם לא** מוצגים לאף אחד, וההתאמה מסתמכת רק על פסקי תאימות אנונימיים (Safe / Compatible / Caution / Risk). הצ׳אט פועל עמית-אל-עמית דרך libp2p ו-Nostr, עם גיבוי HTTP לנוחות, והאפליקציה מגיעה עם חזית ציבורית קלת משקל בשם ״Safety Mode״ ועם מצב Companion עצמאי להערכת תוצאות בדיקות STD.

> **סטטוס: אלפא בשלבים מוקדמים.** EVOLVE נמצא בפיתוח פעיל ואינו מוצר מוגמר.
> חוזים חכמים פרוסים **רק ברשת הבדיקה Ethereum Sepolia**.
> **אין פריסה לרשת הראשית, אין DEX, אין נזילות ואין מכירת מטבע ציבורית** — ושום דבר מאלה אינו מובטח.
> תכונות עשויות להשתנות או להישבר בכל עת. שום דבר כאן אינו ייעוץ פיננסי או הצעת השקעה.

## מה ולמה

פלטפורמות היכרויות מסורתיות מבקשות מכם למסור מספר טלפון, דוא״ל, תמונות ופרטי בריאות אינטימיים למסד נתונים מרכזי. EVOLVE יוצא מהנחה הפוכה: פרטיות כברירת מחדל, משמורת עצמית ואין נקודת כשל מרכזית. ערכי הליבה:

- **פרטיות כברירת מחדל** — נתוני בריאות לעולם אינם נחשפים; רק פסקים אנונימיים.
- **עמידות לחסימות** — העברת הודעות P2P תחילה, אחסון מבוזר (IPFS / Arweave), עיצוב רב-רשתי, בלי דומיינים מוטמעים בקוד.
- **זהות במשמרת עצמית** — הארנק שלכם הוא הכניסה לחשבון; שחזור מבוסס DNA במקום דוא״ל/טלפון.
- **בלי שעת KYC** — לא נדרשים תעודת זהות ממשלתית, טלפון או דוא״ל כדי להשתמש בפלטפורמה.

את הרציונל המלא קראו ב-[docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md) (באנגלית).

## תכונות עיקריות

### זהות ופרטיות

- **כניסה לחשבון עם ארנק SIWE** (MetaMask וארנקי EVM אחרים) — דלת המילוט העמידה בפני צנזורה.
- **שחזור חשבון באמצעות DNA** — תוצאת בדיקת ה-DNA שלכם מגובבת (SHA-256, מחויבת על השרשרת כ-`bytes32`) ויכולה לשחזר את הגישה בלי טלפון או דוא״ל.
- **הפשטת חשבון (ERC-4337)** — חשבונות חכמים ו-paymaster לקליטה בלי עמלות גז; SIWE נשאר זמין תמיד.

### תאימות בריאותית אנונימית

- העלאת תוצאות בדיקות STD כטקסט גולמי או PDF (חילוץ שכבת טקסט עם גיבוי OCR לעמודים סרוקים).
- המנתח מזהה 8 פתוגנים: HIV-1/2, עגבת, כלמידיה, זיבה, HSV-1, HSV-2, הפטיטיס B, הפטיטיס C (פורמטים של דוחות באנגלית, באוקראינית וברוסית).
- **מצב פתוגן בודד לעולם אינו מוצג למשתמשים אחרים.** פרופילים מציגים רק פסק אנונימי: **Safe / Compatible / Caution / Risk**.
- רישומי אימות DNA על השרשרת (`DNAVerification.sol`) מפעילים את זרימות השחזור והאימות.

### פרופילים, חיפוש ותקשורת

- מסנני חיפוש: ״מה אתם מחפשים״ (היכרויות / הפריה / הפריה פוליאנדרית / בדיקות STD), ״את מי אתם מחפשים״ (גברים, נשים, זוגות), בחירות מדורגות מדינה ← עיר, ״יכול/ה להגיע למדינתכם״ עם רשימות פר-מדינה, גוון עור, העדפת בדיקות, תואמי STD בלבד.
- אשף הצטרפות: גיל (ניתן להסתרה), שפות, ביו, תמונה.
- **פרטיות תמונות**: תמונות מטושטשות כברירת מחדל; הבעלים מעניק צפיות של 15 שניות או קבועות, ביוזמתו או לפי בקשה. הצפייה חינם.
- **צ׳אט P2P** על גבי libp2p (gossipsub) + Nostr, עם גיבוי HTTP API.

### מצבי הפריה

- **מצב 2 — Pregnancy Bond**: אישה יוצרת bond, גבר מתחייב ב-EVOLVE (≥ 100 בגרסת הבדיקה הנוכחית), שניהם מאשרים; לאחר אישור הריון ואבהות, ה-stake עובר לאישה.
- **מצב 3 — Cryptic Choice**: אישה פותחת סשן של 48 שעות, גברים מצטרפים באמצעות stake; היא בוחרת את האב — ה-stake שלו מוחזר, והשאר מתחלקים: 90% לה / 10% לאב הנבחר.

### מעבדות ואימות

- **זרימת שותפי מעבדה**: מעבדות נרשמות כשותפות, מאמתות מטופלים באמצעות QR והתאמת פנים ומצרפות דוחות STD (PDF/טקסט עם חילוץ OCR).
- **מצב Companion**: זרימה עצמאית להערכת תוצאות בדיקות STD בלי להצטרף לפלטפורמת ההיכרויות.
- **מצב Safety** (`VITE_PRODUCT_MODE=safety`): חזית ציבורית מוגבלת (סטטוס STD, קישורי פרופיל ציבוריים, בדיקות תאימות) שממשיכה לעבוד גם אם תכונות היכרויות/הפריה מוגבלות בשיפוט משפטי מקומי או בחנות אפליקציות.

### מטבע EVOLVE (רשת בדיקה בלבד)

- ERC-20, היצע מקסימלי 8,000,000,000 EVOLVE, פעולות ניהול כלואות מאחורי TimelockController של 48 שעות.
- **כלכלת מתנות אימוג׳י**: מתנה עולה 1 EVOLVE, שמתחלק יחסית בין בעלי המתנות הקיימים — מודל הכנסות תמידי למחזיקים; מתנות ניתנות להעברה.
- **EvolveFund**: stake גברי (מינימום 15 EVOLVE, נעילה ל-30 יום) שנכלל במשקל הממשל; נשים משתמשות ביתרת הארנק.
- **פרסי אימות**: 1 EVOLVE למשתמש המאומת ו-1 EVOLVE למעבדה המאשרת בעת אימות STD/DNA (בתוספת ברז בדיקה מוגבל קצב).
- משקל ההצבעה בממשל משלב מוניטין רקורסיבי (8 הצבעות, עומק 3), נתח ילדים/אבהות ו-EVOLVE מופקד או מוחזק.
- אינטגרציית **LayerZero OFT** להעברות EVOLVE רב-שרשרתיות בעתיד (התלויות במקום; שום דבר לא נפרס מעבר ל-Sepolia נכון לעכשיו).

### פלטפורמה

- אפליקציית ווב (ניתנת להתקנה כ-PWA) ואפליקציית מובייל Expo/React Native.
- הממשק מתורגם ל-**34 שפות**.
- מוכן לריבוי רשתות: 18 תצורות רשת EVM (Arbitrum ו-Avalanche הן רשתות ה-L2 העיקריות המתוכננות — **טרם נפרסו**).

## ארכיטקטורה ומחסנית טכנולוגיות

Monorepo המנוהל עם npm workspaces + Turborepo:

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

חוזים חכמים מרכזיים: `EVOLVE.sol` (ERC-20), `ProfileNFT.sol` (ERC-721), `TrustScore.sol`, `Voting.sol`, `Evolve2Earn.sol` (מתנות אימוג׳י + פרסים), `Governance.sol`, `BondManager.sol` (מצבים 2 ו-3), `EvolveFund.sol`, `VerificationRegistry.sol`, `DNAVerification.sol`, ERC-4337 `SmartAccountFactory` + `Paymaster` ו-`TimelockController` של OpenZeppelin.

פרטים: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md) (באנגלית).

## מפת דרכים

בעיצומו: מוכנות ייצור של אפליקציית הווב. מתוכנן: רישום מעבדות על השרשרת והסמכת בדיקות, מתאם ספק דואר אמיתי לקליטת דוחות מעבדה, אישורים מאומתים על השרשרת בפרופילים, עדכון בלוקינג הדרגתי של מטבעות להקצאות מייסדים/מפתחים, הבטחת נזילות DEX (חסום כרגע — דורש פריסות מטבע ברשת הראשית). הרחבה רב-רשתית (Arbitrum, Avalanche ושרשראות EVM נוספות) תגיע לאחר חיזוק רשת הבדיקה.

הרשימה המלאה: [docs/ROADMAP.md](docs/ROADMAP.md) (באנגלית).

## איך מתחילים (מפתחים)

דרישות: **Node.js 20+** ו-npm 10.x.

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

## תרומה

תרומות מתקבלות בברכה — קוד, דיווחי באגים, הצעות תכונות והצעות. נא לקרוא את [CONTRIBUTING.md](CONTRIBUTING.md) ואת [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) לפני שמתחילים.

## תמיכה בפרויקט

אם EVOLVE מועיל לכם, תוכלו לתמוך בפיתוח בתרומה — פרטים ב-[DONATE.md](DONATE.md). מעדיפים דף אינטרנט? השתמשו בעמוד התרומה הרב-לשוני (34 שפות): **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**.

**אין מכירת מטבע ולא תהיה.** לא ניתן ״להשקיע״ במטבעי EVOLVE; תרומות הן מתנות לתמיכה בפיתוח קוד פתוח ואינן מקנות לתורם זכויות למטבעות, לבעלות, לתשואות או לכל תביעה כספית.

## מאגרים (שיקופים)

| שיקוף    | URL                                        |
| -------- | ------------------------------------------ |
| GitHub   | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg | https://codeberg.org/limitafternoon/Evolve |
| GitLab   | https://gitlab.com/evolve-group3/evolve    |

## תיעוד

- [מה ולמה](docs/WHAT-AND-WHY.md) — הבעיה, החזון, ערכי הליבה (אנגלית)
- [איך זה עובד](docs/HOW-IT-WORKS.md) — זרימות משתמש, צעד אחר צעד (אנגלית)
- [ארכיטקטורה](docs/ARCHITECTURE.md) — monorepo, חבילות, זרימות נתונים (אנגלית)
- [כלכלת מטבע](docs/TOKENOMICS.md) — מודל המטבע וחלוקת ההיצע (אנגלית)
- [מפת דרכים](docs/ROADMAP.md) — אבני דרך וסטטוס נוכחי (אנגלית)
- [שאלות נפוצות](docs/FAQ.md) — שאלות נפוצות (אנגלית)
- [מדריך ארנקים](docs/WALLETS.md) — איך יוצרים ארנקים ומשיגים כתובות לתרומה (אנגלית)

## רישיון

מופץ בכפוף ל[רישיון MIT](LICENSE).

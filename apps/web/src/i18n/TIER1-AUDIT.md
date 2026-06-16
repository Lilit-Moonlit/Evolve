# Tier 1 Translation Audit

Generated: 2026-06-16

## Summary

| Locale | Keys | Translated | English Fallbacks | Status                    |
| ------ | ---- | ---------- | ----------------- | ------------------------- |
| uk     | 111  | 110        | 1                 | ✅ Good                   |
| de     | 111  | 30         | 81                | ⚠️ Partial                |
| fr     | 111  | 56         | 55                | ⚠️ Partial                |
| es     | 111  | 57         | 54                | ⚠️ Partial                |
| pt     | 111  | 45         | 66                | ⚠️ Partial                |
| ja     | 111  | 111        | 0                 | ✅ Complete               |
| ko     | —    | —          | —                 | ❌ Missing                |
| zh     | —    | —          | —                 | ❌ Missing (zh-TW exists) |
| ar     | 111  | 42         | 69                | ⚠️ Partial                |
| vi     | 111  | 109        | 2                 | ✅ Good                   |
| hi     | —    | —          | —                 | ❌ Missing                |
| tr     | —    | —          | —                 | ❌ Missing                |
| th     | —    | —          | —                 | ❌ Missing                |
| id     | —    | —          | —                 | ❌ Missing                |
| ms     | —    | —          | —                 | ❌ Missing                |
| ru     | —    | —          | —                 | ❌ Missing                |

## Detailed Findings

### uk.json (Ukrainian)

- **Keys:** 111
- **Quality:** 99% translated
- **Issues:** 1
  - `auth.email.email` = "Email" — should be "Електронна пошта" (but "Email" is commonly used in Ukrainian)
- **Assessment:** ✅ Excellent quality, natural translations

### de.json (German)

- **Keys:** 111
- **Quality:** 27% translated
- **Issues:** 81 English fallback values
- **Missing translations:** navigation, home, profile, chat, settings, auth sections mostly English
- **Assessment:** ⚠️ Needs significant work

### fr.json (French)

- **Keys:** 111
- **Quality:** 50% translated
- **Issues:** 55 English fallback values
- **Missing translations:** navigation, profile tabs, chat, language, auth sections
- **Assessment:** ⚠️ Needs significant work

### es.json (Spanish)

- **Keys:** 111
- **Quality:** 51% translated
- **Issues:** 54 English fallback values
- **Missing translations:** navigation, home filters, profile tabs, chat, auth sections
- **Assessment:** ⚠️ Needs significant work

### pt.json (Portuguese)

- **Keys:** 111
- **Quality:** 41% translated
- **Issues:** 66 English fallback values
- **Missing translations:** navigation, home, profile, chat, auth sections
- **Assessment:** ⚠️ Needs significant work

### ja.json (Japanese)

- **Keys:** 111
- **Quality:** 100% translated
- **Issues:** 0
- **Assessment:** ✅ Complete and natural

### ar.json (Arabic)

- **Keys:** 111
- **Quality:** 38% translated
- **Issues:** 69 English fallback values
- **Missing translations:** home, profile, chat, language, auth sections mostly English
- **Assessment:** ⚠️ Needs significant work

### vi.json (Vietnamese)

- **Keys:** 111
- **Quality:** 98% translated
- **Issues:** 2
  - `auth.signIn.button` = "Sign-In with Ethereum" — should be "Đăng nhập bằng Ethereum"
  - `auth.email.email` = "Email" — should be "Thư điện tử" (but "Email" is commonly used)
- **Assessment:** ✅ Excellent quality

### Missing Files

8 Tier 1 locale files are completely missing:

- ko.json (Korean)
- zh.json (Chinese Simplified) — only zh-TW exists
- hi.json (Hindi)
- tr.json (Turkish)
- th.json (Thai)
- id.json (Indonesian)
- ms.json (Malay)
- ru.json (Russian)

## Recommendations

1. **Critical:** Create missing locale files for ko, zh, hi, tr, th, id, ms, ru
2. **High:** Complete translations for de, fr, es, pt, ar (all < 50%)
3. **Low:** Fix minor issues in uk, vi (98%+ quality)

## Key Structure (111 keys)

```
app.name, app.tagline, app.copyright
navigation.swipe, navigation.messages, navigation.profile, navigation.settings
home.hero.title, home.hero.subtitle
home.filters.verifiedStd, home.filters.verifiedDna, home.filters.noProfiles
home.profile.newMatch, home.profile.noMoreProfiles
profile.tabs.profile, profile.tabs.reputation
profile.myProfile.title, profile.myProfile.verifiedUser
profile.status.stdStatus, profile.status.dnaStatus, profile.status.uploaded, profile.status.notUploaded, profile.status.verified
profile.upload.title, profile.upload.stdTest, profile.upload.dnaTest, profile.upload.redactFields, profile.upload.fullName, profile.upload.address, profile.upload.phoneNumber, profile.upload.patientId, profile.upload.encryptUpload, profile.upload.uploadSuccess
profile.documents.title, profile.documents.noDocuments
profile.wallet.title, profile.wallet.address, profile.wallet.balance
profile.reputation.title, profile.reputation.score, profile.reputation.description, profile.reputation.votersTitle, profile.reputation.weight
chat.title, chat.subtitle, chat.requestAccess, chat.approvedRequest, chat.approvedResponse, chat.declinedResponse, chat.selectChat, chat.noMatches, chat.inputPlaceholder, chat.send, chat.pendingVerification, chat.requestStd, chat.requestDna, chat.approveStd, chat.approveDna, chat.denyStd, chat.denyDna
language.select, language.title, language.description
country.select, country.title, country.description
settings.currentMode, settings.autoSaved
auth.loading, auth.landing.title, auth.landing.email, auth.landing.phone, auth.landing.wallet
auth.connectWallet.title, auth.connectWallet.description
auth.signIn.title, auth.signIn.description, auth.signIn.button
auth.logout
auth.email.title, auth.email.description, auth.email.email, auth.email.password, auth.email.login, auth.email.register, auth.email.switchToRegister, auth.email.switchToLogin
auth.phone.title, auth.phone.description, auth.phone.phone, auth.phone.phonePlaceholder, auth.phone.getCode, auth.phone.otp, auth.phone.otpPlaceholder, auth.phone.verify, auth.phone.resendCode, auth.phone.otpSent
auth.modeSelector.title, auth.modeSelector.description
auth.modeSelector.normal.label, auth.modeSelector.normal.description, auth.modeSelector.normal.authType
auth.modeSelector.pregnancyBond.label, auth.modeSelector.pregnancyBond.description, auth.modeSelector.pregnancyBond.authType
auth.modeSelector.crypticChoice.label, auth.modeSelector.crypticChoice.description, auth.modeSelector.crypticChoice.authType
auth.noMode.title, auth.noMode.description, auth.noMode.button
```

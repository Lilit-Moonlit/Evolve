# Evolve Mobile — Store Submission Checklist

This doc tracks what is already configured for Google Play + App Store and the
exact remaining manual steps (accounts, signing keys, review assets) that
cannot be automated from this repo.

## Already configured (in this repo)

- **App identifiers** (`app.json`): `com.evolve.dating` (iOS bundle id + Android
  package).
- **Versioning**: `version: 1.0.0`, `ios.buildNumber: 1`, `android.versionCode: 1`.
  Bump these for every release.
- **Icons / splash** (`assets/`): `icon.png` (1024), `adaptive-icon.png` (1024,
  safe-zone), `splash.png` (iOS), `favicon.png`. Generated from
  `apps/web/public/logo.jpg` via `apps/web/scripts/generate-icons.mjs`.
- **Permissions**: camera, photo library, coarse+fine location (with
  user-facing `infoPlist`/plugin permission strings).
- **EAS profiles** (`eas.json`): `development`, `preview` (APK/internal),
  `production` (AAB + Release, `credentialsSource: "remote"` so EAS manages the
  Android keystore and iOS provisioning automatically).
- **Store copy** (`store-metadata.json`): name, description, keywords, category.

## 1. Prerequisites (one-time)

- [ ] `npm i -g eas-cli` and `eas login` (Expo account).
- [ ] Google Play Console developer account ($25 one-time).
- [ ] Apple Developer Program account ($99/year).
- [ ] Replace `privacyPolicyUrl`, `supportEmail`, `websiteUrl` in
      `store-metadata.json` with real URLs (store review requires a reachable
      privacy policy + support contact).

## 2. Google Play

- [ ] `eas build -p android --profile production` → produces an `.aab`.
- [ ] `eas submit -p android --profile production` (or upload the `.aab` in
      Play Console).
- [ ] In Play Console fill: app name, short/full description, category (Social),
      content rating questionnaire, privacy policy URL, data-safety form.
- [ ] Upload at least 2 phone screenshots + a 512x512 app icon + feature graphic.
- [ ] Release to an internal/closed track first, then promote to production.

## 3. Apple App Store

- [ ] `eas build -p ios --profile production` → produces an `.ipa`
      (`credentialsSource: "remote"` will prompt for the Apple Team ID once).
- [ ] `eas submit -p ios --profile production` (or upload via Transporter /
      Xcode).
- [ ] App Store Connect: set privacy policy URL, support URL, content rights,
      and age rating.
- [ ] Upload screenshots for 6.7" / 6.5" / 5.5" device sizes.
- [ ] Provide an App Review note explaining the STD/DNA health-data usage and
      that no government ID/phone is required (the app is wallet + anonymous).

## 4. Notes / optional

- **OTA updates**: `expo-updates` is NOT installed, so the `updates`/`runtimeVersion`
  block was removed from `app.json`. To enable over-the-air updates later, run
  `npx expo install expo-updates` and re-add `runtimeVersion` + `updates.url`
  (the value is printed by `eas update:configure`).
- **Signing**: `eas.json` uses `credentialsSource: "remote"` — do NOT commit
  keystores/provisioning profiles; EAS stores them securely.
- **Privacy**: the app never exposes individual STD/DNA pathogen status — only
  anonymous compatibility verdicts. Keep the data-safety form consistent with
  this (collects: photos, approximate location — optional).

## Commands

```bash
cd apps/mobile
eas login
eas build -p android --profile production
eas build -p ios --profile production
eas submit -p android --profile production
eas submit -p ios --profile production
```

# Mobile Boundary

## Problem

The `@evolve/ui` package has been rewritten as a **web-only** library (HTML divs, Tailwind CSS, buttons/inputs native to browsers). These components DO NOT work in React Native.

Mobile screens (`home.tsx`, `profile.tsx`) currently import from `@evolve/ui`:

- `ProfileCard` — used in `home.tsx`
- `Button`, `ProfileStakingCard`, `VerificationBadge`, `ModeSelector` — used in `profile.tsx`

## Solution

Create **duplicate RN-native component files** inside `apps/mobile/components/` that mirror the web props interfaces but render with React Native primitives (`View`, `Text`, `TouchableOpacity`, `Image`, `TextInput`).

## Plan

### Step 1: Create RN-native component files

Each component file lives in `apps/mobile/components/` and exports a React Native version:

| File                           | Purpose                                   |
| ------------------------------ | ----------------------------------------- |
| `MobileProfileCard.tsx`        | RN equivalent of `@evolve/ui` ProfileCard |
| `MobileButton.tsx`             | RN button with TouchableOpacity           |
| `MobileProfileStakingCard.tsx` | RN staking card                           |
| `MobileVerificationBadge.tsx`  | RN badge with SVG or emoji icons          |
| `MobileModeSelector.tsx`       | RN mode selector                          |
| `MobileChatMessage.tsx`        | RN chat bubble                            |
| `MobileGiftButton.tsx`         | RN gift button                            |

### Step 2: Update mobile screen imports

Replace `import { X } from '@evolve/ui'` with `import { MobileX } from '../components/MobileX'`.

### Step 3: Share types (optional)

If `@evolve/ui` components exported useful TypeScript interfaces, consider moving them to `@evolve/core` so both web and mobile can share them. Otherwise, duplicate the interfaces locally.

## RN-native Component Template

```tsx
import { View, Text, TouchableOpacity } from "react-native";

interface MobileButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "outline";
  disabled?: boolean;
}

export function MobileButton({
  title,
  onPress,
  variant = "primary",
  disabled,
}: MobileButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={{
        backgroundColor: variant === "primary" ? "#2563eb" : "transparent",
        borderWidth: variant === "outline" ? 2 : 0,
        borderColor: "#2563eb",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <Text
        style={{
          color: variant === "primary" ? "#fff" : "#2563eb",
          fontWeight: "600",
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}
```

## Why Not Share Components?

- Web components use `<div>`, `<button>`, `<input>`, Tailwind className strings
- RN components use `<View>`, `<TouchableOpacity>`, `<TextInput>`, `StyleSheet.create()`
- These are fundamentally incompatible rendering models
- Sharing via `react-native-web` is fragile and adds unnecessary complexity
- Separate implementations give native UX and full access to RN APIs (Animated, GestureHandler, etc.)

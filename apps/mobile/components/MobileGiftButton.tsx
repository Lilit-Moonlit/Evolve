import { useState } from "react";
import { TouchableOpacity, Text, StyleSheet, Animated } from "react-native";

interface MobileGiftButtonProps {
  giftType: "rose" | "cactus";
  onGift: (giftType: "rose" | "cactus") => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeMap = { sm: 48, md: 64, lg: 80 };
const emojiSizeMap = { sm: 24, md: 30, lg: 36 };

export function MobileGiftButton({
  giftType,
  onGift,
  disabled = false,
  size = "md",
}: MobileGiftButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [scaleAnim] = useState(() => new Animated.Value(1));

  const handleClick = () => {
    if (disabled || isAnimating) return;
    setIsAnimating(true);
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
    setTimeout(() => {
      setIsAnimating(false);
      onGift(giftType);
    }, 600);
  };

  const sz = sizeMap[size];
  const emojiSz = emojiSizeMap[size];
  const emoji = giftType === "rose" ? "🌹" : "🌵";
  const bgColor = giftType === "rose" ? "#ec4899" : "#10b981";

  return (
    <TouchableOpacity
      onPress={handleClick}
      disabled={disabled || isAnimating}
      activeOpacity={0.8}
      style={[
        styles.container,
        {
          width: sz,
          height: sz,
          backgroundColor: bgColor,
          opacity: disabled ? 0.5 : 1,
        },
      ]}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Text style={[styles.emoji, { fontSize: emojiSz }]}>{emoji}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: "hidden",
  },
  emoji: {
    color: "#fff",
  },
});

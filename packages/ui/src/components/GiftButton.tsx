import React, { useState } from "react";

export interface GiftButtonProps {
  giftType: "rose" | "cactus";
  onGift: (giftType: "rose" | "cactus") => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeMap: Record<string, string> = {
  sm: "w-12 h-12",
  md: "w-16 h-16",
  lg: "w-20 h-20",
};

const emojiSizeMap: Record<string, string> = {
  sm: "text-2xl",
  md: "text-3xl",
  lg: "text-4xl",
};

export const GiftButton: React.FC<GiftButtonProps> = ({
  giftType,
  onGift,
  disabled = false,
  size = "md",
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (disabled || isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      onGift(giftType);
    }, 600);
  };

  const isRose = giftType === "rose";
  const gradient = isRose
    ? "bg-gradient-to-br from-pink-500 to-rose-600"
    : "bg-gradient-to-br from-green-500 to-emerald-600";
  const ringColor = isRose ? "focus:ring-pink-500" : "focus:ring-green-500";
  const emoji = isRose ? "🌹" : "🌵";

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isAnimating}
      className={`${sizeMap[size]} rounded-full ${gradient} flex items-center justify-center shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ${ringColor} ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      } transition-all duration-200`}
    >
      <span className={emojiSizeMap[size]}>{emoji}</span>
    </button>
  );
};

export default GiftButton;

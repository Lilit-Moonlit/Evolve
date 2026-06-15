import { TouchableOpacity, Text, StyleSheet, ViewStyle } from "react-native";

interface MobileButtonProps {
  children: string;
  onPress: () => void;
  variant?: "primary" | "outline";
  disabled?: boolean;
  style?: ViewStyle;
}

export function MobileButton({
  children,
  onPress,
  variant = "primary",
  disabled,
  style,
}: MobileButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.base,
        variant === "primary" ? styles.primary : styles.outline,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text
        style={variant === "primary" ? styles.primaryText : styles.outlineText}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  primary: {
    backgroundColor: "#2563eb",
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#2563eb",
  },
  disabled: {
    opacity: 0.5,
  },
  primaryText: {
    color: "#fff",
    fontWeight: "600",
  },
  outlineText: {
    color: "#2563eb",
    fontWeight: "600",
  },
});

import AsyncStorage from "@react-native-async-storage/async-storage";

export type PrivacyLevel = 1 | 2 | 3;

export interface PrivacyConfig {
  level: PrivacyLevel;
  color: string;
  name: string;
  description: string;
}

export const PRIVACY_LEVELS: Record<PrivacyLevel, PrivacyConfig> = {
  1: {
    level: 1,
    color: "#3b82f6",
    name: "Normal",
    description: "Full profile visibility",
  },
  2: {
    level: 2,
    color: "#4338ca",
    name: "Pregnancy Bond",
    description: "Can hide content from Level 1",
  },
  3: {
    level: 3,
    color: "#0f172a",
    name: "Cryptic Choice",
    description: "Can hide content from Level 1 & 2",
  },
};

const PRIVACY_STORAGE_KEY = "evolve_privacy_level";

export async function getPrivacyLevel(): Promise<PrivacyLevel> {
  try {
    const level = await AsyncStorage.getItem(PRIVACY_STORAGE_KEY);
    return level ? (parseInt(level, 10) as PrivacyLevel) : 1;
  } catch (error) {
    console.error("Failed to get privacy level:", error);
    return 1;
  }
}

export async function setPrivacyLevel(level: PrivacyLevel): Promise<void> {
  try {
    await AsyncStorage.setItem(PRIVACY_STORAGE_KEY, level.toString());
  } catch (error) {
    console.error("Failed to set privacy level:", error);
  }
}

export function canViewContent(
  viewerLevel: PrivacyLevel,
  contentLevel: PrivacyLevel,
): boolean {
  if (viewerLevel >= contentLevel) {
    return true;
  }
  return false;
}

export function getPrivacyConfig(level: PrivacyLevel): PrivacyConfig {
  return PRIVACY_LEVELS[level];
}

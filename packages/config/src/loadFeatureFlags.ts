// Utility to load feature flags from a remote JSON file
import { FeatureFlags, DEFAULT_FLAGS } from "./featureFlags";

/**
 * Loads feature flags from the given URL.
 * If the request fails, returns the default flags.
 */
export const loadFeatureFlags = async (url: string): Promise<FeatureFlags> => {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Network response was not ok");
    const json = (await res.json()) as Partial<FeatureFlags>;
    return { ...DEFAULT_FLAGS, ...json };
  } catch (e) {
    console.warn("Failed to load remote feature flags, using defaults", e);
    return DEFAULT_FLAGS;
  }
};

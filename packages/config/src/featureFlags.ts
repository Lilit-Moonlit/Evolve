// Feature flag definitions for the Evolve project
export type FeatureFlags = {
  COMPANION_MODE: boolean;
  // future flags can be added here
};

// Default flag values used when remote flags cannot be loaded
export const DEFAULT_FLAGS: FeatureFlags = {
  COMPANION_MODE: false,
};

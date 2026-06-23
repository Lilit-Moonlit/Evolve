/**
 * Server/Node.js entry point for @evolve/core
 * Exports full API including Express middleware and Node.js specific code
 */

// Export all types (platform-agnostic)
export * from "./types";

// Export all constants
export * from "./constants";

// Export all utilities
export * from "./utils";

// Export all middleware (including Express-specific)
export * from "./middleware";

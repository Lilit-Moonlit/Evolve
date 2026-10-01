/**
 * Product mode configuration.
 *
 * - "safety": public facade — ONLY the safe-sex feature set is visible
 *   (STD management, QR compatibility checks, lab integration).
 *   Dating, conception (Mode 2/3), DAO, staking etc. are hidden.
 * - "full": everything as before (dating, chat, Mode 2/3, DAO, staking).
 *   Controlled by the developer only — never enabled for end users.
 *
 * Set via `VITE_PRODUCT_MODE` env var (vite.config.ts `define` or .env).
 * Defaults to "safety" so the public build is safe by default.
 */

export type ProductMode = "safety" | "full";

function readProductMode(): ProductMode {
  const raw = (import.meta.env?.VITE_PRODUCT_MODE as string | undefined) ?? "";
  const mode = raw.trim().toLowerCase();
  return mode === "full" ? "full" : "safety";
}

export const PRODUCT_MODE: ProductMode = readProductMode();

/** True when the public safe-sex-only facade is active. */
export const isSafetyMode = (): boolean => PRODUCT_MODE === "safety";

/** True when the developer-only full feature set is unlocked. */
export const isFullMode = (): boolean => PRODUCT_MODE === "full";
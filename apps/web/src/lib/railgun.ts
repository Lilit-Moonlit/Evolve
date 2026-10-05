/**
 * Railgun private-balance wrapper for the EVOLVE web app (DI pattern).
 *
 * No top-level `@railgun-community/*` import — the heavy wasm SDK is loaded
 * lazily through `RailgunLoaders` (injected via `initRailgun`), keeping this
 * module pure, browser-safe and fully unit-testable with a mock engine.
 * Validators are reused from the pure `dex-integration` lib; every failure
 * surfaces as a `RailgunError` carrying the offending field name.
 */

import { isEvmAddress, isNonNegativeIntegerString } from "./dex-integration";

/** Error carrying the name of the failing field ("tokenAddress", "amountWei", "engine", …). */
export class RailgunError extends Error {
  readonly field: string;

  constructor(field: string, message?: string) {
    super(message ?? `railgun: invalid ${field}`);
    this.name = "RailgunError";
    this.field = field;
  }
}

/** Structural interface over the real Railgun SDK adapter (mockable in tests). */
export interface RailgunEngine {
  shield(params: {
    tokenAddress: `0x${string}`;
    amountWei: string;
    fromAddress: `0x${string}`;
  }): Promise<string>;
  unshield(params: {
    tokenAddress: `0x${string}`;
    amountWei: string;
    recipientAddress: `0x${string}`;
  }): Promise<string>;
  privateTransfer(params: {
    tokenAddress: `0x${string}`;
    amountWei: string;
    recipient0zk: string;
  }): Promise<string>;
  getShieldedBalance(tokenAddress: `0x${string}`): Promise<bigint>;
}

/** Lazy loaders injected by the app shell — keeps the SDK out of the module graph. */
export interface RailgunLoaders {
  loadEngine(): Promise<RailgunEngine>;
}

let loadersRef: RailgunLoaders | null = null;
let engineRef: RailgunEngine | null = null;

/** Inject loaders and reset any cached engine. */
export function initRailgun(loaders: RailgunLoaders): void {
  if (typeof loaders.loadEngine !== "function") {
    throw new RailgunError("loaders");
  }
  loadersRef = loaders;
  engineRef = null;
}

/** Resolve the engine lazily — `loadEngine` is called at most once and cached. */
async function ensureEngine(): Promise<RailgunEngine> {
  if (!loadersRef) {
    throw new RailgunError("engine", "railgun: engine not initialized — call initRailgun first");
  }
  if (!engineRef) {
    try {
      engineRef = await loadersRef.loadEngine();
    } catch (e) {
      throw new RailgunError("engine", `railgun: engine failed to load: ${(e as Error).message}`);
    }
  }
  return engineRef;
}

/** Positive integer wei amount as a decimal string ("0" rejected). */
function requirePositiveWei(amountWei: unknown): void {
  if (!isNonNegativeIntegerString(amountWei) || amountWei === "0") {
    throw new RailgunError("amountWei");
  }
}

export async function shieldEVOLVE(params: {
  tokenAddress: `0x${string}`;
  amountWei: string;
  fromAddress: `0x${string}`;
}): Promise<string> {
  if (!isEvmAddress(params.tokenAddress)) throw new RailgunError("tokenAddress");
  if (!isEvmAddress(params.fromAddress)) throw new RailgunError("fromAddress");
  requirePositiveWei(params.amountWei);
  const engine = await ensureEngine();
  try {
    return await engine.shield(params);
  } catch (e) {
    throw new RailgunError("engine", `railgun: engine failed to load: ${(e as Error).message}`);
  }
}

export async function unshieldEVOLVE(params: {
  tokenAddress: `0x${string}`;
  amountWei: string;
  recipientAddress: `0x${string}`;
}): Promise<string> {
  if (!isEvmAddress(params.tokenAddress)) throw new RailgunError("tokenAddress");
  if (!isEvmAddress(params.recipientAddress)) throw new RailgunError("recipientAddress");
  requirePositiveWei(params.amountWei);
  const engine = await ensureEngine();
  try {
    return await engine.unshield(params);
  } catch (e) {
    throw new RailgunError("engine", `railgun: engine failed to load: ${(e as Error).message}`);
  }
}

export async function privateTransfer(params: {
  tokenAddress: `0x${string}`;
  amountWei: string;
  recipient0zk: string;
}): Promise<string> {
  if (!isEvmAddress(params.tokenAddress)) throw new RailgunError("tokenAddress");
  if (!isRailgunAddress(params.recipient0zk)) throw new RailgunError("recipient0zk");
  requirePositiveWei(params.amountWei);
  const engine = await ensureEngine();
  try {
    return await engine.privateTransfer(params);
  } catch (e) {
    throw new RailgunError("engine", `railgun: engine failed to load: ${(e as Error).message}`);
  }
}

export async function getShieldedBalance(tokenAddress: `0x${string}`): Promise<bigint> {
  if (!isEvmAddress(tokenAddress)) throw new RailgunError("tokenAddress");
  const engine = await ensureEngine();
  return engine.getShieldedBalance(tokenAddress);
}

/** Railgun z-addresses look like `0zk:1:<hex>` — prefix + sane minimum length. */
export function isRailgunAddress(value: unknown): value is string {
  return typeof value === "string" && value.startsWith("0zk") && value.length >= 20;
}

/**
 * Pure DEX-integration library for the EVOLVE web app.
 *
 * Static DEX configuration (routers/factories) for Arbitrum and Avalanche,
 * plus defensive validators and response parsers for swap quote/tx flows.
 * No network calls, no browser globals — fully unit-testable.
 */

import { networks } from "./networks";

// ─── Chain support ────────────────────────────────────────────────────────────

export const SUPPORTED_DEX_CHAINS = [42161, 43114] as const;
export type SupportedDexChain = (typeof SUPPORTED_DEX_CHAINS)[number];

const SUPPORTED_CHAIN_SET: ReadonlySet<number> = new Set(SUPPORTED_DEX_CHAINS);

// ─── DEX configuration ────────────────────────────────────────────────────────

export interface DexConfig {
  id: string;
  name: string;
  chainId: SupportedDexChain;
  kind: "v3" | "v2" | "lb";
  router: `0x${string}`;
  factory: `0x${string}`;
}

export const DEX_CONFIGS: readonly DexConfig[] = [
  {
    id: "uniswap-v3",
    name: "Uniswap V3",
    chainId: 42161,
    kind: "v3",
    router: "0xC36442b4a4522E871399CD717aBDD847Ab11FE88",
    factory: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
  },
  {
    id: "sushiswap",
    name: "SushiSwap",
    chainId: 42161,
    kind: "v2",
    router: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
    factory: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
  },
  {
    id: "trader-joe",
    name: "Trader Joe (LFJ)",
    chainId: 43114,
    kind: "lb",
    router: "0xb4315e873dBcf96Ffd0acd8EA43f689D8c20fB30",
    factory: "0xb4315e873dBcf96Ffd0acd8EA43f689D8c20fB30",
  },
  {
    id: "pangolin",
    name: "Pangolin",
    chainId: 43114,
    kind: "v2",
    router: "0xE54Ca86531e17Ef3616d22Ca28b0D458b6C89106",
    factory: "0xefa94DE7a4656D787667C749f7E1223D71E9FD88",
  },
];

export function isSupportedChain(chainId: number): chainId is SupportedDexChain {
  return SUPPORTED_CHAIN_SET.has(chainId);
}

export function getDexConfigsForChain(chainId: number): DexConfig[] {
  return DEX_CONFIGS.filter((dex) => dex.chainId === chainId);
}

/** Swap is possible only on a supported chain with contracts deployed. */
export function isSwapAvailable(chainId: number): boolean {
  if (!isSupportedChain(chainId)) return false;
  return networks[chainId]?.deployed === true;
}

// ─── Primitive validators ─────────────────────────────────────────────────────

const EVM_ADDRESS_RE = /^0x[0-9a-fA-F]{40}$/;
const NON_NEGATIVE_INTEGER_RE = /^\d+$/;

export function isEvmAddress(value: unknown): value is `0x${string}` {
  return typeof value === "string" && EVM_ADDRESS_RE.test(value);
}

export function isNonNegativeIntegerString(value: unknown): value is string {
  return typeof value === "string" && NON_NEGATIVE_INTEGER_RE.test(value);
}

/** Slippage tolerance in percent, inclusive bounds [0.01, 50]. */
export function isValidSlippage(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0.01 && value <= 50;
}

// ─── Quote params ─────────────────────────────────────────────────────────────

export type QuoteParams = {
  chainId: SupportedDexChain;
  src: `0x${string}`;
  dst: `0x${string}`;
  amount: string;
  from: `0x${string}`;
  slippage?: number;
};

export type ValidationResult<T> = { ok: true; value: T } | { ok: false; error: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/**
 * Validates raw (untrusted) quote input. On failure `error` carries the name
 * of the FIRST failing field ("input" when the value is not an object).
 */
export function buildQuoteParams(input: unknown): ValidationResult<QuoteParams> {
  if (!isRecord(input)) return { ok: false, error: "input" };
  const { chainId, src, dst, amount, from, slippage } = input;
  if (typeof chainId !== "number" || !isSupportedChain(chainId)) {
    return { ok: false, error: "chainId" };
  }
  if (!isEvmAddress(src)) return { ok: false, error: "src" };
  if (!isEvmAddress(dst)) return { ok: false, error: "dst" };
  if (!isNonNegativeIntegerString(amount)) return { ok: false, error: "amount" };
  if (!isEvmAddress(from)) return { ok: false, error: "from" };
  if (slippage !== undefined) {
    if (!isValidSlippage(slippage)) return { ok: false, error: "slippage" };
    return { ok: true, value: { chainId, src, dst, amount, from, slippage } };
  }
  return { ok: true, value: { chainId, src, dst, amount, from } };
}

// ─── Response parsers ─────────────────────────────────────────────────────────

interface TokenView {
  symbol: string;
  decimals: number;
  address: string;
}

export interface QuoteView {
  toAmount: string;
  fromToken: { symbol: string; decimals: number; address: string };
  toToken: { symbol: string; decimals: number; address: string };
  estimatedGas?: number;
}

function parseTokenView(value: unknown, field: string): ValidationResult<TokenView> {
  if (!isRecord(value)) return { ok: false, error: `${field}: expected an object` };
  const { symbol, decimals, address } = value;
  if (typeof symbol !== "string") return { ok: false, error: `${field}.symbol` };
  if (typeof decimals !== "number") return { ok: false, error: `${field}.decimals` };
  if (typeof address !== "string") return { ok: false, error: `${field}.address` };
  return { ok: true, value: { symbol, decimals, address } };
}

/** Defensively extracts a QuoteView from an untrusted JSON body. */
export function parseQuoteResponse(json: unknown): ValidationResult<QuoteView> {
  if (!isRecord(json)) return { ok: false, error: "quote: expected an object" };
  const { toAmount, fromToken, toToken, estimatedGas } = json;
  if (typeof toAmount !== "string") return { ok: false, error: "toAmount" };
  const from = parseTokenView(fromToken, "fromToken");
  if (!from.ok) return from;
  const to = parseTokenView(toToken, "toToken");
  if (!to.ok) return to;
  const value: QuoteView = { toAmount, fromToken: from.value, toToken: to.value };
  if (typeof estimatedGas === "number") value.estimatedGas = estimatedGas;
  return { ok: true, value };
}

export interface SwapTx {
  from: string;
  to: string;
  data: string;
  value: string;
  gas?: number;
}

/**
 * Defensively extracts the unsigned swap transaction from an untrusted JSON
 * body. Requires `tx.to` and `tx.data`; `value` defaults to "0" and `from`
 * defaults to "" when absent.
 */
export function parseSwapResponse(json: unknown): ValidationResult<{ tx: SwapTx }> {
  if (!isRecord(json)) return { ok: false, error: "swap: expected an object" };
  const { tx } = json;
  if (!isRecord(tx)) return { ok: false, error: "tx: expected an object" };
  const { from, to, data, value, gas } = tx;
  if (typeof to !== "string" || to === "") return { ok: false, error: "tx.to" };
  if (typeof data !== "string" || data === "") return { ok: false, error: "tx.data" };
  const parsed: SwapTx = {
    from: typeof from === "string" ? from : "",
    to,
    data,
    value: typeof value === "string" ? value : "0",
  };
  if (typeof gas === "number") parsed.gas = gas;
  return { ok: true, value: { tx: parsed } };
}

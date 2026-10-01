import { describe, expect, it } from "vitest";
import {
  buildQuoteParams,
  DEX_CONFIGS,
  getDexConfigsForChain,
  isEvmAddress,
  isNonNegativeIntegerString,
  isSupportedChain,
  isSwapAvailable,
  isValidSlippage,
  parseQuoteResponse,
  parseSwapResponse,
  SUPPORTED_DEX_CHAINS,
} from "../dex-integration";

const SRC = `0x${"11".repeat(20)}`;
const DST = `0x${"22".repeat(20)}`;
const FROM = `0x${"33".repeat(20)}`;

const VALID_QUOTE_INPUT = {
  chainId: 42161,
  src: SRC,
  dst: DST,
  amount: "1000000000000000000",
  from: FROM,
};

describe("SUPPORTED_DEX_CHAINS", () => {
  it("contains exactly Arbitrum One (42161) and Avalanche C-Chain (43114)", () => {
    expect(SUPPORTED_DEX_CHAINS).toEqual([42161, 43114]);
  });
});

describe("DEX_CONFIGS", () => {
  it("has exactly 4 entries, 2 per supported chain", () => {
    expect(DEX_CONFIGS).toHaveLength(4);
    const chainIds = DEX_CONFIGS.map((cfg) => cfg.chainId);
    expect(chainIds.filter((id) => id === 42161)).toHaveLength(2);
    expect(chainIds.filter((id) => id === 43114)).toHaveLength(2);
  });

  it("describes Uniswap V3 on Arbitrum with exact router and factory", () => {
    expect(DEX_CONFIGS).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "Uniswap V3",
          chainId: 42161,
          kind: "v3",
          router: "0xC36442b4a4522E871399CD717aBDD847Ab11FE88",
          factory: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
        }),
      ]),
    );
  });

  it("describes SushiSwap on Arbitrum with exact router and factory", () => {
    expect(DEX_CONFIGS).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "SushiSwap",
          chainId: 42161,
          kind: "v2",
          router: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
          factory: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
        }),
      ]),
    );
  });

  it("describes Trader Joe (LFJ) on Avalanche with exact router and factory", () => {
    expect(DEX_CONFIGS).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "Trader Joe (LFJ)",
          chainId: 43114,
          kind: "lb",
          router: "0xb4315e873dBcf96Ffd0acd8EA43f689D8c20fB30",
          factory: "0xb4315e873dBcf96Ffd0acd8EA43f689D8c20fB30",
        }),
      ]),
    );
  });

  it("describes Pangolin on Avalanche with exact router and factory", () => {
    expect(DEX_CONFIGS).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "Pangolin",
          chainId: 43114,
          kind: "v2",
          router: "0xE54Ca86531e17Ef3616d22Ca28b0D458b6C89106",
          factory: "0xefa94DE7a4656D787667C749f7E1223D71E9FD88",
        }),
      ]),
    );
  });

  it("gives every config a non-empty id", () => {
    for (const cfg of DEX_CONFIGS) {
      expect(typeof cfg.id).toBe("string");
      expect(cfg.id).not.toBe("");
    }
  });
});

describe("isSupportedChain", () => {
  it("accepts 42161 and 43114", () => {
    expect(isSupportedChain(42161)).toBe(true);
    expect(isSupportedChain(43114)).toBe(true);
  });

  it("rejects other chains", () => {
    expect(isSupportedChain(1)).toBe(false);
    expect(isSupportedChain(137)).toBe(false);
  });
});

describe("getDexConfigsForChain", () => {
  it("returns 2 configs for Arbitrum and 2 for Avalanche", () => {
    expect(getDexConfigsForChain(42161)).toHaveLength(2);
    expect(getDexConfigsForChain(43114)).toHaveLength(2);
  });

  it("returns an empty list for unsupported chains", () => {
    expect(getDexConfigsForChain(1)).toEqual([]);
  });
});

describe("isSwapAvailable", () => {
  it("returns false for supported chains while networks.ts marks them deployed: false", () => {
    expect(isSwapAvailable(42161)).toBe(false);
    expect(isSwapAvailable(43114)).toBe(false);
  });

  it("returns false for unsupported chains", () => {
    expect(isSwapAvailable(1)).toBe(false);
  });
});

describe("isEvmAddress", () => {
  it("accepts 0x + 40 hex chars in any case", () => {
    expect(isEvmAddress(`0x${"1".repeat(40)}`)).toBe(true);
    expect(isEvmAddress(`0x${"a".repeat(40)}`)).toBe(true);
    expect(isEvmAddress(`0x${"F".repeat(40)}`)).toBe(true);
    expect(isEvmAddress("0xC36442b4a4522E871399CD717aBDD847Ab11FE88")).toBe(true);
  });

  it("rejects wrong lengths", () => {
    expect(isEvmAddress(`0x${"1".repeat(39)}`)).toBe(false);
    expect(isEvmAddress(`0x${"1".repeat(41)}`)).toBe(false);
    expect(isEvmAddress("0x")).toBe(false);
    expect(isEvmAddress("")).toBe(false);
  });

  it("rejects missing 0x prefix", () => {
    expect(isEvmAddress("1".repeat(40))).toBe(false);
  });

  it("rejects non-hex characters", () => {
    expect(isEvmAddress(`0x${"g".repeat(40)}`)).toBe(false);
    expect(isEvmAddress(`0x${"z1".repeat(20)}`)).toBe(false);
  });

  it("rejects non-strings", () => {
    expect(isEvmAddress(42)).toBe(false);
    expect(isEvmAddress(null)).toBe(false);
    expect(isEvmAddress(undefined)).toBe(false);
    expect(isEvmAddress({ address: `0x${"1".repeat(40)}` })).toBe(false);
    expect(isEvmAddress([`0x${"1".repeat(40)}`])).toBe(false);
  });
});

describe("isNonNegativeIntegerString", () => {
  it("accepts digit-only strings", () => {
    expect(isNonNegativeIntegerString("0")).toBe(true);
    expect(isNonNegativeIntegerString("15")).toBe(true);
    expect(isNonNegativeIntegerString("1000000000000000000")).toBe(true);
  });

  it("rejects empty, negative, signed, decimal, exponent and hex forms", () => {
    expect(isNonNegativeIntegerString("")).toBe(false);
    expect(isNonNegativeIntegerString("-1")).toBe(false);
    expect(isNonNegativeIntegerString("+1")).toBe(false);
    expect(isNonNegativeIntegerString("1.5")).toBe(false);
    expect(isNonNegativeIntegerString("1e5")).toBe(false);
    expect(isNonNegativeIntegerString("0x1")).toBe(false);
  });

  it("rejects surrounding whitespace", () => {
    expect(isNonNegativeIntegerString(" 1")).toBe(false);
    expect(isNonNegativeIntegerString("1 ")).toBe(false);
    expect(isNonNegativeIntegerString("\t1\n")).toBe(false);
  });

  it("rejects non-strings", () => {
    expect(isNonNegativeIntegerString(42)).toBe(false);
    expect(isNonNegativeIntegerString(null)).toBe(false);
    expect(isNonNegativeIntegerString(undefined)).toBe(false);
  });
});

describe("isValidSlippage", () => {
  it("accepts the inclusive boundaries 0.01 and 50", () => {
    expect(isValidSlippage(0.01)).toBe(true);
    expect(isValidSlippage(50)).toBe(true);
  });

  it("accepts values inside the range", () => {
    expect(isValidSlippage(0.5)).toBe(true);
    expect(isValidSlippage(25)).toBe(true);
  });

  it("rejects values outside the range", () => {
    expect(isValidSlippage(0)).toBe(false);
    expect(isValidSlippage(0.009)).toBe(false);
    expect(isValidSlippage(51)).toBe(false);
  });

  it("rejects non-finite numbers and non-numbers", () => {
    expect(isValidSlippage(NaN)).toBe(false);
    expect(isValidSlippage(Infinity)).toBe(false);
    expect(isValidSlippage(-Infinity)).toBe(false);
    expect(isValidSlippage("0.5")).toBe(false);
    expect(isValidSlippage(null)).toBe(false);
  });
});

describe("buildQuoteParams", () => {
  it("builds params from a valid input without slippage", () => {
    expect(buildQuoteParams(VALID_QUOTE_INPUT)).toEqual({
      ok: true,
      value: { ...VALID_QUOTE_INPUT },
    });
  });

  it("keeps a valid slippage", () => {
    expect(buildQuoteParams({ ...VALID_QUOTE_INPUT, slippage: 0.5 })).toEqual({
      ok: true,
      value: { ...VALID_QUOTE_INPUT, slippage: 0.5 },
    });
  });

  it("rejects non-object input", () => {
    expect(buildQuoteParams(null)).toEqual({ ok: false, error: "input" });
    expect(buildQuoteParams("nope")).toEqual({ ok: false, error: "input" });
  });

  it("reports chainId as the first failing field when unsupported or mistyped", () => {
    expect(buildQuoteParams({ ...VALID_QUOTE_INPUT, chainId: 1 })).toEqual({
      ok: false,
      error: "chainId",
    });
    expect(buildQuoteParams({ ...VALID_QUOTE_INPUT, chainId: "42161" })).toEqual({
      ok: false,
      error: "chainId",
    });
  });

  it("reports src for an invalid source address", () => {
    expect(buildQuoteParams({ ...VALID_QUOTE_INPUT, src: "0x123" })).toEqual({
      ok: false,
      error: "src",
    });
  });

  it("reports dst for an invalid destination address", () => {
    expect(buildQuoteParams({ ...VALID_QUOTE_INPUT, dst: 42 })).toEqual({
      ok: false,
      error: "dst",
    });
  });

  it("reports amount for a non digit-only string", () => {
    expect(buildQuoteParams({ ...VALID_QUOTE_INPUT, amount: "1.5" })).toEqual({
      ok: false,
      error: "amount",
    });
    expect(buildQuoteParams({ ...VALID_QUOTE_INPUT, amount: 1000 })).toEqual({
      ok: false,
      error: "amount",
    });
  });

  it("reports from for an invalid sender address", () => {
    expect(buildQuoteParams({ ...VALID_QUOTE_INPUT, from: "1".repeat(40) })).toEqual({
      ok: false,
      error: "from",
    });
  });

  it("reports slippage when present but invalid", () => {
    expect(buildQuoteParams({ ...VALID_QUOTE_INPUT, slippage: 0 })).toEqual({
      ok: false,
      error: "slippage",
    });
    expect(buildQuoteParams({ ...VALID_QUOTE_INPUT, slippage: 51 })).toEqual({
      ok: false,
      error: "slippage",
    });
    expect(buildQuoteParams({ ...VALID_QUOTE_INPUT, slippage: "0.5" })).toEqual({
      ok: false,
      error: "slippage",
    });
  });

  it("returns the FIRST failing field when several fields are invalid", () => {
    expect(
      buildQuoteParams({ chainId: 1, src: "bad", dst: "bad", amount: -1, from: "bad" }),
    ).toEqual({ ok: false, error: "chainId" });
  });
});

describe("parseQuoteResponse", () => {
  const TOKEN_EVOLVE = { symbol: "EVOLVE", decimals: 18, address: SRC };
  const TOKEN_WETH = { symbol: "WETH", decimals: 18, address: DST };

  it("parses a complete quote with estimatedGas", () => {
    expect(
      parseQuoteResponse({
        toAmount: "2000000000000000000",
        fromToken: TOKEN_EVOLVE,
        toToken: TOKEN_WETH,
        estimatedGas: 180000,
      }),
    ).toEqual({
      ok: true,
      value: {
        toAmount: "2000000000000000000",
        fromToken: TOKEN_EVOLVE,
        toToken: TOKEN_WETH,
        estimatedGas: 180000,
      },
    });
  });

  it("parses a quote without optional estimatedGas", () => {
    expect(
      parseQuoteResponse({
        toAmount: "1",
        fromToken: TOKEN_EVOLVE,
        toToken: TOKEN_WETH,
      }),
    ).toEqual({
      ok: true,
      value: { toAmount: "1", fromToken: TOKEN_EVOLVE, toToken: TOKEN_WETH },
    });
  });

  it("fails when toAmount is missing or not a string", () => {
    expect(parseQuoteResponse({ fromToken: TOKEN_EVOLVE, toToken: TOKEN_WETH })).toEqual({
      ok: false,
      error: expect.any(String),
    });
    expect(
      parseQuoteResponse({ toAmount: 42, fromToken: TOKEN_EVOLVE, toToken: TOKEN_WETH }),
    ).toEqual({
      ok: false,
      error: expect.any(String),
    });
  });

  it("fails when a token object is missing required fields", () => {
    expect(
      parseQuoteResponse({
        toAmount: "1",
        fromToken: { decimals: 18, address: SRC },
        toToken: TOKEN_WETH,
      }),
    ).toEqual({ ok: false, error: expect.any(String) });
    expect(parseQuoteResponse({ toAmount: "1", fromToken: TOKEN_EVOLVE, toToken: null })).toEqual({
      ok: false,
      error: expect.any(String),
    });
  });

  it("fails for non-object json", () => {
    expect(parseQuoteResponse(null)).toEqual({ ok: false, error: expect.any(String) });
    expect(parseQuoteResponse("nope")).toEqual({ ok: false, error: expect.any(String) });
  });
});

describe("parseSwapResponse", () => {
  const ROUTER = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";

  it("parses a complete swap transaction", () => {
    expect(
      parseSwapResponse({
        tx: { from: FROM, to: ROUTER, data: "0x12345678", value: "0", gas: 150000 },
      }),
    ).toEqual({
      ok: true,
      value: { tx: { from: FROM, to: ROUTER, data: "0x12345678", value: "0", gas: 150000 } },
    });
  });

  it("defaults from to empty string and value to 0 when absent", () => {
    expect(parseSwapResponse({ tx: { to: ROUTER, data: "0xdead" } })).toEqual({
      ok: true,
      value: { tx: { from: "", to: ROUTER, data: "0xdead", value: "0" } },
    });
  });

  it("fails when tx is missing or not an object", () => {
    expect(parseSwapResponse({})).toEqual({ ok: false, error: expect.any(String) });
    expect(parseSwapResponse({ tx: "nope" })).toEqual({ ok: false, error: expect.any(String) });
  });

  it("fails when to or data is missing or empty", () => {
    expect(parseSwapResponse({ tx: { data: "0xdead" } })).toEqual({
      ok: false,
      error: expect.any(String),
    });
    expect(parseSwapResponse({ tx: { to: ROUTER } })).toEqual({
      ok: false,
      error: expect.any(String),
    });
    expect(parseSwapResponse({ tx: { to: "", data: "0xdead" } })).toEqual({
      ok: false,
      error: expect.any(String),
    });
  });
});

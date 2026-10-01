import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const SRC = "0x1111111111111111111111111111111111111111";
const DST = "0x2222222222222222222222222222222222222222";
const FROM = "0x3333333333333333333333333333333333333333";
const AMOUNT = "1000000000000000000";
const QUOTE_URL = "/api/dex/quote";
const SWAP_URL = "/api/dex/swap";

/**
 * Mutable wallet doubles shared with the hoisted wagmi mock factory.
 * Tests mutate this object to simulate connection/chain state.
 */
const walletState = vi.hoisted(() => ({
  address: undefined as string | undefined,
  isConnected: false,
  chainId: 42161,
  txSuccess: false,
  switchChainCalls: [] as Array<{ chainId: number }>,
  sentTxs: [] as Array<Record<string, unknown>>,
}));

/** Lets one describe-block force `isSwapAvailable` to true to reach the swap flow. */
const dexState = vi.hoisted(() => ({ forceSwapAvailable: false }));

vi.mock("wagmi", () => ({
  useAccount: () => ({
    address: walletState.address,
    isConnected: walletState.isConnected,
    status: walletState.isConnected ? "connected" : "disconnected",
  }),
  useChainId: () => walletState.chainId,
  useSwitchChain: () => ({
    chains: [],
    switchChain: (args: { chainId: number }) => {
      walletState.switchChainCalls.push(args);
    },
  }),
  useSendTransaction: () => ({
    sendTransaction: (args: Record<string, unknown>) => {
      walletState.sentTxs.push(args);
      walletState.txSuccess = true;
    },
    isPending: false,
    isError: false,
    isSuccess: walletState.txSuccess,
  }),
}));

vi.mock("../../lib/dex-integration", async () => {
  const actual = await vi.importActual<typeof import("../../lib/dex-integration")>(
    "../../lib/dex-integration",
  );
  return {
    ...actual,
    isSwapAvailable: (chainId: number) =>
      dexState.forceSwapAvailable || actual.isSwapAvailable(chainId),
  };
});

import DexSwap from "../DexSwap";

interface TestResponse {
  ok: boolean;
  status: number;
  json: () => Promise<unknown>;
}

const QUOTE_PAYLOAD = {
  toAmount: "123",
  fromToken: { symbol: "EVOLVE", decimals: 18, address: SRC },
  toToken: { symbol: "WETH", decimals: 18, address: DST },
};

const SWAP_PAYLOAD = {
  tx: { from: FROM, to: DST, data: "0x12345678", value: "0" },
};

function jsonResponse(status: number, payload: unknown): TestResponse {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => payload,
  };
}

const fetchMock = vi.fn<(input: string, init?: RequestInit) => Promise<TestResponse>>();

function connectWallet(): void {
  walletState.isConnected = true;
  walletState.address = FROM;
  walletState.chainId = 42161;
}

function fillForm(): void {
  fireEvent.change(screen.getByLabelText("dex.from"), {
    target: { value: SRC },
  });
  fireEvent.change(screen.getByLabelText("dex.to"), {
    target: { value: DST },
  });
  fireEvent.change(screen.getByLabelText("dex.amount"), {
    target: { value: AMOUNT },
  });
}

beforeEach(() => {
  walletState.address = undefined;
  walletState.isConnected = false;
  walletState.chainId = 42161;
  walletState.txSuccess = false;
  walletState.switchChainCalls = [];
  walletState.sentTxs = [];
  dexState.forceSwapAvailable = false;
  fetchMock.mockReset();
  fetchMock.mockImplementation(async () => jsonResponse(404, { error: "nf" }));
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("DexSwap", () => {
  it("renders the swap title and subtitle", () => {
    render(<DexSwap />);
    expect(screen.getByText("dex.title")).toBeInTheDocument();
    expect(screen.getByText("dex.subtitle")).toBeInTheDocument();
  });

  it("shows dex.notAvailable and disables the swap action when isSwapAvailable is false", () => {
    connectWallet();
    render(<DexSwap />);
    expect(screen.getByText("dex.notAvailable")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "dex.swap" })).toBeDisabled();
  });

  it("disables actions and shows a connect prompt when the wallet is not connected", () => {
    render(<DexSwap />);
    expect(screen.getByText("auth.connectWallet.title")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "dex.getQuote" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "dex.swap" })).toBeDisabled();
  });

  it("renders the quoted output amount after a successful quote", async () => {
    connectWallet();
    fetchMock.mockImplementation(async (url) =>
      url === QUOTE_URL ? jsonResponse(200, QUOTE_PAYLOAD) : jsonResponse(404, {}),
    );
    render(<DexSwap />);
    fillForm();
    fireEvent.click(screen.getByRole("button", { name: "dex.getQuote" }));

    expect(await screen.findByText("123")).toBeInTheDocument();
    expect(screen.getByText("dex.estimatedOutput")).toBeInTheDocument();

    const call = fetchMock.mock.calls.find(([url]) => url === QUOTE_URL);
    expect(call).toBeDefined();
    if (!call) return;
    const [calledUrl, init] = call;
    expect(calledUrl).toBe(QUOTE_URL);
    expect(init?.method).toBe("POST");
    const body = JSON.parse(String(init?.body)) as Record<string, unknown>;
    expect(body).toMatchObject({
      chainId: 42161,
      src: SRC,
      dst: DST,
      amount: AMOUNT,
      from: FROM,
      slippage: 1,
    });
  });

  it("shows dex.proxyNotConfigured when the quote proxy returns 503", async () => {
    connectWallet();
    fetchMock.mockImplementation(async (url) =>
      url === QUOTE_URL
        ? jsonResponse(503, { error: "DEX proxy not configured" })
        : jsonResponse(404, {}),
    );
    render(<DexSwap />);
    fillForm();
    fireEvent.click(screen.getByRole("button", { name: "dex.getQuote" }));

    expect(await screen.findByText("dex.proxyNotConfigured")).toBeInTheDocument();
  });

  it("shows dex.quoteError when the quote request fails", async () => {
    connectWallet();
    fetchMock.mockImplementation(async (url) =>
      url === QUOTE_URL ? jsonResponse(500, { error: "boom" }) : jsonResponse(404, {}),
    );
    render(<DexSwap />);
    fillForm();
    fireEvent.click(screen.getByRole("button", { name: "dex.getQuote" }));

    expect(await screen.findByText("dex.quoteError")).toBeInTheDocument();
  });

  it("sends the fetched transaction via useSendTransaction after a swap request", async () => {
    connectWallet();
    dexState.forceSwapAvailable = true;
    fetchMock.mockImplementation(async (url) => {
      if (url === QUOTE_URL) return jsonResponse(200, QUOTE_PAYLOAD);
      if (url === SWAP_URL) return jsonResponse(200, SWAP_PAYLOAD);
      return jsonResponse(404, {});
    });
    render(<DexSwap />);
    fillForm();
    fireEvent.click(screen.getByRole("button", { name: "dex.getQuote" }));
    expect(await screen.findByText("123")).toBeInTheDocument();

    const swapButton = screen.getByRole("button", { name: "dex.swap" });
    expect(swapButton).toBeEnabled();
    fireEvent.click(swapButton);

    await waitFor(() => expect(walletState.sentTxs.length).toBe(1));
    expect(walletState.sentTxs[0]).toMatchObject({
      to: DST,
      data: "0x12345678",
      value: 0n,
      chainId: 42161,
    });
    expect(screen.getByText("dex.swapSuccess")).toBeInTheDocument();
  });

  it("switches the wallet chain when selecting a chain the wallet is not on", () => {
    connectWallet();
    walletState.chainId = 1; // wallet on Ethereum mainnet
    render(<DexSwap />);

    fireEvent.click(screen.getByRole("button", { name: "Avalanche" }));

    expect(walletState.switchChainCalls).toEqual([{ chainId: 43114 }]);
  });
});

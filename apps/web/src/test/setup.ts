import "@testing-library/jest-dom";

vi.mock("wagmi", async () => {
  const actual = await vi.importActual("wagmi");
  return {
    ...(actual as any),
    useAccount: () => ({
      address: "0x1234567890abcdef1234567890abcdef12345678",
      isConnected: false,
      isConnecting: false,
      isDisconnected: true,
      chainId: 1,
    }),
    useDisconnect: () => ({
      disconnect: vi.fn(),
    }),
    useChainId: () => 1,
    useBalance: () => ({
      data: { formatted: "1.5", symbol: "ETH" },
      isError: false,
      isLoading: false,
    }),
    usePublicClient: () => ({
      read: vi.fn(),
      waitForTransactionReceipt: vi.fn(),
    }),
    useWalletClient: () => ({ data: null }),
    useSwitchChain: () => ({ chains: [], switchChain: vi.fn() }),
    useSendTransaction: () => ({
      sendTransaction: vi.fn(),
      isPending: false,
      isError: false,
      isSuccess: false,
    }),
  };
});

// The real `country-state-city` dataset (~150k city records) takes multiple
// seconds of synchronous CPU to import and index inside a test worker. That
// starves the event loop, stalls `waitFor` polling, and pushes Home-rendering
// tests past the 5s test timeout (flaky failures). No test asserts on real geo
// data, so every test file gets a tiny fake dataset instead.
vi.mock("country-state-city", () => ({
  Country: {
    getAllCountries: () => [
      { isoCode: "UA", name: "Ukraine" },
      { isoCode: "PL", name: "Poland" },
      { isoCode: "DE", name: "Germany" },
    ],
  },
  City: {
    getCitiesOfCountry: (isoCode: string) =>
      ({
        UA: [{ name: "Kyiv" }, { name: "Lviv" }],
        PL: [{ name: "Warsaw" }, { name: "Krakow" }],
        DE: [{ name: "Berlin" }],
      })[isoCode] ?? [],
  },
}));

// jsdom ships no fetch, so Node's undici fetch is used — and it rejects
// relative URLs ("/api/...") with "TypeError: Failed to parse URL" whenever a
// component's session/data check runs in a test that does not stub fetch.
// Default to a benign unauthenticated JSON response for relative URLs; tests
// that call vi.stubGlobal("fetch", ...) themselves override this default (and
// vi.unstubAllGlobals restores it), while absolute URLs still reach real fetch.
// Assigned directly instead of via vi.stubGlobal so that vi.unstubAllGlobals()
// treats this wrapper as the original value rather than discarding it.
const realFetch = globalThis.fetch.bind(globalThis);
globalThis.fetch = (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
  if (url.startsWith("/")) {
    return Promise.resolve(
      new Response(JSON.stringify({ authenticated: false }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
  }
  return realFetch(input, init);
};

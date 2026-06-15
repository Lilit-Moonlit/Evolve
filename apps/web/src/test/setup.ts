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
  };
});

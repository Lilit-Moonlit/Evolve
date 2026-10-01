import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi, beforeEach } from "vitest";
import Home from "./Home";
import { AppStateProvider } from "../store/AppContext";

vi.mock("wagmi", () => ({
  useAccount: vi.fn(() => ({
    address: undefined,
    isConnected: false,
    status: "disconnected",
  })),
  useDisconnect: vi.fn(() => ({ disconnect: vi.fn() })),
  useChainId: vi.fn(() => 1),
  usePublicClient: vi.fn(() => null),
  useWalletClient: vi.fn(() => ({ data: undefined })),
  useReadContract: vi.fn(() => ({ data: 50n })),
}));

beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({
      ok: true,
      status: 200,
      json: async () => ({ authenticated: false }),
    })),
  );
});

test("renders Home component with filters", () => {
  render(
    <MemoryRouter>
      <AppStateProvider>
        <Home />
      </AppStateProvider>
    </MemoryRouter>,
  );
  const filterLabel = screen.getByText(/filters\.stdCompatible/i);
  expect(filterLabel).toBeInTheDocument();
});

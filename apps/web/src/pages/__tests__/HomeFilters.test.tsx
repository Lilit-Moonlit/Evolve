import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, beforeEach, vi } from "vitest";
import Home from "../Home";
import { AppStateProvider } from "../../store/AppContext";

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
  localStorage.clear();
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({
      ok: true,
      status: 200,
      json: async () => ({ authenticated: false }),
    })),
  );
});

function renderHome() {
  return render(
    <MemoryRouter>
      <AppStateProvider>
        <Home />
      </AppStateProvider>
    </MemoryRouter>,
  );
}

describe("Home search mode filter", () => {
  it("renders three mode radio options", () => {
    renderHome();
    expect(
      screen.getByLabelText(/home\.filters\.modeNormal/i),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/home\.filters\.modePregnancyBond/i),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/home\.filters\.modeCrypticChoice/i),
    ).toBeInTheDocument();
  });

  it("defaults to normal mode and persists to evolve_search_mode on change", async () => {
    renderHome();

    const normalRadio = screen.getByLabelText(
      /home\.filters\.modeNormal/i,
    ) as HTMLInputElement;
    const crypticRadio = screen.getByLabelText(
      /home\.filters\.modeCrypticChoice/i,
    ) as HTMLInputElement;

    expect(normalRadio.checked).toBe(true);

    fireEvent.click(crypticRadio);

    await waitFor(() => {
      expect(crypticRadio.checked).toBe(true);
      expect(localStorage.getItem("evolve_search_mode")).toBe("cryptic-choice");
    });
  });

  it("restores saved search mode from localStorage on mount", () => {
    localStorage.setItem("evolve_search_mode", "pregnancy-bond");
    renderHome();
    const pregnancyRadio = screen.getByLabelText(
      /home\.filters\.modePregnancyBond/i,
    ) as HTMLInputElement;
    expect(pregnancyRadio.checked).toBe(true);
  });

  it("opens verification requirements modal via info button", () => {
    renderHome();
    fireEvent.click(
      screen.getByRole("button", { name: /verificationModal\.title/i }),
    );
    expect(
      screen.getByText("verificationModal.womenRequirements"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("verificationModal.menRequirements"),
    ).toBeInTheDocument();
  });
});

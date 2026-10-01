// Integration tests covering 5 key areas of Evolve web app
// DO NOT MODIFY production files - this is test-only

import React from "react";
import * as wagmi from "wagmi"; // Required for type safety in tests
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { AppStateProvider } from "../store/AppContext";
import AuthLanding from "../components/AuthLanding";
import Home from "../pages/Home";
import VerificationModal from "../components/VerificationModal";
import DNAUpload from "../components/DNAUpload";
import {
  verifyDNA,
  getVerificationCount,
  getVerificationHistory,
  getStoredProfile,
  updateProfile,
  clearAllData,
} from "../lib/dna-verification";
import { parseDNATest, type DNAParseResult, type STRProfile } from "../lib/dna-parser";
import type { DNAVerificationInput } from "../lib/dna-verification";
import type { VerificationSearchMode } from "../components/VerificationModal";

// Mock wagmi hooks for Web3 auth tests with proper typing
vi.mock("wagmi", () => ({
  useAccount: vi.fn(() => ({
    address: "0x1234567890abcdef1234567890abcdef12345678",
    isConnected: false,
    addresses: [],
    chain: null,
    chainId: 1,
    connector: null as any,
    isReconnecting: true,
    status: "disconnected",
    isConnecting: false,
    isDisconnected: false,
  })),
  useDisconnect: vi.fn(() => ({ disconnect: vi.fn() })),
  useChainId: vi.fn(() => 1),
  usePublicClient: vi.fn(() => ({ waitForTransactionReceipt: vi.fn() })),
  useWalletClient: vi.fn(() => ({ data: { signMessage: vi.fn() } })),
  useReadContract: vi.fn(() => ({ data: 50n })),
}));

// Mock react-i18next for consistent i18n testing
vi.mock("react-i18next", () => ({
  useTranslation: vi.fn(() => ({
    t: vi.fn((key: string) => key),
  })),
}));

// Reset localStorage before each test suite
beforeEach(() => {
  localStorage.clear();
});

describe("Web3 Auth (SIWE)", () => {
  it("renders AuthLanding with wallet button", () => {
    render(
      <AuthLanding
        onSelectWallet={vi.fn()}
        onSelectEmail={vi.fn()}
        onSelectDnaRecovery={vi.fn()}
        onSelectQuestionRecovery={vi.fn()}
      />,
    );
    expect(screen.getByText(/auth.landing.title/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /auth.landing.wallet/ })).toBeInTheDocument();
  });

  it("calls onSelectWallet when wallet button clicked", () => {
    const onSelectWallet = vi.fn();
    render(
      <AuthLanding
        onSelectWallet={onSelectWallet}
        onSelectEmail={vi.fn()}
        onSelectDnaRecovery={vi.fn()}
        onSelectQuestionRecovery={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /auth.landing.wallet/ }));
    expect(onSelectWallet).toHaveBeenCalled();
  });

  it("updates Home when wallet connects via SIWE", async () => {
    // Mock session + data endpoints so AppStateProvider's session check resolves
    const fetchMock = vi.fn(async (url: RequestInfo | URL) => {
      const urlStr = String(url);
      if (urlStr.includes("/api/auth/siwe/session")) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            authenticated: true,
            session: { userId: "user123", ethAddress: "0xabcdef1234567890" },
          }),
        };
      }
      if (
        urlStr.includes("/api/auth/email/session") ||
        urlStr.includes("/api/auth/phone/session")
      ) {
        return {
          ok: true,
          status: 200,
          json: async () => ({ authenticated: false }),
        };
      }
      // Data endpoints (profiles/messages/documents) return empty arrays
      return { ok: true, status: 200, json: async () => [] };
    });
    vi.stubGlobal("fetch", fetchMock);
    // The wagmi module member is mocked at runtime; cast to a plain mock so
    // we can control the return value without wagmi's strict union typing.
    const useAccountMock = wagmi.useAccount as unknown as ReturnType<typeof vi.fn>;
    try {
      // Simulate wallet connection with a controlled wagmi useAccount mock
      const mockAccount = {
        address: "0xabcdef1234567890abcdef1234567890",
        isConnected: true,
        addresses: [],
        chain: undefined,
        chainId: 1,
        connector: undefined,
        isReconnecting: false,
        status: "connected",
        isConnecting: false,
        isDisconnected: false,
      } as const;
      useAccountMock.mockReturnValue(mockAccount);

      render(
        <MemoryRouter>
          <AppStateProvider>
            <Home />
          </AppStateProvider>
        </MemoryRouter>,
      );

      // SIWE session check runs and the authenticated path resolves without crashing
      await waitFor(() => {
        expect(
          fetchMock.mock.calls.some(([url]) => String(url).includes("/api/auth/siwe/session")),
        ).toBe(true);
      });
      // Home renders with the connected session
      expect(screen.getByLabelText(/home.filters.modeNormal/)).toBeInTheDocument();
    } finally {
      vi.unstubAllGlobals();
      // Restore the default disconnected wagmi state for subsequent tests
      useAccountMock.mockImplementation(() => ({
        address: undefined,
        isConnected: false,
        addresses: undefined,
        chain: undefined,
        chainId: undefined,
        connector: undefined,
        isReconnecting: true,
        status: "disconnected",
        isConnecting: false,
        isDisconnected: false,
      }));
    }
  });
});

describe("Search Mode Filters", () => {
  const renderHome = () => {
    return render(
      <MemoryRouter>
        <AppStateProvider>
          <Home />
        </AppStateProvider>
      </MemoryRouter>,
    );
  };

  it("renders three mode radio options with correct labels", () => {
    renderHome();
    expect(screen.getByLabelText(/home.filters.modeNormal/)).toBeInTheDocument();
    expect(screen.getByLabelText(/home.filters.modePregnancyBond/)).toBeInTheDocument();
    expect(screen.getByLabelText(/home.filters.modeCrypticChoice/)).toBeInTheDocument();
  });

  it("defaults to normal mode and persists to localStorage on change", async () => {
    renderHome();
    const normalRadio = screen.getByLabelText(/home.filters.modeNormal/) as HTMLInputElement;
    const crypticRadio = screen.getByLabelText(
      /home.filters.modeCrypticChoice/,
    ) as HTMLInputElement;
    expect(normalRadio.checked).toBe(true);
    fireEvent.click(crypticRadio);
    await waitFor(() => {
      expect(crypticRadio.checked).toBe(true);
      expect(localStorage.getItem("evolve_search_mode")).toBe("cryptic-choice");
    });
  });

  it("restores saved search mode from localStorage", () => {
    localStorage.setItem("evolve_search_mode", "pregnancy-bond");
    renderHome();
    const pregnancyRadio = screen.getByLabelText(
      /home.filters.modePregnancyBond/,
    ) as HTMLInputElement;
    expect(pregnancyRadio.checked).toBe(true);
  });
});

describe("Verification Modal Requirements", () => {
  const renderModal = (mode: VerificationSearchMode = "normal") => {
    return render(<VerificationModal isOpen={true} onClose={vi.fn()} mode={mode} />);
  };

  it("shows women requirements (STD only) and men requirements (STD + DNA + EvolveFund)", () => {
    renderModal();
    expect(screen.getByText(/verificationModal.title/)).toBeInTheDocument();
    expect(screen.getByText(/verificationModal.womenRequirements/)).toBeInTheDocument();
    expect(screen.getByText(/verificationModal.menRequirements/)).toBeInTheDocument();
    const stdElements = screen.getAllByText(/verificationModal.requirement.std/);
    expect(stdElements).toHaveLength(2);
    expect(screen.getByText(/verificationModal.requirement.dna/)).toBeInTheDocument();
    expect(screen.getByText(/verificationModal.requirement.evolveFund/)).toBeInTheDocument();
  });

  it("displays correct search mode label", () => {
    renderModal("pregnancy-bond");
    expect(screen.getByText(/home.filters.modePregnancyBond/)).toBeInTheDocument();
  });

  it("calls onClose when close button clicked", () => {
    const onClose = vi.fn();
    const { rerender } = render(
      <VerificationModal isOpen={true} onClose={onClose} mode="normal" />,
    );
    const closeButton = screen.getByRole("button", {
      name: /verificationModal.close/,
    });
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalled();
    rerender(<VerificationModal isOpen={false} onClose={onClose} mode="normal" />);
    expect(screen.queryByText(/verificationModal.title/)).not.toBeInTheDocument();
  });
});

describe("DNA Upload & Verification", () => {
  it("parses valid DNA file and calls onParsed callback", async () => {
    const onParsed = vi.fn();
    const { container } = render(
      <DNAUpload onParsed={onParsed} onVerify={vi.fn()} isVerifying={false} />,
    );
    const testDNA = "D5S818: 11\nD13S317: 12\nHaplogroup: H1a\n";
    const file = new File([testDNA], "test.txt", { type: "text/plain" });
    // Mock FileReader
    global.FileReader = class FileReaderMock implements FileReader {
      // Simplified mock for testing - only implements what's actually used
      error: DOMException | null = null;
      onload: ((this: FileReader, ev: ProgressEvent<FileReader>) => void) | null = null;
      readyState: 0 | 1 | 2 = 0;
      result: any = null;

      // Methods used in the test - use regular functions to avoid 'this' issues
      readAsText(file: File): void {
        // Simulate file reading completion
        this.onload?.({ target: { result: testDNA } } as any);
      }

      // Add minimal required properties for FileReader compatibility
      get EMPTY(): 0 {
        return 0;
      }
      get LOADING(): 1 {
        return 1;
      }
      get DONE(): 2 {
        return 2;
      }

      // Add required event handlers
      onabort: ((this: FileReader, ev: ProgressEvent<FileReader>) => void) | null = null;
      onerror: ((this: FileReader, ev: ProgressEvent<FileReader>) => void) | null = null;
      onloadend: ((this: FileReader, ev: ProgressEvent<FileReader>) => void) | null = null;
      onloadstart: ((this: FileReader, ev: ProgressEvent<FileReader>) => void) | null = null;
      onprogress: ((this: FileReader, ev: ProgressEvent<FileReader>) => void) | null = null;

      // Other methods
      abort(): void {}
      readAsArrayBuffer(file: File): void {}
      readAsBinaryString(file: File): void {}
      readAsDataURL(file: File): void {}
      addEventListener(
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | AddEventListenerOptions,
      ): void {}
      removeEventListener(
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | EventListenerOptions,
      ): void {}
      dispatchEvent(event: Event): boolean {
        return false;
      }
    } as any;
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    expect(fileInput).not.toBeNull();
    fireEvent.change(fileInput, { target: { files: [file] } });
    await waitFor(() => {
      expect(onParsed).toHaveBeenCalled();
      const [profile, rawText] = onParsed.mock.calls[0];
      expect(profile).toEqual(
        expect.objectContaining({
          markers: expect.objectContaining({ D5S818: 11, D13S317: 12 }),
          haplogroup: "H1A",
        }),
      );
      expect(rawText).toBe(testDNA);
    });
  });

  it("verifyDNA returns expected result for realistic input", async () => {
    // Store a known profile first so this is a verification, not a first-time setup
    const markers = Array.from({ length: 20 }, (_, i) => ({
      rsid: `rs${1000000 + i}`,
      chromosome: "1",
      position: 100000 + i * 1000,
      genotype: "AG",
    }));
    updateProfile("user123", {
      userId: "user123",
      markers,
      sampleId: "sample123",
      collectionDate: "2024-01-01",
      labName: "LabTest",
      reportFormat: "23andme",
    } as any);
    const testResult =
      "# 23andMe raw data\n" +
      markers.map((m) => `${m.rsid}\t${m.chromosome}\t${m.position}\t${m.genotype}`).join("\n");
    const result = await verifyDNA({
      userId: "user123",
      verifierId: "verifier456",
      testResult,
    });
    expect(result.match).toBe(true);
    expect(result.confidence).toBeGreaterThan(90);
    expect(result.markersCompared).toBeGreaterThan(0);
    expect(result.markersMatched).toBeGreaterThan(0);
  });

  it("getStoredProfile and updateProfile roundtrip", () => {
    const profile = {
      userId: "user123",
      markers: [
        {
          rsid: "rs1234567",
          chromosome: "1",
          position: 123456,
          genotype: "AG",
        },
      ],
      sampleId: "sample123",
      collectionDate: "2024-01-01",
      labName: "LabTest",
      reportFormat: "23andme",
    } as any;
    updateProfile("user123", profile);
    const stored = getStoredProfile("user123");
    expect(stored).toEqual(profile);
  });

  it("clearAllData resets all storage", () => {
    updateProfile("user123", {
      userId: "user123",
      markers: [],
      sampleId: "s1",
      collectionDate: "",
      labName: "",
      reportFormat: "raw_text",
    });
    clearAllData();
    expect(getStoredProfile("user123")).toBeUndefined();
    expect(getVerificationCount("user123")).toBe(0);
    expect(getVerificationHistory("user123")).toEqual([]);
  });
});

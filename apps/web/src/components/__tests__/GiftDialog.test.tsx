import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import GiftDialog, { buildGiftPayload } from "../GiftDialog";
import type { ProfileData } from "../../store/AppContext";

/**
 * Shared mutable doubles — hoisted so the wagmi/AppContext mock factories
 * can reference them (DexSwap.test.tsx pattern).
 */
const state = vi.hoisted(() => ({
  address: "0xAbC0000000000000000000000000000000000001" as string | undefined,
  addMessage: vi.fn().mockResolvedValue(undefined),
  writeCalls: [] as Array<Record<string, unknown>>,
}));

vi.mock("wagmi", () => ({
  useAccount: () => ({
    address: state.address,
    isConnected: !!state.address,
  }),
  usePublicClient: () => ({
    readContract: vi.fn(async () => 10n ** 18n),
    waitForTransactionReceipt: vi.fn(async ({ hash }: { hash: `0x${string}` }) => ({
      status: "success",
      hash,
    })),
  }),
  useReadContract: () => ({
    data: 10n ** 18n,
    isLoading: false,
    isError: false,
    refetch: vi.fn(),
  }),
  useWriteContract: () => ({
    writeContract: vi.fn(),
    writeContractAsync: vi.fn(async (args: Record<string, unknown>) => {
      state.writeCalls.push(args);
      return "0x0000000000000000000000000000000000000000000000000000000000000001";
    }),
    data: undefined,
    isPending: false,
    isError: false,
  }),
  useWaitForTransactionReceipt: () => ({
    isLoading: false,
    isSuccess: false,
    isConfirmed: false,
  }),
}));

vi.mock("../../store/AppContext", async () => {
  const actual =
    await vi.importActual<typeof import("../../store/AppContext")>("../../store/AppContext");
  return {
    ...actual,
    useAppState: () => ({
      myProfile: { id: "me", name: "Hosha Sender" },
      addMessage: state.addMessage,
    }),
  };
});

const RECIPIENT = "0xRec0000000000000000000000000000000000002" as const;

function makeProfile(overrides: Partial<ProfileData> = {}): ProfileData {
  return {
    id: "p1",
    name: "Anya",
    age: 28,
    bio: "",
    interests: [],
    verifiedStd: true,
    verifiedDna: false,
    reputationScore: 7,
    voters: [],
    chatHistory: [],
    accessPermissions: {
      stdRequested: false,
      stdApproved: false,
      dnaRequested: false,
      dnaApproved: false,
      myStdApprovedToThem: false,
      myDnaApprovedToThem: false,
    },
    ethAddress: RECIPIENT,
    ...overrides,
  } as ProfileData;
}

function renderDialog(profile: ProfileData): void {
  render(<GiftDialog profile={profile} onClose={() => {}} />);
}

beforeEach(() => {
  state.address = "0xAbC0000000000000000000000000000000000001";
  state.addMessage.mockClear();
  state.addMessage.mockResolvedValue(undefined);
  state.writeCalls.length = 0;
});

describe("GiftDialog", () => {
  it("renders the three sender-mode radios with public preselected", () => {
    renderDialog(makeProfile());

    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(3);
    expect(screen.getByLabelText("gift.mode.public")).toBeChecked();
    expect(screen.getByLabelText("gift.mode.anonExcept")).not.toBeChecked();
    expect(screen.getByLabelText("gift.mode.anon")).not.toBeChecked();
  });

  it("builds an anon payload with NO sender identity (pure + UI send)", async () => {
    // Pure helper: even when a sender name is supplied, "anon" strips it.
    const key =
      "0x1111111111111111111111111111111111111111111111111111111111111111" as `0x${string}`;
    const anonPayload = buildGiftPayload("anon", "rose", "Hosha Sender", key);
    expect("senderName" in anonPayload).toBe(false);
    expect(anonPayload.voucherPrivateKey).toBe(key);
    const exceptPayload = buildGiftPayload("anon-except-recipient", "rose", "Hosha Sender", key);
    expect(exceptPayload.senderName).toBe("Hosha Sender");

    // UI: selecting anon and sending emits a GIFT message WITHOUT identity.
    renderDialog(makeProfile());
    fireEvent.click(screen.getByLabelText("gift.mode.anon"));
    fireEvent.click(screen.getByRole("button", { name: "gift.send" }));

    await waitFor(() => expect(state.addMessage).toHaveBeenCalledTimes(1));
    const args = state.addMessage.mock.calls[0];
    expect(args[0]).toBe("p1"); // profileId
    expect(args[2]).toBe("me");
    expect(args[3]).toBe(true);
    expect(args[4]).toBe("GIFT");
    expect(args[7]).toBe("rose"); // giftKind
    expect(args[8]).toBe("anon"); // giftMode
    expect(args[9]).toMatch(/^0x[0-9a-fA-F]{64}$/); // fresh voucher key
    // The chat text must not leak the sender's name in anon mode.
    expect(String(args[1])).not.toContain("Hosha Sender");
  });

  it("disables submit in public mode without a recipient eth address, enables in anon mode", () => {
    renderDialog(makeProfile({ ethAddress: undefined }));

    const sendButton = screen.getByRole("button", { name: "gift.send" });
    expect(sendButton).toBeDisabled();
    expect(screen.getByText("gift.noAddress")).toBeInTheDocument();

    // Anonymous modes do not need the recipient's wallet address — the
    // voucher travels over chat.
    fireEvent.click(screen.getByLabelText("gift.mode.anon"));
    expect(screen.getByRole("button", { name: "gift.send" })).toBeEnabled();
  });

  it("toggles the gift kind between rose and cactus and sends the selection", async () => {
    renderDialog(makeProfile());

    const roseButton = screen.getByRole("button", { name: /gift\.kind\.rose/ });
    const cactusButton = screen.getByRole("button", { name: /gift\.kind\.cactus/ });
    expect(roseButton).toHaveAttribute("aria-pressed", "true");
    expect(cactusButton).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(cactusButton);
    expect(cactusButton).toHaveAttribute("aria-pressed", "true");
    expect(roseButton).toHaveAttribute("aria-pressed", "false");

    // Send in anon mode (no allowance/address prerequisites) and confirm the
    // cactus kind rides along the GIFT message.
    fireEvent.click(screen.getByLabelText("gift.mode.anon"));
    fireEvent.click(screen.getByRole("button", { name: "gift.send" }));
    await waitFor(() => expect(state.addMessage).toHaveBeenCalledTimes(1));
    expect(state.addMessage.mock.calls[0][7]).toBe("cactus");

    // The voucher was funded with exactly 1 EVOLVE from the wallet.
    const transfer = state.writeCalls.find((c) => c.functionName === "transfer") as unknown as {
      args: [string, bigint];
    };
    expect(transfer).toBeDefined();
    expect(transfer.args[1]).toBe(10n ** 18n);
  });
});

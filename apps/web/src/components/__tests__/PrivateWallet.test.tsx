import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { PrivateWallet } from "../PrivateWallet";
import * as config from "../../lib/config";
import * as railgun from "../../lib/railgun";

// Mock i18n
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe("PrivateWallet Component", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders nothing when RAILGUN_ENABLED is false", () => {
    vi.spyOn(config, "RAILGUN_ENABLED", "get").mockReturnValue(false);
    const { container } = render(<PrivateWallet />);
    expect(container.firstChild).toBeNull();
  });

  it("renders 3 forms and balance when RAILGUN_ENABLED is true", async () => {
    vi.spyOn(config, "RAILGUN_ENABLED", "get").mockReturnValue(true);
    vi.spyOn(railgun, "getShieldedBalance").mockResolvedValue(100000000000000000000n);

    render(<PrivateWallet />);

    expect(screen.getByText("privacy.wallet.title")).toBeDefined();
    expect(screen.getAllByText("privacy.wallet.shield").length).toBeGreaterThan(0);
    expect(screen.getAllByText("privacy.wallet.unshield").length).toBeGreaterThan(0);
    expect(screen.getAllByText("privacy.wallet.sendPrivate").length).toBeGreaterThan(0);

    await waitFor(() => {
      expect(screen.getByText("100000000000000000000 WEI")).toBeDefined();
    });
  });

  it("shows validation error on invalid input in shield form", async () => {
    vi.spyOn(config, "RAILGUN_ENABLED", "get").mockReturnValue(true);
    vi.spyOn(railgun, "getShieldedBalance").mockResolvedValue(0n);

    render(<PrivateWallet />);

    const shieldButtons = screen.getAllByText("privacy.wallet.shield");
    const submitBtn = shieldButtons[shieldButtons.length - 1]; // submit button inside form

    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("privacy.wallet.error")).toBeDefined();
    });
  });

  it("shows validation error when private transfer recipient address is invalid", async () => {
    vi.spyOn(config, "RAILGUN_ENABLED", "get").mockReturnValue(true);
    vi.spyOn(railgun, "getShieldedBalance").mockResolvedValue(0n);

    render(<PrivateWallet />);

    const inputs = screen.getAllByRole("textbox");
    // send form inputs: amount is index 3, recipient is index 4
    fireEvent.change(inputs[3], { target: { value: "100" } });
    fireEvent.change(inputs[4], { target: { value: "invalid-0zk-address" } });

    const sendButtons = screen.getAllByText("privacy.wallet.sendPrivate");
    const submitBtn = sendButtons[sendButtons.length - 1];

    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("privacy.wallet.error")).toBeDefined();
    });
  });
});

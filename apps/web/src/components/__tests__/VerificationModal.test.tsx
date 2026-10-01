import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import VerificationModal from "../VerificationModal";

describe("VerificationModal", () => {
  it("renders nothing when closed", () => {
    const { container } = render(
      <VerificationModal isOpen={false} onClose={vi.fn()} mode="normal" />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("shows women requirements (STD) and men requirements (STD + DNA + EvolveFund)", () => {
    render(<VerificationModal isOpen={true} onClose={vi.fn()} mode="normal" />);

    expect(screen.getByText("verificationModal.title")).toBeInTheDocument();
    expect(
      screen.getByText("verificationModal.womenRequirements"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("verificationModal.menRequirements"),
    ).toBeInTheDocument();
    // Both genders see STD requirement
    expect(
      screen.getAllByText("verificationModal.requirement.std").length,
    ).toBe(2);
    // Men additionally see DNA + EvolveFund
    expect(
      screen.getByText("verificationModal.requirement.dna"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("verificationModal.requirement.evolveFund"),
    ).toBeInTheDocument();
  });

  it("displays the current search mode label", () => {
    render(
      <VerificationModal
        isOpen={true}
        onClose={vi.fn()}
        mode="pregnancy-bond"
      />,
    );
    expect(
      screen.getByText("home.filters.modePregnancyBond"),
    ).toBeInTheDocument();
  });

  it("calls onClose when close button clicked", () => {
    const onClose = vi.fn();
    render(<VerificationModal isOpen={true} onClose={onClose} mode="normal" />);
    fireEvent.click(
      screen.getByRole("button", { name: "verificationModal.close" }),
    );
    expect(onClose).toHaveBeenCalled();
  });
});

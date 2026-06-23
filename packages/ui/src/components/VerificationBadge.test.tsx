import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { VerificationBadge } from "./VerificationBadge";

describe("VerificationBadge", () => {
  it("should render STD verification badge", () => {
    const { container } = render(<VerificationBadge type="std" />);
    const badge = container.querySelector(".rounded-full");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass(
      "bg-gradient-to-br",
      "from-green-400",
      "to-emerald-600",
    );
  });

  it("should render genetic verification badge", () => {
    const { container } = render(<VerificationBadge type="genetic" />);
    const badge = container.querySelector(".rounded-full");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass(
      "bg-gradient-to-br",
      "from-blue-400",
      "to-purple-600",
    );
  });

  it("should render with md size by default", () => {
    const { container } = render(<VerificationBadge type="std" />);
    const badge = container.querySelector(".rounded-full");
    expect(badge).toHaveClass("w-6", "h-6");
  });

  it("should render with sm size", () => {
    const { container } = render(<VerificationBadge type="std" size="sm" />);
    const badge = container.querySelector(".rounded-full");
    expect(badge).toHaveClass("w-5", "h-5");
  });

  it("should render with lg size", () => {
    const { container } = render(<VerificationBadge type="std" size="lg" />);
    const badge = container.querySelector(".rounded-full");
    expect(badge).toHaveClass("w-8", "h-8");
  });

  it("should not render label when showLabel is false", () => {
    render(<VerificationBadge type="std" showLabel={false} />);
    expect(screen.queryByText("STD Verified")).not.toBeInTheDocument();
  });

  it("should render STD label when showLabel is true", () => {
    render(<VerificationBadge type="std" showLabel={true} />);
    expect(screen.getByText("STD Verified")).toBeInTheDocument();
  });

  it("should render DNA label when showLabel is true for genetic type", () => {
    render(<VerificationBadge type="genetic" showLabel={true} />);
    expect(screen.getByText("DNA Verified")).toBeInTheDocument();
  });

  it("should apply custom className", () => {
    const { container } = render(
      <VerificationBadge type="std" className="custom-class" />,
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("custom-class");
  });

  it("should render shield icon for STD type", () => {
    const { container } = render(<VerificationBadge type="std" />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("should render DNA icon for genetic type", () => {
    const { container } = render(<VerificationBadge type="genetic" />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("should have glow effect for STD type", () => {
    const { container } = render(<VerificationBadge type="std" />);
    const glow = container.querySelector(".animate-pulse");
    expect(glow).toBeInTheDocument();
    expect(glow).toHaveClass("bg-green-400");
  });

  it("should have glow effect for genetic type", () => {
    const { container } = render(<VerificationBadge type="genetic" />);
    const glow = container.querySelector(".animate-pulse");
    expect(glow).toBeInTheDocument();
    expect(glow).toHaveClass("bg-purple-400");
  });

  it("should render STD label with green color", () => {
    render(<VerificationBadge type="std" showLabel={true} />);
    const label = screen.getByText("STD Verified");
    expect(label).toHaveClass("text-green-600");
  });

  it("should render DNA label with purple color", () => {
    render(<VerificationBadge type="genetic" showLabel={true} />);
    const label = screen.getByText("DNA Verified");
    expect(label).toHaveClass("text-purple-600");
  });
});

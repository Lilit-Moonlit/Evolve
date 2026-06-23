import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { GiftButton } from "./GiftButton";

describe("GiftButton", () => {
  it("should render rose gift button", () => {
    render(<GiftButton giftType="rose" onGift={vi.fn()} />);
    expect(screen.getByText("🌹")).toBeInTheDocument();
  });

  it("should render cactus gift button", () => {
    render(<GiftButton giftType="cactus" onGift={vi.fn()} />);
    expect(screen.getByText("🌵")).toBeInTheDocument();
  });

  it("should render with md size by default", () => {
    const { container } = render(
      <GiftButton giftType="rose" onGift={vi.fn()} />,
    );
    const button = container.querySelector("button");
    expect(button).toHaveClass("w-16", "h-16");
  });

  it("should render with sm size", () => {
    const { container } = render(
      <GiftButton giftType="rose" onGift={vi.fn()} size="sm" />,
    );
    const button = container.querySelector("button");
    expect(button).toHaveClass("w-12", "h-12");
  });

  it("should render with lg size", () => {
    const { container } = render(
      <GiftButton giftType="rose" onGift={vi.fn()} size="lg" />,
    );
    const button = container.querySelector("button");
    expect(button).toHaveClass("w-20", "h-20");
  });

  it("should have pink gradient for rose", () => {
    const { container } = render(
      <GiftButton giftType="rose" onGift={vi.fn()} />,
    );
    const button = container.querySelector("button");
    expect(button).toHaveClass("from-pink-500", "to-rose-600");
  });

  it("should have green gradient for cactus", () => {
    const { container } = render(
      <GiftButton giftType="cactus" onGift={vi.fn()} />,
    );
    const button = container.querySelector("button");
    expect(button).toHaveClass("from-green-500", "to-emerald-600");
  });

  it("should be disabled when disabled prop is true", () => {
    const { container } = render(
      <GiftButton giftType="rose" onGift={vi.fn()} disabled />,
    );
    const button = container.querySelector("button");
    expect(button).toBeDisabled();
    expect(button).toHaveClass("opacity-50", "cursor-not-allowed");
  });

  it("should call onGift when clicked", () => {
    vi.useFakeTimers();
    const handleGift = vi.fn();
    render(<GiftButton giftType="rose" onGift={handleGift} />);
    screen.getByText("🌹").click();
    vi.advanceTimersByTime(600);
    expect(handleGift).toHaveBeenCalledWith("rose");
    vi.useRealTimers();
  });

  it("should not call onGift when disabled", () => {
    const handleGift = vi.fn();
    render(<GiftButton giftType="rose" onGift={handleGift} disabled />);
    screen.getByText("🌹").click();
    expect(handleGift).not.toHaveBeenCalled();
  });

  it("should have pink focus ring for rose", () => {
    const { container } = render(
      <GiftButton giftType="rose" onGift={vi.fn()} />,
    );
    const button = container.querySelector("button");
    expect(button).toHaveClass("focus:ring-pink-500");
  });

  it("should have green focus ring for cactus", () => {
    const { container } = render(
      <GiftButton giftType="cactus" onGift={vi.fn()} />,
    );
    const button = container.querySelector("button");
    expect(button).toHaveClass("focus:ring-green-500");
  });

  it("should have rounded-full class", () => {
    const { container } = render(
      <GiftButton giftType="rose" onGift={vi.fn()} />,
    );
    const button = container.querySelector("button");
    expect(button).toHaveClass("rounded-full");
  });

  it("should have gradient background", () => {
    const { container } = render(
      <GiftButton giftType="rose" onGift={vi.fn()} />,
    );
    const button = container.querySelector("button");
    expect(button).toHaveClass("bg-gradient-to-br");
  });
});

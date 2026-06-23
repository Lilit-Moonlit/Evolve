import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Card } from "./Card";

describe("Card", () => {
  it("should render card with children", () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText("Card content")).toBeInTheDocument();
  });

  it("should have default styles", () => {
    const { container } = render(<Card>Card content</Card>);
    const card = container.querySelector("div");
    expect(card).toHaveClass("bg-white", "rounded-lg", "shadow-md", "p-6");
  });

  it("should apply custom className", () => {
    const { container } = render(
      <Card className="custom-class">Card content</Card>,
    );
    const card = container.querySelector("div");
    expect(card).toHaveClass("custom-class");
  });

  it("should not have cursor-pointer when onClick is not provided", () => {
    const { container } = render(<Card>Card content</Card>);
    const card = container.querySelector("div");
    expect(card).not.toHaveClass("cursor-pointer");
  });

  it("should have cursor-pointer when onClick is provided", () => {
    const handleClick = vi.fn();
    const { container } = render(
      <Card onClick={handleClick}>Card content</Card>,
    );
    const card = container.querySelector("div");
    expect(card).toHaveClass(
      "cursor-pointer",
      "hover:shadow-lg",
      "transition-shadow",
    );
  });

  it("should call onClick handler when clicked", () => {
    const handleClick = vi.fn();
    render(<Card onClick={handleClick}>Card content</Card>);
    screen.getByText("Card content").click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

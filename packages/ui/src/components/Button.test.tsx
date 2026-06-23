import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "./Button";

describe("Button", () => {
  it("should render button with text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("should render with primary variant by default", () => {
    const { container } = render(<Button>Click me</Button>);
    const button = container.querySelector("button");
    expect(button).toHaveClass("bg-blue-600");
  });

  it("should render with secondary variant", () => {
    const { container } = render(<Button variant="secondary">Click me</Button>);
    const button = container.querySelector("button");
    expect(button).toHaveClass("bg-gray-600");
  });

  it("should render with outline variant", () => {
    const { container } = render(<Button variant="outline">Click me</Button>);
    const button = container.querySelector("button");
    expect(button).toHaveClass("border-2", "border-blue-600");
  });

  it("should render with ghost variant", () => {
    const { container } = render(<Button variant="ghost">Click me</Button>);
    const button = container.querySelector("button");
    expect(button).toHaveClass("text-gray-600");
  });

  it("should render with md size by default", () => {
    const { container } = render(<Button>Click me</Button>);
    const button = container.querySelector("button");
    expect(button).toHaveClass("px-4", "py-2");
  });

  it("should render with sm size", () => {
    const { container } = render(<Button size="sm">Click me</Button>);
    const button = container.querySelector("button");
    expect(button).toHaveClass("px-3", "py-1.5");
  });

  it("should render with lg size", () => {
    const { container } = render(<Button size="lg">Click me</Button>);
    const button = container.querySelector("button");
    expect(button).toHaveClass("px-6", "py-3");
  });

  it("should be disabled when disabled prop is true", () => {
    const { container } = render(<Button disabled>Click me</Button>);
    const button = container.querySelector("button");
    expect(button).toBeDisabled();
    expect(button).toHaveClass("disabled:opacity-50");
  });

  it("should call onClick handler when clicked", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    screen.getByText("Click me").click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should apply custom className", () => {
    const { container } = render(
      <Button className="custom-class">Click me</Button>,
    );
    const button = container.querySelector("button");
    expect(button).toHaveClass("custom-class");
  });
});

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Input } from "./Input";

describe("Input", () => {
  it("should render input without label", () => {
    const { container } = render(<Input placeholder="Enter text" />);
    const input = container.querySelector("input");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("placeholder", "Enter text");
  });

  it("should render input with label", () => {
    render(<Input label="Username" placeholder="Enter username" />);
    expect(screen.getByText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter username")).toBeInTheDocument();
  });

  it("should have default border color", () => {
    const { container } = render(<Input />);
    const input = container.querySelector("input");
    expect(input).toHaveClass("border-gray-300");
  });

  it("should have red border when error is provided", () => {
    const { container } = render(<Input error="This field is required" />);
    const input = container.querySelector("input");
    expect(input).toHaveClass("border-red-500");
  });

  it("should display error message", () => {
    render(<Input error="This field is required" />);
    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  it("should not display error message when error is not provided", () => {
    const { container } = render(<Input />);
    const errorText = container.querySelector("p");
    expect(errorText).not.toBeInTheDocument();
  });

  it("should apply custom className", () => {
    const { container } = render(<Input className="custom-class" />);
    const input = container.querySelector("input");
    expect(input).toHaveClass("custom-class");
  });

  it("should be disabled when disabled prop is true", () => {
    const { container } = render(<Input disabled />);
    const input = container.querySelector("input");
    expect(input).toBeDisabled();
  });

  it("should have focus ring styles", () => {
    const { container } = render(<Input />);
    const input = container.querySelector("input");
    expect(input).toHaveClass("focus:ring-2", "focus:ring-blue-500");
  });
});

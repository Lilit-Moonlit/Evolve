import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  it("should render checkbox without label", () => {
    const { container } = render(<Checkbox />);
    const checkbox = container.querySelector('input[type="checkbox"]');
    expect(checkbox).toBeInTheDocument();
  });

  it("should render checkbox with label", () => {
    render(<Checkbox label="Accept terms" />);
    expect(screen.getByText("Accept terms")).toBeInTheDocument();
  });

  it("should have default border color", () => {
    const { container } = render(<Checkbox />);
    const checkbox = container.querySelector('input[type="checkbox"]');
    expect(checkbox).toHaveClass("border-gray-300");
  });

  it("should have red border when error is provided", () => {
    const { container } = render(<Checkbox error="This field is required" />);
    const checkbox = container.querySelector('input[type="checkbox"]');
    expect(checkbox).toHaveClass("border-red-500");
  });

  it("should display error message", () => {
    render(<Checkbox label="Accept terms" error="This field is required" />);
    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  it("should not display error message when error is not provided", () => {
    const { container } = render(<Checkbox label="Accept terms" />);
    const errorText = container.querySelector("p");
    expect(errorText).not.toBeInTheDocument();
  });

  it("should apply custom className", () => {
    const { container } = render(<Checkbox className="custom-class" />);
    const checkbox = container.querySelector('input[type="checkbox"]');
    expect(checkbox).toHaveClass("custom-class");
  });

  it("should call onChange handler when value changes", () => {
    const handleChange = vi.fn();
    const { container } = render(<Checkbox onChange={handleChange} />);
    const checkbox = container.querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement;
    if (checkbox) {
      checkbox.click();
    }
    expect(handleChange).toHaveBeenCalled();
  });

  it("should be checked when checked prop is true", () => {
    const { container } = render(<Checkbox checked />);
    const checkbox = container.querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement;
    expect(checkbox).toBeChecked();
  });

  it("should be unchecked when checked prop is false", () => {
    const { container } = render(<Checkbox checked={false} />);
    const checkbox = container.querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement;
    expect(checkbox).not.toBeChecked();
  });

  it("should be disabled when disabled prop is true", () => {
    const { container } = render(<Checkbox disabled />);
    const checkbox = container.querySelector('input[type="checkbox"]');
    expect(checkbox).toBeDisabled();
  });

  it("should have focus ring styles", () => {
    const { container } = render(<Checkbox />);
    const checkbox = container.querySelector('input[type="checkbox"]');
    expect(checkbox).toHaveClass("focus:ring-2", "focus:ring-blue-500");
  });

  it("should have correct size", () => {
    const { container } = render(<Checkbox />);
    const checkbox = container.querySelector('input[type="checkbox"]');
    expect(checkbox).toHaveClass("w-4", "h-4");
  });

  it("should not render label when label is not provided", () => {
    const { container } = render(<Checkbox />);
    const label = container.querySelector("label");
    expect(label).not.toBeInTheDocument();
  });

  it("should render label with correct styles", () => {
    render(<Checkbox label="Accept terms" />);
    const label = screen.getByText("Accept terms");
    expect(label).toHaveClass("font-medium", "text-gray-700");
  });
});

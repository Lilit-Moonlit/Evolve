import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Select } from "./Select";

describe("Select", () => {
  it("should render select without label", () => {
    const options = [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2" },
    ];
    const { container } = render(<Select options={options} />);
    const select = container.querySelector("select");
    expect(select).toBeInTheDocument();
  });

  it("should render select with label", () => {
    const options = [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2" },
    ];
    render(<Select label="Choose an option" options={options} />);
    expect(screen.getByText("Choose an option")).toBeInTheDocument();
  });

  it("should render all options", () => {
    const options = [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2" },
      { value: "option3", label: "Option 3" },
    ];
    render(<Select options={options} />);
    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
    expect(screen.getByText("Option 3")).toBeInTheDocument();
  });

  it("should have default border color", () => {
    const options = [{ value: "option1", label: "Option 1" }];
    const { container } = render(<Select options={options} />);
    const select = container.querySelector("select");
    expect(select).toHaveClass("border-gray-300");
  });

  it("should have red border when error is provided", () => {
    const options = [{ value: "option1", label: "Option 1" }];
    const { container } = render(
      <Select options={options} error="This field is required" />,
    );
    const select = container.querySelector("select");
    expect(select).toHaveClass("border-red-500");
  });

  it("should display error message", () => {
    const options = [{ value: "option1", label: "Option 1" }];
    render(<Select options={options} error="This field is required" />);
    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  it("should not display error message when error is not provided", () => {
    const options = [{ value: "option1", label: "Option 1" }];
    const { container } = render(<Select options={options} />);
    const errorText = container.querySelector("p");
    expect(errorText).not.toBeInTheDocument();
  });

  it("should apply custom className", () => {
    const options = [{ value: "option1", label: "Option 1" }];
    const { container } = render(
      <Select options={options} className="custom-class" />,
    );
    const select = container.querySelector("select");
    expect(select).toHaveClass("custom-class");
  });

  it("should call onChange handler when value changes", () => {
    const handleChange = vi.fn();
    const options = [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2" },
    ];
    const { container } = render(
      <Select options={options} onChange={handleChange} />,
    );
    const select = container.querySelector("select");
    if (select) {
      select.value = "option2";
      select.dispatchEvent(new Event("change", { bubbles: true }));
    }
    expect(handleChange).toHaveBeenCalled();
  });

  it("should be disabled when disabled prop is true", () => {
    const options = [{ value: "option1", label: "Option 1" }];
    const { container } = render(<Select options={options} disabled />);
    const select = container.querySelector("select");
    expect(select).toBeDisabled();
  });

  it("should have focus ring styles", () => {
    const options = [{ value: "option1", label: "Option 1" }];
    const { container } = render(<Select options={options} />);
    const select = container.querySelector("select");
    expect(select).toHaveClass("focus:ring-2", "focus:ring-blue-500");
  });

  it("should render option with correct value", () => {
    const options = [{ value: "option1", label: "Option 1" }];
    const { container } = render(<Select options={options} />);
    const option = container.querySelector("option");
    expect(option).toHaveAttribute("value", "option1");
  });

  it("should not render label when label is not provided", () => {
    const options = [{ value: "option1", label: "Option 1" }];
    const { container } = render(<Select options={options} />);
    const label = container.querySelector("label");
    expect(label).not.toBeInTheDocument();
  });
});

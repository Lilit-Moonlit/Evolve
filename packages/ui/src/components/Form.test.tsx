import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Form, FormField } from "./Form";

describe("Form", () => {
  it("should render form with children", () => {
    const { container } = render(<Form>Form content</Form>);
    const form = container.querySelector("form");
    expect(form).toBeInTheDocument();
    expect(screen.getByText("Form content")).toBeInTheDocument();
  });

  it("should have default styles", () => {
    const { container } = render(<Form>Form content</Form>);
    const form = container.querySelector("form");
    expect(form).toHaveClass("space-y-4");
  });

  it("should apply custom className", () => {
    const { container } = render(
      <Form className="custom-class">Form content</Form>,
    );
    const form = container.querySelector("form");
    expect(form).toHaveClass("custom-class");
  });

  it("should call onSubmit handler when form is submitted", () => {
    const handleSubmit = vi.fn((e) => e.preventDefault());
    const { container } = render(
      <Form onSubmit={handleSubmit}>Form content</Form>,
    );
    const form = container.querySelector("form");
    if (form) {
      form.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true }),
      );
    }
    expect(handleSubmit).toHaveBeenCalled();
  });
});

describe("FormField", () => {
  it("should render form field with children", () => {
    const { container } = render(<FormField>Field content</FormField>);
    expect(screen.getByText("Field content")).toBeInTheDocument();
  });

  it("should render form field with label", () => {
    render(<FormField label="Username">Field content</FormField>);
    expect(screen.getByText("Username")).toBeInTheDocument();
  });

  it("should not render label when label is not provided", () => {
    const { container } = render(<FormField>Field content</FormField>);
    const label = container.querySelector("label");
    expect(label).not.toBeInTheDocument();
  });

  it("should display error message when error is provided", () => {
    render(<FormField error="This field is required">Field content</FormField>);
    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  it("should not display error message when error is not provided", () => {
    const { container } = render(<FormField>Field content</FormField>);
    const errorText = container.querySelector("p");
    expect(errorText).not.toBeInTheDocument();
  });

  it("should have default styles", () => {
    const { container } = render(<FormField>Field content</FormField>);
    const field = container.querySelector("div");
    expect(field).toHaveClass("space-y-1");
  });
});

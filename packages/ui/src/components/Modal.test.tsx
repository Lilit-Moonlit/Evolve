import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Modal } from "./Modal";

describe("Modal", () => {
  it("should not render when isOpen is false", () => {
    const { container } = render(
      <Modal isOpen={false} onClose={vi.fn()}>
        Modal content
      </Modal>,
    );
    expect(container.firstChild).toBeNull();
  });

  it("should render when isOpen is true", () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()}>
        Modal content
      </Modal>,
    );
    expect(screen.getByText("Modal content")).toBeInTheDocument();
  });

  it("should render title when title is provided", () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} title="Modal Title">
        Modal content
      </Modal>,
    );
    expect(screen.getByText("Modal Title")).toBeInTheDocument();
  });

  it("should not render title when title is not provided", () => {
    const { container } = render(
      <Modal isOpen={true} onClose={vi.fn()}>
        Modal content
      </Modal>,
    );
    const title = container.querySelector("h2");
    expect(title).not.toBeInTheDocument();
  });

  it("should render close button when title is provided", () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} title="Modal Title">
        Modal content
      </Modal>,
    );
    const closeButton = screen.getByText("✕");
    expect(closeButton).toBeInTheDocument();
  });

  it("should call onClose when close button is clicked", () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Modal Title">
        Modal content
      </Modal>,
    );
    const closeButton = screen.getByText("✕");
    closeButton.click();
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("should call onClose when backdrop is clicked", () => {
    const handleClose = vi.fn();
    const { container } = render(
      <Modal isOpen={true} onClose={handleClose}>
        Modal content
      </Modal>,
    );
    const backdrop = container.querySelector(".bg-black") as HTMLElement;
    if (backdrop) {
      backdrop.click();
    }
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("should have correct styles", () => {
    const { container } = render(
      <Modal isOpen={true} onClose={vi.fn()}>
        Modal content
      </Modal>,
    );
    const modalContainer = container.querySelector(".fixed");
    expect(modalContainer).toHaveClass(
      "fixed",
      "inset-0",
      "z-50",
      "flex",
      "items-center",
      "justify-center",
    );
  });

  it("should have modal content styles", () => {
    const { container } = render(
      <Modal isOpen={true} onClose={vi.fn()}>
        Modal content
      </Modal>,
    );
    const modalContent = container.querySelector(".relative");
    expect(modalContent).toHaveClass(
      "relative",
      "bg-white",
      "rounded-lg",
      "shadow-lg",
      "max-w-md",
      "w-full",
      "mx-4",
      "p-6",
    );
  });
});

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Header } from "./Header";
import { MemoryRouter } from "react-router-dom";

describe("Header", () => {
  it("should render header with default title", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );
    expect(screen.getByText("Evolve")).toBeInTheDocument();
  });

  it("should render header with custom title", () => {
    render(
      <MemoryRouter>
        <Header title="Custom Title" />
      </MemoryRouter>,
    );
    expect(screen.getByText("Custom Title")).toBeInTheDocument();
  });

  it("should render default emoji when logo is not provided", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );
    expect(screen.getByText("💕")).toBeInTheDocument();
  });

  it("should render logo when logo is provided", () => {
    const { container } = render(
      <MemoryRouter>
        <Header logo="https://example.com/logo.png" />
      </MemoryRouter>,
    );
    const logo = container.querySelector("img");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", "https://example.com/logo.png");
    expect(logo).toHaveAttribute("alt", "Logo");
  });

  it("should not render emoji when logo is provided", () => {
    render(
      <MemoryRouter>
        <Header logo="https://example.com/logo.png" />
      </MemoryRouter>,
    );
    expect(screen.queryByText("💕")).not.toBeInTheDocument();
  });

  it("should have header styles", () => {
    const { container } = render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );
    const header = container.querySelector("header");
    expect(header).toHaveClass("bg-white", "shadow-md");
  });

  it("should have container with flex layout", () => {
    const { container } = render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );
    const containerDiv = container.querySelector(".container");
    expect(containerDiv).toHaveClass(
      "container",
      "mx-auto",
      "px-4",
      "py-4",
      "flex",
      "items-center",
      "justify-between",
    );
  });

  it("should render link to home", () => {
    const { container } = render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );
    const link = container.querySelector("a");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
  });

  it("should have title with correct styles", () => {
    const { container } = render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );
    const title = container.querySelector("h1");
    expect(title).toHaveClass("text-xl", "font-bold", "text-gray-900");
  });

  it("should render all elements together", () => {
    const { container } = render(
      <MemoryRouter>
        <Header title="My App" logo="https://example.com/logo.png" />
      </MemoryRouter>,
    );
    expect(screen.getByText("My App")).toBeInTheDocument();
    const logo = container.querySelector("img");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", "https://example.com/logo.png");
  });
});

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Navigation } from "./Navigation";
import { MemoryRouter } from "react-router-dom";

describe("Navigation", () => {
  it("should render navigation items", () => {
    const items = [
      { label: "Home", path: "/home" },
      { label: "Profile", path: "/profile" },
    ];

    render(
      <MemoryRouter initialEntries={["/home"]}>
        <Navigation items={items} />
      </MemoryRouter>,
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
  });

  it("should render navigation items with icons", () => {
    const items = [
      { label: "Home", path: "/home", icon: "🏠" },
      { label: "Profile", path: "/profile", icon: "👤" },
    ];

    render(
      <MemoryRouter initialEntries={["/home"]}>
        <Navigation items={items} />
      </MemoryRouter>,
    );

    expect(screen.getByText("🏠")).toBeInTheDocument();
    expect(screen.getByText("👤")).toBeInTheDocument();
  });

  it("should highlight active item", () => {
    const items = [
      { label: "Home", path: "/home" },
      { label: "Profile", path: "/profile" },
    ];

    const { container } = render(
      <MemoryRouter initialEntries={["/home"]}>
        <Navigation items={items} />
      </MemoryRouter>,
    );

    const activeLink = container.querySelector('a[href="/home"]');
    expect(activeLink).toHaveClass("bg-blue-600", "text-white");
  });

  it("should not highlight inactive item", () => {
    const items = [
      { label: "Home", path: "/home" },
      { label: "Profile", path: "/profile" },
    ];

    const { container } = render(
      <MemoryRouter initialEntries={["/home"]}>
        <Navigation items={items} />
      </MemoryRouter>,
    );

    const inactiveLink = container.querySelector('a[href="/profile"]');
    expect(inactiveLink).toHaveClass("text-gray-700", "hover:bg-gray-100");
    expect(inactiveLink).not.toHaveClass("bg-blue-600", "text-white");
  });

  it("should have navigation styles", () => {
    const items = [{ label: "Home", path: "/home" }];

    const { container } = render(
      <MemoryRouter initialEntries={["/"]}>
        <Navigation items={items} />
      </MemoryRouter>,
    );

    const nav = container.querySelector("nav");
    expect(nav).toHaveClass("bg-white", "shadow-md");
  });

  it("should have list with flex layout", () => {
    const items = [{ label: "Home", path: "/home" }];

    const { container } = render(
      <MemoryRouter initialEntries={["/"]}>
        <Navigation items={items} />
      </MemoryRouter>,
    );

    const ul = container.querySelector("ul");
    expect(ul).toHaveClass("flex", "space-x-4", "px-4", "py-2");
  });

  it("should render links with correct paths", () => {
    const items = [
      { label: "Home", path: "/home" },
      { label: "Profile", path: "/profile" },
    ];

    const { container } = render(
      <MemoryRouter initialEntries={["/"]}>
        <Navigation items={items} />
      </MemoryRouter>,
    );

    const homeLink = container.querySelector('a[href="/home"]');
    const profileLink = container.querySelector('a[href="/profile"]');
    expect(homeLink).toBeInTheDocument();
    expect(profileLink).toBeInTheDocument();
  });
});

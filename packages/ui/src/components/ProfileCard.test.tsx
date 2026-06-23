import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProfileCard } from "./ProfileCard";

describe("ProfileCard", () => {
  it("should render profile card with name", () => {
    render(<ProfileCard name="John Doe" />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("should render profile card with age", () => {
    render(<ProfileCard name="John Doe" age={25} />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("25")).toBeInTheDocument();
  });

  it("should render profile card with location", () => {
    render(<ProfileCard name="John Doe" location="New York" />);
    expect(screen.getByText("📍 New York")).toBeInTheDocument();
  });

  it("should render profile card with bio", () => {
    render(<ProfileCard name="John Doe" bio="Software developer" />);
    expect(screen.getByText("Software developer")).toBeInTheDocument();
  });

  it("should render profile card with avatar", () => {
    const { container } = render(
      <ProfileCard name="John Doe" avatar="https://example.com/avatar.jpg" />,
    );
    const avatar = container.querySelector("img");
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute("src", "https://example.com/avatar.jpg");
    expect(avatar).toHaveAttribute("alt", "John Doe");
  });

  it("should render profile card without avatar (fallback to initial)", () => {
    render(<ProfileCard name="John Doe" />);
    expect(screen.getByText("J")).toBeInTheDocument();
  });

  it("should render Connect button when onConnect is provided", () => {
    render(<ProfileCard name="John Doe" onConnect={vi.fn()} />);
    expect(screen.getByText("Connect")).toBeInTheDocument();
  });

  it("should render View Profile button when onViewProfile is provided", () => {
    render(<ProfileCard name="John Doe" onViewProfile={vi.fn()} />);
    expect(screen.getByText("View Profile")).toBeInTheDocument();
  });

  it("should call onConnect when Connect button is clicked", () => {
    const handleConnect = vi.fn();
    render(<ProfileCard name="John Doe" onConnect={handleConnect} />);
    screen.getByText("Connect").click();
    expect(handleConnect).toHaveBeenCalledTimes(1);
  });

  it("should call onViewProfile when View Profile button is clicked", () => {
    const handleViewProfile = vi.fn();
    render(<ProfileCard name="John Doe" onViewProfile={handleViewProfile} />);
    screen.getByText("View Profile").click();
    expect(handleViewProfile).toHaveBeenCalledTimes(1);
  });

  it("should not render Connect button when onConnect is not provided", () => {
    render(<ProfileCard name="John Doe" />);
    expect(screen.queryByText("Connect")).not.toBeInTheDocument();
  });

  it("should not render View Profile button when onViewProfile is not provided", () => {
    render(<ProfileCard name="John Doe" />);
    expect(screen.queryByText("View Profile")).not.toBeInTheDocument();
  });

  it("should render all information together", () => {
    render(
      <ProfileCard
        name="John Doe"
        age={25}
        location="New York"
        bio="Software developer"
        avatar="https://example.com/avatar.jpg"
        onConnect={vi.fn()}
        onViewProfile={vi.fn()}
      />,
    );
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("25")).toBeInTheDocument();
    expect(screen.getByText("📍 New York")).toBeInTheDocument();
    expect(screen.getByText("Software developer")).toBeInTheDocument();
    expect(screen.getByText("Connect")).toBeInTheDocument();
    expect(screen.getByText("View Profile")).toBeInTheDocument();
  });
});

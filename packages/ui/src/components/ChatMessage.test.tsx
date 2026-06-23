import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ChatMessage } from "./ChatMessage";

describe("ChatMessage", () => {
  it("should render chat message with text", () => {
    render(<ChatMessage message="Hello" isOwn={false} />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("should render own message with blue background", () => {
    const { container } = render(<ChatMessage message="Hello" isOwn={true} />);
    const messageDiv = container.querySelector(".rounded-lg");
    expect(messageDiv).toHaveClass("bg-blue-600", "text-white");
  });

  it("should render received message with gray background", () => {
    const { container } = render(<ChatMessage message="Hello" isOwn={false} />);
    const messageDiv = container.querySelector(".rounded-lg");
    expect(messageDiv).toHaveClass("bg-gray-100", "text-gray-900");
  });

  it("should render own message aligned to right", () => {
    const { container } = render(<ChatMessage message="Hello" isOwn={true} />);
    const messageContainer = container.firstChild as HTMLElement;
    expect(messageContainer).toHaveClass("justify-end");
  });

  it("should render received message aligned to left", () => {
    const { container } = render(<ChatMessage message="Hello" isOwn={false} />);
    const messageContainer = container.firstChild as HTMLElement;
    expect(messageContainer).toHaveClass("justify-start");
  });

  it("should render timestamp when provided", () => {
    const timestamp = new Date("2024-01-01T12:00:00");
    render(<ChatMessage message="Hello" isOwn={false} timestamp={timestamp} />);
    expect(screen.getByText("12:00")).toBeInTheDocument();
  });

  it("should not render timestamp when not provided", () => {
    const { container } = render(<ChatMessage message="Hello" isOwn={false} />);
    const timeText = container.querySelector(".text-xs");
    expect(timeText).not.toBeInTheDocument();
  });

  it("should render avatar when provided", () => {
    const { container } = render(
      <ChatMessage
        message="Hello"
        isOwn={false}
        avatar="https://example.com/avatar.jpg"
      />,
    );
    const avatar = container.querySelector("img");
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute("src", "https://example.com/avatar.jpg");
  });

  it("should not render avatar when not provided", () => {
    const { container } = render(<ChatMessage message="Hello" isOwn={false} />);
    const avatar = container.querySelector("img");
    expect(avatar).not.toBeInTheDocument();
  });

  it("should render own message with blue timestamp color", () => {
    const timestamp = new Date("2024-01-01T12:00:00");
    const { container } = render(
      <ChatMessage message="Hello" isOwn={true} timestamp={timestamp} />,
    );
    const timeText = container.querySelector(".text-xs");
    expect(timeText).toHaveClass("text-blue-200");
  });

  it("should render received message with gray timestamp color", () => {
    const timestamp = new Date("2024-01-01T12:00:00");
    const { container } = render(
      <ChatMessage message="Hello" isOwn={false} timestamp={timestamp} />,
    );
    const timeText = container.querySelector(".text-xs");
    expect(timeText).toHaveClass("text-gray-500");
  });

  it("should render all information together", () => {
    const timestamp = new Date("2024-01-01T12:00:00");
    render(
      <ChatMessage
        message="Hello"
        isOwn={false}
        timestamp={timestamp}
        avatar="https://example.com/avatar.jpg"
      />,
    );
    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.getByText("12:00")).toBeInTheDocument();
    const avatar = screen.getByAltText("Avatar");
    expect(avatar).toBeInTheDocument();
  });
});

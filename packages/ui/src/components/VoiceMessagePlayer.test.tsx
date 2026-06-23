import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { VoiceMessagePlayer } from "./VoiceMessagePlayer";

describe("VoiceMessagePlayer", () => {
  it("should render voice message player", () => {
    const { container } = render(
      <VoiceMessagePlayer audioUrl="https://example.com/audio.mp3" />,
    );
    const audio = container.querySelector("audio");
    expect(audio).toBeInTheDocument();
  });

  it("should render play button initially", () => {
    render(<VoiceMessagePlayer audioUrl="https://example.com/audio.mp3" />);
    const playButton = screen.getByRole("button");
    expect(playButton).toBeInTheDocument();
  });

  it("should render waveform bars", () => {
    const { container } = render(
      <VoiceMessagePlayer audioUrl="https://example.com/audio.mp3" />,
    );
    const waveformContainer = container.querySelector(".flex-1");
    expect(waveformContainer).toBeInTheDocument();
  });

  it("should render duration display", () => {
    render(
      <VoiceMessagePlayer
        audioUrl="https://example.com/audio.mp3"
        duration={60}
      />,
    );
    expect(screen.getByText("0:00 / 1:00")).toBeInTheDocument();
  });

  it("should have correct audio source", () => {
    const { container } = render(
      <VoiceMessagePlayer audioUrl="https://example.com/audio.mp3" />,
    );
    const audio = container.querySelector("audio");
    expect(audio).toHaveAttribute("src", "https://example.com/audio.mp3");
  });

  it("should apply custom className", () => {
    const { container } = render(
      <VoiceMessagePlayer
        audioUrl="https://example.com/audio.mp3"
        className="custom-class"
      />,
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("custom-class");
  });

  it("should call onPlay when play button is clicked", () => {
    const handlePlay = vi.fn();
    const { container } = render(
      <VoiceMessagePlayer
        audioUrl="https://example.com/audio.mp3"
        onPlay={handlePlay}
      />,
    );
    const playButton = container.querySelector("button");
    if (playButton) {
      playButton.click();
    }
    expect(handlePlay).toHaveBeenCalled();
  });

  it("should call onEnded when audio ends", () => {
    const handleEnded = vi.fn();
    const { container } = render(
      <VoiceMessagePlayer
        audioUrl="https://example.com/audio.mp3"
        onEnded={handleEnded}
      />,
    );
    const audio = container.querySelector("audio");
    if (audio) {
      audio.dispatchEvent(new Event("ended"));
    }
    expect(handleEnded).toHaveBeenCalled();
  });

  it("should have play button with gradient background", () => {
    const { container } = render(
      <VoiceMessagePlayer audioUrl="https://example.com/audio.mp3" />,
    );
    const playButton = container.querySelector("button");
    expect(playButton).toHaveClass(
      "bg-gradient-to-br",
      "from-purple-500",
      "to-pink-500",
    );
  });

  it("should have waveform bars with correct styles", () => {
    const { container } = render(
      <VoiceMessagePlayer audioUrl="https://example.com/audio.mp3" />,
    );
    const waveformContainer = container.querySelector(".flex-1");
    const waveformBars = waveformContainer?.querySelectorAll(".rounded-full");
    if (waveformBars) {
      waveformBars.forEach((bar) => {
        expect(bar).toHaveClass(
          "flex-1",
          "rounded-full",
          "transition-all",
          "duration-150",
        );
      });
    }
  });

  it("should format time correctly", () => {
    render(
      <VoiceMessagePlayer
        audioUrl="https://example.com/audio.mp3"
        duration={125}
      />,
    );
    expect(screen.getByText("0:00 / 2:05")).toBeInTheDocument();
  });

  it("should have flex layout", () => {
    const { container } = render(
      <VoiceMessagePlayer audioUrl="https://example.com/audio.mp3" />,
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("flex", "items-center", "gap-3");
  });
});

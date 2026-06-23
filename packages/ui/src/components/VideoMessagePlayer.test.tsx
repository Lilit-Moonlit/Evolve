import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { VideoMessagePlayer } from "./VideoMessagePlayer";

describe("VideoMessagePlayer", () => {
  it("should render video message player", () => {
    const { container } = render(
      <VideoMessagePlayer videoUrl="https://example.com/video.mp4" />,
    );
    const video = container.querySelector("video");
    expect(video).toBeInTheDocument();
  });

  it("should render play button initially", () => {
    render(<VideoMessagePlayer videoUrl="https://example.com/video.mp4" />);
    const playButton = screen.getByRole("button");
    expect(playButton).toBeInTheDocument();
  });

  it("should render duration display", () => {
    render(
      <VideoMessagePlayer
        videoUrl="https://example.com/video.mp4"
        duration={60}
      />,
    );
    expect(screen.getByText("0:00 / 1:00")).toBeInTheDocument();
  });

  it("should have correct video source", () => {
    const { container } = render(
      <VideoMessagePlayer videoUrl="https://example.com/video.mp4" />,
    );
    const video = container.querySelector("video");
    expect(video).toHaveAttribute("src", "https://example.com/video.mp4");
  });

  it("should have thumbnail when provided", () => {
    const { container } = render(
      <VideoMessagePlayer
        videoUrl="https://example.com/video.mp4"
        thumbnailUrl="https://example.com/thumbnail.jpg"
      />,
    );
    const video = container.querySelector("video");
    expect(video).toHaveAttribute(
      "poster",
      "https://example.com/thumbnail.jpg",
    );
  });

  it("should apply custom className", () => {
    const { container } = render(
      <VideoMessagePlayer
        videoUrl="https://example.com/video.mp4"
        className="custom-class"
      />,
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("custom-class");
  });

  it("should call onPlay when play button is clicked", () => {
    const handlePlay = vi.fn();
    const { container } = render(
      <VideoMessagePlayer
        videoUrl="https://example.com/video.mp4"
        onPlay={handlePlay}
      />,
    );
    const playButton = container.querySelector("button");
    if (playButton) {
      playButton.click();
    }
    expect(handlePlay).toHaveBeenCalled();
  });

  it("should call onEnded when video ends", () => {
    const handleEnded = vi.fn();
    const { container } = render(
      <VideoMessagePlayer
        videoUrl="https://example.com/video.mp4"
        onEnded={handleEnded}
      />,
    );
    const video = container.querySelector("video");
    if (video) {
      video.dispatchEvent(new Event("ended"));
    }
    expect(handleEnded).toHaveBeenCalled();
  });

  it("should have circular container", () => {
    const { container } = render(
      <VideoMessagePlayer videoUrl="https://example.com/video.mp4" />,
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("w-48", "h-48", "rounded-full");
  });

  it("should have progress ring", () => {
    const { container } = render(
      <VideoMessagePlayer videoUrl="https://example.com/video.mp4" />,
    );
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("should format time correctly", () => {
    render(
      <VideoMessagePlayer
        videoUrl="https://example.com/video.mp4"
        duration={125}
      />,
    );
    expect(screen.getByText("0:00 / 2:05")).toBeInTheDocument();
  });

  it("should have shadow", () => {
    const { container } = render(
      <VideoMessagePlayer videoUrl="https://example.com/video.mp4" />,
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("shadow-lg");
  });

  it("should have relative positioning", () => {
    const { container } = render(
      <VideoMessagePlayer videoUrl="https://example.com/video.mp4" />,
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("relative");
  });

  it("should have overflow hidden", () => {
    const { container } = render(
      <VideoMessagePlayer videoUrl="https://example.com/video.mp4" />,
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("overflow-hidden");
  });
});

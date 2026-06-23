import React, { useState, useRef, useEffect } from "react";

export interface VideoMessagePlayerProps {
  videoUrl: string;
  thumbnailUrl?: string;
  duration?: number;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  className?: string;
}

export const VideoMessagePlayer: React.FC<VideoMessagePlayerProps> = ({
  videoUrl,
  thumbnailUrl,
  duration = 0,
  onPlay,
  onPause,
  onEnded,
  className = "",
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => setCurrentTime(video.currentTime);
    const onVideoEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      onEnded?.();
    };

    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("ended", onVideoEnded);
    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("ended", onVideoEnded);
    };
  }, [onEnded]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
      onPause?.();
    } else {
      video.play();
      setIsPlaying(true);
      onPlay?.();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const circumference = 2 * Math.PI * 28;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div
      className={`relative w-48 h-48 rounded-full overflow-hidden shadow-lg ${className}`}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        poster={thumbnailUrl}
        className="w-full h-full object-cover"
        preload="metadata"
      />
      <button
        onClick={togglePlay}
        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-40 transition-all"
      >
        <div className="w-16 h-16 rounded-full bg-white bg-opacity-90 flex items-center justify-center shadow-lg">
          <span className="text-2xl text-gray-800">
            {isPlaying ? "⏸" : "▶"}
          </span>
        </div>
      </button>
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 64 64"
      >
        <circle
          cx="32"
          cy="32"
          r="28"
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="2"
        />
        <circle
          cx="32"
          cy="32"
          r="28"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 32 32)"
          className="transition-all duration-300"
        />
      </svg>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-60 px-2 py-1 rounded-full">
        <span className="text-xs text-white font-medium">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>
    </div>
  );
};

export default VideoMessagePlayer;

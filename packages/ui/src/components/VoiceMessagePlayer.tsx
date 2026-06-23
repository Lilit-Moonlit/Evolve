import React, { useState, useRef, useEffect } from "react";

export interface VoiceMessagePlayerProps {
  audioUrl: string;
  duration?: number;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  className?: string;
}

export const VoiceMessagePlayer: React.FC<VoiceMessagePlayerProps> = ({
  audioUrl,
  duration = 0,
  onPlay,
  onPause,
  onEnded,
  className = "",
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [waveformData] = useState(() =>
    Array.from({ length: 40 }, () => Math.random() * 0.8 + 0.2),
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onAudioEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      onEnded?.();
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onAudioEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onAudioEnded);
    };
  }, [onEnded]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      onPause?.();
    } else {
      audio.play();
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

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      <button
        onClick={togglePlay}
        className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow focus:outline-none focus:ring-2 focus:ring-purple-400"
      >
        <span className="text-white text-base font-bold">
          {isPlaying ? "⏸" : "▶"}
        </span>
      </button>
      <div className="flex-1 flex items-center gap-0.5 h-8">
        {waveformData.map((height, index) => {
          const isActive =
            isPlaying && (index / waveformData.length) * 100 <= progress;
          return (
            <div
              key={index}
              className={`flex-1 rounded-full transition-all duration-150 ${
                isActive ? "bg-purple-500" : "bg-gray-300"
              }`}
              style={{ height: `${height * 100}%` }}
            />
          );
        })}
      </div>
      <span className="text-xs text-gray-500 font-medium">
        {formatTime(currentTime)} / {formatTime(duration)}
      </span>
    </div>
  );
};

export default VoiceMessagePlayer;

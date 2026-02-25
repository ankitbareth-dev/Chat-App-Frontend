import { useState, useRef } from "react";
import { Play, Pause } from "lucide-react";

type AudioPlayerProps = {
  url: string;
  duration?: number | null;
};

const formatTime = (seconds: number) => {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

const AudioPlayer = ({ url, duration }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const [durationTime, setDurationTime] = useState(duration || 0);

  const [waveformHeights] = useState(() =>
    Array.from({ length: 20 }, () => Math.random() * 60 + 20),
  );

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDurationTime(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = clickX / width;
    const newTime = percentage * durationTime;

    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const progressPercentage =
    durationTime > 0 ? (currentTime / durationTime) * 100 : 0;

  return (
    <div className="flex items-center gap-2 w-full max-w-xs">
      {/* Play/Pause Button */}
      <button
        onClick={togglePlayPause}
        className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex-shrink-0"
      >
        {isPlaying ? (
          <Pause className="h-4 w-4 text-white fill-white" />
        ) : (
          <Play className="h-4 w-4 text-white fill-white ml-0.5" />
        )}
      </button>

      {/* Waveform / Progress Bar */}
      <div className="flex-1 flex flex-col gap-1">
        <div
          className="h-6 bg-white/20 rounded-full overflow-hidden cursor-pointer relative group"
          onClick={handleSeek}
        >
          {/* Progress Fill */}
          <div
            className="absolute top-0 left-0 h-full bg-white group-hover:bg-opacity-90 transition-all"
            style={{ width: `${progressPercentage}%` }}
          />

          {/* Fake Waveform Bars (Visual only) */}
          <div className="absolute inset-0 flex items-center justify-around px-2 pointer-events-none opacity-50">
            {waveformHeights.map((height, i) => (
              <div
                key={i}
                className="w-0.5 bg-white rounded-full"
                style={{
                  height: `${height}%`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Time Display */}
        <div className="flex justify-between text-[10px] text-white/70 tabular-nums">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(durationTime)}</span>
        </div>
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        preload="metadata"
      />
    </div>
  );
};

export default AudioPlayer;

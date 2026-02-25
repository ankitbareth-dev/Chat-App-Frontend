import { useRef, useEffect, useState } from "react";
import { Play, Pause, Loader2 } from "lucide-react";
import { audioManager } from "../utils/audioManager";

type AudioPlayerProps = {
  url: string;
  duration?: number | null;
};

const formatTime = (seconds: number) => {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

const AudioPlayer = ({ url, duration }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoadingWaveform, setIsLoadingWaveform] = useState(true);

  const waveformData = useRef<number[]>([]);
  const animationIdRef = useRef<number | null>(null);

  const draw = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    if (
      canvas.width !== rect.width * dpr ||
      canvas.height !== rect.height * dpr
    ) {
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    }

    const width = rect.width;
    const height = rect.height;

    ctx.clearRect(0, 0, width, height);

    const playedColor = getCSSVar("--brand-primary") || "#6366f1";
    const unplayedColor = getCSSVar("--text-muted") || "#94a3b8";
    const progressHeadColor = getCSSVar("--brand-accent") || "#a855f7";

    const progressPercent = durationTime > 0 ? currentTime / durationTime : 0;
    const progressX = width * progressPercent;

    const data = waveformData.current;
    const barCount = data.length;
    const barWidth = 3;
    const gap = 3;
    const totalWaveformWidth = barCount * (barWidth + gap) - gap;
    const startX = (width - totalWaveformWidth) / 2; // Center align

    for (let i = 0; i < barCount; i++) {
      const amplitude = data[i] || 0;

      const h = Math.max(4, amplitude * height * 0.8);

      const x = startX + i * (barWidth + gap);
      const y = (height - h) / 2;

      const barCenterX = x + barWidth / 2;
      const isPlayed = barCenterX < progressX;

      ctx.fillStyle = isPlayed ? playedColor : `${unplayedColor}40`; // 40 = 25% opacity

      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, h, 2);
      ctx.fill();
    }

    if (progressX > 0 && progressX < width) {
      ctx.beginPath();
      ctx.arc(progressX, height / 2, 4, 0, Math.PI * 2);
      ctx.fillStyle = progressHeadColor;
      ctx.fill();

      ctx.shadowColor = progressHeadColor;
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  };

  const [durationTime, setDurationTime] = useState(() => {
    const d = Number(duration);
    return !isNaN(d) && d > 0 ? d : 0;
  });

  const getCSSVar = (name: string) => {
    if (typeof window !== "undefined") {
      return getComputedStyle(document.documentElement)
        .getPropertyValue(name)
        .trim();
    }
    return "";
  };

  useEffect(() => {
    const generateWaveform = async () => {
      if (!url) return;

      try {
        setIsLoadingWaveform(true);

        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();

        const audioContext = new (
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext
        )();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        const rawData = audioBuffer.getChannelData(0);

        const samples = 50;
        const blockSize = Math.floor(rawData.length / samples);
        const filteredData = [];

        for (let i = 0; i < samples; i++) {
          const blockStart = blockSize * i;
          let sum = 0;

          for (let j = 0; j < blockSize; j++) {
            sum += Math.abs(rawData[blockStart + j]);
          }
          filteredData.push(sum / blockSize);
        }

        const max = Math.max(...filteredData);
        const multiplier = max > 0 ? 1 / max : 1;
        const normalizedData = filteredData.map((n) => n * multiplier);

        waveformData.current = normalizedData;

        audioContext.close();
        setIsLoadingWaveform(false);

        draw();
      } catch (error) {
        console.error("Error generating waveform:", error);
        setIsLoadingWaveform(false);

        waveformData.current = Array(50).fill(0.5);
        draw();
      }
    };

    generateWaveform();
  }, [url]);

  useEffect(() => {
    if (isPlaying) {
      animationIdRef.current = requestAnimationFrame(draw);
    } else {
      draw();
    }

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [currentTime, isPlaying, durationTime]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => {
      audioManager.play(audio);
      setIsPlaying(true);
    };

    const handlePause = () => {
      audioManager.stop(audio);
      setIsPlaying(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      if (durationTime === 0) {
        setDurationTime(audio.duration);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [durationTime]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
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

  return (
    <div className="flex items-center gap-3 w-full min-w-[240px] max-w-[360px]">
      {/* Play/Pause Button */}
      <button
        onClick={togglePlayPause}
        disabled={isLoadingWaveform}
        className="p-2.5 rounded-full bg-[var(--brand-primary)] hover:bg-[var(--brand-accent)] transition-colors flex-shrink-0 z-10 shadow-lg shadow-[var(--brand-primary)]/20 disabled:opacity-50"
      >
        {isLoadingWaveform ? (
          <Loader2 className="h-4 w-4 text-white animate-spin" />
        ) : isPlaying ? (
          <Pause className="h-4 w-4 text-white fill-white" />
        ) : (
          <Play className="h-4 w-4 text-white fill-white ml-0.5" />
        )}
      </button>

      {/* Visualizer Container */}
      <div
        className="flex-1 flex flex-col gap-1 cursor-pointer"
        onClick={handleSeek}
      >
        <div className="h-10 bg-[var(--bg-surface)] border border-white/5 rounded-full overflow-hidden relative backdrop-blur-md shadow-inner">
          {/* Canvas Element */}
          <canvas ref={canvasRef} className="w-full h-full" />
        </div>

        {/* Time Display */}
        <div className="flex justify-between text-[10px] text-white/60 tabular-nums px-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(durationTime)}</span>
        </div>
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={url}
        preload="metadata"
        crossOrigin="anonymous"
      />
    </div>
  );
};

export default AudioPlayer;

import { useRef, useEffect, useState } from "react";
import { Play, Pause } from "lucide-react";
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

  // Web Audio API Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationIdRef = useRef<number | null>(null);

  const [durationTime, setDurationTime] = useState(() => {
    const d = Number(duration);
    return !isNaN(d) && d > 0 ? d : 0;
  });

  // Initialize Audio Context & Analyser
  const initAudioContext = () => {
    if (!audioRef.current || audioContextRef.current) return;

    const audioContext = new (
      window.AudioContext ||
      (
        window as unknown as Window & {
          webkitAudioContext: typeof AudioContext;
        }
      ).webkitAudioContext
    )();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 64;

    const source = audioContext.createMediaElementSource(audioRef.current);
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    audioContextRef.current = audioContext;
    analyserRef.current = analyser;
    sourceRef.current = source;
  };

  // Canvas Drawing Loop
  const draw = () => {
    if (!canvasRef.current || !analyserRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Get frequency data
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dimensions
    const width = canvas.width;
    const height = canvas.height;
    const barWidth = (width / bufferLength) * 1.5; // 1.5 for gap
    const gap = 2;
    let x = 0;

    const progressPercent = durationTime > 0 ? currentTime / durationTime : 0;

    for (let i = 0; i < bufferLength; i++) {
      const barHeight = (dataArray[i] / 255) * height;

      const isPlayed = x < width * progressPercent;

      if (isPlayed) {
        ctx.fillStyle = `rgba(255, 255, 255, 0.9)`;
      } else {
        ctx.fillStyle = `rgba(255, 255, 255, 0.3)`;
      }

      ctx.fillRect(x, height - barHeight, barWidth, barHeight);

      x += barWidth + gap;
    }

    animationIdRef.current = requestAnimationFrame(draw);
  };

  // Setup & Cleanup
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => {
      initAudioContext();

      if (audioContextRef.current?.state === "suspended") {
        audioContextRef.current.resume();
      }

      audioManager.play(audio);
      setIsPlaying(true);

      animationIdRef.current = requestAnimationFrame(draw);
    };

    const handlePause = () => {
      audioManager.stop(audio);
      setIsPlaying(false);

      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
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
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
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

      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }

      if (sourceRef.current) {
        sourceRef.current.disconnect();
      }
      if (analyserRef.current) {
        analyserRef.current.disconnect();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
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
    <div className="flex items-center gap-3 w-full min-w-[220px] max-w-[320px]">
      {/* Play/Pause Button */}
      <button
        onClick={togglePlayPause}
        className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex-shrink-0 z-10"
      >
        {isPlaying ? (
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
        <div className="h-8 bg-white/10 rounded-full overflow-hidden relative">
          {/* Canvas Element */}
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            // Set width/height attributes for canvas context scaling
            width={500}
            height={100}
          />
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
        preload="metadata"
        crossOrigin="anonymous" // Required for Web Audio API if audio is CORS
      />
    </div>
  );
};

export default AudioPlayer;

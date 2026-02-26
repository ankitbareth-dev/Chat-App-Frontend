type CircularProgressProps = {
  progress: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
};

const CircularProgress = ({
  progress,
  size = 48,
  strokeWidth = 4,
}: CircularProgressProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Background Circle */}
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className="text-white/20"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress Circle */}
        <circle
          className="transition-all duration-300 ease-out"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor" // Uses text-color which is set below
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      {/* Percentage Text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold text-white">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
};

export default CircularProgress;

import { useEffect, useState } from "react";

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  variant?: "blue" | "green" | "red" | "purple";
}

const ProgressRing = ({
  progress,
  size = 200,
  strokeWidth = 12,
  label,
  sublabel,
  variant = "blue",
}: ProgressRingProps) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (animatedProgress / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 100);
    return () => clearTimeout(timer);
  }, [progress]);

  const colors = {
    blue: { start: "#00f6ff", end: "#0080ff", glow: "0 0 20px #00f6ff" },
    green: { start: "#00ff9c", end: "#00b36b", glow: "0 0 20px #00ff9c" },
    red: { start: "#ff0055", end: "#ff4488", glow: "0 0 20px #ff0055" },
    purple: { start: "#b100ff", end: "#7700b3", glow: "0 0 20px #b100ff" },
  };

  const color = colors[variant];

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          <linearGradient id={`gradient-${variant}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color.start} />
            <stop offset="100%" stopColor={color.end} />
          </linearGradient>
          <filter id={`glow-${variant}`}>
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(230 30% 20%)"
          strokeWidth={strokeWidth}
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#gradient-${variant})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          filter={`url(#glow-${variant})`}
          style={{
            transition: "stroke-dashoffset 1s ease-out",
          }}
        />
      </svg>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span 
          className="font-orbitron text-4xl font-bold"
          style={{ 
            color: color.start,
            textShadow: color.glow,
          }}
        >
          {animatedProgress.toFixed(1)}%
        </span>
        {label && (
          <span className="text-foreground/80 text-sm mt-1 font-medium">{label}</span>
        )}
        {sublabel && (
          <span className="text-muted-foreground text-xs">{sublabel}</span>
        )}
      </div>
    </div>
  );
};

export default ProgressRing;

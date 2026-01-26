import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface NeonSliderProps {
  label?: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  unit?: string;
  showValue?: boolean;
}

const NeonSlider = ({
  label,
  min,
  max,
  step = 1,
  value,
  onChange,
  unit = "",
  showValue = true,
}: NeonSliderProps) => {
  const [displayValue, setDisplayValue] = useState(value);
  
  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  const percentage = ((displayValue - min) / (max - min)) * 100;

  return (
    <div className="space-y-3">
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && (
            <label className="text-sm font-medium text-foreground/80 font-rajdhani tracking-wide">
              {label}
            </label>
          )}
          {showValue && (
            <span className="text-primary font-orbitron text-sm neon-text-blue">
              {displayValue.toLocaleString()}{unit}
            </span>
          )}
        </div>
      )}
      <div className="relative h-3">
        {/* Track background */}
        <div className="absolute inset-0 rounded-full bg-muted" />
        
        {/* Filled track */}
        <div
          className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-primary to-secondary"
          style={{ width: `${percentage}%` }}
        />
        
        {/* Glow effect */}
        <div
          className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-primary to-secondary blur-sm opacity-50"
          style={{ width: `${percentage}%` }}
        />
        
        {/* Input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={displayValue}
          onChange={(e) => {
            const newValue = Number(e.target.value);
            setDisplayValue(newValue);
            onChange(newValue);
          }}
          className={cn(
            "absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          )}
        />
        
        {/* Thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-primary border-2 border-background shadow-[0_0_15px_hsl(186_100%_50%)] pointer-events-none transition-all"
          style={{ left: `calc(${percentage}% - 10px)` }}
        />
      </div>
      
      {/* Min/Max labels */}
      <div className="flex justify-between text-xs text-muted-foreground font-rajdhani">
        <span>{min.toLocaleString()}{unit}</span>
        <span>{max.toLocaleString()}{unit}</span>
      </div>
    </div>
  );
};

export default NeonSlider;

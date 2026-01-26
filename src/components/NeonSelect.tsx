import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface NeonSelectProps {
  label?: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const NeonSelect = ({
  label,
  options,
  value,
  onChange,
  className,
}: NeonSelectProps) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-foreground/80 font-rajdhani tracking-wide">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-full appearance-none rounded-lg px-4 py-3 pr-10 font-rajdhani text-foreground",
            "input-neon bg-transparent cursor-pointer",
            className
          )}
        >
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              className="bg-card text-foreground"
            >
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary pointer-events-none" />
      </div>
    </div>
  );
};

export default NeonSelect;

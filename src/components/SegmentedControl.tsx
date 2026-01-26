import { cn } from "@/lib/utils";

interface SegmentedControlProps {
  label?: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}

const SegmentedControl = ({
  label,
  options,
  value,
  onChange,
}: SegmentedControlProps) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-foreground/80 font-rajdhani tracking-wide">
          {label}
        </label>
      )}
      <div className="flex rounded-lg border-2 border-border overflow-hidden">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "flex-1 px-4 py-3 font-rajdhani font-medium transition-all duration-300",
              value === option.value
                ? "bg-primary text-primary-foreground shadow-[0_0_20px_hsl(186_100%_50%_/_0.3)]"
                : "bg-transparent text-foreground/70 hover:text-foreground hover:bg-muted/30"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SegmentedControl;

import { cn } from "@/lib/utils";

interface NeonToggleProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  activeLabel?: string;
  inactiveLabel?: string;
}

const NeonToggle = ({
  label,
  checked,
  onChange,
  activeLabel = "Yes",
  inactiveLabel = "No",
}: NeonToggleProps) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-foreground/80 font-rajdhani tracking-wide">
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={cn(
          "relative w-full h-12 rounded-lg border-2 transition-all duration-300 font-rajdhani font-medium",
          checked
            ? "border-neon-green bg-neon-green/10 shadow-[0_0_20px_hsl(156_100%_50%_/_0.2)]"
            : "border-border bg-muted/20"
        )}
      >
        <div className="flex items-center justify-between px-4">
          <span className={cn("transition-opacity", !checked && "opacity-100", checked && "opacity-30")}>
            {inactiveLabel}
          </span>
          <div
            className={cn(
              "absolute top-1/2 -translate-y-1/2 w-10 h-8 rounded-md transition-all duration-300",
              checked
                ? "right-2 bg-neon-green shadow-[0_0_15px_hsl(156_100%_50%_/_0.5)]"
                : "left-2 bg-muted-foreground/50"
            )}
          />
          <span className={cn("transition-opacity", checked && "opacity-100", !checked && "opacity-30")}>
            {activeLabel}
          </span>
        </div>
      </button>
    </div>
  );
};

export default NeonToggle;

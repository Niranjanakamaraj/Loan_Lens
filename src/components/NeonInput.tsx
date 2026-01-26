import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface NeonInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
}

const NeonInput = forwardRef<HTMLInputElement, NeonInputProps>(
  ({ className, label, icon, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-foreground/80 font-rajdhani tracking-wide">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full rounded-lg px-4 py-3 font-rajdhani text-foreground",
              "input-neon",
              icon && "pl-10",
              className
            )}
            {...props}
          />
        </div>
      </div>
    );
  }
);

NeonInput.displayName = "NeonInput";

export default NeonInput;

import { cn } from "@/lib/utils";
import { ReactNode, CSSProperties } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "neon-blue" | "neon-purple" | "neon-green" | "neon-red";
  hover?: boolean;
  style?: CSSProperties;
}

const GlassCard = ({ 
  children, 
  className, 
  variant = "default",
  hover = true,
  style
}: GlassCardProps) => {
  const variantStyles = {
    default: "border-border/50",
    "neon-blue": "border-neon-blue/30 shadow-[0_0_20px_hsl(186_100%_50%_/_0.1)]",
    "neon-purple": "border-neon-purple/30 shadow-[0_0_20px_hsl(285_100%_50%_/_0.1)]",
    "neon-green": "border-neon-green/30 shadow-[0_0_20px_hsl(156_100%_50%_/_0.1)]",
    "neon-red": "border-neon-red/30 shadow-[0_0_20px_hsl(345_100%_55%_/_0.1)]",
  };

  const hoverStyles = {
    default: "hover:border-primary/50 hover:shadow-[0_0_30px_hsl(186_100%_50%_/_0.2)]",
    "neon-blue": "hover:border-neon-blue/60 hover:shadow-[0_0_40px_hsl(186_100%_50%_/_0.3)]",
    "neon-purple": "hover:border-neon-purple/60 hover:shadow-[0_0_40px_hsl(285_100%_50%_/_0.3)]",
    "neon-green": "hover:border-neon-green/60 hover:shadow-[0_0_40px_hsl(156_100%_50%_/_0.3)]",
    "neon-red": "hover:border-neon-red/60 hover:shadow-[0_0_40px_hsl(345_100%_55%_/_0.3)]",
  };

  return (
    <div
      className={cn(
        "glass-card rounded-xl border p-6 transition-all duration-300",
        variantStyles[variant],
        hover && hoverStyles[variant],
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
};

export default GlassCard;

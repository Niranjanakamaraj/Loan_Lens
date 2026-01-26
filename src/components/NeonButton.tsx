import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "blue" | "purple" | "green" | "filled";
  size?: "sm" | "md" | "lg";
}

const NeonButton = ({
  children,
  variant = "blue",
  size = "md",
  className,
  ...props
}: NeonButtonProps) => {
  const variants = {
    blue: "btn-neon-blue",
    purple: "btn-neon-purple",
    green: "btn-neon-green",
    filled: "btn-neon-filled",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      className={cn(
        "rounded-lg font-orbitron font-semibold tracking-wider uppercase",
        variants[variant],
        sizes[size],
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default NeonButton;

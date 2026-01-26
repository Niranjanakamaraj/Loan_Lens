import { TrendingUp, TrendingDown } from "lucide-react";
import GlassCard from "../GlassCard";

interface FactorCardProps {
  factor: {
    name: string;
    impact: "strong" | "moderate" | "weak";
    description: string;
    positive: boolean;
  };
}

const FactorCard = ({ factor }: FactorCardProps) => {
  const impactWidths = {
    strong: "w-full",
    moderate: "w-2/3",
    weak: "w-1/3",
  };

  const impactLabels = {
    strong: "Very Strong",
    moderate: "Moderate",
    weak: "Weak",
  };

  return (
    <GlassCard 
      variant={factor.positive ? "neon-green" : "neon-red"} 
      className="group"
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {factor.positive ? (
              <TrendingUp className="w-5 h-5 text-neon-green" />
            ) : (
              <TrendingDown className="w-5 h-5 text-neon-red" />
            )}
            <span className={`font-orbitron text-sm ${factor.positive ? "text-neon-green" : "text-neon-red"}`}>
              {factor.positive ? "✓" : "✗"}
            </span>
          </div>
          <span className="text-xs text-muted-foreground font-rajdhani">
            Impact: {impactLabels[factor.impact]}
          </span>
        </div>

        {/* Factor name */}
        <h4 className="font-orbitron text-lg text-foreground">{factor.name}</h4>

        {/* Impact bar */}
        <div className="space-y-2">
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div 
              className={`h-full rounded-full ${impactWidths[factor.impact]} ${
                factor.positive 
                  ? "bg-gradient-to-r from-neon-green/50 to-neon-green" 
                  : "bg-gradient-to-r from-neon-red/50 to-neon-red"
              } transition-all duration-500 group-hover:opacity-100 opacity-80`}
              style={{
                boxShadow: factor.positive 
                  ? "0 0 10px hsl(156 100% 50% / 0.5)" 
                  : "0 0 10px hsl(345 100% 55% / 0.5)"
              }}
            />
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground font-rajdhani leading-relaxed">
          "{factor.description}"
        </p>
      </div>
    </GlassCard>
  );
};

export default FactorCard;

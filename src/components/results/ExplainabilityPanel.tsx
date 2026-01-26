import { useState } from "react";
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
import GlassCard from "../GlassCard";
import FactorCard from "./FactorCard";

interface Factor {
  name: string;
  impact: "strong" | "moderate" | "weak";
  description: string;
  positive: boolean;
  shapValue: number;
}

interface ExplainabilityPanelProps {
  positiveFactors: Factor[];
  negativeFactors: Factor[];
}

const ExplainabilityPanel = ({ positiveFactors, negativeFactors }: ExplainabilityPanelProps) => {
  const [activeTab, setActiveTab] = useState<"negative" | "positive" | "shap">("negative");

  const allFactors = [...negativeFactors, ...positiveFactors].sort(
    (a, b) => Math.abs(b.shapValue) - Math.abs(a.shapValue)
  );

  return (
    <div className="space-y-6">
      {/* Section header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-orbitron font-bold text-foreground">
          Why This Decision?
        </h2>
        <p className="text-muted-foreground font-rajdhani">
          AI Explainability powered by SHAP (SHapley Additive exPlanations)
        </p>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-2 justify-center flex-wrap">
        <button
          onClick={() => setActiveTab("negative")}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-orbitron text-sm transition-all ${
            activeTab === "negative"
              ? "bg-neon-red/20 border border-neon-red/50 text-neon-red shadow-[0_0_20px_hsl(345_100%_55%_/_0.2)]"
              : "border border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          <TrendingDown className="w-4 h-4" />
          Negative Factors
        </button>
        <button
          onClick={() => setActiveTab("positive")}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-orbitron text-sm transition-all ${
            activeTab === "positive"
              ? "bg-neon-green/20 border border-neon-green/50 text-neon-green shadow-[0_0_20px_hsl(156_100%_50%_/_0.2)]"
              : "border border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Positive Factors
        </button>
        <button
          onClick={() => setActiveTab("shap")}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-orbitron text-sm transition-all ${
            activeTab === "shap"
              ? "bg-neon-purple/20 border border-neon-purple/50 text-neon-purple shadow-[0_0_20px_hsl(285_100%_50%_/_0.2)]"
              : "border border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          SHAP Breakdown
        </button>
      </div>

      {/* Tab content */}
      {activeTab === "negative" && (
        <div className="grid md:grid-cols-2 gap-4 animate-fade-in">
          {negativeFactors.map((factor, index) => (
            <FactorCard key={index} factor={factor} />
          ))}
          {negativeFactors.length === 0 && (
            <GlassCard className="col-span-2 text-center py-8">
              <TrendingUp className="w-12 h-12 text-neon-green mx-auto mb-4" />
              <p className="text-foreground font-rajdhani">No significant negative factors detected!</p>
            </GlassCard>
          )}
        </div>
      )}

      {activeTab === "positive" && (
        <div className="grid md:grid-cols-2 gap-4 animate-fade-in">
          {positiveFactors.map((factor, index) => (
            <FactorCard key={index} factor={factor} />
          ))}
          {positiveFactors.length === 0 && (
            <GlassCard className="col-span-2 text-center py-8">
              <TrendingDown className="w-12 h-12 text-neon-red mx-auto mb-4" />
              <p className="text-foreground font-rajdhani">No significant positive factors detected.</p>
            </GlassCard>
          )}
        </div>
      )}

      {activeTab === "shap" && (
        <div className="animate-fade-in">
          <GlassCard variant="neon-purple">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-orbitron text-lg text-foreground">AI Influence Breakdown</h3>
                <span className="text-xs text-muted-foreground font-rajdhani">
                  Base Risk → Final Decision
                </span>
              </div>

              {/* SHAP Waterfall visualization */}
              <div className="space-y-3">
                {allFactors.map((factor, index) => {
                  const isPositive = factor.shapValue > 0;
                  const width = Math.min(Math.abs(factor.shapValue) * 100, 100);
                  
                  return (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-foreground/80 font-rajdhani">{factor.name}</span>
                        <span className={`font-orbitron text-xs ${isPositive ? "text-neon-green" : "text-neon-red"}`}>
                          {isPositive ? "+" : ""}{(factor.shapValue * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-6 bg-muted/30 rounded-md overflow-hidden relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-1/2" />
                          <div className="w-px h-full bg-foreground/20" />
                          <div className="w-1/2" />
                        </div>
                        <div 
                          className={`absolute top-0 h-full rounded-md transition-all duration-500 ${
                            isPositive 
                              ? "left-1/2 bg-gradient-to-r from-neon-green/30 to-neon-green" 
                              : "right-1/2 bg-gradient-to-l from-neon-red/30 to-neon-red"
                          }`}
                          style={{ 
                            width: `${width / 2}%`,
                            boxShadow: isPositive 
                              ? "0 0 10px hsl(156 100% 50% / 0.3)" 
                              : "0 0 10px hsl(345 100% 55% / 0.3)"
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-6 pt-4 border-t border-border/50">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-neon-green" />
                  <span className="text-sm text-muted-foreground">Increases approval</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-neon-red" />
                  <span className="text-sm text-muted-foreground">Decreases approval</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default ExplainabilityPanel;

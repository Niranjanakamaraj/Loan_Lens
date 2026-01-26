import { Lightbulb, TrendingUp, CreditCard, Home, DollarSign, Calendar, ArrowUp } from "lucide-react";
import GlassCard from "../GlassCard";
import NeonSlider from "../NeonSlider";
import ProgressRing from "../ProgressRing";
import { useState } from "react";

interface GuidanceItem {
  icon: React.ElementType;
  title: string;
  steps: string[];
  color: "blue" | "purple" | "green";
  potentialIncrease: number;
}

interface GuidancePanelProps {
  recommendations: GuidanceItem[];
  currentProbability: number;
}

const GuidancePanel = ({ recommendations, currentProbability }: GuidancePanelProps) => {
  const [simulatedCreditHistory, setSimulatedCreditHistory] = useState(0);
  const [simulatedLoanReduction, setSimulatedLoanReduction] = useState(0);
  
  const simulatedProbability = Math.min(
    100,
    currentProbability + (simulatedCreditHistory * 0.25) + (simulatedLoanReduction * 0.15)
  );

  const colorVariants = {
    blue: {
      bg: "bg-neon-blue/10",
      border: "border-neon-blue/30",
      icon: "text-neon-blue",
      glow: "shadow-[0_0_20px_hsl(186_100%_50%_/_0.2)]",
    },
    purple: {
      bg: "bg-neon-purple/10",
      border: "border-neon-purple/30",
      icon: "text-neon-purple",
      glow: "shadow-[0_0_20px_hsl(285_100%_50%_/_0.2)]",
    },
    green: {
      bg: "bg-neon-green/10",
      border: "border-neon-green/30",
      icon: "text-neon-green",
      glow: "shadow-[0_0_20px_hsl(156_100%_50%_/_0.2)]",
    },
  };

  return (
    <div className="space-y-8">
      {/* Section header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neon-green/30 bg-neon-green/5">
          <Lightbulb className="w-5 h-5 text-neon-green animate-pulse" />
          <span className="text-neon-green font-orbitron text-sm">AI SMART GUIDANCE MODE</span>
        </div>
        <h2 className="text-3xl font-orbitron font-bold text-foreground">
          How to Improve Your Approval
        </h2>
        <p className="text-muted-foreground font-rajdhani">
          Personalized recommendations based on your profile analysis
        </p>
      </div>

      {/* Recommendation cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((item, index) => {
          const colors = colorVariants[item.color];
          const Icon = item.icon;

          return (
            <GlassCard 
              key={index} 
              className={`${colors.glow} hover:scale-[1.02] transition-transform`}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-lg ${colors.bg} border ${colors.border}`}>
                    <Icon className={`w-6 h-6 ${colors.icon}`} />
                  </div>
                  <div className="flex items-center gap-1 text-neon-green">
                    <ArrowUp className="w-4 h-4" />
                    <span className="font-orbitron text-sm">+{item.potentialIncrease}%</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-orbitron text-lg text-foreground">{item.title}</h3>

                {/* Steps */}
                <ul className="space-y-2">
                  {item.steps.map((step, stepIndex) => (
                    <li key={stepIndex} className="flex items-start gap-2 text-muted-foreground font-rajdhani text-sm">
                      <span className="text-primary mt-1">•</span>
                      {step}
                    </li>
                  ))}
                </ul>

                {/* Badge */}
                <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs ${colors.bg} border ${colors.border}`}>
                  <TrendingUp className={`w-3 h-3 ${colors.icon}`} />
                  <span className={colors.icon}>Estimated Approval Increase: +{item.potentialIncrease}%</span>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Simulation panel */}
      <GlassCard variant="neon-purple" className="mt-8">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-neon-purple/20 border border-neon-purple/30">
              <TrendingUp className="w-5 h-5 text-neon-purple" />
            </div>
            <div>
              <h3 className="font-orbitron text-lg text-foreground">What If You Improve?</h3>
              <p className="text-sm text-muted-foreground font-rajdhani">Simulate changes to see how they affect your approval</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Sliders */}
            <div className="space-y-6">
              <NeonSlider
                label="Credit History Improvement"
                min={0}
                max={100}
                value={simulatedCreditHistory}
                onChange={setSimulatedCreditHistory}
                unit="%"
              />
              <NeonSlider
                label="Loan Amount Reduction"
                min={0}
                max={100}
                value={simulatedLoanReduction}
                onChange={setSimulatedLoanReduction}
                unit="%"
              />
            </div>

            {/* Result ring */}
            <div className="flex flex-col items-center gap-4">
              <ProgressRing
                progress={simulatedProbability}
                size={180}
                label="Simulated Probability"
                variant={simulatedProbability >= 70 ? "green" : simulatedProbability >= 50 ? "purple" : "red"}
              />
              {simulatedProbability > currentProbability && (
                <div className="flex items-center gap-2 text-neon-green">
                  <ArrowUp className="w-5 h-5" />
                  <span className="font-orbitron">
                    +{(simulatedProbability - currentProbability).toFixed(1)}% improvement!
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default GuidancePanel;

export const defaultRecommendations: GuidanceItem[] = [
  {
    icon: CreditCard,
    title: "Improve Your Credit History",
    steps: [
      "Pay all EMIs on time",
      "Avoid missing any payments",
      "Reduce credit utilization below 30%",
      "Don't apply for multiple loans simultaneously",
    ],
    color: "purple",
    potentialIncrease: 22,
  },
  {
    icon: DollarSign,
    title: "Reduce Loan Burden",
    steps: [
      "Apply for a smaller loan amount",
      "Increase your down payment",
      "Choose a longer loan tenure",
      "Pay off existing debts first",
    ],
    color: "blue",
    potentialIncrease: 15,
  },
  {
    icon: Home,
    title: "Property Considerations",
    steps: [
      "Consider urban properties (higher approval)",
      "Ensure property documents are clear",
      "Get professional property valuation",
      "Check for any legal encumbrances",
    ],
    color: "green",
    potentialIncrease: 8,
  },
  {
    icon: TrendingUp,
    title: "Increase Income Stability",
    steps: [
      "Maintain steady employment history",
      "Document all income sources",
      "Consider adding a co-applicant",
      "Show consistent savings pattern",
    ],
    color: "blue",
    potentialIncrease: 12,
  },
  {
    icon: Calendar,
    title: "Timing Optimization",
    steps: [
      "Apply during financial year start",
      "Wait for salary increments",
      "Clear pending dues before applying",
      "Build 6+ months of banking history",
    ],
    color: "purple",
    potentialIncrease: 5,
  },
];

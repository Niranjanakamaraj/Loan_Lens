import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import GlassCard from "../GlassCard";
import ProgressRing from "../ProgressRing";

interface DecisionPanelProps {
  approved: boolean;
  probability: number;
  riskLevel: "low" | "medium" | "high";
}

const DecisionPanel = ({ approved, probability, riskLevel }: DecisionPanelProps) => {
  const riskColors = {
    low: { text: "text-neon-green", bg: "bg-neon-green/10", border: "border-neon-green/30" },
    medium: { text: "text-neon-orange", bg: "bg-neon-orange/10", border: "border-neon-orange/30" },
    high: { text: "text-neon-red", bg: "bg-neon-red/10", border: "border-neon-red/30" },
  };

  const risk = riskColors[riskLevel];

  return (
    <GlassCard 
      variant={approved ? "neon-green" : "neon-red"} 
      className="animate-scale-in"
    >
      <div className="space-y-6">
        {/* Status header */}
        <div className="flex items-center justify-between">
          <h3 className="font-orbitron text-xl text-foreground">AI Decision Core</h3>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${approved ? "bg-neon-green/20 border border-neon-green/50" : "bg-neon-red/20 border border-neon-red/50"}`}>
            {approved ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-neon-green" />
                <span className="text-neon-green font-orbitron text-sm">APPROVED</span>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-neon-red" />
                <span className="text-neon-red font-orbitron text-sm">REJECTED</span>
              </>
            )}
          </div>
        </div>

        {/* Progress ring */}
        <div className="flex justify-center py-6">
          <ProgressRing
            progress={probability}
            size={220}
            label="Approval Probability"
            sublabel="AI Risk Engine Analysis Complete"
            variant={approved ? "green" : "red"}
          />
        </div>

        {/* Risk level */}
        <div className={`flex items-center justify-between p-4 rounded-lg ${risk.bg} border ${risk.border}`}>
          <div className="flex items-center gap-2">
            <AlertTriangle className={`w-5 h-5 ${risk.text}`} />
            <span className="font-rajdhani text-foreground/80">Risk Assessment</span>
          </div>
          <span className={`font-orbitron font-semibold ${risk.text}`}>
            {riskLevel.toUpperCase()} RISK
          </span>
        </div>

        {/* Decision summary */}
        <div className="pt-4 border-t border-border/50">
          <p className="text-muted-foreground font-rajdhani text-center">
            {approved 
              ? "Based on your profile analysis, you have a strong likelihood of loan approval. The AI system has identified favorable factors in your application."
              : "Your application shows some risk factors that may affect approval. Review the guidance section below to improve your chances."
            }
          </p>
        </div>
      </div>
    </GlassCard>
  );
};

export default DecisionPanel;

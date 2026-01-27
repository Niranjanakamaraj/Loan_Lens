import { ArrowRight, Brain, Shield, Sparkles } from "lucide-react";
import NeonButton from "../NeonButton";
import GlassCard from "../GlassCard";
import ProgressRing from "../ProgressRing";

interface HeroSectionProps {
  onStartAnalysis: () => void;
  onLearnMore: () => void;
}

const HeroSection = ({ onStartAnalysis, onLearnMore }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen px-6 py-20">
      {/* Cyber grid background */}
      <div className="absolute inset-0 cyber-grid opacity-100" />
      
      {/* Gradient overlays */}
      <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-radial from-neon-blue to-neongreen" />
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-radial from-neon-purple/10 to-transparent blur-3xl" />

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left side - Content */}
          <div className="flex flex-col items-center justify-center min-h-screen space-y-8 px-4 text-center">
  {/* Main heading */}
  {/* Left side - Content */}
<div className="flex flex-col items-center space-y-8 px-4 text-center pt-0">
  {/* Main heading */}
  <h1 className="text-5xl md:text-7xl font-orbitron font-bold leading-tight">
    <span className="text-foreground">LOAN </span>
    <span className="gradient-text">LENS</span>
  </h1>

  {/* CTA Button */}
  <div className="flex justify-center pt-4">
    <NeonButton 
      variant="filled" 
      size="lg"
      onClick={onStartAnalysis}
      className="group"
    >
      Start Loan Analysis
    </NeonButton>
  </div>

  {/* Step-by-step flow */}
  <div className="flex flex-col space-y-5 font-rajdhani text-2xl">
    {/* Top step */}
    <div className="ml-0">
      <span className="text-neon-green font-medium">SEE</span> the decision
    </div>

    {/* Middle step */}
    <div className="ml-0">
      <span className="text-neon-green font-medium">KNOW</span> the reason
    </div>

    {/* Bottom step */}
    <div className="ml-0">
      <span className="text-neon-green font-medium">PLAN</span> your next move
    </div>
  </div>
</div>


</div>

          {/* Right side - Floating card */}
          <div className="relative flex justify-center lg:justify-end">
            <GlassCard 
              variant="neon-blue" 
              className="w-full max-w-md"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-orbitron text-lg text-foreground">Sample Analysis</h3>
                  <div className="px-3 py-1 rounded-full bg-neon-green/20 border border-neon-green/50">
                    <span className="text-neon-green text-sm font-medium">APPROVED</span>
                  </div>
                </div>

                <div className="flex justify-center py-4">
                  <ProgressRing 
                    progress={72} 
                    label="Approval Probability"
                    variant="green"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground">Credit Score</span>
                    <span className="text-neon-green font-medium">Excellent</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground">Income Level</span>
                    <span className="text-neon-blue font-medium">High</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-muted-foreground">Risk Level</span>
                    <span className="text-neon-purple font-medium">Low</span>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Decorative elements */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-neon-purple/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-neon-blue/20 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

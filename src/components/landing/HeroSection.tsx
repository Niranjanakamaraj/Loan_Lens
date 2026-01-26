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
    <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
      {/* Cyber grid background */}
      <div className="absolute inset-0 cyber-grid opacity-50" />
      
      {/* Gradient overlays */}
      <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-radial from-neon-blue/10 to-transparent blur-3xl" />
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-radial from-neon-purple/10 to-transparent blur-3xl" />

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="space-y-8 animate-slide-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-rajdhani text-primary">AI-Powered Credit Analysis</span>
            </div>

            {/* Main heading */}
            <h1 className="text-5xl md:text-7xl font-orbitron font-bold leading-tight">
              <span className="gradient-text">NEON</span>
              <br />
              <span className="text-foreground">CREDIT</span>
              <br />
              <span className="text-primary neon-text-blue">AI</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-foreground/80 font-rajdhani max-w-lg">
              AI-Powered Loan Approval, Explainability & Smart Guidance System
            </p>

            {/* Features list */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-foreground/70">
                <Brain className="w-5 h-5 text-neon-purple" />
                <span className="font-rajdhani">Explainable AI</span>
              </div>
              <div className="flex items-center gap-2 text-foreground/70">
                <Shield className="w-5 h-5 text-neon-green" />
                <span className="font-rajdhani">Transparent Decisions</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <NeonButton 
                variant="filled" 
                size="lg"
                onClick={onStartAnalysis}
                className="group"
              >
                Start Loan Analysis
                <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </NeonButton>
              <NeonButton 
                variant="purple" 
                size="lg"
                onClick={onLearnMore}
              >
                How AI Decides
              </NeonButton>
            </div>
          </div>

          {/* Right side - Floating card */}
          <div className="relative flex justify-center lg:justify-end">
            <GlassCard 
              variant="neon-blue" 
              className="w-full max-w-md float animate-float"
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

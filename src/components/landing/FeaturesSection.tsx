import { Brain, BarChart3, Lightbulb, FileText, Zap, Shield } from "lucide-react";
import GlassCard from "../GlassCard";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Prediction",
    description: "Advanced machine learning model analyzes your profile to predict loan approval probability with high accuracy.",
    variant: "neon-blue" as const,
    color: "text-neon-blue",
  },
  {
    icon: BarChart3,
    title: "SHAP Explainability",
    description: "Understand exactly why the AI made its decision with transparent SHAP-based explanations.",
    variant: "neon-purple" as const,
    color: "text-neon-purple",
  },
  {
    icon: Lightbulb,
    title: "Smart Guidance",
    description: "Receive personalized recommendations to improve your approval chances based on your profile.",
    variant: "neon-green" as const,
    color: "text-neon-green",
  },
  {
    icon: Zap,
    title: "Instant Analysis",
    description: "Get real-time loan approval predictions in seconds, powered by our optimized AI engine.",
    variant: "neon-blue" as const,
    color: "text-neon-blue",
  },
  {
    icon: Shield,
    title: "Transparent Decisions",
    description: "No black-box algorithms. Every decision is fully explained and traceable.",
    variant: "neon-purple" as const,
    color: "text-neon-purple",
  },
  {
    icon: FileText,
    title: "Detailed Reports",
    description: "Download comprehensive PDF reports with AI analysis, explanations, and improvement guides.",
    variant: "neon-green" as const,
    color: "text-neon-green",
  },
];

const FeaturesSection = () => {
  return (
    <section className="relative py-24 px-6">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-purple/5 to-transparent" />
      
      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Section header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-orbitron font-bold">
            <span className="gradient-text">Powered by</span>{" "}
            <span className="text-foreground">Explainable AI</span>
          </h2>
          <p className="text-xl text-muted-foreground font-rajdhani max-w-2xl mx-auto">
            Our cutting-edge AI system provides transparent, interpretable loan decisions you can trust
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <GlassCard 
              key={index}
              variant={feature.variant}
              className="group animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` } as React.CSSProperties}
            >
              <div className="space-y-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br from-${feature.variant.replace('neon-', 'neon-')}/20 to-transparent flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-orbitron font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground font-rajdhani leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

import { Shield, Brain, Sparkles } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative py-16 px-6 border-t border-border/30">
      <div className="absolute inset-0 bg-gradient-to-t from-neon-blue/5 to-transparent" />
      
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-orbitron text-2xl font-bold gradient-text">
              LOAN LENS
            </h3>
            <p className="text-muted-foreground font-rajdhani">
              AI-Powered Loan Approval, Explainability & Smart Guidance System
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h4 className="font-orbitron text-lg text-foreground">Features</h4>
            <ul className="space-y-2 text-muted-foreground font-rajdhani">
              <li className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-neon-purple" />
                AI Prediction Engine
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-neon-blue" />
                SHAP Explainability
              </li>
              <li className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-neon-green" />
                Smart Guidance System
              </li>
            </ul>
          </div>

          {/* Trust badge */}
          <div className="space-y-4">
            <h4 className="font-orbitron text-lg text-foreground">Transparent AI</h4>
            <div className="p-4 rounded-lg border border-neon-green/30 bg-neon-green/5">
              <p className="text-sm text-muted-foreground font-rajdhani">
                This system uses Explainable Artificial Intelligence (SHAP) to provide transparent and interpretable loan decisions.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground font-rajdhani">
            LOAN LENS Predictions are advisory only.
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
            <span className="text-sm text-neon-green font-rajdhani"></span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

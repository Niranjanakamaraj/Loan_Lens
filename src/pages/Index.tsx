import { useState, useRef } from "react";
import ParticleBackground from "@/components/ParticleBackground";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import LoanFormPanel, { LoanFormData } from "@/components/loan-form/LoanFormPanel";
import DecisionPanel from "@/components/results/DecisionPanel";
import ExplainabilityPanel from "@/components/results/ExplainabilityPanel";
import GuidancePanel, { defaultRecommendations } from "@/components/results/GuidancePanel";
import ReportCenter from "@/components/results/ReportCenter";
import Footer from "@/components/Footer";

// Simulated AI prediction function
const simulatePrediction = (data: LoanFormData) => {
  // Base probability calculation
  let probability = 50;

  // Credit history is the biggest factor
  if (data.creditHistory) {
    probability += 25;
  } else {
    probability -= 20;
  }

  // Income factors
  const incomeRatio = (data.applicantIncome + data.coapplicantIncome) / (data.loanAmount / 1000);
  if (incomeRatio > 0.5) probability += 15;
  else if (incomeRatio > 0.3) probability += 8;
  else probability -= 10;

  // Education
  if (data.education === "Graduate") probability += 5;

  // Property area
  if (data.propertyArea === "Urban") probability += 5;
  else if (data.propertyArea === "Semiurban") probability += 3;

  // Loan term (longer is slightly better for monthly payments)
  if (data.loanTerm >= 360) probability += 3;

  // Self-employed slight penalty
  if (data.selfEmployed) probability -= 3;

  // Dependents impact
  const deps = data.dependents === "3+" ? 3 : parseInt(data.dependents);
  probability -= deps * 2;

  // Clamp probability
  probability = Math.max(10, Math.min(95, probability));

  const approved = probability >= 50;

  // Generate factors
  const positiveFactors = [];
  const negativeFactors = [];

  if (data.creditHistory) {
    positiveFactors.push({
      name: "Credit History",
      impact: "strong" as const,
      description: "Good repayment history significantly increases trust.",
      positive: true,
      shapValue: 0.25,
    });
  } else {
    negativeFactors.push({
      name: "Credit History",
      impact: "strong" as const,
      description: "Poor repayment history increases lending risk.",
      positive: false,
      shapValue: -0.28,
    });
  }

  if (incomeRatio > 0.4) {
    positiveFactors.push({
      name: "Income to Loan Ratio",
      impact: "moderate" as const,
      description: "Stable income supports repayment ability.",
      positive: true,
      shapValue: 0.15,
    });
  } else {
    negativeFactors.push({
      name: "Income to Loan Ratio",
      impact: "moderate" as const,
      description: "Loan amount is high relative to income.",
      positive: false,
      shapValue: -0.12,
    });
  }

  if (data.education === "Graduate") {
    positiveFactors.push({
      name: "Education Level",
      impact: "weak" as const,
      description: "Higher education correlates with stable employment.",
      positive: true,
      shapValue: 0.05,
    });
  }

  if (data.propertyArea === "Urban") {
    positiveFactors.push({
      name: "Property Location",
      impact: "weak" as const,
      description: "Urban properties have better resale value.",
      positive: true,
      shapValue: 0.05,
    });
  } else if (data.propertyArea === "Rural") {
    negativeFactors.push({
      name: "Property Location",
      impact: "weak" as const,
      description: "Rural properties may have lower liquidity.",
      positive: false,
      shapValue: -0.04,
    });
  }

  if (data.selfEmployed) {
    negativeFactors.push({
      name: "Employment Type",
      impact: "weak" as const,
      description: "Self-employment may indicate variable income.",
      positive: false,
      shapValue: -0.03,
    });
  }

  const deps2 = data.dependents === "3+" ? 3 : parseInt(data.dependents);
  if (deps2 >= 2) {
    negativeFactors.push({
      name: "Dependents",
      impact: "weak" as const,
      description: "Higher number of dependents increases financial obligations.",
      positive: false,
      shapValue: -0.04,
    });
  }

  const riskLevel = probability >= 70 ? "low" : probability >= 45 ? "medium" : "high";

  return {
    approved,
    probability,
    riskLevel: riskLevel as "low" | "medium" | "high",
    positiveFactors,
    negativeFactors,
  };
};

const Index = () => {
  const [currentView, setCurrentView] = useState<"landing" | "form" | "results">("landing");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ReturnType<typeof simulatePrediction> | null>(null);
  
  const formRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleStartAnalysis = () => {
    setCurrentView("form");
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleLearnMore = () => {
    const featuresSection = document.getElementById("features");
    featuresSection?.scrollIntoView({ behavior: "smooth" });
  };

  const handleFormSubmit = async (data: LoanFormData) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    const prediction = simulatePrediction(data);
    setResults(prediction);
    setIsLoading(false);
    setCurrentView("results");
    
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleNewAnalysis = () => {
    setResults(null);
    setCurrentView("form");
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background relative">
      <ParticleBackground />
      
      {/* Main content */}
      <main className="relative z-10">
        {/* Hero Section - Always visible */}
        <HeroSection 
          onStartAnalysis={handleStartAnalysis}
          onLearnMore={handleLearnMore}
        />

        {/* Features Section */}
        <div id="features">
          <FeaturesSection />
        </div>

        {/* Loan Form Section */}
        {(currentView === "form" || currentView === "results") && (
          <div ref={formRef}>
            <LoanFormPanel 
              onSubmit={handleFormSubmit}
              isLoading={isLoading}
            />
          </div>
        )}

        {/* Results Section */}
        {currentView === "results" && results && (
          <div ref={resultsRef} className="py-16 px-6 space-y-16">
            <div className="container mx-auto max-w-7xl">
              {/* Decision Panel */}
              <div className="grid lg:grid-cols-2 gap-8 mb-16">
                <DecisionPanel 
                  approved={results.approved}
                  probability={results.probability}
                  riskLevel={results.riskLevel}
                />
                
                {/* Quick stats */}
                <div className="space-y-4">
                  <div className="glass-card rounded-xl p-6 border border-primary/20">
                    <h3 className="font-orbitron text-lg text-foreground mb-4">Analysis Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-border/30">
                        <span className="text-muted-foreground">Positive Factors</span>
                        <span className="text-neon-green font-orbitron">{results.positiveFactors.length}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-border/30">
                        <span className="text-muted-foreground">Negative Factors</span>
                        <span className="text-neon-red font-orbitron">{results.negativeFactors.length}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-border/30">
                        <span className="text-muted-foreground">Risk Assessment</span>
                        <span className={`font-orbitron ${
                          results.riskLevel === "low" ? "text-neon-green" :
                          results.riskLevel === "medium" ? "text-neon-orange" : "text-neon-red"
                        }`}>
                          {results.riskLevel.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-muted-foreground">Confidence Level</span>
                        <span className="text-primary font-orbitron">HIGH</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleNewAnalysis}
                    className="w-full py-3 rounded-lg border border-primary/50 text-primary font-orbitron text-sm hover:bg-primary/10 transition-all"
                  >
                    Start New Analysis
                  </button>
                </div>
              </div>

              {/* Explainability Panel */}
              <ExplainabilityPanel 
                positiveFactors={results.positiveFactors}
                negativeFactors={results.negativeFactors}
              />

              {/* Guidance Panel */}
              <div className="mt-16">
                <GuidancePanel 
                  recommendations={defaultRecommendations}
                  currentProbability={results.probability}
                />
              </div>

              {/* Report Center */}
              <div className="mt-16">
                <ReportCenter />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;

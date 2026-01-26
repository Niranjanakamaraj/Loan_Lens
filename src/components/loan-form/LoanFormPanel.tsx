import { useState } from "react";
import { User, Wallet } from "lucide-react";
import GlassCard from "../GlassCard";
import NeonButton from "../NeonButton";
import NeonInput from "../NeonInput";
import NeonSelect from "../NeonSelect";
import NeonToggle from "../NeonToggle";
import NeonSlider from "../NeonSlider";
import SegmentedControl from "../SegmentedControl";

export interface LoanFormData {
  gender: string;
  married: boolean;
  dependents: string;
  education: string;
  selfEmployed: boolean;
  applicantIncome: number;
  coapplicantIncome: number;
  loanAmount: number;
  loanTerm: number;
  creditHistory: boolean;
  propertyArea: string;
}

interface LoanFormPanelProps {
  onSubmit: (data: LoanFormData) => void;
  isLoading?: boolean;
}

const LoanFormPanel = ({ onSubmit, isLoading }: LoanFormPanelProps) => {
  const [activeTab, setActiveTab] = useState<"personal" | "financial">("personal");
  const [formData, setFormData] = useState<LoanFormData>({
    gender: "Male",
    married: false,
    dependents: "0",
    education: "Graduate",
    selfEmployed: false,
    applicantIncome: 5000,
    coapplicantIncome: 0,
    loanAmount: 150000,
    loanTerm: 360,
    creditHistory: true,
    propertyArea: "Urban",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateField = <K extends keyof LoanFormData>(field: K, value: LoanFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section className="relative py-24 px-6">
      <div className="container mx-auto max-w-4xl">
        {/* Section header */}
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl md:text-5xl font-orbitron font-bold">
            <span className="text-foreground">Enter</span>{" "}
            <span className="gradient-text">Applicant Profile</span>
          </h2>
          <p className="text-xl text-muted-foreground font-rajdhani">
            Provide your details for AI-powered loan analysis
          </p>
        </div>

        <GlassCard variant="neon-blue" className="overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-border/50 -mx-6 -mt-6 mb-6">
            <button
              onClick={() => setActiveTab("personal")}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-orbitron text-sm tracking-wider transition-all ${
                activeTab === "personal"
                  ? "tab-neon-active text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <User className="w-5 h-5" />
              PERSONAL PROFILE
            </button>
            <button
              onClick={() => setActiveTab("financial")}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-orbitron text-sm tracking-wider transition-all ${
                activeTab === "financial"
                  ? "tab-neon-active text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Wallet className="w-5 h-5" />
              FINANCIAL PROFILE
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {activeTab === "personal" && (
              <div className="space-y-6 animate-fade-in">
                <div className="grid md:grid-cols-2 gap-6">
                  <NeonSelect
                    label="Gender"
                    options={[
                      { value: "Male", label: "Male" },
                      { value: "Female", label: "Female" },
                    ]}
                    value={formData.gender}
                    onChange={(value) => updateField("gender", value)}
                  />
                  
                  <NeonToggle
                    label="Married"
                    checked={formData.married}
                    onChange={(checked) => updateField("married", checked)}
                  />
                </div>

                <SegmentedControl
                  label="Dependents"
                  options={[
                    { value: "0", label: "0" },
                    { value: "1", label: "1" },
                    { value: "2", label: "2" },
                    { value: "3+", label: "3+" },
                  ]}
                  value={formData.dependents}
                  onChange={(value) => updateField("dependents", value)}
                />

                <div className="grid md:grid-cols-2 gap-6">
                  <NeonSelect
                    label="Education"
                    options={[
                      { value: "Graduate", label: "Graduate" },
                      { value: "Not Graduate", label: "Not Graduate" },
                    ]}
                    value={formData.education}
                    onChange={(value) => updateField("education", value)}
                  />

                  <NeonToggle
                    label="Self Employed"
                    checked={formData.selfEmployed}
                    onChange={(checked) => updateField("selfEmployed", checked)}
                  />
                </div>

                <div className="pt-4">
                  <NeonButton
                    type="button"
                    variant="purple"
                    className="w-full"
                    onClick={() => setActiveTab("financial")}
                  >
                    Continue to Financial Profile
                  </NeonButton>
                </div>
              </div>
            )}

            {activeTab === "financial" && (
              <div className="space-y-6 animate-fade-in">
                <div className="grid md:grid-cols-2 gap-6">
                  <NeonSlider
                    label="Applicant Income"
                    min={0}
                    max={50000}
                    step={500}
                    value={formData.applicantIncome}
                    onChange={(value) => updateField("applicantIncome", value)}
                    unit="$"
                  />

                  <NeonSlider
                    label="Co-applicant Income"
                    min={0}
                    max={30000}
                    step={500}
                    value={formData.coapplicantIncome}
                    onChange={(value) => updateField("coapplicantIncome", value)}
                    unit="$"
                  />
                </div>

                <NeonSlider
                  label="Loan Amount"
                  min={10000}
                  max={700000}
                  step={5000}
                  value={formData.loanAmount}
                  onChange={(value) => updateField("loanAmount", value)}
                  unit="$"
                />

                <NeonSlider
                  label="Loan Term"
                  min={12}
                  max={480}
                  step={12}
                  value={formData.loanTerm}
                  onChange={(value) => updateField("loanTerm", value)}
                  unit=" months"
                />

                <div className="grid md:grid-cols-2 gap-6">
                  <NeonToggle
                    label="Credit History"
                    checked={formData.creditHistory}
                    onChange={(checked) => updateField("creditHistory", checked)}
                    activeLabel="0"
                    inactiveLabel="1"
                  />

                  <NeonSelect
                    label="Property Area"
                    options={[
                      { value: "Urban", label: "Urban" },
                      { value: "Semiurban", label: "Semiurban" },
                      { value: "Rural", label: "Rural" },
                    ]}
                    value={formData.propertyArea}
                    onChange={(value) => updateField("propertyArea", value)}
                  />
                </div>

                <div className="pt-6">
                  <NeonButton
                    type="submit"
                    variant="filled"
                    size="lg"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin" />
                        Analyzing...
                      </span>
                    ) : (
                      " RUN AI CREDIT ANALYSIS"
                    )}
                  </NeonButton>
                </div>
              </div>
            )}
          </form>
        </GlassCard>
      </div>
    </section>
  );
};

export default LoanFormPanel;

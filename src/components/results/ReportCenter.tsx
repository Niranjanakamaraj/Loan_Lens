import { FileText, Download, Image, BookOpen } from "lucide-react";
import GlassCard from "../GlassCard";
import NeonButton from "../NeonButton";

const ReportCenter = () => {
  const reports = [
    {
      icon: FileText,
      title: "AI Analysis Report",
      description: "Complete loan analysis with decision details",
      format: "PDF",
      color: "blue" as const,
    },
    {
      icon: BookOpen,
      title: "Guidance Report",
      description: "Personalized improvement recommendations",
      format: "PDF",
      color: "purple" as const,
    },
    {
      icon: Image,
      title: "SHAP Explanation",
      description: "Visual AI decision breakdown",
      format: "PNG",
      color: "green" as const,
    },
  ];

  const handleDownload = (reportType: string) => {
    // Simulate download - in real app, this would call backend
    console.log(`Downloading ${reportType}...`);
  };

  return (
    <div className="space-y-6">
      {/* Section header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-orbitron font-bold text-foreground">
          Report Center
        </h2>
        <p className="text-muted-foreground font-rajdhani">
          Download comprehensive AI-generated reports
        </p>
      </div>

      {/* Report cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {reports.map((report, index) => {
          const Icon = report.icon;
          
          return (
            <GlassCard 
              key={index} 
              variant={`neon-${report.color}`}
              className="text-center"
            >
              <div className="space-y-4">
                <div className={`w-16 h-16 mx-auto rounded-xl bg-neon-${report.color}/20 border border-neon-${report.color}/30 flex items-center justify-center`}>
                  <Icon className={`w-8 h-8 text-neon-${report.color}`} />
                </div>
                
                <div>
                  <h3 className="font-orbitron text-lg text-foreground">{report.title}</h3>
                  <p className="text-sm text-muted-foreground font-rajdhani mt-1">
                    {report.description}
                  </p>
                </div>

                <div className="text-xs text-muted-foreground">
                  Format: {report.format}
                </div>

                <NeonButton
                  variant={report.color}
                  size="sm"
                  className="w-full"
                  onClick={() => handleDownload(report.title)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </NeonButton>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Disclaimer */}
      <GlassCard className="text-center py-4">
        <p className="text-sm text-muted-foreground font-rajdhani">
          All reports generated using Explainable AI (SHAP) technology
        </p>
      </GlassCard>
    </div>
  );
};

export default ReportCenter;

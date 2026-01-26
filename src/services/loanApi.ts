import { LoanFormData } from "@/components/loan-form/LoanFormPanel";

export interface Factor {
  name: string;
  impact: "strong" | "moderate" | "weak";
  description: string;
  positive: boolean;
  shapValue: number;
}

export interface PredictResponse {
  approved: boolean;
  probability: number;
  riskLevel: "low" | "medium" | "high";
  positiveFactors: Factor[];
  negativeFactors: Factor[];
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const loanApi = {
  /**
   * Check if the backend API is running
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health`);
      return response.ok;
    } catch {
      return false;
    }
  },

  /**
   * Send loan application data to the backend model for prediction
   */
  async predict(formData: LoanFormData): Promise<PredictResponse> {
    const payload = {
      gender: formData.gender,
      married: formData.married,
      dependents: formData.dependents,
      education: formData.education,
      selfEmployed: formData.selfEmployed,
      applicantIncome: formData.applicantIncome,
      coapplicantIncome: formData.coapplicantIncome,
      loanAmount: formData.loanAmount,
      loanTerm: formData.loanTerm,
      creditHistory: formData.creditHistory,
      propertyArea: formData.propertyArea,
    };

    const response = await fetch(`${API_BASE_URL}/api/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  },
};

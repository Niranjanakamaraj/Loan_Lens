# Code Changes Reference

This document details all the code changes made to integrate the XGBoost model with the frontend.

## 1. NEW FILE: `src/services/loanApi.ts`

Created a new API client service that handles all communication with the FastAPI backend.

```typescript
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
  // Health check
  async checkHealth(): Promise<boolean> { ... }

  // Send prediction request to backend
  async predict(formData: LoanFormData): Promise<PredictResponse> { ... }
};
```

**Key Features:**

- Type-safe TypeScript interfaces matching backend Pydantic models
- Reads API URL from environment variable (`VITE_API_URL`)
- Handles errors gracefully
- Returns strongly-typed responses

---

## 2. MODIFIED: `src/pages/Index.tsx`

Updated the main page to use real API calls instead of simulation.

### Import Changes:

```typescript
// Added:
import { useEffect } from "react";
import { toast } from "sonner";
import { loanApi, PredictResponse } from "@/services/loanApi";

// Changed:
const [results, setResults] = useState<PredictResponse | null>(null); // was: ReturnType<typeof simulatePrediction>
```

### State Management:

```typescript
const [apiAvailable, setApiAvailable] = useState<boolean | null>(null);
```

Tracks whether the backend API is running.

### API Health Check on Mount:

```typescript
useEffect(() => {
  const checkApi = async () => {
    const isHealthy = await loanApi.checkHealth();
    setApiAvailable(isHealthy);
    if (!isHealthy) {
      console.warn("Backend API is not available. Using simulation mode.");
    }
  };
  checkApi();
}, []);
```

Automatically checks if backend is running when component loads.

### Updated Form Submission Handler:

```typescript
const handleFormSubmit = async (data: LoanFormData) => {
  setIsLoading(true);

  try {
    let prediction: PredictResponse;

    if (apiAvailable) {
      try {
        // Use real API
        prediction = await loanApi.predict(data);
        toast.success("Analysis complete! Powered by XGBoost model.");
      } catch (error) {
        console.error("API prediction failed:", error);
        toast.error("API error. Falling back to simulation mode.");
        prediction = simulatePrediction(data);
      }
    } else {
      // Use simulation as fallback
      await new Promise((resolve) => setTimeout(resolve, 1500));
      prediction = simulatePrediction(data);
      toast.info("Using simulation mode (Backend not available)");
    }

    setResults(prediction);
    setCurrentView("results");

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  } finally {
    setIsLoading(false);
  }
};
```

**Smart Behavior:**

1. If API available → Use real predictions
2. If API call fails → Fall back to simulation
3. If API unavailable → Use simulation immediately
4. User always sees a toast notification of what happened

---

## 3. NEW FILE: `.env.local`

Local development environment configuration:

```env
VITE_API_URL=http://localhost:8000
```

This tells the frontend where to find the backend API.

---

## 4. NEW FILE: `.env.example`

Template for environment configuration:

```env
# Backend API URL for loan model predictions
# Default: http://localhost:8000 (local development)
VITE_API_URL=http://localhost:8000
```

Users can copy this to create their own `.env.local`.

---

## 5. NEW FILE: `INTEGRATION_GUIDE.md`

Comprehensive documentation including:

- Architecture overview
- Step-by-step setup instructions
- API endpoint reference
- Troubleshooting guide
- Production deployment notes

---

## 6. NEW FILE: `setup.bat`

Windows quick-setup script that:

- Checks Python and Node.js are installed
- Creates virtual environment
- Installs all dependencies
- Shows next steps

---

## 7. NEW FILE: `QUICK_START.md`

Quick reference card with:

- 30-second getting started guide
- Key file reference
- Common tasks
- API quick reference
- Troubleshooting table

---

## 8. NEW FILE: `INTEGRATION_SUMMARY.md`

Overview of the entire integration including:

- Completed tasks
- Architecture diagram
- File changes summary
- How to run guide
- Features overview
- Enhancement ideas

---

## Data Type Compatibility

The frontend types match the backend Pydantic models exactly:

### Backend (Python/Pydantic):

```python
class PredictRequest(BaseModel):
    gender: Literal["Male", "Female"]
    married: bool
    dependents: Literal["0", "1", "2", "3+"]
    # ... more fields

class Factor(BaseModel):
    name: str
    impact: Literal["strong", "moderate", "weak"]
    description: str
    positive: bool
    shapValue: float

class PredictResponse(BaseModel):
    approved: bool
    probability: float  # 0-100
    riskLevel: Literal["low", "medium", "high"]
    positiveFactors: list[Factor]
    negativeFactors: list[Factor]
```

### Frontend (TypeScript):

```typescript
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
```

✅ **Perfect alignment** - No data type mismatches!

---

## Error Handling Flow

```
User submits form
    ↓
apiAvailable is false? → Use simulation + toast
    ↓
apiAvailable is true? → Try API call
    ↓
    ├─ Success → Use predictions + success toast
    └─ Error → Fall back to simulation + error toast
```

This ensures the application **always works**, even if the backend is unavailable.

---

## How to Verify Integration

1. **Check API Service:**

   ```typescript
   // In browser console or test file
   import { loanApi } from "@/services/loanApi";
   const response = await loanApi.checkHealth();
   console.log(response); // true or false
   ```

2. **Check API Response:**

   ```typescript
   const result = await loanApi.predict({
     gender: "Male",
     married: true,
     // ... other fields
   });
   console.log(result); // Should have approved, probability, factors, etc.
   ```

3. **Manual API Test:**
   ```bash
   curl http://localhost:8000/api/health
   curl -X POST http://localhost:8000/api/predict \
     -H "Content-Type: application/json" \
     -d '{"gender":"Male", ...}'
   ```

---

## Performance Considerations

### Frontend

- No heavy computation needed
- All ML inference happens on backend
- Frontend just displays results
- ~200ms network latency expected

### Backend

- XGBoost inference: ~50-100ms
- SHAP calculation: ~500-1000ms (for 10 top features)
- Total per request: ~1-2 seconds

### Optimization Opportunities

1. Cache predictions by input hash
2. Async SHAP calculation (return prediction immediately, factors later)
3. Batch processing for multiple applications
4. Model quantization for faster inference

---

## Security Notes

Current implementation is for development. For production:

1. **Add authentication** - Protect API with API keys or JWT
2. **Add rate limiting** - Prevent abuse
3. **Add input validation** - Strengthen validation rules
4. **Use HTTPS** - Encrypt data in transit
5. **Add CORS restrictions** - Only allow specific origins
6. **Hide API URL** - Don't hardcode in frontend

---

## Version Compatibility

| Component  | Requirement | Status |
| ---------- | ----------- | ------ |
| Python     | 3.8+        | ✅     |
| Node.js    | 16+         | ✅     |
| React      | 18+         | ✅     |
| TypeScript | 5+          | ✅     |
| FastAPI    | Latest      | ✅     |
| XGBoost    | Latest      | ✅     |

---

This integration provides a solid foundation for the AI-powered loan approval system!

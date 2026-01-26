# Quick Reference Card

## 🚀 Getting Started (30 seconds)

1. **Run the setup script** (first time only):

   ```bash
   setup.bat
   ```

2. **Terminal 1 - Backend**:

   ```bash
   .venv\Scripts\activate
   python Model\api_server.py
   ```

3. **Terminal 2 - Frontend**:

   ```bash
   npm run dev
   ```

4. **Open browser**: `http://localhost:5173`

---

## 📌 Key Files & What They Do

| File                      | Purpose                                                 |
| ------------------------- | ------------------------------------------------------- |
| `src/services/loanApi.ts` | API client that talks to FastAPI backend                |
| `src/pages/Index.tsx`     | Main page - integrates form with real model predictions |
| `Model/api_server.py`     | FastAPI backend serving XGBoost model                   |
| `Model/requirements.txt`  | Python dependencies for backend                         |
| `.env.local`              | Environment config (backend URL)                        |
| `INTEGRATION_GUIDE.md`    | Full integration documentation                          |

---

## 🔌 API Quick Reference

**Health Check:**

```bash
curl http://localhost:8000/api/health
```

**Make a Prediction:**

```bash
curl -X POST http://localhost:8000/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "gender": "Male",
    "married": true,
    "dependents": "1",
    "education": "Graduate",
    "selfEmployed": false,
    "applicantIncome": 5000,
    "coapplicantIncome": 1500,
    "loanAmount": 150000,
    "loanTerm": 360,
    "creditHistory": true,
    "propertyArea": "Urban"
  }'
```

**View API Docs**: http://localhost:8000/docs

---

## 🛠️ Common Tasks

### Restart Backend (if code changes)

```bash
# Stop current process (Ctrl+C)
python Model\api_server.py
```

### Frontend Auto-Reloads

Code changes in `src/` automatically refresh browser - no restart needed!

### Check API is Running

```bash
# In browser or terminal
http://localhost:8000/api/health
```

### Switch Backend URL

Edit `.env.local`:

```
VITE_API_URL=http://your-backend-url:8000
```

---

## 📊 Data Flow Diagram

```
User Form Input
      ↓
handleFormSubmit()
      ↓
loanApi.predict(data)
      ↓
POST /api/predict (FastAPI)
      ↓
XGBoost Model Inference
      ↓
SHAP Explainability Calculation
      ↓
PredictResponse (JSON)
      ↓
DecisionPanel + ExplainabilityPanel
      ↓
Beautiful UI Display ✨
```

---

## ⚠️ Troubleshooting

| Problem                                          | Solution                                                  |
| ------------------------------------------------ | --------------------------------------------------------- |
| `Cannot connect to API`                          | Make sure backend is running on port 8000                 |
| `ModuleNotFoundError: No module named 'fastapi'` | Run `pip install -r Model/requirements.txt`               |
| `CORS error`                                     | CORS is enabled in api_server.py - should work by default |
| `Model file not found`                           | Ensure `Model/loan_approval_model_tuned.pkl` exists       |
| `Frontend doesn't load`                          | Run `npm install` first, then `npm run dev`               |

---

## 🎯 How Predictions Work

1. **Input**: 11 loan application fields
2. **Processing**: Feature engineering (EMI ratio, total income)
3. **Model**: XGBoost classifier (trained on historical loan data)
4. **Output**:
   - ✅ Approved/Rejected decision
   - 📊 Approval probability (0-100%)
   - ⚠️ Risk level (low/medium/high)
   - 📈 Top positive factors (with SHAP values)
   - 📉 Top negative factors (with SHAP values)

---

## 📝 Environment Variables

Located in `.env.local`:

```bash
# Backend API URL (default: localhost:8000)
VITE_API_URL=http://localhost:8000
```

For production, change to your deployed backend URL.

---

## 🧪 Test the Integration

Copy and paste this test data into the form:

| Field               | Value      |
| ------------------- | ---------- |
| Gender              | Male       |
| Married             | ✓ Yes      |
| Dependents          | 1          |
| Education           | Graduate   |
| Self Employed       | ✗ No       |
| Applicant Income    | 5000       |
| Co-applicant Income | 1500       |
| Loan Amount         | 150000     |
| Loan Term           | 360 months |
| Credit History      | ✓ Good     |
| Property Area       | Urban      |

Expected: High approval probability (XGBoost + good credit history = approved)

---

## 📚 Learn More

- **INTEGRATION_GUIDE.md** - Full documentation
- **INTEGRATION_SUMMARY.md** - What was changed
- **Model/api_server.py** - API implementation
- **src/services/loanApi.ts** - Frontend API client
- **src/pages/Index.tsx** - Integration logic

---

## 💡 Pro Tips

1. **Keep both terminals open** while developing
2. **Use FastAPI docs** (http://localhost:8000/docs) to test API
3. **Browser DevTools** → Network tab shows API calls
4. **Sonner toast notifications** show API status at top-right
5. **Fallback mode** works even if backend is down - good for demos!

---

**Everything is ready to go!** 🎉 Start the backend and frontend, then test with some loan applications.

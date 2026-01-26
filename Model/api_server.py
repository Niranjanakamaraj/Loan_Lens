"""
FastAPI server to expose the trained loan approval model to the frontend.

Run (from repo root):
  python -m venv .venv
  .venv\Scripts\pip install -r Model\requirements.txt
  .venv\Scripts\python Model\api_server.py

Then start the frontend:
  npm run dev
"""

from __future__ import annotations

from pathlib import Path
from typing import Literal

import joblib
import numpy as np
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

try:
    import shap  # type: ignore
except Exception:  # pragma: no cover
    shap = None


HERE = Path(__file__).resolve().parent
MODEL_PATH = HERE / "loan_approval_model_tuned.pkl"


class PredictRequest(BaseModel):
    gender: Literal["Male", "Female"] = "Male"
    married: bool = False
    dependents: Literal["0", "1", "2", "3+"] = "0"
    education: Literal["Graduate", "Not Graduate"] = "Graduate"
    selfEmployed: bool = False
    applicantIncome: float = Field(ge=0)
    coapplicantIncome: float = Field(ge=0)
    loanAmount: float = Field(ge=0, description="Loan amount in dollars")
    loanTerm: int = Field(ge=1, description="Loan term in months")
    creditHistory: bool = True
    propertyArea: Literal["Urban", "Semiurban", "Rural"] = "Urban"


class Factor(BaseModel):
    name: str
    impact: Literal["strong", "moderate", "weak"]
    description: str
    positive: bool
    shapValue: float


class PredictResponse(BaseModel):
    approved: bool
    probability: float  # percent 0..100
    riskLevel: Literal["low", "medium", "high"]
    positiveFactors: list[Factor]
    negativeFactors: list[Factor]


def _impact_from_abs_shap(abs_val: float) -> Literal["strong", "moderate", "weak"]:
    if abs_val >= 0.2:
        return "strong"
    if abs_val >= 0.08:
        return "moderate"
    return "weak"


_DESCRIPTION_MAP: dict[str, str] = {
    "credit_history": "Credit history is a major driver of repayment risk.",
    "loanamount": "Higher loan amounts increase repayment burden.",
    "loan_amount_term": "Loan term affects monthly repayment pressure.",
    "applicantincome": "Higher income improves repayment capacity.",
    "coapplicantincome": "Co-applicant income can strengthen repayment ability.",
    "total_income": "Total income improves capacity to repay.",
    "emi_ratio": "Lower EMI-to-income ratio reduces repayment strain.",
    "property_area": "Property area correlates with collateral value and liquidity.",
    "self_employed": "Self employment can indicate variable income stability.",
    "dependents": "More dependents can increase financial obligations.",
    "education": "Education may correlate with employment stability.",
    "married": "Marital status can correlate with household stability.",
    "gender": "Gender is a demographic feature in the dataset.",
}


def _factor_description(feature_name: str) -> str:
    key = feature_name.lower().replace(" ", "_")
    for k, v in _DESCRIPTION_MAP.items():
        if k in key:
            return v
    return "This feature influenced the model decision."


def _prettify_feature_name(raw: str) -> str:
    raw2 = raw.replace("_", " ").strip()
    return " ".join(w.capitalize() for w in raw2.split())


def _build_model_input(req: PredictRequest) -> pd.DataFrame:
    # The training script expects:
    # Gender, Married(Yes/No), Dependents, Education, Self_Employed(Yes/No),
    # ApplicantIncome, CoapplicantIncome, LoanAmount(in thousands), Loan_Amount_Term,
    # Credit_History(0/1), Property_Area
    loan_amount_thousands = float(req.loanAmount) / 1000.0
    df = pd.DataFrame(
        [
            {
                "Gender": req.gender,
                "Married": "Yes" if req.married else "No",
                "Dependents": req.dependents,
                "Education": req.education,
                "Self_Employed": "Yes" if req.selfEmployed else "No",
                "ApplicantIncome": float(req.applicantIncome),
                "CoapplicantIncome": float(req.coapplicantIncome),
                "LoanAmount": loan_amount_thousands,
                "Loan_Amount_Term": int(req.loanTerm),
                "Credit_History": 1.0 if req.creditHistory else 0.0,
                "Property_Area": req.propertyArea,
            }
        ]
    )

    # Same feature engineering as the training/inference script
    df["Total_Income"] = df["ApplicantIncome"] + df["CoapplicantIncome"]
    df["EMI_Ratio"] = df["LoanAmount"] / (df["Total_Income"] + 1)
    return df


def _predict_and_explain(model, user_df: pd.DataFrame) -> tuple[float, list[Factor], list[Factor]]:
    proba = float(model.predict_proba(user_df)[0][1])  # probability of approval class

    positive: list[Factor] = []
    negative: list[Factor] = []

    if shap is None:
        # If SHAP isn't installed, return empty factors (frontend can still render).
        return proba, positive, negative

    preprocessor = model.named_steps["preprocessor"]
    xgb_model = model.named_steps["model"]
    explainer = shap.TreeExplainer(xgb_model)

    encoded_feature_names = preprocessor.get_feature_names_out()
    feature_names_simple = [name.split("__")[-1] for name in encoded_feature_names]

    X_user_transformed = preprocessor.transform(user_df)
    shap_values_user = explainer.shap_values(X_user_transformed)

    # shap can return list/array depending on version / model type
    if isinstance(shap_values_user, list):
        shap_vec = np.asarray(shap_values_user[0]).reshape(-1)
    else:
        arr = np.asarray(shap_values_user)
        shap_vec = arr.reshape(-1) if arr.ndim == 1 else arr[0].reshape(-1)

    pairs = list(zip(feature_names_simple, shap_vec, strict=False))
    pairs.sort(key=lambda t: abs(float(t[1])), reverse=True)

    # Take top contributors to keep response lightweight
    top_pairs = pairs[:10]
    for name, val in top_pairs:
        val_f = float(val)
        factor = Factor(
            name=_prettify_feature_name(name),
            impact=_impact_from_abs_shap(abs(val_f)),
            description=_factor_description(name),
            positive=val_f > 0,
            shapValue=val_f,
        )
        (positive if val_f > 0 else negative).append(factor)

    return proba, positive, negative


app = FastAPI(title="Neon Credit Model API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health():
    return {"ok": True}


@app.post("/api/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    model = joblib.load(MODEL_PATH)
    user_df = _build_model_input(req)
    proba, positive, negative = _predict_and_explain(model, user_df)

    threshold = 0.6
    approved = proba >= threshold
    probability_pct = round(proba * 100.0, 1)
    risk_level: Literal["low", "medium", "high"] = (
        "low" if proba >= 0.7 else "medium" if proba >= 0.45 else "high"
    )

    return PredictResponse(
        approved=approved,
        probability=probability_pct,
        riskLevel=risk_level,
        positiveFactors=positive,
        negativeFactors=negative,
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000)

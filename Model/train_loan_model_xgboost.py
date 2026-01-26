# ==============================================================
# Loan Approval Prediction + SHAP Explainability (Full Report)
# Works with: loan_approval_model_tuned.pkl (your trained pipeline)
# ==============================================================

import pandas as pd
import numpy as np
import joblib
import shap
import matplotlib.pyplot as plt
import datetime


# ---------------------------
# 1. Load Trained Model
# ---------------------------
model = joblib.load("loan_approval_model_tuned.pkl")

preprocessor = model.named_steps["preprocessor"]
xgb_model = model.named_steps["model"]

# Initialize SHAP explainer
explainer = shap.TreeExplainer(xgb_model)

# Get feature names after encoding
encoded_feature_names = preprocessor.get_feature_names_out()
feature_names_simple = [name.split("__")[-1] for name in encoded_feature_names]

# ---------------------------
# 2. Take USER INPUT
# ---------------------------
print("\n--- ENTER LOAN APPLICANT DETAILS ---")

gender = input("Enter Gender (Male/Female): ")
married = input("Married? (Yes/No): ")
dependents = input("Number of Dependents (0 / 1 / 2 / 3+): ")
education = input("Education (Graduate / Not Graduate): ")
self_employed = input("Self Employed? (Yes/No): ")

app_income = float(input("Applicant Income: "))
coapp_income = float(input("Coapplicant Income: "))
loan_amount = float(input("Loan Amount (in thousands, e.g. 150): "))
loan_term = int(input("Loan Term (in months, e.g. 360): "))
credit_history = float(input("Credit History (1 = Good, 0 = Bad): "))
property_area = input("Property Area (Urban / Semiurban / Rural): ")

# ---------------------------
# 3. Build Input DataFrame + Feature Engineering
# ---------------------------

user_df = pd.DataFrame([{
    "Gender": gender,
    "Married": married,
    "Dependents": dependents,
    "Education": education,
    "Self_Employed": self_employed,
    "ApplicantIncome": app_income,
    "CoapplicantIncome": coapp_income,
    "LoanAmount": loan_amount,
    "Loan_Amount_Term": loan_term,
    "Credit_History": credit_history,
    "Property_Area": property_area
}])

# Feature engineering (same as training)
user_df["Total_Income"] = user_df["ApplicantIncome"] + user_df["CoapplicantIncome"]
user_df["EMI_Ratio"] = user_df["LoanAmount"] / (user_df["Total_Income"] + 1)

# ---------------------------
# 4. Prediction
# ---------------------------

probability = model.predict_proba(user_df)[0][1]
prediction = model.predict(user_df)[0]

threshold = 0.6  # bank-like threshold

decision = "ACCEPTED" if probability >= threshold else "REJECTED"

# ---------------------------
# 5. SHAP Explanation
# ---------------------------

# Transform input for SHAP
X_user_transformed = preprocessor.transform(user_df)

# Compute SHAP values
shap_values_user = explainer.shap_values(X_user_transformed)[0]

contributions = pd.DataFrame({
    "Feature": feature_names_simple,
    "SHAP_Value": shap_values_user
})

contributions["Abs_SHAP"] = np.abs(contributions["SHAP_Value"])
contributions = contributions.sort_values("Abs_SHAP", ascending=False)

negative = contributions[contributions["SHAP_Value"] < -0.01].head(5)
positive = contributions[contributions["SHAP_Value"] > 0.01].head(5)

# ---------------------------
# 6. BUILD REPORT TEXT (SAVE + PRINT)
# ---------------------------

now = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
filename = f"Loan_Application_Report_{now}.txt"

report = ""
report += "=" * 80 + "\n"
report += "                      LOAN APPLICATION ANALYSIS REPORT\n"
report += "=" * 80 + "\n\n"

report += "APPLICATION ID: Loan Application #1\n"
report += f"DECISION: {decision}\n"
report += f"APPROVAL PROBABILITY: {probability*100:.1f}%\n\n"

report += "=" * 80 + "\n"
report += "                         SUMMARY OF DECISION\n"
report += "=" * 80 + "\n\n"

if decision == "REJECTED":
    report += "This loan application was rejected based on an analysis of the\n"
    report += "applicant's financial profile and credit history.\n"
else:
    report += "This loan application was approved based on a strong financial\n"
    report += "profile and acceptable credit risk indicators.\n"

report += "The model evaluated multiple factors including income, loan amount,\n"
report += "credit history, and property details to determine the likelihood of\n"
report += "successful loan repayment.\n\n"

report += "=" * 80 + "\n"
report += "                  FACTORS THAT LED TO DECISION\n"
report += "=" * 80 + "\n\n"

report += "NEGATIVE IMPACT FACTORS:\n"
for i, row in enumerate(negative.itertuples(), 1):
    report += f"  {i}. {row.Feature}\n"
    report += "     Impact: High\n"
    report += f"     SHAP Contribution: {row.SHAP_Value:.4f}\n\n"

report += "=" * 80 + "\n"
report += "              POSITIVE FACTORS (Supporting Approval)\n"
report += "=" * 80 + "\n\n"

for i, row in enumerate(positive.itertuples(), 1):
    report += f"  {i}. {row.Feature}\n"
    report += "     Impact: Moderate\n"
    report += f"     SHAP Contribution: +{row.SHAP_Value:.4f}\n\n"

report += "=" * 80 + "\n"
report += "                       FINAL SUMMARY\n"
report += "=" * 80 + "\n\n"

if decision == "REJECTED":
    top_reason = negative.iloc[0]["Feature"]
    report += "REASON FOR REJECTION:\n\n"
    report += f"The primary reason for rejecting this loan application is {top_reason}.\n"
    report += "This factor contributed the most negative influence on the final decision.\n"
    report += f"With only a {probability*100:.1f}% probability of approval, the application\n"
    report += "falls below the minimum threshold required for loan approval.\n"
else:
    top_reason = positive.iloc[0]["Feature"]
    report += "REASON FOR APPROVAL:\n\n"
    report += f"The primary reason for approving this loan application is strong performance in {top_reason}.\n"
    report += "The applicant shows good repayment capacity and acceptable credit behavior.\n"

report += "\n" + "=" * 80 + "\n"
report += "                          END OF REPORT\n"
report += "=" * 80 + "\n"

# ---------------------------
# 7. SAVE REPORT TO TXT FILE 🔥
# ---------------------------

with open(filename, "w") as f:
    f.write(report)

print("\n📄 REPORT SAVED SUCCESSFULLY!")
print("Saved as:", filename)

# Also print the report on screen
print("\n" + report)


# =========================================================
# 8. GENERATE USER GUIDANCE REPORT (RECOMMENDATION ENGINE)
# =========================================================

def generate_guidance_report(negative_factors, probability, decision):
    now = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    filename = f"Loan_Guidance_Report_{now}.txt"

    guidance = ""
    guidance += "=" * 80 + "\n"
    guidance += "                 LOAN APPROVAL GUIDANCE REPORT\n"
    guidance += "=" * 80 + "\n\n"

    guidance += f"FINAL DECISION: {decision}\n"
    guidance += f"CURRENT APPROVAL PROBABILITY: {probability*100:.1f}%\n\n"

    guidance += "This guidance report explains how you can improve your chances\n"
    guidance += "of getting your loan approved in the future.\n"
    guidance += "Please follow the suggestions carefully.\n\n"

    guidance += "=" * 80 + "\n"
    guidance += "              MAIN AREAS THAT NEED IMPROVEMENT\n"
    guidance += "=" * 80 + "\n\n"

    recommendations = []

    for row in negative_factors.itertuples():
        feature = row.Feature.lower()

        # ---------------- CREDIT HISTORY ----------------
        if "credit_history" in feature:
            recommendations.append(
                "Improve your credit history:\n"
                "  - Pay all existing EMIs and credit card bills on time\n"
                "  - Avoid missing any payments for the next 6–12 months\n"
                "  - Do not apply for many new loans or credit cards\n"
                "  - Check your credit report and correct any mistakes\n"
            )

        # ---------------- EMI RATIO / LOAN BURDEN ----------------
        elif "emi" in feature or "loan_income_ratio" in feature:
            recommendations.append(
                "Reduce your loan burden:\n"
                "  - Try to reduce the loan amount\n"
                "  - Increase your monthly income if possible\n"
                "  - Close small existing loans before applying again\n"
                "  - Choose a longer loan tenure to reduce EMI pressure\n"
            )

        # ---------------- LOAN AMOUNT ----------------
        elif "loanamount" in feature:
            recommendations.append(
                "Adjust your loan amount:\n"
                "  - Apply for a smaller loan amount\n"
                "  - Increase your down payment\n"
                "  - Make sure the loan amount matches your income level\n"
            )

        # ---------------- APPLICANT INCOME ----------------
        elif "applicantincome" in feature:
            recommendations.append(
                "Improve your income profile:\n"
                "  - Show additional income sources if available\n"
                "  - Add a co-applicant with stable income\n"
                "  - Apply after getting a salary hike or job promotion\n"
            )

        # ---------------- CO-APPLICANT INCOME ----------------
        elif "coapplicantincome" in feature:
            recommendations.append(
                "Strengthen co-applicant profile:\n"
                "  - Add a co-applicant with higher or stable income\n"
                "  - Ensure co-applicant has good credit history\n"
            )

        # ---------------- DEPENDENTS ----------------
        elif "dependents" in feature:
            recommendations.append(
                "Manage dependent responsibility:\n"
                "  - Try to reduce existing financial commitments\n"
                "  - Increase household income before re-applying\n"
            )

        # ---------------- PROPERTY AREA ----------------
        elif "property_area" in feature:
            recommendations.append(
                "Property related improvement:\n"
                "  - Choose property in a more developed / urban area\n"
                "  - Ensure property documents are clear and verified\n"
            )

        # ---------------- SELF EMPLOYED ----------------
        elif "self_employed" in feature:
            recommendations.append(
                "Strengthen employment stability:\n"
                "  - Show stable income for the last 2–3 years\n"
                "  - Maintain proper business financial records\n"
                "  - File income tax returns regularly\n"
            )

    # Remove duplicates
    recommendations = list(dict.fromkeys(recommendations))

    if not recommendations:
        guidance += "No major risk factors found. Your profile is already strong.\n\n"
    else:
        for i, rec in enumerate(recommendations, 1):
            guidance += f"{i}. {rec}\n"

    guidance += "=" * 80 + "\n"
    guidance += "                  FINAL ADVICE TO APPLICANT\n"
    guidance += "=" * 80 + "\n\n"

    if decision == "REJECTED":
        guidance += (
            "Your loan was rejected mainly due to financial risk factors.\n"
            "If you follow the above suggestions and improve your profile,\n"
            "your chances of approval will increase significantly.\n\n"
            "We recommend waiting at least 3 to 6 months before re-applying\n"
            "after improving your credit and income profile.\n"
        )
    else:
        guidance += (
            "Your loan was approved successfully.\n"
            "To maintain a good credit profile in the future:\n"
            "  - Always pay EMIs on time\n"
            "  - Avoid taking unnecessary loans\n"
            "  - Maintain a good credit score\n"
        )

    guidance += "\n" + "=" * 80 + "\n"
    guidance += "                    END OF GUIDANCE REPORT\n"
    guidance += "=" * 80 + "\n"

    # Save guidance report
    with open(filename, "w") as f:
        f.write(guidance)

    print("\n📘 GUIDANCE REPORT SAVED SUCCESSFULLY!")
    print("Saved as:", filename)

    # Also print guidance on screen
    print("\n" + guidance)
# ============================================
# 9. GENERATE GUIDANCE REPORT BASED ON SHAP 🔥
# ============================================

generate_guidance_report(negative, probability, decision)
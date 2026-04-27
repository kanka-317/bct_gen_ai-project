import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.metrics import classification_report, accuracy_score
import joblib
import warnings
import os
import google.generativeai as genai
from dotenv import load_dotenv

warnings.filterwarnings('ignore')

load_dotenv()

def main():
    print("Loading data...")
    # Load dataset
    df_augmented = pd.read_csv('Symptom2Disease_with_Labs.csv')

    # Features and Target
    # Ensure we drop Unnamed: 0 if it exists
    X = df_augmented.drop(columns=['label', 'Unnamed: 0'], errors='ignore')
    y = df_augmented['label']

    # Train Test Split (just to print accuracy)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Define columns
    text_col = 'text'
    num_cols = ['Temperature_F', 'Systolic_BP', 'Diastolic_BP', 'WBC_Count', 'Fasting_Blood_Sugar', 'Bilirubin_Total']

    # Preprocessing Pipeline
    print("Setting up pipeline...")
    preprocessor = ColumnTransformer(
        transformers=[
            ('text', TfidfVectorizer(max_features=2000), text_col),
            ('num', StandardScaler(), num_cols)
        ]
    )

    # Full Model Pipeline
    model = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('classifier', RandomForestClassifier(n_estimators=100, random_state=42))
    ])

    # Train Model
    print("Training model...")
    model.fit(X_train, y_train)

    # Evaluate
    print("Evaluating model...")
    y_pred = model.predict(X_test)
    print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}\n")
    print(classification_report(y_test, y_pred))

    # Retrain on full dataset for final model
    print("Retraining on full dataset for final model...")
    model.fit(X, y)

    # Save model
    model_path = 'rf_disease_model.pkl'
    joblib.dump(model, model_path)
    print(f"Model successfully saved to {model_path}\n")

    # --- Test Medicine Suggestion ---
    print("Testing Medicine Suggestion Feature with Gemini AI...")
    api_key = os.getenv("GOOGLE_API_KEY", "")
    if not api_key:
        print("GOOGLE_API_KEY not found in environment. Skipping AI medicine suggestion test.")
    else:
        genai.configure(api_key=api_key)
        
        # Create a sample patient
        sample_symptoms = "I have severe joint and muscle pain, high fever, and some rash on my body. I feel extremely exhausted."
        sample_lab_results = {
            'Temperature_F': 103.5,
            'Systolic_BP': 110,
            'Diastolic_BP': 75,
            'WBC_Count': 2500,
            'Fasting_Blood_Sugar': 95.0,
            'Bilirubin_Total': 0.9
        }
        
        sample_df = pd.DataFrame([{
            'text': sample_symptoms,
            **sample_lab_results
        }])
        
        predicted_disease = model.predict(sample_df)[0]
        print(f"Sample Symptoms: {sample_symptoms}")
        print(f"Predicted Disease: {predicted_disease}")
        
        lab_results_text = "\n".join([f"- {k}: {v}" for k, v in sample_lab_results.items()])
        prompt = f"""
        You are an AI medical assistant. A patient has the following symptoms: "{sample_symptoms}".
        Lab test results:
        {lab_results_text}
        
        The primary predicted diagnosis from our ML model is: {predicted_disease}.
        
        Please suggest the best possible medicine recommendations or over-the-counter options based on these findings.
        Include a strong medical disclaimer. Keep it concise.
        """
        
        try:
            gemini_model = genai.GenerativeModel('gemini-1.5-flash')
            response = gemini_model.generate_content(prompt)
            print("\n--- AI Medicine Suggestion ---")
            print(response.text)
            print("------------------------------")
        except Exception as e:
            print(f"Error calling Gemini AI: {e}")

if __name__ == "__main__":
    main()

from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import joblib
import pandas as pd
import numpy as np
import google.generativeai as genai
import os
import tempfile
import PIL.Image
from typing import List, Optional
from pathlib import Path
from dotenv import load_dotenv
from openai import OpenAI

BACKEND_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BACKEND_DIR.parent

# Load local env values during development; Render/Netlify will provide hosted env vars.
load_dotenv(PROJECT_ROOT / ".env")

# Simple JSON database for persistence
DB_FILE = BACKEND_DIR / "users_db.json"


def resolve_project_path(env_key: str, default_relative_path: str) -> Path:
    configured_path = os.getenv(env_key)
    if not configured_path:
        return PROJECT_ROOT / default_relative_path

    candidate = Path(configured_path)
    return candidate if candidate.is_absolute() else PROJECT_ROOT / candidate

def load_db():
    if DB_FILE.exists():
        try:
            with DB_FILE.open("r") as f:
                import json
                return json.load(f)
        except Exception as e:
            print(f"Error loading DB: {e}")
            return {}
    return {}

def save_db(db):
    try:
        with DB_FILE.open("w") as f:
            import json
            json.dump(db, f, indent=4)
    except Exception as e:
        print(f"Error saving DB: {e}")

# Load database on startup
fake_users_db = load_db()


# Setup FastAPI
app = FastAPI(
    title="MediScan Clinical API",
    description="API for predicting diseases and getting AI-generated medical explanations.",
    version="1.0.0"
)

# Enable CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (change in production)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Load the trained machine learning model
MODEL_PATH = resolve_project_path("MODEL_PATH", "rf_disease_model.pkl")
try:
    model = joblib.load(MODEL_PATH)
    print(f"Successfully loaded model from {MODEL_PATH}")
except Exception as e:
    model = None
    print(f"Warning: Failed to load model at {MODEL_PATH}. Error: {e}")

# Setup Google Generative AI
# Make sure to set the GOOGLE_API_KEY environment variable before running the server
API_KEY = os.getenv("GOOGLE_API_KEY", "")
if API_KEY:
    genai.configure(api_key=API_KEY)
else:
    print("Warning: GOOGLE_API_KEY environment variable not set. AI explanations may fail.")

# Setup OpenAI
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
openai_client = None
if OPENAI_API_KEY:
    openai_client = OpenAI(api_key=OPENAI_API_KEY)
else:
    print("Warning: OPENAI_API_KEY environment variable not set.")

class PatientData(BaseModel):
    email: Optional[str] = Field(None, description="Patient email")
    text: str = Field(..., description="Symptom description")
    Temperature_F: float = Field(98.6, description="Temperature in Fahrenheit")
    Systolic_BP: int = Field(120, description="Systolic Blood Pressure")
    Diastolic_BP: int = Field(80, description="Diastolic Blood Pressure")
    WBC_Count: int = Field(7000, description="White Blood Cell Count")
    Fasting_Blood_Sugar: float = Field(90.0, description="Fasting Blood Sugar")
    Bilirubin_Total: float = Field(0.8, description="Total Bilirubin")

class DiseaseProbability(BaseModel):
    disease: str
    probability: float

class PredictionResponse(BaseModel):
    primary_diagnosis: str
    top_possibilities: List[DiseaseProbability]
    ai_explanation: str

class ChatMessage(BaseModel):
    role: str
    text: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    email: Optional[str] = None

class UserSignup(BaseModel):
    email: str
    password: str
    name: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResetPassword(BaseModel):
    email: str
    new_password: str

def create_default_patient_profile(name: str = "", email: str = "") -> dict:
    return {
        "name": name or "",
        "email": email or "",
        "phone": "",
        "gender": "",
        "location": "",
        "job": "",
        "bmi": "",
        "weight": "",
        "height": "",
        "blood_pressure": "",
        "own_diagnosis": [],
        "timeline": [],
        "chronic_disease": "",
        "diabetes_emergencies": "",
        "surgery": "",
        "family_disease": "",
        "diabetes_related_complication": ""
    }

def get_user_record(email: str) -> dict:
    if not email:
        raise HTTPException(status_code=400, detail="Patient email is required.")

    db_user = fake_users_db.get(email)
    if not db_user:
        # Auto-create user if they don't exist to prevent session loss on dev server restarts
        name = email.split('@')[0]
        fake_users_db[email] = {
            "email": email,
            "password": "auto-recreated",
            "name": name,
            "patient_details": create_default_patient_profile(name, email)
        }
        db_user = fake_users_db[email]
        save_db(fake_users_db)

    if "patient_details" not in db_user or not isinstance(db_user["patient_details"], dict):
        db_user["patient_details"] = create_default_patient_profile(db_user.get("name", ""), db_user.get("email", ""))

    patient_details = db_user["patient_details"]
    if not patient_details.get("name"):
        patient_details["name"] = db_user.get("name", "")

    return db_user

def get_patient_profile(email: str) -> dict:
    profile = get_user_record(email)["patient_details"]
    # Migration/Normalization: Flatten medical_history if it exists
    if "medical_history" in profile and isinstance(profile["medical_history"], dict):
        for key, value in profile["medical_history"].items():
            if not profile.get(key):
                profile[key] = value
    return profile

def append_prediction_to_patient_profile(patient_profile: dict, prediction: str, timeline_label: str) -> None:
    pred_str = str(prediction).strip()
    if not pred_str or pred_str == "Awaiting doctor's review":
        return

    diagnoses = patient_profile.setdefault("own_diagnosis", [])
    if pred_str not in diagnoses:
        diagnoses.append(pred_str)

    import datetime
    current_date = datetime.datetime.now().strftime("%b %Y").upper()
    timeline = patient_profile.setdefault("timeline", [])
    if not timeline or timeline[0].get("title") != pred_str or timeline[0].get("val") != timeline_label:
        timeline.insert(0, {
            "date": current_date,
            "title": pred_str,
            "val": timeline_label
        })

    chronic = patient_profile.get("chronic_disease", "")
    existing_conditions = [item.strip() for item in str(chronic).split(",") if item.strip()]
    if pred_str not in existing_conditions:
        patient_profile["chronic_disease"] = f"{chronic}, {pred_str}" if chronic else pred_str
    
    save_db(fake_users_db)

def generate_ai_explanation(disease: str, symptoms: str, lab_results: dict = None) -> str:
    """Generate an AI explanation using OpenAI or Gemini."""
    try:
        lab_results_text = ""
        if lab_results:
            lab_results_text = "The patient's lab test results are:\n" + "\n".join([f"- {k}: {v}" for k, v in lab_results.items()])
        
        prompt = f"""
        You are a Chief Medical Officer and Clinical Diagnostician. Generate a formal, objective, and highly concise clinical assessment report formatted exactly like a doctor's prescription. 
        Do NOT use conversational greetings, filler words, or empathetic phrases (like "Hello there" or "I understand"). Get straight to the medical facts.
        
        PATIENT PRESENTATION:
        Symptoms: "{symptoms}"
        {lab_results_text}
        
        PRIMARY ML DIAGNOSIS: {disease}
        
        Format the report strictly using the following markdown structure. Use professional medical terminology where appropriate.

        **Rx: CLINICAL DIAGNOSIS**

        **Condition:** {disease}
        **Assessment:** [1-2 concise sentences summarizing the patient presentation and how it aligns with the primary diagnosis.]
        
        **⚕️ RECOMMENDED MEDICATIONS (Rx)**

        [Bullet points of standard theoretical medications (OTC or prescription) for symptom management. Include a strong inline warning that a physician must be consulted before use. State "None immediately indicated" if not applicable.]
        
        **🧪 RECOMMENDED DIAGNOSTIC TESTS**

        [Bullet points specifying if any further laboratory tests, imaging, or diagnostic procedures are required to confirm this diagnosis or rule out differential diagnoses. State "None immediately required" if symptoms are mild and self-limiting.]
        
        **🌱 LIFESTYLE & CARE ADVICE**

        [Bullet points of lifestyle, dietary, and home remedy modifications.]
        
        **MEDICAL DISCLAIMER**

        [Standard bold disclaimer stating this is AI-generated for informational purposes only and does not constitute medical advice.]
        """
        
        if openai_client:
            try:
                response = openai_client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[{"role": "user", "content": prompt}],
                    max_tokens=800
                )
                return response.choices[0].message.content
            except Exception as openai_err:
                print(f"Warning: OpenAI API failed ({openai_err}). Falling back to Gemini 2.5 Flash.")
        
        if API_KEY:
            # Fallback to Gemini 2.5 Flash
            gemini_model = genai.GenerativeModel('gemini-2.5-flash')
            import time
            for attempt in range(3):
                try:
                    response = gemini_model.generate_content(prompt)
                    return response.text
                except Exception as e:
                    if '429' in str(e) and attempt < 2:
                        time.sleep(6)
                        continue
                    return f"AI Explanation currently unavailable. Error: {str(e)}"
            return "AI Explanation currently unavailable. Error: Rate limit exceeded."
        else:
            return "AI Explanation unavailable. Please configure OPENAI_API_KEY or GOOGLE_API_KEY."
    except Exception as e:
        return f"AI Explanation currently unavailable. Error: {str(e)}"

@app.post("/predict", response_model=PredictionResponse)
async def predict_disease(data: PatientData):
    if model is None:
        raise HTTPException(status_code=500, detail="Machine learning model is not loaded.")

    try:
        # Create DataFrame for prediction
        input_df = pd.DataFrame([{
            'text': data.text,
            'Temperature_F': data.Temperature_F,
            'Systolic_BP': data.Systolic_BP,
            'Diastolic_BP': data.Diastolic_BP,
            'WBC_Count': data.WBC_Count,
            'Fasting_Blood_Sugar': data.Fasting_Blood_Sugar,
            'Bilirubin_Total': data.Bilirubin_Total
        }])

        # Predict
        prediction = model.predict(input_df)[0]
        probabilities = model.predict_proba(input_df)[0]
        
        # Get top 3 predictions
        top3_idx = np.argsort(probabilities)[-3:][::-1]
        classes = model.classes_
        
        top_possibilities = [
            DiseaseProbability(disease=classes[i], probability=round(float(probabilities[i]) * 100, 2))
            for i in top3_idx
        ]

        # Prepare lab results for AI explanation
        lab_results = {
            'Temperature (F)': data.Temperature_F,
            'Systolic BP': data.Systolic_BP,
            'Diastolic BP': data.Diastolic_BP,
            'WBC Count': data.WBC_Count,
            'Fasting Blood Sugar': data.Fasting_Blood_Sugar,
            'Total Bilirubin': data.Bilirubin_Total
        }

        # Generate AI Explanation
        ai_explanation = generate_ai_explanation(prediction, data.text, lab_results)

        if data.email:
            patient_profile = get_patient_profile(data.email)
            append_prediction_to_patient_profile(patient_profile, prediction, "AI Diagnosis")

        return PredictionResponse(
            primary_diagnosis=prediction,
            top_possibilities=top_possibilities,
            ai_explanation=ai_explanation
        )

    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.post("/analyze-report")
async def analyze_medical_report(file: UploadFile = File(...), email: Optional[str] = Form(None)):
    if not API_KEY:
        raise HTTPException(status_code=500, detail="AI functionality unavailable. Please configure GOOGLE_API_KEY.")
    
    # Validate file type
    allowed_types = ["image/jpeg", "image/png", "application/pdf"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Invalid file format. Please upload a JPG, PNG, or PDF file.")
    
    try:
        # Read the uploaded file
        contents = await file.read()
        
        # Determine file extension based on content_type
        ext = ".png"
        if file.content_type == "image/jpeg":
            ext = ".jpg"
        elif file.content_type == "application/pdf":
            ext = ".pdf"

        # Save temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as temp_file:
            temp_file.write(contents)
            temp_file_path = temp_file.name
        
        uploaded_file = None
        try:
            # Upload to Gemini using File API (handles large files and PDFs natively)
            uploaded_file = genai.upload_file(path=temp_file_path, mime_type=file.content_type)
            
            # Combine extraction and analysis into a SINGLE Gemini call to prevent hitting the 5 requests/minute free tier limit
            import json
            prompt = """
            You are an expert AI medical assistant and diagnostician. 
            Please carefully analyze the provided medical test report.
            
            Return your response ONLY as a valid JSON object with the following EXACT keys:
            "extracted_data": {
                "text": "A short summary of symptoms or 'No symptoms reported'",
                "Temperature_F": 98.6,
                "Systolic_BP": 120,
                "Diastolic_BP": 80,
                "WBC_Count": 7000,
                "Fasting_Blood_Sugar": 90.0,
                "Bilirubin_Total": 0.8
            },
            "key_findings": "String summarizing important abnormal values or significant observations.",
            "potential_conditions": "String discussing what diseases these results might indicate.",
            "suggested_medicines": "String suggesting standard medications or over-the-counter options.",
            "lifestyle_recommendations": "String suggesting lifestyle or dietary changes."
            """
            
            gemini_json_model = genai.GenerativeModel('gemini-2.5-flash', generation_config=genai.GenerationConfig(response_mime_type="application/json"))
            import time
            json_response = None
            for attempt in range(3):
                try:
                    json_response = gemini_json_model.generate_content([prompt, uploaded_file])
                    break
                except Exception as e:
                    if '429' in str(e) and attempt < 2:
                        time.sleep(6)
                        continue
                    raise e
            
            try:
                parsed_data = json.loads(json_response.text)
            except Exception as e:
                print(f"Warning: Failed to parse Gemini JSON. {e}")
                parsed_data = {
                    "extracted_data": {},
                    "key_findings": "Could not parse key findings.",
                    "potential_conditions": "Could not parse conditions.",
                    "suggested_medicines": "Could not parse medicines.",
                    "lifestyle_recommendations": "Could not parse lifestyle recommendations."
                }
                
            extracted = parsed_data.get("extracted_data", {})
            
            # Predict using our ML Model
            prediction_result = "Awaiting doctor's review"
            if model is not None:
                try:
                    input_df = pd.DataFrame([{
                        'text': extracted.get('text') or 'No symptoms reported',
                        'Temperature_F': float(extracted.get('Temperature_F') or 98.6),
                        'Systolic_BP': int(extracted.get('Systolic_BP') or 120),
                        'Diastolic_BP': int(extracted.get('Diastolic_BP') or 80),
                        'WBC_Count': int(extracted.get('WBC_Count') or 7000),
                        'Fasting_Blood_Sugar': float(extracted.get('Fasting_Blood_Sugar') or 90.0),
                        'Bilirubin_Total': float(extracted.get('Bilirubin_Total') or 0.8)
                    }])
                    prediction_result = model.predict(input_df)[0]
                    
                    if email:
                        patient_profile = get_patient_profile(email)
                        append_prediction_to_patient_profile(patient_profile, prediction_result, "AI Diagnosis from Report")
                            
                except Exception as ml_err:
                    print(f"Warning: ML model prediction failed. {ml_err}")

            # Construct the final markdown response manually
            analysis_result = f"""### 🤖 ML Model Prediction
Based on the extracted lab values, our clinical machine learning model predicts: **{prediction_result}**.

### 🔍 Key Findings (From Report)
{parsed_data.get('key_findings', '')}

### 🩺 Potential Conditions (Report Analysis)
{parsed_data.get('potential_conditions', '')}
"""
            # Generate detailed prescription for the predicted disease
            try:
                ai_prescription = generate_ai_explanation(prediction_result, extracted.get('text', 'No symptoms reported'), extracted)
                analysis_result += f"\n\n### 💊 Detailed AI Doctor Prescription (For {prediction_result})\n{ai_prescription}"
            except Exception as e:
                print(f"Warning: Failed to generate AI prescription: {e}")
            
            
        finally:
            # Clean up temporary file
            if os.path.exists(temp_file_path):
                os.remove(temp_file_path)
            # Clean up uploaded file in Gemini
            if uploaded_file:
                try:
                    genai.delete_file(uploaded_file.name)
                except Exception as cleanup_err:
                    print(f"Warning: Failed to delete remote file {uploaded_file.name}: {cleanup_err}")
        
        return {"analysis": analysis_result}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to analyze report: {str(e)}")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Multi-Disease Prediction API. Use /docs to view the API documentation."}

@app.post("/chat")
async def chat_with_doctor(request: ChatRequest):
    if not API_KEY and not openai_client:
        raise HTTPException(status_code=500, detail="AI functionality unavailable. Please configure GOOGLE_API_KEY or OPENAI_API_KEY.")
    
    try:
        system_prompt = """You are an expert AI Doctor, designed to help patients understand their symptoms and provide general medical advice. Always be professional, empathetic, and clinical. 
        End your first response with a disclaimer that you are an AI. 
        If the user asks non-medical questions, politely redirect them to medical topics.
        
        CRITICAL: If you reach a definitive conclusion or highly likely diagnosis, please include it at the very end of your response in the format: "DIAGNOSIS_TAG: [Disease Name]". This will help update the patient's medical history."""
        
        ai_response_text = ""
        
        if openai_client:
            try:
                messages = [{"role": "system", "content": system_prompt}]
                for msg in request.messages:
                    messages.append({
                        "role": "user" if msg.role == "user" else "assistant",
                        "content": msg.text
                    })
                    
                response = openai_client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=messages,
                    max_tokens=800
                )
                ai_response_text = response.choices[0].message.content
            except Exception as openai_err:
                print(f"Warning: OpenAI Chat API failed ({openai_err}). Falling back to Gemini 2.5 Flash.")
            
        if not ai_response_text and API_KEY:
            # Fallback to Gemini 2.5 Flash
            gemini_model = genai.GenerativeModel('gemini-2.5-flash')
            
            history = []
            for msg in request.messages[:-1]:
                history.append({
                    "role": "user" if msg.role == "user" else "model",
                    "parts": [msg.text]
                })
                
            chat = gemini_model.start_chat(history=history)
            
            last_message = request.messages[-1].text
            if len(request.messages) == 1:
                last_message = f"System Instruction: {system_prompt}\n\nUser: {last_message}"
            else:
                # Still remind about the tag
                last_message = f"{last_message}\n\n(Reminder: Use DIAGNOSIS_TAG if you reach a conclusion)"
                
            import time
            response = None
            for attempt in range(3):
                try:
                    response = chat.send_message(last_message)
                    break
                except Exception as e:
                    if '429' in str(e) and attempt < 2:
                        time.sleep(6)
                        continue
                    raise e
            
            ai_response_text = response.text

        # Extract diagnosis if present
        diagnosis = None
        if "DIAGNOSIS_TAG:" in ai_response_text:
            parts = ai_response_text.split("DIAGNOSIS_TAG:")
            diagnosis = parts[-1].strip().strip('[]').split('\n')[0].strip()
            # Remove the tag from the displayed text if desired, or keep it. Let's keep it for now but clean it up.
            
        if diagnosis and request.email:
            patient_profile = get_patient_profile(request.email)
            append_prediction_to_patient_profile(patient_profile, diagnosis, "AI Doctor Chat Diagnosis")

        return {"response": ai_response_text, "diagnosis": diagnosis}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")

@app.post("/signup")
def signup(user: UserSignup):
    if user.email in fake_users_db:
        raise HTTPException(status_code=400, detail="Email already registered")
    fake_users_db[user.email] = {
        "email": user.email,
        "password": user.password,
        "name": user.name,
        "patient_details": create_default_patient_profile(user.name, user.email)
    }
    save_db(fake_users_db)
    return {"message": "User created successfully"}

@app.post("/reset-password")
def reset_password(data: UserResetPassword):
    if data.email not in fake_users_db:
        raise HTTPException(status_code=404, detail="Email not found")
    
    fake_users_db[data.email]["password"] = data.new_password
    save_db(fake_users_db)
    return {"message": "Password reset successfully"}

@app.post("/login")
def login(user: UserLogin):
    db_user = fake_users_db.get(user.email)
    
    # Auto-register user on login during development if the server restarted
    if not db_user:
        fake_users_db[user.email] = {
            "email": user.email,
            "password": user.password,
            "name": user.email.split('@')[0],
            "patient_details": create_default_patient_profile(user.email.split('@')[0], user.email)
        }
        db_user = fake_users_db[user.email]
    elif db_user["password"] != user.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    patient_details = get_patient_profile(user.email)
    return {
        "message": "Login successful",
        "name": db_user["name"],
        "email": db_user["email"],
        "patient_details": patient_details
    }

@app.get("/patient-details")
def get_patient_details(email: str):
    return get_patient_profile(email)

@app.put("/patient-details")
def update_patient_details(data: dict):
    lookup_email = data.get("currentUserEmail") or data.get("email")
    db_user = get_user_record(lookup_email)
    patient_details = db_user["patient_details"]

    update_data = {key: value for key, value in data.items() if key != "currentUserEmail"}
    patient_details.update(update_data)

    if update_data.get("name"):
        db_user["name"] = update_data["name"]

    save_db(fake_users_db)
    return patient_details

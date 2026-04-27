# MediScan Clinical AI

MediScan Clinical AI is a full-stack clinical assistant that combines a symptom-based disease prediction model with AI-generated medical explanations, report analysis, and a doctor-style chat experience.

## Features

- Disease prediction from symptoms and lab values
- AI-generated clinical explanation for predicted conditions
- Medical report upload and analysis for images and PDFs
- AI doctor chat with diagnosis tagging
- Basic patient profile, timeline, and diagnosis history storage
- Deployment-ready setup for Render and Netlify

## Tech Stack

- Backend: FastAPI, scikit-learn, pandas, NumPy
- AI providers: OpenAI and Google Gemini
- Frontend: React, Vite, Tailwind CSS, Axios
- Model artifact: `rf_disease_model.pkl`

## Project Structure

```text
backend/                 FastAPI backend
frontend/                React + Vite frontend
render.yaml              Render deployment config
netlify.toml             Netlify deployment config
requirements.txt         Python dependencies
rf_disease_model.pkl     Trained ML model
train_model.py           Model training script
```

## Backend API

Main endpoints exposed by the FastAPI app:

- `POST /predict`
- `POST /analyze-report`
- `POST /chat`
- `POST /signup`
- `POST /login`
- `POST /reset-password`
- `GET /patient-details`
- `PUT /patient-details`

## Environment Variables

Create a root `.env` file for local development:

```env
GOOGLE_API_KEY=your_google_api_key
OPENAI_API_KEY=your_openai_api_key
```

The frontend uses:

```env
VITE_API_URL=http://localhost:8000
```

## Local Development

### 1. Start the backend

```bash
pip install -r requirements.txt
uvicorn backend.main:app --reload
```

Backend default URL:

```text
http://localhost:8000
```

### 2. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend default URL:

```text
http://localhost:5173
```

## Deployment

### Backend on Render

Configured in `render.yaml`:

- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`

Required environment variables:

- `GOOGLE_API_KEY`
- `OPENAI_API_KEY`
- `PYTHON_VERSION=3.10.0`

### Frontend on Netlify

Configured in `netlify.toml`:

- Base directory: `frontend`
- Build command: `npm run build`
- Publish directory: `dist`

Required environment variables:

- `VITE_API_URL=https://your-render-backend-url.onrender.com`

## Important Notes

- `.env` is ignored by Git and should never be committed.
- Local patient data is currently stored in `backend/users_db.json`, which is suitable for development but not durable for production hosting.
- The trained model file is included in the repository, so the first push may be large.

## Verification

Deployment prep was verified locally with:

```bash
python -m py_compile backend/main.py
cd frontend && npm run build
```

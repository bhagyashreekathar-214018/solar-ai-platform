# AI-Based Solar Panel Performance Analysis and Real-Time AC Power Prediction

An end-to-end, real-time AI solar power analytics platform built with **FastAPI**, **React**, **TypeScript**, **Tailwind CSS**, and **Scikit-Learn**.

The application streams real-time environmental telemetry (solar irradiance, temperature, cloud cover, wind speed) from the **Open-Meteo API** and uses a trained **Random Forest Regression** model to predict AC power output in real time.

---

## 🌟 Key Features

1. **Real-Time Environmental Telemetry:** Live data fetched on-demand or refreshed every 5 minutes from Open-Meteo (GHI, direct/diffuse radiation, ambient temperature, wind speed).
2. **Supervised ML Power Prediction:** Estimates AC Power ($W$) using Random Forest Regressor and Linear Regression trained on historical solar generation datasets.
3. **Physical NOCT Module Temperature Estimation:** Employs the standard Nominal Operating Cell Temperature (NOCT) thermal model when direct module sensor hardware is absent.
4. **Interactive Dashboard:** 6 real-time KPI cards, historical vs live comparisons, diurnal profile bar charts, and scatter plots.
5. **CSV Dataset & Prediction Export:** Upload custom datasets, retrain ML models on the fly, and download predictions (`solar_predictions.csv`).

---

## 🏗️ Project Architecture

```
solar/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI server & REST API endpoints
│   │   ├── ml_engine.py         # ML training, evaluation (MAE, RMSE, R²), inference
│   │   ├── weather_service.py   # Open-Meteo API integration & NOCT formula
│   │   ├── dataset_manager.py   # Historical dataset summaries & prediction exporter
│   │   └── schemas.py           # Pydantic data models
│   ├── data/
│   │   └── solar_generation_dataset.csv
│   ├── models/
│   │   ├── best_model.joblib
│   │   └── model_metrics.json
│   ├── Procfile                 # Deployment process command
│   ├── requirements.txt         # Python dependencies
│   └── run.py                   # Local Uvicorn runner
│
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable UI & Recharts components
│   │   ├── pages/               # Dashboard, Live Monitoring, Prediction, Analysis, etc.
│   │   ├── services/api.ts      # Axios API client (supports VITE_API_URL)
│   │   └── types/               # TypeScript interfaces
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── vercel.json              # Vercel SPA routing rewrites
│   └── vite.config.ts
│
├── .gitignore                   # Excludes node_modules, cache, .env files
└── README.md
```

---

## 🚀 Running Locally

### 1. Backend (FastAPI)
```bash
cd backend
python -m pip install -r requirements.txt
python run.py
```
* Backend API: `http://localhost:8000`
* Swagger API Docs: `http://localhost:8000/docs`

### 2. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
* Frontend Dashboard: `http://localhost:3000`

---

## 🌐 Deployment

* **Frontend:** Ready for deployment on [Vercel](https://vercel.com).
* **Backend:** Ready for deployment on [Render](https://render.com) or [Railway](https://railway.app).

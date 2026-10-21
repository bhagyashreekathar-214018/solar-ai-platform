import os
import io
from datetime import datetime
from fastapi import FastAPI, UploadFile, File, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, FileResponse
from fastapi.staticfiles import StaticFiles
import pandas as pd

from app.schemas import PredictRequest, ManualPredictionInput, PredictResponse, TrainModelResponse
from app.ml_engine import MLEngine
from app.weather_service import fetch_open_meteo_data, record_live_observation, get_live_history
from app.dataset_manager import DatasetManager

app = FastAPI(
    title="AI-Based Solar Panel Performance Analysis & Real-Time AC Power Prediction",
    version="2.0.0",
    description="Real-Time AI Solar Analytics Platform with Open-Meteo Integration and Machine Learning"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global instances
ml_engine = MLEngine()
dataset_manager = DatasetManager()

DATA_SOURCE_INFO = {
    "environmental_data": "Open-Meteo API",
    "ml_prediction": "Random Forest Regression",
    "historical_training_data": "Uploaded Solar Dataset",
    "actual_inverter_data": "Not Connected"
}

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Solar AI Real-Time Analytics Engine",
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

@app.get("/live-data")
def get_live_data(lat: float = 12.9716, lon: float = 77.5946):
    """
    Fetches fresh Open-Meteo environmental data, maps features, predicts AC Power using best ML model.
    Does NOT hardcode values.
    """
    # 1. Fetch fresh Open-Meteo weather data
    live_env = fetch_open_meteo_data(latitude=lat, longitude=lon)
    
    # 2. Extract ML features
    features = live_env.get("ml_features", {})
    
    # 3. Predict AC Power using trained ML model
    predicted_ac_power = ml_engine.predict(features)
    
    # 4. Record to live history store for trend charts
    record_live_observation(live_env, predicted_ac_power)
    
    # 5. Get historical summary to compute historical average AC power comparison
    historical_summary = dataset_manager.get_historical_summary(ml_engine)
    hist_avg = historical_summary.get("daytime_avg_ac_power", historical_summary.get("historical_avg_ac_power", 1.0))
    
    if hist_avg > 0:
        diff_pct = round(((predicted_ac_power - hist_avg) / hist_avg) * 100.0, 2)
    else:
        diff_pct = 0.0

    return {
        "status": "LIVE",
        "timestamp": live_env.get("timestamp"),
        "time_short": live_env.get("time_short"),
        "environmental_data": {
            "source": live_env.get("source"),
            "ambient_temperature": live_env.get("ambient_temperature"),
            "solar_radiation_ghi": live_env.get("solar_radiation_ghi"),
            "direct_solar_radiation": live_env.get("direct_solar_radiation"),
            "diffuse_solar_radiation": live_env.get("diffuse_solar_radiation"),
            "direct_normal_irradiance": live_env.get("direct_normal_irradiance"),
            "gti": live_env.get("gti"),
            "cloud_cover": live_env.get("cloud_cover"),
            "wind_speed": live_env.get("wind_speed"),
        },
        "estimated_module_temperature": live_env.get("estimated_module_temperature"),
        "estimation_method": live_env.get("estimation_method"),
        "predicted_ac_power": predicted_ac_power,
        "predicted_unit": "W",
        "model_used": ml_engine.best_model_name,
        "model_r2": ml_engine.metrics.get(ml_engine.best_model_name, {}).get("R2", 0.0),
        "historical_comparison": {
            "historical_average_ac_power": hist_avg,
            "predicted_ac_power": predicted_ac_power,
            "percentage_difference": diff_pct,
            "comparison_label": "Compared with historical average"
        },
        "data_source_indicators": DATA_SOURCE_INFO,
        "live_history": get_live_history()
    }

@app.post("/predict")
def predict_ac_power(req: PredictRequest):
    """
    Predicts AC Power based on user-provided feature vector.
    """
    input_dict = {
        "AMBIENT_TEMPERATURE": req.AMBIENT_TEMPERATURE,
        "MODULE_TEMPERATURE": req.MODULE_TEMPERATURE,
        "IRRADIATION": req.IRRADIATION,
        "HOUR": req.HOUR,
        "DAY": req.DAY,
        "MONTH": req.MONTH,
        "DAY_OF_WEEK": req.DAY_OF_WEEK
    }
    
    predicted_val = ml_engine.predict(input_dict)
    
    return {
        "predicted_ac_power": predicted_val,
        "unit": "W",
        "prediction_timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "model_used": ml_engine.best_model_name,
        "input_conditions": input_dict,
        "data_source_indicators": DATA_SOURCE_INFO
    }

@app.post("/train-model")
def train_model():
    """
    Retrains both RandomForestRegressor and LinearRegression on current dataset.
    """
    try:
        metrics = ml_engine.train_and_evaluate()
        return {
            "status": "success",
            "message": "Models trained successfully.",
            "metrics": metrics
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/model-metrics")
def get_model_metrics():
    """
    Returns performance metrics (MAE, RMSE, R²) for Random Forest and Linear Regression.
    """
    return {
        "metrics": ml_engine.metrics,
        "best_model": ml_engine.best_model_name,
        "feature_importance": ml_engine.feature_importance,
        "disclaimer": "Metrics calculated from 20% test dataset split. AC Power is a regression task."
    }

@app.get("/historical-summary")
def get_historical_summary():
    """
    Returns historical dataset KPIs, hourly trends, and chart data points.
    """
    try:
        return dataset_manager.get_historical_summary(ml_engine)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/dataset-info")
def get_dataset_info():
    """
    Returns active dataset metadata: rows, columns, missing values, duplicates, preview.
    """
    return dataset_manager.get_active_dataset_info()

@app.post("/upload-dataset")
async def upload_dataset(file: UploadFile = File(...)):
    """
    Upload custom dataset CSV file.
    """
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are supported.")
    
    content = await file.read()
    try:
        df = pd.read_csv(io.BytesIO(content))
        inspection = DatasetManager.inspect_dataset(df)
        
        if not inspection["has_required_columns"]:
            missing = ", ".join(inspection["missing_required_columns"])
            raise HTTPException(
                status_code=400, 
                detail=f"CSV missing required columns: {missing}"
            )
        
        # Save to dataset location
        df.to_csv(dataset_manager.data_path, index=False)
        
        # Retrain model with new dataset
        ml_engine.train_and_evaluate(custom_df=df)
        
        return {
            "status": "success",
            "message": f"Successfully uploaded {file.filename} and retrained models.",
            "dataset_info": inspection,
            "new_metrics": ml_engine.metrics
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to process CSV: {str(e)}")

@app.get("/export-predictions")
def export_predictions():
    """
    Generates and exports solar_predictions.csv containing required columns.
    """
    try:
        df_export = dataset_manager.generate_predictions_csv(ml_engine)
        csv_buffer = io.StringIO()
        df_export.to_csv(csv_buffer, index=False)
        csv_buffer.seek(0)
        
        return Response(
            content=csv_buffer.getvalue(),
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=solar_predictions.csv"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/live-history")
def get_live_history_endpoint():
    return {
        "history": get_live_history()
    }

# Serve React static frontend dist build if present
frontend_dist = os.path.join(os.path.dirname(__file__), '..', '..', 'frontend', 'dist')
if os.path.exists(frontend_dist):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist, "assets")), name="assets")
    
    @app.get("/{full_path:path}")
    def serve_frontend(full_path: str):
        file_path = os.path.join(frontend_dist, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(frontend_dist, "index.html"))

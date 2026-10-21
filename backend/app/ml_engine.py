import os
import json
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

FEATURE_COLUMNS = [
    'AMBIENT_TEMPERATURE',
    'MODULE_TEMPERATURE',
    'IRRADIATION',
    'HOUR',
    'DAY',
    'MONTH',
    'DAY_OF_WEEK'
]

TARGET_COLUMN = 'AC_POWER'

MODEL_DIR = os.path.join(os.path.dirname(__file__), '..', 'models')
BEST_MODEL_PATH = os.path.join(MODEL_DIR, 'best_model.joblib')
METRICS_PATH = os.path.join(MODEL_DIR, 'model_metrics.json')

class MLEngine:
    def __init__(self, data_path=None):
        self.data_path = data_path or os.path.join(os.path.dirname(__file__), '..', 'data', 'solar_generation_dataset.csv')
        self.best_model = None
        self.best_model_name = "RandomForestRegressor"
        self.rf_model = None
        self.lr_model = None
        self.metrics = {}
        self.feature_importance = {}
        
        # Load existing model & metrics if available, else train
        if os.path.exists(BEST_MODEL_PATH) and os.path.exists(METRICS_PATH):
            try:
                self.load_model_and_metrics()
            except Exception:
                self.train_and_evaluate()
        else:
            self.train_and_evaluate()

    def train_and_evaluate(self, custom_df=None):
        if custom_df is not None:
            df = custom_df.copy()
        else:
            if not os.path.exists(self.data_path):
                raise FileNotFoundError(f"Dataset not found at {self.data_path}")
            df = pd.read_csv(self.data_path)

        # Validate required columns
        for col in FEATURE_COLUMNS + [TARGET_COLUMN]:
            if col not in df.columns:
                raise ValueError(f"Missing required column in dataset: {col}")

        # Drop NaN values if any
        df = df.dropna(subset=FEATURE_COLUMNS + [TARGET_COLUMN])

        X = df[FEATURE_COLUMNS]
        y = df[TARGET_COLUMN]

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        # 1. Random Forest
        rf = RandomForestRegressor(n_estimators=100, max_depth=15, random_state=42, n_jobs=-1)
        rf.fit(X_train, y_train)
        rf_pred = rf.predict(X_test)
        
        # Clamp negative predictions to 0 for solar power physics
        rf_pred = np.clip(rf_pred, 0, None)

        rf_mae = float(mean_absolute_error(y_test, rf_pred))
        rf_rmse = float(np.sqrt(mean_squared_error(y_test, rf_pred)))
        rf_r2 = float(r2_score(y_test, rf_pred))

        # 2. Linear Regression
        lr = LinearRegression()
        lr.fit(X_train, y_train)
        lr_pred = lr.predict(X_test)
        lr_pred = np.clip(lr_pred, 0, None)

        lr_mae = float(mean_absolute_error(y_test, lr_pred))
        lr_rmse = float(np.sqrt(mean_squared_error(y_test, lr_pred)))
        lr_r2 = float(r2_score(y_test, lr_pred))

        # Compare models (R2 score higher is better, RMSE lower is better)
        if rf_r2 >= lr_r2:
            self.best_model = rf
            self.best_model_name = "RandomForestRegressor"
        else:
            self.best_model = lr
            self.best_model_name = "LinearRegression"

        self.rf_model = rf
        self.lr_model = lr

        # Calculate feature importances from RF
        importances = rf.feature_importances_
        self.feature_importance = {
            col: round(float(imp), 4) for col, imp in zip(FEATURE_COLUMNS, importances)
        }

        self.metrics = {
            "RandomForestRegressor": {
                "MAE": round(rf_mae, 2),
                "RMSE": round(rf_rmse, 2),
                "R2": round(rf_r2, 4)
            },
            "LinearRegression": {
                "MAE": round(lr_mae, 2),
                "RMSE": round(lr_rmse, 2),
                "R2": round(lr_r2, 4)
            },
            "best_model": self.best_model_name,
            "feature_importance": self.feature_importance,
            "dataset_rows": len(df),
            "test_samples": len(y_test)
        }

        # Save model and metrics
        os.makedirs(MODEL_DIR, exist_ok=True)
        joblib.dump(self.best_model, BEST_MODEL_PATH)
        with open(METRICS_PATH, 'w') as f:
            json.dump(self.metrics, f, indent=4)

        return self.metrics

    def load_model_and_metrics(self):
        self.best_model = joblib.load(BEST_MODEL_PATH)
        with open(METRICS_PATH, 'r') as f:
            self.metrics = json.load(f)
        self.best_model_name = self.metrics.get("best_model", "RandomForestRegressor")
        self.feature_importance = self.metrics.get("feature_importance", {})

    def predict(self, input_features: dict) -> float:
        """
        input_features must contain:
        - AMBIENT_TEMPERATURE
        - MODULE_TEMPERATURE
        - IRRADIATION
        - HOUR
        - DAY
        - MONTH
        - DAY_OF_WEEK
        """
        if self.best_model is None:
            self.load_model_and_metrics()

        # Build single row dataframe in exact feature order
        feature_vector = pd.DataFrame([{
            'AMBIENT_TEMPERATURE': float(input_features['AMBIENT_TEMPERATURE']),
            'MODULE_TEMPERATURE': float(input_features['MODULE_TEMPERATURE']),
            'IRRADIATION': float(input_features['IRRADIATION']),
            'HOUR': int(input_features['HOUR']),
            'DAY': int(input_features['DAY']),
            'MONTH': int(input_features['MONTH']),
            'DAY_OF_WEEK': int(input_features['DAY_OF_WEEK'])
        }])[FEATURE_COLUMNS]

        # Solar night constraint check: if irradiation is 0, predicted power is 0.0 W
        if feature_vector['IRRADIATION'].iloc[0] <= 1.0:
            return 0.0

        pred = float(self.best_model.predict(feature_vector)[0])
        pred = max(0.0, round(pred, 2))
        return pred

    def predict_dataframe(self, df: pd.DataFrame) -> pd.DataFrame:
        if self.best_model is None:
            self.load_model_and_metrics()
        
        df_copy = df.copy()
        X = df_copy[FEATURE_COLUMNS]
        preds = self.best_model.predict(X)
        preds = np.clip(preds, 0, None)
        
        # Zero out night predictions where IRRADIATION <= 1.0
        preds[df_copy['IRRADIATION'] <= 1.0] = 0.0

        df_copy['PREDICTED_AC_POWER'] = np.round(preds, 2)
        if 'AC_POWER' in df_copy.columns:
            df_copy['PREDICTION_ERROR'] = np.round(df_copy['PREDICTED_AC_POWER'] - df_copy['AC_POWER'], 2)
        else:
            df_copy['PREDICTION_ERROR'] = 0.0

        return df_copy

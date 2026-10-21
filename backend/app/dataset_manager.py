import os
import pandas as pd
import numpy as np
from typing import Dict, Any, List
from app.ml_engine import MLEngine, FEATURE_COLUMNS, TARGET_COLUMN

DATASET_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'solar_generation_dataset.csv')

class DatasetManager:
    def __init__(self, data_path=None):
        self.data_path = data_path or DATASET_PATH

    @staticmethod
    def inspect_dataset(df: pd.DataFrame) -> Dict[str, Any]:
        missing_count = int(df.isnull().sum().sum())
        duplicate_count = int(df.duplicated().sum())
        columns = list(df.columns)
        rows_count = len(df)
        
        # Check required columns
        required = FEATURE_COLUMNS + [TARGET_COLUMN]
        missing_required = [col for col in required if col not in df.columns]
        
        preview = df.head(10).to_dict(orient='records')
        
        return {
            "rows": rows_count,
            "columns": len(columns),
            "column_names": columns,
            "missing_values": missing_count,
            "duplicate_rows": duplicate_count,
            "has_required_columns": len(missing_required) == 0,
            "missing_required_columns": missing_required,
            "preview": preview
        }

    def get_active_dataset_info(self) -> Dict[str, Any]:
        if not os.path.exists(self.data_path):
            return {"error": "Dataset file does not exist"}
        df = pd.read_csv(self.data_path)
        return self.inspect_dataset(df)

    def get_historical_summary(self, ml_engine: MLEngine) -> Dict[str, Any]:
        if not os.path.exists(self.data_path):
            raise FileNotFoundError(f"Dataset not found at {self.data_path}")
            
        df = pd.read_csv(self.data_path)
        
        # Historical stats
        avg_ac_power = float(df['AC_POWER'].mean())
        daytime_avg_ac_power = float(df[df['IRRADIATION'] > 5.0]['AC_POWER'].mean())
        max_ac_power = float(df['AC_POWER'].max())
        total_records = len(df)
        avg_irradiation = float(df['IRRADIATION'].mean())
        avg_ambient_temp = float(df['AMBIENT_TEMPERATURE'].mean())
        avg_module_temp = float(df['MODULE_TEMPERATURE'].mean())
        
        # Generate predictions for historical chart & analysis
        df_pred = ml_engine.predict_dataframe(df)
        
        # Sample chart records (last 150 points)
        if len(df_pred) > 150:
            sample_df = df_pred.iloc[-150:].copy()
        else:
            sample_df = df_pred.copy()

        chart_records = sample_df[[
            'DATE_TIME', 'AC_POWER', 'PREDICTED_AC_POWER', 'IRRADIATION', 
            'AMBIENT_TEMPERATURE', 'MODULE_TEMPERATURE', 'DAILY_YIELD', 'TOTAL_YIELD'
        ]].to_dict(orient='records')
        
        # Hourly summary
        hourly_summary = df_pred.groupby('HOUR').agg({
            'AC_POWER': 'mean',
            'PREDICTED_AC_POWER': 'mean',
            'IRRADIATION': 'mean'
        }).reset_index()
        hourly_records = hourly_summary.to_dict(orient='records')

        return {
            "historical_avg_ac_power": round(avg_ac_power, 2),
            "daytime_avg_ac_power": round(daytime_avg_ac_power, 2),
            "max_ac_power": round(max_ac_power, 2),
            "total_records": total_records,
            "avg_irradiation": round(avg_irradiation, 2),
            "avg_ambient_temp": round(avg_ambient_temp, 2),
            "avg_module_temp": round(avg_module_temp, 2),
            "chart_data": chart_records,
            "hourly_data": hourly_records
        }

    def generate_predictions_csv(self, ml_engine: MLEngine) -> pd.DataFrame:
        if not os.path.exists(self.data_path):
            raise FileNotFoundError("Active dataset not found.")
        df = pd.read_csv(self.data_path)
        
        # Generate predictions
        df_pred = ml_engine.predict_dataframe(df)
        
        # Select required columns in exact order
        output_cols = [
            'DATE_TIME', 'AC_POWER', 'PREDICTED_AC_POWER', 'PREDICTION_ERROR',
            'AMBIENT_TEMPERATURE', 'MODULE_TEMPERATURE', 'IRRADIATION',
            'HOUR', 'DAY', 'MONTH', 'DAY_OF_WEEK'
        ]
        
        # Fill any missing columns if custom dataset uploaded
        for col in output_cols:
            if col not in df_pred.columns:
                df_pred[col] = 0.0
                
        return df_pred[output_cols]

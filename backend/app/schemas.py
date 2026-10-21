from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List

class PredictRequest(BaseModel):
    AMBIENT_TEMPERATURE: float = Field(..., example=29.4)
    MODULE_TEMPERATURE: float = Field(..., example=45.2)
    IRRADIATION: float = Field(..., example=850.0)
    HOUR: int = Field(..., ge=0, le=23, example=13)
    DAY: int = Field(..., ge=1, le=31, example=8)
    MONTH: int = Field(..., ge=1, le=12, example=10)
    DAY_OF_WEEK: int = Field(..., ge=0, le=6, example=3)

class ManualPredictionInput(BaseModel):
    ambient_temperature: float
    module_temperature: float
    irradiation: float
    hour: int
    day: int
    month: int
    day_of_week: int

class PredictResponse(BaseModel):
    model_config = {'protected_namespaces': ()}
    
    predicted_ac_power: float
    unit: str = "W"
    prediction_timestamp: str
    model_used: str
    input_conditions: Dict[str, Any]
    data_source_info: Dict[str, str]

class TrainModelResponse(BaseModel):
    status: str
    metrics: Dict[str, Any]

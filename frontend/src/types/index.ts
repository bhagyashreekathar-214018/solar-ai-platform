export interface EnvironmentalData {
  source: string;
  ambient_temperature: number;
  solar_radiation_ghi: number;
  direct_solar_radiation: number;
  diffuse_solar_radiation: number;
  direct_normal_irradiance: number;
  gti: number;
  cloud_cover: number;
  wind_speed: number;
}

export interface HistoricalComparison {
  historical_average_ac_power: number;
  predicted_ac_power: number;
  percentage_difference: number;
  comparison_label: string;
}

export interface DataSourceIndicators {
  environmental_data: string;
  ml_prediction: string;
  historical_training_data: string;
  actual_inverter_data: string;
}

export interface LiveObservationPoint {
  timestamp: string;
  time_short: string;
  irradiation: number;
  ambient_temperature: number;
  module_temperature: number;
  cloud_cover: number;
  predicted_ac_power: number;
}

export interface LiveDataResponse {
  status: string;
  timestamp: string;
  time_short: string;
  environmental_data: EnvironmentalData;
  estimated_module_temperature: number;
  estimation_method: string;
  predicted_ac_power: number;
  predicted_unit: string;
  model_used: string;
  model_r2: number;
  historical_comparison: HistoricalComparison;
  data_source_indicators: DataSourceIndicators;
  live_history: LiveObservationPoint[];
}

export interface ModelPerformanceScore {
  MAE: number;
  RMSE: number;
  R2: number;
}

export interface ModelMetricsResponse {
  metrics: {
    RandomForestRegressor: ModelPerformanceScore;
    LinearRegression: ModelPerformanceScore;
    best_model: string;
    feature_importance: Record<string, number>;
    dataset_rows: number;
    test_samples: number;
  };
  best_model: string;
  feature_importance: Record<string, number>;
  disclaimer: string;
}

export interface HistoricalDataPoint {
  DATE_TIME: string;
  AC_POWER: number;
  PREDICTED_AC_POWER: number;
  IRRADIATION: number;
  AMBIENT_TEMPERATURE: number;
  MODULE_TEMPERATURE: number;
  DAILY_YIELD: number;
  TOTAL_YIELD: number;
}

export interface HourlyDataPoint {
  HOUR: number;
  AC_POWER: number;
  PREDICTED_AC_POWER: number;
  IRRADIATION: number;
}

export interface HistoricalSummaryResponse {
  historical_avg_ac_power: number;
  daytime_avg_ac_power: number;
  max_ac_power: number;
  total_records: number;
  avg_irradiation: number;
  avg_ambient_temp: number;
  avg_module_temp: number;
  chart_data: HistoricalDataPoint[];
  hourly_data: HourlyDataPoint[];
}

export interface ManualPredictionInputs {
  AMBIENT_TEMPERATURE: number;
  MODULE_TEMPERATURE: number;
  IRRADIATION: number;
  HOUR: number;
  DAY: number;
  MONTH: number;
  DAY_OF_WEEK: number;
}

export interface PredictionResponseData {
  predicted_ac_power: number;
  unit: string;
  prediction_timestamp: string;
  model_used: string;
  input_conditions: ManualPredictionInputs;
  data_source_indicators: DataSourceIndicators;
}

export interface DatasetInspection {
  rows: number;
  columns: number;
  column_names: string[];
  missing_values: number;
  duplicate_rows: number;
  has_required_columns: boolean;
  missing_required_columns: string[];
  preview: Record<string, any>[];
}

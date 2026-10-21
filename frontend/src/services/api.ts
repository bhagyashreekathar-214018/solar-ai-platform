import axios from 'axios';
import {
  LiveDataResponse,
  ModelMetricsResponse,
  HistoricalSummaryResponse,
  ManualPredictionInputs,
  PredictionResponseData,
  DatasetInspection,
} from '../types';

// API client with base URL configurable via environment variable (for Vercel deployment)
// Falls back to '/api' for local Vite development proxy
const API_BASE = import.meta.env.VITE_API_URL || '/api';

const client = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  async getHealth() {
    const res = await client.get('/health');
    return res.data;
  },

  async getLiveData(lat = 12.9716, lon = 77.5946): Promise<LiveDataResponse> {
    const res = await client.get<LiveDataResponse>(`/live-data?lat=${lat}&lon=${lon}`);
    return res.data;
  },

  async predictPower(inputs: ManualPredictionInputs): Promise<PredictionResponseData> {
    const res = await client.post<PredictionResponseData>('/predict', inputs);
    return res.data;
  },

  async trainModel() {
    const res = await client.post('/train-model');
    return res.data;
  },

  async getModelMetrics(): Promise<ModelMetricsResponse> {
    const res = await client.get<ModelMetricsResponse>('/model-metrics');
    return res.data;
  },

  async getHistoricalSummary(): Promise<HistoricalSummaryResponse> {
    const res = await client.get<HistoricalSummaryResponse>('/historical-summary');
    return res.data;
  },

  async getDatasetInfo(): Promise<DatasetInspection> {
    const res = await client.get<DatasetInspection>('/dataset-info');
    return res.data;
  },

  async uploadDataset(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await client.post('/upload-dataset', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  getExportPredictionsUrl() {
    const base = client.defaults.baseURL || '/api';
    return `${base.replace(/\/$/, '')}/export-predictions`;
  },
};

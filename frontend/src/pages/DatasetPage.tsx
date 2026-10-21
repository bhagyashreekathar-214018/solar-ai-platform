import React, { useState } from 'react';
import { DatasetInspection } from '../types';
import { apiService } from '../services/api';
import { Database, Upload, Download, Cpu, CheckCircle2, AlertTriangle, FileText, Table } from 'lucide-react';
import { formatNumber } from '../utils/format';

interface DatasetPageProps {
  datasetInfo: DatasetInspection | null;
  onDatasetUpdated: () => void;
}

export const DatasetPage: React.FC<DatasetPageProps> = ({ datasetInfo, onDatasetUpdated }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setUploadMessage(null);
      setErrorMessage(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setUploadMessage(null);
    setErrorMessage(null);

    try {
      const res = await apiService.uploadDataset(selectedFile);
      setUploadMessage(res.message || 'Dataset uploaded and ML model retrained successfully!');
      onDatasetUpdated();
    } catch (err: any) {
      const detail = err.response?.data?.detail || 'Failed to upload CSV dataset.';
      setErrorMessage(detail);
    } finally {
      setIsUploading(false);
    }
  };

  const handleTrainModel = async () => {
    setIsTraining(true);
    setUploadMessage(null);
    setErrorMessage(null);

    try {
      const res = await apiService.trainModel();
      setUploadMessage('ML Models retrained successfully on active dataset!');
      onDatasetUpdated();
    } catch (err: any) {
      setErrorMessage('Failed to train model.');
    } finally {
      setIsTraining(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Historical Dataset & Model Training Pipeline
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Upload custom solar CSV datasets, inspect missing values, trigger machine learning model training, and export predictions.
        </p>
      </div>

      {/* CSV Upload & Action Banner */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Upload Historical CSV Dataset</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Must contain columns: AMBIENT_TEMPERATURE, MODULE_TEMPERATURE, IRRADIATION, HOUR, DAY, MONTH, DAY_OF_WEEK, AC_POWER.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="csv-file-input"
            />
            <label
              htmlFor="csv-file-input"
              className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl cursor-pointer transition-colors border border-slate-300 dark:border-slate-600"
            >
              {selectedFile ? selectedFile.name : 'Choose CSV File'}
            </label>

            <button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center gap-2"
            >
              <Upload className={`w-4 h-4 ${isUploading ? 'animate-bounce' : ''}`} />
              <span>{isUploading ? 'Uploading & Training...' : 'Upload CSV'}</span>
            </button>

            <button
              onClick={handleTrainModel}
              disabled={isTraining}
              className="bg-slate-900 dark:bg-slate-950 hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-md border border-slate-700 active:scale-95 disabled:opacity-50 flex items-center gap-2"
            >
              <Cpu className={`w-4 h-4 text-amber-400 ${isTraining ? 'animate-spin' : ''}`} />
              <span>{isTraining ? 'Training ML Models...' : 'Train ML Model'}</span>
            </button>
          </div>
        </div>

        {uploadMessage && (
          <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{uploadMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="bg-rose-50 dark:bg-rose-950/40 p-3 rounded-xl border border-rose-300 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-200 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Dataset Inspection Metrics */}
      {datasetInfo && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Rows</div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono mt-1">
                {formatNumber(datasetInfo.rows)}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Columns</div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono mt-1">
                {datasetInfo.columns ?? '---'}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Missing Values</div>
              <div className={`text-2xl font-extrabold font-mono mt-1 ${
                (datasetInfo.missing_values ?? 0) > 0 ? 'text-amber-500' : 'text-emerald-500'
              }`}>
                {datasetInfo.missing_values ?? 0}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Duplicate Rows</div>
              <div className={`text-2xl font-extrabold font-mono mt-1 ${
                (datasetInfo.duplicate_rows ?? 0) > 0 ? 'text-rose-500' : 'text-emerald-500'
              }`}>
                {datasetInfo.duplicate_rows ?? 0}
              </div>
            </div>
          </div>

          {/* Download Predictions CSV Action Card */}
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 p-5 rounded-2xl shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-base font-extrabold flex items-center gap-2">
                <FileText className="w-5 h-5 fill-current" /> Download Predictions CSV
              </h4>
              <p className="text-xs text-slate-900 font-medium mt-0.5">
                Generates <code>solar_predictions.csv</code> with columns: DATE_TIME, AC_POWER, PREDICTED_AC_POWER, PREDICTION_ERROR, AMBIENT_TEMPERATURE, MODULE_TEMPERATURE, IRRADIATION, HOUR, DAY, MONTH, DAY_OF_WEEK.
              </p>
            </div>

            <a
              href={apiService.getExportPredictionsUrl()}
              download="solar_predictions.csv"
              className="bg-slate-950 hover:bg-slate-900 text-amber-400 font-extrabold px-5 py-3 rounded-xl text-xs shadow-md transition-all shrink-0 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download solar_predictions.csv</span>
            </a>
          </div>

          {/* Dataset Preview Table */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center gap-2">
              <Table className="w-4 h-4 text-amber-500" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Active Dataset Preview (First 10 Rows)</h4>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 uppercase font-mono border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    {(datasetInfo.column_names || []).map((col) => (
                      <th key={col} className="px-4 py-3 font-semibold whitespace-nowrap">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 font-mono text-slate-700 dark:text-slate-300">
                  {(datasetInfo.preview || []).map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/40">
                      {(datasetInfo.column_names || []).map((col) => (
                        <td key={col} className="px-4 py-2.5 whitespace-nowrap">
                          {row[col] !== undefined ? String(row[col]) : '---'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

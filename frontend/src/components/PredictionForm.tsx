import React, { useState } from 'react';
import { ManualPredictionInputs, PredictionResponseData, LiveDataResponse } from '../types';
import { apiService } from '../services/api';
import { Zap, Sliders, RefreshCw, Sun, Thermometer, Calendar, Clock } from 'lucide-react';
import { PredictionCard } from './PredictionCard';

interface PredictionFormProps {
  liveData?: LiveDataResponse | null;
  onRefreshLive?: () => void;
}

export const PredictionForm: React.FC<PredictionFormProps> = ({
  liveData,
  onRefreshLive,
}) => {
  const [mode, setMode] = useState<'live' | 'manual'>('live');

  // Manual Form Inputs State (Pre-filled with realistic solar values)
  const [manualInputs, setManualInputs] = useState<ManualPredictionInputs>({
    AMBIENT_TEMPERATURE: 29.4,
    MODULE_TEMPERATURE: 48.5,
    IRRADIATION: 850.0,
    HOUR: 13,
    DAY: 15,
    MONTH: 8,
    DAY_OF_WEEK: 3,
  });

  const [manualPredictionResult, setManualPredictionResult] = useState<PredictionResponseData | null>(null);
  const [isPredicting, setIsPredicting] = useState<boolean>(false);

  const handleInputChange = (field: keyof ManualPredictionInputs, val: number) => {
    setManualInputs((prev) => ({
      ...prev,
      [field]: val,
    }));
  };

  const handleManualPredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPredicting(true);
    try {
      const res = await apiService.predictPower(manualInputs);
      setManualPredictionResult(res);
    } catch (err) {
      console.error('Manual prediction failed:', err);
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Mode Selector Tabs */}
      <div className="flex bg-slate-200 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-300 dark:border-slate-700 w-full max-w-md">
        <button
          onClick={() => setMode('live')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
            mode === 'live'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>MODE 1: Live API Prediction</span>
        </button>

        <button
          onClick={() => setMode('manual')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
            mode === 'manual'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>MODE 2: Manual Prediction</span>
        </button>
      </div>

      {/* MODE 1: LIVE API PREDICTION */}
      {mode === 'live' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Real-Time Open-Meteo API Input Vector</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Environmental metrics are automatically fetched from Open-Meteo and piped through the trained Random Forest model.
              </p>
            </div>
            {onRefreshLive && (
              <button
                onClick={onRefreshLive}
                className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 hover:bg-amber-500 hover:text-white text-slate-700 dark:text-slate-200 px-3.5 py-2 rounded-xl text-xs font-bold transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Fetch Latest API Data</span>
              </button>
            )}
          </div>

          {liveData ? (
            <PredictionCard
              predictedPower={liveData.predicted_ac_power}
              unit={liveData.predicted_unit}
              timestamp={liveData.timestamp}
              modelUsed={liveData.model_used}
              irradiation={liveData.environmental_data.solar_radiation_ghi}
              ambientTemp={liveData.environmental_data.ambient_temperature}
              moduleTemp={liveData.estimated_module_temperature}
              hour={parseInt(liveData.time_short.split(':')[0]) || 12}
              estimationMethod={liveData.estimation_method}
            />
          ) : (
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl text-center text-slate-500">
              Fetching live weather API parameters...
            </div>
          )}
        </div>
      )}

      {/* MODE 2: MANUAL PREDICTION FORM */}
      {mode === 'manual' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <form
            onSubmit={handleManualPredict}
            className="lg:col-span-6 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4"
          >
            <div className="border-b border-slate-100 dark:border-slate-700 pb-3">
              <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-amber-500" />
                Manual Feature Parameter Inputs
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Specify custom environmental and temporal conditions to test ML AC Power response.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1 flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-500" /> Solar Irradiation (W/m²)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="1500"
                  value={manualInputs.IRRADIATION}
                  onChange={(e) => handleInputChange('IRRADIATION', parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 font-mono text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1 flex items-center gap-1.5">
                  <Thermometer className="w-3.5 h-3.5 text-sky-500" /> Ambient Temperature (°C)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="-10"
                  max="60"
                  value={manualInputs.AMBIENT_TEMPERATURE}
                  onChange={(e) => handleInputChange('AMBIENT_TEMPERATURE', parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 font-mono text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1 flex items-center gap-1.5">
                  <Thermometer className="w-3.5 h-3.5 text-rose-500" /> Module Temperature (°C)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="-10"
                  max="100"
                  value={manualInputs.MODULE_TEMPERATURE}
                  onChange={(e) => handleInputChange('MODULE_TEMPERATURE', parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 font-mono text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                  required
                />
                <span className="text-[10px] text-slate-400">User Supplied / NOCT Estimate</span>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-purple-500" /> Hour of Day (0-23)
                </label>
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={manualInputs.HOUR}
                  onChange={(e) => handleInputChange('HOUR', parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 font-mono text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-500" /> Day of Month (1-31)
                </label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={manualInputs.DAY}
                  onChange={(e) => handleInputChange('DAY', parseInt(e.target.value) || 1)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 font-mono text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-indigo-500" /> Month (1-12)
                </label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={manualInputs.MONTH}
                  onChange={(e) => handleInputChange('MONTH', parseInt(e.target.value) || 1)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 font-mono text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPredicting}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold py-3 px-4 rounded-xl text-sm shadow-lg shadow-amber-500/20 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <Zap className={`w-4 h-4 ${isPredicting ? 'animate-bounce' : ''}`} />
              <span>{isPredicting ? 'Running Random Forest Model...' : 'Predict AC Power'}</span>
            </button>
          </form>

          <div className="lg:col-span-6 flex flex-col justify-center">
            {manualPredictionResult ? (
              <PredictionCard
                predictedPower={manualPredictionResult.predicted_ac_power}
                unit={manualPredictionResult.unit}
                timestamp={manualPredictionResult.prediction_timestamp}
                modelUsed={manualPredictionResult.model_used}
                irradiation={manualInputs.IRRADIATION}
                ambientTemp={manualInputs.AMBIENT_TEMPERATURE}
                moduleTemp={manualInputs.MODULE_TEMPERATURE}
                hour={manualInputs.HOUR}
                estimationMethod="User-configured manual feature vector"
              />
            ) : (
              <div className="bg-slate-100 dark:bg-slate-800/60 p-8 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-center text-slate-400">
                <Zap className="w-10 h-10 mx-auto text-amber-500/40 mb-2" />
                <h5 className="font-bold text-slate-700 dark:text-slate-300">Ready to Predict</h5>
                <p className="text-xs mt-1">
                  Adjust parameters on the left and click <strong>Predict AC Power</strong> to simulate output under hypothetical solar conditions.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

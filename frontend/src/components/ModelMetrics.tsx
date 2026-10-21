import React from 'react';
import { Award, CheckCircle2, Cpu, BarChart2 } from 'lucide-react';
import { ModelMetricsResponse } from '../types';

interface ModelMetricsProps {
  metricsData?: ModelMetricsResponse | null;
  onRetrain?: () => void;
  isRetraining?: boolean;
}

export const ModelMetrics: React.FC<ModelMetricsProps> = ({
  metricsData,
  onRetrain,
  isRetraining = false,
}) => {
  if (!metricsData || !metricsData.metrics) {
    return (
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 text-center text-slate-500">
        Loading model performance metrics...
      </div>
    );
  }

  const { metrics, best_model, feature_importance } = metricsData;
  const rf = metrics.RandomForestRegressor || { MAE: 0, RMSE: 0, R2: 0 };
  const lr = metrics.LinearRegression || { MAE: 0, RMSE: 0, R2: 0 };

  return (
    <div className="space-y-6">
      {/* Header & Retrain Action */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 text-white p-5 rounded-2xl shadow-lg border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-extrabold tracking-tight">Machine Learning Model Performance</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Supervised Regression Models trained on historical solar irradiance & thermal feature vectors.
          </p>
        </div>

        {onRetrain && (
          <button
            onClick={onRetrain}
            disabled={isRetraining}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-sm transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            <BarChart2 className={`w-4 h-4 ${isRetraining ? 'animate-spin' : ''}`} />
            <span>{isRetraining ? 'Retraining ML Models...' : 'Retrain ML Models'}</span>
          </button>
        )}
      </div>

      {/* Model Cards Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Random Forest Regressor */}
        <div
          className={`relative bg-white dark:bg-slate-800 p-6 rounded-2xl border-2 transition-all ${
            best_model === 'RandomForestRegressor'
              ? 'border-amber-500 shadow-xl shadow-amber-500/10'
              : 'border-slate-200 dark:border-slate-700'
          }`}
        >
          {best_model === 'RandomForestRegressor' && (
            <span className="absolute -top-3.5 right-6 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-extrabold text-xs px-3 py-1 rounded-full shadow-md flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> BEST MODEL
            </span>
          )}

          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">Random Forest Regressor</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Non-linear ensemble trees (n_estimators=100)</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center my-5">
            <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">MAE</div>
              <div className="text-xl font-bold text-slate-900 dark:text-white font-mono mt-1">{rf.MAE}</div>
              <div className="text-[10px] text-slate-400">Watts</div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">RMSE</div>
              <div className="text-xl font-bold text-slate-900 dark:text-white font-mono mt-1">{rf.RMSE}</div>
              <div className="text-[10px] text-slate-400">Watts</div>
            </div>

            <div className="bg-amber-500/10 p-3 rounded-xl border border-amber-500/30">
              <div className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 uppercase">R² Score</div>
              <div className="text-xl font-extrabold text-amber-600 dark:text-amber-400 font-mono mt-1">{rf.R2}</div>
              <div className="text-[10px] text-amber-500 font-medium">Variance Fit</div>
            </div>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 pt-3 border-t border-slate-100 dark:border-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Optimal for complex non-linear solar irradiance & cell temperature interactions.</span>
          </div>
        </div>

        {/* Linear Regression */}
        <div
          className={`relative bg-white dark:bg-slate-800 p-6 rounded-2xl border-2 transition-all ${
            best_model === 'LinearRegression'
              ? 'border-amber-500 shadow-xl shadow-amber-500/10'
              : 'border-slate-200 dark:border-slate-700'
          }`}
        >
          {best_model === 'LinearRegression' && (
            <span className="absolute -top-3.5 right-6 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-extrabold text-xs px-3 py-1 rounded-full shadow-md flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> BEST MODEL
            </span>
          )}

          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
              <BarChart2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">Linear Regression</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Parametric linear baseline model</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center my-5">
            <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">MAE</div>
              <div className="text-xl font-bold text-slate-900 dark:text-white font-mono mt-1">{lr.MAE}</div>
              <div className="text-[10px] text-slate-400">Watts</div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">RMSE</div>
              <div className="text-xl font-bold text-slate-900 dark:text-white font-mono mt-1">{lr.RMSE}</div>
              <div className="text-[10px] text-slate-400">Watts</div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">R² Score</div>
              <div className="text-xl font-bold text-slate-900 dark:text-white font-mono mt-1">{lr.R2}</div>
              <div className="text-[10px] text-slate-400">Variance Fit</div>
            </div>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 pt-3 border-t border-slate-100 dark:border-slate-700">
            <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0" />
            <span>Fast baseline, but limited by assuming strictly linear relationship across temperature ranges.</span>
          </div>
        </div>
      </div>

      {/* Feature Importance Bar Visualization */}
      {feature_importance && Object.keys(feature_importance).length > 0 && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-amber-500" />
            Feature Importance Weight Distribution (Random Forest)
          </h4>

          <div className="space-y-3">
            {Object.entries(feature_importance || {}).map(([feature, val]) => {
              const numVal = Number(val ?? 0);
              return (
                <div key={feature} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-700 dark:text-slate-300 font-semibold">{feature}</span>
                    <span className="text-amber-600 dark:text-amber-400 font-bold">{(numVal * 100).toFixed(2)}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(numVal * 100, 2)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Regression Problem Explanation Box */}
      <div className="bg-amber-50 dark:bg-amber-950/40 p-4 rounded-xl border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200">
        <p className="font-bold mb-1">Regression Evaluation Metrics Note:</p>
        <p>
          AC Power prediction is a continuous numeric regression task. Therefore, evaluation strictly employs <strong>MAE (Mean Absolute Error)</strong>, <strong>RMSE (Root Mean Squared Error)</strong>, and <strong>R² (R-Squared coefficient of determination)</strong>. Classification metrics (Accuracy, Precision, Recall, F1-score) are intentionally excluded as they apply only to discrete classification problems.
        </p>
      </div>
    </div>
  );
};

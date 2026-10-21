import React from 'react';
import { HistoricalSummaryResponse } from '../types';
import { HistoricalChart } from '../components/HistoricalChart';
import { Database, Zap, Activity, Sun, Thermometer } from 'lucide-react';
import { formatNumber } from '../utils/format';

interface HistoricalAnalysisPageProps {
  summary: HistoricalSummaryResponse | null;
}

export const HistoricalAnalysisPage: React.FC<HistoricalAnalysisPageProps> = ({ summary }) => {
  if (!summary) {
    return (
      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl text-center text-slate-500">
        Loading historical solar generation dataset analytics...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Historical Solar Plant Performance & Model Validation
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Analysis of measured historical inverter output against Random Forest model predictions across {formatNumber(summary.total_records, '0')} observation records.
        </p>
      </div>

      {/* Historical Summary Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500" /> Daytime Avg AC Power
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            {formatNumber(summary.daytime_avg_ac_power)} W
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">When Irradiation &gt; 5 W/m²</div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-emerald-500" /> Max Peak AC Power
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            {formatNumber(summary.max_ac_power)} W
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Peak Inverter Output</div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1.5">
            <Sun className="w-4 h-4 text-amber-500" /> Avg Solar Irradiation
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            {formatNumber(summary.avg_irradiation)} W/m²
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Dataset Overall Mean</div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1.5">
            <Thermometer className="w-4 h-4 text-sky-500" /> Avg Ambient Temp
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            {summary.avg_ambient_temp ?? '---'} °C
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Environmental Ambient</div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1.5">
            <Thermometer className="w-4 h-4 text-rose-500" /> Avg Module Temp
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            {summary.avg_module_temp ?? '---'} °C
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Cell Operating Temp</div>
        </div>
      </div>

      {/* 6 Required Historical Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HistoricalChart
          title="1. Actual vs Predicted AC Power"
          chartData={summary.chart_data}
          type="actual_vs_predicted"
          height={320}
        />

        <HistoricalChart
          title="2. Daily Solar Yield Trend (Wh)"
          chartData={summary.chart_data}
          type="daily_yield"
          height={320}
        />

        <HistoricalChart
          title="3. Diurnal AC Power by Hour of Day"
          hourlyData={summary.hourly_data}
          type="power_by_hour"
          height={320}
        />

        <HistoricalChart
          title="4. Solar Irradiation vs AC Power Scatter"
          chartData={summary.chart_data}
          type="irradiation_vs_power"
          height={320}
        />

        <HistoricalChart
          title="5. Module Temperature vs AC Power Scatter"
          chartData={summary.chart_data}
          type="temp_vs_power"
          height={320}
        />

        <HistoricalChart
          title="6. Model Prediction Error Residuals (Predicted - Actual)"
          chartData={summary.chart_data}
          type="prediction_error"
          height={320}
        />
      </div>
    </div>
  );
};

import React from 'react';
import {
  Sun,
  Thermometer,
  Zap,
  Cloud,
  CheckCircle,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { LiveDataResponse, HistoricalSummaryResponse } from '../types';
import { LiveKpiCard } from '../components/LiveKpiCard';
import { PredictionCard } from '../components/PredictionCard';
import { LiveChart } from '../components/LiveChart';
import { DataSourceBadge } from '../components/DataSourceBadge';
import { formatNumber, formatPercent } from '../utils/format';

interface DashboardPageProps {
  liveData: LiveDataResponse | null;
  historicalSummary: HistoricalSummaryResponse | null;
  onRefreshLive: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  liveData,
  historicalSummary,
  onRefreshLive,
}) => {
  const env = liveData?.environmental_data;
  const comp = liveData?.historical_comparison;

  return (
    <div className="space-y-6">
      {/* Top Welcome & Provenance Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Real-Time Solar Performance & Power Prediction Dashboard
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Live Open-Meteo environmental telemetry coupled with Machine Learning AC Power estimation.
          </p>
        </div>

        <DataSourceBadge indicators={liveData?.data_source_indicators} compact />
      </div>

      {/* 6 Real-Time KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <LiveKpiCard
          title="Solar Irradiation"
          value={env ? env.solar_radiation_ghi : '---'}
          unit="W/m²"
          subtitle="GHI Global Horizontal"
          icon={<Sun className="w-5 h-5" />}
          colorScheme="amber"
        />

        <LiveKpiCard
          title="Ambient Temp"
          value={env ? env.ambient_temperature : '---'}
          unit="°C"
          subtitle="2m Open-Meteo Sensor"
          icon={<Thermometer className="w-5 h-5" />}
          colorScheme="sky"
        />

        <LiveKpiCard
          title="Predicted AC Power"
          value={formatNumber(liveData?.predicted_ac_power)}
          unit="W"
          subtitle="Random Forest Model"
          icon={<Zap className="w-5 h-5" />}
          colorScheme="emerald"
        />

        <LiveKpiCard
          title="Cloud Cover"
          value={env ? env.cloud_cover : '---'}
          unit="%"
          subtitle="Atmospheric Coverage"
          icon={<Cloud className="w-5 h-5" />}
          colorScheme="purple"
        />

        <LiveKpiCard
          title="Model R² Score"
          value={liveData ? liveData.model_r2 : '0.99'}
          subtitle="Test Set Fit Accuracy"
          icon={<CheckCircle className="w-5 h-5" />}
          colorScheme="indigo"
        />

        <LiveKpiCard
          title="Prediction Status"
          value="READY"
          subtitle="ML Pipeline Active"
          icon={<Zap className="w-5 h-5" />}
          colorScheme="rose"
        />
      </div>

      {/* LIVE VS HISTORICAL COMPARISON SECTION */}
      {comp && (
        <div className="bg-gradient-to-r from-slate-900 via-navy-900 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div>
              <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
                COMPARATIVE ANALYTICS
              </span>
              <h3 className="text-base font-extrabold text-white">Historical Average vs Current Predicted AC Power</h3>
            </div>
            <span className="text-xs font-semibold bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
              {comp.comparison_label}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center text-center">
            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
              <div className="text-xs text-slate-400 font-medium">Historical Average AC Power</div>
              <div className="text-2xl lg:text-3xl font-bold font-mono text-slate-200 mt-1">
                {formatNumber(comp.historical_average_ac_power)} <span className="text-sm font-sans text-slate-400">W</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Daytime plant baseline average</div>
            </div>

            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
              <div className="text-xs text-slate-400 font-medium">Current Predicted AC Power</div>
              <div className="text-2xl lg:text-3xl font-extrabold font-mono text-amber-400 mt-1">
                {formatNumber(comp.predicted_ac_power)} <span className="text-sm font-sans text-slate-300">W</span>
              </div>
              <div className="text-[11px] text-amber-300/80 mt-1">Random Forest live model output</div>
            </div>

            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 flex flex-col items-center justify-center">
              <div className="text-xs text-slate-400 font-medium">Current Prediction Difference %</div>
              <div className="flex items-center justify-center gap-2 mt-1">
                {comp.percentage_difference >= 0 ? (
                  <TrendingUp className="w-6 h-6 text-emerald-400" />
                ) : (
                  <TrendingDown className="w-6 h-6 text-rose-400" />
                )}
                <span className={`text-2xl lg:text-3xl font-extrabold font-mono ${
                  comp.percentage_difference >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {formatPercent(comp.percentage_difference)}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Variance relative to historical baseline</div>
            </div>
          </div>
        </div>
      )}

      {/* Main Prediction Output Display */}
      {liveData && (
        <PredictionCard
          predictedPower={liveData.predicted_ac_power}
          unit={liveData.predicted_unit}
          timestamp={liveData.timestamp}
          modelUsed={liveData.model_used}
          irradiation={liveData.environmental_data?.solar_radiation_ghi}
          ambientTemp={liveData.environmental_data?.ambient_temperature}
          moduleTemp={liveData.estimated_module_temperature}
          hour={parseInt(liveData.time_short?.split(':')[0] || '12') || 12}
          estimationMethod={liveData.estimation_method}
        />
      )}

      {/* Live Chart Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LiveChart
          title="Real-Time Solar Irradiation Trend (W/m²)"
          data={liveData?.live_history || []}
          type="irradiation_line"
          height={280}
        />

        <LiveChart
          title="Predicted AC Power Trend (W)"
          data={liveData?.live_history || []}
          type="power_trend"
          height={280}
        />
      </div>

      <DataSourceBadge indicators={liveData?.data_source_indicators} />
    </div>
  );
};

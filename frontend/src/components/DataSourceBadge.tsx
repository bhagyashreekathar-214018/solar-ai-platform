import React from 'react';
import { Database, Cloud, Cpu, Radio } from 'lucide-react';
import { DataSourceIndicators } from '../types';

interface DataSourceBadgeProps {
  indicators?: DataSourceIndicators;
  compact?: boolean;
}

export const DataSourceBadge: React.FC<DataSourceBadgeProps> = ({
  indicators = {
    environmental_data: 'Open-Meteo API',
    ml_prediction: 'Random Forest Regression',
    historical_training_data: 'Uploaded Solar Dataset',
    actual_inverter_data: 'Not Connected',
  },
  compact = false,
}) => {
  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-medium">
          <Cloud className="w-3.5 h-3.5" /> Environmental: {indicators.environmental_data}
        </span>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-medium">
          <Cpu className="w-3.5 h-3.5" /> ML: {indicators.ml_prediction}
        </span>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-medium">
          <Radio className="w-3.5 h-3.5" /> Inverter: {indicators.actual_inverter_data}
        </span>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 text-white rounded-xl p-4 shadow-lg border border-slate-800">
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
        <span>Data Source Provenance</span>
        <span className="bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded text-[10px] font-mono">STRICT SEPARATION</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/60 flex items-start gap-2.5">
          <Cloud className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
          <div>
            <div className="text-slate-400 text-[11px]">Environmental Data</div>
            <div className="font-semibold text-slate-100">{indicators.environmental_data}</div>
          </div>
        </div>

        <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/60 flex items-start gap-2.5">
          <Cpu className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
          <div>
            <div className="text-slate-400 text-[11px]">ML Prediction Model</div>
            <div className="font-semibold text-slate-100">{indicators.ml_prediction}</div>
          </div>
        </div>

        <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/60 flex items-start gap-2.5">
          <Database className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
          <div>
            <div className="text-slate-400 text-[11px]">Historical Training Data</div>
            <div className="font-semibold text-slate-100">{indicators.historical_training_data}</div>
          </div>
        </div>

        <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/60 flex items-start gap-2.5">
          <Radio className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
          <div>
            <div className="text-slate-400 text-[11px]">Actual Inverter Sensor</div>
            <div className="font-semibold text-rose-300">{indicators.actual_inverter_data}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

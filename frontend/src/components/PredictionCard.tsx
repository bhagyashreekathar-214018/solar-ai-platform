import React from 'react';
import { Zap, ShieldCheck, Sun, Thermometer, Clock, Info } from 'lucide-react';

interface PredictionCardProps {
  predictedPower: number;
  unit?: string;
  timestamp?: string;
  modelUsed?: string;
  irradiation?: number;
  ambientTemp?: number;
  moduleTemp?: number;
  hour?: number;
  estimationMethod?: string;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({
  predictedPower,
  unit = 'W',
  timestamp,
  modelUsed = 'RandomForestRegressor',
  irradiation = 850,
  ambientTemp = 29.4,
  moduleTemp = 45.2,
  hour = 13,
  estimationMethod = 'Estimated via NOCT model',
}) => {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-navy-950 text-white rounded-2xl p-6 shadow-xl border border-amber-500/30 relative overflow-hidden">
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex items-center justify-between border-b border-slate-700/80 pb-4 mb-5">
        <div className="flex items-center gap-2">
          <div className="bg-amber-500 p-2 rounded-xl text-slate-950">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-wide">Real-Time ML Power Prediction</h3>
            <p className="text-xs text-slate-400">Model: <span className="text-amber-400 font-mono font-medium">{modelUsed}</span></p>
          </div>
        </div>

        {timestamp && (
          <span className="text-xs font-mono bg-slate-800 px-3 py-1 rounded-full text-slate-300 border border-slate-700">
            {timestamp}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Main Predicted AC Power Output Display */}
        <div className="lg:col-span-5 bg-slate-800/80 p-5 rounded-xl border border-amber-500/20 text-center">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-1">
            Predicted AC Power
          </span>
          <div className="text-4xl lg:text-5xl font-extrabold text-amber-400 font-mono tracking-tight my-2">
            {predictedPower.toLocaleString()} <span className="text-2xl text-slate-300 font-sans font-medium">{unit}</span>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-0.5 rounded-full mt-2">
            <ShieldCheck className="w-3.5 h-3.5" /> High Precision Regression
          </span>
        </div>

        {/* Input Conditions Summary */}
        <div className="lg:col-span-7">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
            <span>ML Feature Inputs</span>
            <span className="text-[11px] text-amber-400 font-normal">Mapped from Live API</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700 flex items-center gap-2.5">
              <Sun className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <div className="text-slate-400 text-[11px]">Solar Irradiation</div>
                <div className="font-bold text-white font-mono">{irradiation} W/m²</div>
              </div>
            </div>

            <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700 flex items-center gap-2.5">
              <Thermometer className="w-4 h-4 text-sky-400 shrink-0" />
              <div>
                <div className="text-slate-400 text-[11px]">Ambient Temp</div>
                <div className="font-bold text-white font-mono">{ambientTemp} °C</div>
              </div>
            </div>

            <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700 flex items-center gap-2.5">
              <Thermometer className="w-4 h-4 text-rose-400 shrink-0" />
              <div>
                <div className="text-slate-400 text-[11px]">Module Temp</div>
                <div className="font-bold text-amber-300 font-mono">{moduleTemp} °C</div>
                <div className="text-[10px] text-slate-400 italic">Estimated / User</div>
              </div>
            </div>

            <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700 flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-purple-400 shrink-0" />
              <div>
                <div className="text-slate-400 text-[11px]">Current Hour</div>
                <div className="font-bold text-white font-mono">{hour}:00 HRS</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
        <Info className="w-4 h-4 text-amber-400 shrink-0" />
        <span>
          <strong className="text-slate-300">Important Disclaimer:</strong> Prediction based on current environmental data. Output represents estimated AC power expected under present solar irradiance conditions.
        </span>
      </div>
    </div>
  );
};

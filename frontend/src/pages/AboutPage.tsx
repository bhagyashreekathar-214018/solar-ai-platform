import React from 'react';
import { Sun, Cpu, Database, ShieldAlert, BookOpen, CheckCircle, ArrowRight, Radio } from 'lucide-react';
import { DataSourceBadge } from '../components/DataSourceBadge';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Project Architecture & B.Tech Viva Documentation
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          "AI-Based Solar Panel Performance Analysis and Real-Time AC Power Prediction Using Data Analytics"
        </p>
      </div>

      {/* Title Card */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-slate-950 p-6 rounded-2xl shadow-xl">
        <span className="text-[11px] font-extrabold uppercase tracking-widest bg-slate-950 text-amber-400 px-3 py-1 rounded-full">
          B.TECH CAPSTONE PROJECT
        </span>
        <h3 className="text-xl font-black mt-3">
          AI-Based Solar Panel Performance Analysis and Real-Time AC Power Prediction Using Data Analytics
        </h3>
        <p className="text-xs text-slate-900 font-medium mt-2 leading-relaxed">
          This platform demonstrates real-time solar analytics: Given current solar and environmental conditions fetched dynamically from the <strong>Open-Meteo API</strong>, the trained <strong>Random Forest Regressor</strong> model accurately estimates expected AC power output.
        </p>
      </div>

      {/* System Flow Diagram */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-amber-500" /> End-to-End System Execution Flow
        </h4>

        <div className="bg-slate-900 text-slate-200 p-5 rounded-xl font-mono text-xs overflow-x-auto space-y-3 leading-relaxed border border-slate-800">
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            <span>Historical Solar Dataset</span>
            <ArrowRight className="w-3.5 h-3.5" />
            <span>Data Cleaning</span>
            <ArrowRight className="w-3.5 h-3.5" />
            <span>Feature Engineering</span>
            <ArrowRight className="w-3.5 h-3.5" />
            <span>ML Training</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-400 font-bold pl-4">
            <ArrowRight className="w-3.5 h-3.5" />
            <span>Random Forest Model</span>
            <ArrowRight className="w-3.5 h-3.5" />
            <span>Model Evaluation (MAE, RMSE, R²)</span>
            <ArrowRight className="w-3.5 h-3.5" />
            <span>Save Best Model (Joblib)</span>
          </div>
          <div className="border-t border-slate-800 my-2 pt-2 text-slate-400">
            [REAL-TIME LIVE STREAM]
          </div>
          <div className="flex items-center gap-2 text-sky-400 font-bold">
            <span>Open-Meteo API Data</span>
            <ArrowRight className="w-3.5 h-3.5" />
            <span>Current Environmental Data</span>
            <ArrowRight className="w-3.5 h-3.5" />
            <span>ML Feature Vector</span>
          </div>
          <div className="flex items-center gap-2 text-purple-400 font-bold pl-4">
            <ArrowRight className="w-3.5 h-3.5" />
            <span>ML Prediction Inference</span>
            <ArrowRight className="w-3.5 h-3.5" />
            <span>Predicted Current AC Power</span>
            <ArrowRight className="w-3.5 h-3.5" />
            <span>Real-Time Dashboard</span>
          </div>
        </div>
      </div>

      {/* Feature Engineering & Module Temperature Approximation Formula */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-amber-500" /> ML Feature Vector Schema
          </h4>
          <ul className="text-xs space-y-2 text-slate-600 dark:text-slate-300">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              <span><strong>AMBIENT_TEMPERATURE:</strong> Mapped directly from API 2m temperature (°C)</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              <span><strong>IRRADIATION:</strong> Mapped directly from API GHI shortwave radiation (W/m²)</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              <span><strong>HOUR, DAY, MONTH, DAY_OF_WEEK:</strong> Extracted from current system timestamp</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              <span><strong>MODULE_TEMPERATURE:</strong> Estimated using standard NOCT thermal physics model</span>
            </li>
          </ul>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-500" /> Module Temperature NOCT Approximation Formula
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            When hardware cell temperature sensors are unavailable, module temperature is mathematically approximated via the standard NOCT (Nominal Operating Cell Temperature = 45°C) thermal balance equation:
          </p>
          <div className="bg-slate-100 dark:bg-slate-900 p-3 rounded-xl font-mono text-xs text-amber-600 dark:text-amber-400 font-bold border border-slate-200 dark:border-slate-700">
            T_module = T_ambient + (GHI / 800) * (45 - 20) * [1 / (1 + 0.05 * v_wind)]
          </div>
          <p className="text-[11px] text-slate-400 italic">
            Labelled strictly as "Estimated Module Temperature" — never disguised as direct sensor readings.
          </p>
        </div>
      </div>

      {/* Critical Disclaimers */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
          <ShieldAlert className="w-5 h-5" /> Strict Disclaimers & Sensor Provenance Rules
        </div>
        <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
          <p>
            1. <strong>Weather API Limits:</strong> The external Open-Meteo weather API provides solar irradiance and atmospheric weather data. It does NOT provide inverter output power.
          </p>
          <p>
            2. <strong>Prediction vs Measurement:</strong> All real-time power outputs are explicitly labeled <strong>"Predicted AC Power"</strong>. The term <strong>"Actual AC Power"</strong> is reserved solely for measured inverter/plant sensor dataset records.
          </p>
          <p>
            3. <strong>Regression Task Integrity:</strong> Model evaluation exclusively uses continuous regression metrics (MAE, RMSE, R²). Classification metrics are excluded.
          </p>
        </div>
      </div>

      <DataSourceBadge />
    </div>
  );
};

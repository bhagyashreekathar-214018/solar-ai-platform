import React from 'react';
import { LiveDataResponse } from '../types';
import { PredictionForm } from '../components/PredictionForm';
import { DataSourceBadge } from '../components/DataSourceBadge';

interface PowerPredictionPageProps {
  liveData: LiveDataResponse | null;
  onRefreshLive: () => void;
}

export const PowerPredictionPage: React.FC<PowerPredictionPageProps> = ({
  liveData,
  onRefreshLive,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Real-Time AC Power Prediction Module
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Infers expected AC power generation based on machine learning models trained on historical thermal-radiation solar profiles.
        </p>
      </div>

      <PredictionForm liveData={liveData} onRefreshLive={onRefreshLive} />

      <DataSourceBadge indicators={liveData?.data_source_indicators} />
    </div>
  );
};

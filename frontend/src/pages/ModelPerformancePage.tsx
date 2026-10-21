import React from 'react';
import { ModelMetricsResponse } from '../types';
import { ModelMetrics } from '../components/ModelMetrics';

interface ModelPerformancePageProps {
  metricsData: ModelMetricsResponse | null;
  onRetrain: () => void;
  isRetraining?: boolean;
}

export const ModelPerformancePage: React.FC<ModelPerformancePageProps> = ({
  metricsData,
  onRetrain,
  isRetraining = false,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Machine Learning Model Evaluation & Benchmark
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Comparative empirical evaluation of Random Forest Regressor vs Linear Regression on hold-out test set.
        </p>
      </div>

      <ModelMetrics
        metricsData={metricsData}
        onRetrain={onRetrain}
        isRetraining={isRetraining}
      />
    </div>
  );
};

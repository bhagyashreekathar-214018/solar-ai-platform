import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar, NavTab } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardPage } from './pages/DashboardPage';
import { LiveMonitoringPage } from './pages/LiveMonitoringPage';
import { PowerPredictionPage } from './pages/PowerPredictionPage';
import { HistoricalAnalysisPage } from './pages/HistoricalAnalysisPage';
import { ModelPerformancePage } from './pages/ModelPerformancePage';
import { DatasetPage } from './pages/DatasetPage';
import { AboutPage } from './pages/AboutPage';

import { apiService } from './services/api';
import {
  LiveDataResponse,
  ModelMetricsResponse,
  HistoricalSummaryResponse,
  DatasetInspection,
} from './types';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isDark, setIsDark] = useState<boolean>(false);

  // Core Data States
  const [liveData, setLiveData] = useState<LiveDataResponse | null>(null);
  const [historicalSummary, setHistoricalSummary] = useState<HistoricalSummaryResponse | null>(null);
  const [metricsData, setMetricsData] = useState<ModelMetricsResponse | null>(null);
  const [datasetInfo, setDatasetInfo] = useState<DatasetInspection | null>(null);

  // Loading States
  const [isLiveLoading, setIsLiveLoading] = useState<boolean>(false);
  const [isRetraining, setIsRetraining] = useState<boolean>(false);

  // Dark Mode Toggle Effect
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Fetch Live Weather API & Prediction Data
  const fetchLiveData = useCallback(async () => {
    setIsLiveLoading(true);
    try {
      const data = await apiService.getLiveData();
      setLiveData(data);
    } catch (err) {
      console.error('Error fetching live weather data:', err);
    } finally {
      setIsLiveLoading(false);
    }
  }, []);

  // Fetch Historical Dataset Analytics & Model Metrics
  const fetchAllData = useCallback(async () => {
    try {
      const [hist, metrics, info] = await Promise.all([
        apiService.getHistoricalSummary(),
        apiService.getModelMetrics(),
        apiService.getDatasetInfo(),
      ]);
      setHistoricalSummary(hist);
      setMetricsData(metrics);
      setDatasetInfo(info);
    } catch (err) {
      console.error('Error fetching system data:', err);
    }
  }, []);

  // Initial Mount Effect
  useEffect(() => {
    fetchLiveData();
    fetchAllData();
  }, [fetchLiveData, fetchAllData]);

  // Retrain Trigger Callback
  const handleRetrain = async () => {
    setIsRetraining(true);
    try {
      await apiService.trainModel();
      await fetchAllData();
      await fetchLiveData();
    } catch (err) {
      console.error('Error retraining model:', err);
    } finally {
      setIsRetraining(false);
    }
  };

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardPage
            liveData={liveData}
            historicalSummary={historicalSummary}
            onRefreshLive={fetchLiveData}
          />
        );
      case 'live_monitoring':
        return (
          <LiveMonitoringPage
            liveData={liveData}
            onRefreshLive={fetchLiveData}
            isLoading={isLiveLoading}
          />
        );
      case 'power_prediction':
        return (
          <PowerPredictionPage
            liveData={liveData}
            onRefreshLive={fetchLiveData}
          />
        );
      case 'historical_analysis':
        return (
          <HistoricalAnalysisPage
            summary={historicalSummary}
          />
        );
      case 'model_performance':
        return (
          <ModelPerformancePage
            metricsData={metricsData}
            onRetrain={handleRetrain}
            isRetraining={isRetraining}
          />
        );
      case 'dataset':
        return (
          <DatasetPage
            datasetInfo={datasetInfo}
            onDatasetUpdated={fetchAllData}
          />
        );
      case 'about_project':
        return <AboutPage />;
      default:
        return (
          <DashboardPage
            liveData={liveData}
            historicalSummary={historicalSummary}
            onRefreshLive={fetchLiveData}
          />
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          lastUpdated={liveData?.timestamp}
          onRefresh={fetchLiveData}
          isLoading={isLiveLoading}
          isDark={isDark}
          onToggleDark={() => setIsDark(!isDark)}
        />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {renderActivePage()}
        </main>
      </div>
    </div>
  );
};

export default App;

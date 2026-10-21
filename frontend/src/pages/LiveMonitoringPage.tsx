import React from 'react';
import { Sun, Thermometer, Cloud, Zap, RefreshCw } from 'lucide-react';
import { LiveDataResponse } from '../types';
import { StatusIndicator } from '../components/StatusIndicator';
import { LiveKpiCard } from '../components/LiveKpiCard';
import { LiveChart } from '../components/LiveChart';
import { RefreshButton } from '../components/RefreshButton';
import { formatNumber } from '../utils/format';

interface LiveMonitoringPageProps {
  liveData: LiveDataResponse | null;
  onRefreshLive: () => void;
  isLoading?: boolean;
}

export const LiveMonitoringPage: React.FC<LiveMonitoringPageProps> = ({
  liveData,
  onRefreshLive,
  isLoading = false,
}) => {
  const env = liveData?.environmental_data;

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Live Solar Monitoring</h2>
            <StatusIndicator status="LIVE" lastUpdated={liveData?.timestamp} />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time environmental conditions streamed from Open-Meteo API with instant ML power inferences.
          </p>
        </div>

        <RefreshButton onRefresh={onRefreshLive} isLoading={isLoading} />
      </div>

      {/* Top 4 Key Live Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <LiveKpiCard
          title="Current Solar Irradiation"
          value={env ? env.solar_radiation_ghi : '---'}
          unit="W/m²"
          subtitle="Open-Meteo GHI Radiation"
          icon={<Sun className="w-5 h-5" />}
          colorScheme="amber"
        />

        <LiveKpiCard
          title="Current Ambient Temp"
          value={env ? env.ambient_temperature : '---'}
          unit="°C"
          subtitle="Surface Weather Sensor"
          icon={<Thermometer className="w-5 h-5" />}
          colorScheme="sky"
        />

        <LiveKpiCard
          title="Cloud Cover"
          value={env ? env.cloud_cover : '---'}
          unit="%"
          subtitle="Atmospheric Density"
          icon={<Cloud className="w-5 h-5" />}
          colorScheme="purple"
        />

        <LiveKpiCard
          title="Predicted AC Power"
          value={formatNumber(liveData?.predicted_ac_power)}
          unit="W"
          subtitle="Random Forest Output"
          icon={<Zap className="w-5 h-5" />}
          colorScheme="emerald"
        />
      </div>

      {/* Dedicated Live Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LiveChart
          title="Live Solar Irradiation Trend (W/m²)"
          data={liveData?.live_history || []}
          type="irradiation_line"
          height={320}
        />

        <LiveChart
          title="Live Predicted Power Chart (W)"
          data={liveData?.live_history || []}
          type="power_trend"
          height={320}
        />

        <LiveChart
          title="Solar Irradiation vs Predicted AC Power Scatter"
          data={liveData?.live_history || []}
          type="irradiation_scatter"
          height={300}
        />

        <LiveChart
          title="Temperature vs Predicted AC Power Scatter"
          data={liveData?.live_history || []}
          type="temp_scatter"
          height={300}
        />
      </div>
    </div>
  );
};

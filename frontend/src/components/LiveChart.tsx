import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { LiveObservationPoint } from '../types';

interface LiveChartProps {
  title: string;
  data: LiveObservationPoint[];
  type: 'irradiation_line' | 'power_trend' | 'irradiation_scatter' | 'temp_scatter';
  height?: number;
}

export const LiveChart: React.FC<LiveChartProps> = ({
  title,
  data,
  type,
  height = 300,
}) => {
  const isDark = document.documentElement.classList.contains('dark');
  const gridColor = isDark ? '#334155' : '#e2e8f0';
  const textColor = isDark ? '#94a3b8' : '#64748b';

  const renderChart = (): React.ReactElement => {
    if (!data || data.length === 0) {
      return (
        <div className="h-full flex items-center justify-center text-slate-400 text-xs italic">
          Awaiting real-time API observations... Click "Refresh Live Data".
        </div>
      );
    }

    switch (type) {
      case 'irradiation_line':
        return (
          <AreaChart data={data}>
            <defs>
              <linearGradient id="irradiationGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="time_short" stroke={textColor} tick={{ fontSize: 11 }} />
            <YAxis stroke={textColor} tick={{ fontSize: 11 }} unit=" W/m²" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '12px',
              }}
            />
            <Area
              type="monotone"
              dataKey="irradiation"
              name="Solar Irradiation (W/m²)"
              stroke="#f59e0b"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#irradiationGrad)"
            />
          </AreaChart>
        );

      case 'power_trend':
        return (
          <AreaChart data={data}>
            <defs>
              <linearGradient id="powerGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="time_short" stroke={textColor} tick={{ fontSize: 11 }} />
            <YAxis stroke={textColor} tick={{ fontSize: 11 }} unit=" W" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '12px',
              }}
            />
            <Area
              type="monotone"
              dataKey="predicted_ac_power"
              name="Predicted AC Power (W)"
              stroke="#10b981"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#powerGrad)"
            />
          </AreaChart>
        );

      case 'irradiation_scatter':
        return (
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis
              type="number"
              dataKey="irradiation"
              name="Irradiation"
              unit=" W/m²"
              stroke={textColor}
              tick={{ fontSize: 11 }}
            />
            <YAxis
              type="number"
              dataKey="predicted_ac_power"
              name="Predicted AC Power"
              unit=" W"
              stroke={textColor}
              tick={{ fontSize: 11 }}
            />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '12px',
              }}
            />
            <Scatter
              name="Irradiation vs Predicted Power"
              data={data}
              fill="#f59e0b"
            />
          </ScatterChart>
        );

      case 'temp_scatter':
        return (
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis
              type="number"
              dataKey="ambient_temperature"
              name="Ambient Temperature"
              unit=" °C"
              stroke={textColor}
              tick={{ fontSize: 11 }}
            />
            <YAxis
              type="number"
              dataKey="predicted_ac_power"
              name="Predicted AC Power"
              unit=" W"
              stroke={textColor}
              tick={{ fontSize: 11 }}
            />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '12px',
              }}
            />
            <Scatter
              name="Temperature vs Predicted Power"
              data={data}
              fill="#38bdf8"
            />
          </ScatterChart>
        );

      default:
        return <div />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-700 pb-3">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          {title}
        </h4>
        <span className="text-[11px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-700/60 px-2 py-0.5 rounded">
          {data.length} Observations
        </span>
      </div>

      <div style={{ width: '100%', height: height }}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

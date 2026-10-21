import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { HistoricalDataPoint, HourlyDataPoint } from '../types';

interface HistoricalChartProps {
  title: string;
  chartData?: HistoricalDataPoint[];
  hourlyData?: HourlyDataPoint[];
  type:
    | 'actual_vs_predicted'
    | 'daily_yield'
    | 'power_by_hour'
    | 'irradiation_vs_power'
    | 'temp_vs_power'
    | 'prediction_error';
  height?: number;
}

export const HistoricalChart: React.FC<HistoricalChartProps> = ({
  title,
  chartData = [],
  hourlyData = [],
  type,
  height = 320,
}) => {
  const isDark = document.documentElement.classList.contains('dark');
  const gridColor = isDark ? '#334155' : '#e2e8f0';
  const textColor = isDark ? '#94a3b8' : '#64748b';

  const renderContent = (): React.ReactElement => {
    switch (type) {
      case 'actual_vs_predicted':
        return (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="DATE_TIME" stroke={textColor} tick={false} label={{ value: 'Time Sequence', position: 'insideBottom', offset: -5, fill: textColor, fontSize: 11 }} />
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
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Line
              type="monotone"
              dataKey="AC_POWER"
              name="Actual AC Power (W)"
              stroke="#38bdf8"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="PREDICTED_AC_POWER"
              name="Predicted AC Power (W)"
              stroke="#f59e0b"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
            />
          </LineChart>
        );

      case 'daily_yield':
        return (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="DATE_TIME" stroke={textColor} tick={false} />
            <YAxis stroke={textColor} tick={{ fontSize: 11 }} unit=" Wh" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '12px',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Line
              type="monotone"
              dataKey="DAILY_YIELD"
              name="Daily Solar Yield (Wh)"
              stroke="#10b981"
              strokeWidth={2.5}
              dot={false}
            />
          </LineChart>
        );

      case 'power_by_hour':
        return (
          <BarChart data={hourlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="HOUR" stroke={textColor} tick={{ fontSize: 11 }} unit=":00" />
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
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Bar dataKey="AC_POWER" name="Actual Avg Power (W)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="PREDICTED_AC_POWER" name="Predicted Avg Power (W)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          </BarChart>
        );

      case 'irradiation_vs_power':
        return (
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis type="number" dataKey="IRRADIATION" name="Irradiation" unit=" W/m²" stroke={textColor} tick={{ fontSize: 11 }} />
            <YAxis type="number" dataKey="AC_POWER" name="Actual AC Power" unit=" W" stroke={textColor} tick={{ fontSize: 11 }} />
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
            <Scatter name="Actual Power" data={chartData} fill="#f59e0b" opacity={0.7} />
          </ScatterChart>
        );

      case 'temp_vs_power':
        return (
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis type="number" dataKey="MODULE_TEMPERATURE" name="Module Temp" unit=" °C" stroke={textColor} tick={{ fontSize: 11 }} />
            <YAxis type="number" dataKey="AC_POWER" name="Actual AC Power" unit=" W" stroke={textColor} tick={{ fontSize: 11 }} />
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
            <Scatter name="Module Temp vs AC Power" data={chartData} fill="#ef4444" opacity={0.7} />
          </ScatterChart>
        );

      case 'prediction_error':
        const errorData = chartData.map((d) => ({
          time: d.DATE_TIME,
          error: Math.round(d.PREDICTED_AC_POWER - d.AC_POWER),
        }));
        return (
          <BarChart data={errorData}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="time" stroke={textColor} tick={false} />
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
            <Bar dataKey="error" name="Prediction Error (Predicted - Actual W)" fill="#8b5cf6" radius={[2, 2, 0, 0]} />
          </BarChart>
        );

      default:
        return <div />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-700 pb-3">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
          {title}
        </h4>
        <span className="text-[11px] font-mono text-slate-400">Historical Dataset</span>
      </div>

      <div style={{ width: '100%', height: height }}>
        <ResponsiveContainer width="100%" height="100%">
          {renderContent()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

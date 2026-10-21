import React from 'react';
import { Sun, Moon, MapPin } from 'lucide-react';
import { StatusIndicator } from './StatusIndicator';
import { RefreshButton } from './RefreshButton';

interface HeaderProps {
  lastUpdated?: string;
  onRefresh: () => void;
  isLoading?: boolean;
  isDark: boolean;
  onToggleDark: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lastUpdated,
  onRefresh,
  isLoading = false,
  isDark,
  onToggleDark,
}) => {
  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 sticky top-0 z-20 shadow-sm transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Title & Subtitle */}
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              SOLAR <span className="text-amber-500">AI</span>
            </h2>
            <span className="bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-amber-300 dark:border-amber-700">
              v2.0 Real-Time Platform
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-Time Solar Performance & Power Prediction Architecture
          </p>
        </div>

        {/* Live Status, Location, Dark Mode, Refresh Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <StatusIndicator status="LIVE" lastUpdated={lastUpdated} />

          <div className="hidden lg:flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full text-xs text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <MapPin className="w-3.5 h-3.5 text-amber-500" />
            <span>Bangalore (12.97°N, 77.59°E)</span>
          </div>

          <button
            onClick={onToggleDark}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-amber-500 hover:text-white transition-colors border border-slate-200 dark:border-slate-700"
            title="Toggle Dark/Light Dashboard"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          <RefreshButton onRefresh={onRefresh} isLoading={isLoading} />
        </div>
      </div>
    </header>
  );
};

import React from 'react';
import { Activity } from 'lucide-react';

interface StatusIndicatorProps {
  status?: string;
  lastUpdated?: string;
  showIcon?: boolean;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status = 'LIVE',
  lastUpdated,
  showIcon = true,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-1.5 rounded-full shadow-sm">
      <div className="flex items-center gap-2">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </span>
        <span className="font-extrabold text-xs tracking-wider text-emerald-600 dark:text-emerald-400 uppercase">
          ● {status}
        </span>
      </div>

      {lastUpdated && (
        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 border-l border-slate-200 dark:border-slate-700 pl-3">
          {showIcon && <Activity className="w-3.5 h-3.5 text-amber-500" />}
          <span>Last Updated:</span>
          <span className="font-mono font-medium text-slate-700 dark:text-slate-300">
            {lastUpdated}
          </span>
        </div>
      )}
    </div>
  );
};

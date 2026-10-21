import React, { useState, useEffect } from 'react';
import { RefreshCw, Clock, ToggleLeft, ToggleRight } from 'lucide-react';

interface RefreshButtonProps {
  onRefresh: () => void;
  isLoading?: boolean;
}

export const RefreshButton: React.FC<RefreshButtonProps> = ({
  onRefresh,
  isLoading = false,
}) => {
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(300); // 5 minutes = 300s

  useEffect(() => {
    let timer: any = null;
    if (autoRefresh) {
      timer = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            onRefresh();
            return 300; // Reset to 5 mins
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [autoRefresh, onRefresh]);

  const handleManualRefresh = () => {
    onRefresh();
    setSecondsRemaining(300);
  };

  const formatCountdown = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        onClick={handleManualRefresh}
        disabled={isLoading}
        className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold px-4 py-2 rounded-xl shadow-md shadow-amber-500/20 active:scale-95 transition-all disabled:opacity-50 text-sm"
      >
        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        <span>{isLoading ? 'Fetching API Data...' : 'Refresh Live Data'}</span>
      </button>

      <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
        <button
          onClick={() => setAutoRefresh(!autoRefresh)}
          className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium hover:text-amber-500 transition-colors"
          title="Toggle 5-minute Auto Refresh"
        >
          {autoRefresh ? (
            <ToggleRight className="w-5 h-5 text-emerald-500" />
          ) : (
            <ToggleLeft className="w-5 h-5 text-slate-400" />
          )}
          <span>Auto Refresh (5m)</span>
        </button>

        {autoRefresh && (
          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 border-l border-slate-200 dark:border-slate-700 pl-2">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>Next update in:</span>
            <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
              {formatCountdown(secondsRemaining)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

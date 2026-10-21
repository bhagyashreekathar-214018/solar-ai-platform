import React, { ReactNode } from 'react';

interface LiveKpiCardProps {
  title: string;
  value?: string | number | null;
  unit?: string;
  subtitle?: string;
  icon: ReactNode;
  trend?: string;
  colorScheme?: 'amber' | 'sky' | 'emerald' | 'purple' | 'rose' | 'indigo';
}

export const LiveKpiCard: React.FC<LiveKpiCardProps> = ({
  title,
  value,
  unit,
  subtitle,
  icon,
  trend,
  colorScheme = 'amber',
}) => {
  const colorClasses = {
    amber: {
      bg: 'bg-amber-500/10 dark:bg-amber-500/20',
      text: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-200 dark:border-amber-800/40',
      accentBg: 'bg-amber-500',
    },
    sky: {
      bg: 'bg-sky-500/10 dark:bg-sky-500/20',
      text: 'text-sky-600 dark:text-sky-400',
      border: 'border-sky-200 dark:border-sky-800/40',
      accentBg: 'bg-sky-500',
    },
    emerald: {
      bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
      text: 'text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-200 dark:border-emerald-800/40',
      accentBg: 'bg-emerald-500',
    },
    purple: {
      bg: 'bg-purple-500/10 dark:bg-purple-500/20',
      text: 'text-purple-600 dark:text-purple-400',
      border: 'border-purple-200 dark:border-purple-800/40',
      accentBg: 'bg-purple-500',
    },
    rose: {
      bg: 'bg-rose-500/10 dark:bg-rose-500/20',
      text: 'text-rose-600 dark:text-rose-400',
      border: 'border-rose-200 dark:border-rose-800/40',
      accentBg: 'bg-rose-500',
    },
    indigo: {
      bg: 'bg-indigo-500/10 dark:bg-indigo-500/20',
      text: 'text-indigo-600 dark:text-indigo-400',
      border: 'border-indigo-200 dark:border-indigo-800/40',
      accentBg: 'bg-indigo-500',
    },
  }[colorScheme];

  return (
    <div className={`relative bg-white dark:bg-slate-800 rounded-2xl p-5 border ${colorClasses.border} shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group`}>
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full -mr-8 -mt-8 ${colorClasses.bg} opacity-50 blur-xl group-hover:scale-125 transition-transform duration-300 pointer-events-none`}></div>

      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {title}
          </span>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {value ?? '---'}
            </span>
            {unit && (
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {unit}
              </span>
            )}
          </div>
        </div>

        <div className={`p-3 rounded-xl ${colorClasses.bg} ${colorClasses.text}`}>
          {icon}
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>{subtitle}</span>
          {trend && <span className={`font-semibold ${colorClasses.text}`}>{trend}</span>}
        </div>
      )}
    </div>
  );
};

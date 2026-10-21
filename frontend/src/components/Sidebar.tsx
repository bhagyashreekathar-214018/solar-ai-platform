import React from 'react';
import {
  LayoutDashboard,
  Activity,
  Zap,
  LineChart,
  Cpu,
  Database,
  Info,
  Sun,
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'live_monitoring'
  | 'power_prediction'
  | 'historical_analysis'
  | 'model_performance'
  | 'dataset'
  | 'about_project';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const navItems = [
    { id: 'dashboard' as NavTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'live_monitoring' as NavTab, label: 'Live Monitoring', icon: Activity, badge: 'LIVE' },
    { id: 'power_prediction' as NavTab, label: 'Power Prediction', icon: Zap },
    { id: 'historical_analysis' as NavTab, label: 'Historical Analysis', icon: LineChart },
    { id: 'model_performance' as NavTab, label: 'Model Performance', icon: Cpu },
    { id: 'dataset' as NavTab, label: 'Dataset', icon: Database },
    { id: 'about_project' as NavTab, label: 'About Project', icon: Info },
  ];

  return (
    <aside className="w-64 bg-navy-900 dark:bg-navy-950 text-slate-300 flex flex-col h-screen border-r border-slate-800 shrink-0 sticky top-0">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
        <div className="bg-gradient-to-tr from-amber-500 to-amber-400 p-2.5 rounded-xl text-slate-950 shadow-lg shadow-amber-500/20">
          <Sun className="w-6 h-6 fill-current animate-pulse" />
        </div>
        <div>
          <h1 className="font-extrabold text-lg text-white tracking-wider font-sans">
            SOLAR <span className="text-amber-500">AI</span>
          </h1>
          <p className="text-[10px] text-slate-400 font-mono tracking-tight">
            Real-Time AC Power Analytics
          </p>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest px-3 mb-2">
          Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'hover:bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-slate-950 text-amber-400' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/60 text-[11px] text-slate-400 space-y-1">
        <div className="font-semibold text-slate-300">Open-Meteo + ML Engine</div>
        <div className="flex items-center gap-1.5 text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span>FastAPI Online</span>
        </div>
      </div>
    </aside>
  );
};

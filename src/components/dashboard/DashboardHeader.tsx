import React from 'react';
import { Bell, MessageSquare } from 'lucide-react';
import { cn } from '../../lib/utils';

interface DashboardHeaderProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <>
      <div className="flex items-center justify-between px-2 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-black font-black italic shadow-[0_0_20px_rgba(34,211,238,0.4)] relative">
            M
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-900 animate-pulse"></div>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white italic leading-none">META-CALI</h1>
            <span className="text-[10px] uppercase tracking-[0.4em] text-cyan-500 font-black block mt-1">Tactical Unit OS Terminal</span>
          </div>
        </div>
        <div className="flex gap-4">
          <button className="relative w-12 h-12 ring-1 ring-white/10 rounded-2xl flex items-center justify-center hover:bg-white/5 transition-all text-slate-400 dark:text-slate-500 hover:text-cyan-500 bg-black/20">
            <Bell size={20} />
            <span className="absolute top-3 right-3 w-2 h-2 bg-cyan-500 rounded-full"></span>
          </button>
          <button className="w-12 h-12 ring-1 ring-white/10 rounded-2xl flex items-center justify-center hover:bg-white/5 transition-all text-slate-400 dark:text-slate-500 hover:text-cyan-500 bg-black/20">
            <MessageSquare size={20} />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-center sm:justify-start gap-8 px-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'zaklad', label: 'Monitor' },
            { id: 'osobni', label: 'Operations' },
            { id: 'verejne', label: 'Newsroom' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "text-[10px] font-black uppercase tracking-[0.3em] pb-3 transition-all relative whitespace-nowrap",
                activeTab === tab.id 
                  ? "text-cyan-500 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-cyan-500 after:shadow-[0_0_12px_rgba(34,211,238,0.6)]" 
                  : "text-slate-600 hover:text-white"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

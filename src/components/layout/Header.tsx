import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  isDark: boolean;
  setIsDark: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, isDark, setIsDark }) => {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Monitor';
      case 'explorer': return 'Explorer';
      case 'log': return 'Operation Log';
      case 'stats': return 'Data Analysis';
      case 'profile': return 'Configuration';
      default: return 'Meta-Processing';
    }
  };

  return (
    <header className="mb-8 lg:mb-12 flex justify-between items-start md:items-end">
      <div className="flex-1">
        <div className="flex items-center gap-3 lg:hidden mb-4">
          <h1 className="text-xl font-extrabold tracking-tighter bg-gradient-to-r from-cyan-500 to-purple-600 bg-clip-text text-transparent italic">
            META-CALI
          </h1>
          <span className="text-[8px] uppercase tracking-widest text-[#94a3b8] font-bold border border-white/10 px-1 rounded">v2.4</span>
        </div>
        <h2 className="text-cyan-500 text-[10px] font-extrabold uppercase tracking-[0.3em] mb-2 px-2 py-1 bg-cyan-500/10 border border-cyan-500/20 w-fit rounded-md">Meta-Tactical OS</h2>
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
          {getTabTitle()}
        </h1>
      </div>
      <div className="flex flex-col items-end gap-3">
        <button 
          onClick={() => setIsDark(!isDark)}
          className="p-3 bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl hover:bg-white transition-all shadow-sm"
          title="Toggle theme"
        >
          {isDark ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-purple-600" />}
        </button>
        <div className="hidden md:block glass-card px-4 py-2 border-cyan-500/20">
          <p className="text-[#94a3b8] text-[9px] uppercase font-bold tracking-widest leading-none mb-1">Status</p>
          <div className="flex items-center gap-2 text-cyan-500 text-xs font-black">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span>
            ACTIVE
          </div>
        </div>
      </div>
    </header>
  );
};

import React from 'react';
import { LayoutDashboard, PlusCircle, TrendingUp, BrainCircuit, User } from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'log', label: 'Logovat', icon: PlusCircle },
    { id: 'stats', label: 'Progres', icon: TrendingUp },
    { id: 'ai', label: 'AI Meta-analýza', icon: BrainCircuit },
    { id: 'profile', label: 'Profil', icon: User },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 glass-sidebar flex flex-col pt-8 z-50">
      <div className="px-6 mb-8">
        <h1 id="app-logo" className="text-2xl font-extrabold tracking-tighter bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent italic">
          META-CALI
        </h1>
        <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mt-1">Frosted Edition</p>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group text-sm font-medium",
              activeTab === item.id 
                ? "bg-white/5 text-white border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.02)]" 
                : "text-slate-400 hover:text-white hover:bg-white/5"
            )}
          >
            <item.icon size={18} className={cn(
              "transition-colors",
              activeTab === item.id ? "text-cyan-400" : "text-slate-500 group-hover:text-white"
            )} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl cursor-pointer transition-all group">
          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-white/10 shadow-inner">
            <User size={16} className="text-slate-400" />
          </div>
          <div className="flex-1 overflow-hidden text-left">
            <p className="text-xs font-semibold text-white truncate">Jan Pivonka</p>
            <p className="text-[10px] text-slate-500 truncate uppercase tracking-tighter">Level 14 • Pro</p>
          </div>
        </div>
        <div className="mt-4 text-center">
          <p className="text-[10px] text-slate-500 font-medium">by @PEONY_PRODUCTION</p>
        </div>
      </div>
    </aside>
  );
};

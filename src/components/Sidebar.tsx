import React from 'react';
import { LayoutDashboard, PlusCircle, TrendingUp, BrainCircuit, User, Search, Plus, Compass, Zap, Activity } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Monitor', icon: LayoutDashboard },
    { id: 'explorer', label: 'Explorer', icon: Search },
    { id: 'log', label: 'Vstup', icon: PlusCircle },
    { id: 'stats', label: 'Data', icon: TrendingUp },
    { id: 'ai', label: 'Core', icon: BrainCircuit },
    { id: 'profile', label: 'User', icon: User },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 glass-sidebar flex-col pt-8 z-50 transition-all duration-300">
        <div className="px-8 mb-12">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center text-black font-black italic shadow-[0_0_15px_rgba(34,211,238,0.4)]">
              M
            </div>
            <h1 id="app-logo" className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white italic">
              META-CALI
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[8px] uppercase tracking-[0.4em] text-slate-500 font-black">Tactical Unit OS</span>
            <div className="flex gap-0.5">
              <div className="w-1 h-1 rounded-full bg-cyan-500 animate-pulse"></div>
              <div className="w-1 h-1 rounded-full bg-slate-400"></div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-6 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group text-[10px] font-black uppercase tracking-[0.2em] border border-transparent",
                activeTab === item.id 
                  ? "nav-active" 
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
              )}
            >
              <item.icon size={16} className={cn(
                "transition-all duration-300",
                activeTab === item.id ? "text-cyan-500 scale-110" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-white"
              )} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-8 border-t border-glass-border">
          <div className="flex items-center gap-4 bg-black/5 dark:bg-white/5 p-4 rounded-2xl border border-black/5 dark:border-white/10 hover:border-cyan-500/20 transition-all cursor-pointer group">
            <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-zinc-800 flex items-center justify-center border border-black/5 dark:border-white/10 shadow-inner group-hover:bg-cyan-500/10 transition-colors">
              <User size={18} className="text-slate-500 group-hover:text-cyan-500" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-[10px] font-black text-slate-900 dark:text-white truncate uppercase tracking-tight">Karel Operator</p>
              <p className="text-[8px] text-[#94a3b8] truncate font-black uppercase tracking-widest">Level 24 • ACTIVE</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-8 left-0 right-0 px-6 z-[100] flex items-center justify-between pointer-events-none">
        {/* Main Nav Capsule */}
        <nav className="glass-card flex items-center justify-around gap-2 px-3 py-2 pointer-events-auto h-16 w-[70%] max-w-[280px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-cyan-500/10">
          {[
            { id: 'explorer', icon: Compass },
            { id: 'dashboard', icon: Zap },
            { id: 'stats', icon: Activity },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "relative p-3 rounded-2xl transition-all duration-300 group",
                activeTab === item.id ? "bg-cyan-500/10 text-cyan-500 shadow-[0_0_20px_rgba(34,211,238,0.1)]" : "text-slate-500"
              )}
            >
              <item.icon 
                size={22} 
                className={cn(
                  "transition-transform",
                  activeTab === item.id ? "scale-110" : "scale-90"
                )} 
              />
              {activeTab === item.id && (
                <motion.div 
                  layoutId="mobile-nav-indicator"
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-cyan-500 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)]" 
                />
              )}
            </button>
          ))}
        </nav>

        {/* Floating Action Button (Log) */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setActiveTab('log')}
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-600 text-black flex items-center justify-center shadow-lg shadow-cyan-500/20 pointer-events-auto border border-white/20"
        >
          <Plus size={32} />
        </motion.button>
      </div>
    </>
  );
};

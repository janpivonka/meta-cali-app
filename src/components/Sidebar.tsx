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
    { id: 'log', label: 'Log', icon: PlusCircle },
    { id: 'stats', label: 'Progres', icon: TrendingUp },
    { id: 'ai', label: 'AI', icon: BrainCircuit },
    { id: 'profile', label: 'Profil', icon: User },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 glass-sidebar flex-col pt-8 z-50 transition-all duration-300">
        <div className="px-6 mb-8">
          <h1 id="app-logo" className="text-2xl font-extrabold tracking-tighter bg-gradient-to-r from-cyan-500 to-purple-600 bg-clip-text text-transparent italic">
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
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group text-sm font-medium border border-transparent",
                activeTab === item.id 
                  ? "nav-active" 
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
              )}
            >
              <item.icon size={18} className={cn(
                "transition-colors",
                activeTab === item.id ? "text-cyan-500" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-white"
              )} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-glass-border">
          <div className="text-center">
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">by @PEONY_PRODUCTION</p>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm glass-card h-16 flex items-center justify-around px-2 z-[60] shadow-2xl">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "flex flex-col items-center justify-center gap-1 transition-all duration-300 relative px-3 py-1 rounded-xl",
              activeTab === item.id ? "text-cyan-500" : "text-slate-400"
            )}
          >
            <item.icon size={20} className={cn(
              "transition-transform",
              activeTab === item.id ? "scale-110" : "scale-90"
            )} />
            <span className="text-[9px] font-bold uppercase tracking-tighter">{item.label}</span>
            {activeTab === item.id && (
              <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-cyan-500 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
            )}
          </button>
        ))}
      </nav>
    </>
  );
};

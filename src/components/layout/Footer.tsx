import React from 'react';
import { Twitter, Instagram, Github } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 pt-8 border-t border-black/5 dark:border-white/5 pb-10 flex flex-col md:flex-row justify-between items-center gap-6 opacity-40 hover:opacity-100 transition-opacity relative z-10">
      <div className="flex items-center gap-6">
        <span className="text-[10px] text-[#94a3b8] font-black uppercase tracking-widest hidden lg:inline">System-Status: Optimal</span>
        <div className="flex gap-4">
          <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors"><Twitter size={18} /></a>
          <a href="#" className="text-slate-400 hover:text-purple-400 transition-colors"><Instagram size={18} /></a>
          <a href="#" className="text-slate-400 hover:text-white transition-colors"><Github size={18} /></a>
        </div>
      </div>
      <div className="text-center md:text-right">
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">
          by @PEONY_PRODUCTION
        </p>
        <p className="text-[10px] text-slate-400 dark:text-slate-700 mt-1 uppercase tracking-tighter font-black">
          &copy; 2026 Meta-Cali Platform • Protocol-X Ready
        </p>
      </div>
    </footer>
  );
};

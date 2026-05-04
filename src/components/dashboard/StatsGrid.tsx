import React from 'react';
import { Flame, Zap, Target } from 'lucide-react';

interface StatsGridProps {
  streak: number;
  totalSets: number;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ streak, totalSets }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="glass-card p-8 bg-white/5 border-white/5 flex items-center gap-6 group hover:border-orange-500/20 transition-all rounded-[32px]">
        <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
          <Flame size={32} fill="currentColor" />
        </div>
        <div>
          <span className="text-4xl font-black text-white italic leading-none">{streak}</span>
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mt-1">Daily Streak</p>
        </div>
      </div>

      <div className="glass-card p-8 bg-white/5 border-white/5 flex items-center gap-6 group hover:border-purple-500/20 transition-all rounded-[32px]">
        <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
          <Zap size={32} />
        </div>
        <div>
          <span className="text-4xl font-black text-white italic leading-none">{totalSets}</span>
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mt-1">Total Sets</p>
        </div>
      </div>

      <div className="glass-card p-8 bg-white/5 border-white/5 flex items-center gap-6 group hover:border-cyan-500/20 transition-all rounded-[32px]">
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-500 group-hover:scale-110 transition-transform">
          <Target size={32} />
        </div>
        <div>
          <span className="text-4xl font-black text-white italic leading-none">12%</span>
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mt-1">Module Progress</p>
        </div>
      </div>
    </div>
  );
};
